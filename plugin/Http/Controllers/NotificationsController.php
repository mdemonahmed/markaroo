<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Support\Capabilities;
use Markaroo\Support\Notifications\NotificationQueue;

defined( 'ABSPATH' ) || exit;

class NotificationsController {

	// -----------------------------------------------------------------------
	// POST /notifications/test-digest
	// -----------------------------------------------------------------------

	/**
	 * Send a digest notification to the current user on demand, so admins can
	 * verify notification routing without waiting for cron.
	 */
	public static function test_digest( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		if ( ! Capabilities::can_manage() ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot send test notifications.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$user_id = get_current_user_id();
		$sent    = NotificationQueue::send_test_digest( $user_id );

		if ( ! $sent ) {
			return new \WP_Error( 'markaroo_send_failed', __( 'Could not send the test digest.', 'markaroo' ), array( 'status' => 500 ) );
		}

		return rest_ensure_response(
			array(
				'sent'  => true,
				'email' => wp_get_current_user()->user_email,
			)
		);
	}
}
