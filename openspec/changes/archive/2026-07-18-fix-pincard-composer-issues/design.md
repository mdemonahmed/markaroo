## Context

The widget composer (`ComposerPanel`, "Write feedback") and pin card (`PinCard`) already wire a `MarkdownToolbar`, `MentionAutocomplete`, and `AttachmentPicker`, but three things are broken end to end and one is cosmetic.

Root causes found by tracing each flow:

1. **Markdown never rendered.** `PinCard` shows `item.comment` and replies via `<p>{ text }</p>` — raw text. The toolbar correctly inserts `**bold**`, but nothing ever renders it, so the reader sees literal markup (matches the screenshot). "Toolbar not working" is really "output never rendered."
2. **Toolbar icons inconsistent.** `MarkdownToolbar.ACTIONS` mixes `<strong>B</strong>`, `<em>I</em>`, `≡`, `1.`, `🔗`, `<code><></code>`.
3. **Mentions never resolve.** Frontend inserts `@${user.name} ` (display name, may contain spaces). Backend `FeedbackController` parses `/\B@([\w.\-]+)/u` — a space breaks `@John Doe` into `@John`, and `resolve_mention_ids` then fails to match. Also `markaroo/mention` fires only on **reply** create, not feedback create. And the autocomplete returns nothing until you type (`if ( ! query ) setUsers([])`).
4. **Attachment 500.** `AttachmentsController::create` calls `wp_generate_attachment_metadata()` (defined in `wp-admin/includes/image.php`), but `image.php`/`media.php` are only required inside `if ( ! function_exists( 'wp_insert_attachment' ) )` — and `wp_insert_attachment` is always loaded, so the guard never fires and the call fatals → generic 500.
5. **Undo icon** in `RegionAnnotator` uses a circular-arrow path the user finds unclear.

## Goals / Non-Goals

**Goals:**
- Rendered markdown (bold/italic/code/link/list) on comment + reply display, safely.
- Consistent SVG toolbar icons.
- `@` shows all users; selected mentions persist by user ID and fire `markaroo/mention` on both feedback and reply create.
- Attachment upload succeeds for allowed types.
- Clearer undo icon.

**Non-Goals:**
- Full CommonMark support, tables, images-in-markdown, or a WYSIWYG editor.
- Rich mention rendering as clickable user profile links (highlight span is enough).
- Rendering markdown in the admin dashboard (widget only for this change).
- Adding a markdown dependency (`marked`, `dompurify`) — a small hand-rolled renderer covers the toolbar's own syntax with zero supply-chain cost.

## Decisions

- **Tiny in-house markdown renderer** (`resources/assets/widget/support/renderMarkdown.tsx`) returning React nodes, not HTML strings. Handles the exact syntax the toolbar produces: `**b**`, `*i*`, `` `code` ``, `[t](url)`, and `-`/`1.` list lines; escapes everything else by construction (React text nodes are auto-escaped); link `href` allowlisted to `http/https/mailto`. No `dangerouslySetInnerHTML`. Used in `PinCard` root entry and `ReplyRow`/reply display. ~40 lines, self-checked. `ponytail:` line-based list parse, upgrade to a real parser only if nested/complex markdown is needed.
- **Toolbar icons → SVG.** Swap the `icon` field of each `ACTIONS` entry for a small inline `<svg>`. Behavior untouched.
- **Mention capture by ID, not name-matching.** In `ComposerPanel` and `ReplyComposer`, keep a `mentionIds: Set<number>` (or number[]); `insertMention` adds `user.id`. Still insert the friendly `@Name ` text for readability, but send `mention_ids` in the create payload. Backend reads `mention_ids` (sanitized `absint` array) and fires `markaroo/mention` directly — deterministic, space-proof. Keep the existing regex parse as a fallback for guests/manual typing.
- **Fire mention on feedback create.** Add the same `mention_ids`/parse + `do_action('markaroo/mention', …)` block to the feedback store path (currently only replies have it).
- **Autocomplete show-all.** In `MentionAutocomplete`, on empty query show the first N users from the shared `fetchUsers()` list instead of returning `[]`. Popup only opens while `mentionQuery !== null` (already gated by the `@` match), so it won't appear unprompted.
- **Attachment fix.** Require `wp-admin/includes/image.php` and `media.php` unconditionally (guard on `wp_generate_attachment_metadata` existence) before use. One-line-scope root fix; every upload path routes through this one method.
- **Undo icon.** Replace the SVG path in the undo button with a cleaner counter-clockwise undo arrow.

## Risks / Trade-offs

- **Hand-rolled markdown** won't cover edge cases (nested emphasis, escaped asterisks). Acceptable: it only needs to render what the toolbar emits; unknown syntax degrades to visible text, never to injection.
- **Mention IDs captured at compose time** won't re-resolve if the user later hand-edits the `@Name` text. Fallback regex parse covers typed mentions; good enough for v1.
- **`mention_ids` is a new optional param** — backward compatible; old clients omit it and fall back to regex parsing.
- Attachment metadata generation adds image-size work on upload (unchanged intent); negligible.
