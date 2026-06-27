/**
 * Position floating panels (composer / pin card) next to an on-page anchor.
 *
 * Everything is in viewport (fixed) coordinates. We prefer the right side of the
 * anchor, flip to the left when there isn't room, and clamp to the viewport so the
 * panel is never cut off. Returns inline styles for a `position: fixed` element.
 */

export interface AnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PanelSize {
  width: number;
  height: number;
}

const GAP = 14;
const MARGIN = 12;

export function anchorStyle( anchor: AnchorRect, panel: PanelSize ): { left: number; top: number } {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  // Horizontal: prefer right of the anchor, else left, else clamp.
  let left = anchor.left + anchor.width + GAP;
  if ( left + panel.width + MARGIN > vw ) {
    const leftSide = anchor.left - panel.width - GAP;
    left = leftSide >= MARGIN ? leftSide : Math.max( MARGIN, vw - panel.width - MARGIN );
  }

  // Vertical: align near the anchor top, clamp into the viewport.
  let top = anchor.top;
  if ( top + panel.height + MARGIN > vh ) {
    top = Math.max( MARGIN, vh - panel.height - MARGIN );
  }
  if ( top < MARGIN ) {
    top = MARGIN;
  }

  return { left: Math.round( left ), top: Math.round( top ) };
}

/**
 * Convert a page-percentage rect to a viewport-px AnchorRect (accounts for scroll).
 * @param xPct
 * @param yPct
 * @param wPct
 * @param hPct
 */
export function pageRectToViewport(
  xPct: number,
  yPct: number,
  wPct: number,
  hPct: number
): AnchorRect {
  const totalW = document.documentElement.scrollWidth;
  const totalH = document.documentElement.scrollHeight;
  return {
    left: xPct * totalW - window.scrollX,
    top: yPct * totalH - window.scrollY,
    width: wPct * totalW,
    height: hPct * totalH,
  };
}
