# 10 — Annotation tools

**Depends on:** 09
**Goal:** Draw arrows, rectangles, and circles over the captured area before saving. Arrow is the default tool.

## Scope (free)
- Tools: arrow (default), rectangle, circle.
- Draw on an overlay; annotations stored as vector data in `screenshot_rect.annotations` and burned into the saved screenshot image.
- Undo/clear; pick color (small palette) and stroke width (optional, can default).

## Steps
1. Overlay a canvas/SVG layer over the capture preview. Toolbar with the three tools; arrow pre-selected.
2. **Arrow:** click-drag from tail to head; render arrowhead at the end point.
3. **Rectangle / Circle:** click-drag to size.
4. Store each annotation as vector JSON in `screenshot_rect.annotations`:
   ```json
   { "tool":"arrow|rect|circle", "from":{"xPct":..,"yPct":..}, "to":{"xPct":..,"yPct":..}, "color":"#e11", "width":3 }
   ```
   Use percentages so annotations scale with the image.
5. **Burn-in:** when exporting the screenshot (task 09), draw the annotations onto the canvas before `toBlob`, so the saved image already shows them. Also keep the vector JSON for future re-editing.
6. Undo (pop last), clear all. Default color a high-contrast red (matches competitor arrows).
7. Keep the toolbar usable on touch.

## Hooks
- `apply_filters('markaroo/annotation/tools', $tools)` — pro can add tools (blur, text, highlight).
- JS event `markaroo:annotation-changed`.

## Acceptance
- Arrow tool active by default; all three tools draw correctly.
- Annotations appear in the saved screenshot image AND persist as vector JSON.
- Undo/clear work; annotations scale correctly when the screenshot is viewed at different sizes.
- Pro can register an extra tool via the filter without core edits.
