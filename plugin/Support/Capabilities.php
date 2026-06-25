<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Central permission helpers.
 *
 * Every decision routes through here — no inline current_user_can() in controllers.
 * All checks end with an apply_filters() seam so Pro can inject role-based rules.
 *
 * Free model:
 *   Manage  — users holding the configured manage_capability (default manage_options).
 *   Author  — any logged-in user; may edit/delete only their own items.
 *   Guest   — via share token only (Task 06).
 */
class Capabilities {

	/** Custom meta-capability name. */
	const META_CAP = 'markaroo_manage_feedback';

	/**
	 * Resolve the configured manage capability slug from settings.
	 * Falls back to manage_options so the plugin works before settings are saved.
	 */
	public static function manage_cap(): string {
		return Settings::get( 'access.manage_capability', 'manage_options' ) ?: 'manage_options';
	}

	// -----------------------------------------------------------------------
	// Manage
	// -----------------------------------------------------------------------

	/**
	 * Whether the current user can manage all Markaroo feedback.
	 *
	 * Checks the custom meta-cap `markaroo_manage_feedback`, which the
	 * LifecycleServiceProvider maps to the configured manage_capability.
	 *
	 * @return bool
	 */
	public static function can_manage(): bool {
		$user = wp_get_current_user();
		$can  = $user->ID > 0 && $user->has_cap( self::META_CAP );

		/**
		 * Filters manage-level access.
		 * Pro uses this to support the Client / Dev / No Access role model.
		 *
		 * @param bool     $can  Whether access is allowed.
		 * @param \WP_User $user Current user.
		 */
		return (bool) apply_filters( 'markaroo/can/manage', $can, $user );
	}

	// -----------------------------------------------------------------------
	// Author-level: any logged-in user
	// -----------------------------------------------------------------------

	/**
	 * Whether the current user can create feedback (any logged-in user = Author tier).
	 */
	public static function can_create(): bool {
		$can = is_user_logged_in();

		return (bool) apply_filters( 'markaroo/can/create', $can, wp_get_current_user() );
	}

	/**
	 * Whether the current user can edit a specific feedback/reply item.
	 * Manage users can edit anything; Authors can edit only their own.
	 *
	 * @param int $author_id WP user ID of the item's author (0 = guest-created).
	 */
	public static function can_edit( int $author_id = 0 ): bool {
		if ( self::can_manage() ) {
			return true;
		}

		$current = (int) get_current_user_id();
		$can     = $current > 0 && $current === $author_id;

		/**
		 * @param bool $can       Whether edit is allowed.
		 * @param int  $author_id Author WP user ID of the item.
		 */
		return (bool) apply_filters( 'markaroo/can/edit', $can, $author_id );
	}

	// -----------------------------------------------------------------------
	// Manage-only actions
	// -----------------------------------------------------------------------

	/**
	 * Whether the current user can resolve / unresolve feedback.
	 */
	public static function can_resolve(): bool {
		$can = self::can_manage();

		/**
		 * @param bool   $can  Whether resolve is allowed.
		 * @param string $ctx  Context string (always 'resolve').
		 */
		return (bool) apply_filters( 'markaroo/can/resolve', $can, 'resolve' );
	}

	/**
	 * Whether the current user can delete a feedback/reply item.
	 * Manage users can delete anything; Authors can delete only their own.
	 *
	 * @param int $author_id WP user ID of the item's author (0 = guest-created).
	 */
	public static function can_delete( int $author_id = 0 ): bool {
		if ( self::can_manage() ) {
			return true;
		}

		$current = (int) get_current_user_id();
		$can     = $current > 0 && $current === $author_id;

		/**
		 * @param bool $can       Whether delete is allowed.
		 * @param int  $author_id Author WP user ID of the item.
		 */
		return (bool) apply_filters( 'markaroo/can/delete', $can, $author_id );
	}

	/**
	 * Whether the current user can assign feedback to other users.
	 */
	public static function can_assign(): bool {
		$can = self::can_manage();

		/**
		 * @param bool   $can Whether assign is allowed.
		 * @param string $ctx Context string (always 'assign').
		 */
		return (bool) apply_filters( 'markaroo/can/assign', $can, 'assign' );
	}
}
