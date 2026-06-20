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

		return rest_ensure_response(
			array(
				'totals'          => $totals,
				'resolution_rate' => $resolution_rate,
				'page'            => $page_counts,
			)
		);
	}
}
