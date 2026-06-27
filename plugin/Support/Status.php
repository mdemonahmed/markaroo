<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Canonical feedback/task status model (Task 26 §5).
 *
 * One status string lives on every wp_markaroo_feedback row. Badges, filters,
 * the dashboard resolution rate, and approvals all read it. Always validate an
 * incoming value against allowed() before persisting.
 */
class Status {

	const OPEN        = 'open';
	const IN_PROGRESS = 'in_progress';
	const RESOLVED    = 'resolved';
	const APPROVED    = 'approved';
	const REOPENED    = 'reopened';

	/**
	 * The built-in status slugs in lifecycle order.
	 *
	 * @return string[]
	 */
	public static function all(): array {
		return array(
			self::OPEN,
			self::IN_PROGRESS,
			self::RESOLVED,
			self::APPROVED,
			self::REOPENED,
		);
	}

	/**
	 * The allow-list used for validation. Pro can register custom statuses.
	 *
	 * @return string[]
	 */
	public static function allowed(): array {
		/**
		 * Filters the set of valid status slugs.
		 * Pro uses this to add custom statuses (e.g. 'wont_fix').
		 *
		 * @param string[] $statuses Allowed status slugs.
		 */
		return array_values( array_unique( (array) apply_filters( 'markaroo/status/statuses', self::all() ) ) );
	}

	/**
	 * Whether a value is a valid status slug.
	 */
	public static function is_valid( string $status ): bool {
		return in_array( $status, self::allowed(), true );
	}

	/**
	 * Human-readable label for a status slug.
	 */
	public static function label( string $status ): string {
		$map = array(
			self::OPEN        => __( 'Open', 'markaroo' ),
			self::IN_PROGRESS => __( 'In progress', 'markaroo' ),
			self::RESOLVED    => __( 'Resolved', 'markaroo' ),
			self::APPROVED    => __( 'Approved', 'markaroo' ),
			self::REOPENED    => __( 'Reopened', 'markaroo' ),
		);

		return $map[ $status ] ?? ucfirst( str_replace( '_', ' ', $status ) );
	}

	/**
	 * Map of status slug → CSS color token (used by badges).
	 *
	 * @return array<string, string>
	 */
	public static function colors(): array {
		return array(
			self::OPEN        => '--mk-info',
			self::IN_PROGRESS => '--mk-warning',
			self::RESOLVED    => '--mk-success',
			self::APPROVED    => '--mk-primary',
			self::REOPENED    => '--mk-info',
		);
	}

	/**
	 * The raw [{value,label}] list for JS, before the markaroo/status/list filter.
	 *
	 * @return array<int, array{value:string,label:string}>
	 */
	public static function list_raw(): array {
		return array_map(
			static fn( string $s ) => array( 'value' => $s, 'label' => self::label( $s ) ),
			self::all()
		);
	}

	/**
	 * Fire the canonical status-change action. Pro hooks this for integrations
	 * (Slack, email digests, PM sync).
	 *
	 * @param int    $feedback_id Feedback row ID.
	 * @param string $old         Previous status.
	 * @param string $new         New status.
	 */
	public static function changed( int $feedback_id, string $old, string $new ): void {
		if ( $old === $new ) {
			return;
		}

		/**
		 * Fires whenever a feedback item's status changes.
		 *
		 * @param int    $feedback_id The feedback ID.
		 * @param string $old         Previous status slug.
		 * @param string $new         New status slug.
		 * @param int    $user_id     User who made the change (0 = guest/system).
		 */
		do_action( 'markaroo/status/changed', $feedback_id, $old, $new, get_current_user_id() );
	}
}
