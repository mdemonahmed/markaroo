# Tasks — Deactivation Dialog

## 1. Purge backend

- [x] 1.1 Refactor `plugin/Support/Uninstall.php`: add public static `purge()` that fires `markaroo/deactivate/cleanup` then runs the existing private steps (transients, cron, tables, options, user meta, tagged media); make `run()`'s delete branch delegate to it — uninstall behavior unchanged
- [x] 1.2 Create `plugin/Providers/DeactivationServiceProvider.php`: register `POST /markaroo/v1/deactivate-cleanup` (permission: `activate_plugins`; REST nonce implicit) whose handler calls `Uninstall::purge()` and returns success/error JSON
- [x] 1.3 Add the provider to `config/plugin.php` providers list

## 2. Modal frontend

- [x] 2.1 Create `resources/assets/js/deactivation.ts`: on `plugins.php`, intercept `tr[data-plugin="markaroo/markaroo.php"] .deactivate a`, save href, open modal; keep/skip = navigate to saved href; delete = POST purge endpoint (nonce from localized config) then navigate on success, show error and stay active on failure
- [x] 2.2 Build modal markup in JS: three paths (keep default, delete with confirmation-checkbox-gated red button, bug report inline form), optional reason radio list, "Skip & deactivate" link, X/Escape/overlay close; `role="dialog"` `aria-modal`, focus into dialog on open; all strings via `@wordpress/i18n`, all classes `markaroo-deactivation-*`
- [x] 2.3 Wire survey + bug report to existing `POST /markaroo/v1/plugin-feedback` (prefill current user name/email from localized config; combine survey reason + report into one request when both present)
- [x] 2.4 Create `resources/assets/css/deactivation.css` (prefixed classes, no global selectors); verify webpack auto-discovery emits `public/js/deactivation.js` + `public/css/deactivation.css`
- [x] 2.5 In `DeactivationServiceProvider`, enqueue both assets only when `$hook === 'plugins.php'` and user can `activate_plugins`; localize restUrl/nonce/user; `wp_set_script_translations`

## 3. Quality gates

- [x] 3.1 `phpcs` clean on new/changed PHP; `npm run lint` clean on new TS/CSS
- [x] 3.2 Regenerate `languages/markaroo.pot` (`npm run make-pot`) for the new strings
- [ ] 3.3 Manual acceptance: keep path preserves data; delete path drops 3 tables, `markaroo_*` options, and tagged media while leaving other media; unauthorized purge request gets 403; purge failure keeps plugin active with error shown; Escape/X/overlay cancel; skip deactivates plainly; other plugins' Deactivate links unaffected
- [ ] 3.4 Verify `markaroo/deactivate/cleanup` fires before core deletion (log/assert during manual test) and uninstall with `delete_data_on_uninstall` off still preserves data
