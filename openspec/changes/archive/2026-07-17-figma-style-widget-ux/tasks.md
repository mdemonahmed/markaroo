## 1. Foundations (time + avatars)

- [x] 1.1 Create `resources/assets/widget/support/timeAgo.ts` (translatable "just now" / "%d minutes ago" / hours / days, >7 days → localized date; export absolute-string helper for `title` attrs) with a Jest test
- [x] 1.2 PHP: add `avatar` to `currentUser` in `plugin/Support/Config.php::payload()` via `get_avatar_url()`; empty string when no user
- [x] 1.3 PHP: add `avatar` (from `author_id`) to feedback and reply REST payloads (`format_item` in the feedback/replies controllers); populate `avatar` in the users endpoint response
- [x] 1.4 Widget types: add `avatar?: string` to `FeedbackItem`, `ReplyItem`, `currentUser` in `types.ts`
- [x] 1.5 Create `Avatar` component (img → initials-chip fallback on error/empty, sizes 24/32px) in `resources/assets/widget/support/Avatar.tsx`; move `initials()` out of PinCard

## 2. Instant pinning + capture toolbar

- [x] 2.1 `Launcher.tsx`: on first click dispatch `ENABLE_SESSION` then `START_CAPTURE` when user can comment; view-only users keep panel-only behavior; verify scrolling works while placing
- [x] 2.2 `CaptureOverlay.tsx`: default tool `'click'` (ClickCapture as background), toolbar reduced to "Select" toggle (region) + "Cancel"; remove Pin button; update strings + aria labels
- [x] 2.3 Update `markaroo-capture-switch` CSS for the two-button toolbar; confirm Cancel reopens the panel
- [x] 2.4 Update/extend widget Jest tests for launcher flow and toolbar

## 3. Pin card — behavior

- [x] 3.1 `PinCard.tsx`: outside `pointerdown` (capture, excluding `.markaroo-pin`/cluster markers) + Escape close the card; clicking another pin switches cards
- [x] 3.2 Title: static bold text in card (hidden when empty); remove always-on title input; Edit action in root-entry ⋯ menu toggles title+comment edit with Save/Cancel (existing permissions)
- [x] 3.3 Render attachments section only when `attachments.length > 0`; assign/priority sections only when permitted/populated
- [x] 3.4 Replace all card timestamps with `timeAgo()` + absolute `title` attr

## 4. Pin card — Figma layout

- [x] 4.1 Restructure card: header (Comment label, resolve check, ⋯ menu, close), avatar-led thread entries (root + replies, uniform layout: Avatar, name, relative time, text)
- [x] 4.2 Per-entry ⋯ menu (Edit/Delete per permissions) revealed on hover/focus-within, always tappable (44px hit area)
- [x] 4.3 `ReplyComposer.tsx`: rounded pill with current-user Avatar, auto-grow textarea, arrow submit button; Enter submits, Shift+Enter newline; keep @mention autocomplete
- [x] 4.4 Rewrite pincard CSS block with D8 tokens (surface #1E1E20, radius 13px, shadow, motion 150–200ms transform/opacity, `prefers-reduced-motion` guard)

## 5. Pin hover preview

- [x] 5.1 `PinMarker.tsx`: hover/focus tooltip (~150ms delay) with Avatar, name, relative time, title/snippet; suppressed while dragging or when card open
- [x] 5.2 Tooltip CSS (`markaroo-pin-preview`): dark surface tokens, fade/scale enter, positioned to stay in viewport

## 6. Panel redesign

- [x] 6.1 `FeedbackPanel.tsx` rows → comment cards: Avatar, `#id · page` meta, name + relative time, bold title/snippet, reply count if present in payload (omit otherwise — check `FeedbackItem`)
- [x] 6.2 Inline resolve check on rows (stopPropagation, `canResolve`/`canManage` gated, reuses existing resolve API path); resolved cards green-tinted
- [x] 6.3 Panel CSS restyle with D8 tokens (header, tabs, cards, footer)

## 7. Finish

- [x] 7.1 `yarn build` clean; no console errors on front-end smoke test (launcher → pin → card → reply → resolve → panel)
- [x] 7.2 ESLint + phpcs pass on touched files; regenerate `languages/markaroo.pot`
- [x] 7.3 Regression check: pin drag, clustering, offline queue, share/view/clean modes, keyboard shortcuts unaffected
