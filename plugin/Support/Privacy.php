<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * GDPR integration: personal-data exporter, eraser, and privacy policy content.
 */
class Privacy {

	/** Register all WP privacy hooks. */
	public static function register(): void {
		add_filter( 'wp_privacy_personal_data_exporters', array( static::class, 'register_exporter' ) );
		add_filter( 'wp_privacy_personal_data_erasers',   array( static::class, 'register_eraser'   ) );
		add_action( 'admin_init', array( static::class, 'add_privacy_policy_content' ) );
	}

	/** Register the personal-data exporter. */
	public static function register_exporter( array $exporters ): array {
		$exporters['markaroo'] = array(
			'exporter_friendly_name' => __( 'Markaroo Feedback Data', 'markaroo' ),
			'callback'               => array( static::class, 'export_user_data' ),
		);
		return $exporters;
	}

	/** Register the personal-data eraser. */
	public static function register_eraser( array $erasers ): array {
		$erasers['markaroo'] = array(
			'eraser_friendly_name' => __( 'Markaroo Feedback Data', 'markaroo' ),
			'callback'             => array( static::class, 'erase_user_data' ),
		);
		return $erasers;
	}

	// -----------------------------------------------------------------------
	// Exporter
	// -----------------------------------------------------------------------

	/**
	 * Export all personal data for a given email.
	 *
	 * @param string $email_address Requested email.
	 * @param int    $page          1-indexed page (WP paginates exports).
	 * @return array{ data: array, done: bool }
	 */
	public static function export_user_data( string $email_address, int $page = 1 ): array {
		$user    = get_user_by( 'email', $email_address );
		$user_id = $user ? (int) $user->ID : 0;

		global $wpdb;

		$feedback_table = $wpdb->prefix . 'markaroo_feedback';
		$replies_table  = $wpdb->prefix . 'markaroo_replies';

		// Fetch feedback by user ID (logged-in) or author name matching email.
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- table names from $wpdb->prefix, value prepared.
		$feedbacks = $user_id
			? (array) $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$feedback_table} WHERE author_id = %d", $user_id ) )
			: array();

