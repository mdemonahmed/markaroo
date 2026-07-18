# Design — Deactivation Dialog

## Context

Everything destructive already exists in `plugin/Support/Uninstall.php`: `drop_tables()`, `remove_options()`, `remove_user_meta()`, `remove_transients()`, `unschedule_cron()`, `remove_uploaded_files()` (media found via `_markaroo_attachment` meta, tagged by both `ScreenshotController` and `AttachmentsController`). Bug reports / feedback email already exist in `PluginFeedbackController::create()` (validated, rate-limited, mails `hello@devemon.com`). Deactivation currently clears transients + cron via `LifecycleServiceProvider`'s `register_deactivation_hook`. This change is therefore ~90% glue: a modal on `plugins.php`, one REST route, and making `Uninstall`'s private steps callable.

## Goals / Non-Goals

**Goals:**
- Modal interception of Markaroo's Deactivate link with keep / delete / bug-report paths and an optional reason survey.
- One authorized endpoint that purges all data by reusing `Uninstall` internals.
- Zero behavior change to uninstall, the `delete_data_on_uninstall` setting, or the existing deactivation hook.

**Non-Goals:**
- No React bundle for this dialog (one modal on one screen; vanilla JS keeps plugins.php light).
- No new DB tables/options for survey storage — survey goes out via the existing feedback email, nothing stored locally.
- No change to the WP.org-visible deactivation flow for non-admin roles (they can't see plugins.php anyway).
- No background/batched purge — staging sites are small; a synchronous request is fine (see Risks).

## Decisions

1. **Vanilla JS + plain CSS, enqueued only on `plugins.php`** (`admin_enqueue_scripts`, `$hook === 'plugins.php'`).
   - Alt considered: reuse the React admin bundle — rejected; dashboard-markaroo.js is ~hundreds of KB and pulls wp-element/components onto plugins.php for one dialog.
   - Files: `resources/assets/js/deactivation.ts` → `public/js/deactivation.js` (webpack auto-discovers `js/`), `resources/assets/css/deactivation.css`. Strings via `wp_set_script_translations` + `@wordpress/i18n` (already a dependency of the pipeline) or `wp_localize_script` payload; pick `@wordpress/i18n` for consistency with the rest of the codebase.

2. **Link interception**: find the anchor via the row's stable selector `tr[data-plugin="markaroo/markaroo.php"] .deactivate a`, capture its `href` (carries WP's own `_wpnonce`), `preventDefault`, open modal. Keep-data / skip paths just `window.location = savedHref` — WP's normal deactivation runs, existing deactivation hook does its cleanup.
   - Alt: custom AJAX deactivation via `deactivate_plugins()` — rejected; reusing the native URL keeps nonce handling and redirect behavior exactly as WordPress does it.

3. **Purge endpoint** `POST /markaroo/v1/deactivate-cleanup`, registered alongside existing routes, `permission_callback` = `current_user_can( 'activate_plugins' )` (nonce enforced by REST `X-WP-Nonce`). Handler: `do_action( 'markaroo/deactivate/cleanup' )` → `Uninstall::purge()` → success JSON. JS then navigates to the saved deactivation href.
   - Alt: purge inside the deactivation hook when a flag option is set — rejected; two-step state is fragile and the hook runs on bulk-deactivate too.

4. **`Uninstall::purge()` refactor**: new public static that calls the existing private steps (`remove_transients`, `unschedule_cron`, `drop_tables`, `remove_options`, `remove_user_meta`, `remove_uploaded_files`) in that order. `Uninstall::run()` keeps its current setting-gated logic but delegates the delete branch to `purge()`. Single source of deletion truth; uninstall behavior unchanged.
   - Note: purge deletes `markaroo_*` options while the plugin is still active; harmless — remaining requests fall back to defaults, and the very next action is deactivation.

5. **Survey + bug report reuse `PluginFeedbackController::create()`** via the existing `POST /markaroo/v1/plugin-feedback` route. Survey submission sends subject `Deactivation survey` with the chosen reason; bug report sends the user's message. The controller's required-field validation (name/email) is satisfied by prefilling current user display name + email in the modal form. Rate limit (1/min site-wide) is acceptable — a user submits at most one survey + one report.
   - Alt: new endpoint/email path — rejected; duplicate of an existing, tested pipeline.

6. **Safeguard for delete path**: checkbox "I understand…" gates the confirm button (spec'd). Type-to-confirm was considered and rejected as friction disproportionate to a staging-site plugin; checkbox + explicit red button copy is the WP-ecosystem norm.

7. **Provider**: new `DeactivationServiceProvider` in `config/plugin.php` providers list — owns the enqueue and REST route registration, keeping `LifecycleServiceProvider` and `AdminMenuServiceProvider` untouched.

## Risks / Trade-offs

- [Synchronous purge times out on huge media sets] → Staging-site scope makes this unlikely; `remove_uploaded_files` loops `wp_delete_attachment`. If it ever matters, batch by 50 with a loop in JS. Mark with a `ponytail:` comment.
- [User double-clicks Deactivate before JS binds] → Interceptor binds on DOMContentLoaded; worst case the native link wins and data is kept — safe failure direction.
- [Markup drift: WP changes plugins.php DOM] → Selector uses the stable `data-plugin` attribute WP has emitted for years; if it breaks, failure mode is again "native deactivate, data kept".
- [Purge succeeds but navigation fails (network blip)] → Data already gone, plugin still active but inert; user just clicks Deactivate again and picks keep.
- [Feedback rate limit blocks survey right after bug report] → Acceptable; survey is optional. Send both in one request when both present (single email) to avoid the collision.

## Migration Plan

Pure addition — no schema change, no data migration. Rollback = remove provider from `config/plugin.php`, delete new files. `Uninstall::run()` refactor is behavior-preserving and covered by the existing uninstall path.

## Open Questions

- None blocking. Recipient/pipeline for survey emails intentionally identical to existing plugin feedback.
