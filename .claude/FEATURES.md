# Markaroo — Feature Roadmap & Smooth-Operation Guide

Suggestions based on what the plugin already is (visual feedback + task management for agencies) and what keeps it fast. Everything here respects the free/pro split in CLAUDE.md — nothing below duplicates a Pro-reserved feature; where a Pro upgrade is obvious, the free feature should fire a `markaroo/*` hook at the decision point.

## Recommended features (free tier)

### 1. Bulk actions in the task list — highest value
Select multiple rows in `TaskListView` → bulk resolve / assign / tag / delete.
- **Perf-aware design:** one REST call (`POST /feedback/bulk`) executing a single `UPDATE … WHERE id IN (…)`, never N per-row PATCHes. Bust `counts_*` caches once.
- **Hook:** `do_action('markaroo/feedback/bulk_updated', $ids, $changes)` for Pro sync integrations.

### 2. Saved filters / "My tasks" view
Persist filter combos (status+priority+assignee+tag) per user; a default "Assigned to me" tab.
- **Perf-aware design:** pure client-side over the existing query args — zero new endpoints. Store in user meta (`markaroo_saved_filters`) via the settings endpoint.

### 3. CSV export of feedback
Agencies report to clients; a one-click CSV of the current filtered list.
- **Perf-aware design:** stream with pagination (reuse the `fields => 'summary'` repository mode added in the perf refactor, 500 rows per chunk) — never `SELECT *` unbounded. Exclude longtext columns by default.

### 4. Admin-bar feedback counts
Show "3 open" on the WP admin bar for the current page when a reviewer is logged in.
- **Perf-aware design:** reuses the already-transient-cached `/counts` (`counts_page_<md5>`); zero extra queries on warm cache.

### 5. Keyboard shortcuts + quick-resolve
`n` = new pin, `esc` = cancel capture, `r` = resolve active pin, `[`/`]` = cycle pins.
- **Perf-aware design:** one document-level keydown listener registered while the session is active; no per-pin listeners.

### 6. "Send test digest" button in Settings
Debugging notifications currently requires waiting for cron.
- **Perf-aware design:** reuses `NotificationQueue::flush_digest()` for the current user only; runs through the same `markaroo/notify/*` filters so Pro routing is exercised too.

### 7. Offline-tolerant submit (retry queue)
If `POST /feedback` fails (flaky client wifi mid-review), keep the payload in `sessionStorage` and retry with backoff; show "queued" state on the pin.
- **Perf-aware design:** cap the queue (e.g. 5 items); screenshots stay as Blobs in memory, only metadata persists.

### 8. Pin clustering above ~30 pins
Heavily-annotated pages become unreadable and render-heavy.
- **Perf-aware design:** cluster client-side by proximity; render one cluster marker per group (fewer DOM nodes — complements the `React.memo` pin work). Expand on click.

### 9. Feedback status board (simple Kanban)
Columns = statuses (open / in progress / resolved / approved), drag between columns.
- **Perf-aware design:** columns fetch with `per_page=25` + the summary field mode; drag = one PATCH. `markaroo/status/changed` already fires for Pro.

### 10. HOOKS.md surfaced in-admin
A read-only "Developers" tab rendering HOOKS.md — makes the Pro/integration contract discoverable.
- **Perf-aware design:** static content, rendered from a bundled string; zero runtime cost.

## How it keeps running smoothly (operating principles)

These are the invariants the performance refactor established — new features must not regress them:

1. **No hidden queries per model op.** Repositories use prepared `$wpdb` directly; never reintroduce `Feedback::where()` chains in hot paths (each one costs a `DESC` schema query in WP Bones).
2. **Lists fetch summary columns only.** Any new list-shaped endpoint uses `FeedbackRepository::list(['fields' => 'summary'])` and batches related lookups (`_prime_post_caches`) instead of per-row calls.
3. **Never block a request on email.** All notification sends go through `NotificationQueue::dispatch()` → deferred cron; direct `Mailer::send()`/`wp_mail()` calls in controllers are a regression.
4. **Filters belong in SQL.** WHERE conditions run in the query (with proper indexes), never as PHP post-filtering after LIMIT — that corrupts pagination totals.
5. **Index every new sort/filter column.** Add a migration (follow `0005`'s idempotent `information_schema.STATISTICS` pattern); only the *last* migration file stamps `markaroo_db_version` and fires `markaroo/db/migrated`.
6. **Cache reads, bust on writes.** Use `Markaroo\Support\Cache` (transient + request memo, `markaroo_` prefixed). Every mutation path must `Cache::forget()` its keys — see the `counts_*` and `share_*` patterns.
7. **Settings reads are free, but only because of the memo.** Call `Settings::get()` liberally; call `Settings::flush_memo()` in tests after direct option writes.
8. **Binary uploads, never base64 JSON.** Screenshots/attachments go through multipart endpoints with the `markaroo/screenshot/max_bytes` size gate.
9. **Frontend: one fetch per resource per session.** Shared promise caches (see `fetchUsers()` in `widget/api.ts`); no polling — use `ResizeObserver`/events; rAF-throttle anything that forces layout; `React.memo` + stable callbacks for per-item components.
10. **Production builds only.** `npm run build` (no source maps, minified); release artifacts via `composer install --no-dev -o` — the dev vendor tree is ~17 MB of PHPCS that must never ship.
11. **Every new capability = hook pair.** `do_action('markaroo/...')` at the decision point, `apply_filters('markaroo/...')` around the data, documented in HOOKS.md — that's the Pro contract.
