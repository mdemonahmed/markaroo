# 12 — Feedback pins rendering & repositioning

**Depends on:** 04, 07
**Goal:** Show existing feedback as numbered pins on the page (to cut duplicates), color-coded by status, and let users drag a saved pin to reposition it.

## Scope (free)
- Render all feedback for the current `page_key` as pins anchored by the saved coordinate model (task 08).
- Numbered badges; color-coded by status (open vs resolved) and shown in the pins panel list.
- Click a pin → open its thread (task 13). Drag a saved pin → update position (PATCH).
- Pins panel: Unresolved / Resolved tabs, per-page grouping, counts (matches competitor UI).

## Steps
1. On load (comment/view mode), fetch `/feedback?page_key=...`. Render a pin per item at its re-anchored position (use element selector + offset first, fall back to page %).
2. **Numbering:** stable order (e.g. by `created_at`); show the number in the badge and in the panel list.
3. **Color coding:** open vs resolved get distinct pin colors; also reflect priority via a dot/badge in the list (urgent/high/normal/low colors from task 14).
4. **Open thread:** clicking a pin or a list row opens the detail popover (composer-style) showing comment, screenshot thumb, metadata, replies (task 13), and actions (resolve, assign, edit, delete) gated by capabilities.
5. **Reposition:** in manage/author context, dragging a saved pin updates `x`/`y` (+ selector/offset) and PATCHes `/feedback/{id}`. Guests cannot reposition others' pins.
6. **Resolve/unresolve:** toggle status (POST resolve/unresolve), update pin color and move it between tabs live.
7. **Existing feedback shown during capture:** while placing a new pin, keep existing pins visible (dimmed) so users notice duplicates.

## Hooks
- JS events `markaroo:pin-opened`, `markaroo:pin-moved`, `markaroo:pin-resolved`.
- `apply_filters('markaroo/pin/color', $color, $feedback)` — pro theming/branding.

## Acceptance
- All current-page feedback renders as correctly positioned, numbered pins.
- Open and resolved pins are visually distinct and split across the panel tabs with correct counts.
- Dragging a saved pin persists the new position after reload.
- Resolving updates color and tab instantly and persists.
- Existing pins stay visible during new capture to discourage duplicates.
