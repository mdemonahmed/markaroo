<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Lightweight UA parser — fills the os/browser columns on feedback rows.
 * Not a full UA library; covers the browsers/OS combinations real users send.
 */
class UserAgent {

	/**
	 * Parse a UA string into os + browser labels.
	 *
	 * @param string $ua Raw User-Agent header value.
	 * @return array{os: string, browser: string}
	 */
	public static function parse( string $ua ): array {
		return array(
			'os'      => self::parse_os( $ua ),
			'browser' => self::parse_browser( $ua ),
		);
	}

	private static function parse_os( string $ua ): string {
		$map = array(
			'Windows NT 10'  => 'Windows 10/11',
			'Windows NT 6.3' => 'Windows 8.1',
			'Windows NT 6.2' => 'Windows 8',
			'Windows NT 6.1' => 'Windows 7',
			'Mac OS X'       => 'macOS',
			'iPhone'         => 'iOS',
			'iPad'           => 'iPadOS',
			'Android'        => 'Android',
			'Linux'          => 'Linux',
		);

		foreach ( $map as $token => $label ) {
			if ( str_contains( $ua, $token ) ) {
				return $label;
			}
		}

		return 'Unknown';
	}

	private static function parse_browser( string $ua ): string {
		// Specific tokens must be checked before generic ones.
		if ( str_contains( $ua, 'Edg/' ) || str_contains( $ua, 'Edge/' ) ) {
			return 'Edge';
		}
		if ( str_contains( $ua, 'OPR/' ) || str_contains( $ua, 'Opera/' ) ) {
			return 'Opera';
		}
		if ( str_contains( $ua, 'Chrome/' ) && ! str_contains( $ua, 'Chromium' ) ) {
			return 'Chrome';
		}
		if ( str_contains( $ua, 'Safari/' ) && ! str_contains( $ua, 'Chrome' ) ) {
			return 'Safari';
		}
		if ( str_contains( $ua, 'Firefox/' ) ) {
			return 'Firefox';
		}
		if ( str_contains( $ua, 'MSIE' ) || str_contains( $ua, 'Trident/' ) ) {
			return 'IE';
		}

		return 'Unknown';
	}
}
