<?php

namespace Markaroo\Providers;

use Markaroo\Repositories\FeedbackRepository;
use Markaroo\Support\Cache;
use Markaroo\Support\Capabilities;
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
		add_action( 'admin_bar_menu',        array( $this, 'admin_bar_counts' ), 80 );
		// Priority 100: run after WP Bones builds the menu (admin_menu @ 10).
		add_action( 'admin_menu',            array( $this, 'add_tab_submenus' ), 100 );
	}

	/**
	 * Add one WP sidebar submenu link per React dashboard tab, so every view is
	 * reachable from the admin menu instead of only via the in-app top nav.
	 *
	 * The dashboard is a single page (`?page=markaroo_main_menu`) whose views are
	 * hash routes (`#tasks`, `#board`, …). Each entry is a plain anchored link:
	 * the slug is the full `admin.php?page=…#tab` URL and the callback is empty.
	 * That combination is required — with a registered callback WP core builds
	 * the href via add_query_arg() and encodes `#` to `%23`, killing the hash
	 * route (see wp-admin/menu-header.php). The `overview` tab is already the
	 * main "Dashboard" submenu, so it is omitted.
	 */
	public function add_tab_submenus(): void {
		$parent = 'markaroo_main_menu';

		$tabs = array(
			'tasks'              => __( 'All Feedback', 'markaroo' ),
			'board'              => __( 'Board', 'markaroo' ),
			'approvals'          => __( 'Approvals', 'markaroo' ),
			'email-notification' => __( 'Email Notification', 'markaroo' ),
			'settings'           => __( 'Settings', 'markaroo' ),
			'developers'         => __( 'Developers', 'markaroo' ),
			'plugin-feedback'    => __( 'Give us Feedback', 'markaroo' ),
			'how-to-use'         => __( 'How to Use', 'markaroo' ),
		);

		/**
		 * Filters the dashboard tabs exposed as WP admin submenu links.
		 * Pro can add or remove sidebar entries. Keys are tab hash ids, values
		 * are the translated menu labels.
		 *
		 * @param array<string,string> $tabs Map of tab id => menu label.
		 */
		$tabs = (array) apply_filters( 'markaroo/admin/menu_tabs', $tabs );

		foreach ( $tabs as $tab => $label ) {
			add_submenu_page(
				$parent,
				$label,
				$label,
				'manage_options',
				'admin.php?page=' . $parent . '#' . $tab,
				'' // Empty callback: keep this a raw anchor so `#` survives.
			);
		}
	}

	/**
	 * Add an open-feedback count node to the WP admin bar for managers.
	 * Reads the site-wide open count from the warm `counts_global` transient
	 * (populated by the /counts endpoint); only a cold cache costs one query.
	 *
	 * @param \WP_Admin_Bar $bar The admin bar instance.
	 */
	public function admin_bar_counts( $bar ): void {
		if ( ! Capabilities::can_manage() ) {
			return;
		}

		$open = null;

		$cached = Cache::get( 'counts_global' );
		if ( is_array( $cached ) && isset( $cached['open'] ) ) {
			$open = (int) $cached['open'];
		}

		// Cold cache: one cheap aggregate query (warm cache is query-free).
		if ( null === $open ) {
			$open = (int) ( ( new FeedbackRepository() )->totals()['open'] ?? 0 );
		}

		/**
		 * Filters the open-feedback count shown in the admin bar.
		 *
		 * @param int $open Site-wide open feedback count.
		 */
		$open = (int) apply_filters( 'markaroo/admin_bar/open_count', $open );

		$bar->add_node(
			array(
				'id'    => 'markaroo-open-count',
				/* translators: %d: number of open feedback items. */
				'title' => sprintf( _n( '%d open', '%d open', $open, 'markaroo' ), $open ),
				'href'  => admin_url( 'admin.php?page=markaroo' ),
				'meta'  => array( 'title' => __( 'Markaroo — open feedback', 'markaroo' ) ),
			)
		);
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

		// Bundle the HOOKS.md contract for the read-only Developers tab. One file
		// read on admin load (opcache-friendly), no runtime query.
		$hooks_path = trailingslashit( plugin_dir_path( dirname( __DIR__, 2 ) . '/markaroo.php' ) ) . 'HOOKS.md';
		$hooks_doc  = is_readable( $hooks_path ) ? (string) file_get_contents( $hooks_path ) : ''; // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		wp_add_inline_script(
			'markaroo-admin-app',
			'window.markarooHooksDoc = ' . wp_json_encode( $hooks_doc ) . ';',
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
