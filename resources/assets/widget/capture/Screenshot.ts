/**
 * Screenshot capture service.
 *
 * html2canvas is lazy-loaded on first capture and cached.
 * Failure is always non-fatal — feedback submission succeeds regardless.
 */

import { burnAnnotationsIntoBlob } from './annotationUtils';
import type { Annotation, CaptureRect } from '../types';

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record< string, unknown >
) => Promise< HTMLCanvasElement >;

/** Module-level cache — loaded once per page session. */
let h2cFn: Html2CanvasFn | null = null;

async function loadHtml2Canvas(): Promise< Html2CanvasFn > {
  if ( ! h2cFn ) {
    // webpackChunkName gives the split chunk a readable filename
    // (public/js/html2canvas.js) instead of a numeric id like 354.js —
    // WordPress.org reviewers need to identify bundled third-party code.
    const mod = await import( /* webpackChunkName: "js/html2canvas" */ 'html2canvas' );
    h2cFn = mod.default as Html2CanvasFn;
  }
  return h2cFn;
}

export interface ScreenshotOptions {
  format: 'jpeg' | 'png';
  quality: number;
  maskInputs: boolean;
  scale?: number;
}

function resolveOptions( overrides?: Partial< ScreenshotOptions > ): ScreenshotOptions {
  // JS reads from markarooConfig.screenshotOptions (injected by PHP via markaroo/screenshot/options filter).
  const cfg = window.markarooConfig?.screenshotOptions as Partial< ScreenshotOptions > | undefined;

  return {
    format: 'jpeg',
    quality: 0.8,
    maskInputs: true,
    // Default to 1 (not devicePixelRatio): a 2-3x retina scale quadruples the
    // rasterized canvas and the upload payload. PHP can raise it via the
    // markaroo/screenshot/options filter.
    scale: 1,
    ...cfg,
    ...overrides,
  };
}

function isEnabled(): boolean {
  return window.markarooConfig?.screenshotOptions?.enabled !== false;
}

/**
 * Mask sensitive elements inside the cloned document.
 * Never touches the live DOM.
 * @param doc
 */
function maskClone( doc: Document ): void {
  doc
    .querySelectorAll< HTMLElement >( 'input, textarea, [data-markaroo-mask]' )
    .forEach( ( el ) => {
      el.style.color = 'transparent';
      el.style.textShadow = 'none';
      el.style.backgroundColor = '#e2e8f0';
      el.style.backgroundImage = 'none';
      // Clear value so html2canvas doesn't render it.
      if ( el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ) {
        el.value = '';
      }
    } );
}

/**
 * Capture the current viewport as a Blob.
 *
 * - Hides #markaroo-root via visibility (keeps layout intact) before capture.
 * - Uses html2canvas onclone to hide in the clone as well (belt-and-suspenders).
 * - Masks inputs in the clone when maskInputs = true.
 * - Returns null when screenshots are disabled or html2canvas fails.
 * @param overrides
 */
export async function captureScreenshot(
  overrides?: Partial< ScreenshotOptions >
): Promise< Blob | null > {
  if ( ! isEnabled() ) {
    return null;
  }

  const opts = resolveOptions( overrides );
  const h2c = await loadHtml2Canvas();

  const root = document.getElementById( 'markaroo-root' );

  // Hide widget UI so it doesn't appear in the shot.
  if ( root ) {
    root.style.visibility = 'hidden';
  }

  let canvas: HTMLCanvasElement;

  try {
    canvas = await h2c( document.body, {
      useCORS: true,
      allowTaint: false,
      scale: opts.scale,
      onclone: ( clonedDoc: Document ) => {
        const clonedRoot = clonedDoc.getElementById( 'markaroo-root' );
        if ( clonedRoot ) {
          clonedRoot.style.display = 'none';
        }
        if ( opts.maskInputs ) {
          maskClone( clonedDoc );
        }
      },
    } );
  } finally {
    // Always restore UI even if html2canvas throws.
    if ( root ) {
      root.style.visibility = '';
    }
  }

  return new Promise< Blob | null >( ( resolve ) => {
    const mime = opts.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = opts.format === 'jpeg' ? opts.quality : undefined;

    canvas.toBlob(
      ( blob ) => {
        if ( blob ) {
          window.dispatchEvent(
            new CustomEvent( 'markaroo:screenshot-ready', {
              detail: { blob, options: opts },
            } )
          );
        }
        resolve( blob );
      },
      mime,
      quality
    );
  } );
}

