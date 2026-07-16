# Design — Figma-Style Widget UX

## Context

Current widget flow (scoped from source):

- `Launcher.tsx:20-31` — two-stage click: first `ENABLE_SESSION` (pins + panel), capture only via panel's `+ New` (`FeedbackPanel.tsx:79` → `START_CAPTURE`).
- `CaptureOverlay.tsx:33-71` — toolbar with `Area` (region), `Pin` (click), `Cancel`; local `tool` state defaults `'region'`.
- `PinCard.tsx` — anchored popover, closes only via X (`:310-325`); title `<input>` always rendered (`:421-434`); `AttachmentList` always rendered (`:492-495`); timestamps via `toLocaleString()` (`:25-28`); initials avatar (`:30-40`).
- `PinMarker.tsx` — no hover preview at all.
- `FeedbackPanel.tsx:12-43` — rows are number badge + dot + truncated text; no avatar, no time, no inline resolve.
- Relative-time helper exists only in dashboard: `apps/dashboard-markaroo/views/TaskListView.tsx:74-88`.
- No avatar data anywhere: `Config::payload()` (`plugin/Support/Config.php:22-30`) omits it; `ApiUser.avatar?` exists in `widget/api.ts:93-98` but is never populated server-side; feedback/reply REST payloads have `author`/`author_id` only.

Constraints: no new JS deps, CSS prefixed `markaroo-` under `#markaroo-root`, translatable strings, don't regress drag pins / clustering / offline queue / share modes / keyboard shortcuts.

## Goals / Non-Goals

**Goals:**
- One-click pinning from the launcher; scroll allowed while placing.
- Simpler capture toolbar: click-to-pin default + "Select" (region) + "Cancel".
- Figma-like pin card: outside-click/Esc close, avatar thread, hover ⋯ menus, conditional title/attachments, pill reply composer.
- Hover preview tooltip on pins.
- Relative timestamps everywhere in the widget.
- Real avatars (WP `get_avatar_url`) with initials fallback.
- Panel rows as comment cards with inline resolve.

**Non-Goals:**
- Reply attachments, reactions/emoji, mention redesign, dashboard admin UI changes, mobile-specific layouts beyond what exists, pro features.

## Decisions

### D1. Launcher enters capture directly
`ENABLE_SESSION` reducer keeps its meaning; `Launcher.handleClick` dispatches `ENABLE_SESSION` then `START_CAPTURE` when the user can comment (`canCreate || shareRights.canComment`), so the reducer stays orthogonal and view-only users just get the panel. Alternative — a combined `ENABLE_AND_CAPTURE` action — rejected: two dispatches in one handler is smaller and reuses tested transitions. Note `START_CAPTURE` already closes the panel during capture (existing behavior `WidgetContext.tsx:36-44`); panel reopens on cancel/submit, satisfying "panel opens + user can pin" without overlap. Scrolling already works in capture mode (overlay is positioned, not scroll-locking) — verify, don't rebuild.

### D2. Capture toolbar: click-to-pin default, "Select" toggle
`CaptureOverlay` local `tool` default flips to `'click'` (ClickCapture = default background). Toolbar renders two buttons: **Select** (toggles `'region'` → RegionAnnotator) and **Cancel**. The `Pin` button is removed; labels: `__('Select', 'markaroo')`, `__('Cancel', 'markaroo')`. Alternative — keep three buttons renamed — rejected per user: "Pin no need."

### D3. Outside-click close via pointerdown listener
`PinCard` adds a document `pointerdown` listener (capture phase) that closes when the event target is outside the card ref AND outside `.markaroo-pin` / `.markaroo-cluster` markers (pin clicks must toggle/switch, not double-fire close+open). Esc handled in the same effect. Lightbox and confirm-delete render inside the card subtree so they're naturally exempt. Alternative — full-screen backdrop element — rejected: blocks page interaction and scroll, contrary to the lightweight overlay feel.

### D4. Hover preview as CSS-positioned React tooltip
`PinMarker` gets `onMouseEnter/Leave` (+ `onFocus/Blur` for keyboard) with a ~150ms open delay; renders a `markaroo-pin-preview` div (avatar, name, relative time, title or 60-char comment snippet) absolutely positioned relative to the marker wrapper. Suppressed while dragging (`isDragging`) or when `activePinId === item.id`. Pure CSS `:hover` rejected — needs avatar/time markup and i18n. Data comes from props already on the marker.

### D5. Shared `timeAgo` util
New `resources/assets/widget/support/timeAgo.ts` — copy of dashboard's `timeAgo()` (`TaskListView.tsx:74-88`) extended: full words via `_n()` ("%d minutes ago"), "just now" < 60s, > 7 days → `toLocaleDateString()`. Widget and (optionally, later) dashboard import it; dashboard refactor not required in this change. Absolute `toLocaleString()` goes into `title` attr. No live re-render ticker — timestamps refresh on data refetch; a 60s interval re-render rejected as unnecessary (ponytail).

