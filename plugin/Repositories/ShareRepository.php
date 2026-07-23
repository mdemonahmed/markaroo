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

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table name from $wpdb->prefix, no user input.
		return (array) $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC" );
	}

	/**
	 * Return a single share link by ID, or null if not found.
	 */
	public function find( int $id ): ?object {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_shares';

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table name from $wpdb->prefix, value prepared.
		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", $id )
		) ?: null;
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
	}

	/**
	 * Find a share link by its token string.
	 */
	public function find_by_token( string $token ): ?object {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_shares';

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table name from $wpdb->prefix, value prepared.
		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE token = %s", $token )
		) ?: null;
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
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

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->insert with sanitized array, custom table.
		$result = $wpdb->insert( $wpdb->prefix . 'markaroo_shares', $data );

		if ( false === $result ) {
			return false;
		}

		return (int) $wpdb->insert_id;
	}

	/**
	 * Update a share link. Returns true on success.
	 *
	 * Busts the token cache so the public resolver sees the change at once.
	 */
	public function update( int $id, array $data ): bool {
		global $wpdb;

		$row = $this->find( $id );
		if ( ! $row ) {
			return false;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->update with sanitized array, custom table.
		$result = $wpdb->update( $wpdb->prefix . 'markaroo_shares', $data, array( 'id' => $id ) );

		if ( false === $result ) {
			return false;
		}

		self::forget_token_cache( (string) $row->token );

		return true;
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

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->delete on custom table.
		return (bool) $wpdb->delete( $wpdb->prefix . 'markaroo_shares', array( 'id' => $id ), array( '%d' ) );
	}

}
