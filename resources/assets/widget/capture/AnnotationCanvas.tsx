import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
import {
  renderAnnotationItem,
  renderAnnotations,
  canvasPct,
  burnAnnotationsIntoBlob,
} from './annotationUtils';
import type { Annotation } from '../types';

type Tool = 'arrow' | 'rect' | 'circle';

const COLORS = [
  { value: '#ef4444', label: 'Red' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Yellow' },
  { value: '#1a1a2e', label: 'Black' },
];
const DEFAULT_COLOR = '#ef4444';
const STROKE_WIDTH = 3;

interface AnnotationCanvasProps {
  screenshotBlob: Blob | null;
  onDone: (annotations: Annotation[], burnedBlob: Blob | null) => void;
  onCancel: () => void;
}

export function AnnotationCanvas({ screenshotBlob, onDone, onCancel }: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef<boolean>(false);
  const currentRef = useRef<Annotation | null>(null);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [tool, setTool] = useState<Tool>('arrow');
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Mirror state into refs so the canvas pointer handlers always have fresh values.
  const annotationsRef = useRef(annotations);
  annotationsRef.current = annotations;
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const colorRef = useRef(color);
  colorRef.current = color;

  // -----------------------------------------------------------------------
  // Canvas drawing
  // -----------------------------------------------------------------------
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0);
    }

    renderAnnotations(ctx, annotationsRef.current, canvas.width, canvas.height);

    if (currentRef.current) {
      renderAnnotationItem(ctx, currentRef.current, canvas.width, canvas.height);
    }
  }, []);

  // Load background image when blob changes.
  useEffect(() => {
    if (!screenshotBlob) {
      // No screenshot — set canvas to viewport size.
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setBgLoaded(true);
      }
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(screenshotBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      bgImageRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      setBgLoaded(true);
      redraw();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setBgLoaded(true);
    };

    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [screenshotBlob, redraw]);

  // Redraw when annotations change.
  useEffect(() => {
    if (bgLoaded) {
      redraw();
    }
  }, [annotations, bgLoaded, redraw]);

  // -----------------------------------------------------------------------
  // Pointer handlers (pointer events = works on touch + mouse)
  // -----------------------------------------------------------------------
  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const { xPct, yPct } = canvasPct(e.clientX, e.clientY, canvasRef.current);
    currentRef.current = {
      tool: toolRef.current,
      from: { xPct, yPct },
      to: { xPct, yPct },
      color: colorRef.current,
      width: STROKE_WIDTH,
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || !canvasRef.current || !currentRef.current) {
      return;
    }
    const { xPct, yPct } = canvasPct(e.clientX, e.clientY, canvasRef.current);
    currentRef.current = { ...currentRef.current, to: { xPct, yPct } };
    redraw();
  }

  function handlePointerUp() {
    if (!drawingRef.current || !currentRef.current) {
      return;
    }
    drawingRef.current = false;

    const ann = currentRef.current;
    currentRef.current = null;

    // Ignore tiny accidental clicks.
    const dx = Math.abs(ann.to.xPct - ann.from.xPct);
    const dy = Math.abs(ann.to.yPct - ann.from.yPct);
    if (dx > 0.005 || dy > 0.005) {
      setAnnotations((prev) => {
        const next = [...prev, ann];
        window.dispatchEvent(
          new CustomEvent('markaroo:annotation-changed', { detail: { annotations: next } })
        );
        return next;
      });
    } else {
      redraw();
    }
  }

  // -----------------------------------------------------------------------
  // Toolbar actions
  // -----------------------------------------------------------------------
  function undo() {
    setAnnotations((prev) => prev.slice(0, -1));
  }

  function clear() {
    setAnnotations([]);
  }

  async function handleDone() {
    const anns = annotationsRef.current;

    // Build format/quality from config for burn-in.
    const opts = (window.markarooConfig as Record<string, unknown>)?.screenshotOptions as
      | { format?: 'jpeg' | 'png'; quality?: number }
      | undefined;

    const burned = screenshotBlob
      ? await burnAnnotationsIntoBlob(
          screenshotBlob,
          anns,
          opts?.format ?? 'jpeg',
          opts?.quality ?? 0.8
        )
      : null;

    onDone(anns, burned);
  }

  // -----------------------------------------------------------------------
  // Available tools from config filter seam (PHP injects annotationTools).
  // -----------------------------------------------------------------------
  const availableTools = (
    ((window.markarooConfig as Record<string, unknown>)?.annotationTools as Tool[]) ?? [
      'arrow',
      'rect',
      'circle',
    ]
  ).filter((t): t is Tool => ['arrow', 'rect', 'circle'].includes(t));

  const toolIcons: Record<Tool, React.ReactNode> = {
    arrow: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    rect: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="1" />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  };

  return (
    <div className="markaroo-annotation-wrap">
      {!bgLoaded && (
        <div className="markaroo-annotation-loading" aria-live="polite">
          Capturing screenshot…
        </div>
      )}

      <div
        className={`markaroo-annotation-stage${
          bgLoaded ? ' markaroo-annotation-stage--ready' : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          className="markaroo-annotation-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ cursor: 'crosshair' }}
        />
      </div>

      <div className="markaroo-annotation-toolbar" role="toolbar" aria-label="Annotation tools">
        {/* Tool picker */}
        <div className="markaroo-annotation-tools">
          {availableTools.map((t) => (
            <button
              key={t}
              className={`markaroo-annotation-tool${
                tool === t ? ' markaroo-annotation-tool--active' : ''
              }`}
              onClick={() => setTool(t)}
              aria-pressed={tool === t}
              aria-label={t}
              type="button"
            >
              {toolIcons[t]}
            </button>
          ))}
        </div>

        <div className="markaroo-annotation-divider" role="separator" />

        {/* Color palette */}
        <div className="markaroo-annotation-colors" role="group" aria-label="Color">
          {COLORS.map((c) => (
            <button
              key={c.value}
              className={`markaroo-annotation-color${
                color === c.value ? ' markaroo-annotation-color--active' : ''
              }`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              aria-label={c.label}
              aria-pressed={color === c.value}
              type="button"
            />
          ))}
        </div>

        <div className="markaroo-annotation-divider" role="separator" />

        {/* Undo / Clear */}
        <button
          className="markaroo-annotation-action"
          onClick={undo}
          disabled={annotations.length === 0}
          aria-label="Undo"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 7v6h6" />
            <path d="M3 13a9 9 0 1 0 3.5-6.9L3 9" />
          </svg>
        </button>

        <button
          className="markaroo-annotation-action"
          onClick={clear}
          disabled={annotations.length === 0}
          aria-label="Clear all"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
        </button>

        <div className="markaroo-annotation-divider" role="separator" />

        {/* Cancel / Done */}
        <button
          className="markaroo-annotation-action markaroo-annotation-action--cancel"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>

        <button
          className="markaroo-annotation-action markaroo-annotation-action--done"
          onClick={handleDone}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
