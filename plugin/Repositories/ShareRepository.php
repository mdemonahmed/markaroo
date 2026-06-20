<?php

namespace Markaroo\Repositories;

use Markaroo\Models\Share;

defined( 'ABSPATH' ) || exit;

class ShareRepository {

	/**
	 * Return all share links, newest first.
	 *
	 * @return array<int, object>
	 */
	public function list(): array {
		return (array) Share::orderBy( 'created_at', 'DESC' )->get();
	}

	/**
	 * Return a single share link by ID, or null if not found.
	 */
	public function find( int $id ): ?object {
		return Share::where( 'id', $id )->first() ?: null;
	}

	/**
	 * Find a share link by its token string.
	 */
	public function find_by_token( string $token ): ?object {
		return Share::where( 'token', $token )->first() ?: null;
	}

	/**
	 * Create a new share link. Returns the new row ID or false on failure.
	 *
	 * @return int|false
	 */
	public function create( array $data ) {
		$data = array_merge(
			array(
				'token'       => Share::generate_token(),
				'scope'       => 'site',
				'can_comment' => 1,
				'can_view'    => 1,
				'widget_mode' => 'comment',
				'created_at'  => current_time( 'mysql' ),
			),
			$data
		);

		$result = Share::insert( $data );

		if ( false === $result ) {
			return false;
		}

		global $wpdb;

		return (int) $wpdb->insert_id;
	}

	/**
	 * Delete (revoke) a share link by ID.
	 */
	public function revoke( int $id ): bool {
		return (bool) Share::where( 'id', $id )->delete();
	}
}
