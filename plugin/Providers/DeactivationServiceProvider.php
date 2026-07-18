<?php

namespace Markaroo\Providers;

use Markaroo\Support\Uninstall;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

/**
 * Deactivation dialog: intercepts Markaroo's Deactivate link on plugins.php
 * with a keep-data / delete-all-data / report-a-bug modal, and exposes the
 * authorized purge endpoint the "delete all data" path calls.
 */
class DeactivationServiceProvider extends ServiceProvider {

	public function register() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * POST /markaroo/v1/deactivate-cleanup — delete ALL Markaroo data.
	 * Guarded by the REST nonce (X-WP-Nonce) plus `activate_plugins`, the
	 * same capability WordPress requires to deactivate a plugin.
	 */
	public function register_routes(): void {
		register_rest_route(
			RestServiceProvider::NAMESPACE,
			'/deactivate-cleanup',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'cleanup' ),
				'permission_callback' => static fn() => current_user_can( 'activate_plugins' ),
			)
		);
	}

	public function cleanup(): \WP_REST_Response {
		Uninstall::purge();

		return new \WP_REST_Response( array( 'deleted' => true ), 200 );
	}

	/**
	 * Load the dialog only where it can be used: plugins.php, for users who
	 * can deactivate plugins.
	 *
	 * @param string $hook Current admin page hook suffix.
	 */
	public function enqueue_assets( string $hook ): void {
		if ( 'plugins.php' !== $hook || ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		$base       = dirname( __DIR__, 2 ) . '/markaroo.php';
		$plugin_url = trailingslashit( plugin_dir_url( $base ) );
		$version    = $this->plugin->version ?? '1.0.0';

		wp_enqueue_style(
			'markaroo-deactivation',
			$plugin_url . 'public/css/deactivation.css',
			array(),
			$version
		);

		wp_enqueue_script(
			'markaroo-deactivation',
			$plugin_url . 'public/js/deactivation.js',
			array( 'wp-i18n' ),
			$version,
			true
		);

		$user = wp_get_current_user();

		wp_localize_script(
			'markaroo-deactivation',
			'markarooDeactivation',
			array(
				'restUrl'   => esc_url_raw( rest_url( RestServiceProvider::NAMESPACE ) ),
				'nonce'     => wp_create_nonce( 'wp_rest' ),
				'basename'  => plugin_basename( $base ),
				'userName'  => $user->display_name,
				'userEmail' => $user->user_email,
			)
		);

		wp_set_script_translations(
			'markaroo-deactivation',
			'markaroo',
			trailingslashit( plugin_dir_path( $base ) ) . 'languages'
		);
	}
}
