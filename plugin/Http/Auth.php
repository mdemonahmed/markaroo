<?php

namespace Markaroo\Http;

defined( 'ABSPATH' ) || exit;

/**
 * Centralised REST permission checks.
 *
 * All methods return bool and apply the markaroo/rest/permission filter so
 * the Pro plugin can inject role-based rules without touching this file.
 */
class Auth {

	/**
	 * Current user can manage all Markaroo feedback (admin-level).
	 */
	public static function can_manage( \WP_REST_Request $request ): bool {
		$can = is_user_logged_in() && wp_markaroo_current_user_can_manage();

		/** @param bool $can @param string $route @param \WP_REST_Request $request */
		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'manage', $request );
	}

	/**
	 * Current user can view feedback (manage cap OR valid share-view token).
	 */
	public static function can_view( \WP_REST_Request $request ): bool {
		$can = ( is_user_logged_in() && wp_markaroo_current_user_can_manage() )
			|| self::has_share_right( $request, 'view' );

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'view', $request );
	}

	/**
	 * Current user can post feedback/replies (manage cap OR valid share-comment token).
	 */
	public static function can_comment( \WP_REST_Request $request ): bool {
		$can = ( is_user_logged_in() && wp_markaroo_current_user_can_manage() )
			|| self::has_share_right( $request, 'comment' );

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'comment', $request );
	}

	/**
	 * Whether the current request carries a share token with the given right.
	 * Full implementation added in Task 06.
	 *
	 * @param string $right 'view'|'comment'
	 */
	public static function has_share_right( \WP_REST_Request $request, string $right ): bool {
		// Task 06 populates this.
		return false;
	}
}
