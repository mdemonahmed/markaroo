## Why

The pin feedback composer and pin card look complete but three core interactions are broken in practice: markdown the user writes is never rendered (bold/italic/code/links show as raw `**text**`), @mentions never resolve or notify (the autocomplete requires typing and a display name with a space silently fails to save), and file attachments 500 on upload. The region-annotator undo control also uses a confusing icon. These are the primary "write feedback" touchpoints, so they undermine the whole widget.

## What Changes

- **Render markdown on display.** Comment and reply text in the pin card render bold, italic, inline code, links, and lists instead of raw markdown source. Rendering is safe (no raw HTML injection).
- **Fix the composer toolbar icons.** Replace the mixed text/emoji glyphs (`B`, `I`, `≡`, `1.`, `🔗`, `<>`) with a consistent SVG icon set. The insert behavior already works.
- **@ shows everyone.** Typing `@` (empty query) lists all assignable users immediately; continuing to type filters. Selecting a user records a mention that reliably persists and fires the notification hook — fixing the current failure where a display name containing a space (`@John Doe`) is never matched by the backend.
- **Fix attachment upload 500.** Root cause: `wp_generate_attachment_metadata()` (in `wp-admin/includes/image.php`) is called but that file is only required behind a guard keyed on `wp_insert_attachment`, which is always loaded — so `image.php`/`media.php` never load and the call fatals. Require them unconditionally.
- **Change the annotator undo icon** to a clearer undo-arrow glyph.

## Capabilities

### New Capabilities
- `feedback-comment-formatting`: How feedback/reply comment text is authored and displayed — markdown rendering on display, the composer formatting toolbar, and the @mention autocomplete + mention persistence/notification contract.

### Modified Capabilities
<!-- None: undo icon and attachment 500 are bug fixes restoring intended behavior, no requirement change. -->

## Impact

- **Frontend:** `resources/assets/widget/composer/MarkdownToolbar.tsx` (icons), `.../composer/ComposerPanel.tsx` and `.../thread/ReplyComposer.tsx` (mention capture → payload), `.../thread/MentionAutocomplete.tsx` (show-all on empty query), `.../thread/PinCard.tsx` (render markdown), `.../capture/RegionAnnotator.tsx` (undo icon), plus a new small `renderMarkdown` support helper.
- **Backend:** `plugin/Http/Controllers/AttachmentsController.php` (require image/media includes), `plugin/Http/Controllers/FeedbackController.php` (accept `mention_ids` on feedback + reply create; fire `markaroo/mention` on feedback create too).
- **APIs:** feedback + reply create accept an optional `mention_ids` array. No breaking changes.
- **Build:** React bundle rebuild; `.pot` regen if strings added.
