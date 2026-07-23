<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\ShareRepository;

defined( 'ABSPATH' ) || exit;

class ShareController {

	// -----------------------------------------------------------------------
	// GET /shares
	// -----------------------------------------------------------------------

	/**
	 * List every share link, newest first.
	 */
	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$items = array();
		foreach ( ( new ShareRepository() )->list() as $row ) {
			$items[] = self::payload( $row );
		}

		return rest_ensure_response(
			array(
				'enabled' => (bool) \Markaroo\Support\Settings::get( 'access.allow_guest_links', true ),
				'items'   => $items,
			)
		);
	}

	// -----------------------------------------------------------------------
	// POST /shares
	// -----------------------------------------------------------------------

	/**
	 * Create a new share link with per-link options.
	 */
	public static function store( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$data = self::sanitize( $request, true );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$data['created_by'] = (int) get_current_user_id();

		$repo = new ShareRepository();
		$id   = $repo->create( $data );

		if ( false === $id ) {
			return new \WP_Error( 'markaroo_share_create_failed', __( 'Could not create the share link.', 'markaroo' ), array( 'status' => 500 ) );
		}

		$share = $repo->find( $id );

		/**
		 * Fires after a share token is created (Task 26 §6 Pro seam).
		 * Pro hooks this for branded client portals.
		 *
		 * @param object $share The new share row.
		 */
		do_action( 'markaroo/share/token_created', $share );

		return rest_ensure_response( self::payload( $share ) );
	}

	// -----------------------------------------------------------------------
	// PUT|PATCH /shares/{id}
	// -----------------------------------------------------------------------

	/**
	 * Update a share link (partial edit of label/scope/permissions/mode/expiry).
	 */
	public static function update( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$id   = (int) $request['id'];
		$repo = new ShareRepository();

		if ( ! $repo->find( $id ) ) {
			return new \WP_Error( 'markaroo_share_not_found', __( 'Share link not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$data = self::sanitize( $request, false );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		if ( empty( $data ) ) {
			return new \WP_Error( 'markaroo_share_no_fields', __( 'Nothing to update.', 'markaroo' ), array( 'status' => 400 ) );
		}

		if ( ! $repo->update( $id, $data ) ) {
			return new \WP_Error( 'markaroo_share_update_failed', __( 'Could not update the share link.', 'markaroo' ), array( 'status' => 500 ) );
		}

		return rest_ensure_response( self::payload( $repo->find( $id ) ) );
	}

	// -----------------------------------------------------------------------
	// DELETE /shares/{id}
	// -----------------------------------------------------------------------

	/**
	 * Revoke (delete) a share link. The token stops resolving immediately.
	 */
	public static function destroy( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$id   = (int) $request['id'];
		$repo = new ShareRepository();
		$row  = $repo->find( $id );

		if ( ! $row ) {
			return new \WP_Error( 'markaroo_share_not_found', __( 'Share link not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! $repo->revoke( $id ) ) {
			return new \WP_Error( 'markaroo_share_delete_failed', __( 'Could not revoke the share link.', 'markaroo' ), array( 'status' => 500 ) );
		}

		/**
		 * Fires after a share link is revoked.
		 *
		 * @param object $row The revoked share row snapshot.
		 */
		do_action( 'markaroo/share/revoked', $row );

		return rest_ensure_response( array( 'deleted' => true, 'id' => $id ) );
	}

	/**
	 * Sanitize the writable share fields from a request.
	 *
	 * @param \WP_REST_Request $request  The request.
	 * @param bool             $creating Apply create defaults for absent fields.
	 * @return array<string, mixed>|\WP_Error
	 */
	private static function sanitize( \WP_REST_Request $request, bool $creating ) {
		$data = array();

		if ( $creating || null !== $request->get_param( 'label' ) ) {
			$data['label'] = sanitize_text_field( (string) $request->get_param( 'label' ) );
		}

		$scope = $request->get_param( 'scope' );
		if ( $creating || null !== $scope ) {
			$scope = in_array( (string) $scope, array( 'site', 'page' ), true ) ? (string) $scope : 'site';
			$data['scope'] = $scope;

			$page_key = sanitize_text_field( (string) $request->get_param( 'page_key' ) );
			if ( 'page' === $scope && '' === $page_key ) {
				return new \WP_Error( 'markaroo_share_page_key_required', __( 'A page is required for page-scoped links.', 'markaroo' ), array( 'status' => 400 ) );
			}
			$data['page_key'] = 'page' === $scope ? $page_key : null;
		}

		if ( $creating || null !== $request->get_param( 'can_view' ) ) {
			$data['can_view'] = rest_sanitize_boolean( $request->get_param( 'can_view' ) ?? true ) ? 1 : 0;
		}

		if ( $creating || null !== $request->get_param( 'can_comment' ) ) {
			$data['can_comment'] = rest_sanitize_boolean( $request->get_param( 'can_comment' ) ?? true ) ? 1 : 0;
		}

		$mode = $request->get_param( 'widget_mode' );
		if ( $creating || null !== $mode ) {
			$data['widget_mode'] = in_array( (string) $mode, array( 'comment', 'view', 'clean' ), true ) ? (string) $mode : 'comment';
		}

		$expires = $request->get_param( 'expires_at' );
		if ( null !== $expires ) {
			$expires = sanitize_text_field( (string) $expires );
			if ( '' === $expires ) {
				$data['expires_at'] = null;
			} else {
				$ts = strtotime( $expires );
				if ( false === $ts ) {
					return new \WP_Error( 'markaroo_share_bad_expiry', __( 'Invalid expiry date.', 'markaroo' ), array( 'status' => 400 ) );
				}
				$data['expires_at'] = gmdate( 'Y-m-d H:i:s', $ts );
			}
		}

		return $data;
	}

	/**
	 * Shape one share row for admin REST output.
	 *
	 * @param object $share The share row.
	 * @return array<string, mixed>
	 */
	private static function payload( object $share ): array {
		// Read through the model accessor into locals; the row object may be a
		// WP Bones model with __get but no __isset, so empty()/isset() misbehave.
		$token   = (string) $share->token;
		$expires = $share->expires_at;

		return array(
			'id'          => (int) $share->id,
			'label'       => (string) $share->label,
			'token'       => $token,
			'share_url'   => esc_url_raw( add_query_arg( 'markaroo_share', $token, home_url( '/' ) ) ),
			'scope'       => (string) $share->scope,
			'page_key'    => $share->page_key,
			'can_view'    => (bool) $share->can_view,
			'can_comment' => (bool) $share->can_comment,
			'widget_mode' => (string) ( $share->widget_mode ?? 'comment' ),
			'expires_at'  => $expires,
			'is_expired'  => ! empty( $expires ) && strtotime( (string) $expires ) < time(),
			'created_at'  => (string) $share->created_at,
		);
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
}
