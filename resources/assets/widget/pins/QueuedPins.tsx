import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getQueuedEntries } from '../offlineQueue';
import { useWidget } from '../store/WidgetContext';

interface QueuedPin {
  uuid: string;
  x: number;
  y: number;
}

function docSize(): { w: number; h: number } {
  const d = document.documentElement;
  return { w: d.scrollWidth, h: d.scrollHeight };
}

function readQueued(): QueuedPin[] {
  return getQueuedEntries().map( ( e ) => ( {
    uuid: e.uuid,
    x: Number( ( e.payload as { x?: number } ).x ?? 0 ),
    y: Number( ( e.payload as { y?: number } ).y ?? 0 ),
  } ) );
}

/**
 * Non-interactive "queued" markers for feedback that failed to submit and is
 * waiting in the offline retry queue. They disappear as the queue drains.
 */
export function QueuedPins() {
  const { enabled, mode } = useWidget();
  const [ pins, setPins ] = useState< QueuedPin[] >( readQueued );
  const [ page, setPage ] = useState( docSize );

  useEffect( () => {
    function refresh() {
      setPins( readQueued() );
      setPage( docSize() );
    }
    refresh();
    window.addEventListener( 'markaroo:queue-changed', refresh );
    window.addEventListener( 'markaroo:queue-dropped', refresh );
    return () => {
      window.removeEventListener( 'markaroo:queue-changed', refresh );
      window.removeEventListener( 'markaroo:queue-dropped', refresh );
    };
  }, [] );

  if ( ! enabled || mode === 'clean' || pins.length === 0 ) {
    return null;
  }

  return (
    <div className="markaroo-pin-layer markaroo-pin-layer--queued" aria-hidden="true">
      { pins.map( ( p ) => (
        <span
          key={ p.uuid }
          className="markaroo-pin markaroo-pin--queued"
          style={ { left: `${ p.x * page.w }px`, top: `${ p.y * page.h }px` } }
          title={ __( 'Queued — will submit when back online', 'markaroo' ) }
        >
          <span className="markaroo-pin__badge">⋯</span>
        </span>
      ) ) }
    </div>
  );
}
