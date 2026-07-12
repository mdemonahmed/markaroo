import { useEffect } from '@wordpress/element';
import { WidgetProvider, useWidget, useWidgetDispatch } from './store/WidgetContext';
import { ModeManager } from './ModeManager';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Launcher } from './Launcher';
import { FeedbackPanel } from './FeedbackPanel';
import { PinLayer } from './pins/PinLayer';
import { QueuedPins } from './pins/QueuedPins';
import { CaptureOverlay } from './capture/CaptureOverlay';
import { ComposerPanel } from './composer/ComposerPanel';
import { PinCard } from './thread/PinCard';
import type { FeedbackItem, WidgetMode } from './types';

function WidgetInner() {
  const { capturePhase, captureData, mode, activePinId, feedbacks } = useWidget();
  const dispatch = useWidgetDispatch();

  // Admin-bar / external launcher: start a capture on `.markaroo-launch` click.
  useEffect( () => {
    function onLaunch( e: Event ) {
      const el = e.target as HTMLElement;
      if ( el && el.closest( '.markaroo-launch' ) ) {
        e.preventDefault();
        dispatch( { type: 'ENABLE_SESSION' } );
      }
    }
    document.addEventListener( 'click', onLaunch );
    return () => document.removeEventListener( 'click', onLaunch );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  // Add feedback that finally submitted from the offline queue to state.
  useEffect( () => {
    function onRestored( e: Event ) {
      const item = ( e as CustomEvent ).detail?.feedback as FeedbackItem | undefined;
      if ( item ) {
        dispatch( { type: 'FEEDBACK_SUBMITTED', item } );
      }
    }
    window.addEventListener( 'markaroo:feedback-restored', onRestored );
    return () => window.removeEventListener( 'markaroo:feedback-restored', onRestored );
  }, [ dispatch ] );

  function handleSubmitted( item: FeedbackItem ) {
    dispatch( { type: 'FEEDBACK_SUBMITTED', item } );
  }

  function handleCancelCapture() {
    dispatch( { type: 'END_CAPTURE' } );
  }

  const activePin =
    activePinId !== null ? feedbacks.find( ( f ) => f.id === activePinId ) ?? null : null;

  return (
    <ModeManager>
      <KeyboardShortcuts />
      <Launcher />
      <FeedbackPanel />
      <PinLayer />
      <QueuedPins />

      { 'clean' !== mode && 'selecting' === capturePhase && <CaptureOverlay /> }

      { 'clean' !== mode && 'composing' === capturePhase && captureData && (
        <ComposerPanel
          captureData={ captureData }
          onSubmitted={ handleSubmitted }
          onCancel={ handleCancelCapture }
        />
      ) }

      { 'clean' !== mode && 'idle' === capturePhase && activePin && (
        <PinCard
          key={ activePin.id }
          feedback={ activePin }
          onClose={ () => dispatch( { type: 'SET_ACTIVE_PIN', id: null } ) }
        />
      ) }
    </ModeManager>
  );
}

export function WidgetRoot() {
  const config = window.markarooConfig;
  const initialMode: WidgetMode = config?.widgetMode ?? 'comment';

  useEffect( () => {
    window.dispatchEvent(
      new CustomEvent( 'markaroo:ready', { detail: { mode: initialMode, config } } )
    );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetProvider initialMode={ initialMode }>
      <WidgetInner />
    </WidgetProvider>
  );
}
