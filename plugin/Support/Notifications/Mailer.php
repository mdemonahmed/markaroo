<?php

namespace Markaroo\Support\Notifications;

use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Sends a single notification email via wp_mail.
 * Pro intercepts markaroo/notify/send to route to Slack/webhook/etc.
 */
class Mailer {

	/**
	 * @param array $notification {
	 *   @type string $event     Event slug (feedback_created, mention, assigned, reply_posted, digest).
	 *   @type int    $to        WP user ID to notify.
	 *   @type array  $data      Event payload (feedback row, reply row, etc.).
	 * }
	 */
	public static function send( array $notification ): void {
		/**
		 * Fires before Markaroo sends a notification.
		 * Pro can handle the notification itself (Slack, webhook, etc.) and return false to skip email.
		 *
		 * @param array $notification Notification data.
		 */
		$send = (bool) apply_filters( 'markaroo/notify/send', true, $notification );
		if ( ! $send ) {
			return;
		}

		$user = get_userdata( $notification['to'] ?? 0 );
		if ( ! $user || ! $user->user_email ) {
			return;
		}

		$event = $notification['event'] ?? '';
		$data  = $notification['data']  ?? array();

		$subject = self::get_subject( $event, $data );
		$body    = self::get_body( $event, $data, $user );

		if ( ! $subject || ! $body ) {
			return;
		}

		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		/**
		 * Filters the email headers for a Markaroo notification.
		 *
		 * @param string[] $headers      Email headers.
		 * @param array    $notification Notification data.
		 */
		$headers = (array) apply_filters( 'markaroo/notify/headers', $headers, $notification );

		$email_args = array(
			'to'      => $user->user_email,
			'subject' => $subject,
			'body'    => $body,
			'headers' => $headers,
		);

		/**
		 * Filters all email arguments before sending a Markaroo notification.
		 * Pro can override to, subject, body, or headers in one pass.
		 *
		 * @param array  $email_args   Keys: to, subject, body, headers.
		 * @param string $event        Event slug.
		 * @param array  $notification Full notification payload.
		 */
		$email_args = (array) apply_filters( 'markaroo/notify/email', $email_args, $event, $notification );

		wp_mail(
			$email_args['to'],
			$email_args['subject'],
			$email_args['body'],
			$email_args['headers']
		);
	}

	private static function get_subject( string $event, array $data ): string {
		$site = get_bloginfo( 'name' );

		switch ( $event ) {
			case 'feedback_created':
				/* translators: %s: site name */
				return sprintf( __( '[%s] New feedback submitted', 'markaroo' ), $site );
			case 'reply_posted':
				/* translators: %s: site name */
				return sprintf( __( '[%s] New reply on feedback', 'markaroo' ), $site );
			case 'mention':
				/* translators: %s: site name */
				return sprintf( __( '[%s] You were mentioned in a comment', 'markaroo' ), $site );
			case 'assigned':
				/* translators: %s: site name */
				return sprintf( __( '[%s] Feedback assigned to you', 'markaroo' ), $site );
			case 'resolved':
				/* translators: %s: site name */
				return sprintf( __( '[%s] Feedback resolved', 'markaroo' ), $site );
			case 'digest':
				return sprintf(
					/* translators: 1: count of open feedback items, 2: site name */
					_n( '[%2$s] %1$d open feedback item', '[%2$s] %1$d open feedback items', (int) ( $data['open_count'] ?? 0 ), 'markaroo' ),
					(int) ( $data['open_count'] ?? 0 ),
					$site
				);
			default:
				return '';
		}
	}

