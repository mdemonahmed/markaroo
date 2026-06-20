# 09 — Screenshot capture (html2canvas)

**Depends on:** 08
**Goal:** Optionally attach a viewport screenshot with each feedback item. The library is lazy-loaded, output format/quality are configurable, and the screenshot is saved deferred to keep submission fast.

## Scope (free)
- Bundled `html2canvas`, loaded on demand (not on page load).
- JPEG or PNG output, configurable JPEG quality.
- Deferred saving: submit feedback first, upload the screenshot right after.
- Input masking option (basic data masking — full obfuscation is pro; see task 21).

## Steps
1. **Lazy load:** import `html2canvas` dynamically (`await import('html2canvas')`) only when a capture starts and `enable_screenshots` is true. Cache the module after first load.
2. **Capture:** render the current viewport (or page area around the pin/region) to a canvas. Respect `screenshot_format` and `screenshot_quality` from settings when exporting (`canvas.toBlob(..., 'image/jpeg', quality)` or PNG).
3. **Masking:** if `mask_inputs_in_screenshots` is true, replace text inside inputs/textareas/`[data-markaroo-mask]` with neutral blocks before capture (use html2canvas `onclone` to mutate the clone, never the live DOM).
4. **Clean capture:** hide all Markaroo UI (`#markaroo-root`) during capture so pins/panels don't appear in the shot. This is why clean mode + panel auto-hide exist.
5. **Deferred save flow:**
   - POST feedback (task 04) → get `id`.
   - Then POST the screenshot blob to `/attachments` (or a dedicated `/feedback/{id}/screenshot`) which `wp_handle_upload`s it into the media library, returns `screenshot_id` + `screenshot_path`, and PATCHes the feedback row.
   - If the screenshot upload fails, the feedback still exists (graceful).
6. **Library on the frontend:** lazy-load the saved-screenshot thumbnails in the pins panel and dashboard (task 20 covers lazy-loading the library list).

## Hooks
- `apply_filters('markaroo/screenshot/options', $opts)` — format/quality/scale.
- `do_action('markaroo/screenshot/before_capture', $ctx)` / `markaroo/screenshot/after_capture`.
- JS event `markaroo:screenshot-ready` with the blob (pro recording/replay can hook here).

## Acceptance
- `html2canvas` is NOT in the initial page payload; it loads only on capture (verify in network tab).
- JPEG quality and PNG/JPEG toggle change the output and file size.
- Markaroo UI never appears in the screenshot.
- Masked inputs show blocks, live DOM untouched.
- Feedback submit succeeds even if screenshot upload fails; screenshot attaches afterward when it succeeds.
