<?php

namespace Markaroo\Providers;

use Markaroo\Support\Cache;
use Markaroo\Support\Capabilities;
use Markaroo\Support\Privacy;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class LifecycleServiceProvider extends ServiceProvider {

	public function register() {
		// Map markaroo_manage_feedback meta-cap → configured manage_capability.
		add_filter( 'user_has_cap', array( $this, 'map_meta_cap' ), 10, 4 );

		// Fire markaroo/init at priority 20, after all providers boot at priority 10.
		add_action( 'init', static function () {
			do_action( 'markaroo/init' );
		}, 20 );

		// GDPR: personal-data exporter, eraser, privacy policy suggestion.
		Privacy::register();

		// Deactivation: clear transients + unschedule cron; never delete data.
		register_deactivation_hook(
			$this->plugin->file ?? __FILE__,
			static function () {
				Cache::flush_all();
				wp_clear_scheduled_hook( 'markaroo_digest_cron' );
			}
		);
	}

	/**
	 * Map the `markaroo_manage_feedback` meta-capability to the configured cap.
	 *
	 * WordPress calls this filter whenever current_user_can() / $user->has_cap()
	 * is checked. We only act when our custom cap is among the requested caps,
	 * then grant it if the user holds the real configured capability.
	 *
	 * @param bool[]   $allcaps All caps the user has.
	 * @param string[] $caps    Primitive caps being checked.
	 * @param array    $args    [0] = capability name, [1] = user ID.
	 * @param \WP_User $user    The user object.
	 * @return bool[]
	 */
	public function map_meta_cap( array $allcaps, array $caps, array $args, \WP_User $user ): array {
		if ( ! in_array( Capabilities::META_CAP, $caps, true ) ) {
			return $allcaps;
		}

		$real_cap = Capabilities::manage_cap();

		if ( isset( $allcaps[ $real_cap ] ) && $allcaps[ $real_cap ] ) {
			$allcaps[ Capabilities::META_CAP ] = true;
		}

		return $allcaps;
	}
}
