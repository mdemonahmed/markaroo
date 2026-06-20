<?php

namespace Markaroo\Http;

use Markaroo\Support\Capabilities;

defined( 'ABSPATH' ) || exit;

/**
 * Centralised REST permission checks.
 *
 * Tiers:
 *   Manage  — manage cap required (resolve, delete others', settings, shares).
 *   Author  — any logged-in user (create + edit/delete own items).
 *   Guest   — valid share token with the right flag (Task 06).
 *
 * All methods apply markaroo/rest/permission so Pro can inject role rules.
 */
class Auth {

	/**
	 * Manage-level only: settings, resolve, assign, delete others', shares.
	 */
	public static function can_manage( \WP_REST_Request $request ): bool {
		$can = Capabilities::can_manage();

		/** @param bool $can @param string $route @param \WP_REST_Request $request */
		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'manage', $request );
	}

	/**
	 * View feedback: manage cap OR valid share-view token OR any logged-in user.
	 * Any logged-in user can view feedback on the front end (Author tier).
	 */
	public static function can_view( \WP_REST_Request $request ): bool {
		$can = is_user_logged_in() || self::has_share_right( $request, 'view' );

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'view', $request );
	}

	/**
	 * Create feedback / replies: any logged-in user (Author tier) OR share-comment token.
	 */
	public static function can_comment( \WP_REST_Request $request ): bool {
		$can = is_user_logged_in() || self::has_share_right( $request, 'comment' );

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'comment', $request );
	}

	/**
	 * Whether the current request carries a share token with the given right.
	 * Full implementation in Task 06.
	 *
	 * @param string $right 'view'|'comment'
	 */
	public static function has_share_right( \WP_REST_Request $request, string $right ): bool {
		// Task 06 populates this.
		return false;
	}
}
