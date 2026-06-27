<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * First-run onboarding endpoints. Every route is gated by manage_options in
 * RestServiceProvider. The onboarded flag lives in the `markaroo_onboarded`
 * option (CLAUDE.md option prefix), wizard answers in `markaroo_onboarding`.
 */
class OnboardingController {

	const ONBOARDED_OPTION  = 'markaroo_onboarded';
	const ONBOARDING_OPTION = 'markaroo_onboarding';
	const ACCESS_OPTION     = 'markaroo_access_configured';

	// -----------------------------------------------------------------------
	// POST /onboarding/complete — mark onboarding finished (or skipped).
	// -----------------------------------------------------------------------
	public static function complete( \WP_REST_Request $request ): \WP_REST_Response {
		update_option( self::ONBOARDED_OPTION, '1' );
		delete_transient( 'markaroo_show_welcome' );

		/**
		 * Fires once the user completes or skips onboarding.
		 *
		 * @param array $answers Stored wizard answers.
		 */
		do_action( 'markaroo/onboarding/completed', (array) get_option( self::ONBOARDING_OPTION, array() ) );

		return rest_ensure_response( array( 'onboarded' => true ) );
	}

	// -----------------------------------------------------------------------
	// POST /onboarding/step — persist one wizard step and apply its settings.
	// -----------------------------------------------------------------------
	public static function step( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$step = absint( $request->get_param( 'step' ) );
		$data = $request->get_param( 'data' );

		if ( $step < 1 || $step > 3 || ! is_array( $data ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'Invalid onboarding step.', 'markaroo' ), array( 'status' => 400 ) );
		}

		// Record raw answers for the checklist / Pro extensions.
		$stored                    = (array) get_option( self::ONBOARDING_OPTION, array() );
		$stored[ 'step' . $step ]  = $data;
		update_option( self::ONBOARDING_OPTION, $stored );

		// Translate the answers into real settings (Settings::sanitize whitelists keys).
		if ( 1 === $step && isset( $data['access'] ) ) {
			$mode = sanitize_text_field( $data['access'] );
			Settings::update(
				array( 'access' => array( 'allow_guest_links' => ( 'team_only' !== $mode ) ) )
			);
			update_option( self::ACCESS_OPTION, '1' );
		}

		if ( 2 === $step ) {
			Settings::update(
				array(
					'general' => array( 'enable_screenshots' => ! empty( $data['screenshots'] ) ),
					'capture' => array( 'enable_area_select' => ! empty( $data['annotate'] ) ),
				)
			);
		}

		return rest_ensure_response( self::checklist() );
	}

	// -----------------------------------------------------------------------
	// GET /onboarding/state — checklist completion for the final wizard step.
	// -----------------------------------------------------------------------
	public static function state( \WP_REST_Request $request ): \WP_REST_Response {
		return rest_ensure_response( self::checklist() );
	}

	/**
	 * Compute the 3-item Getting Started checklist.
	 *
	 * @return array{has_feedback: bool, has_share_link: bool, access_set: bool, items: array, done: bool}
	 */
	private static function checklist(): array {
		$has_feedback   = wp_markaroo_count_feedback() > 0;
		$has_share_link = wp_markaroo_count_share_links() > 0;
		$access_set     = (bool) get_option( self::ACCESS_OPTION, false );

		$items = array(
			array(
				'key'    => 'has_feedback',
				'title'  => __( 'Try it on your live site', 'markaroo' ),
				'help'   => __( 'Open any page, click the Markaroo button, and drop a pin.', 'markaroo' ),
				'action' => __( 'Open my site', 'markaroo' ),
				'done'   => $has_feedback,
			),
			array(
				'key'    => 'has_share_link',
				'title'  => __( 'Share a no-login link', 'markaroo' ),
				'help'   => __( 'Generate a guest link a client can open without an account.', 'markaroo' ),
				'action' => __( 'Create link', 'markaroo' ),
				'done'   => $has_share_link,
			),
			array(
				'key'    => 'access_set',
				'title'  => __( 'Invite a teammate or set access', 'markaroo' ),
				'help'   => __( 'Configure who can give feedback.', 'markaroo' ),
				'action' => __( 'Open settings', 'markaroo' ),
				'done'   => $access_set,
			),
		);

		/**
		 * Filters the Getting Started checklist items (Task 26 §6 Pro seam).
		 *
		 * @param array[] $items Each: key,title,help,action,done.
		 */
		$items = (array) apply_filters( 'markaroo/checklist/items', $items );

		$done = true;
		foreach ( $items as $it ) {
			if ( empty( $it['done'] ) ) {
				$done = false;
				break;
			}
		}

		return array(
			'has_feedback'   => $has_feedback,
			'has_share_link' => $has_share_link,
			'access_set'     => $access_set,
			'items'          => array_values( $items ),
			'done'           => $done,
		);
	}
}
