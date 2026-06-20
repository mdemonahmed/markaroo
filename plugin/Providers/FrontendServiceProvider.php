<?php

namespace Markaroo\Providers;

use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class FrontendServiceProvider extends ServiceProvider {

	public function register() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function enqueue_assets(): void {
		// Frontend widget asset loading — Task 07.
	}
}
