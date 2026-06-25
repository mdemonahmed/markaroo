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
				/* translators: 1: count, 2: site name */
				return sprintf(
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
					. "<blockquote>$comment</blockquote>"
					. "<p><a href=\"$url\">" . esc_html__( 'View in dashboard', 'markaroo' ) . '</a></p>';
				break;

			case 'reply_posted':
				$reply = $data['reply'] ?? array();
				$url   = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$text  = esc_html( $reply['comment'] ?? '' );
				$who   = esc_html( $reply['author']  ?? __( 'Someone', 'markaroo' ) );
				$body  = "<p>$greeting</p>"
					/* translators: %s: author name */
				. "<p>" . sprintf( __( '%s replied to a feedback thread:', 'markaroo' ), $who ) . "</p>"
					. "<blockquote>$text</blockquote>"
					. "<p><a href=\"$url\">" . esc_html__( 'View thread', 'markaroo' ) . '</a></p>';
				break;

			case 'mention':
				$comment = esc_html( $data['comment'] ?? '' );
				$url     = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$body    = "<p>$greeting</p>"
					. '<p>' . esc_html__( 'You were mentioned in a feedback comment:', 'markaroo' ) . '</p>'
					. "<blockquote>$comment</blockquote>"
					. "<p><a href=\"$url\">" . esc_html__( 'View in dashboard', 'markaroo' ) . '</a></p>';
				break;

			case 'assigned':
				$feedback = $data['feedback'] ?? array();
				$url      = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$comment  = esc_html( $feedback['comment'] ?? '' );
				$body     = "<p>$greeting</p>"
					. '<p>' . esc_html__( 'A feedback item has been assigned to you:', 'markaroo' ) . '</p>'
					. "<blockquote>$comment</blockquote>"
					. "<p><a href=\"$url\">" . esc_html__( 'View in dashboard', 'markaroo' ) . '</a></p>';
				break;

			case 'resolved':
				$feedback = $data['feedback'] ?? array();
				$url      = esc_url( admin_url( 'admin.php?page=markaroo_main_menu#tasks' ) );
				$comment  = esc_html( $feedback['comment'] ?? '' );
				$body     = "<p>$greeting</p>"
					. '<p>' . esc_html__( 'A feedback item was resolved:', 'markaroo' ) . '</p>'
					. "<blockquote>$comment</blockquote>"
					. "<p><a href=\"$url\">" . esc_html__( 'View in dashboard', 'markaroo' ) . '</a></p>';
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
					. "<p><a href=\"$url\">" . esc_html__( 'View all tasks', 'markaroo' ) . '</a></p>';
				break;

			default:
				return '';
		}

		/**
		 * Filters the HTML email body for a Markaroo notification.
		 *
		 * @param string $body         Email body HTML.
		 * @param string $event        Event slug.
		 * @param array  $data         Event payload.
		 * @param WP_User $user        Recipient user.
		 */
		return (string) apply_filters( 'markaroo/notify/body', $body, $event, $data, $user );
	}
}
