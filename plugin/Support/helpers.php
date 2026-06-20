<?php

defined( 'ABSPATH' ) || exit;

use Markaroo\Support\Capabilities;
use Markaroo\Support\Config;

if ( ! function_exists( 'wp_markaroo_config' ) ) {
	/**
	 * Return the markarooConfig JS payload array.
	 *
	 * @return array<string, mixed>
	 */
	function wp_markaroo_config(): array {
		return Config::payload();
	}
}

if ( ! function_exists( 'wp_markaroo_current_user_can_manage' ) ) {
	/** Whether the current user can manage all Markaroo feedback. */
	function wp_markaroo_current_user_can_manage(): bool {
		return Capabilities::can_manage();
	}
}

if ( ! function_exists( 'wp_markaroo_can_edit' ) ) {
	/**
	 * Whether the current user can edit a specific feedback item.
	 *
	 * @param int $author_id WP user ID of the feedback author (0 = guest).
	 */
	function wp_markaroo_can_edit( int $author_id = 0 ): bool {
		return Capabilities::can_edit( $author_id );
	}
}

if ( ! function_exists( 'wp_markaroo_can_resolve' ) ) {
	/** Whether the current user can resolve / unresolve feedback. */
	function wp_markaroo_can_resolve(): bool {
		return Capabilities::can_resolve();
	}
}

if ( ! function_exists( 'wp_markaroo_can_delete' ) ) {
	/**
	 * Whether the current user can delete a feedback item.
	 *
	 * @param int $author_id WP user ID of the feedback author (0 = guest).
	 */
	function wp_markaroo_can_delete( int $author_id = 0 ): bool {
		return Capabilities::can_delete( $author_id );
	}
}

if ( ! function_exists( 'wp_markaroo_can_assign' ) ) {
	/** Whether the current user can assign feedback to other users. */
	function wp_markaroo_can_assign(): bool {
		return Capabilities::can_assign();
	}
}
