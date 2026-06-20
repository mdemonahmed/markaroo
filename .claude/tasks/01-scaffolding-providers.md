# 01 — Scaffolding & service providers

**Depends on:** 00
**Goal:** Create the core service-provider skeleton and shared support layer so later tasks plug into a consistent structure.

## Scope (free)
- Service providers that register REST routes, admin menu, frontend widget loader, and activation/deactivation/uninstall hooks.
- A `Support` layer with helpers and the global config object passed to JS.

## Steps
1. Create providers in `plugin/Providers/`:
   - `RestServiceProvider` — registers REST controllers (task 04).
   - `AdminMenuServiceProvider` — registers the admin dashboard page (task 16).
   - `FrontendServiceProvider` — enqueues/loads the widget (task 07).
   - `LifecycleServiceProvider` — activation (run migrations), deactivation, uninstall (task 21).
   - `NotificationsServiceProvider` (task 18).
   Register them via the WP Bones autoload service providers config.
2. Create `plugin/Support/`:
   - `Config.php` — builds `window.markarooConfig` payload: `restUrl`, `restNamespace` = `markaroo/v1`, `nonce` (`wp_create_nonce('wp_rest')`), `currentUser` (id, name, canManage), `settings`, `i18n` strings, `pluginUrl`.
   - `Capabilities.php` — wraps capability checks (see task 05).
   - `UserAgent.php` — parse OS + browser from a UA string (used to fill `os`/`browser` columns).
   - `helpers.php` — global functions, all prefixed `wp_markaroo_` (e.g. `wp_markaroo_config()`, `wp_markaroo_current_user_can_manage()`). Autoload via composer files.
3. Define the canonical action/filter names now as constants or a documented list (mirror task 19) so later tasks reference the same strings.
4. Establish the JS bootstrap convention: every React entry mounts into `#markaroo-root` and reads `window.markarooConfig`.

## Files
- `plugin/Providers/*ServiceProvider.php`
- `plugin/Support/{Config,Capabilities,UserAgent}.php`, `plugin/Support/helpers.php`

## Hooks
- `do_action('markaroo/init')` after providers boot.
- `apply_filters('markaroo/config', $config)` around the JS config payload (lets pro inject keys).

## Acceptance
- All providers load with no errors; `markaroo/init` fires once.
- `wp_markaroo_config()` returns a complete payload; `markaroo/config` filter can modify it.
- No stray output, no global functions without the `wp_markaroo_` prefix.
