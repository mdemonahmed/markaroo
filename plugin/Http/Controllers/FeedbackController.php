<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Http\Auth;
use Markaroo\Repositories\FeedbackRepository;
use Markaroo\Repositories\ReplyRepository;
use Markaroo\Support\Cache;
use Markaroo\Support\UserAgent;

defined( 'ABSPATH' ) || exit;

class FeedbackController {

	// -----------------------------------------------------------------------
	// GET /feedback
	// -----------------------------------------------------------------------

	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$repo         = new FeedbackRepository();
		$forced_key   = Auth::share_page_key( $request );
		$req_page_key = sanitize_text_field( $request->get_param( 'page_key' ) ?? '' );
		// Page-scoped share: override requested page_key with the share's page_key.
		$page_key = $forced_key ?? $req_page_key;

		$result = $repo->list(
			array(
				'page_key' => $page_key,
				'status'   => sanitize_text_field( $request->get_param( 'status' ) ?? '' ),
				'priority' => sanitize_text_field( $request->get_param( 'priority' ) ?? '' ),
				'assignee' => absint( $request->get_param( 'assigned_to' ) ?? 0 ),
				'tag'      => sanitize_text_field( $request->get_param( 'tag' ) ?? '' ),
				'search'   => sanitize_text_field( $request->get_param( 'search' ) ?? '' ),
				'order_by' => sanitize_text_field( $request->get_param( 'order_by' ) ?? 'created_at' ),
				'order'    => sanitize_text_field( $request->get_param( 'order' ) ?? 'DESC' ),
				'per_page' => absint( $request->get_param( 'per_page' ) ?? 20 ),
				'page'     => absint( $request->get_param( 'page' ) ?? 1 ),
			)
		);

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
			ScreenshotController::store_data_url( $id, $screenshot );
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

		$item['replies'] = $replies;

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
			$mentioned_ids = array();
			foreach ( array_unique( $matches[1] ) as $name ) {
				$found = get_users(
					array(
						'search'         => sanitize_text_field( $name ),
						'search_columns' => array( 'display_name', 'user_login' ),
						'number'         => 1,
						'fields'         => 'ID',
					)
				);
				if ( ! empty( $found ) ) {
					$mentioned_ids[] = (int) $found[0];
				}
			}
			$mentioned_ids = array_unique( array_filter( $mentioned_ids ) );
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

		$response = rest_ensure_response( $reply );
		$response->set_status( 201 );

		return $response;
	}

	// -----------------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------------

	/**
	 * Format a feedback row for REST output: decode JSON columns, cast types.
	 *
	 * @param object|null $row Raw DB row.
	 * @return array<string, mixed>
	 */
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

		// Decode JSON columns.
		foreach ( array( 'attachments', 'tags', 'screenshot_rect' ) as $col ) {
			if ( isset( $item[ $col ] ) && is_string( $item[ $col ] ) ) {
				$decoded      = json_decode( $item[ $col ], true );
				$item[ $col ] = is_array( $decoded ) ? $decoded : array();
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
