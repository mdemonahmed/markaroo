# Markaroo — Performance Audit

**Date:** 2026-07-12 · **Auditor:** Principal-architect-level review (full backend, frontend, infra sweep)
**Scope:** every REST endpoint, DB query, provider boot path, cron job, React widget/admin bundle, and build/deploy config in the free plugin.

## Executive summary

The audit found **25 issues**. The dominant costs were: an ORM that issued a hidden `DESC {table}` schema query on *every* model operation, synchronous `wp_mail()` calls inside POST requests, an N+1 attachment-URL lookup on every feedback list, `SELECT *` over-fetching of longtext columns, three missing indexes, a settings store that rebuilt (option read + deep merge + filter) 10–15× per page, an uncached share-token DB hit on every guest page view, ~900 KB of source maps shipped in `public/`, and screenshots posted as base64 JSON instead of binary multipart.

**All high-impact items (Phase 1 + Phase 2 below) are fixed and verified** — phpcs clean, Jest green, live REST + widget E2E on feedback.test passed, migration idempotence confirmed. Phase 3 items are documented but intentionally deferred.

Measured after the fix: a full create→find→update→delete cycle is now **6 SQL queries with zero `DESC` queries** (previously 10+, four of them `DESC`). The production widget bundle dropped from 165 KB to **53 KB** and the html2canvas chunk from 431 KB to **194 KB** (the shipped files were dev-mode builds); all `.map` files (~900 KB) are gone.

## ROI-ranked findings

| # | Finding | Impact | Risk | Status |
|---|---------|--------|------|--------|
| B1 | ORM `DESC {table}` query per model op (no schema cache) | High — extra query on every write/read path | Low (bypass in repos) | ✅ Fixed |
| B14 | ORM `update()` interpolates values with **no SQL escaping** | High — correctness/security: apostrophe breaks query | Low | ✅ Fixed |
| B2 | Synchronous `wp_mail()` per recipient inside POST requests | High — 100s of ms–seconds added to submit latency | Medium | ✅ Fixed |
| B4 | `SELECT *` longtext over-fetch + tag filter applied *after* LIMIT (wrong totals) | High — payload + correctness bug | Low | ✅ Fixed |
| B3 | N+1 `wp_get_attachment_url()` per feedback list row | High — ~2 queries/row per list request | Low | ✅ Fixed |
| B5 | Missing indexes: `priority`, `due_date`, `updated_at` | High — filesort/full scan on common orderings | Low | ✅ Fixed (migration 0005) |
| B7 | `Settings::all()` rebuilt on every `Settings::get()` (10–15×/page) | Medium-high CPU | Low | ✅ Fixed |
| F2 | Screenshot sent as base64 inside feedback JSON (+33% size, in-request decode) | High — multi-MB submits on retina | Medium | ✅ Fixed |
| F1 | Source maps shipped in `public/` (~900 KB) | High — transfer + source exposure | Low | ✅ Fixed |
| B10 | Guest share token → uncached DB SELECT every page load | Medium | Low | ✅ Fixed |
| B13 | One `get_users()` query per @mention token, unbounded | Medium | Medium | ✅ Fixed |
| B8 | `update_user_meta` write on every logged-in REST request | Medium — write per request | Low | ✅ Fixed |
| B9 | `wp_next_scheduled()` checked every request; digest cron re-ran the same site-wide COUNT per recipient | Medium | Medium | ✅ Fixed |
| B11 | Unbounded base64 decode in create request; attachment metadata generated but never saved | Medium + bug | Low/Medium | ✅ Fixed |
| B12 | `_markaroo_attachment` meta never set → uninstall media cleanup was a no-op | Bug | Low | ✅ Fixed |
| F4 | `users?per_page=50` fetched separately by 3 components, per keystroke in mentions | Medium | Low | ✅ Fixed |
| F3 | Unthrottled scroll listener forcing layout per event in every open PinCard | Medium — jank | Low | ✅ Fixed |
| F5 | Whole-state context re-renders + unmemoized pin markers | Medium — render cost scales with pin count | Medium | ✅ Fixed |
| F6 | 1 s `setInterval` polling document size during feedback sessions | Low-medium | Low | ✅ Fixed |
| I1 | No `optimize-autoloader`; 19 MB vendor is ~94% dev-only PHPCS | Medium (ship size) | Low | ✅ Fixed (config) — exclude dev deps at ship time |
| B6 | `/counts` = 4–5 aggregate scans when transient cold | Low (5-min cache in front) | Low | ⏳ Deferred |
| B15 | GDPR exporter ignores `$page` (no pagination) | Low | Low | ⏳ Deferred |
| B16 | WP Bones `get_plugin_data()` parses plugin header from disk every request | Low | — (vendor) | 📝 Documented only |
| I2 | `widget.asset.php` `file_exists`+`require` per widget page | Negligible | — | 📝 Measured and rejected |
| F7 | `per_page=100` initial pin fetch | Low (now slimmed by B4) | — | 📝 Covered by B4 |

