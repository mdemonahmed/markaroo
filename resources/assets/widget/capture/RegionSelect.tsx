import { useState, useCallback, useRef } from '@wordpress/element';
import { buildRegionCaptureData } from './captureUtils';
import type { CaptureData } from '../types';

interface DrawRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

type Handle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

type Phase =
  | { name: 'idle' }
  | { name: 'drawing'; x0: number; y0: number; x1: number; y1: number }
  | { name: 'drawn'; rect: DrawRect }
  | { name: 'moving'; rect: DrawRect; startX: number; startY: number; origRect: DrawRect }
  | {
      name: 'resizing';
      rect: DrawRect;
      handle: Handle;
      startX: number;
      startY: number;
      origRect: DrawRect;
    };

const HANDLES: Handle[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const MIN_SIZE = 20;

function normalizeRect(x0: number, y0: number, x1: number, y1: number): DrawRect {
  return {
    left: Math.min(x0, x1),
    top: Math.min(y0, y1),
    width: Math.abs(x1 - x0),
    height: Math.abs(y1 - y0),
  };
}

function clampRect(r: DrawRect): DrawRect {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const left = Math.max(0, Math.min(r.left, vw - MIN_SIZE));
  const top = Math.max(0, Math.min(r.top, vh - MIN_SIZE));
  const width = Math.min(r.width, vw - left);
  const height = Math.min(r.height, vh - top);
  return { left, top, width: Math.max(MIN_SIZE, width), height: Math.max(MIN_SIZE, height) };
}

function applyHandleResize(orig: DrawRect, handle: Handle, dx: number, dy: number): DrawRect {
  let { left, top, width, height } = orig;

  if (handle.includes('n')) {
    top += dy;
    height -= dy;
  }
  if (handle.includes('s')) {
    height += dy;
  }
  if (handle.includes('w')) {
    left += dx;
    width -= dx;
  }
  if (handle.includes('e')) {
    width += dx;
  }

  return clampRect({ left, top, width, height });
}

interface RegionSelectProps {
  onCapture: (data: CaptureData) => void;
}

export function RegionSelect({ onCapture }: RegionSelectProps) {
  const [phase, setPhase] = useState<Phase>({ name: 'idle' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Pointer down on overlay (start drawing) or on region body (start moving).
  const handleOverlayPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (
      (e.target as Element).closest(
        '.markaroo-capture-toolbar,.markaroo-region-handle,.markaroo-region-confirm'
      )
    ) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase({ name: 'drawing', x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPhase((prev) => {
      if (prev.name === 'drawing') {
        return { ...prev, x1: e.clientX, y1: e.clientY };
      }
      if (prev.name === 'moving') {
        const dx = e.clientX - prev.startX;
        const dy = e.clientY - prev.startY;
        return {
          ...prev,
          rect: clampRect({
            left: prev.origRect.left + dx,
            top: prev.origRect.top + dy,
            width: prev.origRect.width,
            height: prev.origRect.height,
          }),
        };
      }
      if (prev.name === 'resizing') {
        const dx = e.clientX - prev.startX;
        const dy = e.clientY - prev.startY;
        return {
          ...prev,
          rect: applyHandleResize(prev.origRect, prev.handle, dx, dy),
        };
      }
      return prev;
    });
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPhase((prev) => {
      if (prev.name === 'drawing') {
        const rect = normalizeRect(prev.x0, prev.y0, prev.x1, prev.y1);
        if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
          return { name: 'idle' };
        }
        return { name: 'drawn', rect };
      }
      if (prev.name === 'moving' || prev.name === 'resizing') {
        return { name: 'drawn', rect: prev.rect };
      }
      return prev;
    });
  }, []);

  function startMove(e: React.PointerEvent<HTMLDivElement>, rect: DrawRect) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase({ name: 'moving', rect, startX: e.clientX, startY: e.clientY, origRect: rect });
  }

  function startResize(e: React.PointerEvent<HTMLDivElement>, handle: Handle, rect: DrawRect) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase({
      name: 'resizing',
      rect,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origRect: rect,
    });
  }

  function confirmRegion(rect: DrawRect) {
    const data = buildRegionCaptureData(rect.left, rect.top, rect.width, rect.height);
    window.dispatchEvent(
      new CustomEvent('markaroo:region-selected', { detail: { captureData: data } })
    );
    onCapture(data);
  }

  const currentRect =
    phase.name === 'drawing'
      ? normalizeRect(phase.x0, phase.y0, phase.x1, phase.y1)
      : phase.name === 'drawn' || phase.name === 'moving' || phase.name === 'resizing'
      ? phase.rect
      : null;

  return (
    <div
      ref={containerRef}
      className="markaroo-capture-overlay markaroo-capture-overlay--region"
      onPointerDown={handleOverlayPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="presentation"
    >
      {currentRect && currentRect.width >= MIN_SIZE && currentRect.height >= MIN_SIZE && (
        <div
          className="markaroo-region-box"
          style={{
            left: currentRect.left,
            top: currentRect.top,
            width: currentRect.width,
            height: currentRect.height,
          }}
        >
          {/* Draggable body */}
          {(phase.name === 'drawn' || phase.name === 'moving') && (
            <div
              className="markaroo-region-body"
              onPointerDown={(e) => startMove(e, currentRect)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          )}

          {/* 8 resize handles — only in drawn/resizing phase */}
          {(phase.name === 'drawn' || phase.name === 'resizing') &&
            HANDLES.map((h) => (
              <div
                key={h}
                className={`markaroo-region-handle markaroo-region-handle--${h}`}
                onPointerDown={(e) => startResize(e, h, currentRect)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              />
            ))}

          {/* Confirm button */}
          {phase.name === 'drawn' && (
            <button
              className="markaroo-region-confirm"
              onClick={() => confirmRegion(currentRect)}
              type="button"
            >
              Capture Region
            </button>
          )}
        </div>
      )}
    </div>
  );
}
