<?php

namespace Markaroo\Support\Notifications;

use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Routes notification events to email based on user mode preference.
 *
 * Modes: off / instant / digest / smart
 * - instant: send immediately via Mailer
 * - digest:  queue in user-meta, flushed by WP-Cron
 * - smart:   queue unless user has been active in last 15 min (fallback: instant)
 * - off:     no email
 */
class NotificationQueue {

	const DIGEST_CRON_HOOK = 'markaroo_digest_cron';
	const SEND_CRON_HOOK   = 'markaroo_send_notification';
	const QUEUE_META_KEY   = 'markaroo_digest_queue';

	/** Dispatch a notification for a single recipient. */
	public static function dispatch( string $event, int $user_id, array $data ): void {
		if ( ! $user_id ) {
			return;
		}

		// Skip notifying the actor who caused the event.
		$current_user_id = get_current_user_id();
		if ( $current_user_id && $current_user_id === $user_id ) {
			return;
		}

		/**
		 * Filters whether a notification should be sent to a user.
		 * Pro can add per-user preference toggles (per-event, per-project, DND hours).
		 *
		 * @param bool   $should   Default true.
		 * @param string $event    Event slug.
		 * @param int    $user_id  Recipient user ID.
		 * @param array  $data     Event payload.
		 */
		$should = (bool) apply_filters( 'markaroo/notify/should_send', true, $event, $user_id, $data );
		if ( ! $should ) {
			return;
		}

		$mode = self::mode_for_user( $user_id );

		switch ( $mode ) {
			case 'off':
				return;

			case 'instant':
				self::send_or_defer( array( 'event' => $event, 'to' => $user_id, 'data' => $data ) );
				break;

			case 'smart':
				$last_active = (int) get_user_meta( $user_id, 'markaroo_last_active', true );
				$cutoff      = time() - 15 * MINUTE_IN_SECONDS;

				if ( $last_active > $cutoff ) {
					// User is online — enqueue for digest instead.
					self::enqueue( $user_id, $event, $data );
				} else {
					self::send_or_defer( array( 'event' => $event, 'to' => $user_id, 'data' => $data ) );
				}
				break;

			case 'digest':
			default:
				self::enqueue( $user_id, $event, $data );
				break;
		}
	}

	/**
	 * Hand an email off to a WP-Cron single event so wp_mail() never blocks the
	 * HTTP request that triggered the notification.
	 */
	private static function send_or_defer( array $payload ): void {
		/**
		 * Filters whether notification emails are deferred to WP-Cron.
		 * Return false to send synchronously in the current request (e.g. on
		 * hosts with unreliable cron spawning).
		 *
		 * @param bool  $defer   Default true.
		 * @param array $payload Notification payload (event, to, data).
		 */
		$defer = (bool) apply_filters( 'markaroo/notify/defer', true, $payload );

		if ( ! $defer || false === wp_schedule_single_event( time(), self::SEND_CRON_HOOK, array( $payload ) ) ) {
			Mailer::send( $payload );
		}
	}

	/** Send mentions to all @mentioned users. */
	public static function notify_mentions( array $mentioned_user_ids, array $feedback_data ): void {
		/**
		 * Filters the list of user IDs that receive mention notifications.
		 * Pro can add suppression rules, team routing, or external recipients.
		 *
		 * @param int[]  $mentioned_user_ids Resolved WP user IDs.
		 * @param string $event              Always 'mention'.
		 * @param array  $feedback_data      Reply and feedback context.
		 */
		$mentioned_user_ids = (array) apply_filters( 'markaroo/notify/recipients', $mentioned_user_ids, 'mention', $feedback_data );

		foreach ( $mentioned_user_ids as $uid ) {
			self::dispatch( 'mention', (int) $uid, array( 'comment' => $feedback_data['comment'] ?? '' ) );
		}
	}

	/**
	 * Flush queued digest notifications for a single user.
	 *
	 * @param int      $user_id    Recipient.
	 * @param int|null $open_count Site-wide open feedback count; pass it when
	 *                             flushing many users so the same COUNT(*) isn't
	 *                             re-queried per recipient. Null = query it here.
	 */
	public static function flush_digest( int $user_id, ?int $open_count = null ): void {
		$queue = self::get_queue( $user_id );
		if ( empty( $queue ) ) {
			return;
		}

		if ( null === $open_count ) {
			$open_count = self::open_feedback_count();
		}

		Mailer::send(
			array(
				'event' => 'digest',
				'to'    => $user_id,
				'data'  => array( 'open_count' => $open_count, 'queue' => $queue ),
			)
		);

		delete_user_meta( $user_id, self::QUEUE_META_KEY );
	}

	/** Flush all queued digests (called from WP-Cron). */
	public static function flush_all_digests(): void {
		$user_ids = self::users_with_queued_notifications();

		// The open count is site-wide — compute once for all recipients.
		$open_count = empty( $user_ids ) ? 0 : self::open_feedback_count();

		foreach ( $user_ids as $uid ) {
			self::flush_digest( (int) $uid, $open_count );
		}

		/**
		 * Fires after all digest emails are sent.
		 */
		do_action( 'markaroo/notify/digests_sent' );

		/**
		 * Fires after the digest cron flush completes.
		 * Alias kept for backwards compatibility with hook spec.
		 */
		do_action( 'markaroo/notify/digest_flush' );
	}

	// -----------------------------------------------------------------------

	private static function mode_for_user( int $user_id ): string {
		// Per-user preference first.
		$pref = get_user_meta( $user_id, 'markaroo_notify_mode', true );
		if ( $pref ) {
			return sanitize_key( $pref );
		}

		// Fall back to global setting.
		return sanitize_key( Settings::get( 'notifications.notify_mode', 'digest' ) );
	}

	private static function enqueue( int $user_id, string $event, array $data ): void {
		$queue   = self::get_queue( $user_id );
		$queue[] = array( 'event' => $event, 'data' => $data, 'time' => time() );
		update_user_meta( $user_id, self::QUEUE_META_KEY, $queue );
	}

	private static function get_queue( int $user_id ): array {
		$queue = get_user_meta( $user_id, self::QUEUE_META_KEY, true );
		return is_array( $queue ) ? $queue : array();
	}

	/** Site-wide count of open feedback rows. */
	private static function open_feedback_count(): int {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_feedback';

		return (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table} WHERE status = 'open'" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	private static function users_with_queued_notifications(): array {
		global $wpdb;
		return (array) $wpdb->get_col(
			$wpdb->prepare(
				"SELECT DISTINCT user_id FROM {$wpdb->usermeta} WHERE meta_key = %s",
				self::QUEUE_META_KEY
			)
		);
	}
}
