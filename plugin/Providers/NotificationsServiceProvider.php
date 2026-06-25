<?php

namespace Markaroo\Providers;

use Markaroo\Support\Notifications\NotificationQueue;
use Markaroo\Support\Settings;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class NotificationsServiceProvider extends ServiceProvider {

	public function register() {
		// Register WP-Cron schedule + hook.
		add_filter( 'cron_schedules',   array( $this, 'add_digest_schedule' ) );
		add_action( NotificationQueue::DIGEST_CRON_HOOK, array( $this, 'run_digest_cron' ) );

		// Schedule on boot if not already scheduled.
		if ( ! wp_next_scheduled( NotificationQueue::DIGEST_CRON_HOOK ) ) {
			wp_schedule_event( time(), 'markaroo_digest', NotificationQueue::DIGEST_CRON_HOOK );
		}

		// Wire notification triggers to Markaroo feedback events.
		add_action( 'markaroo/feedback/created',  array( $this, 'on_feedback_created'  ), 10, 1 );
		add_action( 'markaroo/feedback/assigned',  array( $this, 'on_feedback_assigned' ), 10, 2 );
		add_action( 'markaroo/feedback/resolved',  array( $this, 'on_feedback_resolved' ), 10, 1 );
		add_action( 'markaroo/reply/created',      array( $this, 'on_reply_created'     ), 10, 2 );
		add_action( 'markaroo/mention',            array( $this, 'on_mention'           ), 10, 2 );

		// Track admin user activity for smart mode.
		add_action( 'rest_api_init', array( $this, 'track_rest_activity' ), 1 );
	}

	/** Add a custom cron schedule for digest interval. */
	public function add_digest_schedule( array $schedules ): array {
		$interval = absint( Settings::get( 'notifications.digest_interval_hours', 24 ) );
		$interval = max( 1, $interval ) * HOUR_IN_SECONDS;

		$schedules['markaroo_digest'] = array(
			'interval' => $interval,
			'display'  => esc_html__( 'Markaroo digest interval', 'markaroo' ),
		);

		return $schedules;
	}

	/** WP-Cron callback: flush all pending digest notifications. */
	public function run_digest_cron(): void {
		NotificationQueue::flush_all_digests();
	}

	/** Notify site managers when new feedback is created. */
	public function on_feedback_created( object $feedback ): void {
		$managers = $this->get_managers();
		foreach ( $managers as $uid ) {
			NotificationQueue::dispatch(
				'feedback_created',
				$uid,
				array( 'feedback' => (array) $feedback )
			);
		}
	}

	/** Notify assignee when feedback is assigned to them. */
	public function on_feedback_assigned( object $feedback, int $user_id ): void {
		if ( ! $user_id ) {
			return;
		}

		NotificationQueue::dispatch(
			'assigned',
			$user_id,
			array( 'feedback' => (array) $feedback )
		);
	}

	/** Notify feedback author + managers when feedback is resolved. */
	public function on_feedback_resolved( object $feedback ): void {
		$author_id = (int) ( $feedback->author_id ?? 0 );
		if ( $author_id ) {
			NotificationQueue::dispatch(
				'resolved',
				$author_id,
				array( 'feedback' => (array) $feedback )
			);
		}
	}

	/** Notify feedback author + assignee when a reply is posted. */
	public function on_reply_created( object $reply, object $feedback ): void {
		$notify_ids = array();

		$author_id = (int) ( $feedback->author_id ?? 0 );
		if ( $author_id ) {
			$notify_ids[] = $author_id;
		}

		$assignee_id = (int) ( $feedback->assigned_to_id ?? 0 );
		if ( $assignee_id && $assignee_id !== $author_id ) {
			$notify_ids[] = $assignee_id;
		}

		foreach ( array_unique( $notify_ids ) as $uid ) {
			NotificationQueue::dispatch(
				'reply_posted',
				$uid,
				array( 'reply' => (array) $reply, 'feedback' => (array) $feedback )
			);
		}
	}

	/** Notify mentioned users. */
	public function on_mention( array $mentioned_user_ids, array $context ): void {
		NotificationQueue::notify_mentions( $mentioned_user_ids, $context );
	}

	/** Track last REST activity for smart notification mode. */
	public function track_rest_activity(): void {
		$user_id = get_current_user_id();
		if ( $user_id ) {
			update_user_meta( $user_id, 'markaroo_last_active', time() );
		}
	}

	/** Collect WP user IDs that receive new-feedback notifications (default: admins). */
	private function get_managers(): array {
		/**
		 * Filters the list of user IDs that receive new-feedback notifications.
		 *
		 * @param int[] $managers Array of WP user IDs.
		 */
		return (array) apply_filters(
			'markaroo/notify/managers',
			array_map(
				'intval',
				get_users( array( 'role' => 'administrator', 'fields' => 'ID' ) )
			)
		);
	}
}
