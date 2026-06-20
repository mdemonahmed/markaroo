import { useEffect } from '@wordpress/element';
import { WidgetProvider, useWidget } from './store/WidgetContext';
import { ModeManager } from './ModeManager';
import { Launcher } from './Launcher';
import { PinsPanel } from './PinsPanel';
import { CaptureOverlay } from './capture/CaptureOverlay';
import type { WidgetMode } from './types';

function WidgetInner() {
	const { capturePhase, mode } = useWidget();

	return (
		<ModeManager>
			<Launcher />
			<PinsPanel />
			{ 'clean' !== mode && 'selecting' === capturePhase && < CaptureOverlay /> }
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