	private static function get_body( string $event, array $data, \WP_User $user ): string {
		$greeting = sprintf(
			/* translators: %s: user display name */
			__( 'Hi %s,', 'markaroo' ),
			esc_html( $user->display_name )
		);

		$site_url = esc_url( home_url() );
		$site     = esc_html( get_bloginfo( 'name' ) );

		switch ( $event ) {
			case 'feedback_created':
				$feedback = $data['feedback'] ?? array();
				$url      = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$comment  = esc_html( $feedback['comment'] ?? '' );
				$author   = esc_html( $feedback['author']  ?? __( 'Someone', 'markaroo' ) );
				$body     = "<p>$greeting</p>"
					/* translators: 1: author name 2: site URL 3: site name */
				. "<p>" . sprintf( __( '%1$s submitted new feedback on <a href="%2$s">%3$s</a>:', 'markaroo' ), $author, $site_url, $site ) . "</p>"
					. self::quote( $comment )
					. self::cta( $url, esc_html__( 'View in dashboard', 'markaroo' ) );
				break;

			case 'reply_posted':
				$reply = $data['reply'] ?? array();
				$url   = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$text  = esc_html( $reply['comment'] ?? '' );
				$who   = esc_html( $reply['author']  ?? __( 'Someone', 'markaroo' ) );
				$body  = "<p>$greeting</p>"
					/* translators: %s: author name */
				. "<p>" . sprintf( __( '%s replied to a feedback thread:', 'markaroo' ), $who ) . "</p>"
					. self::quote( $text )
					. self::cta( $url, esc_html__( 'View thread', 'markaroo' ) );
				break;

			case 'mention':
				$comment = esc_html( $data['comment'] ?? '' );
				$url     = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$body    = "<p>$greeting</p>"
					. '<p>' . esc_html__( 'You were mentioned in a feedback comment:', 'markaroo' ) . '</p>'
					. self::quote( $comment )
					. self::cta( $url, esc_html__( 'View in dashboard', 'markaroo' ) );
				break;

			case 'assigned':
				$feedback = $data['feedback'] ?? array();
				$url      = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$comment  = esc_html( $feedback['comment'] ?? '' );
				$body     = "<p>$greeting</p>"
					. '<p>' . esc_html__( 'A feedback item has been assigned to you:', 'markaroo' ) . '</p>'
					. self::quote( $comment )
					. self::cta( $url, esc_html__( 'View in dashboard', 'markaroo' ) );
				break;

			case 'resolved':
				$feedback = $data['feedback'] ?? array();
				$url      = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$comment  = esc_html( $feedback['comment'] ?? '' );
				$body     = "<p>$greeting</p>"
					. '<p>' . esc_html__( 'A feedback item was resolved:', 'markaroo' ) . '</p>'
					. self::quote( $comment )
					. self::cta( $url, esc_html__( 'View in dashboard', 'markaroo' ) );
				break;

			case 'digest':
				$open = (int) ( $data['open_count'] ?? 0 );
				$url  = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$body = "<p>$greeting</p>"
					. '<p>' . sprintf(
						/* translators: %d: number of open feedback items */
						_n( 'You have %d open feedback item awaiting attention.', 'You have %d open feedback items awaiting attention.', $open, 'markaroo' ),
						$open
					) . '</p>'
					. self::cta( $url, esc_html__( 'View all tasks', 'markaroo' ) );
				break;

			default:
				return '';
		}

		/**
		 * Filters the inner HTML email body for a Markaroo notification, before
		 * it is wrapped in the branded shell.
		 *
		 * @param string $body         Email body HTML.
		 * @param string $event        Event slug.
		 * @param array  $data         Event payload.
		 * @param WP_User $user        Recipient user.
		 */
		$body = (string) apply_filters( 'markaroo/notify/body', $body, $event, $data, $user );

		return self::render_shell( $body, self::get_subject( $event, $data ) );
	}

	/**
	 * Inline-styled call-to-action button. Email clients strip CSS classes, so
	 * the styling must live on the element. $url and $label are pre-escaped by
	 * the caller.
	 */
	private static function cta( string $url, string $label ): string {
		return '<p style="margin:28px 0 4px;"><a href="' . $url . '" style="display:inline-block; background:#5b4fcf; color:#ffffff; font-weight:600; font-size:15px; text-decoration:none; padding:12px 24px; border-radius:8px;">' . $label . '</a></p>';
	}

	/** Inline-styled quote block for feedback/reply text. $html is pre-escaped. */
	private static function quote( string $html ): string {
		return '<blockquote style="margin:0 0 20px; padding:12px 18px; background:#f5f4fc; border-left:3px solid #5b4fcf; color:#4b5563; border-radius:0 6px 6px 0;">' . $html . '</blockquote>';
	}

	/**
	 * Wrap inner body HTML in the shared branded email shell
	 * (resources/views/emails/base.php). Falls back to the raw body if the
	 * template is unreadable, so a missing file never blocks a notification.
	 */
	private static function render_shell( string $content, string $subject ): string {
		$template = dirname( __DIR__, 3 ) . '/resources/views/emails/base.php';
		if ( ! is_readable( $template ) ) {
			return $content;
		}

		$preheader = trim( mb_substr( wp_strip_all_tags( $content ), 0, 120 ) );
		$site_name = get_bloginfo( 'name' );

		ob_start();
		include $template;
		return (string) ob_get_clean();
	}
}
