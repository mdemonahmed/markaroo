<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

class SettingsController {

	/** Per-user meta key holding saved task-list filter combinations. */
	const SAVED_FILTERS_META = 'markaroo_saved_filters';

	// GET /settings
	public static function show( \WP_REST_Request $request ): \WP_REST_Response {
		return rest_ensure_response( self::payload() );
	}

	// PATCH /settings
	public static function update( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$body = $request->get_json_params();

		if ( ! is_array( $body ) || empty( $body ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'No settings provided.', 'markaroo' ), array( 'status' => 400 ) );
		}

		// Per-user saved filters are stored in user meta, not the global option.
		if ( array_key_exists( 'saved_filters', $body ) ) {
			self::save_filters( $body['saved_filters'] );
			unset( $body['saved_filters'] );
		}

		if ( ! empty( $body ) ) {
			Settings::update( $body );
		}

		return rest_ensure_response( self::payload() );
	}

	/**
	 * The settings payload returned to the admin: the global settings plus the
	 * current user's saved filters (per-user, from user meta).
	 *
	 * @return array<string, mixed>
	 */
	private static function payload(): array {
		$data                  = Settings::all();
		$data['saved_filters'] = self::get_filters();

		return $data;
	}

	/**
	 * Read the current user's saved filters.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private static function get_filters(): array {
		$stored = get_user_meta( get_current_user_id(), self::SAVED_FILTERS_META, true );

		return is_array( $stored ) ? array_values( $stored ) : array();
	}

	/**
	 * Sanitize and persist the current user's saved filters.
	 *
	 * @param mixed $filters Raw array of { name, filters } objects.
	 */
	private static function save_filters( $filters ): void {
		$clean = array();

		foreach ( (array) $filters as $entry ) {
			$entry = (array) $entry;
			$name  = sanitize_text_field( $entry['name'] ?? '' );

			if ( '' === $name ) {
				continue;
			}

			$f = (array) ( $entry['filters'] ?? array() );

			$clean[] = array(
				'name'    => $name,
				'filters' => array(
					'status'   => sanitize_text_field( $f['status'] ?? '' ),
					'priority' => sanitize_text_field( $f['priority'] ?? '' ),
					'assignee' => absint( $f['assignee'] ?? 0 ),
					'tag'      => sanitize_text_field( $f['tag'] ?? '' ),
				),
			);
		}

		// Cap to a sane number of saved views per user.
		$clean = array_slice( $clean, 0, 30 );

		update_user_meta( get_current_user_id(), self::SAVED_FILTERS_META, $clean );
	}
}
