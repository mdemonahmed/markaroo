<?php

namespace Markaroo\Repositories;

use Markaroo\Models\Share;
use Markaroo\WPBones\Database\Support\Model as Row;

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
		return self::row_or_null( Share::where( 'id', $id )->first() );
	}

	/**
	 * Find a share link by its token string.
	 */
	public function find_by_token( string $token ): ?object {
		return self::row_or_null( Share::where( 'token', $token )->first() );
	}

	/**
	 * Normalize a WP Bones first() result to a real row or null.
	 *
	 * On no match, the query builder's first() returns an empty Collection
	 * (which is truthy), not false/null — so `?: null` never catches it. A real
	 * hydrated row is a Support\Model; anything else means "not found".
	 *
	 * @param mixed $result Raw first() return value.
	 */
	private static function row_or_null( $result ): ?object {
		return $result instanceof Row ? $result : null;
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

	/**
	 * Return the single site-wide guest token, creating one if needed.
	 *
	 * The free plugin uses exactly one site-wide guest link. A clean, current
	 * row (scope = 'site') is returned as-is. If the table is empty, or only
	 * holds legacy/multi-row data (e.g. an old page-scoped link), it is
	 * collapsed to one fresh site-wide token so guests are never restricted by
	 * stale scope/permission columns.
	 */
	public function get_or_create_singleton(): object {
		$existing = self::row_or_null( Share::orderBy( 'created_at', 'DESC' )->first() );

		if ( $existing && 'site' === (string) $existing->scope ) {
			return $existing;
		}

		// No usable row: wipe any legacy rows and establish one clean token.
		foreach ( $this->list() as $row ) {
			$this->revoke( (int) $row->id );
		}

		$id = $this->create(
			array(
				'scope'       => 'site',
				'can_view'    => 1,
				'can_comment' => 1,
				'widget_mode' => 'comment',
				'created_by'  => (int) get_current_user_id(),
			)
		);

		return $this->find( (int) $id );
	}

	/**
	 * Wipe every share row and insert one fresh site-wide token.
	 *
	 * @return object The new share row.
	 */
	public function regenerate(): object {
		foreach ( $this->list() as $row ) {
			$this->revoke( (int) $row->id );
		}

		$id = $this->create(
			array(
				'scope'       => 'site',
				'can_view'    => 1,
				'can_comment' => 1,
				'widget_mode' => 'comment',
				'created_by'  => (int) get_current_user_id(),
			)
		);

		return $this->find( (int) $id );
	}
}
