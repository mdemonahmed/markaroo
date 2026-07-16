<?php

defined( 'ABSPATH' ) || exit;

use Markaroo\WPBones\Database\Migrations\Migration;
use Markaroo\WPBones\Database\DB;

/**
 * Adds the optional `title` column to wp_markaroo_feedback.
 *
 * The base table already exists from 0001, so we ALTER rather than CREATE.
 * Guarded by an information_schema check so re-activation is idempotent.
 */
class Add_Title_To_Markaroo_Feedback extends Migration {

	protected $usePrefix = true;

	public function up(): void {
		global $wpdb;

		$table = DB::getTableName( 'markaroo_feedback', $this->usePrefix );

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange
		$exists = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s',
				DB_NAME,
				$table,
				'title'
			)
		);

		if ( ! $exists ) {
			$wpdb->query( "ALTER TABLE `{$table}` ADD COLUMN `title` varchar(191) DEFAULT NULL AFTER `comment`" );
		}
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange
	}
}

// Schema version + markaroo/db/migrated now fire from the last migration
// (0005_add_indexes_to_markaroo_feedback.php).
return new Add_Title_To_Markaroo_Feedback();
