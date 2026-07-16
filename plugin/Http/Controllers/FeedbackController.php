<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Http\Auth;
use Markaroo\Repositories\FeedbackRepository;
use Markaroo\Repositories\ReplyRepository;
use Markaroo\Support\Cache;
use Markaroo\Support\Capabilities;
use Markaroo\Support\Status;
use Markaroo\Support\UserAgent;

defined( 'ABSPATH' ) || exit;

class FeedbackController {

	// -----------------------------------------------------------------------
	// GET /feedback
	// -----------------------------------------------------------------------

	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$repo = new FeedbackRepository();

		$args             = self::list_args_from_request( $request );
		$args['per_page'] = absint( $request->get_param( 'per_page' ) ?? 20 );
		$args['page']     = absint( $request->get_param( 'page' ) ?? 1 );
		$args['fields']   = 'summary';

		$result = $repo->list( $args );

		// Prime the attachment post + meta caches in two queries so the per-row
		// wp_get_attachment_url() calls in format_item() don't each hit the DB.
		$screenshot_ids = array_filter( array_map( static fn( $row ) => (int) ( $row->screenshot_id ?? 0 ), $result['items'] ) );
		if ( ! empty( $screenshot_ids ) ) {
			_prime_post_caches( array_values( array_unique( $screenshot_ids ) ), false, true );
		}