---

## Backend findings

### B1 — ORM schema query per operation ✅
- **Root cause:** `vendor/wpbones/wpbones/src/Database/QueryBuilder.php:168` runs `DESC {table}` in the constructor with no cache, and `Model::__callStatic` constructs a new instance for every `Feedback::where()/insert()` call. Every find/create/update/delete carried a hidden extra query.
- **Fix:** repositories (`plugin/Repositories/*.php`) now use `$wpdb` directly with `prepare()`/`insert()`/`update()`/`delete()`. `vendor/` untouched (a vendor patch would be wiped by `php bones update`; CLAUDE.md sanctions raw `$wpdb` inside the repository layer). Model classes are kept for Pro compatibility.
- **Measured:** create+find+update+delete = 6 queries, 0 `DESC` (was 10+, 4 `DESC`).
- **Contract note:** hooks now receive `stdClass` rows instead of Model instances — property access identical; `(array)` casts now work *correctly* (they previously produced mangled `\0*\0attributes` keys, which silently broke notification email payloads). Documented in HOOKS.md.

### B14 — Unescaped SQL in ORM `update()` ✅
- **Root cause:** `QueryBuilder::update()` (vendor, line ~866) builds `SET col = '$value'` by string interpolation with no escaping. `wp_kses_post()`/`sanitize_text_field()` do not SQL-escape, so any comment containing `'` corrupted the query (data loss / injection surface).
- **Fix:** same repository conversion as B1 — `$wpdb->update()` escapes properly.
- **Verified:** `it's "quoted" — emoji 🎯` round-trips through create, update, and the live widget submit.

### B2 — Synchronous email in request path ✅
- **Root cause:** `NotificationQueue::dispatch()` called `Mailer::send()` (→ `wp_mail()`) inline for instant/smart-offline recipients — one blocking SMTP/sendmail call *per admin* inside `POST /feedback`, replies, mentions.
- **Fix:** `send_or_defer()` schedules a `markaroo_send_notification` WP-Cron single event; `Mailer::send` is hooked to it. New `markaroo/notify/defer` filter opts back into synchronous sending for hosts with unreliable cron. `markaroo/notify/should_send` still fires in-request with identical args. Uninstall clears pending events.
- **Expected gain:** feedback-submit latency no longer includes mail transport (often 100 ms–2 s per recipient).

### B3 — N+1 attachment lookups on list ✅
- **Root cause:** `FeedbackController::format_item()` calls `wp_get_attachment_url()` per row; on a cold cache that is a posts + postmeta query per feedback item (≈40 extra queries for a 20-row page with screenshots).
- **Fix:** `index()` collects `screenshot_id`s and calls `_prime_post_caches($ids, false, true)` — two batched queries warm the cache for all rows.

### B4 — List over-fetch + tag-filter pagination bug ✅
- **Root cause:** `FeedbackRepository::list()` selected `*` (including longtext `screenshot_rect`, `attachments`, `user_agent`, `page_url`) for list views that never read them, and applied the tag filter in PHP *after* LIMIT — returning wrong `total` values and silently dropping matching rows on later pages.
- **Fix:** new `fields => 'summary'` mode with an explicit column list (verified against every widget/admin consumer — none read the excluded columns from list payloads; `PinCard` refetches the full item on open). Tag filtering moved into SQL (`tags LIKE '%"tag"%'` against the JSON array), fixing COUNT/LIMIT correctness. `format_item()` emits stable default keys so the REST response shape is unchanged.

