<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\ShareRepository;

defined( 'ABSPATH' ) || exit;

class ShareController {

	// -----------------------------------------------------------------------
	// GET /shares
	// -----------------------------------------------------------------------

	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$repo   = new ShareRepository();
		$shares = $repo->list();

		return rest_ensure_response(
			array_map( array( __CLASS__, 'format_item' ), $shares )
		);
	}

	// -----------------------------------------------------------------------
	// POST /shares
	// -----------------------------------------------------------------------

	public static function create( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$scope    = in_array( $request->get_param( 'scope' ), array( 'site', 'page' ), true )
			? $request->get_param( 'scope' )
			: 'site';
		$page_key = sanitize_text_field( $request->get_param( 'page_key' ) ?? '' );

		if ( 'page' === $scope && empty( $page_key ) ) {
			return new \WP_Error(
				'markaroo_invalid',
				__( 'page_key is required for page-scoped share links.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		$expires_at = null;
		$expires_raw = $request->get_param( 'expires_at' );
		if ( ! empty( $expires_raw ) ) {
			$ts = strtotime( $expires_raw );
			if ( $ts ) {
				$expires_at = gmdate( 'Y-m-d H:i:s', $ts );
			}
		}

		$repo = new ShareRepository();
		$id   = $repo->create(
			array(
				'label'       => sanitize_text_field( $request->get_param( 'label' ) ?? '' ),
				'scope'       => $scope,
				'page_key'    => $page_key,
				'can_view'    => (int) (bool) ( $request->get_param( 'can_view' ) ?? true ),
				'can_comment' => (int) (bool) ( $request->get_param( 'can_comment' ) ?? true ),
				'widget_mode' => in_array( $request->get_param( 'widget_mode' ), array( 'comment', 'view', 'clean' ), true )
					? $request->get_param( 'widget_mode' )
					: 'comment',
				'expires_at'  => $expires_at,
				'created_by'  => (int) get_current_user_id(),
			)
		);

		if ( ! $id ) {
			return new \WP_Error( 'markaroo_create_failed', __( 'Could not create share link.', 'markaroo' ), array( 'status' => 500 ) );
		}

		$share = $repo->find( $id );

		/**
		 * Fires after a share link is created.
		 *
		 * @param object $share The new share row.
		 */
		do_action( 'markaroo/share/created', $share );

		$response = rest_ensure_response( self::format_item( $share ) );
		$response->set_status( 201 );

		return $response;
	}

	// -----------------------------------------------------------------------
	// DELETE /shares/{id}
	// -----------------------------------------------------------------------

	public static function destroy( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$repo  = new ShareRepository();
		$share = $repo->find( (int) $request['id'] );

		if ( ! $share ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Share link not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$repo->revoke( (int) $request['id'] );

		/**
		 * Fires after a share link is revoked.
		 *
		 * @param object $share The revoked share row snapshot.
		 */
		do_action( 'markaroo/share/revoked', $share );

		return rest_ensure_response( array( 'deleted' => true ) );
	}

	// -----------------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------------

	/**
	 * Format a share row for REST output.
	 *
	 * Includes share_url so admin UI can render a copy-link button without
	 * constructing it client-side.
	 *
	 * @param object|null $row Raw share row.
	 * @return array<string, mixed>
	 */
	public static function format_item( ?object $row ): array {
		if ( ! $row ) {
			return array();
		}

		$item = (array) $row;

		foreach ( array( 'id', 'can_view', 'can_comment', 'created_by' ) as $col ) {
			if ( isset( $item[ $col ] ) ) {
				$item[ $col ] = (int) $item[ $col ];
			}
		}

		$item['share_url'] = esc_url_raw(
			add_query_arg( 'markaroo_share', $row->token, home_url( '/' ) )
		);

		$item['is_expired'] = ! empty( $row->expires_at )
			&& strtotime( $row->expires_at ) < time();

		return $item;
	}
}
