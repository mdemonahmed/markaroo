<?php

namespace Markaroo\Providers;

use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class NotificationsServiceProvider extends ServiceProvider {

	public function register() {
		// WP-Cron schedule registration — Task 18.
	}
}
