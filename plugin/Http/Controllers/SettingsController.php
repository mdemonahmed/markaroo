<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

class SettingsController {

	// GET /settings
	public static function show( \WP_REST_Request $request ): \WP_REST_Response {
		return rest_ensure_response( Settings::all() );
	}

	// PATCH /settings
	public static function update( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$body = $request->get_json_params();

		if ( ! is_array( $body ) || empty( $body ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'No settings provided.', 'markaroo' ), array( 'status' => 400 ) );
		}

		Settings::update( $body );

		return rest_ensure_response( Settings::all() );
	}
}
