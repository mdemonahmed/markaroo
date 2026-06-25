<?php

namespace Markaroo\Models;

use Markaroo\WPBones\Database\Model;

defined( 'ABSPATH' ) || exit;

/**
 * Eloquent-style model for the wp_markaroo_replies table.
 */
class Reply extends Model {

	protected $table     = 'markaroo_replies';
	protected $usePrefix = true;

	/**
	 * Return the parent Feedback row for this reply.
	 *
	 * @return object|null
	 */
	public function feedback(): ?object {
		return Feedback::where( 'id', $this->attributes['feedback_id'] )->first() ?: null;
	}
}
