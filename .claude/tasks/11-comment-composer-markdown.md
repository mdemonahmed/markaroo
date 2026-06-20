# 11 — Comment composer + markdown toolbar

**Depends on:** 08
**Goal:** The feedback composer where the user writes the comment, sets priority, optionally assigns/dates/tags, and submits in one click. Includes a markdown/rich-text toolbar.

## Scope (free)
- Composer panel (see competitor screenshot: textarea + priority select + attach + submit).
- Markdown toolbar: bold, italic, bullet list, numbered list, link, inline code.
- One-click submit that bundles comment + metadata + screenshot + annotations.
- Auto-captured metadata attached invisibly.

## Steps
1. Composer fields:
   - comment body (markdown), with the toolbar above it,
   - priority select (Urgent/High/Normal/Low; default from settings),
   - optional assignee dropdown (task 14, only if `enable_assignment`),
   - optional due date (task 14, only if `enable_due_dates`),
   - optional tags (task 14),
   - attach files button (task 15),
   - submit + cancel.
2. **Markdown toolbar:** each button wraps/inserts markdown around the selection (`**bold**`, `*italic*`, `- `, `1. `, `[text](url)`, `` `code` ``). Store raw markdown in `comment`. Render with a small safe markdown renderer on display (sanitize → `wp_kses_post` server-side; client render escapes HTML).
3. **Auto metadata** captured silently on submit and sent with the POST: `page_url`, `page_key` (normalized path), `viewport`, `user_agent`. Server parses `os`/`browser` from UA (task 01 helper).
4. **One-click submit:** build the payload (comment, priority, position from task 08, screenshot_rect with annotations, metadata), POST to `/feedback`, then deferred screenshot upload (task 09). Optimistically add the pin to the panel; reconcile on response.
5. Validate non-empty comment. Show inline errors. Disable submit while in flight.

## Hooks
- `apply_filters('markaroo/composer/fields', $fields, $ctx)` — pro adds fields (e.g. severity).
- `apply_filters('markaroo/comment/render', $html, $markdown)` — pro AI rewrite/translate can hook display.
- JS event `markaroo:feedback-submitted`.

## Acceptance
- Markdown toolbar inserts correct syntax around selections; rendered output is safe (no XSS).
- Submitting once creates the feedback with all metadata; screenshot attaches after.
- Priority defaults from settings; optional fields hidden when their settings are off.
- Empty comment blocked with a clear message.
