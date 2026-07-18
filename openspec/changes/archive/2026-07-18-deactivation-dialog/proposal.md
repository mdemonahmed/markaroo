# Deactivation Dialog

## Why

Markaroo is typically used only while a site is being built or staged. When the project ships, admins deactivate the plugin — and usually want its data (three DB tables, screenshots, uploaded attachments) gone with it. Today the only cleanup path is the buried `delete_data_on_uninstall` setting plus a full uninstall. There is also no low-friction way to tell us *why* someone is deactivating (e.g. they hit a bug we could fix).

## What Changes

- Intercept the **Deactivate** link on `plugins.php` with a Markaroo modal (admin-only, loaded only on that screen).
- Modal offers three explicit paths:
  1. **Keep data & deactivate** — current behavior (transients/cron cleared, data intact). Default.
  2. **Delete all data & deactivate** — immediately drops `wp_markaroo_feedback` / `_replies` / `_shares`, deletes all `markaroo_*` options, user meta, transients, cron, and every media attachment tagged `_markaroo_attachment` (captures + file uploads), then deactivates. Requires an explicit type-to-confirm safeguard since it is irreversible.
  3. **Found a bug? Report it** — inline mini-form that reuses the existing plugin-feedback email pipeline, then lets the user continue deactivating (keeping data).
- Optional one-click reason survey (radio list: temporary deactivation, found a bug, missing feature, done with project, other) sent through the same feedback email pipeline; skippable, never blocks deactivation.
- "Skip & deactivate" escape hatch — the dialog must never trap the user; plain deactivation always one click away.
- New REST endpoint `POST /markaroo/v1/deactivate-cleanup` (capability `activate_plugins` + nonce) that runs the data purge by reusing the existing `Support\Uninstall` deletion methods.
- Fire `markaroo/deactivate/cleanup` action so the Pro plugin can purge its own data in the same pass.

## Capabilities

### New Capabilities

- `deactivation-dialog`: the plugins-screen modal — interception, three paths, survey, escape hatch, accessibility.
- `data-purge`: the authorized destructive cleanup — what gets deleted, authorization, safeguards, pro hook.

### Modified Capabilities

<!-- none — uninstall behavior is unchanged; purge reuses its internals -->

## Impact

- **PHP**: new `DeactivationServiceProvider` (enqueue on `plugins.php` + REST route), `Support\Uninstall` refactor (expose existing private deletion steps as a reusable `purge()`), `config/plugin.php` providers list, REST route registration.
- **JS/CSS**: new small vanilla JS + CSS pair for the modal (no React — one dialog on plugins.php doesn't warrant the bundle).
- **Reused, not rebuilt**: `Support\Uninstall` deletion logic, `_markaroo_attachment` media tagging, `PluginFeedbackController` email pipeline (survey + bug report), existing rate limit.
- **Unchanged**: `uninstall.php` flow, `delete_data_on_uninstall` setting, deactivation hook (transients/cron cleanup).
