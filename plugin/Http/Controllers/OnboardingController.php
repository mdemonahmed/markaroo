<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\FeedbackRepository;
use Markaroo\Repositories\ShareRepository;
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
	 * @return array{configured: bool, has_share_link: bool, has_feedback: bool}
	 */
	private static function checklist(): array {
		$stored = (array) get_option( self::ONBOARDING_OPTION, array() );

		$shares   = ( new ShareRepository() )->list();
		$feedback = ( new FeedbackRepository() )->totals();

		return array(
			'configured'     => isset( $stored['step1'] ) || isset( $stored['step2'] ),
			'has_share_link' => ! empty( $shares ),
			'has_feedback'   => ( (int) ( $feedback['total'] ?? 0 ) ) > 0,
		);
	}
}
