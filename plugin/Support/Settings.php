<?php

namespace Markaroo\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Single settings store for the markaroo_settings option.
 *
 * All public methods are static so callers don't need an instance.
 * Always merges stored values with defaults so missing keys never break callers.
 */
class Settings {

	const OPTION_KEY = 'markaroo_settings';

	/**
	 * Per-request cache of the merged + filtered settings array. The defaults
	 * rebuild, deep_merge and 'markaroo/settings' filter run once per request
	 * instead of once per Settings::get() call. Reset by update()/flush_memo().
	 *
	 * @var array<string, mixed>|null
	 */
	private static ?array $memo = null;

	// -----------------------------------------------------------------------
	// Public API
	// -----------------------------------------------------------------------

	/**
	 * Return all settings, merged with defaults and passed through the filter.
	 *
	 * @return array<string, mixed>
	 */
	public static function all(): array {
		if ( null !== self::$memo ) {
			return self::$memo;
		}

		$stored = get_option( self::OPTION_KEY, array() );
		$merged = self::deep_merge( self::defaults(), is_array( $stored ) ? $stored : array() );

		/**
		 * Filters the full settings array.
		 * Pro plugin uses this to inject or override keys.
		 *
		 * Note: the filtered result is memoized for the rest of the request, so
		 * hooks added after the first Settings call won't apply until flush_memo().
		 *
		 * @param array $merged Merged settings (defaults + stored).
		 */
		self::$memo = (array) apply_filters( 'markaroo/settings', $merged );

		return self::$memo;
	}

	/**
	 * Clear the per-request settings memo (used after updates and in tests).
	 */
	public static function flush_memo(): void {
		self::$memo = null;
	}

	/**
	 * Get a single setting value by dot-notation key, e.g. 'general.screenshot_format'.
	 *
	 * @param string $key     Dot-notation path into the settings array.
	 * @param mixed  $default Fallback when the key is absent.
	 * @return mixed
	 */
	public static function get( string $key, $default = null ) {
		$all  = self::all();
		$keys = explode( '.', $key );

		foreach ( $keys as $segment ) {
			if ( ! is_array( $all ) || ! array_key_exists( $segment, $all ) ) {
				return $default;
			}
			$all = $all[ $segment ];
		}

		return $all;
	}

	/**
	 * Merge and persist a partial settings array.
	 *
	 * @param array $partial Key-value pairs to update (may be a nested sub-array).
	 * @return bool True on success.
	 */
	public static function update( array $partial ): bool {
		$old    = self::all();
		$merged = self::deep_merge( $old, $partial );
		$clean  = self::sanitize( $merged );

		$result = update_option( self::OPTION_KEY, $clean );

		self::flush_memo();

		/**
		 * Fires after settings are saved.
		 *
		 * @param array $clean The saved settings.
		 * @param array $old   The previous settings.
		 */
		do_action( 'markaroo/settings/updated', $clean, $old );

		return $result;
	}