### D6. Avatars server-side, additive
- `Config::payload()` adds `currentUser.avatar = get_avatar_url(get_current_user_id())` (empty string when logged out).
- Feedback/reply REST `format_item` adds `avatar` = `get_avatar_url((int) $row->author_id)` when `author_id > 0`, else `''`.
- Users endpoint populates existing `avatar` field the same way.
- Widget: new tiny `Avatar` component (img with `onError` → initials chip fallback, reusing existing `initials()` logic). Used in PinCard thread, hover preview, panel rows, reply composer.
Alternative — client-side gravatar hash — rejected: requires email exposure (privacy) and md5 dep; `get_avatar_url` respects WP avatar filters (local avatar plugins) for free.

### D7. Pin card layout (Figma-style)
Structure per reference images:

```
┌───────────────────────────────────────┐
│ Comment          [✓resolve] [⋯] [✕]  │  header, 40px
├───────────────────────────────────────┤
│ (avatar) Name   18 minutes ago   [⋯] │  root entry
│          <title bold, if any>         │
│          comment text                 │
│ (avatar) Name   9 minutes ago    [⋯] │  reply entries…
│          reply text                   │
│ [screenshot thumb, if any]            │
│ [attachments, only if non-empty]      │
├───────────────────────────────────────┤
│ (me avatar) ( Reply…          [↑] )  │  pill composer
└───────────────────────────────────────┘
```

- Title input only when `capturePhase === 'composing'` (composer). In PinCard, title renders as bold static text; ⋯ menu on the root entry offers **Edit** (title + comment become editable, Save/Cancel) and **Delete** (existing confirm), gated by existing `canEditComment`/`canDeleteItem`.
- Header ⋯ menu holds secondary actions (assign, priority, copy link later); resolve stays a header icon check per reference image #4/#5.
- Entry ⋯ menus: visible on row hover and on `:focus-within` (keyboard reachable; skill rule `hover-vs-tap`).
- Attachments/assign/priority sections render only when non-empty/permitted.
- Reply composer: rounded pill (`border-radius: 999px`), textarea auto-grow to 3 lines, arrow submit button (44px hit area), Enter submits / Shift+Enter newline — preserving mention autocomplete.

### D8. Visual tokens (widget-scoped CSS variables on `#markaroo-root`)
Dark surface matching Figma reference; independent of host theme:

| Token | Value | Use |
|---|---|---|
| `--markaroo-surface` | `#1E1E20` | card/panel background |
| `--markaroo-surface-2` | `#2C2C2E` | inputs, hover rows, pill |
| `--markaroo-text` | `#FFFFFF` | primary text |
| `--markaroo-text-dim` | `#9B9B9E` | names-secondary, times (≥4.5:1 on surface) |
| `--markaroo-border` | `rgba(255,255,255,.08)` | dividers |
| `--markaroo-accent` | `#6366F1` | focus rings, links, active states |
| `--markaroo-resolved` | `#22C55E` | resolve check, resolved card tint |
| `--markaroo-danger` | `#DC2626` | delete |
| `--markaroo-radius-card` | `13px` | card/panel corners |
| `--markaroo-shadow` | `0 8px 30px rgba(0,0,0,.35)` | card elevation |

Typography: inherit `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (no webfont — bundle-size rule); sizes 13px body / 12px meta / 13px semibold names. Spacing on a 4px scale (8/12/16). Avatars 24px circle (32px in composer pill). Motion: 150–200ms ease-out enters, ~120ms exits, `transform/opacity` only, `prefers-reduced-motion` disables tooltip/card scale-fade. Existing SVG icon style (stroke, currentColor) retained — no emoji icons.

### D9. Panel rows as comment cards
`FeedbackRow` re-rendered as a card: avatar, `#<id> · <page label>` meta line (page label = "Page" for now — single-page list), name + `timeAgo`, bold title or snippet, `<n> replies` when `reply_count` available. If reply counts aren't in the list payload, show it only when loaded — no new endpoint (check `FeedbackItem` for existing field; if absent, omit count rather than fetch-per-row). Inline resolve check on the row (`stopPropagation`), visible when `currentUser.canResolve`/`canManage`, reusing `PinLayer.handleResolve`-equivalent API call. Resolved cards get a green-tinted background per reference image #6.

## Risks / Trade-offs

- [Launcher jumps straight to capture may surprise users wanting only to browse pins] → Cancel returns to panel in one click; view-mode users unaffected.
- [Outside-click close can eat a click meant for page interaction] → use `pointerdown` capture but don't `preventDefault`; the page still receives the event.
- [Avatar URL additions touch REST payloads] → additive fields only; guests get `''`; `get_avatar_url` on 50-user list is cheap (no HTTP).
- [Hover ⋯ menus invisible on touch devices] → menus also open on tap of the entry's ⋯ button which is always rendered (just opacity-dimmed until hover/focus), 44px hit area.
- [Dark card on dark host sites] → card carries its own opaque surface + shadow; contrast is internal, host-independent.
- [Removing "Pin" toolbar option changes muscle memory] → click-to-pin default makes the old Pin behavior the zero-click path.

## Migration Plan

Pure frontend + additive PHP; no schema change, no migration. Rollback = revert commit. Rebuild bundles (`yarn build`), regenerate `.pot`.

## Open Questions

- None blocking. Reply-count-in-panel depends on whether the list payload already includes it; tasks include a check with omit-fallback.
