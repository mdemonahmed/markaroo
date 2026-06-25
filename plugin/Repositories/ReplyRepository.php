<?php

namespace Markaroo\Repositories;

use Markaroo\Models\Reply;

defined( 'ABSPATH' ) || exit;

class ReplyRepository {

	/**
	 * Return all replies for a feedback item, oldest first.
	 *
	 * @return array<int, object>
	 */
	public function list( int $feedback_id ): array {
		return (array) Reply::where( 'feedback_id', $feedback_id )
			->orderBy( 'created_at', 'ASC' )
			->get();
	}

	/**
	 * Return a single reply by ID, or null if not found.
	 */
	public function find( int $id ): ?object {
		return Reply::where( 'id', $id )->first() ?: null;
	}

	/**
	 * Find a reply by its client-generated UUID.
	 */
	public function find_by_uuid( string $uuid ): ?object {
		return Reply::where( 'reply_uuid', $uuid )->first() ?: null;
	}

	/**
	 * Insert a new reply. Returns the new row ID or false on failure.
	 *
	 * @return int|false
	 */
	public function create( array $data ) {
		$data = array_merge(
			array( 'created_at' => current_time( 'mysql' ) ),
			$data
		);

		$result = Reply::insert( $data );

		if ( false === $result ) {
			return false;
		}

		global $wpdb;

		return (int) $wpdb->insert_id;
	}

	/**
	 * Update a reply's comment text.
	 */
	public function update( int $id, string $comment ): bool {
		return (bool) Reply::where( 'id', $id )->update( array( 'comment' => $comment ) );
	}

	/**
	 * Delete a single reply.
	 */
	public function delete( int $id ): bool {
		return (bool) Reply::where( 'id', $id )->delete();
	}
}
