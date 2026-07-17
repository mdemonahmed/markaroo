## Why

Pin display numbers run backwards: the REST list returns feedback ordered `created_at DESC`, and both the pin layer and the panel derive the badge number from the array index, so the newest pin is labelled `#1` and the oldest gets the highest number. Users read the number as "which comment came first", so the current output is simply wrong.

The panel row also wastes its most valuable line on a `#N · Page` label — "Page" is a meaningless constant for every row — and renders the author name and the comment title in nearly identical type, so the two blur together.

## What Changes

- Pin display numbers are ranked by creation order (oldest = `#1`, newest = highest number) instead of by position in the fetched array. Numbering becomes independent of REST sort order, so a future sort change cannot silently invert the badges again.
- Both the on-page pin badges and the panel rows read from one shared numbering helper, so they can never disagree.
- Panel row layout is restructured: the `#N · Page` line is dropped, and each row leads with the author's avatar next to the author name and relative time, followed by the title as the visually dominant line and the comment snippet as muted secondary text. The `#N` reference is retained but demoted to a subtle inline marker rather than a headline.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `panel-comment-list`: the "Comment-card rows" requirement changes — rows no longer show a `#N · <page label>` line, and author name vs. title gain a clear visual hierarchy led by the avatar. The "On-page pins follow the panel tab" requirement changes — pin display numbers are ranked by creation order rather than by list position.

## Impact

- `resources/assets/widget/support/` — new shared numbering helper.
- `resources/assets/widget/pins/PinLayer.tsx` — replaces its local `numberById` index map.
- `resources/assets/widget/FeedbackPanel.tsx` — replaces `feedbacks.indexOf( item ) + 1`; `FeedbackRow` markup restructured.
- `resources/assets/css/` (or the widget SCSS entry) — `.markaroo-feedback-row__*` styles for the new hierarchy.
- No PHP, REST, or database changes. `FeedbackRepository`'s `created_at DESC` default stays as-is; the fix makes the frontend independent of it.
- New/changed translatable strings require a `.pot` regeneration.
