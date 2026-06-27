<?php

namespace Markaroo\Providers;

use Markaroo\Support\Config;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class AdminMenuServiceProvider extends ServiceProvider {

	/** WP admin page hook suffix for our main Markaroo page. */
	private ?string $hook_suffix = null;

	public function register() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'current_screen',        array( $this, 'capture_hook_suffix' ) );
		add_action( 'admin_head',            array( $this, 'full_bleed' ) );
	}

	/**
	 * Capture the hook suffix for our admin page so we can gate asset loading.
	 */
	public function capture_hook_suffix(): void {
		$screen = get_current_screen();
		if ( $screen && str_contains( $screen->id, 'markaroo' ) ) {
			$this->hook_suffix = $screen->id;
		}
	}

	/**
	 * Enqueue admin React bundle + markarooConfig only on Markaroo admin pages.
	 *
	 * @param string $hook Current page hook suffix.
	 */
	public function enqueue_assets( string $hook ): void {
		if ( ! str_contains( $hook, 'markaroo' ) ) {
			return;
		}

		// The full-bleed welcome screen enqueues its own bundle.
		if ( str_contains( $hook, 'markaroo-welcome' ) ) {
			return;
		}

		/**
		 * Fires just before Markaroo admin assets are enqueued.
		 *
		 * @param string $hook Current admin page hook.
		 */
		do_action( 'markaroo/admin/enqueue', $hook );

		$plugin_url = trailingslashit( plugin_dir_url( dirname( __DIR__, 2 ) . '/markaroo.php' ) );
		$version    = $this->plugin->version ?? '1.0.0';

		wp_enqueue_style(
			'markaroo-admin',
			$plugin_url . 'public/css/markaroo-common.css',
			array( 'wp-components' ),
			$version
		);

		wp_enqueue_script(
			'markaroo-admin-app',
			$plugin_url . 'public/apps/dashboard-markaroo.js',
			array( 'wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n' ),
			$version,
			true
		);

		/**
		 * Filters the admin JS config before localization.
		 * Pro can inject extra admin tabs, columns, and feature flags.
		 *
		 * @param array $payload markarooConfig payload.
		 */
		$extra_config = (array) apply_filters( 'markaroo/admin/menu', array(), $hook );
		if ( ! empty( $extra_config ) ) {
			wp_add_inline_script(
				'markaroo-admin-app',
				'window.markarooAdminExtra = ' . wp_json_encode( $extra_config ) . ';',
				'before'
			);
		}

		/**
		 * Filters the columns shown in the admin task list.
		 * Pro can add sprint, custom-field, or time-tracker columns.
		 *
		 * @param string[] $columns Column slugs.
		 */
		$columns = (array) apply_filters(
			'markaroo/dashboard/columns',
			array( 'id', 'comment', 'status', 'priority', 'assignee', 'due_date', 'created_at', 'page_key' )
		);

		wp_add_inline_script(
			'markaroo-admin-app',
			'window.markarooDashboardColumns = ' . wp_json_encode( $columns ) . ';',
			'before'
		);

		Config::localize( 'markaroo-admin-app' );

		// Enable JS translations for the admin bundle.
		wp_set_script_translations(
			'markaroo-admin-app',
			'markaroo',
			trailingslashit( plugin_dir_path( dirname( __DIR__, 2 ) . '/markaroo.php' ) ) . 'languages'
		);
	}

	/**
	 * Give Markaroo admin screens a full-bleed SaaS canvas by trimming the
	 * default WP content padding. Scoped to markaroo screen IDs only.
	 */
	public function full_bleed(): void {
		$screen = get_current_screen();
		if ( ! $screen || ! str_contains( $screen->id, 'markaroo' ) ) {
			return;
		}
		echo '<style>#wpcontent{padding-left:0}#wpbody-content{padding-bottom:0}.markaroo-app{min-height:calc(100vh - 32px)}</style>';
	}
}
