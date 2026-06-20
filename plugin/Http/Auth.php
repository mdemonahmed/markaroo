<?php

namespace Markaroo\Http;

use Markaroo\Repositories\ShareRepository;
use Markaroo\Support\Capabilities;
use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Centralised REST permission checks.
 *
 * Tiers:
 *   Manage  — manage cap required (resolve, delete others', settings, shares).
 *   Author  — any logged-in user (create + edit/delete own items).
 *   Guest   — valid share token with the right flag.
 *
 * All methods apply markaroo/rest/permission so Pro can inject role rules.
 */
class Auth {

	/** Per-request share cache (token → row|null). Avoids duplicate DB lookups. */
	private static array $share_cache = array();

	// -----------------------------------------------------------------------
	// Tier checks
	// -----------------------------------------------------------------------

	/**
	 * Manage-level only: settings, resolve, assign, delete others', shares.
	 */
	public static function can_manage( \WP_REST_Request $request ): bool {
		$can = Capabilities::can_manage();

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'manage', $request );
	}

	/**
	 * View feedback: any logged-in user (Author tier) OR valid share-view token.
	 */
	public static function can_view( \WP_REST_Request $request ): bool {
		$can = is_user_logged_in() || self::has_share_right( $request, 'view' );

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'view', $request );
	}

	/**
	 * Create feedback/replies: any logged-in user (Author tier) OR share-comment token.
	 */
	public static function can_comment( \WP_REST_Request $request ): bool {
		$can = is_user_logged_in() || self::has_share_right( $request, 'comment' );

		return (bool) apply_filters( 'markaroo/rest/permission', $can, 'comment', $request );
	}

	// -----------------------------------------------------------------------
	// Share token resolution
	// -----------------------------------------------------------------------

	/**
	 * Whether the current request carries a share token with the given right.
	 *
	 * Checks:
	 *   1. allow_guest_links setting enabled.
	 *   2. Valid, non-expired share row found for the token.
	 *   3. Share has the requested right (can_view / can_comment).
	 *   4. markaroo/share/authorize filter not null (pro override seam).
	 *
	 * @param string $right 'view'|'comment'
	 */
	public static function has_share_right( \WP_REST_Request $request, string $right ): bool {
		if ( ! Settings::get( 'access.allow_guest_links', true ) ) {
			return false;
		}

		$share = self::resolve_share( $request );

		if ( ! $share ) {
			return false;
		}

		$allowed = 'comment' === $right
			? (bool) $share->can_comment
			: (bool) $share->can_view;

		if ( ! $allowed ) {
			return false;
		}

		// Guest principal descriptor — pro can map to a role via the filter.
		$principal = array(
			'type'  => 'guest',
			'share' => $share,
			'right' => $right,
		);

		/**
		 * Filters share-based authorization.
		 * Return null or false to deny; return $principal (or any truthy value) to allow.
		 * Pro uses this to map share scope to role-based rules.
		 *
		 * @param array            $principal Guest principal descriptor.
		 * @param object           $share     The resolved share row.
		 * @param \WP_REST_Request $request   The REST request.
		 */
		$result = apply_filters( 'markaroo/share/authorize', $principal, $share, $request );

		return null !== $result && false !== $result;
	}

	/**
	 * Resolve the share token from the current request.
	 *
	 * Checks X-Markaroo-Share header first, then markaroo_share query/body param.
	 * Result is cached per token within the request lifecycle.
	 *
	 * @return object|null Validated share row, or null if invalid/expired.
	 */
	public static function resolve_share( \WP_REST_Request $request ): ?object {
		$token = $request->get_header( 'X-Markaroo-Share' );

		if ( empty( $token ) ) {
			$token = sanitize_text_field( $request->get_param( 'markaroo_share' ) ?? '' );
		}

		if ( empty( $token ) ) {
			return null;
		}

		$cache_key = md5( $token );

		if ( array_key_exists( $cache_key, self::$share_cache ) ) {
			return self::$share_cache[ $cache_key ];
		}

		$share = ( new ShareRepository() )->find_by_token( $token );

		if ( ! $share ) {
			self::$share_cache[ $cache_key ] = null;
			return null;
		}

		// Expiry check — done here to avoid relying on model instance method.
		if ( ! empty( $share->expires_at ) && strtotime( $share->expires_at ) < time() ) {
			self::$share_cache[ $cache_key ] = null;
			return null;
		}

		self::$share_cache[ $cache_key ] = $share;

		return $share;
	}

	/**
	 * Return the page_key restriction imposed by the share, if any.
	 *
	 * Returns a non-empty string when the share has scope='page' and a page_key set.
	 * Controllers use this to restrict which feedback a guest can read or post.
	 *
	 * @return string|null Required page_key, or null if no page scope.
	 */
	public static function share_page_key( \WP_REST_Request $request ): ?string {
		$share = self::resolve_share( $request );

		if ( ! $share ) {
			return null;
		}

		if ( 'page' === $share->scope && ! empty( $share->page_key ) ) {
			return $share->page_key;
		}

		return null;
	}

	/**
	 * Return the resolved share ID from the current request, or 0.
	 */
	public static function share_id( \WP_REST_Request $request ): int {
		$share = self::resolve_share( $request );

		return $share ? (int) $share->id : 0;
	}
}
