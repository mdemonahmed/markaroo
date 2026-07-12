import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { PinMarker } from './PinMarker';
import { apiFetch, apiPatch } from '../api';
import { useWidget, useWidgetDispatch } from '../store/WidgetContext';
import { getPageKey } from '../capture/captureUtils';
import type { FeedbackItem } from '../types';

function docSize(): { w: number; h: number } {
  const d = document.documentElement;
  return { w: d.scrollWidth, h: d.scrollHeight };
}

export function PinLayer() {
  const { feedbacks, enabled, captureState, activePinId, mode } = useWidget();
  const dispatch = useWidgetDispatch();
  const loadedRef = useRef( false );
  const [ page, setPage ] = useState( docSize );

  // Keep document dimensions current so pin pixel positions track reflow/resize.
  // ResizeObserver fires only on real layout changes; the 1s interval is kept
  // solely as a fallback for environments without it.
  useEffect( () => {
    function update() {
      setPage( ( prev ) => {
        const next = docSize();
        return prev.w === next.w && prev.h === next.h ? prev : next;
      } );
    }
    update();
    window.addEventListener( 'resize', update );

    let observer: ResizeObserver | null = null;
    let intervalId = 0;
    if ( typeof ResizeObserver !== 'undefined' ) {
      observer = new ResizeObserver( update );
      observer.observe( document.documentElement );
      if ( document.body ) {
        observer.observe( document.body );
      }
    } else {
      intervalId = window.setInterval( update, 1000 );
    }

    return () => {
      window.removeEventListener( 'resize', update );
      observer?.disconnect();
      if ( intervalId ) {
        window.clearInterval( intervalId );
      }
    };
  }, [ feedbacks.length ] );

  // Load page feedback the first time the session is enabled (Annotix-style:
  // nothing is fetched or shown until the user enters feedback mode).
  useEffect( () => {
    if ( loadedRef.current || ! enabled || mode === 'clean' ) {
      return;
    }
    loadedRef.current = true;

    apiFetch< { data: FeedbackItem[] } >(
      `feedback?page_key=${ encodeURIComponent( getPageKey() ) }&per_page=100`
    )
      .then( ( res ) => dispatch( { type: 'FEEDBACKS_LOADED', items: res.data } ) )
      .catch( () => null );
  }, [ enabled, mode ] ); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll the active pin into view so its anchored card is visible.
  useEffect( () => {
    if ( activePinId === null ) {
      return;
    }
    const item = feedbacks.find( ( f ) => f.id === activePinId );
    if ( ! item ) {
      return;
    }
    const targetY = item.y * page.h;
    if ( targetY < window.scrollY + 40 || targetY > window.scrollY + window.innerHeight - 40 ) {
      window.scrollTo( {
        top: Math.max( 0, targetY - window.innerHeight / 3 ),
        behavior: 'smooth',
      } );
    }
  }, [ activePinId ] ); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable, id-taking callbacks (latest state read through refs) so the
  // memoized PinMarkers don't all re-render whenever one pin changes.
  const activePinRef = useRef( activePinId );
  activePinRef.current = activePinId;
  const feedbacksRef = useRef( feedbacks );
  feedbacksRef.current = feedbacks;

  const handlePinClick = useCallback(
    ( id: number ) => {
      dispatch( { type: 'SET_ACTIVE_PIN', id: activePinRef.current === id ? null : id } );
      window.dispatchEvent( new CustomEvent( 'markaroo:pin-opened', { detail: { id } } ) );
    },
    [ dispatch ]
  );

  const handlePinMove = useCallback(
    async ( id: number, x: number, y: number ) => {
      try {
        const updated = await apiPatch< FeedbackItem >( `feedback/${ id }`, { x, y } );
        dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
        window.dispatchEvent( new CustomEvent( 'markaroo:pin-moved', { detail: { id, x, y } } ) );
      } catch {
        // Position revert happens via state (no change dispatched).
      }
    },
    [ dispatch ]
  );

  const handleResolve = useCallback(
    async ( id: number ) => {
      try {
        const item = feedbacksRef.current.find( ( f ) => f.id === id );
        const endpoint =
          item?.status === 'open' ? `feedback/${ id }/resolve` : `feedback/${ id }/unresolve`;
        const updated = await apiFetch< FeedbackItem >( endpoint, { method: 'POST', body: '' } );
        dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
        window.dispatchEvent(
          new CustomEvent( 'markaroo:pin-resolved', { detail: { id, status: updated.status } } )
        );
      } catch {
        // Resolve toggle failure is non-fatal; state stays as-is.
      }
    },
    [ dispatch ]
  );

  if ( ! enabled || mode === 'clean' || feedbacks.length === 0 ) {
    return null;
  }

  return (
    <div className="markaroo-pin-layer" aria-label="Feedback pins">
      { feedbacks.map( ( item, idx ) => (
        <PinMarker
          key={ item.id }
          item={ item }
          number={ idx + 1 }
          dimmed={ captureState === 'active' }
          active={ activePinId === item.id }
          canDrag={ mode === 'comment' }
          pageW={ page.w }
          pageH={ page.h }
          onClick={ handlePinClick }
          onMove={ handlePinMove }
          onResolve={ handleResolve }
        />
      ) ) }
    </div>
  );
}
