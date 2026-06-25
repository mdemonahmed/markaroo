<?php

namespace Markaroo\Models;

use Markaroo\WPBones\Database\Model;

defined( 'ABSPATH' ) || exit;

/**
 * Eloquent-style model for the wp_markaroo_shares table.
 */
class Share extends Model {

	protected $table     = 'markaroo_shares';
	protected $usePrefix = true;

	/**
	 * Whether this share link has passed its expiry date.
	 * Returns false when no expiry is set (link never expires).
	 */
	public function is_expired(): bool {
		$expires = $this->attributes['expires_at'] ?? null;

		if ( empty( $expires ) || '0000-00-00 00:00:00' === $expires ) {
			return false;
		}

		return strtotime( $expires ) < time();
	}

	/**
	 * Generate a secure random token for a new share link.
	 */
	public static function generate_token(): string {
		return wp_generate_password( 48, false );
	}
}
