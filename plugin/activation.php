<?php

defined( 'ABSPATH' ) || exit;

/*
|--------------------------------------------------------------------------
| Plugin activation
|--------------------------------------------------------------------------
|
| WP Bones automatically runs all files in database/migrations/ after this
| file is included. The markaroo/db/migrated action and markaroo_db_version
| option are set by the last migration file (0003_create_markaroo_shares_table)
| so they fire AFTER all tables exist.
|
*/

/*
 * Task 25 — first-run onboarding.
 *
 * Show the welcome screen once, on first activation only. WP Bones runs this
 * file from Plugin::_activation (registered on the main plugin file at boot),
 * which is the only point early enough to catch the activation request — a
 * register_activation_hook() inside a service provider fires too late because
 * providers are not registered until the `init` hook.
 *
 * Option/transient names use the `markaroo_` prefix per CLAUDE.md. The option
 * key mirrors \Markaroo\Http\Controllers\OnboardingController::ONBOARDED_OPTION.
 */
if ( false === get_option( 'markaroo_onboarded', false ) ) {
	set_transient( 'markaroo_show_welcome', 1, MINUTE_IN_SECONDS );
}

/*
 * Schedule the digest cron here (activation) instead of on every request.
 * NotificationsServiceProvider keeps a transient-gated self-heal check for
 * sites where cron state was wiped after activation.
 */
if ( ! wp_next_scheduled( 'markaroo_digest_cron' ) ) {
	wp_schedule_event( time(), 'markaroo_digest', 'markaroo_digest_cron' );
}
