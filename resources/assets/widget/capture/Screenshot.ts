/**
 * Screenshot capture service.
 *
 * html2canvas is lazy-loaded on first capture and cached.
 * Failure is always non-fatal — feedback submission succeeds regardless.
 */

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record<string, unknown>
) => Promise<HTMLCanvasElement>;

/** Module-level cache — loaded once per page session. */
let h2cFn: Html2CanvasFn | null = null;

async function loadHtml2Canvas(): Promise<Html2CanvasFn> {
  if (!h2cFn) {
    const mod = await import('html2canvas');
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

function resolveOptions(overrides?: Partial<ScreenshotOptions>): ScreenshotOptions {
  // JS reads from markarooConfig.screenshotOptions (injected by PHP via markaroo/screenshot/options filter).
  const cfg = (window.markarooConfig as Record<string, unknown>)?.screenshotOptions as
    | Partial<ScreenshotOptions>
    | undefined;

  return {
    format: 'jpeg',
    quality: 0.8,
    maskInputs: true,
    scale: window.devicePixelRatio ?? 1,
    ...cfg,
    ...overrides,
  };
}

function isEnabled(): boolean {
  const cfg = (window.markarooConfig as Record<string, unknown>)?.screenshotOptions as
    | Record<string, unknown>
    | undefined;
  return cfg?.enabled !== false;
}

/**
 * Mask sensitive elements inside the cloned document.
 * Never touches the live DOM.
 * @param doc
 */
function maskClone(doc: Document): void {
  doc.querySelectorAll<HTMLElement>('input, textarea, [data-markaroo-mask]').forEach((el) => {
    el.style.color = 'transparent';
    el.style.textShadow = 'none';
    el.style.backgroundColor = '#e2e8f0';
    el.style.backgroundImage = 'none';
    // Clear value so html2canvas doesn't render it.
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = '';
    }
  });
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
  overrides?: Partial<ScreenshotOptions>
): Promise<Blob | null> {
  if (!isEnabled()) {
    return null;
  }

  const opts = resolveOptions(overrides);
  const h2c = await loadHtml2Canvas();

  const root = document.getElementById('markaroo-root');

  // Hide widget UI so it doesn't appear in the shot.
  if (root) {
    root.style.visibility = 'hidden';
  }

  let canvas: HTMLCanvasElement;

  try {
    canvas = await h2c(document.body, {
      useCORS: true,
      allowTaint: false,
      scale: opts.scale,
      onclone: (clonedDoc: Document) => {
        const clonedRoot = clonedDoc.getElementById('markaroo-root');
        if (clonedRoot) {
          clonedRoot.style.display = 'none';
        }
        if (opts.maskInputs) {
          maskClone(clonedDoc);
        }
      },
    });
  } finally {
    // Always restore UI even if html2canvas throws.
    if (root) {
      root.style.visibility = '';
    }
  }

  return new Promise<Blob | null>((resolve) => {
    const mime = opts.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = opts.format === 'jpeg' ? opts.quality : undefined;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          window.dispatchEvent(
            new CustomEvent('markaroo:screenshot-ready', {
              detail: { blob, options: opts },
            })
          );
        }
        resolve(blob);
      },
      mime,
      quality
    );
  });
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
): Promise<{ screenshot_id: number; screenshot_url: string } | null> {
  const config = window.markarooConfig;
  if (!config) {
    return null;
  }

  const fmt = resolveOptions().format;
  const filename = `markaroo-${feedbackId}-${Date.now()}.${fmt}`;

  const formData = new FormData();
  formData.append('screenshot', blob, filename);

  const headers: Record<string, string> = { 'X-WP-Nonce': config.nonce };
  if (config.shareToken) {
    headers['X-Markaroo-Share'] = config.shareToken;
  }

  try {
    const res = await fetch(`${config.restUrl}markaroo/v1/feedback/${feedbackId}/screenshot`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { screenshot_id: number; screenshot_url: string };

    window.dispatchEvent(
      new CustomEvent('markaroo:screenshot-uploaded', {
        detail: { feedbackId, ...data },
      })
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
  captureOverrides?: Partial<ScreenshotOptions>
): Promise<{ screenshot_id: number; screenshot_url: string } | null> {
  try {
    const blob = await captureScreenshot(captureOverrides);
    if (!blob) {
      return null;
    }
    return await uploadScreenshot(feedbackId, blob);
  } catch {
    // Screenshot failure must never block the feedback submission.
    return null;
  }
}
