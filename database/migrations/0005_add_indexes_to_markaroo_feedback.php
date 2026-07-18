<?php

defined( 'ABSPATH' ) || exit;

use Markaroo\WPBones\Database\Migrations\Migration;
use Markaroo\WPBones\Database\DB;

const MARKAROO_DB_VERSION = '1.2.0';

/**
 * Adds indexes for the columns used in list ordering and dashboard
 * aggregates: priority, due_date, updated_at. Without them those queries
 * filesort / full-scan wp_markaroo_feedback.
 *
 * Guarded by information_schema.STATISTICS checks so re-activation is
 * idempotent.
 */
class Markaroo_Add_Indexes_To_Feedback extends Migration {

	protected $usePrefix = true;

	public function up(): void {
		global $wpdb;

		$table = DB::getTableName( 'markaroo_feedback', $this->usePrefix );

		$indexes = array(
			'idx_priority'   => 'priority',
			'idx_due_date'   => 'due_date',
			'idx_updated_at' => 'updated_at',
		);

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
		foreach ( $indexes as $index_name => $column ) {
			$exists = $wpdb->get_var(
				$wpdb->prepare(
					'SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND INDEX_NAME = %s',
					DB_NAME,
					$table,
					$index_name
				)
			);

			if ( ! $exists ) {
				$wpdb->query( "ALTER TABLE `{$table}` ADD INDEX `{$index_name}` (`{$column}`)" );
			}
		}
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
	}
}

// This file is the last migration — record the schema version after all tables
// have been created or updated, then fire the canonical migrated action.
$markaroo_instance = new Markaroo_Add_Indexes_To_Feedback();

update_option( 'markaroo_db_version', MARKAROO_DB_VERSION );

/**
 * Fires after all Markaroo database tables have been created or updated.
 *
 * @param string $version The new DB schema version.
 */
do_action( 'markaroo/db/migrated', MARKAROO_DB_VERSION );

return $markaroo_instance;
