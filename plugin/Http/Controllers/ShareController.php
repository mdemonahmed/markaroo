<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\ShareRepository;

defined( 'ABSPATH' ) || exit;

class ShareController {

	// -----------------------------------------------------------------------
	// GET /shares
	// -----------------------------------------------------------------------

	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$repo   = new ShareRepository();
		$shares = $repo->list();

		return rest_ensure_response(
			array_map( array( __CLASS__, 'format_item' ), $shares )
		);
	}

	// -----------------------------------------------------------------------
	// POST /shares
	// -----------------------------------------------------------------------

	public static function create( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$scope    = in_array( $request->get_param( 'scope' ), array( 'site', 'page' ), true )
			? $request->get_param( 'scope' )
			: 'site';
		$page_key = sanitize_text_field( $request->get_param( 'page_key' ) ?? '' );

		if ( 'page' === $scope && empty( $page_key ) ) {
			return new \WP_Error(
				'markaroo_invalid',
				__( 'page_key is required for page-scoped share links.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		$expires_at = null;
		$expires_raw = $request->get_param( 'expires_at' );
		if ( ! empty( $expires_raw ) ) {
			$ts = strtotime( $expires_raw );
			if ( $ts ) {
				$expires_at = gmdate( 'Y-m-d H:i:s', $ts );
			}
		}

		$repo = new ShareRepository();
		$id   = $repo->create(
			array(
				'label'       => sanitize_text_field( $request->get_param( 'label' ) ?? '' ),
				'scope'       => $scope,
				'page_key'    => $page_key,
				'can_view'    => (int) (bool) ( $request->get_param( 'can_view' ) ?? true ),
				'can_comment' => (int) (bool) ( $request->get_param( 'can_comment' ) ?? true ),
				'widget_mode' => in_array( $request->get_param( 'widget_mode' ), array( 'comment', 'view', 'clean' ), true )
					? $request->get_param( 'widget_mode' )
					: 'comment',
				'expires_at'  => $expires_at,
				'created_by'  => (int) get_current_user_id(),
			)
		);

		if ( ! $id ) {
			return new \WP_Error( 'markaroo_create_failed', __( 'Could not create share link.', 'markaroo' ), array( 'status' => 500 ) );
		}

		$share = $repo->find( $id );

		/**
		 * Fires after a share link is created.
		 *
		 * @param object $share The new share row.
		 */
		do_action( 'markaroo/share/created', $share );

		/**
		 * Fires after a share token is created (Task 26 §6 Pro seam).
		 * Pro hooks this for branded client portals.
		 *
		 * @param object $share The new share row.
		 */
		do_action( 'markaroo/share/token_created', $share );

		$response = rest_ensure_response( self::format_item( $share ) );
		$response->set_status( 201 );

		return $response;
	}

	// -----------------------------------------------------------------------
	// DELETE /shares/{id}
	// -----------------------------------------------------------------------

	public static function destroy( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo  = new ShareRepository();
		$share = $repo->find( (int) $request['id'] );

		if ( ! $share ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Share link not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$repo->revoke( (int) $request['id'] );

		/**
		 * Fires after a share link is revoked.
		 *
		 * @param object $share The revoked share row snapshot.
		 */
		do_action( 'markaroo/share/revoked', $share );

		return rest_ensure_response( array( 'deleted' => true ) );
	}

	// -----------------------------------------------------------------------
	// GET /share/{token}  (public — token is the auth)
	// -----------------------------------------------------------------------

	/**
	 * Resolve a share token for a guest reviewer.
	 *
	 * Public by design: the high-entropy token is the credential. We validate
	 * it strictly, never echo personal data, and rate-limit by IP to slow
	 * token guessing. Returns only what the guest widget needs.
	 */
	public static function resolve_public( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		if ( ! \Markaroo\Support\Settings::get( 'access.allow_guest_links', true ) ) {
			return new \WP_Error( 'markaroo_disabled', __( 'Guest links are disabled.', 'markaroo' ), array( 'status' => 403 ) );
		}

		if ( self::rate_limited() ) {
			return new \WP_Error( 'markaroo_rate_limited', __( 'Too many attempts. Try again shortly.', 'markaroo' ), array( 'status' => 429 ) );
		}

		$token = (string) $request['token'];
		$share = ( new ShareRepository() )->find_by_token( $token );

		// Pull expires_at into a local: the model has no __isset, so calling
		// empty()/isset() on $share->expires_at directly always returns true.
		$share_expires = $share ? $share->expires_at : null;

		if ( ! $share || ( ! empty( $share_expires ) && strtotime( $share_expires ) < time() ) ) {
			return new \WP_Error( 'markaroo_invalid_token', __( 'This review link is invalid or has expired.', 'markaroo' ), array( 'status' => 404 ) );
		}

		// Minimal, non-personal payload.
		return rest_ensure_response(
			array(
				'valid'       => true,
				'scope'       => $share->scope,
				'page_key'    => 'page' === $share->scope ? $share->page_key : null,
				'widget_mode' => $share->widget_mode ?? 'comment',
				'rights'      => array(
					'canView'    => (bool) $share->can_view,
					'canComment' => (bool) $share->can_comment,
				),
				'expires_at'  => $share->expires_at,
			)
		);
	}

	/**
	 * Crude per-IP rate limit (30 hits / minute) to slow token guessing.
	 */
	private static function rate_limited(): bool {
		$ip = isset( $_SERVER['REMOTE_ADDR'] )
			? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) )
			: 'unknown';

		$key   = 'markaroo_share_rl_' . md5( $ip );
		$count = (int) get_transient( $key );

		if ( $count >= 30 ) {
			return true;
		}

		set_transient( $key, $count + 1, MINUTE_IN_SECONDS );

		return false;
	}

	// -----------------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------------

	/**
	 * Format a share row for REST output.
	 *
	 * Includes share_url so admin UI can render a copy-link button without
	 * constructing it client-side.
	 *
	 * @param object|null $row Raw share row.
	 * @return array<string, mixed>
	 */
	public static function format_item( ?object $row ): array {
		if ( ! $row ) {
			return array();
		}

		// $row is a WP Bones Support\Model that keeps its columns in a
		// protected $attributes array, so (array) casting it would produce
		// mangled keys instead of the columns. Read each field through the
		// model's magic accessor to get real values.
		//
		// Important: never use empty()/isset() directly on $row->{col} — the
		// model defines __get but no __isset, so empty()/isset() always report
		// the property as unset. Pull values into locals first.
		$expires_at = $row->expires_at;
		$expires_at = ( null !== $expires_at && '' !== $expires_at ) ? (string) $expires_at : null;

		$item = array(
			'id'          => (int) $row->id,
			'token'       => (string) $row->token,
			'label'       => null !== $row->label ? (string) $row->label : null,
			'scope'       => (string) $row->scope,
			'page_key'    => null !== $row->page_key ? (string) $row->page_key : null,
			'can_view'    => (int) $row->can_view,
			'can_comment' => (int) $row->can_comment,
			'widget_mode' => (string) $row->widget_mode,
			'expires_at'  => $expires_at,
			'created_by'  => (int) $row->created_by,
			'created_at'  => null !== $row->created_at ? (string) $row->created_at : null,
		);

		$item['share_url'] = esc_url_raw(
			add_query_arg( 'markaroo_share', $row->token, home_url( '/' ) )
		);

		$item['is_expired'] = null !== $expires_at
			&& strtotime( $expires_at ) < time();

		return $item;
	}
}
