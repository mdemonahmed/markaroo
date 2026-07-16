# Figma-Style Widget UX

## Why

The frontend feedback widget works but the flow has friction: pinning takes two clicks (launcher → New), the pin card can't be dismissed by clicking outside, timestamps are raw datetimes, the title/attachment fields always show even when empty, and pins give no preview on hover. The user wants the whole commenting experience to feel like Figma's comment system — one-click pinning, hover previews, avatar-led threads, relative times, and a cleaner panel.

## What Changes

- **Launcher one-click pinning**: clicking `markaroo-launcher` enables the session, opens the panel, AND immediately enters pin-placement mode — no separate "New" click. User can scroll the page while placing.
- **Capture toolbar simplification**: `markaroo-capture-switch` drops the non-working "Pin" option; "Area" is renamed "Select"; "Cancel" stays. Single-click pin placement becomes the default background behavior (click anywhere = pin), "Select" switches to region capture.
- **Pin card dismissal**: clicking outside `markaroo-pincard` (or pressing Esc) closes it. Clicking a pin still opens it.
- **Pin hover preview**: hovering a `markaroo-pin` shows a compact tooltip — avatar, author, relative time, title/comment snippet. Click opens the full card as today.
- **Pin card redesign (Figma-style)**: avatar-led comment thread; title input shown only during creation, afterwards hidden behind an Edit action (⋯ menu); attachments section hidden when empty; replies rendered as a Figma-like thread with avatar + name + relative time + hover ⋯ menu; reply composer as a rounded pill with submit arrow; header with resolve check, ⋯ menu, and close.
- **Relative timestamps**: all widget times render as "10 minutes ago" / "2 hours ago" style, with absolute datetime in a `title` tooltip. Shared helper lifted from the dashboard's `timeAgo()`.
- **Avatars**: server exposes the current user's and authors' avatar URLs (WP `get_avatar_url`, works for gravatar); widget falls back to initials for guests.
- **Panel redesign**: `markaroo-panel` list restyled as Figma-like comment cards — avatar, `#id · page`, author + relative time, bold title, reply count, resolved styling; resolve check accessible from the row.

## Capabilities

### New Capabilities
- `widget-instant-pinning`: launcher click starts a pinning session immediately; capture toolbar offers Select/Cancel with click-to-pin default.
- `pin-hover-preview`: hover tooltip on pin markers with author, avatar, relative time, and snippet.
- `pincard-thread-ux`: Figma-style pin card — outside-click/Esc close, avatar thread, conditional title input, hidden-when-empty attachments, redesigned reply composer.
- `widget-relative-time`: shared relative-time rendering across widget surfaces.
- `widget-avatars`: avatar URLs exposed via config/API and rendered in card, hover preview, and panel.
- `panel-comment-list`: redesigned feedback panel list with comment-card rows and inline resolve.

### Modified Capabilities
<!-- none — existing specs (pin-clustering, offline-submit-queue, widget-keyboard-shortcuts, etc.) keep their requirements; this change must not regress them -->

## Impact

- **React widget**: `Launcher.tsx`, `WidgetContext.tsx` (reducer actions), `CaptureOverlay.tsx`, `ClickCapture.tsx`, `PinMarker.tsx`, `PinLayer.tsx`, `PinCard.tsx`, `ReplyComposer.tsx`, `AttachmentList.tsx`, `FeedbackPanel.tsx`, new shared `timeAgo` util, `types.ts`, `api.ts`.
- **CSS**: `resources/assets/css/widget.css` — pincard, panel, tooltip, capture-switch blocks.
- **PHP**: `plugin/Support/Config.php` (currentUser avatar), users/feedback REST payloads (author avatar URL) — additive, non-breaking.
- **Constraints**: keep bundle small (no new deps), CSS prefixed `markaroo-`, strings translatable, existing behaviors (drag pins, clustering, offline queue, share modes) unchanged.
