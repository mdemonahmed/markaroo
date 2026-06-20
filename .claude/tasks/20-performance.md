# 20 — Performance (WP-specific)

**Depends on:** 07, 09
**Goal:** Keep the host site fast. Load nothing for unauthorized visitors, defer heavy work, and cache reads.

## Scope (free)
- Lazy-loaded screenshot library list.
- Deferred screenshot saving.
- Session + transient caching.
- Conditional asset loading for permitted users only.
- Async asset loading so the site isn't blocked.

## Steps
1. **Conditional assets:** the widget bundle + config load only when `markaroo/widget/should_load` is true (manage/author/valid share). Admin bundle loads only on Markaroo admin pages. Verified by checking no `markaroo-*` assets on a logged-out front-end page.
2. **Async loading:** enqueue scripts with `defer`/async (respect `async_assets` setting). The launcher renders fast; panels/data load after.
3. **Lazy `html2canvas`:** dynamic import only on capture (task 09). Confirm it's a separate chunk, not in the main bundle.
4. **Lazy screenshot library:** in pins panel and dashboard, load screenshot thumbnails lazily (intersection observer / `loading="lazy"`), and paginate feedback lists rather than loading everything.
5. **Deferred screenshot save:** submit feedback first, upload screenshot after (task 09) so the user isn't blocked.
6. **Caching:**
   - Transients for expensive reads: `/counts`, per-page feedback lists (`markaroo_counts`, `markaroo_page_{page_key}`), short TTL; bust on relevant mutations.
   - Session/request-level memoization in PHP for repeated lookups within a request.
   - Cache assignable users list briefly.
7. **Bundle hygiene:** code-split admin vs widget vs shared; tree-shake; avoid shipping dev deps.

## Hooks
- `apply_filters('markaroo/cache/ttl', $seconds, $key)`
- `do_action('markaroo/cache/flush', $keys)` (call on mutations).

## Acceptance
- Logged-out visitor on a normal page downloads zero Markaroo assets.
- `html2canvas` is a separate, on-demand chunk.
- `/counts` and page lists are served from transients on repeat hits and bust correctly after a mutation.
- Lighthouse/JS payload on a permitted page stays small; no render-blocking Markaroo scripts.
