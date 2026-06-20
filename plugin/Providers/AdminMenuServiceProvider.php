<?php

namespace Markaroo\Providers;

use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class AdminMenuServiceProvider extends ServiceProvider {

	public function register() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function enqueue_assets( string $hook ): void {
		// Admin dashboard asset enqueuing — Task 16.
	}
}
