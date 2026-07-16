import { memo, useState, useRef, useEffect, createPortal } from '@wordpress/element';
import { Avatar } from '../support/Avatar';
import { timeAgo } from '../support/timeAgo';
import type { FeedbackItem } from '../types';

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

interface Props {
  item: FeedbackItem;
  number: number;
  dimmed: boolean;
  active: boolean;
  canDrag: boolean;
  pageW: number;
  pageH: number;
  onClick: ( id: number ) => void;
  onMove: ( id: number, x: number, y: number ) => void;
}

// Memoized (with id-taking stable callbacks from PinLayer) so a state change
// for one pin doesn't re-render every sibling marker.
export const PinMarker = memo( function PinMarker( {
  item,
  number,
  dimmed,
  active,
  canDrag,
  pageW,
  pageH,
  onClick,
  onMove,
}: Props ) {
  const pinRef = useRef< HTMLButtonElement >( null );
  const dragRef = useRef< { startX: number; startY: number; pinX: number; pinY: number } | null >(
    null
  );
  const [ dragging, setDragging ] = useState( false );
  const [ localX, setLocalX ] = useState( item.x );
  const [ localY, setLocalY ] = useState( item.y );

  // Hover preview: small delay so quick pointer passes don't flash tooltips.
  // Rendered through a portal into #markaroo-root — the pin button itself is
  // rotated (teardrop shape), which would rotate any child tooltip with it.
  const [ preview, setPreview ] = useState< { left: number; top: number; flip: boolean } | null >(
    null
  );
  const hoverTimer = useRef< number | null >( null );

  function showPreview() {
    if ( active || dragging || hoverTimer.current ) {
      return;
    }
    hoverTimer.current = window.setTimeout( () => {
      hoverTimer.current = null;
      const rect = pinRef.current?.getBoundingClientRect();
      if ( ! rect ) {
        return;
      }
      // Flip to the left when the pin sits near the right viewport edge.
      const flip = rect.right > window.innerWidth - 290;
      setPreview( {
        left: flip ? rect.left - 6 : rect.right + 6,
        top: rect.top - 2,
        flip,
      } );
    }, 150 );
  }

  function hidePreview() {
    if ( hoverTimer.current ) {
      window.clearTimeout( hoverTimer.current );
      hoverTimer.current = null;
    }
    setPreview( null );
  }

  useEffect( () => {
    return () => {
      if ( hoverTimer.current ) {
        window.clearTimeout( hoverTimer.current );
      }
    };
  }, [] );

  // Sync if item updates from outside.
  if ( ! dragging && ( localX !== item.x || localY !== item.y ) ) {
    setLocalX( item.x );
    setLocalY( item.y );
  }

  const color =
    item.status === 'resolved' ? '#22c55e' : PRIORITY_COLORS[ item.priority ] ?? '#6366f1';
  // Document-pixel position so the pin sticks to page content and scrolls with it.
  const pinLeft = `${ localX * pageW }px`;
  const pinTop = `${ localY * pageH }px`;

  function handlePointerDown( e: React.PointerEvent ) {
    if ( ! canDrag ) {
      return;
    }
    try {
      e.currentTarget.setPointerCapture( e.pointerId );
    } catch {} // synthetic/stale pointers have no capturable id
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      pinX: localX,
      pinY: localY,
    };
    setDragging( false );
  }

  function handlePointerMove( e: React.PointerEvent ) {
    if ( ! dragRef.current ) {
      return;
    }
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if ( ! dragging && ( Math.abs( dx ) > 4 || Math.abs( dy ) > 4 ) ) {
      setDragging( true );
    }
    if ( dragging || Math.abs( dx ) > 4 || Math.abs( dy ) > 4 ) {
      const newX = Math.min( 1, Math.max( 0, dragRef.current.pinX + dx / pageW ) );
      const newY = Math.min( 1, Math.max( 0, dragRef.current.pinY + dy / pageH ) );
      setLocalX( newX );
      setLocalY( newY );
    }
  }

  function handlePointerUp() {
    if ( ! dragRef.current ) {
      return;
    }
    const wasDragging = dragging;
    dragRef.current = null;
    setDragging( false );
    if ( wasDragging ) {
      onMove( item.id, localX, localY );
    } else {
      onClick( item.id );
    }
  }

  return (
    <button
      ref={ pinRef }
      className={ [
        'markaroo-pin',
        active ? 'markaroo-pin--active' : '',
        dimmed ? 'markaroo-pin--dimmed' : '',
        dragging ? 'markaroo-pin--dragging' : '',
        item.status === 'resolved' ? 'markaroo-pin--resolved' : '',
      ]
        .filter( Boolean )
        .join( ' ' ) }
      style={
        {
          left: pinLeft,
          top: pinTop,
          '--pin-color': color,
        } as React.CSSProperties
      }
      aria-label={ `Feedback #${ number }: ${ ( item.title || item.comment ).slice( 0, 60 ) }` }
      aria-pressed={ active }
      onPointerDown={ handlePointerDown }
      onPointerMove={ handlePointerMove }
      onPointerUp={ handlePointerUp }
      onMouseEnter={ showPreview }
      onMouseLeave={ hidePreview }
      onFocus={ showPreview }
      onBlur={ hidePreview }
      onClick={ hidePreview }
      type="button"
    >
      <span className="markaroo-pin__badge">{ number }</span>
      <span className="markaroo-pin__priority-dot" />
      { preview &&
        ! active &&
        ! dragging &&
        createPortal(
          <span
            className={ `markaroo-pin-preview${
              preview.flip ? ' markaroo-pin-preview--left' : ''
            }` }
            style={ { left: preview.left, top: preview.top } }
          >
            <span className="markaroo-pin-preview__meta">
              <Avatar name={ item.author } src={ item.avatar } size={ 24 } />
              <span className="markaroo-pin-preview__author">{ item.author }</span>
              <span className="markaroo-pin-preview__time">{ timeAgo( item.created_at ) }</span>
            </span>
            <span className="markaroo-pin-preview__text">
              { item.title || item.comment.slice( 0, 60 ) }
            </span>
          </span>,
          document.getElementById( 'markaroo-root' ) ?? document.body
        ) }
    </button>
  );
} );