function blobToImage( blob: Blob ): Promise< HTMLImageElement > {
  return new Promise( ( resolve, reject ) => {
    const img = new Image();
    const url = URL.createObjectURL( blob );
    img.onload = () => {
      URL.revokeObjectURL( url );
      resolve( img );
    };
    img.onerror = () => {
      URL.revokeObjectURL( url );
      reject( new Error( 'image load failed' ) );
    };
    img.src = url;
  } );
}

/**
 * Capture the full page, burn in annotations, then crop to the selected region
 * and return a base64 data URL — this is the "Pinned content" image sent inside
 * the create request.
 *
 * `rect` is page-percentage (0–1). When null, the whole page is returned.
 * Annotations are page-percentage too, so they're burned onto the full screenshot
 * (page-pct === full-canvas-pct) before cropping. Always resolves; null on failure.
 *
 * @param rect        Crop region as page-percentages, or null for the full page.
 * @param annotations Annotations to burn in (page-percentage coords).
 */
export async function captureCroppedDataUrl(
  rect: CaptureRect | null,
  annotations: Annotation[] = []
): Promise< string | null > {
  try {
    const full = await captureScreenshot();
    if ( ! full ) {
      return null;
    }

    const opts = resolveOptions();
    const mime = opts.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = opts.format === 'jpeg' ? opts.quality : undefined;

    const burned =
      ( await burnAnnotationsIntoBlob( full, annotations, opts.format, opts.quality ) ) ?? full;
    const img = await blobToImage( burned );

    const nW = img.naturalWidth;
    const nH = img.naturalHeight;

    // Crop box in natural px. Clamp to image bounds; fall back to full image.
    let sx = 0;
    let sy = 0;
    let sw = nW;
    let sh = nH;

    if ( rect && rect.wPct > 0 && rect.hPct > 0 ) {
      sx = Math.max( 0, Math.round( rect.xPct * nW ) );
      sy = Math.max( 0, Math.round( rect.yPct * nH ) );
      sw = Math.min( nW - sx, Math.round( rect.wPct * nW ) );
      sh = Math.min( nH - sy, Math.round( rect.hPct * nH ) );
      if ( sw < 1 || sh < 1 ) {
        sx = 0;
        sy = 0;
        sw = nW;
        sh = nH;
      }
    }

    const canvas = document.createElement( 'canvas' );
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext( '2d' );
    if ( ! ctx ) {
      return null;
    }
    ctx.drawImage( img, sx, sy, sw, sh, 0, 0, sw, sh );

    return canvas.toDataURL( mime, quality );
  } catch {
    // Screenshot failure must never block the feedback submission.
    return null;
  }
}

/**
 * Upload a screenshot blob to the REST API.
 * Returns upload metadata on success, null on failure (non-fatal).
 * @param feedbackId
 * @param blob
 */
export async function uploadScreenshot(
  feedbackId: number,
  blob: Blob
): Promise< { screenshot_id: number; screenshot_url: string } | null > {
  const config = window.markarooConfig;
  if ( ! config ) {
    return null;
  }

  const fmt = resolveOptions().format;
  const filename = `markaroo-${ feedbackId }-${ Date.now() }.${ fmt }`;

  const formData = new FormData();
  formData.append( 'screenshot', blob, filename );

  const headers: Record< string, string > = { 'X-WP-Nonce': config.nonce };
  if ( config.shareToken ) {
    headers[ 'X-Markaroo-Share' ] = config.shareToken;
  }

  try {
    const res = await fetch( `${ config.restUrl }markaroo/v1/feedback/${ feedbackId }/screenshot`, {
      method: 'POST',
      headers,
      body: formData,
    } );

    if ( ! res.ok ) {
      return null;
    }

    const data = ( await res.json() ) as { screenshot_id: number; screenshot_url: string };

    window.dispatchEvent(
      new CustomEvent( 'markaroo:screenshot-uploaded', {
        detail: { feedbackId, ...data },
      } )
    );

    return data;
  } catch {
    return null;
  }
}

/**
 * Capture then upload in one call. Always resolves — never rejects.
 * Call this after feedback has been created (you need the feedbackId).
 * @param feedbackId
 * @param captureOverrides
 */
export async function captureAndUpload(
  feedbackId: number,
  captureOverrides?: Partial< ScreenshotOptions >
): Promise< { screenshot_id: number; screenshot_url: string } | null > {
  try {
    const blob = await captureScreenshot( captureOverrides );
    if ( ! blob ) {
      return null;
    }
    return await uploadScreenshot( feedbackId, blob );
  } catch {
    // Screenshot failure must never block the feedback submission.
    return null;
  }
}
