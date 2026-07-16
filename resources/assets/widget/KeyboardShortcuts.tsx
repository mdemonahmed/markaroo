import { useEffect, useRef } from '@wordpress/element';
import { useWidget, useWidgetDispatch } from './store/WidgetContext';
import { apiFetch } from './api';
import type { FeedbackItem } from './types';

/**
 * Single document-level keydown listener, active only while a feedback session
 * is running (never per-pin listeners). Shortcuts:
 *   n        start a new pin capture
 *   Escape   cancel the active capture, else deselect the active pin
 *   r        resolve/unresolve the active pin
 *   [ / ]    cycle to the previous / next pin
 *
 * Keys are ignored while the user is typing in a field or holding a modifier.
 */
export function KeyboardShortcuts() {
  const state = useWidget();
  const dispatch = useWidgetDispatch();

  // Read the latest state through a ref so the listener stays stable and is
  // bound/unbound only when the session toggles.
  const stateRef = useRef( state );
  stateRef.current = state;

  const enabled = state.enabled && state.mode !== 'clean';

  useEffect( () => {
    if ( ! enabled ) {
      return;
    }

    function isTextTarget( target: EventTarget | null ): boolean {
      const el = target as HTMLElement | null;
      if ( ! el ) {
        return false;
      }
      const tag = el.tagName;
      return (
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true
      );
    }

    async function toggleResolve( id: number ) {
      const s = stateRef.current;
      const item = s.feedbacks.find( ( f ) => f.id === id );
      if ( ! item ) {
        return;
      }
      const endpoint =
        item.status === 'open' ? `feedback/${ id }/resolve` : `feedback/${ id }/unresolve`;
      try {
        const updated = await apiFetch< FeedbackItem >( endpoint, { method: 'POST', body: '' } );
        dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
      } catch {
        /* non-fatal */
      }
    }

    function cycle( dir: 1 | -1 ) {
      const s = stateRef.current;
      if ( s.feedbacks.length === 0 ) {
        return;
      }
      const ids = s.feedbacks.map( ( f ) => f.id );
      const currentIndex = s.activePinId === null ? -1 : ids.indexOf( s.activePinId );
      const nextIndex = ( currentIndex + dir + ids.length ) % ids.length;
      dispatch( { type: 'SET_ACTIVE_PIN', id: ids[ nextIndex ] } );
      window.dispatchEvent(
        new CustomEvent( 'markaroo:pin-opened', { detail: { id: ids[ nextIndex ] } } )
      );
    }

    function onKeyDown( e: KeyboardEvent ) {
      if ( e.ctrlKey || e.metaKey || e.altKey || isTextTarget( e.target ) ) {
        return;
      }

      const s = stateRef.current;

      switch ( e.key ) {
        case 'n':
        case 'N':
          if ( s.capturePhase === 'idle' ) {
            e.preventDefault();
            dispatch( { type: 'START_CAPTURE' } );
          }
          break;

        case 'Escape':
          if ( s.captureState === 'active' ) {
            e.preventDefault();
            dispatch( { type: 'END_CAPTURE' } );
          } else if ( s.activePinId !== null ) {
            e.preventDefault();
            dispatch( { type: 'SET_ACTIVE_PIN', id: null } );
          }
          break;

        case 'r':
        case 'R':
          if ( s.activePinId !== null ) {
            e.preventDefault();
            toggleResolve( s.activePinId );
          }
          break;

        case '[':
          e.preventDefault();
          cycle( -1 );
          break;

        case ']':
          e.preventDefault();
          cycle( 1 );
          break;

        default:
          break;
      }
    }

    document.addEventListener( 'keydown', onKeyDown );
    return () => document.removeEventListener( 'keydown', onKeyDown );
  }, [ enabled, dispatch ] );

  return null;
}
