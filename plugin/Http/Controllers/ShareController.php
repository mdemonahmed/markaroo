<?php

namespace Markaroo\Http\Controllers;

defined( 'ABSPATH' ) || exit;

/**
 * Guest share link endpoints.
 * Full implementation added in Task 06.
 */
class ShareController {

	// GET /shares
	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		return rest_ensure_response( array() );
	}

	// POST /shares
	public static function create( \WP_REST_Request $request ): \WP_REST_Response {
		$response = rest_ensure_response( array() );
		$response->set_status( 201 );

		return $response;
	}

	// DELETE /shares/{id}
	public static function destroy( \WP_REST_Request $request ): \WP_REST_Response {
		return rest_ensure_response( array( 'deleted' => true ) );
	}
}
