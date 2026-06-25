<?php

namespace Markaroo\Providers;

use Markaroo\Support\Config;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

/**
 * First-run onboarding (Task 25).
 *
 * Fires the welcome screen once, on first activation only, via a transient
 * guard — never auto-redirects on later loads (WP.org Guideline 11). The
 * welcome screen is a dedicated, full-bleed React page that is always
 * skippable. Completion/skip sets the markaroo_onboarded option.
 */
class OnboardingServiceProvider extends ServiceProvider {

	/** Admin page hook suffix for the hidden welcome screen. */
	private ?string $welcome_hook = null;

	public function register() {
		// The first-activation transient guard is set in plugin/activation.php —
		// WP Bones' Plugin::_activation runs that file, which is the only point
		// early enough to catch the activation request. Providers register on
		// `init`, so a register_activation_hook() here would never fire.
		// Priority 11 so the Markaroo top-level menu (registered by WP Bones at
		// priority 10) already exists when we attach the hidden welcome page.
		add_action( 'admin_menu', array( $this, 'register_welcome_page' ), 11 );
		add_action( 'admin_init', array( $this, 'maybe_redirect_welcome' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_welcome_assets' ) );
		add_action( 'admin_head', array( $this, 'hide_welcome_menu_item' ) );
	}

	/**
	 * Redirect to the welcome screen once, then clear the guard so it never nags.
	 */
	public function maybe_redirect_welcome(): void {
		if ( ! get_transient( 'markaroo_show_welcome' ) ) {
			return;
		}

		delete_transient( 'markaroo_show_welcome' );

		if ( wp_doing_ajax() || is_network_admin() || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		wp_safe_redirect( admin_url( 'admin.php?page=markaroo-welcome' ) );
		exit;
	}

	/**
	 * Register the welcome screen under the real Markaroo parent.
	 *
	 * Keeping a real parent (not an empty/removed one) is what lets WordPress
	 * resolve the page parent in user_can_access_admin_page(); removing the
	 * submenu entry breaks that resolution and yields "you are not allowed to
	 * access this page". The visible nav item is hidden with CSS instead
	 * (see hide_welcome_menu_item()).
	 */
	public function register_welcome_page(): void {
		$this->welcome_hook = add_submenu_page(
			'markaroo_main_menu',
			__( 'Welcome to Markaroo', 'markaroo' ),
			__( 'Welcome', 'markaroo' ),
			'manage_options',
			'markaroo-welcome',
			array( $this, 'render_welcome' )
		);
	}

	/**
	 * Hide the "Welcome" item from the Markaroo submenu without unregistering
	 * the page, so it stays reachable by URL but never clutters the nav.
	 */
	public function hide_welcome_menu_item(): void {
		echo '<style>#adminmenu a[href$="page=markaroo-welcome"]{display:none!important;}</style>';
	}

	/**
	 * Render the React mount point. Full-bleed, no WP admin chrome.
	 */
	public function render_welcome(): void {
		echo '<div id="markaroo-welcome-root" class="markaroo-app"></div>';
	}

	/**
	 * Enqueue the welcome bundle only on the welcome screen.
	 *
	 * @param string $hook Current admin page hook suffix.
	 */
	public function enqueue_welcome_assets( string $hook ): void {
		if ( null === $this->welcome_hook || $hook !== $this->welcome_hook ) {
			return;
		}

		$plugin_url = trailingslashit( plugin_dir_url( dirname( __DIR__, 2 ) . '/markaroo.php' ) );
		$version    = $this->plugin->version ?? '1.0.0';

		wp_enqueue_style(
			'markaroo-welcome',
			$plugin_url . 'public/css/welcome.css',
			array(),
			$version
		);

		wp_enqueue_script(
			'markaroo-welcome-app',
			$plugin_url . 'public/apps/welcome-markaroo.js',
			array( 'wp-element', 'wp-i18n' ),
			$version,
			true
		);

		$user  = wp_get_current_user();
		$first = $user->first_name ? $user->first_name : $user->display_name;

		wp_add_inline_script(
			'markaroo-welcome-app',
			'window.markarooWelcome = ' . wp_json_encode(
				array(
					'dashboardUrl' => admin_url( 'admin.php?page=markaroo_main_menu' ),
					'siteUrl'      => home_url( '/' ),
					'firstName'    => esc_html( $first ),
				)
			) . ';',
			'before'
		);

		Config::localize( 'markaroo-welcome-app' );

		wp_set_script_translations(
			'markaroo-welcome-app',
			'markaroo',
			trailingslashit( plugin_dir_path( dirname( __DIR__, 2 ) . '/markaroo.php' ) ) . 'languages'
		);
	}
}
