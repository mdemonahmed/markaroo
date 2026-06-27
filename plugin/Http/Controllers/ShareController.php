<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\ShareRepository;

defined( 'ABSPATH' ) || exit;

class ShareController {

	// -----------------------------------------------------------------------
	// GET /shares/guest-link
	// -----------------------------------------------------------------------

	/**
	 * Return the single site-wide guest feedback link (creating it on demand).
	 */
	public static function guest_link( \WP_REST_Request $request ): \WP_REST_Response {
		$share = ( new ShareRepository() )->get_or_create_singleton();

		return rest_ensure_response( self::guest_payload( $share ) );
	}

	// -----------------------------------------------------------------------
	// POST /shares/guest-link/regenerate
	// -----------------------------------------------------------------------

	/**
	 * Issue a brand-new guest token, invalidating every previous one.
	 */
	public static function regenerate( \WP_REST_Request $request ): \WP_REST_Response {
		$repo  = new ShareRepository();
		$old   = $repo->list();        // Snapshot before wipe (for the revoked hook).
		$share = $repo->regenerate();  // Delete all rows + insert one.

		foreach ( $old as $row ) {
			/**
			 * Fires after a share link is revoked.
			 *
			 * @param object $row The revoked share row snapshot.
			 */
			do_action( 'markaroo/share/revoked', $row );
		}

		/**
		 * Fires after a share token is created (Task 26 §6 Pro seam).
		 * Pro hooks this for branded client portals.
		 *
		 * @param object $share The new share row.
		 */
		do_action( 'markaroo/share/token_created', $share );

		return rest_ensure_response( self::guest_payload( $share ) );
	}

	/**
	 * Shape the single guest link for admin REST output.
	 *
	 * @param object $share The share row.
	 * @return array<string, mixed>
	 */
	private static function guest_payload( object $share ): array {
		// Read through the model accessor into a local; the WP Bones model has
		// __get but no __isset, so empty()/isset()/(array)-cast misbehave.
		$token = (string) $share->token;

		return array(
			'enabled'   => (bool) \Markaroo\Support\Settings::get( 'access.allow_guest_links', true ),
			'token'     => $token,
			'share_url' => esc_url_raw( add_query_arg( 'markaroo_share', $token, home_url( '/' ) ) ),
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