		return rest_ensure_response(
			array(
				'data' => array_map( array( __CLASS__, 'format_item' ), $result['items'] ),
				'meta' => array(
					'total'    => $result['total'],
					'pages'    => $result['pages'],
					'page'     => absint( $request->get_param( 'page' ) ?? 1 ),
					'per_page' => absint( $request->get_param( 'per_page' ) ?? 20 ),
				),
			)
		);
	}

	// -----------------------------------------------------------------------
	// POST /feedback
	// -----------------------------------------------------------------------

	public static function create( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$user      = wp_get_current_user();
		$ua_raw    = sanitize_text_field( wp_strip_all_tags( $request->get_param( 'user_agent' ) ?? ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$ua_data   = UserAgent::parse( $ua_raw );
		$req_key   = sanitize_text_field( $request->get_param( 'page_key' ) ?? '' );
		$forced_key = Auth::share_page_key( $request );

		// Page-scoped share: reject if guest tries to post to a different page.
		if ( null !== $forced_key && $req_key !== $forced_key ) {
			return new \WP_Error(
				'markaroo_forbidden',
				__( 'This share link is restricted to a specific page.', 'markaroo' ),
				array( 'status' => 403 )
			);
		}

		$data = array(
			'page_key'         => $req_key,
			'page_url'         => esc_url_raw( $request->get_param( 'page_url' ) ?? '' ),
			'comment'          => wp_kses_post( $request->get_param( 'comment' ) ?? '' ),
			'title'            => sanitize_text_field( $request->get_param( 'title' ) ?? '' ),
			'priority'         => self::valid_priority( $request->get_param( 'priority' ) ),
			'assigned_to_id'   => absint( $request->get_param( 'assigned_to_id' ) ?? 0 ),
			'assigned_to_name' => sanitize_text_field( $request->get_param( 'assigned_to_name' ) ?? '' ),
			'x'                => (float) ( $request->get_param( 'x' ) ?? 0 ),
			'y'                => (float) ( $request->get_param( 'y' ) ?? 0 ),
			'viewport'         => sanitize_text_field( $request->get_param( 'viewport' ) ?? '' ),
			'screenshot_rect'  => self::sanitize_json_param( $request->get_param( 'screenshot_rect' ) ),
			'author'           => $user->ID ? sanitize_text_field( $user->display_name ) : sanitize_text_field( $request->get_param( 'author' ) ?? __( 'Guest', 'markaroo' ) ),
			'author_id'        => (int) $user->ID,
			'due_date'         => self::sanitize_datetime( $request->get_param( 'due_date' ) ),
			'tags'             => self::sanitize_json_param( $request->get_param( 'tags' ) ),
			'share_id'         => Auth::share_id( $request ),
			'user_agent'       => $ua_raw,
			'os'               => $ua_data['os'],
			'browser'          => $ua_data['browser'],
		);

		$id = ( new FeedbackRepository() )->create( $data );

		if ( ! $id ) {
			return new \WP_Error( 'markaroo_create_failed', __( 'Could not create feedback.', 'markaroo' ), array( 'status' => 500 ) );
		}

		// Store the cropped "Pinned content" screenshot sent as a base64 data URL,
		// so screenshot_url is available in this same response (no second request).
		$screenshot = $request->get_param( 'screenshot' );
		if ( is_string( $screenshot ) && '' !== $screenshot ) {
			$shot_result = ScreenshotController::store_data_url( $id, $screenshot );

			if ( is_wp_error( $shot_result ) ) {
				/**
				 * Fires when a screenshot could not be stored during feedback
				 * creation. Creation still succeeds without the screenshot.
				 *
				 * @param int       $id          The feedback row ID.
				 * @param \WP_Error $shot_result The storage error.
				 */
				do_action( 'markaroo/screenshot/failed', $id, $shot_result );
			}
		}

		$feedback = ( new FeedbackRepository() )->find( $id );

		/**
		 * Fires after a new feedback item is created.
		 *
		 * @param object           $feedback The new feedback row.
		 * @param \WP_REST_Request $request  The REST request.
		 */
		do_action( 'markaroo/feedback/created', $feedback, $request );
		Cache::forget( array( 'counts_global', 'counts_page_' . md5( $feedback->page_key ?? '' ) ) );

		$response = rest_ensure_response( self::format_item( $feedback ) );
		$response->set_status( 201 );

		return $response;
	}

	// -----------------------------------------------------------------------
	// GET /feedback/{id}
	// -----------------------------------------------------------------------

	public static function show( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$feedback = ( new FeedbackRepository() )->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		// Page-scoped share: guest cannot read feedback from another page.
		$forced_key = Auth::share_page_key( $request );
		if ( null !== $forced_key && $feedback->page_key !== $forced_key ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$item    = self::format_item( $feedback );
		$replies = ( new ReplyRepository() )->list( (int) $request['id'] );

		$item['replies'] = array_map( array( __CLASS__, 'format_reply' ), $replies );

		return rest_ensure_response( $item );
	}

	// -----------------------------------------------------------------------
	// PATCH /feedback/{id}
	// -----------------------------------------------------------------------

	public static function update( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_edit( (int) $feedback->author_id ) ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot edit this feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		// Approved items are locked from edits unless the user can re-approve.
		if ( \Markaroo\Support\Status::APPROVED === ( $feedback->status ?? '' ) && ! wp_markaroo_can_approve() ) {
			return new \WP_Error( 'markaroo_locked', __( 'This item is approved and locked from edits.', 'markaroo' ), array( 'status' => 423 ) );
		}

		// Whitelist of editable fields.
		$allowed = array( 'title', 'comment', 'priority', 'assigned_to_id', 'assigned_to_name', 'due_date', 'tags', 'x', 'y', 'screenshot_rect' );
		$changes = array();

		foreach ( $allowed as $field ) {
			if ( null === $request->get_param( $field ) ) {
				continue;
			}

			switch ( $field ) {
				case 'title':
					$changes['title'] = sanitize_text_field( $request->get_param( 'title' ) );
					break;
				case 'comment':
					$changes['comment'] = wp_kses_post( $request->get_param( 'comment' ) );
					break;
				case 'priority':
					$changes['priority'] = self::valid_priority( $request->get_param( 'priority' ) );
					break;
				case 'assigned_to_id':
					$changes['assigned_to_id'] = absint( $request->get_param( 'assigned_to_id' ) );
					break;
				case 'assigned_to_name':
					$changes['assigned_to_name'] = sanitize_text_field( $request->get_param( 'assigned_to_name' ) );
					break;
				case 'due_date':
					$changes['due_date'] = self::sanitize_datetime( $request->get_param( 'due_date' ) );
					break;
				case 'tags':
				case 'screenshot_rect':
					$changes[ $field ] = self::sanitize_json_param( $request->get_param( $field ) );
					break;
				case 'x':
				case 'y':
					$changes[ $field ] = (float) $request->get_param( $field );
					break;
			}
		}

		$repo->update( (int) $request['id'], $changes );

		$updated = $repo->find( (int) $request['id'] );

		/**
		 * Fires after a feedback item is updated.
		 *
		 * @param object $updated The updated feedback row.
		 * @param array  $changes The changed fields.
		 */
		do_action( 'markaroo/feedback/updated', $updated, $changes );

		// Fire specific assignment action when assignee changed.
		if ( isset( $changes['assigned_to_id'] ) ) {
			/**
			 * Fires when a feedback item is assigned to a user.
			 *
			 * @param object $updated  The updated feedback row.
			 * @param int    $user_id  The assigned user ID (0 = unassigned).
			 */
			do_action( 'markaroo/feedback/assigned', $updated, (int) $changes['assigned_to_id'] );
		}

		Cache::forget( array( 'counts_global', 'counts_page_' . md5( $updated->page_key ?? '' ) ) );

		return rest_ensure_response( self::format_item( $updated ) );
	}

	// -----------------------------------------------------------------------
	// DELETE /feedback/{id}
	// -----------------------------------------------------------------------

	public static function destroy( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_delete( (int) $feedback->author_id ) ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot delete this feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$repo->delete( (int) $request['id'] );

		/**
		 * Fires after a feedback item is deleted.
		 *
		 * @param int    $id       The deleted feedback ID.
		 * @param object $feedback The feedback row snapshot before deletion.
		 */
		do_action( 'markaroo/feedback/deleted', (int) $request['id'], $feedback );
		Cache::forget( array( 'counts_global', 'counts_page_' . md5( $feedback->page_key ?? '' ) ) );

		return rest_ensure_response( array( 'deleted' => true ) );
	}

	// -----------------------------------------------------------------------
	// POST /feedback/{id}/resolve
	// -----------------------------------------------------------------------

	public static function resolve( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_resolve() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot resolve this feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$old_status = $feedback->status ?? 'open';
		$repo->resolve( (int) $request['id'] );
		$updated = $repo->find( (int) $request['id'] );

		\Markaroo\Support\Status::changed( (int) $request['id'], $old_status, 'resolved' );

		/** @param object $updated The resolved feedback row. */
		do_action( 'markaroo/feedback/resolved', $updated );
		Cache::forget( array( 'counts_global', 'counts_page_' . md5( $updated->page_key ?? '' ) ) );

		return rest_ensure_response( self::format_item( $updated ) );
	}

	// -----------------------------------------------------------------------
	// POST /feedback/{id}/unresolve
	// -----------------------------------------------------------------------

	public static function unresolve( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_resolve() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot unresolve this feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$old_status = $feedback->status ?? 'resolved';
		$repo->unresolve( (int) $request['id'] );
		$updated = $repo->find( (int) $request['id'] );

		\Markaroo\Support\Status::changed( (int) $request['id'], $old_status, 'open' );

		/** @param object $updated The unresolved feedback row. */
		do_action( 'markaroo/feedback/unresolved', $updated );
		Cache::forget( array( 'counts_global', 'counts_page_' . md5( $updated->page_key ?? '' ) ) );

		return rest_ensure_response( self::format_item( $updated ) );
	}

	// -----------------------------------------------------------------------
	// POST /feedback/{id}/status
	// -----------------------------------------------------------------------

	public static function set_status( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$new = sanitize_text_field( $request->get_param( 'status' ) ?? '' );

		if ( ! \Markaroo\Support\Status::is_valid( $new ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'Unknown status.', 'markaroo' ), array( 'status' => 400 ) );
		}

		if ( ! self::can_set_status( $new ) ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot set this status.', 'markaroo' ), array( 'status' => 403 ) );
		}

		return self::apply_status( $repo, $feedback, $new );
	}

	// -----------------------------------------------------------------------
	// POST /feedback/{id}/approve
	// -----------------------------------------------------------------------

	public static function approve( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_approve() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot approve feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$response = self::apply_status( $repo, $feedback, \Markaroo\Support\Status::APPROVED );

		/** @param object $feedback The approved feedback row. */
		do_action( 'markaroo/feedback/approved', $repo->find( (int) $request['id'] ) );

		return $response;
	}

	// -----------------------------------------------------------------------
	// POST /feedback/{id}/reopen
	// -----------------------------------------------------------------------

	public static function reopen( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo     = new FeedbackRepository();
		$feedback = $repo->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_create() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot reopen feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		return self::apply_status( $repo, $feedback, \Markaroo\Support\Status::REOPENED );
	}

	/**
	 * Persist a status change, fire the canonical action, bust caches.
	 */
	private static function apply_status( FeedbackRepository $repo, object $feedback, string $new ): \WP_REST_Response {
		$old = $feedback->status ?? 'open';
		$repo->set_status( (int) $feedback->id, $new );
		$updated = $repo->find( (int) $feedback->id );

		\Markaroo\Support\Status::changed( (int) $feedback->id, $old, $new );
		Cache::forget( array( 'counts_global', 'counts_page_' . md5( $updated->page_key ?? '' ) ) );

		return rest_ensure_response( self::format_item( $updated ) );
	}

	/**
	 * Capability gate per target status.
	 */
	private static function can_set_status( string $status ): bool {
		switch ( $status ) {
			case \Markaroo\Support\Status::APPROVED:
				return wp_markaroo_can_approve();
			case \Markaroo\Support\Status::REOPENED:
				return wp_markaroo_can_create();
			default:
				return wp_markaroo_can_resolve();
		}
	}

	// -----------------------------------------------------------------------
	// POST /feedback/{id}/replies
	// -----------------------------------------------------------------------

	public static function add_reply( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$feedback = ( new FeedbackRepository() )->find( (int) $request['id'] );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$user = wp_get_current_user();
		$data = array(
			'feedback_id' => (int) $request['id'],
			'reply_uuid'  => sanitize_text_field( $request->get_param( 'reply_uuid' ) ?? wp_generate_uuid4() ),
			'comment'     => wp_kses_post( $request->get_param( 'comment' ) ?? '' ),
			'author'      => $user->ID ? sanitize_text_field( $user->display_name ) : sanitize_text_field( $request->get_param( 'author' ) ?? __( 'Guest', 'markaroo' ) ),
			'author_id'   => (int) $user->ID,
		);

		if ( empty( $data['comment'] ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'Reply comment is required.', 'markaroo' ), array( 'status' => 400 ) );
		}

		$id = ( new ReplyRepository() )->create( $data );

		if ( ! $id ) {
			return new \WP_Error( 'markaroo_create_failed', __( 'Could not create reply.', 'markaroo' ), array( 'status' => 500 ) );
		}

		$reply = ( new ReplyRepository() )->find( $id );

		/**
		 * Fires after a reply is created.
		 *
		 * @param object $reply    The new reply row.
		 * @param object $feedback The parent feedback row.
		 */
		do_action( 'markaroo/reply/created', $reply, $feedback );

		// Parse @mentions and notify mentioned users.
		$raw_comment = $request->get_param( 'comment' ) ?? '';
		preg_match_all( '/\B@([\w.\-]+)/u', $raw_comment, $matches );
		if ( ! empty( $matches[1] ) ) {
			$mentioned_ids = self::resolve_mention_ids( array_unique( $matches[1] ) );
			if ( ! empty( $mentioned_ids ) ) {
				/**
				 * Fires when users are @mentioned in a reply.
				 *
				 * @param int[]  $mentioned_ids WP user IDs of mentioned users.
				 * @param array  $context       Reply and feedback context.
				 */
				do_action(
					'markaroo/mention',
					$mentioned_ids,
					array(
						'comment'  => $raw_comment,
						'reply'    => (array) $reply,
						'feedback' => (array) $feedback,
					)
				);
			}
		}

		$response = rest_ensure_response( self::format_reply( $reply ) );
		$response->set_status( 201 );

		return $response;
	}

	// -----------------------------------------------------------------------
	// POST /feedback/bulk
	// -----------------------------------------------------------------------

	/**
	 * Apply one change set (or delete) to many feedback rows in a single query.
	 */
	public static function bulk( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		if ( ! Capabilities::can_manage() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot perform bulk actions.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$ids = array_values( array_filter( array_map( 'absint', (array) $request->get_param( 'ids' ) ) ) );

		if ( empty( $ids ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'No feedback IDs provided.', 'markaroo' ), array( 'status' => 400 ) );
		}

		/**
		 * Filters the maximum number of items a single bulk action may touch.
		 *
		 * @param int $max Default 200.
		 */
		$max = (int) apply_filters( 'markaroo/feedback/bulk_max', 200 );

		if ( count( $ids ) > $max ) {
			return new \WP_Error(
				'markaroo_too_many',
				/* translators: %d: maximum number of items per bulk action. */
				sprintf( __( 'Too many items selected; the limit is %d per bulk action.', 'markaroo' ), $max ),
				array( 'status' => 400 )
			);
		}

		$repo      = new FeedbackRepository();
		$page_keys = $repo->page_keys_for_ids( $ids );
		$is_delete = (bool) $request->get_param( 'delete' );

		if ( $is_delete ) {
			$affected = $repo->bulk_delete( $ids );
			$changes  = array( 'deleted' => true );
		} else {
			$changes = self::sanitize_bulk_changes( $request, $ids );

			if ( empty( $changes ) ) {
				return new \WP_Error( 'markaroo_invalid', __( 'No changes provided.', 'markaroo' ), array( 'status' => 400 ) );
			}

			$affected = $repo->bulk_update( $ids, $changes );
		}

		// Bust the affected page caches (plus global) exactly once.
		self::bust_page_key_caches( $page_keys );

		/**
		 * Fires after a bulk feedback mutation succeeds.
		 * Pro plugins hook this to mirror changes to external PM tools.
		 *
		 * @param int[] $ids     The affected feedback IDs.
		 * @param array $changes The applied change set (or ['deleted' => true]).
		 */
		do_action( 'markaroo/feedback/bulk_updated', $ids, $changes );

		return rest_ensure_response(
			array(
				'updated' => $affected,
				'ids'     => $ids,
				'changes' => $changes,
			)
		);
	}

	// -----------------------------------------------------------------------
	// GET /feedback/export  (CSV stream)
	// -----------------------------------------------------------------------

	/**
	 * Stream the current filtered feedback list as CSV in 500-row chunks using
	 * the summary field mode. Longtext columns are excluded by default.
	 */
	public static function export( \WP_REST_Request $request ) {
		if ( ! Capabilities::can_manage() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot export feedback.', 'markaroo' ), array( 'status' => 403 ) );
		}

		/**
		 * Filters the columns included in the CSV export. Longtext columns
		 * (page_url, screenshot_rect, attachments, user_agent) are excluded.
		 *
		 * @param string[] $columns Column keys from the formatted item.
		 */
		$columns = (array) apply_filters(
			'markaroo/export/columns',
			array( 'id', 'title', 'comment', 'status', 'priority', 'assigned_to_name', 'author', 'page_key', 'due_date', 'created_at', 'updated_at' )
		);

		$args = self::list_args_from_request( $request );

		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="markaroo-feedback-' . gmdate( 'Ymd-His' ) . '.csv"' );

		$out = fopen( 'php://output', 'w' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
		fputcsv( $out, $columns );

		$repo  = new FeedbackRepository();
		$page  = 1;
		$count = 0;

		do {
			$args['per_page'] = 500;
			$args['page']     = $page;
			$args['fields']   = 'summary';

			$result = $repo->list( $args, 'export' );

			foreach ( $result['items'] as $row ) {
				$item = self::format_item( $row );
				$line = array();

				foreach ( $columns as $col ) {
					$val = $item[ $col ] ?? '';
					if ( is_array( $val ) ) {
						$val = implode( ', ', array_map( 'strval', $val ) );
					}
					$line[] = (string) $val;
				}

				fputcsv( $out, $line );
				++$count;
			}

			++$page;
		} while ( ! empty( $result['items'] ) && $count < (int) $result['total'] );

		fclose( $out ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose

		/**
		 * Fires after a CSV export finishes streaming.
		 *
		 * @param int $count Rows written (excluding the header row).
		 */
		do_action( 'markaroo/export/completed', $count );

		exit;
	}

	// -----------------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------------

	/**
	 * Build the shared list()/export() filter args from a REST request,
	 * honoring a page-scoped share's forced page_key.
	 *
	 * @return array<string, mixed>
	 */
	private static function list_args_from_request( \WP_REST_Request $request ): array {
		$forced_key   = Auth::share_page_key( $request );
		$req_page_key = sanitize_text_field( $request->get_param( 'page_key' ) ?? '' );

		return array(
			'page_key' => $forced_key ?? $req_page_key,
			'status'   => sanitize_text_field( $request->get_param( 'status' ) ?? '' ),
			'priority' => sanitize_text_field( $request->get_param( 'priority' ) ?? '' ),
			'assignee' => absint( $request->get_param( 'assigned_to' ) ?? 0 ),
			'tag'      => sanitize_text_field( $request->get_param( 'tag' ) ?? '' ),
			'search'   => sanitize_text_field( $request->get_param( 'search' ) ?? '' ),
			'order_by' => sanitize_text_field( $request->get_param( 'order_by' ) ?? 'created_at' ),
			'order'    => sanitize_text_field( $request->get_param( 'order' ) ?? 'DESC' ),
		);
	}

	/**
	 * Sanitize and validate the change set for a bulk update, then let Pro
	 * filter it. Only known columns survive.
	 *
	 * @param int[] $ids The target IDs (passed to the filter for context).
	 * @return array<string, mixed>
	 */
	private static function sanitize_bulk_changes( \WP_REST_Request $request, array $ids ): array {
		$changes = array();

		$status = $request->get_param( 'status' );
		if ( null !== $status ) {
			$status = sanitize_text_field( $status );
			if ( Status::is_valid( $status ) ) {
				$changes['status'] = $status;
			}
		}

		$priority = $request->get_param( 'priority' );
		if ( null !== $priority ) {
			$changes['priority'] = self::valid_priority( $priority );
		}

		$assignee = $request->get_param( 'assigned_to_id' );
		if ( null !== $assignee ) {
			$changes['assigned_to_id']   = absint( $assignee );
			$changes['assigned_to_name'] = sanitize_text_field( $request->get_param( 'assigned_to_name' ) ?? '' );
		}

		$tags = $request->get_param( 'tags' );
		if ( null !== $tags ) {
			$decoded          = is_array( $tags ) ? $tags : json_decode( (string) $tags, true );
			$changes['tags']  = is_array( $decoded ) ? array_values( array_map( 'sanitize_text_field', $decoded ) ) : array();
		}

		$due = $request->get_param( 'due_date' );
		if ( null !== $due ) {
			$changes['due_date'] = self::sanitize_datetime( $due );
		}

		/**
		 * Filters the sanitized bulk change set before it is written.
		 *
		 * @param array $changes Column => value pairs.
		 * @param int[] $ids     The target feedback IDs.
		 */
		return (array) apply_filters( 'markaroo/feedback/bulk_changes', $changes, $ids );
	}

	/**
	 * Bust the global counts cache plus the per-page counts cache for each key.
	 *
	 * @param string[] $page_keys Distinct page keys affected.
	 */
	private static function bust_page_key_caches( array $page_keys ): void {
		$keys = array( 'counts_global' );

		foreach ( $page_keys as $pk ) {
			$keys[] = 'counts_page_' . md5( (string) $pk );
		}

		Cache::forget( array_values( array_unique( $keys ) ) );
	}

	/**
	 * Resolve @mention tokens to WP user IDs in at most three user queries
	 * (login batch, nicename batch, then one search per still-unresolved token)
	 * instead of one query per token.
	 *
	 * @param string[] $tokens Raw mention tokens (without the @). Capped at 10.
	 * @return int[] Unique user IDs.
	 */
	private static function resolve_mention_ids( array $tokens ): array {
		$tokens = array_slice( array_map( 'sanitize_text_field', $tokens ), 0, 10 );

		if ( empty( $tokens ) ) {
			return array();
		}

		$mentioned_ids = array();
		$unresolved    = $tokens;

		// Pass 1: exact user_login matches, one query.
		$users = get_users( array( 'login__in' => $unresolved, 'fields' => array( 'ID', 'user_login' ) ) );
		foreach ( $users as $u ) {
			$mentioned_ids[] = (int) $u->ID;
			$unresolved      = array_diff( $unresolved, array( $u->user_login ) );
		}

		// Pass 2: exact user_nicename matches for the rest, one query.
		if ( ! empty( $unresolved ) ) {
			$users = get_users( array( 'nicename__in' => array_values( $unresolved ), 'fields' => array( 'ID', 'user_nicename' ) ) );
			foreach ( $users as $u ) {
				$mentioned_ids[] = (int) $u->ID;
				$unresolved      = array_diff( $unresolved, array( $u->user_nicename ) );
			}
		}

		// Pass 3: fuzzy display_name/login search only for still-unresolved tokens.
		foreach ( $unresolved as $name ) {
			$found = get_users(
				array(
					'search'         => $name,
					'search_columns' => array( 'display_name', 'user_login' ),
					'number'         => 1,
					'fields'         => 'ID',
				)
			);
			if ( ! empty( $found ) ) {
				$mentioned_ids[] = (int) $found[0];
			}
		}

		return array_values( array_unique( array_filter( $mentioned_ids ) ) );
	}

	/**
	 * Format a feedback row for REST output: decode JSON columns, cast types.
	 *
	 * @param object|null $row Raw DB row.
	 * @return array<string, mixed>
	 */
	/**
	 * Format a reply row for REST output: cast types, add author avatar.
	 *
	 * @param object|null $row Raw DB row.
	 * @return array<string, mixed>
	 */
	public static function format_reply( ?object $row ): array {
		if ( ! $row ) {
			return array();
		}

		$reply              = (array) $row;
		$reply['id']        = (int) ( $reply['id'] ?? 0 );
		$reply['author_id'] = (int) ( $reply['author_id'] ?? 0 );
		$reply['avatar']    = $reply['author_id'] ? esc_url_raw( (string) get_avatar_url( $reply['author_id'], array( 'size' => 64 ) ) ) : '';

		if ( ! empty( $reply['created_at'] ) && is_string( $reply['created_at'] ) ) {
			$reply['created_at'] = self::to_rfc3339( $reply['created_at'] );
		}

		return $reply;
	}

	/**
	 * Convert a naive site-local MySQL datetime to RFC 3339 with UTC offset.
	 */
	private static function to_rfc3339( string $mysql_datetime ): string {
		$dt = date_create_immutable( $mysql_datetime, wp_timezone() );

		return $dt ? $dt->format( DATE_ATOM ) : $mysql_datetime;
	}

	public static function format_item( ?object $row ): array {
		if ( ! $row ) {
			return array();
		}

		// WP Bones Model keeps columns in a protected `attributes` array that a
		// plain (array) cast can't reach; list() returns raw stdClass rows that can.
		if ( $row instanceof \Markaroo\WPBones\Database\Support\Model ) {
			$attrs = \Closure::bind(
				function () {
					return $this->attributes;
				},
				$row,
				$row
			)();
			$item = is_array( $attrs ) ? $attrs : array();
		} else {
			$item = (array) $row;
		}

		// Decode JSON columns. Also emit stable defaults so 'summary' list rows
		// (which omit the detail-only columns) keep the same key set as full rows.
		foreach ( array( 'attachments', 'tags', 'screenshot_rect' ) as $col ) {
			if ( isset( $item[ $col ] ) && is_string( $item[ $col ] ) ) {
				$decoded      = json_decode( $item[ $col ], true );
				$item[ $col ] = is_array( $decoded ) ? $decoded : array();
			} elseif ( ! isset( $item[ $col ] ) || ! is_array( $item[ $col ] ) ) {
				$item[ $col ] = array();
			}
		}

		foreach ( array( 'page_url', 'user_agent' ) as $str_col ) {
			if ( ! isset( $item[ $str_col ] ) || ! is_string( $item[ $str_col ] ) ) {
				$item[ $str_col ] = '';
			}
		}

		// Cast numerics.
		foreach ( array( 'id', 'assigned_to_id', 'screenshot_id', 'author_id', 'share_id' ) as $int_col ) {
			if ( isset( $item[ $int_col ] ) ) {
				$item[ $int_col ] = (int) $item[ $int_col ];
			}
		}

		foreach ( array( 'x', 'y' ) as $float_col ) {
			if ( isset( $item[ $float_col ] ) ) {
				$item[ $float_col ] = (float) $item[ $float_col ];
			}
		}

		// Derive the screenshot URL from the media attachment (the "Pinned content"
		// thumbnail), falling back to the stored path. Empty when there's no shot.
		$item['screenshot_url'] = '';
		$screenshot_id          = (int) ( $item['screenshot_id'] ?? 0 );
		if ( $screenshot_id ) {
			$url = wp_get_attachment_url( $screenshot_id );
			if ( $url ) {
				$item['screenshot_url'] = esc_url_raw( $url );
			}
		}

		// Status label + approval lock for the UI.
		$status               = (string) ( $item['status'] ?? 'open' );
		$item['status_label'] = \Markaroo\Support\Status::label( $status );
		$item['locked']       = ( \Markaroo\Support\Status::APPROVED === $status );

		// Author avatar for the widget UI. Guests (author_id 0) get ''.
		$author_id      = (int) ( $item['author_id'] ?? 0 );
		$item['avatar'] = $author_id ? esc_url_raw( (string) get_avatar_url( $author_id, array( 'size' => 64 ) ) ) : '';

		// Emit timestamps as RFC 3339 with the site's UTC offset so JS Date
		// parses them correctly regardless of the visitor's timezone (the DB
		// stores naive site-local datetimes from current_time('mysql')).
		foreach ( array( 'created_at', 'updated_at' ) as $ts_col ) {
			if ( ! empty( $item[ $ts_col ] ) && is_string( $item[ $ts_col ] ) ) {
				$item[ $ts_col ] = self::to_rfc3339( $item[ $ts_col ] );
			}
		}

		/**
		 * Filters the REST feedback response payload.
		 * Pro plugin can add computed fields (recording URLs, etc.).
		 *
		 * @param array  $item The formatted feedback array.
		 * @param object $row  The raw DB row.
		 */
		return (array) apply_filters( 'markaroo/rest/feedback_response', $item, $row );
	}

	private static function valid_priority( ?string $value ): string {
		return in_array( $value, array( 'urgent', 'high', 'normal', 'low' ), true ) ? $value : 'normal';
	}

	/**
	 * Sanitize a JSON param (string or array) for storage.
	 * Returns a JSON-encoded string or null.
	 */
	private static function sanitize_json_param( $value ): ?string {
		if ( null === $value ) {
			return null;
		}

		if ( is_array( $value ) ) {
			return wp_json_encode( $value );
		}

		$decoded = json_decode( $value, true );

		return wp_json_encode( is_array( $decoded ) ? $decoded : array() );
	}

	private static function sanitize_datetime( ?string $value ): ?string {
		if ( empty( $value ) ) {
			return null;
		}

		$ts = strtotime( $value );

		return $ts ? gmdate( 'Y-m-d H:i:s', $ts ) : null;
	}
}