### B5 — Missing indexes + non-sargable date filter ✅
- **Root cause:** `priority`, `due_date`, `updated_at` are used in ORDER BY / WHERE / GROUP BY but had no index; `count_today()` used `DATE(created_at) = %s`, which defeats the `created_at` index.
- **Fix:** migration `0005_add_indexes_to_markaroo_feedback.php` adds `idx_priority`, `idx_due_date`, `idx_updated_at` (idempotent via `information_schema.STATISTICS`; DB version → 1.2.0; the version stamp + `markaroo/db/migrated` moved here from 0004 to avoid a duplicate-constant fatal). `count_today()` rewritten as a `created_at >= X AND < Y` range.
- **Verified:** double deactivate/activate cycle — no SQL errors, all 9 indexes present.

### B7 — Settings rebuilt per call ✅
- **Root cause:** `Settings::all()` did `get_option` + defaults rebuild + `deep_merge` + `apply_filters('markaroo/settings')` on every call; `FrontendServiceProvider` + `Config` call it 10–15× per widget page.
- **Fix:** static per-request memo, invalidated by `update()`; `flush_memo()` exposed for tests. The filter still runs (once per request) — noted in the docblock for Pro.

### B8 — Activity meta write per REST request ✅
- **Fix:** `track_rest_activity()` now reads first and only writes when >60 s stale. Smart mode uses a 15-min window, so 60 s granularity is lossless.

### B9 — Cron scheduling + digest flush ✅
- **Fix:** initial `wp_schedule_event` moved to activation; the provider keeps a self-heal check gated to admin screens behind a 12 h transient. `flush_all_digests()` computes the site-wide open COUNT once and passes it to `flush_digest($uid, $open_count)` (the old code also contained a dead per-queue counting loop whose result was immediately overwritten — removed).

### B10 — Share-token lookup per guest page ✅
- **Fix:** `resolve_valid_share()` caches token→row in a transient (5 min, negative results cached as a sentinel); expiry check stays outside the cache. `ShareRepository::revoke()` busts the entry (regenerate loops revoke), covering all mutation paths.

### B11 — Screenshot decode + attachment metadata ✅
- **Fix:** both upload paths reject payloads over `apply_filters('markaroo/screenshot/max_bytes', 8MB)` — the base64 path *before* decoding (413 response; feedback creation still succeeds, and a new `markaroo/screenshot/failed` action fires on the silent-skip path). `AttachmentsController` now saves the generated metadata via `wp_update_attachment_metadata()` (it was generated and discarded).

### B12 — Uninstall media cleanup no-op ✅
- **Fix:** both `ScreenshotController` and `AttachmentsController` now tag uploads with `_markaroo_attachment` post meta — the key `Uninstall::remove_uploaded_files()` has always searched for.

### B13 — Per-token mention queries ✅
- **Fix:** `resolve_mention_ids()` caps at 10 unique tokens and resolves via one `login__in` batch, one `nicename__in` batch, then per-token fuzzy search only for leftovers. `markaroo/mention` args unchanged.

## Frontend findings

### F1 — Source maps in production ✅
- **Fix:** `webpack.config.js` sets `devtool: false` for production. Rebuild removed all `.map` files; the previously shipped bundles were also dev-mode (unminified) — production build shrank `widget.js` 165 KB → **53 KB** and the lazy html2canvas chunk 431 KB → **194 KB**.

### F2 — Base64 screenshot in JSON ✅
- **Fix:** `ComposerPanel` now POSTs the feedback JSON *without* the screenshot, then uploads the image as binary `FormData` to the existing `POST /feedback/{id}/screenshot` route (permission callback already allows guest `can_comment` tokens — verified live as a guest). Upload failure never fails the feedback (matches prior semantics). The server-side base64 path remains fully functional for old bundles/Pro. `Screenshot.ts` also stops defaulting `scale` to `devicePixelRatio` (a 2–3× retina scale quadruples the canvas + payload); PHP config can raise it via `markaroo/screenshot/options`.
- **Verified live:** network shows `POST /feedback` (201) then `POST /feedback/19/screenshot` (200) and the uploaded JPEG serving.

