<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\FeedbackRepository;

defined( 'ABSPATH' ) || exit;

class CountsController {

	// GET /counts
	public static function index( \WP_REST_Request $request ): \WP_REST_Response {
		$repo     = new FeedbackRepository();
		$page_key = sanitize_text_field( $request->get_param( 'page_key' ) ?? '' );

		$totals      = $repo->totals();
		$page_counts = ! empty( $page_key ) ? $repo->counts_for_page( $page_key ) : array();

		$resolution_rate = $totals['total'] > 0
			? round( ( $totals['resolved'] / $totals['total'] ) * 100, 1 )
			: 0.0;

		$payload = array(
			// Flat aliases for JS convenience.
			'total'           => $totals['total'],
			'open'            => $totals['open'],
			'resolved'        => $totals['resolved'],
			'overdue'         => $totals['overdue'],
			'unassigned'      => $totals['unassigned'],
			'today'           => $repo->count_today(),
			'resolution_rate' => $resolution_rate,
			'by_priority'     => $repo->counts_by_priority(),
			'by_page'         => $repo->counts_by_page( 20 ),
			// Full totals sub-object for back-compat.
			'totals'          => $totals,
			'page'            => $page_counts,
		);

		/**
		 * Filters extra analytics metrics to include in the /counts response.
		 * Pro can add avg_time_to_resolve, workload_by_assignee, etc.
		 *
		 * @param array $extra   Additional metric key-value pairs.
		 * @param array $payload Base counts payload.
		 */
		$extra   = (array) apply_filters( 'markaroo/analytics/metrics', array(), $payload );
		$payload = array_merge( $payload, $extra );

		/**
		 * Filters the /counts response payload.
		 * Pro can inject workload-per-assignee, sprint analytics, etc.
		 *
		 * @param array $payload Counts data.
		 */
		$payload = (array) apply_filters( 'markaroo/counts/response', $payload );

		return rest_ensure_response( $payload );
	}
}
