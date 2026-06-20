<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

class Config {

	/**
	 * Build the window.markarooConfig payload passed to every React app.
	 *
	 * @return array<string, mixed>
	 */
	public static function payload(): array {
		$user = wp_get_current_user();

		$payload = array(
			'restUrl'       => esc_url_raw( rest_url() ),
			'restNamespace' => 'markaroo/v1',
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'pluginUrl'     => esc_url_raw( plugin_dir_url( dirname( __DIR__ ) . '/markaroo.php' ) ),
			'currentUser'   => array(
				'id'        => (int) $user->ID,
				'name'      => $user->ID ? esc_html( $user->display_name ) : '',
				'canManage' => Capabilities::can_manage(),
			),
			'settings'      => self::public_settings(),
			'i18n'          => array(
				'feedback'  => esc_html__( 'Feedback', 'markaroo' ),
				'submit'    => esc_html__( 'Submit', 'markaroo' ),
				'cancel'    => esc_html__( 'Cancel', 'markaroo' ),
				'resolve'   => esc_html__( 'Resolve', 'markaroo' ),
				'unresolve' => esc_html__( 'Unresolve', 'markaroo' ),
				'reply'     => esc_html__( 'Reply', 'markaroo' ),
				'delete'    => esc_html__( 'Delete', 'markaroo' ),
				'edit'      => esc_html__( 'Edit', 'markaroo' ),
			),
		);

		/**
		 * Filters the JS config payload.
		 * Pro plugin uses this to inject additional keys.
		 *
		 * @param array $payload
		 */
		return (array) apply_filters( 'markaroo/config', $payload );
	}

	/**
	 * Inline window.markarooConfig onto an already-registered script handle.
	 */
	public static function localize( string $handle ): void {
		wp_localize_script( $handle, 'markarooConfig', self::payload() );
	}

	/**
	 * Return settings safe to expose to JavaScript (omits server-only keys like manage_capability).
	 *
	 * @return array<string, mixed>
	 */
	private static function public_settings(): array {
		$all = Settings::all();

		// Strip server-only access keys — never expose capability slugs to JS.
		unset( $all['access']['manage_capability'] );

		return $all;
	}
}
