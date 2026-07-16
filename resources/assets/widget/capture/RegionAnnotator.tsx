import { useState, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { buildClickCaptureData, buildRegionCaptureData, toPagePct } from './captureUtils';
import type { Annotation, CaptureData } from '../types';

// -----------------------------------------------------------------------
// Geometry
// -----------------------------------------------------------------------

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

type Handle = 'nw' | 'ne' | 'se' | 'sw';
type Tool = 'select' | 'rect' | 'circle' | 'arrow';

const HANDLES: Handle[] = [ 'nw', 'ne', 'se', 'sw' ];
const MIN_SIZE = 16;
const ANN_COLOR = '#ef4444';

function clampBox( b: Box ): Box {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const left = Math.max( 0, Math.min( b.left, vw - MIN_SIZE ) );
  const top = Math.max( 0, Math.min( b.top, vh - MIN_SIZE ) );
  return {
    left,
    top,
    width: Math.max( MIN_SIZE, Math.min( b.width, vw - left ) ),
    height: Math.max( MIN_SIZE, Math.min( b.height, vh - top ) ),
  };
}

function rectFrom( x0: number, y0: number, x1: number, y1: number ): Box {
  return {
    left: Math.min( x0, x1 ),
    top: Math.min( y0, y1 ),
    width: Math.abs( x1 - x0 ),
    height: Math.abs( y1 - y0 ),
  };
}

function applyResize( orig: Box, h: Handle, dx: number, dy: number ): Box {
  let { left, top, width, height } = orig;
  if ( h.includes( 'n' ) ) {
    top += dy;
    height -= dy;
  }
  if ( h.includes( 's' ) ) {
    height += dy;
  }
  if ( h.includes( 'w' ) ) {
    left += dx;
    width -= dx;
  }
  if ( h.includes( 'e' ) ) {
    width += dx;
  }
  return clampBox( { left, top, width, height } );
}

// Draft annotation in viewport-px while drawing; converted to page-pct on confirm.
interface DraftAnn {
  tool: 'rect' | 'circle' | 'arrow';
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

type Gesture =
  | { kind: 'none' }
  | { kind: 'draw-box'; x0: number; y0: number }
  | { kind: 'move'; startX: number; startY: number; orig: Box }
  | { kind: 'resize'; handle: Handle; startX: number; startY: number; orig: Box }
  | { kind: 'annotate'; x0: number; y0: number };

interface Props {
  onCapture: ( data: CaptureData ) => void;
  onCancel: () => void;
}

export function RegionAnnotator( { onCapture, onCancel }: Props ) {
  const [ box, setBox ] = useState< Box | null >( null );
  const [ tool, setTool ] = useState< Tool >( 'select' );
  const [ anns, setAnns ] = useState< DraftAnn[] >( [] );
  const [ draft, setDraft ] = useState< DraftAnn | null >( null );

  const gestureRef = useRef< Gesture >( { kind: 'none' } );

  const isShape = tool !== 'select';

  // ---- Pointer handlers on the overlay -------------------------------------
  const onPointerDown = useCallback(
    ( e: React.PointerEvent< HTMLDivElement > ) => {
      const target = e.target as Element;
      // Toolbar / handle / box-body have their own handlers.
      if ( target.closest( '.markaroo-ra-toolbar' ) ) {
        return;
      }

      try {
        ( e.currentTarget as HTMLElement ).setPointerCapture( e.pointerId );
      } catch {} // synthetic/stale pointers have no capturable id

      if ( isShape && box ) {
        gestureRef.current = { kind: 'annotate', x0: e.clientX, y0: e.clientY };
        setDraft( {
          tool: tool as DraftAnn[ 'tool' ],
          x0: e.clientX,
          y0: e.clientY,
          x1: e.clientX,
          y1: e.clientY,
        } );
        return;
      }

      if ( ! box ) {
        gestureRef.current = { kind: 'draw-box', x0: e.clientX, y0: e.clientY };
      }
    },
    [ box, isShape, tool ]
  );

  const onPointerMove = useCallback( ( e: React.PointerEvent< HTMLDivElement > ) => {
    const g = gestureRef.current;
    if ( g.kind === 'draw-box' ) {
      setBox( rectFrom( g.x0, g.y0, e.clientX, e.clientY ) );
    } else if ( g.kind === 'move' ) {
      setBox(
        clampBox( {
          left: g.orig.left + ( e.clientX - g.startX ),
          top: g.orig.top + ( e.clientY - g.startY ),
          width: g.orig.width,
          height: g.orig.height,
        } )
      );
    } else if ( g.kind === 'resize' ) {
      setBox( applyResize( g.orig, g.handle, e.clientX - g.startX, e.clientY - g.startY ) );
    } else if ( g.kind === 'annotate' ) {
      setDraft( ( d ) => ( d ? { ...d, x1: e.clientX, y1: e.clientY } : d ) );
    }
  }, [] );

  const onPointerUp = useCallback(
    ( e: React.PointerEvent< HTMLDivElement > ) => {
      const g = gestureRef.current;
      gestureRef.current = { kind: 'none' };

      if ( g.kind === 'draw-box' ) {
        // A simple click (no real drag) places a point pin right there.
        if ( Math.abs( e.clientX - g.x0 ) < MIN_SIZE && Math.abs( e.clientY - g.y0 ) < MIN_SIZE ) {
          setBox( null );
          const data = buildClickCaptureData( g.x0, g.y0 );
          window.dispatchEvent(
            new CustomEvent( 'markaroo:pin-placed', { detail: { captureData: data } } )
          );
          onCapture( data );
          return;
        }
        setBox( ( b ) => {
          if ( ! b || b.width < MIN_SIZE || b.height < MIN_SIZE ) {
            return null;
          }
          return clampBox( b );
        } );
      } else if ( g.kind === 'annotate' ) {
        setDraft( ( d ) => {
          if ( d && ( Math.abs( d.x1 - d.x0 ) > 4 || Math.abs( d.y1 - d.y0 ) > 4 ) ) {
            setAnns( ( prev ) => [ ...prev, d ] );
          }
          return null;
        } );
      }
    },
    [ onCapture ]
  );

  // ---- Box body move / handle resize ---------------------------------------
  function startMove( e: React.PointerEvent< HTMLDivElement > ) {
    if ( isShape || ! box ) {
      return;
    }
    e.stopPropagation();
    try {
      ( e.currentTarget as HTMLElement ).setPointerCapture( e.pointerId );
    } catch {} // synthetic/stale pointers have no capturable id
    gestureRef.current = { kind: 'move', startX: e.clientX, startY: e.clientY, orig: box };
  }

  function startResize( e: React.PointerEvent< HTMLDivElement >, handle: Handle ) {
    if ( isShape || ! box ) {
      return;
    }
    e.stopPropagation();
    try {
      ( e.currentTarget as HTMLElement ).setPointerCapture( e.pointerId );
    } catch {} // synthetic/stale pointers have no capturable id
    gestureRef.current = {
      kind: 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      orig: box,
    };
  }

  // ---- Toolbar actions ------------------------------------------------------
  function undo() {
    setAnns( ( prev ) => prev.slice( 0, -1 ) );
  }

  function confirm() {
    if ( ! box ) {
      return;
    }
    const data = buildRegionCaptureData( box.left, box.top, box.width, box.height );
    const annotations: Annotation[] = anns.map( ( a ) => {
      const from = toPagePct( a.x0, a.y0 );
      const to = toPagePct( a.x1, a.y1 );
      return { tool: a.tool, from, to, color: ANN_COLOR, width: 3 };
    } );
    data.screenshotRect.annotations = annotations;
    window.dispatchEvent(
      new CustomEvent( 'markaroo:region-selected', { detail: { captureData: data } } )
    );
    onCapture( data );
  }

  // ---- Render ---------------------------------------------------------------
  const showShapes = [ ...anns, ...( draft ? [ draft ] : [] ) ];

  return (
    <div
      className={ `markaroo-ra-overlay${ isShape ? ' markaroo-ra-overlay--draw' : '' }` }
      onPointerDown={ onPointerDown }
      onPointerMove={ onPointerMove }
      onPointerUp={ onPointerUp }
      role="presentation"
    >
      { ! box && (
        <div className="markaroo-ra-hint">
          { __( 'Click to place a pin — drag to select an area', 'markaroo' ) }
        </div>
      ) }

      { /* Annotation shapes layer (viewport px) */ }
      { box && showShapes.length > 0 && (
        <svg className="markaroo-ra-shapes" aria-hidden="true">
          <defs>
            <marker
              id="markaroo-ra-arrow"
              markerWidth="10"
              markerHeight="10"
              refX="7"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L7,3 L0,6 Z" fill={ ANN_COLOR } />
            </marker>
          </defs>
          { showShapes.map( ( s, i ) => {
            if ( s.tool === 'arrow' ) {
              return (
                <line
                  key={ i }
                  x1={ s.x0 }
                  y1={ s.y0 }
                  x2={ s.x1 }
                  y2={ s.y1 }
                  stroke={ ANN_COLOR }
                  strokeWidth={ 3 }
                  markerEnd="url(#markaroo-ra-arrow)"
                />
              );
            }
            if ( s.tool === 'rect' ) {
              return (
                <rect
                  key={ i }
                  x={ Math.min( s.x0, s.x1 ) }
                  y={ Math.min( s.y0, s.y1 ) }
                  width={ Math.abs( s.x1 - s.x0 ) }
                  height={ Math.abs( s.y1 - s.y0 ) }
                  fill="none"
                  stroke={ ANN_COLOR }
                  strokeWidth={ 3 }
                />
              );
            }
            return (
              <ellipse
                key={ i }
                cx={ ( s.x0 + s.x1 ) / 2 }
                cy={ ( s.y0 + s.y1 ) / 2 }
                rx={ Math.abs( s.x1 - s.x0 ) / 2 }
                ry={ Math.abs( s.y1 - s.y0 ) / 2 }
                fill="none"
                stroke={ ANN_COLOR }
                strokeWidth={ 3 }
              />
            );
          } ) }
        </svg>
      ) }

      { /* Selection box */ }
      { box && (
        <div
          className="markaroo-ra-box"
          style={ { left: box.left, top: box.top, width: box.width, height: box.height } }
        >
          { ! isShape && <div className="markaroo-ra-box__body" onPointerDown={ startMove } /> }
          { ! isShape &&
            HANDLES.map( ( h ) => (
              <div
                key={ h }
                className={ `markaroo-ra-handle markaroo-ra-handle--${ h }` }
                onPointerDown={ ( e ) => startResize( e, h ) }
              />
            ) ) }

          { /* Floating vertical toolbar */ }
          <div className="markaroo-ra-toolbar" role="toolbar" aria-label="Annotation tools">
            <button
              type="button"
              className={ `markaroo-ra-tool${ tool === 'rect' ? ' is-active' : '' }` }
              aria-label="Rectangle"
              aria-pressed={ tool === 'rect' }
              onClick={ () => setTool( tool === 'rect' ? 'select' : 'rect' ) }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </button>
            <button
              type="button"
              className={ `markaroo-ra-tool${ tool === 'circle' ? ' is-active' : '' }` }
              aria-label="Circle"
              aria-pressed={ tool === 'circle' }
              onClick={ () => setTool( tool === 'circle' ? 'select' : 'circle' ) }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
            </button>
            <button
              type="button"
              className={ `markaroo-ra-tool${ tool === 'arrow' ? ' is-active' : '' }` }
              aria-label="Arrow"
              aria-pressed={ tool === 'arrow' }
              onClick={ () => setTool( tool === 'arrow' ? 'select' : 'arrow' ) }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </button>
            <button
              type="button"
              className="markaroo-ra-tool"
              aria-label="Undo"
              onClick={ undo }
              disabled={ anns.length === 0 }
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
              type="button"
              className="markaroo-ra-tool markaroo-ra-tool--cancel"
              aria-label="Cancel"
              onClick={ onCancel }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <button
              type="button"
              className="markaroo-ra-tool markaroo-ra-tool--confirm"
              aria-label="Confirm"
              onClick={ confirm }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      ) }
    </div>
  );
}
