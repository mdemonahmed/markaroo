import { useEffect } from '@wordpress/element';
import { WidgetProvider, useWidget, useWidgetDispatch } from './store/WidgetContext';
import { ModeManager } from './ModeManager';
import { Launcher } from './Launcher';
import { PinsPanel } from './PinsPanel';
import { CaptureOverlay } from './capture/CaptureOverlay';
import { AnnotationCanvas } from './capture/AnnotationCanvas';
import { captureScreenshot } from './capture/Screenshot';
import type { Annotation, WidgetMode } from './types';

function WidgetInner() {
	const { capturePhase, screenshotBlob, mode } = useWidget();
	const dispatch = useWidgetDispatch();

	// Trigger screenshot capture when transitioning into 'annotating'.
	useEffect( () => {
		if ( capturePhase !== 'annotating' ) return;

		captureScreenshot().then( ( blob ) => {
			dispatch( { type: 'SCREENSHOT_TAKEN', blob } );
		} );
	}, [ capturePhase ] ); // eslint-disable-line react-hooks/exhaustive-deps

	function handleAnnotationsDone( annotations: Annotation[], burnedBlob: Blob | null ) {
		dispatch( { type: 'ANNOTATIONS_DONE', annotations, burnedBlob } );
	}

	function handleAnnotationCancel() {
		dispatch( { type: 'END_CAPTURE' } );
	}

	return (
		<ModeManager>
			<Launcher />
			<PinsPanel />
			{ 'clean' !== mode && 'selecting' === capturePhase && <CaptureOverlay /> }
			{ 'clean' !== mode && 'annotating' === capturePhase && (
				<AnnotationCanvas
					screenshotBlob={ screenshotBlob }
					onDone={ handleAnnotationsDone }
					onCancel={ handleAnnotationCancel }
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
			new CustomEvent( 'markaroo:ready', {
				detail: { mode: initialMode, config },
			} )
		);
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<WidgetProvider initialMode={ initialMode }>
			<WidgetInner />
		</WidgetProvider>
	);
}
