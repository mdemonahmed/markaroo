<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Thin transient + request-level cache.
 *
 * All keys are prefixed `markaroo_` to avoid collision.
 * TTL is filterable via `markaroo/cache/ttl`.
 * Cache flush fires `markaroo/cache/flush`.
 */
class Cache {

	/** Default TTL in seconds for most transients. */
	const DEFAULT_TTL = 300; // 5 min

	/** Request-level in-memory cache (avoids repeat DB hits in one request). */
	private static array $memo = array();

	/**
	 * Get a cached value. Returns null on miss.
	 *
	 * @param string $key Logical cache key (without prefix).
	 * @return mixed|null
	 */
	public static function get( string $key ) {
		$full_key = self::full_key( $key );

		// Request-level memo (fastest).
		if ( array_key_exists( $full_key, self::$memo ) ) {
			return self::$memo[ $full_key ];
		}

		$value = get_transient( $full_key );

		if ( false === $value ) {
			return null;
		}

		// Warm the request-level memo.
		self::$memo[ $full_key ] = $value;

		return $value;
	}

	/**
	 * Store a value in transient + request memo.
	 *
	 * @param string $key     Logical cache key.
	 * @param mixed  $value   Value to store.
	 * @param int    $ttl     TTL in seconds; 0 = use default.
	 */
	public static function set( string $key, $value, int $ttl = 0 ): void {
		if ( $ttl <= 0 ) {
			$ttl = self::DEFAULT_TTL;
		}

		/**
		 * Filters the TTL for a Markaroo cache entry.
		 *
		 * @param int    $ttl  TTL in seconds.
		 * @param string $key  Logical cache key (without prefix).
		 */
		$ttl = (int) apply_filters( 'markaroo/cache/ttl', $ttl, $key );

		$full_key = self::full_key( $key );

		set_transient( $full_key, $value, $ttl );
		self::$memo[ $full_key ] = $value;
	}

	/**
	 * Delete one or more cache keys.
	 *
	 * @param string|string[] $keys Logical key(s).
	 */
	public static function forget( $keys ): void {
		$keys = (array) $keys;

		foreach ( $keys as $key ) {
			$full_key = self::full_key( $key );
			delete_transient( $full_key );
			unset( self::$memo[ $full_key ] );
		}

		/**
		 * Fires after Markaroo cache keys are deleted.
		 *
		 * @param string[] $keys Logical keys that were flushed.
		 */
		do_action( 'markaroo/cache/flush', $keys );
	}

	/**
	 * Delete all `markaroo_*` transients.
	 * Called from uninstall.php.
	 */
	public static function flush_all(): void {
		global $wpdb;

		$like = $wpdb->esc_like( '_transient_markaroo_' ) . '%';

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- transient cleanup on uninstall, value prepared.
		$transients = (array) $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s",
				$like
			)
		);

		foreach ( $transients as $option_name ) {
			$handle = str_replace( '_transient_', '', $option_name );
			delete_transient( $handle );
		}

		self::$memo = array();

		do_action( 'markaroo/cache/flush', array( '*' ) );
	}

	/**
	 * Build transient key for a page-specific feedback list.
	 */
	public static function page_key( string $page_key ): string {
		return 'page_' . md5( $page_key );
	}

	/**
	 * Current feedback-data version stamp. Cached list keys embed this value,
	 * so bumping it invalidates every cached list at once (stale entries just
	 * expire via TTL). Expiry of the stamp itself is harmless: a fresh stamp
	 * only causes cache misses, never stale data.
	 */
	public static function version(): int {
		$ver = self::get( 'feedback_ver' );

		if ( ! is_int( $ver ) ) {
			// Seed from the clock so a re-seeded stamp never repeats an old one
			// (list entries have a 5-min TTL, so collisions are moot anyway).
			$ver = time();
			self::set( 'feedback_ver', $ver, WEEK_IN_SECONDS );
		}

		return $ver;
	}

	/**
	 * Invalidate all version-keyed caches after a feedback mutation.
	 */
	public static function bump_version(): void {
		self::set( 'feedback_ver', self::version() + 1, WEEK_IN_SECONDS );
	}

	// -----------------------------------------------------------------------

	/** Prefix a logical key with `markaroo_`. */
	private static function full_key( string $key ): string {
		$prefixed = 'markaroo_' . $key;

		// WP transient keys are limited to 172 chars.
		if ( strlen( $prefixed ) > 172 ) {
			$prefixed = 'markaroo_' . md5( $key );
		}

		return $prefixed;
	}
}
