## Why

Markaroo's core feedback-and-task loop is shipped, but agencies still lack the day-to-day workflow tools that make triaging feedback fast at scale: no bulk operations, no saved views, no export, no keyboard-driven review, and no in-product discoverability of the Pro/integration contract. FEATURES.md captured ten free-tier features that close these gaps while preserving every performance invariant the recent audit established. This change implements all ten.

## What Changes

- **Bulk actions** in the task list: multi-select rows to resolve / assign / tag / delete in one REST call (`POST /feedback/bulk`, single `UPDATE … WHERE id IN (…)`).
- **Saved filters / "My tasks"**: persist filter combos per user in `markaroo_saved_filters` user meta; default "Assigned to me" tab. Client-side over existing query args, no new list endpoint.
- **CSV export** of the current filtered feedback list, streamed in 500-row chunks using the `fields => 'summary'` repository mode.
- **Admin-bar feedback counts**: show open count for the current page in the WP admin bar, served from the already-cached `/counts` endpoint.
- **Keyboard shortcuts + quick-resolve** in the active widget session: `n` new pin, `esc` cancel capture, `r` resolve active pin, `[` / `]` cycle pins — one document-level listener.
- **"Send test digest"** button in Settings, reusing `NotificationQueue::flush_digest()` for the current user through the same `markaroo/notify/*` filters.
- **Offline-tolerant submit**: queue failed `POST /feedback` payloads in `sessionStorage` (cap 5) and retry with backoff; show a "queued" pin state.
- **Pin clustering** above ~30 pins: cluster client-side by proximity, render one marker per group, expand on click.
- **Feedback status board (simple Kanban)**: status columns with drag-between; each column paginated with the summary field mode, drag = one PATCH.
- **In-admin Developers tab** rendering HOOKS.md read-only from a bundled string.
- Each new capability fires a `do_action('markaroo/…')` at its decision point and exposes an `apply_filters('markaroo/…')` around its data, documented in HOOKS.md — extending the Pro contract without core edits.

## Capabilities

### New Capabilities
- `bulk-feedback-actions`: multi-select task-list operations via a single batched REST endpoint, with cache invalidation and a Pro sync hook.
- `saved-filters`: per-user persisted filter combinations and a default "Assigned to me" view, stored in user meta.
- `feedback-csv-export`: chunked, summary-column CSV export of the current filtered feedback list.
- `admin-bar-counts`: WP admin-bar open-feedback count for the current page from cached counts.
- `widget-keyboard-shortcuts`: keyboard-driven pin creation, capture cancel, quick-resolve, and pin cycling during an active session.
- `test-digest-send`: Settings action to send the digest notification to the current user on demand.
- `offline-submit-queue`: client-side retry queue for failed feedback submissions with a queued pin state.
- `pin-clustering`: proximity-based client-side clustering of pins above a density threshold.
- `feedback-status-board`: Kanban-style status board with drag-to-change-status backed by single PATCH calls.
- `developers-hooks-tab`: read-only in-admin page rendering the HOOKS.md integration contract.

### Modified Capabilities
<!-- No existing specs in openspec/specs/; all behavior here is net-new. -->

## Impact

- **PHP:** new `FeedbackController` bulk + export handlers (or a dedicated `BulkController` / `ExportController`); `SettingsController` test-digest action; admin-bar hook registration in a service provider; new capability + nonce checks on each write path.
- **REST:** `POST markaroo/v1/feedback/bulk`, `GET markaroo/v1/feedback/export`, `POST markaroo/v1/notifications/test-digest`.
- **DB / indexes:** no schema change expected; reuse `idx_priority` / `idx_updated_at` from migration 0005. Add an index only if a new sort/filter column appears (follow 0005's idempotent pattern; only the last migration stamps `markaroo_db_version`).
- **React (dashboard):** `TaskListView` bulk-select UI, saved-filter tabs, CSV export button, new `StatusBoardView`, Developers tab.
- **React (widget):** keyboard handler, offline queue in `api.ts`, pin clustering in `PinLayer`.
- **User meta / options:** `markaroo_saved_filters`.
- **Docs:** HOOKS.md extended with the new hook pairs; `.pot` regenerated for new strings.
- **Perf invariants:** must not regress the ten operating principles in FEATURES.md (no per-row queries, summary-only lists, deferred email, SQL-side filters, cache-bust-on-write, one fetch per resource per session).