		$replies = $user_id
			? (array) $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$replies_table} WHERE author_id = %d", $user_id ) )
			: array();
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter

		$data = array();

		foreach ( $feedbacks as $row ) {
			$item = array(
				'group_id'    => 'markaroo-feedback',
				'group_label' => __( 'Markaroo Feedback', 'markaroo' ),
				'item_id'     => 'feedback-' . $row->id,
				'data'        => array(
					array( 'name' => __( 'Comment', 'markaroo' ),  'value' => esc_html( $row->comment ) ),
					array( 'name' => __( 'Author',  'markaroo' ),  'value' => esc_html( $row->author ) ),
					array( 'name' => __( 'Page',    'markaroo' ),  'value' => esc_html( $row->page_url ) ),
					array( 'name' => __( 'Status',  'markaroo' ),  'value' => esc_html( $row->status ) ),
					array( 'name' => __( 'Created', 'markaroo' ),  'value' => esc_html( $row->created_at ) ),
				),
			);

			/**
			 * Filters the export data for a single feedback row.
			 * Pro can add extra fields (screen recording URL, etc.).
			 *
			 * @param array  $item The WP export item.
			 * @param object $row  The raw feedback row.
			 * @param WP_User|false $user The WP_User or false for guests.
			 */
			$data[] = (array) apply_filters( 'markaroo/gdpr/export', $item, $row, $user );
		}

		foreach ( $replies as $row ) {
			$data[] = array(
				'group_id'    => 'markaroo-replies',
				'group_label' => __( 'Markaroo Replies', 'markaroo' ),
				'item_id'     => 'reply-' . $row->id,
				'data'        => array(
					array( 'name' => __( 'Reply',   'markaroo' ), 'value' => esc_html( $row->comment ) ),
					array( 'name' => __( 'Author',  'markaroo' ), 'value' => esc_html( $row->author ) ),
					array( 'name' => __( 'Created', 'markaroo' ), 'value' => esc_html( $row->created_at ) ),
				),
			);
		}

		return array( 'data' => $data, 'done' => true );
	}

	// -----------------------------------------------------------------------
	// Eraser
	// -----------------------------------------------------------------------

	/**
	 * Erase personal data for a given email.
	 * Anonymizes feedback/reply author fields rather than deleting content.
	 *
	 * @param string $email_address Requested email.
	 * @param int    $page          1-indexed page.
	 * @return array{ items_removed: int, items_retained: int, messages: string[], done: bool }
	 */
	public static function erase_user_data( string $email_address, int $page = 1 ): array {
		$user    = get_user_by( 'email', $email_address );
		$user_id = $user ? (int) $user->ID : 0;

		if ( ! $user_id ) {
			return array( 'items_removed' => 0, 'items_retained' => 0, 'messages' => array(), 'done' => true );
		}

		global $wpdb;
		$removed = 0;

		$feedback_table = $wpdb->prefix . 'markaroo_feedback';
		$replies_table  = $wpdb->prefix . 'markaroo_replies';

		// Anonymize feedback rows: blank author name, zero user ID.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->update on custom table.
		$rows = $wpdb->update(
			$feedback_table,
			array(
				'author'    => __( 'Anonymized', 'markaroo' ),
				'author_id' => 0,
			),
			array( 'author_id' => $user_id ),
			array( '%s', '%d' ),
			array( '%d' )
		);

		if ( false !== $rows ) {
			$removed += (int) $rows;
		}

		// Anonymize reply rows.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $wpdb->update on custom table.
		$reply_rows = $wpdb->update(
			$replies_table,
			array(
				'author'    => __( 'Anonymized', 'markaroo' ),
				'author_id' => 0,
			),
			array( 'author_id' => $user_id ),
			array( '%s', '%d' ),
			array( '%d' )
		);

		if ( false !== $reply_rows ) {
			$removed += (int) $reply_rows;
		}

		// Delete personal notification queue from user meta.
		delete_user_meta( $user_id, 'markaroo_digest_queue' );
		delete_user_meta( $user_id, 'markaroo_notify_mode' );
		delete_user_meta( $user_id, 'markaroo_last_active' );
		delete_user_meta( $user_id, 'markaroo_guest_name' );

		/**
		 * Fires after Markaroo erases user data.
		 * Pro can erase recordings, session data, etc.
		 *
		 * @param int $user_id  WP user ID erased.
		 * @param int $removed  Count of items anonymized.
		 */
		do_action( 'markaroo/gdpr/erase', $user_id, $removed );

		return array(
			'items_removed'  => $removed,
			'items_retained' => 0,
			'messages'       => array(),
			'done'           => true,
		);
	}

	// -----------------------------------------------------------------------
	// Privacy policy suggestion
	// -----------------------------------------------------------------------

	public static function add_privacy_policy_content(): void {
		if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
			return;
		}

		$content = '<h3>' . esc_html__( 'Markaroo Visual Feedback', 'markaroo' ) . '</h3>'
			. '<p>' . esc_html__( 'This site uses the Markaroo plugin to collect visual feedback from authorized users. Markaroo stores:', 'markaroo' ) . '</p>'
			. '<ul>'
			. '<li>' . esc_html__( 'Your name or username when you submit feedback or replies.', 'markaroo' ) . '</li>'
			. '<li>' . esc_html__( 'The page URL and a screenshot of the page at submission time.', 'markaroo' ) . '</li>'
			. '<li>' . esc_html__( 'Your browser, operating system, and screen resolution (metadata only).', 'markaroo' ) . '</li>'
			. '<li>' . esc_html__( 'Any file attachments you upload with your feedback.', 'markaroo' ) . '</li>'
			. '</ul>'
			. '<p>' . esc_html__( 'This data is stored on this server and is not transmitted to third-party services. You may request export or deletion via the Privacy section of your account page or by contacting the site administrator.', 'markaroo' ) . '</p>';

		wp_add_privacy_policy_content(
			__( 'Markaroo Visual Feedback', 'markaroo' ),
			wp_kses_post( $content )
		);
	}
}
