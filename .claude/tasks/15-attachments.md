# 15 — Attachments

**Depends on:** 04, 11
**Goal:** Upload files alongside feedback. Images, PDFs, docs, spreadsheets, CSV, and text. Attachments open in a new tab and show file-type badges.

## Scope (free)
- Attach files in the composer and (optionally) on replies.
- Store via the WP media library; keep metadata JSON in `feedback.attachments`.
- File-type badges; open in new tab. Respect allowed types + max size from settings.

## Steps
1. **Upload endpoint** `/attachments` (task 04): validate type against `allowed_types`, size against `max_upload_mb`, then `wp_handle_upload` + `wp_insert_attachment`. Return `{ id, url, filename, mime, size, type_badge }`. Capability/share-comment gated.
2. **Allowed types (free):** images (jpg, png, gif, svg*, webp), pdf, doc/docx, xls/xlsx, csv, txt. (*SVG only if explicitly allowed; sanitize SVGs — note in task 21.)
3. **Composer integration:** "Attach files" button → upload → store returned meta in the feedback's `attachments` JSON array on submit/patch.
4. **Display:** in the detail popover and dashboard, list attachments with a type badge (PDF, DOC, XLS, CSV, IMG…) and a thumbnail for images. Click → open the file URL in a new tab (`target="_blank" rel="noopener"`).
5. **Screenshots vs attachments:** the auto screenshot (task 09) is tracked via `screenshot_id`/`screenshot_path`; user attachments live in `attachments`. Keep them separate.
6. **Cleanup:** when feedback is deleted, optionally remove its uploaded attachments (respect `delete_data_on_uninstall` only governs uninstall; per-item delete should remove its own uploads). Make this safe and reversible-aware.

## Hooks
- `apply_filters('markaroo/attachments/allowed_types', $types)`
- `apply_filters('markaroo/attachments/max_size', $bytes)`
- `do_action('markaroo/attachment/uploaded', $meta, $feedback_id)`

## Acceptance
- Allowed files upload and attach; disallowed types and oversized files are rejected with a clear message.
- Attachments show correct type badges; images show thumbnails; all open in a new tab.
- SVGs (if enabled) are sanitized before storage.
- Deleting a feedback item cleans up its uploaded attachments.