	/**
	 * Return the full defaults array.
	 *
	 * @return array<string, mixed>
	 */
	public static function defaults(): array {
		$defaults = array(

			// ----------------------------------------------------------
			// General
			// ----------------------------------------------------------
			'general' => array(
				'screenshot_format'   => 'jpeg',
				'screenshot_quality'  => 0.8,
				'enable_screenshots'  => true,
				'default_widget_mode' => 'comment',
				'widget_button_label' => __( 'Feedback', 'markaroo' ),
				'widget_position'     => 'bottom-right',
				'widget_enabled'      => true,
				'widget_scope'        => 'site',  // 'site' | 'pages'.
				'widget_pages'        => array(), // array<int> post/page IDs when scope = 'pages'.
			),

			// ----------------------------------------------------------
			// Capture
			// ----------------------------------------------------------
			'capture' => array(
				'enable_area_select'        => true,
				'default_annotation_tool'   => 'arrow',
				'mask_inputs_in_screenshots' => true,
			),

			// ----------------------------------------------------------
			// Tasks
			// ----------------------------------------------------------
			'tasks' => array(
				'enable_assignment' => true,
				'enable_due_dates'  => true,
				'enable_tags'       => true,
				'available_tags'    => array(),
				'priority_default'  => 'normal',
			),

			// ----------------------------------------------------------
			// Access
			// ----------------------------------------------------------
			'access' => array(
				'allow_guest_links'  => true,
				'manage_capability'  => 'manage_options',
			),

			// ----------------------------------------------------------
			// Notifications
			// ----------------------------------------------------------
			'notifications' => array(
				'notify_mode'     => 'smart',
				'digest_interval' => 30,
				'events'          => array(
					'new_feedback' => true,
					'reply'        => true,
					'mention'      => true,
					'assignment'   => true,
					'resolved'     => false,
				),
			),

			// ----------------------------------------------------------
			// Attachments
			// ----------------------------------------------------------
			'attachments' => array(
				'max_upload_mb'  => 5,
				'allowed_types'  => array( 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/csv' ),
			),

			// ----------------------------------------------------------
			// Advanced
			// ----------------------------------------------------------
			'advanced' => array(
				'delete_data_on_uninstall' => false,
				'async_assets'             => true,
			),
		);

		/**
		 * Filters the default settings before they are merged with stored values.
		 *
		 * @param array $defaults
		 */
		return (array) apply_filters( 'markaroo/settings/defaults', $defaults );
	}

	// -----------------------------------------------------------------------
	// Private helpers
	// -----------------------------------------------------------------------

	/**
	 * Recursively merge $overlay onto $base (overlay wins on scalar conflicts).
	 *
	 * @param array $base
	 * @param array $overlay
	 * @return array
	 */
	private static function deep_merge( array $base, array $overlay ): array {
		foreach ( $overlay as $key => $value ) {
			if ( is_array( $value ) && isset( $base[ $key ] ) && is_array( $base[ $key ] ) ) {
				$base[ $key ] = self::deep_merge( $base[ $key ], $value );
			} else {
				$base[ $key ] = $value;
			}
		}

		return $base;
	}

	/**
	 * Sanitize a full settings array before persisting.
	 *
	 * @param array $settings
	 * @return array
	 */
	private static function sanitize( array $settings ): array {
		$d = self::defaults();

		// General.
		$g = $settings['general'] ?? array();
		$settings['general'] = array(
			'screenshot_format'   => in_array( $g['screenshot_format'] ?? '', array( 'jpeg', 'png' ), true ) ? $g['screenshot_format'] : $d['general']['screenshot_format'],
			'screenshot_quality'  => min( 1.0, max( 0.1, (float) ( $g['screenshot_quality'] ?? $d['general']['screenshot_quality'] ) ) ),
			'enable_screenshots'  => (bool) ( $g['enable_screenshots'] ?? $d['general']['enable_screenshots'] ),
			'default_widget_mode' => in_array( $g['default_widget_mode'] ?? '', array( 'comment', 'view', 'clean' ), true ) ? $g['default_widget_mode'] : $d['general']['default_widget_mode'],
			'widget_button_label' => sanitize_text_field( $g['widget_button_label'] ?? $d['general']['widget_button_label'] ),
			'widget_position'     => in_array( $g['widget_position'] ?? '', array( 'bottom-right', 'bottom-left' ), true ) ? $g['widget_position'] : $d['general']['widget_position'],
			'widget_enabled'      => (bool) ( $g['widget_enabled'] ?? $d['general']['widget_enabled'] ),
			'widget_scope'        => in_array( $g['widget_scope'] ?? '', array( 'site', 'pages' ), true ) ? $g['widget_scope'] : $d['general']['widget_scope'],
			'widget_pages'        => array_values( array_unique( array_filter( array_map( 'absint', (array) ( $g['widget_pages'] ?? array() ) ) ) ) ),
		);

		// Capture.
		$c = $settings['capture'] ?? array();
		$settings['capture'] = array(
			'enable_area_select'         => (bool) ( $c['enable_area_select'] ?? $d['capture']['enable_area_select'] ),
			'default_annotation_tool'    => in_array( $c['default_annotation_tool'] ?? '', array( 'arrow', 'rectangle', 'circle' ), true ) ? $c['default_annotation_tool'] : $d['capture']['default_annotation_tool'],
			'mask_inputs_in_screenshots' => (bool) ( $c['mask_inputs_in_screenshots'] ?? $d['capture']['mask_inputs_in_screenshots'] ),
		);

		// Tasks.
		$t = $settings['tasks'] ?? array();
		$available_tags = array();
		foreach ( (array) ( $t['available_tags'] ?? array() ) as $tag ) {
			$clean_tag = sanitize_text_field( $tag );
			if ( '' !== $clean_tag ) {
				$available_tags[] = $clean_tag;
			}
		}
		$settings['tasks'] = array(
			'enable_assignment' => (bool) ( $t['enable_assignment'] ?? $d['tasks']['enable_assignment'] ),
			'enable_due_dates'  => (bool) ( $t['enable_due_dates'] ?? $d['tasks']['enable_due_dates'] ),
			'enable_tags'       => (bool) ( $t['enable_tags'] ?? $d['tasks']['enable_tags'] ),
			'available_tags'    => $available_tags,
			'priority_default'  => in_array( $t['priority_default'] ?? '', array( 'urgent', 'high', 'normal', 'low' ), true ) ? $t['priority_default'] : $d['tasks']['priority_default'],
		);

		// Access.
		$a = $settings['access'] ?? array();
		$settings['access'] = array(
			'allow_guest_links' => (bool) ( $a['allow_guest_links'] ?? $d['access']['allow_guest_links'] ),
			'manage_capability' => sanitize_text_field( $a['manage_capability'] ?? $d['access']['manage_capability'] ),
		);

		// Notifications.
		$n = $settings['notifications'] ?? array();
		$de = $d['notifications']['events'];
		$ne = (array) ( $n['events'] ?? array() );
		$settings['notifications'] = array(
			'notify_mode'     => in_array( $n['notify_mode'] ?? '', array( 'off', 'instant', 'digest', 'smart' ), true ) ? $n['notify_mode'] : $d['notifications']['notify_mode'],
			'digest_interval' => in_array( (int) ( $n['digest_interval'] ?? 0 ), array( 15, 30, 60 ), true ) ? (int) $n['digest_interval'] : $d['notifications']['digest_interval'],
			'events'          => array(
				'new_feedback' => (bool) ( $ne['new_feedback'] ?? $de['new_feedback'] ),
				'reply'        => (bool) ( $ne['reply'] ?? $de['reply'] ),
				'mention'      => (bool) ( $ne['mention'] ?? $de['mention'] ),
				'assignment'   => (bool) ( $ne['assignment'] ?? $de['assignment'] ),
				'resolved'     => (bool) ( $ne['resolved'] ?? $de['resolved'] ),
			),
		);

		// Attachments.
		$at = $settings['attachments'] ?? array();
		$allowed = array();
		foreach ( (array) ( $at['allowed_types'] ?? array() ) as $mime ) {
			$allowed[] = sanitize_mime_type( $mime );
		}
		$settings['attachments'] = array(
			'max_upload_mb'  => max( 1, min( 50, absint( $at['max_upload_mb'] ?? $d['attachments']['max_upload_mb'] ) ) ),
			'allowed_types'  => array_filter( $allowed ),
		);

		// Advanced.
		$adv = $settings['advanced'] ?? array();
		$settings['advanced'] = array(
			'delete_data_on_uninstall' => (bool) ( $adv['delete_data_on_uninstall'] ?? $d['advanced']['delete_data_on_uninstall'] ),
			'async_assets'             => (bool) ( $adv['async_assets'] ?? $d['advanced']['async_assets'] ),
		);

		return $settings;
	}
}
