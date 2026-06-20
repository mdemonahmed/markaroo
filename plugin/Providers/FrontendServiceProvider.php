<?php

namespace Markaroo\Providers;

use Markaroo\Repositories\ShareRepository;
use Markaroo\Support\Capabilities;
use Markaroo\Support\Config;
use Markaroo\Support\Settings;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class FrontendServiceProvider extends ServiceProvider {

	/** Resolved share row for the current page load, or null. */
	private ?object $current_share = null;

	/** Whether we've already tried to resolve the share token. */
	private bool $share_resolved = false;

	public function register() {
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue' ), 20 );
	}

	public function maybe_enqueue(): void {
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

		$plugin_url = $this->plugin_root_url();

		// Widget CSS.
		wp_enqueue_style(
			'markaroo-widget',
			$plugin_url . 'public/css/widget.css',
			array(),
			$this->plugin->version ?? '1.0.0'
		);

		// Widget JS — React app.
		wp_enqueue_script(
			'markaroo-widget',
			$plugin_url . 'public/apps/widget.js',
			array( 'wp-element' ),
			$this->plugin->version ?? '1.0.0',
			true
		);

		// Defer/async per settings.
		if ( Settings::get( 'advanced.async_assets', true ) ) {
			add_filter( 'script_loader_tag', array( $this, 'add_defer_attr' ), 10, 2 );
		}

		// Inject markarooConfig + share-specific overrides.
		add_filter( 'markaroo/config', array( $this, 'inject_widget_config' ) );
		Config::localize( 'markaroo-widget' );

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
			array(
				array( 'value' => 'open',     'label' => __( 'Open', 'markaroo' ) ),
				array( 'value' => 'resolved', 'label' => __( 'Resolved', 'markaroo' ) ),
			)
		);

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
		echo '<div id="markaroo-root"></div>' . "\n";
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

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$token = isset( $_GET['markaroo_share'] ) ? sanitize_text_field( wp_unslash( $_GET['markaroo_share'] ) ) : '';

		if ( empty( $token ) ) {
			return null;
		}

		$share = ( new ShareRepository() )->find_by_token( $token );

		if ( ! $share ) {
			return null;
		}

		if ( ! empty( $share->expires_at ) && strtotime( $share->expires_at ) < time() ) {
			return null;
		}

		$this->current_share = $share;

		return $share;
	}

	/**
	 * Return the plugin root URL (trailing slash).
	 */
	private function plugin_root_url(): string {
		return trailingslashit( plugin_dir_url( dirname( __DIR__, 2 ) . '/markaroo.php' ) );
	}
}
