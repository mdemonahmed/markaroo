import type { CaptureData, CaptureRect, ElementOffset, ScreenshotRect } from '../types';

export function getViewport(): string {
	return `${ window.innerWidth }x${ window.innerHeight }`;
}

/**
 * Convert viewport-relative px to page-relative percentage.
 * Accounts for scroll position so pin survives layout reflows.
 */
export function toPagePct( clientX: number, clientY: number ): { xPct: number; yPct: number } {
	const totalW = document.documentElement.scrollWidth;
	const totalH = document.documentElement.scrollHeight;
	const pageX = clientX + window.scrollX;
	const pageY = clientY + window.scrollY;
	return {
		xPct: clampPct( pageX / totalW ),
		yPct: clampPct( pageY / totalH ),
	};
}

/**
 * Offset of a point within an element (as percentage of element dimensions).
 */
export function toElementOffset( clientX: number, clientY: number, el: Element ): ElementOffset {
	const r = el.getBoundingClientRect();
	return {
		xPct: clampPct( ( clientX - r.left ) / r.width ),
		yPct: clampPct( ( clientY - r.top ) / r.height ),
	};
}

/**
 * Convert a viewport-px rect to page-percentage rect.
 */
export function toCaptureRect(
	left: number,
	top: number,
	width: number,
	height: number
): CaptureRect {
	const totalW = document.documentElement.scrollWidth;
	const totalH = document.documentElement.scrollHeight;
	const pageLeft = left + window.scrollX;
	const pageTop = top + window.scrollY;
	return {
		xPct: clampPct( pageLeft / totalW ),
		yPct: clampPct( pageTop / totalH ),
		wPct: clampPct( width / totalW ),
		hPct: clampPct( height / totalH ),
	};
}

/**
 * Return the topmost non-Markaroo element at a viewport point.
 * Temporarily strips pointer-events from all #markaroo-root children
 * so elementsFromPoint sees through the overlay.
 */
export function getPageElementAt( clientX: number, clientY: number ): Element | null {
	const candidates = document.elementsFromPoint( clientX, clientY );
	return (
		candidates.find(
			( el ) =>
				! el.closest( '#markaroo-root' ) &&
				el !== document.documentElement &&
				el !== document.body
		) ?? null
	);
}

/**
 * Build a reasonably robust CSS selector path for an element (max 5 hops).
 * Returns null if the element is part of Markaroo UI.
 */
export function getElementSelector( el: Element | null ): string | null {
	if ( ! el || el.closest( '#markaroo-root' ) ) {
		return null;
	}

	const parts: string[] = [];
	let current: Element | null = el;

	while ( current && current !== document.body && parts.length < 5 ) {
		if ( current.id ) {
			parts.unshift( `#${ CSS.escape( current.id ) }` );
			break;
		}

		let part = current.tagName.toLowerCase();
		const parent = current.parentElement;

		if ( parent ) {
			const siblings = Array.from( parent.children ).filter(
				( c ) => c.tagName === current!.tagName
			);
			if ( siblings.length > 1 ) {
				part += `:nth-of-type(${ siblings.indexOf( current ) + 1 })`;
			}
		}

		parts.unshift( part );
		current = current.parentElement;
	}

	return parts.length > 0 ? parts.join( ' > ' ) : null;
}

/** Build CaptureData for a click-to-pin interaction. */
export function buildClickCaptureData(
	clientX: number,
	clientY: number
): CaptureData {
	const { xPct, yPct } = toPagePct( clientX, clientY );
	const el = getPageElementAt( clientX, clientY );
	const selector = getElementSelector( el );
	const elementOffset = el ? toElementOffset( clientX, clientY, el ) : null;

	const screenshotRect: ScreenshotRect = {
		type: 'point',
		selector,
		elementOffset,
		rect: null,
		annotations: [],
	};

	return { x: xPct, y: yPct, viewport: getViewport(), screenshotRect };
}

/** Build CaptureData for a drag-to-region interaction. */
export function buildRegionCaptureData(
	left: number,
	top: number,
	width: number,
	height: number
): CaptureData {
	const rect = toCaptureRect( left, top, width, height );
	const centerX = left + width / 2;
	const centerY = top + height / 2;
	const { xPct, yPct } = toPagePct( centerX, centerY );

	const screenshotRect: ScreenshotRect = {
		type: 'region',
		selector: null,
		elementOffset: null,
		rect,
		annotations: [],
	};

	return { x: xPct, y: yPct, viewport: getViewport(), screenshotRect };
}

function clampPct( v: number ): number {
	return Math.round( Math.min( 1, Math.max( 0, v ) ) * 10000 ) / 10000;
}
