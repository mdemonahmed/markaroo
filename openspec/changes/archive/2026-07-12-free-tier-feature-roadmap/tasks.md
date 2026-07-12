## 1. Shared groundwork

- [x] 1.1 Confirm `FeedbackRepository::list(['fields' => 'summary'])` supports `per_page` + `page` for chunked reads; add if missing
- [x] 1.2 Add a helper to resolve the current filter query args on the server (shared by bulk + export)
- [x] 1.3 Verify `Cache::forget` covers all `counts_*` keys touched by writes; document the key list

## 2. Bulk feedback actions

- [x] 2.1 Add `FeedbackRepository::bulk_update($ids, $changes)` and `bulk_delete($ids)` using a single prepared `UPDATE/DELETE … WHERE id IN (…)`
- [x] 2.2 Add `POST markaroo/v1/feedback/bulk` handler: nonce + `markaroo_manage_feedback` check, id validation (non-empty, ≤ cap), dispatch to repo
- [x] 2.3 Bust `counts_*` caches once after a successful batch; fire `do_action('markaroo/feedback/bulk_updated', $ids, $changes)`
- [x] 2.4 Add `apply_filters('markaroo/feedback/bulk_changes', $changes, $ids)` around the applied change set
- [x] 2.5 TaskListView: row multi-select + bulk toolbar (resolve/unresolve, assign, tag, delete) → one `/feedback/bulk` call; delete requires confirm
- [x] 2.6 Verify: bulk resolve of 3 rows issues one query; empty ids returns 400; unauthorized returns 403

## 3. Saved filters / "My tasks"

- [x] 3.1 Extend the settings endpoint to read/write `markaroo_saved_filters` user meta (allowed key)
- [x] 3.2 TaskListView: save current status+priority+assignee+tag combo as a named filter; list saved filters
- [x] 3.3 Apply a saved filter client-side over existing query args (no new list request shape)
- [x] 3.4 Add a built-in default "Assigned to me" tab filtering `assigned_to_id == current user`
- [x] 3.5 Verify: saved filter persists across reload; applying it issues no extra endpoint call

## 4. CSV export

- [x] 4.1 Add `GET markaroo/v1/feedback/export`: nonce (query arg) + capability check, reuse current filter args
- [x] 4.2 Loop `list(['fields'=>'summary','per_page'=>500,'page'=>n])`, stream CSV via `fputcsv` to `php://output`, flush per chunk, exclude longtext columns
- [x] 4.3 Add `apply_filters('markaroo/export/columns', $columns)` and `do_action('markaroo/export/completed', $count)`
- [x] 4.4 TaskListView: "Export CSV" button that downloads the current filtered list
- [x] 4.5 Verify: >500-row set streams in chunks without loading all rows; unauthorized returns 403

## 5. Admin-bar counts

- [x] 5.1 Register an `admin_bar_menu` node (and front-end session equivalent) in a service provider, gated on `markaroo_manage_feedback`
- [x] 5.2 Read open count from the `counts_page_<md5>` transient; populate via existing counts path only if cold
- [x] 5.3 Render "N open" (zero/neutral state when none); no node without capability
- [x] 5.4 Verify: warm cache adds no extra query; no node for users lacking capability

## 6. Widget keyboard shortcuts

- [x] 6.1 Add a single document-level `keydown` listener mounted while the session is active, removed on session end
- [x] 6.2 Ignore shortcuts when focus is in input/textarea/contenteditable
- [x] 6.3 Wire `n` (new pin), `esc` (cancel capture), `r` (resolve active pin, one PATCH), `[`/`]` (cycle pins) to existing callbacks
- [x] 6.4 Verify: typing `n` in composer inserts text; session end removes the listener

## 7. Test digest button

- [x] 7.1 Add `POST markaroo/v1/notifications/test-digest`: capability + nonce, call `NotificationQueue::flush_digest()` for current user via `markaroo/notify/*` filters
- [x] 7.2 Settings UI: "Send test digest" button with success/error state
- [x] 7.3 Verify: current user receives digest; unauthorized returns 403

## 8. Offline-tolerant submit

- [x] 8.1 In `widget/api.ts`, wrap the feedback POST: on network error, push metadata to a capped (5) `sessionStorage` queue with a client UUID
- [x] 8.2 Keep screenshot Blobs in a module-level in-memory map keyed by queue id; never serialize them
- [x] 8.3 Retry with exponential backoff; drain on success; enforce cap with drop policy + UI notice
- [x] 8.4 Show a "queued" pin state while pending
- [x] 8.5 Verify: failed submit queues and shows queued state; screenshot Blob not written to sessionStorage; retry drains on success

## 9. Pin clustering

- [x] 9.1 In `PinLayer`, when pin count > ~30, grid-bucket pins by rounded x/y and render one cluster `PinMarker` per bucket
- [x] 9.2 Leave pins unclustered below threshold; expand a cluster to member pins on click
- [x] 9.3 Preserve `React.memo` + stable callbacks so one pin change re-renders only its bucket
- [x] 9.4 Verify: 45 pins render as clusters; 12 render individually; single pin change does not re-render all markers

## 10. Feedback status board

- [x] 10.1 Confirm status set (open / in progress / resolved / approved); add missing values to the allowed status enum if needed
- [x] 10.2 New `StatusBoardView`: one column per status, each fetched `per_page=25` + summary fields
- [x] 10.3 HTML5 drag-drop between columns → one PATCH on drop; optimistic update with revert on failure
- [x] 10.4 Confirm `markaroo/status/changed` fires on the PATCH path
- [x] 10.5 Verify: drag to resolved issues one PATCH and fires the action; failed PATCH reverts the card

## 11. Developers (HOOKS.md) tab

- [x] 11.1 Bundle HOOKS.md as a raw string into the admin build
- [x] 11.2 Add a read-only "Developers" tab rendering the markdown → sanitized HTML, zero runtime query
- [x] 11.3 Verify: tab renders current HOOKS.md content after rebuild with no network/DB read

## 12. Cross-cutting Definition of Done

- [x] 12.1 Document all new hook pairs in HOOKS.md (bulk_updated, bulk_changes, export/columns, export/completed, and any others added)
- [x] 12.2 Ensure every write path has nonce + capability checks; escape on output, sanitize on input
- [x] 12.3 Mark all new UI strings translatable (`markaroo` text domain); regenerate `.pot`
- [x] 12.4 Run `phpcs` (WordPress ruleset) clean; React lints clean; no console errors front or admin
- [x] 12.5 Production build (`npm run build`, no source maps); confirm no perf-invariant regressions
