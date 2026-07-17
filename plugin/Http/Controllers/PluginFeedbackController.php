<?php

namespace Markaroo\Http\Controllers;

defined( 'ABSPATH' ) || exit;

/**
 * "Give us Feedback" — emails an admin-submitted message to the plugin
 * authors. Strictly user-initiated: nothing is ever sent automatically.
 */
class PluginFeedbackController {

	private const RECIPIENT = 'hello@devemon.com';

	/** Transient key for the simple rate limit. */
	private const RATE_KEY = 'markaroo_plugin_feedback_sent';

	// -----------------------------------------------------------------------
	// POST /plugin-feedback
	// -----------------------------------------------------------------------

	public static function create( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		// ponytail: one send per minute site-wide — enough to stop accidental
		// double-submits; per-user limiting if it ever matters.
		if ( get_transient( self::RATE_KEY ) ) {
			return new \WP_Error(
				'markaroo_rate_limited',
				__( 'Please wait a minute before sending another message.', 'markaroo' ),
				array( 'status' => 429 )
			);
		}

		$name    = sanitize_text_field( $request->get_param( 'name' ) ?? '' );
		$email   = sanitize_email( $request->get_param( 'email' ) ?? '' );
		$subject = sanitize_text_field( $request->get_param( 'subject' ) ?? '' );
		$message = sanitize_textarea_field( $request->get_param( 'message' ) ?? '' );

		if ( '' === $name || '' === $subject || '' === $message ) {
			return new \WP_Error(
				'markaroo_invalid',
				__( 'Please fill in all fields.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		if ( ! is_email( $email ) ) {
			return new \WP_Error(
				'markaroo_invalid_email',
				__( 'Please enter a valid email address.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		// Context appended for support triage — disclosed on the form.
		$version = defined( 'MARKAROO_VERSION' ) ? MARKAROO_VERSION : '';
		$body    = $message . "\n\n---\n"
			. 'From: ' . $name . ' <' . $email . ">\n"
			. 'Site: ' . home_url() . "\n"
			. 'Plugin version: ' . $version . "\n"
			. 'WordPress: ' . get_bloginfo( 'version' );

		$sent = wp_mail(
			self::RECIPIENT,
			'[Markaroo Feedback] ' . $subject,
			$body,
			array( 'Reply-To: ' . $name . ' <' . $email . '>' )
		);

		if ( ! $sent ) {
			return new \WP_Error(
				'markaroo_send_failed',
				__( 'The message could not be sent. Please try again later.', 'markaroo' ),
				array( 'status' => 500 )
			);
		}

		set_transient( self::RATE_KEY, 1, MINUTE_IN_SECONDS );

		/**
		 * Fires after a plugin feedback message is sent.
		 *
		 * @param string $subject The message subject.
		 * @param string $email   The submitter's email.
		 */
		do_action( 'markaroo/plugin_feedback/sent', $subject, $email );

		return rest_ensure_response( array( 'sent' => true ) );
	}
}
