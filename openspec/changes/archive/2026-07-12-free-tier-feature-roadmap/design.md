## Context

Markaroo (free plugin) is a WP Bones app: PHP repositories over direct `$wpdb`, a REST API under `markaroo/v1`, a React admin dashboard, and a React frontend widget. A recent performance audit established ten operating invariants (summary-only lists, SQL-side filtering, deferred email, cache-bust-on-write, one fetch per resource per session, etc.). This change layers ten free-tier workflow features on top without regressing those invariants, and without implementing any Pro-reserved feature — each new capability instead fires a `markaroo/*` action and exposes an `apply_filters` for the Pro plugin.

Current relevant surfaces:
- `plugin/Http/Controllers/FeedbackController.php`, `CountsController.php`, `SettingsController.php`, `ScreenshotController.php`.
- `plugin/Repositories/FeedbackRepository.php` with `list(['fields' => 'summary'])`.
- `plugin/Support/Cache.php` (transient + request memo, `markaroo_` prefixed), `Settings` memo, `NotificationQueue::flush_digest()`.
- React dashboard `resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx`; widget `resources/assets/widget/` (`api.ts`, `pins/PinLayer.tsx`, `pins/PinMarker.tsx`, `ModeManager.tsx`).

## Goals / Non-Goals

**Goals:**
- Ship all ten FEATURES.md features in the free plugin.
- Reuse existing endpoints/caches wherever possible; add the minimum new REST surface (`/feedback/bulk`, `/feedback/export`, `/notifications/test-digest`).
- Every write path: nonce + capability check + cache bust. Every new capability: a `do_action` + `apply_filters` pair documented in HOOKS.md.
- No schema migration unless a genuinely new sort/filter column is required; reuse migration 0005 indexes.

**Non-Goals:**
- No Pro features (screen recording, PM sync, role-based access, webhooks, AI, white-label). We only fire hooks at those seams.
- No new external dependencies. Clustering, drag-and-drop, and CSV are implemented with existing libs / hand-rolled where a dependency would bloat the widget bundle.
- No redesign of the existing task list; features extend it in place.

## Decisions

### 1. Bulk actions = one new endpoint, one SQL statement
`POST markaroo/v1/feedback/bulk` accepts `{ ids: number[], changes: {...} | { delete: true } }`. Handler validates ids (non-empty, ≤ a hard cap e.g. 200), verifies nonce + `markaroo_manage_feedback`, and delegates to a new `FeedbackRepository::bulk_update($ids, $changes)` / `bulk_delete($ids)` that runs a single prepared `UPDATE … WHERE id IN (placeholders)`. Cache::forget the `counts_*` keys once. Fire `markaroo/feedback/bulk_updated`.
- *Alternative rejected:* N per-row PATCHes from the client — violates invariant #1 and multiplies cache busts.

### 2. Saved filters = user meta via the settings endpoint, client-side apply
Store an array of `{ name, filters }` in `markaroo_saved_filters` user meta. Read/write through the existing settings REST path (extend its allowed keys) rather than a new endpoint. Applying a filter mutates existing client query args only — no new list request shape. "Assigned to me" is a built-in preset, not a stored row.
- *Alternative rejected:* a dedicated saved-filters table/endpoint — overkill for per-user JSON.

### 3. CSV export = streamed chunks, summary columns
`GET markaroo/v1/feedback/export` reuses the current filter query args, calls `FeedbackRepository::list(['fields' => 'summary', 'per_page' => 500, 'page' => n])` in a loop, and echoes CSV rows with `fputcsv` to `php://output`, flushing per chunk. Longtext columns excluded by default. Nonce is passed as a query arg (GET download) and verified server-side alongside capability.
- *Alternative rejected:* build the whole CSV in memory — breaks invariant on unbounded loads for large agencies.

### 4. Admin-bar counts = reuse cached /counts
Register `admin_bar_menu` (and a front-end equivalent when a session is active) in a service provider on the appropriate hook. Read the page counts from the same `counts_page_<md5>` transient the `/counts` endpoint populates; if cold, populate via the existing counts code path (no bespoke query). Gate on `markaroo_manage_feedback`.

### 5. Keyboard shortcuts = single document listener in ModeManager/session scope
One `keydown` handler mounted while the session is active, removed on session end. Guard against text-entry targets (`input`, `textarea`, `[contenteditable]`). Maps `n`/`esc`/`r`/`[`/`]` to existing capture/resolve/navigation callbacks. No per-pin listeners (invariant #9).

### 6. Test digest = thin wrapper over flush_digest()
`POST markaroo/v1/notifications/test-digest` calls `NotificationQueue::flush_digest()` scoped to the current user through the existing `markaroo/notify/*` filters. Settings UI shows success/error. This is a manual trigger of already-deferred machinery, so no direct `wp_mail` in a controller (invariant #3 respected — it runs the same queue path, just now instead of on cron).

### 7. Offline queue = sessionStorage metadata + in-memory Blobs
In `widget/api.ts`, wrap the feedback POST: on network error, push metadata to a capped (5) `sessionStorage` queue and schedule exponential backoff retry. Screenshot Blobs stay in a module-level `Map` keyed by queue id — never serialized. Pin shows a "queued" state until drained.

### 8. Pin clustering = client-side proximity grouping in PinLayer
Above ~30 pins, group by viewport proximity (simple grid-bucket by rounded x/y) and render one cluster `PinMarker` per bucket; click expands. Preserve `React.memo` + stable callbacks so a single pin change re-renders only its bucket.
- *Alternative rejected:* a clustering library — unnecessary bundle weight for grid bucketing.

### 9. Status board = new dashboard view reusing the list endpoint
`StatusBoardView` fetches each status column with `per_page=25` + summary fields. Drag-drop (HTML5 DnD, no new lib) issues one PATCH on drop, optimistic update with revert on failure; `markaroo/status/changed` already fires server-side.

### 10. Developers tab = bundled HOOKS.md string
Bundle HOOKS.md content into the admin build (import as raw string) and render read-only (markdown → HTML, sanitized). Zero runtime query cost.

## Risks / Trade-offs

- **Bulk delete is destructive and irreversible** → require explicit confirm in UI; server enforces id cap and capability; fire hook after so Pro can log/mirror.
- **CSV nonce in a GET URL can leak via logs/referrer** → short-lived nonce, capability re-checked server-side, no sensitive longtext columns in output.
- **Offline queue could replay stale/duplicate submissions** → include a client UUID per submission so the server (or client) can dedupe; cap + backoff prevent storms.
- **Clustering could hide the exact pin position** → threshold keeps it off for typical pages; expand-on-click restores precision.
- **Admin-bar cold cache** → first paint may compute counts once; acceptable because subsequent loads are warm. Do not add a new query path.
- **Status-board optimistic drag** → revert-on-failure and surfaced error prevent silent state drift.

## Migration Plan

- No DB migration expected. If a new sort/filter column is ever required, add migration `0006` following 0005's idempotent `information_schema.STATISTICS` index pattern; only the last migration stamps `markaroo_db_version` and fires `markaroo/db/migrated`.
- Ship behind normal plugin update; features are additive. Rollback = revert the plugin version (no schema to undo).
- Regenerate `.pot` for new UI strings; rebuild production assets (`npm run build`, no source maps).

## Open Questions

- Bulk id cap value — 200 proposed; confirm against realistic agency batch sizes.
- Offline queue drop policy when full — drop-oldest vs reject-newest (proposal leans drop-oldest with a UI notice).
- Status board "in progress" / "approved" — are these existing `status` values or do they need to be added to the allowed status set? If added, that is the only potential schema/enum touch.
