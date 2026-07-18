<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Handles clean plugin removal.
 *
 * Called from uninstall.php.
 * If delete_data_on_uninstall = true: drops tables, removes options/transients,
 * unschedules cron, removes Markaroo-uploaded attachments.
 * If false (default): only removes transients/cron, data stays intact.
 */
class Uninstall {

	public static function run(): void {
		/**
		 * Fires at the very start of Markaroo uninstall.
		 * Pro plugin hooks here to clean its own data first.
		 */
		do_action( 'markaroo/uninstall' );

		// Always clean up transients and cron regardless of data setting.
		self::remove_transients();
		self::unschedule_cron();

		$delete_data = (bool) get_option( 'markaroo_settings' )['advanced']['delete_data_on_uninstall'] ?? false;

		if ( $delete_data ) {
			self::drop_tables();
			self::remove_options();
			self::remove_user_meta();
			self::remove_uploaded_files();
		}
	}

	/**
	 * Delete ALL Markaroo data unconditionally: tables, options, transients,
	 * user meta, cron events, and every media attachment tagged
	 * `_markaroo_attachment`. Shared by uninstall and the deactivation
	 * "delete all data" path so the two can never drift apart.
	 */
	public static function purge(): void {
		/**
		 * Fires before Markaroo deletes its own data during a purge.
		 * Pro plugin hooks here to remove its tables/options/files first.
		 */
		do_action( 'markaroo/deactivate/cleanup' );

		self::remove_transients();
		self::unschedule_cron();
		self::drop_tables();
		self::remove_options();
		self::remove_user_meta();
		self::remove_uploaded_files();
	}

	private static function remove_transients(): void {
		if ( class_exists( 'Markaroo\Support\Cache' ) ) {
			Cache::flush_all();
		} else {
			global $wpdb;
			// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- transient cleanup on uninstall, values prepared.
			$like = $wpdb->esc_like( '_transient_markaroo_' ) . '%';
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like ) );
			$like2 = $wpdb->esc_like( '_transient_timeout_markaroo_' ) . '%';
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like2 ) );
			// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		}
	}

	private static function unschedule_cron(): void {
		$timestamp = wp_next_scheduled( 'markaroo_digest_cron' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'markaroo_digest_cron' );
		}

		wp_clear_scheduled_hook( 'markaroo_digest_cron' );

		// Deferred single-notification events (any pending args variants).
		if ( function_exists( 'wp_unschedule_hook' ) ) {
			wp_unschedule_hook( 'markaroo_send_notification' );
		} else {
			wp_clear_scheduled_hook( 'markaroo_send_notification' );
		}
	}

	private static function drop_tables(): void {
		global $wpdb;

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- uninstall drops plugin tables; names from $wpdb->prefix.
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}markaroo_replies" );
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}markaroo_shares" );
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}markaroo_feedback" );
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
	}

	private static function remove_options(): void {
		global $wpdb;

		// Remove all markaroo_* options.
		$like = $wpdb->esc_like( 'markaroo_' ) . '%';
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- option cleanup on uninstall, value prepared.
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like ) );

		// WP Bones stores migration state too.
		delete_option( 'markaroo_db_version' );
	}

	private static function remove_user_meta(): void {
		global $wpdb;

		$keys = array(
			'markaroo_digest_queue',
			'markaroo_notify_mode',
			'markaroo_last_active',
			'markaroo_guest_name',
		);

		foreach ( $keys as $key ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- one-time usermeta cleanup on uninstall.
			$wpdb->delete( $wpdb->usermeta, array( 'meta_key' => $key ), array( '%s' ) );
		}
	}

	/**
	 * Delete WP media attachments originally uploaded by Markaroo.
	 * We identify them via post_mime_type prefix and a post_title pattern,
	 * or by a custom meta key set on upload.
	 */
	private static function remove_uploaded_files(): void {
		$attachment_ids = get_posts(
			array(
				'post_type'   => 'attachment',
				'numberposts' => -1,
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- one-time attachment cleanup on uninstall.
				'meta_key'    => '_markaroo_attachment',
				'fields'      => 'ids',
			)
		);

		foreach ( (array) $attachment_ids as $id ) {
			wp_delete_attachment( (int) $id, true );
		}
	}
}
