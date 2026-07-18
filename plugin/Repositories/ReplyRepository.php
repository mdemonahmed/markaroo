<?php

namespace Markaroo\Repositories;

defined( 'ABSPATH' ) || exit;

class ReplyRepository {

	/**
	 * Return all replies for a feedback item, oldest first.
	 *
	 * @return array<int, object>
	 */
	public function list( int $feedback_id ): array {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_replies';

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table name from $wpdb->prefix, value prepared.
		return (array) $wpdb->get_results(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE feedback_id = %d ORDER BY created_at ASC", $feedback_id )
		);
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
	}

	/**
	 * Return a single reply by ID, or null if not found.
	 */
	public function find( int $id ): ?object {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_replies';

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table name from $wpdb->prefix, value prepared.
		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", $id )
		) ?: null;
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
	}

	/**
	 * Find a reply by its client-generated UUID.
	 */
	public function find_by_uuid( string $uuid ): ?object {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_replies';

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table name from $wpdb->prefix, value prepared.
		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE reply_uuid = %s", $uuid )
		) ?: null;
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
	}

	/**
	 * Insert a new reply. Returns the new row ID or false on failure.
	 *
	 * @return int|false
	 */
	public function create( array $data ) {
		global $wpdb;

		$data = array_merge(
			array( 'created_at' => current_time( 'mysql' ) ),
			$data
		);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->insert with sanitized array, custom table.
		$result = $wpdb->insert( $wpdb->prefix . 'markaroo_replies', $data );

		if ( false === $result ) {
			return false;
		}

		return (int) $wpdb->insert_id;
	}

	/**
	 * Update a reply's comment text.
	 */
	public function update( int $id, string $comment ): bool {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->update on custom table.
		return false !== $wpdb->update( $wpdb->prefix . 'markaroo_replies', array( 'comment' => $comment ), array( 'id' => $id ), array( '%s' ), array( '%d' ) );
	}

	/**
	 * Delete a single reply.
	 */
	public function delete( int $id ): bool {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->delete on custom table.
		return (bool) $wpdb->delete( $wpdb->prefix . 'markaroo_replies', array( 'id' => $id ), array( '%d' ) );
	}
}
