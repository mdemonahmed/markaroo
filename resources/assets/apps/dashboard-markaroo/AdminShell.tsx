import { useState } from '@wordpress/element';
import { OverviewView }   from './views/OverviewView';
import { TaskListView }   from './views/TaskListView';
import { SettingsView }   from './views/SettingsView';
import { ShareLinksView } from './views/ShareLinksView';

type Tab = 'overview' | 'tasks' | 'settings' | 'shares';

function initialTab(): Tab {
	const hash = window.location.hash.replace( '#', '' ) as Tab;
	return ( [ 'overview', 'tasks', 'settings', 'shares' ] as Tab[] ).includes( hash ) ? hash : 'overview';
}

const TABS: { id: Tab; label: string }[] = [
	{ id: 'overview', label: 'Dashboard'   },
	{ id: 'tasks',    label: 'Tasks'        },
	{ id: 'settings', label: 'Settings'    },
	{ id: 'shares',   label: 'Share Links' },
];

export function AdminShell() {
	const [ tab, setTab ] = useState< Tab >( initialTab );

	function switchTab( t: Tab ) {
		setTab( t );
		window.location.hash = t;
	}

	return (
		<div className="markaroo-admin">
			<div className="markaroo-admin__header">
				<h1 className="markaroo-admin__title">
					<span className="markaroo-admin__logo">●</span> Markaroo
				</h1>
			</div>

			<nav className="markaroo-admin__nav" aria-label="Admin navigation">
				{ TABS.map( ( t ) => (
					<button
						key={ t.id }
						type="button"
						className={ `markaroo-admin__nav-item${ tab === t.id ? ' markaroo-admin__nav-item--active' : '' }` }
						onClick={ () => switchTab( t.id ) }
						aria-current={ tab === t.id ? 'page' : undefined }
					>
						{ t.label }
					</button>
				) ) }
			</nav>

			<main className="markaroo-admin__main">
				{ tab === 'overview' && <OverviewView /> }
				{ tab === 'tasks'    && <TaskListView /> }
				{ tab === 'settings' && <SettingsView /> }
				{ tab === 'shares'   && <ShareLinksView /> }
			</main>
		</div>
	);
}
