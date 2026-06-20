<?php

namespace Markaroo\Providers;

use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class RestServiceProvider extends ServiceProvider {

	public function register() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {
		// REST routes registered in Task 04.
	}
}
