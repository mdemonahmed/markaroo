<?php

namespace Markaroo\Http\Controllers;

defined( 'ABSPATH' ) || exit;

class UsersController {

	// GET /users
	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$search = sanitize_text_field( $request->get_param( 'search' ) ?? '' );

		$args = array(
			'number'  => 50,
			'orderby' => 'display_name',
			'order'   => 'ASC',
			'fields'  => array( 'ID', 'display_name', 'user_email' ),
		);

		if ( ! empty( $search ) ) {
			$args['search']         = '*' . $search . '*';
			$args['search_columns'] = array( 'display_name', 'user_email', 'user_login' );
		}

		$wp_users = get_users( $args );
		$users    = array();

		foreach ( $wp_users as $user ) {
			$users[] = array(
				'id'     => (int) $user->ID,
				'name'   => esc_html( $user->display_name ),
				'avatar' => esc_url( get_avatar_url( $user->ID, array( 'size' => 32 ) ) ),
			);
		}

		/**
		 * Filters the user list returned by the /users endpoint.
		 * Pro can add external users, restrict by role, or inject client accounts.
		 *
		 * @param array            $users   Array of {id, name, avatar} maps.
		 * @param WP_REST_Request  $request The current REST request.
		 */
		$users = (array) apply_filters( 'markaroo/mention/candidates', $users, $request );

		return rest_ensure_response( $users );
	}
}
