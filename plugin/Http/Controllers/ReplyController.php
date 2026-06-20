<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\ReplyRepository;

defined( 'ABSPATH' ) || exit;

class ReplyController {

	// PATCH /replies/{id}
	public static function update( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo  = new ReplyRepository();
		$reply = $repo->find( (int) $request['id'] );

		if ( ! $reply ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Reply not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_edit( (int) $reply->author_id ) ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot edit this reply.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$comment = wp_kses_post( $request->get_param( 'comment' ) ?? '' );

		if ( empty( $comment ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'Comment is required.', 'markaroo' ), array( 'status' => 400 ) );
		}

		$repo->update( (int) $request['id'], $comment );

		return rest_ensure_response( $repo->find( (int) $request['id'] ) );
	}

	// DELETE /replies/{id}
	public static function destroy( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo  = new ReplyRepository();
		$reply = $repo->find( (int) $request['id'] );

		if ( ! $reply ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Reply not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		if ( ! wp_markaroo_can_delete( (int) $reply->author_id ) ) {
			return new \WP_Error( 'markaroo_forbidden', __( 'You cannot delete this reply.', 'markaroo' ), array( 'status' => 403 ) );
		}

		$repo->delete( (int) $request['id'] );

		return rest_ensure_response( array( 'deleted' => true ) );
	}
}
