<?php

namespace Markaroo\Repositories;

use Markaroo\Models\Feedback;

defined( 'ABSPATH' ) || exit;

class FeedbackRepository {

	/**
	 * Return a paginated, filtered list of feedback rows.
	 *
	 * @param array $args {
	 *   @type string $page_key   Filter by page key.
	 *   @type string $status     open|resolved
	 *   @type string $priority   urgent|high|normal|low
	 *   @type int    $assignee   WP user ID.
	 *   @type string $tag        Single tag string.
	 *   @type string $search     Free-text search against comment/author.
	 *   @type string $order_by   Column name. Default 'created_at'.
	 *   @type string $order      ASC|DESC. Default 'DESC'.
	 *   @type int    $per_page   Default 20.
	 *   @type int    $page       1-indexed page number. Default 1.
	 * }
	 * @param string $context Optional context string passed to the filter.
	 * @return array{ items: array, total: int, pages: int }
	 */
	public function list( array $args = array(), string $context = 'list' ): array {
		global $wpdb;

		$args = wp_parse_args(
			$args,
			array(
				'page_key' => '',
				'status'   => '',
				'priority' => '',
				'assignee' => 0,
				'tag'      => '',
				'search'   => '',
				'order_by' => 'created_at',
				'order'    => 'DESC',
				'per_page' => 20,
				'page'     => 1,
			)
		);

		/**
		 * Filters the query args before the feedback list query runs.
		 *
		 * @param array  $args    Query arguments.
		 * @param string $context Request context.
		 */
		$args = (array) apply_filters( 'markaroo/feedback/query_args', $args, $context );

		$table  = $wpdb->prefix . 'markaroo_feedback';
		$wheres = array( '1=1' );
		$values = array();

		if ( ! empty( $args['page_key'] ) ) {
			$wheres[] = 'page_key = %s';
			$values[] = sanitize_text_field( $args['page_key'] );
		}

		if ( ! empty( $args['status'] ) ) {
			$wheres[] = 'status = %s';
			$values[] = sanitize_text_field( $args['status'] );
		}

		if ( ! empty( $args['priority'] ) ) {
			$wheres[] = 'priority = %s';
			$values[] = sanitize_text_field( $args['priority'] );
		}

		if ( ! empty( $args['assignee'] ) ) {
			$wheres[] = 'assigned_to_id = %d';
			$values[] = absint( $args['assignee'] );
		}

		if ( ! empty( $args['search'] ) ) {
			$like     = '%' . $wpdb->esc_like( sanitize_text_field( $args['search'] ) ) . '%';
			$wheres[] = '(comment LIKE %s OR author LIKE %s)';
			$values[] = $like;
			$values[] = $like;
		}

		$where_sql = implode( ' AND ', $wheres );

		$allowed_order_by = array( 'created_at', 'updated_at', 'priority', 'status', 'due_date', 'author' );
		$order_by         = in_array( $args['order_by'], $allowed_order_by, true ) ? $args['order_by'] : 'created_at';
		$order            = 'ASC' === strtoupper( $args['order'] ) ? 'ASC' : 'DESC';

		$per_page = max( 1, absint( $args['per_page'] ) );
		$offset   = ( max( 1, absint( $args['page'] ) ) - 1 ) * $per_page;

		// Count total matching rows.
		$count_sql = "SELECT COUNT(*) FROM {$table} WHERE {$where_sql}";
		$total     = (int) ( empty( $values )
			? $wpdb->get_var( $count_sql ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			: $wpdb->get_var( $wpdb->prepare( $count_sql, $values ) ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		// Fetch rows.
		$select_sql = "SELECT * FROM {$table} WHERE {$where_sql} ORDER BY {$order_by} {$order} LIMIT %d OFFSET %d"; // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$row_values = array_merge( $values, array( $per_page, $offset ) );
		$rows       = (array) $wpdb->get_results( $wpdb->prepare( $select_sql, $row_values ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		// Tag filter (post-query, JSON column).
		if ( ! empty( $args['tag'] ) ) {
			$tag   = sanitize_text_field( $args['tag'] );
			$rows  = array_values(
				array_filter(
					$rows,
					static function ( $row ) use ( $tag ) {
						$tags = json_decode( $row->tags ?? '[]', true );
						return is_array( $tags ) && in_array( $tag, $tags, true );
					}
				)
			);
			$total = count( $rows );
		}

		return array(
			'items' => $rows,
			'total' => $total,
			'pages' => $per_page > 0 ? (int) ceil( $total / $per_page ) : 1,
		);
	}

	/**
	 * Return a single feedback row by ID, or null if not found.
	 */
	public function find( int $id ): ?object {
		return Feedback::where( 'id', $id )->first() ?: null;
	}

	/**
	 * Insert a new feedback row. Returns the new row ID or false on failure.
	 *
	 * @param array $data Column values (unsanitized — caller must sanitize).
	 * @return int|false
	 */
	public function create( array $data ) {
		$now  = current_time( 'mysql' );
		$data = array_merge(
			array(
				'status'     => 'open',
				'priority'   => 'normal',
				'created_at' => $now,
				'updated_at' => $now,
			),
			$data
		);

		// Encode JSON columns.
		foreach ( array( 'attachments', 'tags', 'screenshot_rect' ) as $col ) {
			if ( isset( $data[ $col ] ) && is_array( $data[ $col ] ) ) {
				$data[ $col ] = wp_json_encode( $data[ $col ] );
			}
		}

		$result = Feedback::insert( $data );

		if ( false === $result ) {
			return false;
		}

		global $wpdb;

		return (int) $wpdb->insert_id;
	}

	/**
	 * Update columns on an existing feedback row.
	 *
	 * @param int   $id   Feedback ID.
	 * @param array $data Column values to update.
	 * @return bool
	 */
	public function update( int $id, array $data ): bool {
		$data['updated_at'] = current_time( 'mysql' );

		foreach ( array( 'attachments', 'tags', 'screenshot_rect' ) as $col ) {
			if ( isset( $data[ $col ] ) && is_array( $data[ $col ] ) ) {
				$data[ $col ] = wp_json_encode( $data[ $col ] );
			}
		}

		return (bool) Feedback::where( 'id', $id )->update( $data );
	}

	/**
	 * Delete a feedback row and its replies.
	 */
	public function delete( int $id ): bool {
		global $wpdb;

		$wpdb->delete( $wpdb->prefix . 'markaroo_replies', array( 'feedback_id' => $id ), array( '%d' ) );

		return (bool) Feedback::where( 'id', $id )->delete();
	}

	/** Mark feedback as resolved. */
	public function resolve( int $id ): bool {
		return $this->update( $id, array( 'status' => 'resolved' ) );
	}

	/** Mark feedback as open (unresolved). */
	public function unresolve( int $id ): bool {
		return $this->update( $id, array( 'status' => 'open' ) );
	}

	/**
	 * Return open/resolved counts for a given page key.
	 *
	 * @return array{ open: int, resolved: int, total: int }
	 */
	public function counts_for_page( string $page_key ): array {
		global $wpdb;

		$table = $wpdb->prefix . 'markaroo_feedback';
		$rows  = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT status, COUNT(*) AS cnt FROM {$table} WHERE page_key = %s GROUP BY status", // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$page_key
			)
		);

		$counts = array( 'open' => 0, 'resolved' => 0, 'total' => 0 );

		foreach ( (array) $rows as $row ) {
			$counts[ $row->status ] = (int) $row->cnt;
			$counts['total']       += (int) $row->cnt;
		}

		return $counts;
	}

	/**
	 * Count feedback items created today (WP local time).
	 */
	public function count_today(): int {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_feedback';
		$today = gmdate( 'Y-m-d', current_time( 'timestamp' ) );

		return (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$table} WHERE DATE(created_at) = %s", // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$today
			)
		);
	}

	/**
	 * Return feedback counts grouped by priority.
	 *
	 * @return array<string, int>  e.g. ['urgent'=>2,'high'=>5,'normal'=>11,'low'=>3]
	 */
	public function counts_by_priority(): array {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_feedback';
		$rows  = (array) $wpdb->get_results(
			"SELECT priority, COUNT(*) AS cnt FROM {$table} GROUP BY priority" // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		);

		$map = array();
		foreach ( $rows as $row ) {
			$map[ $row->priority ] = (int) $row->cnt;
		}

		return $map;
	}

	/**
	 * Return feedback counts per page_key, descending.
	 *
	 * @param int $limit Max rows to return. Default 20.
	 * @return array<array{page_key:string,count:int}>
	 */
	public function counts_by_page( int $limit = 20 ): array {
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_feedback';
		$rows  = (array) $wpdb->get_results(
			$wpdb->prepare(
				"SELECT page_key, COUNT(*) AS cnt FROM {$table} GROUP BY page_key ORDER BY cnt DESC LIMIT %d", // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$limit
			)
		);

		return array_map(
			static fn( $r ) => array( 'page_key' => $r->page_key, 'count' => (int) $r->cnt ),
			$rows
		);
	}

	/**
	 * Return site-wide totals (open, resolved, overdue, unassigned).
	 *
	 * @return array{ open: int, resolved: int, overdue: int, unassigned: int, total: int }
	 */
	public function totals(): array {
		global $wpdb;

		$table = $wpdb->prefix . 'markaroo_feedback';
		$now   = current_time( 'mysql' );

		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT
					COUNT(*) AS total,
					SUM(status = 'open') AS open,
					SUM(status = 'resolved') AS resolved,
					SUM(status = 'open' AND due_date IS NOT NULL AND due_date < %s) AS overdue,
					SUM(status = 'open' AND assigned_to_id = 0) AS unassigned
				FROM {$table}",
				$now
			)
		);

		if ( ! $row ) {
			return array( 'open' => 0, 'resolved' => 0, 'overdue' => 0, 'unassigned' => 0, 'total' => 0 );
		}

		return array(
			'open'       => (int) $row->open,
			'resolved'   => (int) $row->resolved,
			'overdue'    => (int) $row->overdue,
			'unassigned' => (int) $row->unassigned,
			'total'      => (int) $row->total,
		);
	}
}
