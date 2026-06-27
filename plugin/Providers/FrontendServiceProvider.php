<?php

namespace Markaroo\Providers;

use Markaroo\Repositories\ShareRepository;
use Markaroo\Support\Capabilities;
use Markaroo\Support\Config;
use Markaroo\Support\Settings;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class FrontendServiceProvider extends ServiceProvider {

	/** Cookie that persists a guest share token across page navigations. */
	private const SHARE_COOKIE = 'markaroo_share';

	/** Hard ceiling on the share cookie lifetime, regardless of share expiry. */
	private const COOKIE_MAX_LIFETIME = 30 * DAY_IN_SECONDS;

	/** Resolved share row for the current page load, or null. */
	private ?object $current_share = null;

	/** Whether we've already tried to resolve the share token. */
	private bool $share_resolved = false;

	public function register() {
		// Persist the guest share token as a cookie so the widget keeps loading
		// as the visitor navigates to other pages (the ?markaroo_share= param is
		// only present on the first, shared, URL). Hooked on template_redirect,
		// not init: this provider is itself registered ON init, so an init
		// listener added here is racy and may never fire. template_redirect runs
		// after init, on front-end requests only, before any output is sent — so
		// setcookie() still works and the row is memoized before wp_enqueue_scripts.
		add_action( 'template_redirect', array( $this, 'sync_share_cookie' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue' ), 20 );
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_launcher' ), 100 );
	}

	/**
	 * Set, refresh, or clear the guest share cookie for the current request.
	 *
	 * Precedence: a token in the URL always wins and (re)issues the cookie; with
	 * no URL token we fall back to the existing cookie. A token that no longer
	 * resolves to a valid, non-expired share (revoked/regenerated/expired) clears
	 * any stale cookie. The cookie is issued even when the widget is hidden on the
	 * landing page (e.g. page-scoped widget excludes it), so the widget appears
	 * once the visitor reaches an allowed page.
	 */
	public function sync_share_cookie(): void {
		// Cookie only matters to front-end guests. Logged-in users always get the
		// widget via capability, and admin/REST requests must not be clobbered.
		if ( is_admin() || is_user_logged_in() ) {
			return;
		}

		if ( ! Settings::get( 'access.allow_guest_links', true ) ) {
			return;
		}

		$url_token    = $this->token_from_url();
		$cookie_token = $this->token_from_cookie();
		$token        = '' !== $url_token ? $url_token : $cookie_token;

		if ( '' === $token ) {
			return;
		}

		$share = $this->resolve_valid_share( $token );

		if ( ! $share ) {
			// Dead token: drop any stale cookie so no zombie state lingers.
			if ( '' !== $cookie_token ) {
				$this->clear_share_cookie();
			}
			return;
		}

		// Reuse this row for maybe_enqueue()/inject_widget_config() this request.
		$this->current_share  = $share;
		$this->share_resolved = true;

		// (Re)issue the cookie whenever the visitor arrives via a share URL.
		if ( '' !== $url_token ) {
			$this->set_share_cookie( $token, $share );
		}
	}

	public function maybe_enqueue(): void {
		// Global gate: master toggle + scope (entire site vs specific pages).
		// Applies to logged-in users AND guests.
		if ( ! $this->widget_allowed_here() ) {
			return;
		}

		$should_load = is_user_logged_in() || null !== $this->get_current_share();

		$context = array(
			'is_logged_in'    => is_user_logged_in(),
			'can_manage'      => Capabilities::can_manage(),
			'can_create'      => Capabilities::can_create(),
			'has_share_token' => null !== $this->get_current_share(),
		);

		/**
		 * Filters whether the Markaroo widget should load on the current page.
		 *
		 * @param bool  $should_load Whether to load.
		 * @param array $context     Context flags.
		 */
		$should_load = (bool) apply_filters( 'markaroo/widget/should_load', $should_load, $context );

		if ( ! $should_load ) {
			return;
		}

		/**
		 * Fires just before the Markaroo widget assets are enqueued.
		 *
		 * @param array $context Context flags.
		 */
		do_action( 'markaroo/widget/enqueue', $context );

		$plugin_url  = $this->plugin_root_url();
		$plugin_path = trailingslashit( plugin_dir_path( dirname( __DIR__, 2 ) . '/markaroo.php' ) );

		// Read webpack-generated dependencies + version hash. The bundle uses
		// the automatic JSX runtime, so it depends on 'react-jsx-runtime' —
		// hardcoding only 'wp-element' leaves window.ReactJSXRuntime undefined
		// and the widget crashes with "Cannot read properties of undefined
		// (reading 'jsx')" before it can mount.
		$asset_file = $plugin_path . 'public/apps/widget.asset.php';
		$asset      = file_exists( $asset_file )
			? require $asset_file
			: array( 'dependencies' => array( 'wp-element' ), 'version' => $this->plugin->version ?? '1.0.0' );

		// Widget CSS.
		wp_enqueue_style(
			'markaroo-widget',
			$plugin_url . 'public/css/widget.css',
			array(),
			$asset['version'] ?? ( $this->plugin->version ?? '1.0.0' )
		);

		// Widget JS — React app.
		wp_enqueue_script(
			'markaroo-widget',
			$plugin_url . 'public/apps/widget.js',
			$asset['dependencies'] ?? array( 'wp-element' ),
			$asset['version'] ?? ( $this->plugin->version ?? '1.0.0' ),
			true
		);

		// Defer/async per settings.
		if ( Settings::get( 'advanced.async_assets', true ) ) {
			add_filter( 'script_loader_tag', array( $this, 'add_defer_attr' ), 10, 2 );
		}

		// Inject markarooConfig + share-specific overrides.
		add_filter( 'markaroo/config', array( $this, 'inject_widget_config' ) );
		Config::localize( 'markaroo-widget' );

		// Enable JS translations for the widget bundle.
		wp_set_script_translations(
			'markaroo-widget',
			'markaroo',
			plugin_dir_path( dirname( __DIR__, 2 ) . '/markaroo.php' ) . 'languages'
		);

		// Append #markaroo-root to <body>.
		add_action( 'wp_footer', array( $this, 'render_root' ), 100 );
	}

	/**
	 * Inject widget-specific keys into markarooConfig.
	 *
	 * @param array $payload Existing Config payload.
	 * @return array
	 */
	public function inject_widget_config( array $payload ): array {
		$share = $this->get_current_share();

		if ( $share ) {
			$payload['widgetMode']  = $share->widget_mode ?? 'comment';
			$payload['shareToken']  = $share->token;
			$payload['shareRights'] = array(
				'canView'    => (bool) $share->can_view,
				'canComment' => (bool) $share->can_comment,
			);
		} else {
			$payload['widgetMode'] = Settings::get( 'general.default_widget_mode', 'comment' );
		}

		/**
		 * Filters screenshot options passed to the JS widget.
		 * Pro can redirect to external storage, change scale, etc.
		 *
		 * @param array $opts Screenshot options.
		 */
		$payload['screenshotOptions'] = (array) apply_filters(
			'markaroo/screenshot/options',
			array(
				'enabled'    => (bool) Settings::get( 'general.enable_screenshots', true ),
				'format'     => Settings::get( 'general.screenshot_format', 'jpeg' ),
				'quality'    => (float) Settings::get( 'general.screenshot_quality', 0.8 ),
				'maskInputs' => (bool) Settings::get( 'capture.mask_inputs_in_screenshots', true ),
				'scale'      => 1,
			)
		);

		/**
		 * Filters the annotation tools available to the JS widget.
		 * Pro can add 'blur', 'text', 'highlight', etc.
		 *
		 * @param string[] $tools Available tool slugs.
		 */
		$payload['annotationTools'] = (array) apply_filters(
			'markaroo/annotation/tools',
			array( 'arrow', 'rect', 'circle' )
		);

		/**
		 * Filters the composer field list exposed to the JS widget.
		 * Pro can inject extra fields (severity, sprint, etc.).
		 *
		 * @param string[] $fields  Free field slugs.
		 * @param array    $context Context flags.
		 */
		$payload['composerFields'] = (array) apply_filters(
			'markaroo/composer/fields',
			array( 'comment', 'priority' ),
			$context ?? array()
		);

		/**
		 * Filters the priority levels available in the widget and admin.
		 * Pro can add custom priorities (e.g. "critical", "deferred").
		 *
		 * @param array[] $levels Each: ['value' => string, 'label' => string, 'color' => string].
		 */
		$payload['priorityLevels'] = (array) apply_filters(
			'markaroo/priority/levels',
			array(
				array( 'value' => 'urgent', 'label' => __( 'Urgent', 'markaroo' ), 'color' => '#ef4444' ),
				array( 'value' => 'high',   'label' => __( 'High', 'markaroo' ),   'color' => '#f97316' ),
				array( 'value' => 'normal', 'label' => __( 'Normal', 'markaroo' ), 'color' => '#6366f1' ),
				array( 'value' => 'low',    'label' => __( 'Low', 'markaroo' ),    'color' => '#9ca3af' ),
			)
		);

		/**
		 * Filters the status list. Pro can add 'in_progress', etc.
		 *
		 * @param array[] $statuses Each: ['value' => string, 'label' => string].
		 */
		$payload['statusList'] = (array) apply_filters(
			'markaroo/status/list',
			\Markaroo\Support\Status::list_raw()
		);

		/**
		 * Filters pin colors per status/priority.
		 * Pro can theme pins to match client brand colours.
		 *
		 * @param array $colors Map of status/priority slug → hex color.
		 */
		$payload['pinColors'] = (array) apply_filters(
			'markaroo/pin/color',
			array(
				'open_urgent' => '#ef4444',
				'open_high'   => '#f97316',
				'open_normal' => '#6366f1',
				'open_low'    => '#9ca3af',
				'resolved'    => '#22c55e',
			)
		);

		/**
		 * Filters whether the Pro plugin is active.
		 * Pro plugin sets the MARKAROO_PRO constant on load.
		 * JS can use window.markarooConfig.proActive to show/hide upsell.
		 */
		$payload['proActive'] = defined( 'MARKAROO_PRO' );

		/**
		 * Filters the comment render mode (plain | markdown | html).
		 * Pro can enable rich HTML rendering via a sanitizer.
		 *
		 * @param string $mode Default 'markdown'.
		 */
		$payload['commentRender'] = (string) apply_filters( 'markaroo/comment/render', 'markdown' );

		return $payload;
	}

	/**
	 * Add defer attribute to the widget script tag.
	 *
	 * @param string $tag    HTML script tag.
	 * @param string $handle Script handle.
	 * @return string
	 */
	public function add_defer_attr( string $tag, string $handle ): string {
		if ( 'markaroo-widget' !== $handle ) {
			return $tag;
		}

		return str_replace( ' src=', ' defer src=', $tag );
	}

	/** Output the React mount point in <body>. */
	public function render_root(): void {
		$position = Settings::get( 'general.widget_position', 'bottom-right' );
		$position = in_array( $position, array( 'bottom-right', 'bottom-left' ), true ) ? $position : 'bottom-right';

		printf( '<div id="markaroo-root" data-position="%s"></div>%s', esc_attr( $position ), "\n" );
	}

	/**
	 * Whether the widget is allowed to load on the current front-end request.
	 *
	 * Master "allow feedback" toggle gates everyone (logged-in + guest). When
	 * scope is 'pages', the widget only loads on the selected pages/posts.
	 */
	private function widget_allowed_here(): bool {
		if ( ! Settings::get( 'general.widget_enabled', true ) ) {
			return false;
		}

		if ( 'pages' !== Settings::get( 'general.widget_scope', 'site' ) ) {
			return true; // Site-wide.
		}

		$pages = array_map( 'absint', (array) Settings::get( 'general.widget_pages', array() ) );
		if ( empty( $pages ) ) {
			return false;
		}

		$current = $this->current_queried_id();

		return $current > 0 && in_array( $current, $pages, true );
	}

	/**
	 * Resolve the current singular object ID, handling a static front page.
	 * Returns 0 for archives / latest-posts home (no singular object).
	 */
	private function current_queried_id(): int {
		if ( is_front_page() ) {
			$front = (int) get_option( 'page_on_front' );
			if ( $front > 0 ) {
				return $front;
			}
		}

		return is_singular() ? (int) get_queried_object_id() : 0;
	}

	/**
	 * Add the Markaroo launcher to the front-end admin bar (Task 26 §2).
	 *
	 * The fastest path to first feedback: a logged-in reviewer clicks it on any
	 * front-end page and the widget toggles open. The widget JS listens for
	 * clicks on `.markaroo-launch`.
	 *
	 * @param \WP_Admin_Bar $bar The admin bar instance.
	 */
	public function admin_bar_launcher( \WP_Admin_Bar $bar ): void {
		if ( is_admin() || ! Capabilities::can_give_feedback() ) {
			return;
		}

		$bar->add_node(
			array(
				'id'    => 'markaroo-launch',
				'title' => esc_html__( 'Markaroo', 'markaroo' ),
				'href'  => '#markaroo',
				'meta'  => array(
					'class' => 'markaroo-launch',
					'title' => __( 'Give feedback on this page', 'markaroo' ),
				),
			)
		);
	}

	// -----------------------------------------------------------------------
	// Private helpers
	// -----------------------------------------------------------------------

	/**
	 * Resolve and cache the share row from the current page URL.
	 */
	private function get_current_share(): ?object {
		if ( $this->share_resolved ) {
			return $this->current_share;
		}

		$this->share_resolved = true;

		if ( ! Settings::get( 'access.allow_guest_links', true ) ) {
			return null;
		}

		// URL token wins; otherwise fall back to the persisted cookie so the
		// widget survives navigation away from the original shared URL.
		$token = $this->token_from_url();
		if ( '' === $token ) {
			$token = $this->token_from_cookie();
		}

		if ( '' === $token ) {
			return null;
		}

		$this->current_share = $this->resolve_valid_share( $token );

		return $this->current_share;
	}

	/**
	 * Read the share token from the request URL, or '' if absent.
	 */
	private function token_from_url(): string {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return isset( $_GET['markaroo_share'] ) ? sanitize_text_field( wp_unslash( $_GET['markaroo_share'] ) ) : '';
	}

	/**
	 * Read the share token from the persisted cookie, or '' if absent.
	 */
	private function token_from_cookie(): string {
		return isset( $_COOKIE[ self::SHARE_COOKIE ] )
			? sanitize_text_field( wp_unslash( $_COOKIE[ self::SHARE_COOKIE ] ) )
			: '';
	}

	/**
	 * Resolve a token to a valid, non-expired share row, or null.
	 */
	private function resolve_valid_share( string $token ): ?object {
		$share = ( new ShareRepository() )->find_by_token( $token );

		if ( ! $share ) {
			return null;
		}

		// Pull into a local: the model has no __isset, so empty()/isset() on
		// $share->expires_at directly always reports it as unset.
		$expires_at = $share->expires_at;
		if ( ! empty( $expires_at ) && strtotime( $expires_at ) < time() ) {
			return null;
		}

		return $share;
	}

	/**
	 * Issue the guest share cookie, capping its lifetime at the share's expiry
	 * (or COOKIE_MAX_LIFETIME, whichever is sooner).
	 */
	private function set_share_cookie( string $token, object $share ): void {
		$lifetime = self::COOKIE_MAX_LIFETIME;

		// Never let the cookie outlive the share. Expired-but-still-here shares
		// are already filtered by resolve_valid_share(), so $until is positive.
		$expires_at = $share->expires_at;
		if ( ! empty( $expires_at ) ) {
			$until    = strtotime( $expires_at ) - time();
			$lifetime = max( 0, min( $until, self::COOKIE_MAX_LIFETIME ) );
		}

		if ( $lifetime <= 0 ) {
			return;
		}

		$this->write_share_cookie( $token, time() + $lifetime );
	}

	/**
	 * Expire the guest share cookie immediately.
	 */
	private function clear_share_cookie(): void {
		$this->write_share_cookie( '', time() - DAY_IN_SECONDS );
		unset( $_COOKIE[ self::SHARE_COOKIE ] );
	}

	/**
	 * Low-level cookie writer. HttpOnly so JS can never read the token (the
	 * widget receives it through window.markarooConfig instead); SameSite=Lax so
	 * it survives the top-level navigation from a shared link.
	 */
	private function write_share_cookie( string $value, int $expires ): void {
		if ( headers_sent() ) {
			return;
		}

		setcookie(
			self::SHARE_COOKIE,
			$value,
			array(
				'expires'  => $expires,
				'path'     => '/',
				'domain'   => defined( 'COOKIE_DOMAIN' ) ? COOKIE_DOMAIN : '',
				'secure'   => is_ssl(),
				'httponly' => true,
				'samesite' => 'Lax',
			)
		);
	}

	/**
	 * Return the plugin root URL (trailing slash).
	 */
	private function plugin_root_url(): string {
		return trailingslashit( plugin_dir_url( dirname( __DIR__, 2 ) . '/markaroo.php' ) );
	}
}
