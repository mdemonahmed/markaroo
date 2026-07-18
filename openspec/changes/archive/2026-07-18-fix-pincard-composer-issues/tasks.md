## 1. Attachment upload 500 (backend, isolated)

- [x] 1.1 In `plugin/Http/Controllers/AttachmentsController.php`, require `wp-admin/includes/image.php` and `wp-admin/includes/media.php` unconditionally (guard on `function_exists('wp_generate_attachment_metadata')`) before calling `wp_generate_attachment_metadata()`.
- [ ] 1.2 Manually verify: upload a PNG and a PDF via the composer → both return 201 with metadata, no 500.

## 2. Markdown rendering on display

- [x] 2.1 Add `resources/assets/widget/support/renderMarkdown.tsx`: pure function `renderMarkdown(text: string): React.ReactNode` handling `**bold**`, `*italic*`, `` `code` ``, `[t](url)` (allowlist http/https/mailto), and `-`/`1.` list lines. React text nodes only — no `dangerouslySetInnerHTML`.
- [x] 2.2 Add a `demo()`/self-check (assert-based) covering bold, link, and a `<script>` input staying escaped.
- [x] 2.3 Use `renderMarkdown` in `PinCard.tsx` root entry body (`item.comment`) and in `ReplyRow`/reply display, replacing `<p>{ text }</p>`.

## 3. Composer toolbar icons

- [x] 3.1 In `MarkdownToolbar.tsx`, replace each `ACTIONS[].icon` with a consistent inline SVG (bold, italic, bullet list, ordered list, link, code). Leave `apply`/insert logic unchanged.

## 4. Mentions: show-all + reliable persistence

- [x] 4.1 `MentionAutocomplete.tsx`: on empty query, show first N users from `fetchUsers()` instead of returning `[]`.
- [x] 4.2 `ComposerPanel.tsx`: track selected mention user IDs; `insertMention` records `user.id`; include `mention_ids` in the create payload.
- [x] 4.3 `ReplyComposer.tsx`: same — record selected mention IDs and send `mention_ids` on reply create.
- [x] 4.4 `FeedbackController.php` reply create: read sanitized `mention_ids` (absint array); union with existing regex parse; fire `markaroo/mention` for the resolved IDs.
- [x] 4.5 `FeedbackController.php` feedback create (store): add the same `mention_ids` + regex-parse block and fire `markaroo/mention` (currently missing on feedback create).
- [x] 4.6 Register `mention_ids` as an accepted param on the feedback + reply create routes if arg validation is enforced there.

## 5. Region annotator undo icon

- [x] 5.1 In `RegionAnnotator.tsx`, replace the undo button SVG path with a clearer counter-clockwise undo-arrow glyph.

## 7. Attachments persisted on create (files/images shown on the pin card)

- [x] 7.1 `ComposerPanel.tsx`: include the uploaded `attachments` array (JSON) in the create payload — it was collected by `AttachmentPicker` but never sent, so files/images never linked to the feedback row.
- [x] 7.2 `FeedbackController::create()`: read + store `attachments`. Add `sanitize_attachments()` that re-derives every field server-side from the media ID and drops non-Markaroo/unknown IDs (client can't spoof URLs or link foreign media).
- [x] 7.3 Rebuild + phpcs clean.
- [ ] 7.4 Manual: create a pin with a file + image attachment → both appear in the pin card's Attachments section on reopen. (Screenshot already has a working display path via `screenshot_url`.)

## 6. Build, checks, done

- [x] 6.1 `yarn build` (or the project's build script) — React bundle compiles clean.
- [x] 6.2 `yarn test` passes (including the new renderMarkdown self-check); React lints clean.
- [x] 6.3 `phpcs` (WordPress ruleset) passes on the changed PHP files.
- [x] 6.4 Regenerate `.pot` if any new translatable strings were added. — N/A, no new translatable strings introduced.
- [ ] 6.5 Manual smoke: create feedback with bold/italic/link + an @mention + a file attachment → renders formatted, mention notifies, attachment uploads; undo icon looks right.
