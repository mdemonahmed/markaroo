import { useEffect } from '@wordpress/element';
import { WidgetProvider } from './store/WidgetContext';
import { ModeManager } from './ModeManager';
import { Launcher } from './Launcher';
import { PinsPanel } from './PinsPanel';
import type { WidgetMode } from './types';

export function WidgetRoot() {
	const config = window.markarooConfig;
	const initialMode: WidgetMode = config?.widgetMode ?? 'comment';

	useEffect( () => {
		window.dispatchEvent(
			new CustomEvent( 'markaroo:ready', {
				detail: {
					mode: initialMode,
					config,
				},
			} )
		);
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	// Clean mode — provider needed for state, but children render nothing.
	return (
		<WidgetProvider initialMode={ initialMode }>
			<ModeManager>
				<Launcher />
				<PinsPanel />
			</ModeManager>
		</WidgetProvider>
	);
}
