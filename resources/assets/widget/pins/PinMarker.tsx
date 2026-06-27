import { useState, useRef } from '@wordpress/element';
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
  onClick: () => void;
  onMove: ( x: number, y: number ) => void;
  onResolve: () => void;
}

export function PinMarker( {
  item,
  number,
  dimmed,
  active,
  canDrag,
  pageW,
  pageH,
  onClick,
  onMove,
  onResolve,
}: Props ) {
  const pinRef = useRef< HTMLButtonElement >( null );
  const dragRef = useRef< { startX: number; startY: number; pinX: number; pinY: number } | null >(
    null
  );
  const [ dragging, setDragging ] = useState( false );
  const [ localX, setLocalX ] = useState( item.x );
  const [ localY, setLocalY ] = useState( item.y );

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
    e.currentTarget.setPointerCapture( e.pointerId );
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
      onMove( localX, localY );
    } else {
      onClick();
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
      aria-label={ `Feedback #${ number }: ${ item.comment.slice( 0, 60 ) }` }
      aria-pressed={ active }
      onPointerDown={ handlePointerDown }
      onPointerMove={ handlePointerMove }
      onPointerUp={ handlePointerUp }
      type="button"
    >
      <span className="markaroo-pin__badge">{ number }</span>
      <span className="markaroo-pin__priority-dot" />
    </button>
  );
}
