import { useState } from '@wordpress/element';
import { useWidget, useWidgetDispatch } from './store/WidgetContext';

type Tab = 'open' | 'resolved';

export function PinsPanel() {
	const { mode, panelOpen, captureState } = useWidget();
	const dispatch = useWidgetDispatch();
	const [ activeTab, setActiveTab ] = useState< Tab >( 'open' );

	// Clean mode, panel closed, or capturing — don't render.
	if ( 'clean' === mode || ! panelOpen || 'active' === captureState ) {
		return null;
	}

	const i18n = window.markarooConfig?.i18n ?? {};
	const config = window.markarooConfig;
	const canCreate = config?.currentUser?.canCreate ?? false;
	const shareCanComment = config?.shareRights?.canComment ?? false;

	const showNewButton = canCreate || shareCanComment;

	return (
		<div
			className="markaroo-panel"
			role="complementary"
			aria-label={ i18n.feedback ?? 'Feedback' }
		>
			<div className="markaroo-panel__header">
				<h2 className="markaroo-panel__title">{ i18n.feedback ?? 'Feedback' }</h2>
				<div className="markaroo-panel__header-actions">
					{ showNewButton && (
						<button
							className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
							onClick={ () => dispatch( { type: 'START_CAPTURE' } ) }
							type="button"
						>
							+ New
						</button>
					) }
					<button
						className="markaroo-panel__close"
						onClick={ () => dispatch( { type: 'CLOSE_PANEL' } ) }
						aria-label="Close"
						type="button"
					>
						&times;
					</button>
				</div>
			</div>

			<div className="markaroo-panel__tabs" role="tablist">
				{ ( [ 'open', 'resolved' ] as Tab[] ).map( ( tab ) => (
					<button
						key={ tab }
						role="tab"
						aria-selected={ activeTab === tab }
						className={ `markaroo-panel__tab${ activeTab === tab ? ' markaroo-panel__tab--active' : '' }` }
						onClick={ () => setActiveTab( tab ) }
						type="button"
					>
						{ 'open' === tab ? 'Open' : ( i18n.resolve ?? 'Resolved' ) }
					</button>
				) ) }
			</div>

			<div className="markaroo-panel__body" role="tabpanel">
				{ /* Task 12 renders actual pins here */ }
				<p className="markaroo-panel__empty">No feedback yet.</p>
			</div>
		</div>
	);
}
