<?php

namespace Markaroo\Providers;

use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class LifecycleServiceProvider extends ServiceProvider {

	public function register() {
		// Fire markaroo/init at priority 20, after all providers boot at priority 10.
		add_action( 'init', static function () {
			do_action( 'markaroo/init' );
		}, 20 );
	}
}
