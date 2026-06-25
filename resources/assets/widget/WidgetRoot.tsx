import { useEffect } from '@wordpress/element';
import { WidgetProvider, useWidget, useWidgetDispatch } from './store/WidgetContext';
import { ModeManager } from './ModeManager';
import { Launcher } from './Launcher';
import { PinsPanel } from './PinsPanel';
import { PinLayer } from './pins/PinLayer';
import { CaptureOverlay } from './capture/CaptureOverlay';
import { AnnotationCanvas } from './capture/AnnotationCanvas';
import { ComposerPanel } from './composer/ComposerPanel';
import { captureScreenshot } from './capture/Screenshot';
import type { Annotation, FeedbackItem, WidgetMode } from './types';

function WidgetInner() {
  const { capturePhase, captureData, screenshotBlob, mode } = useWidget();
  const dispatch = useWidgetDispatch();

  // Trigger screenshot capture when transitioning into 'annotating'.
  useEffect(() => {
    if (capturePhase !== 'annotating') {
      return;
    }
    captureScreenshot().then((blob) => {
      dispatch({ type: 'SCREENSHOT_TAKEN', blob });
    });
  }, [capturePhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Admin-bar / external launcher: open the panel on click of `.markaroo-launch`.
  useEffect(() => {
    function onLaunch(e: Event) {
      const el = e.target as HTMLElement;
      if (el && el.closest('.markaroo-launch')) {
        e.preventDefault();
        dispatch({ type: 'OPEN_PANEL' });
      }
    }
    document.addEventListener('click', onLaunch);
    return () => document.removeEventListener('click', onLaunch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnnotationsDone(annotations: Annotation[], burnedBlob: Blob | null) {
    dispatch({ type: 'ANNOTATIONS_DONE', annotations, burnedBlob });
  }

  function handleSubmitted(item: FeedbackItem) {
    dispatch({ type: 'FEEDBACK_SUBMITTED', item });
  }

  function handleCancelCapture() {
    dispatch({ type: 'END_CAPTURE' });
  }

  return (
    <ModeManager>
      <Launcher />
      <PinLayer />
      <PinsPanel />
      {'clean' !== mode && 'selecting' === capturePhase && <CaptureOverlay />}
      {'clean' !== mode && 'annotating' === capturePhase && (
        <AnnotationCanvas
          screenshotBlob={screenshotBlob}
          onDone={handleAnnotationsDone}
          onCancel={handleCancelCapture}
        />
      )}
      {'clean' !== mode && 'composing' === capturePhase && captureData && (
        <ComposerPanel
          captureData={captureData}
          screenshotBlob={screenshotBlob}
          onSubmitted={handleSubmitted}
          onCancel={handleCancelCapture}
        />
      )}
    </ModeManager>
  );
}

export function WidgetRoot() {
  const config = window.markarooConfig;
  const initialMode: WidgetMode = config?.widgetMode ?? 'comment';

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('markaroo:ready', { detail: { mode: initialMode, config } })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetProvider initialMode={initialMode}>
      <WidgetInner />
    </WidgetProvider>
  );
}
