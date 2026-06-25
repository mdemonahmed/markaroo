<?php

namespace Markaroo\Models;

use Markaroo\WPBones\Database\Model;

defined( 'ABSPATH' ) || exit;

/**
 * Eloquent-style model for the wp_markaroo_feedback table.
 *
 * JSON columns (attachments, tags, screenshot_rect) are decoded by accessors.
 * Priority and status labels are surfaced as virtual properties.
 */
class Feedback extends Model {

	protected $table    = 'markaroo_feedback';
	protected $usePrefix = true;

	/** Resolve priority slug to a human label. */
	public function getPriorityLabelAttribute( string $value ): string {
		$map = array(
			'urgent' => __( 'Urgent', 'markaroo' ),
			'high'   => __( 'High', 'markaroo' ),
			'normal' => __( 'Normal', 'markaroo' ),
			'low'    => __( 'Low', 'markaroo' ),
		);

		return $map[ $value ] ?? ucfirst( $value );
	}

	/** Resolve status slug to a human label. */
	public function getStatusLabelAttribute( string $value ): string {
		$map = array(
			'open'     => __( 'Open', 'markaroo' ),
			'resolved' => __( 'Resolved', 'markaroo' ),
		);

		return $map[ $value ] ?? ucfirst( $value );
	}

	/** Decode the JSON attachments column to an array. */
	public function getAttachmentsAttribute( ?string $value ): array {
		if ( empty( $value ) ) {
			return array();
		}

		$decoded = json_decode( $value, true );

		return is_array( $decoded ) ? $decoded : array();
	}

	/** Decode the JSON tags column to an array. */
	public function getTagsAttribute( ?string $value ): array {
		if ( empty( $value ) ) {
			return array();
		}

		$decoded = json_decode( $value, true );

		return is_array( $decoded ) ? $decoded : array();
	}

	/** Decode the JSON screenshot_rect column to an array. */
	public function getScreenshotRectAttribute( ?string $value ): array {
		if ( empty( $value ) ) {
			return array();
		}

		$decoded = json_decode( $value, true );

		return is_array( $decoded ) ? $decoded : array();
	}

	/**
	 * Return all replies for this feedback row.
	 *
	 * @return array<int, object>
	 */
	public function replies(): array {
		return Reply::where( 'feedback_id', $this->attributes['id'] )->get() ?: array();
	}
}
