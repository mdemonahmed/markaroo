<?php

namespace Markaroo\Repositories;

use Markaroo\Models\Share;
use Markaroo\Support\Cache;

defined( 'ABSPATH' ) || exit;

class ShareRepository {

	/**
	 * Return all share links, newest first.
	 *
	 * @return array<int, object>
	 */
	public function list(): array {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_shares';

		return (array) $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	/**
	 * Return a single share link by ID, or null if not found.
	 */
	public function find( int $id ): ?object {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_shares';

		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", $id ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		) ?: null;
	}

	/**
	 * Find a share link by its token string.
	 */
	public function find_by_token( string $token ): ?object {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_shares';

		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE token = %s", $token ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		) ?: null;
	}

	/**
	 * Bust the cross-request cache entry for a token lookup.
	 */
	public static function forget_token_cache( string $token ): void {
		if ( '' !== $token ) {
			Cache::forget( 'share_' . md5( $token ) );
		}
	}

	/**
	 * Create a new share link. Returns the new row ID or false on failure.
	 *
	 * @return int|false
	 */
	public function create( array $data ) {
		$data = array_merge(
			array(
				'token'       => Share::generate_token(),
				'scope'       => 'site',
				'can_comment' => 1,
				'can_view'    => 1,
				'widget_mode' => 'comment',
				'created_at'  => current_time( 'mysql' ),
			),
			$data
		);

		global $wpdb;

		$result = $wpdb->insert( $wpdb->prefix . 'markaroo_shares', $data );

		if ( false === $result ) {
			return false;
		}

		return (int) $wpdb->insert_id;
	}

	/**
	 * Delete (revoke) a share link by ID.
	 */
	public function revoke( int $id ): bool {
		global $wpdb;

		$row = $this->find( $id );
		if ( $row ) {
			self::forget_token_cache( (string) $row->token );
		}

		return (bool) $wpdb->delete( $wpdb->prefix . 'markaroo_shares', array( 'id' => $id ), array( '%d' ) );
	}

	/**
	 * Return the single site-wide guest token, creating one if needed.
	 *
	 * The free plugin uses exactly one site-wide guest link. A clean, current
	 * row (scope = 'site') is returned as-is. If the table is empty, or only
	 * holds legacy/multi-row data (e.g. an old page-scoped link), it is
	 * collapsed to one fresh site-wide token so guests are never restricted by
	 * stale scope/permission columns.
	 */
	public function get_or_create_singleton(): object {
		global $wpdb;
		$table    = $wpdb->prefix . 'markaroo_shares';
		$existing = $wpdb->get_row( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 1" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		if ( $existing && 'site' === (string) $existing->scope ) {
			return $existing;
		}

		// No usable row: wipe any legacy rows and establish one clean token.
		foreach ( $this->list() as $row ) {
			$this->revoke( (int) $row->id );
		}

		$id = $this->create(
			array(
				'scope'       => 'site',
				'can_view'    => 1,
				'can_comment' => 1,
				'widget_mode' => 'comment',
				'created_by'  => (int) get_current_user_id(),
			)
		);

		return $this->find( (int) $id );
	}

	/**
	 * Wipe every share row and insert one fresh site-wide token.
	 *
	 * @return object The new share row.
	 */
	public function regenerate(): object {
		foreach ( $this->list() as $row ) {
			$this->revoke( (int) $row->id );
		}

		$id = $this->create(
			array(
				'scope'       => 'site',
				'can_view'    => 1,
				'can_comment' => 1,
				'widget_mode' => 'comment',
				'created_by'  => (int) get_current_user_id(),
			)
		);

		return $this->find( (int) $id );
	}
}
