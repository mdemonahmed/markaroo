<?php
/**
 * Uninstall Markaroo.
 *
 * WordPress calls this file when the plugin is deleted from wp-admin.
 * Only runs when WP_UNINSTALL_PLUGIN is defined.
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Bootstrap enough of the plugin to reach the Uninstall class.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

if ( file_exists( __DIR__ . '/bootstrap/autoload.php' ) ) {
	require_once __DIR__ . '/bootstrap/autoload.php';
}

if ( class_exists( 'Markaroo\Support\Uninstall' ) ) {
	\Markaroo\Support\Uninstall::run();
}
