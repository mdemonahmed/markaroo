<?php

namespace Markaroo\Http\Controllers;

defined( 'ABSPATH' ) || exit;

/**
 * File attachment upload endpoint.
 * Full implementation added in Task 15.
 */
class AttachmentsController {

	// POST /attachments
	public static function create( \WP_REST_Request $request ): \WP_REST_Response {
		$response = rest_ensure_response( array() );
		$response->set_status( 201 );

		return $response;
	}
}
