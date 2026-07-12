<?php

namespace Markaroo\Repositories;

defined( 'ABSPATH' ) || exit;

class FeedbackRepository {

	/**
	 * Columns returned in 'summary' field mode. Excludes the longtext/detail
	 * columns (comment stays — list consumers render it): page_url,
	 * screenshot_rect, attachments, user_agent are only needed on the single
	 * item endpoint and would bloat every list query otherwise.
	 */
	private const SUMMARY_COLUMNS = 'id, page_key, title, comment, status, priority, assigned_to_id, assigned_to_name, x, y, viewport, tags, due_date, share_id, os, browser, screenshot_id, screenshot_path, author, author_id, created_at, updated_at';

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
	 *   @type string $fields     'full' (SELECT *) or 'summary' (list columns only). Default 'full'.
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
				'fields'   => 'full',
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

		// Tags are a JSON array of strings, so a quoted-value LIKE matches whole
		// tags only. Filtering in SQL keeps COUNT/LIMIT/pagination correct.
		if ( ! empty( $args['tag'] ) ) {
			$tag      = sanitize_text_field( $args['tag'] );
			$wheres[] = 'tags LIKE %s';
			$values[] = '%' . $wpdb->esc_like( wp_json_encode( $tag ) ) . '%';
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
		$columns    = 'summary' === $args['fields'] ? self::SUMMARY_COLUMNS : '*';
		$select_sql = "SELECT {$columns} FROM {$table} WHERE {$where_sql} ORDER BY {$order_by} {$order} LIMIT %d OFFSET %d"; // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$row_values = array_merge( $values, array( $per_page, $offset ) );
		$rows       = (array) $wpdb->get_results( $wpdb->prepare( $select_sql, $row_values ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

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
		global $wpdb;
		$table = $wpdb->prefix . 'markaroo_feedback';

		return $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", $id ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		) ?: null;
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

		global $wpdb;

		$result = $wpdb->insert( $wpdb->prefix . 'markaroo_feedback', $data );

		if ( false === $result ) {
			return false;
		}

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

		global $wpdb;

		// 0 affected rows (no-op update) still counts as success; only a query
		// error returns false.
		return false !== $wpdb->update( $wpdb->prefix . 'markaroo_feedback', $data, array( 'id' => $id ), null, array( '%d' ) );
	}

	/**
	 * Delete a feedback row and its replies.
	 */
	public function delete( int $id ): bool {
		global $wpdb;

		$wpdb->delete( $wpdb->prefix . 'markaroo_replies', array( 'feedback_id' => $id ), array( '%d' ) );

		return (bool) $wpdb->delete( $wpdb->prefix . 'markaroo_feedback', array( 'id' => $id ), array( '%d' ) );
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
	 * Set an already-validated status slug on a feedback row.
	 */
	public function set_status( int $id, string $status ): bool {
		return $this->update( $id, array( 'status' => $status ) );
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
		$start = gmdate( 'Y-m-d 00:00:00', current_time( 'timestamp' ) );
		$end   = gmdate( 'Y-m-d 00:00:00', current_time( 'timestamp' ) + DAY_IN_SECONDS );

		// Range comparison (instead of DATE(created_at)) keeps the created_at
		// index usable.
		return (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$table} WHERE created_at >= %s AND created_at < %s", // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$start,
				$end
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
					SUM(status = 'approved') AS approved,
					SUM(status = 'in_progress') AS in_progress,
					SUM(status = 'open' AND due_date IS NOT NULL AND due_date < %s) AS overdue,
					SUM(status = 'open' AND assigned_to_id = 0) AS unassigned
				FROM {$table}",
				$now
			)
		);

		if ( ! $row ) {
			return array( 'open' => 0, 'in_progress' => 0, 'resolved' => 0, 'approved' => 0, 'overdue' => 0, 'unassigned' => 0, 'total' => 0 );
		}

		return array(
			'open'       => (int) $row->open,
			'in_progress' => (int) $row->in_progress,
			'resolved'   => (int) $row->resolved,
			'approved'    => (int) $row->approved,
			'overdue'    => (int) $row->overdue,
			'unassigned' => (int) $row->unassigned,
			'total'      => (int) $row->total,
		);
	}
}
