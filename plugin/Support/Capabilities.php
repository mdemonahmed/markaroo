<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Thin wrappers around capability checks.
 * Task 05 upgrades these to register and use custom `markaroo_*` caps.
 * Pro can override any check via the markaroo/can/* filters.
 */
class Capabilities {

	/**
	 * Whether the current user can manage all Markaroo feedback.
	 */
	public static function can_manage(): bool {
		$can = current_user_can( 'manage_options' );

		/**
		 * Filters manage-level access.
		 * Pro uses this to support the Client / Dev / No Access role model.
		 *
		 * @param bool $can
		 */
		return (bool) apply_filters( 'markaroo/can/manage', $can );
	}

	/**
	 * Whether the current user can edit a specific feedback item.
	 *
	 * @param int $author_id WP user ID of the feedback author (0 = guest).
	 */
	public static function can_edit( int $author_id = 0 ): bool {
		if ( self::can_manage() ) {
			return true;
		}

		$can = $author_id > 0 && (int) get_current_user_id() === $author_id;

		/** @param bool $can @param int $author_id */
		return (bool) apply_filters( 'markaroo/can/edit', $can, $author_id );
	}

	/**
	 * Whether the current user can resolve / unresolve feedback.
	 */
	public static function can_resolve(): bool {
		return (bool) apply_filters( 'markaroo/can/resolve', self::can_manage() );
	}

	/**
	 * Whether the current user can delete a feedback item.
	 *
	 * @param int $author_id WP user ID of the feedback author (0 = guest).
	 */
	public static function can_delete( int $author_id = 0 ): bool {
		return (bool) apply_filters( 'markaroo/can/delete', self::can_manage(), $author_id );
	}

	/**
	 * Whether the current user can assign feedback to other users.
	 */
	public static function can_assign(): bool {
		return (bool) apply_filters( 'markaroo/can/assign', self::can_manage() );
	}
}