### F3 — Unthrottled PinCard scroll listener ✅
- **Fix:** reposition work wrapped in `requestAnimationFrame` with an in-flight flag — at most one forced layout per frame instead of per scroll event.

### F4 — Repeated users fetches ✅
- **Fix:** `fetchUsers()` in `api.ts` shares one in-flight promise per page session (reset on failure so retries work); `ComposerPanel`, `PinCard`, and `MentionAutocomplete` all use it. Mention autocomplete now filters client-side per keystroke instead of issuing a REST search per keypress. Jest test added (`resources/assets/widget/__tests__/api.test.ts`).

### F5 — Context re-renders / unmemoized pins ✅
- **Fix:** `PinMarker` wrapped in `React.memo`; `PinLayer` passes stable id-taking `useCallback` handlers (latest state read through refs), so one pin's change no longer re-renders every sibling. The state/dispatch context split was kept as-is (splitting state further judged higher-risk than the win).

### F6 — 1 s document-size polling ✅
- **Fix:** `ResizeObserver` on `documentElement` + `body`; the interval remains only as a fallback where `ResizeObserver` is undefined.

## Infrastructure findings

### I1 — Composer autoloader / vendor size ✅ (config)
- `optimize-autoloader: true` added to `composer.json`. **Ship-time requirement:** build release artifacts with `composer install --no-dev -o` — 17 MB of the 19 MB vendor tree is dev-only PHPCS tooling that must not ship to WP.org.

## Vendor framework issues (documented, not patched)

- **B1/B14** are root-caused in `wpbones/wpbones` (`QueryBuilder::getTableDescription`, `QueryBuilder::update`). Decision: bypass in the repository layer rather than patch `vendor/` — a framework update would silently revert a vendor patch, and the repository layer is the plugin's sanctioned raw-SQL boundary. If WP Bones ships a schema cache + prepared updates upstream, the repositories can be re-evaluated.
- **B16:** `Plugin::_init()` calls `get_plugin_data()` (disk header parse) and registers all providers on every request. ~1 file parse/request; accept until fixed upstream.

## Correctness bugs found during the audit (all fixed)

1. Tag filter after LIMIT → wrong pagination totals + dropped rows (B4).
2. ORM `update()` with zero SQL escaping → apostrophes corrupted writes (B14).
3. `(array) $feedback` on WP Bones Models produced mangled keys → notification email bodies were reading empty fields (fixed as a side effect of B1).
4. Attachment metadata generated but never persisted (B11).
5. `_markaroo_attachment` meta never written → uninstall cleanup matched nothing (B12).
6. Dead per-queue count loop in `flush_digest()` whose result was immediately overwritten (B9).
7. Migration 0004 held the file-scope `MARKAROO_DB_VERSION` const that would fatal on redeclare once another migration was added (B5).

## Phase 3 — deferred (low urgency)

- **B6:** fold `/counts` aggregates (`totals`, `count_today`, `counts_by_priority`) into one query; the 5-min transient already absorbs most cost.
- **B15:** honor `$page` in `Privacy::export_user_data` (`LIMIT 100 OFFSET …`, `done = count < 100`).
- Optional `sessionStorage` cache for the initial pin fetch; pin clustering above ~30 pins per page.

## Verification performed

1. `vendor/bin/phpcs -ps` on all touched files — zero errors; `php -l` clean.
2. `npm run build` — clean (one pre-existing prism autoprefixer warning); no `.map` in `public/`.
3. `npm test` — 3 tests green (incl. new `fetchUsers` cache test).
4. Repository regression via WP-CLI: apostrophe/quote/emoji round-trip on create+update; SQL tag filter totals; summary field mode; stable `format_item` keys; sargable `count_today`; CRUD = 6 queries / 0 `DESC`.
5. Migration: two full deactivate→activate cycles; `markaroo_db_version` = 1.2.0; all indexes present.
6. Notification deferral: instant-mode dispatch schedules `markaroo_send_notification`; event consumed by cron.
7. Live widget E2E (Playwright, guest share link on feedback.test): session start, pins render from slim payload, pin drop, composer, submit → JSON create + multipart screenshot upload, thumbnail render, `_markaroo_attachment` meta set. Only console error: the site's own missing favicon.
8. `languages/markaroo.pot` regenerated (new 413 error string included).
