# 08 — Capture: click-to-pin & drag-to-select

**Depends on:** 07
**Goal:** Let users place a feedback pin by clicking any element, or drag a rectangle to select a region before capturing. Selection is draggable and resizable with corner handles.

## Scope (free)
- Click-to-comment: click anywhere → place a pin at that point.
- Drag-to-select: drag a region → resizable/draggable selection box with corner handles.
- Capture coordinates that survive layout changes and different viewports.

## Steps
1. **Enter capture mode** from the launcher. Show the soft drag-to-select notice; auto-hide the pins panel.
2. **Click-to-pin:** on click, capture:
   - target element selector path (a robust CSS selector or element fingerprint),
   - click point as a percentage offset within that element AND a page-level `x`/`y` percentage fallback,
   - current `viewport` (`{innerWidth}x{innerHeight}`).
   Store `x`,`y` as page-relative percentages (so pins re-anchor across viewports), keep the element selector + intra-element offset in `screenshot_rect` JSON for precision.
3. **Drag-to-select:** mousedown+drag draws a rectangle. On release, show a selection box with 8 resize handles + draggable body. Persist the rect (top/left/width/height in px and as % of page) into `screenshot_rect`.
4. **Handles:** corner + edge handles resize; dragging the body moves it; constrain within the document. Support touch (pointer events) for mobile.
5. After a pin/region is set, open the comment composer (task 11) and trigger screenshot capture (task 09) and annotation (task 10).
6. **Reposition existing pins** is handled in task 12, but reuse the same coordinate model here.

## Data written to `screenshot_rect` (JSON)
```json
{
  "type": "point" | "region",
  "selector": "css-path or null",
  "elementOffset": { "xPct": 0.42, "yPct": 0.18 },
  "rect": { "xPct": 0.1, "yPct": 0.2, "wPct": 0.3, "hPct": 0.15 },
  "annotations": []   // filled by task 10
}
```

## Hooks
- JS events: `markaroo:capture-start`, `markaroo:pin-placed`, `markaroo:region-selected`.

## Acceptance
- Clicking places a pin at the correct spot; reloading at the same viewport re-anchors it within a few px.
- Dragging creates a region; handles resize and the box drags, constrained to the page.
- Resizing at a different viewport width still maps the region to the right area (percentage-based).
- Touch works on a phone-sized viewport.
