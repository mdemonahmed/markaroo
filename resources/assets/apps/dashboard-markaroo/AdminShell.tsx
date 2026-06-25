import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { OverviewView } from './views/OverviewView';
import { TaskListView } from './views/TaskListView';
import { SettingsView } from './views/SettingsView';
import { ShareLinksView } from './views/ShareLinksView';
import { ApprovalsView } from './views/ApprovalsView';
import { GettingStartedView } from './views/GettingStartedView';
import type { OnboardingState } from './views/GettingStartedView';

type Tab = 'getting-started' | 'overview' | 'tasks' | 'approvals' | 'shares' | 'settings';

const TAB_IDS: Tab[] = [
  'getting-started',
  'overview',
  'tasks',
  'approvals',
  'shares',
  'settings',
];

function initialTab(): Tab {
  const hash = window.location.hash.replace( '#', '' ) as Tab;
  return TAB_IDS.includes( hash ) ? hash : 'overview';
}

interface TabDef {
  id: Tab;
  label: string;
  icon: JSX.Element;
}

function NavIcon( { d }: { d: string } ) {
  return (
    <svg
      className="markaroo-nav__icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={ d }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getTabs( showGettingStarted: boolean ): TabDef[] {
  const tabs: TabDef[] = [];

  if ( showGettingStarted ) {
    tabs.push( {
      id: 'getting-started',
      label: __( 'Getting Started', 'markaroo' ),
      icon: <NavIcon d="M9 11l3 3 8-8M21 12a9 9 0 11-6.219-8.56" />,
    } );
  }

  tabs.push(
    {
      id: 'overview',
      label: __( 'Dashboard', 'markaroo' ),
      icon: <NavIcon d="M3 12l9-9 9 9M5 10v10h14V10" />,
    },
    {
      id: 'tasks',
      label: __( 'All Reviews', 'markaroo' ),
      icon: <NavIcon d="M4 6h16M4 12h16M4 18h10" />,
    },
    {
      id: 'approvals',
      label: __( 'Approvals', 'markaroo' ),
      icon: <NavIcon d="M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z" />,
    },
    {
      id: 'shares',
      label: __( 'Share Links', 'markaroo' ),
      icon: <NavIcon d="M9 12a3 3 0 106 0 3 3 0 00-6 0M7 9L4 6m13 3l3-3M7 15l-3 3m13-3l3 3" />,
    },
    {
      id: 'settings',
      label: __( 'Settings', 'markaroo' ),
      icon: (
        <NavIcon d="M12 9a3 3 0 100 6 3 3 0 000-6M19 12l2-1-2-4-2 1a7 7 0 00-2-1l-1-2H10L9 5a7 7 0 00-2 1L5 5 3 9l2 1v2l-2 1 2 4 2-1a7 7 0 002 1l1 2h4l1-2a7 7 0 002-1l2 1 2-4-2-1z" />
      ),
    }
  );

  return tabs;
}

export function AdminShell() {
  const [ tab, setTab ] = useState< Tab >( initialTab );
  // Show Getting Started until the checklist is complete (or while unknown).
  const [ showGettingStarted, setShowGettingStarted ] = useState( true );

  useEffect( () => {
    window.dispatchEvent( new CustomEvent( 'markaroo:admin-ready', { detail: { tab } } ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  function onChecklistLoaded( s: OnboardingState ) {
    setShowGettingStarted( ! s.done );
    if ( s.done && tab === 'getting-started' ) {
      switchTab( 'overview' );
    }
  }

  const tabs = getTabs( showGettingStarted );

  function switchTab( t: Tab ) {
    setTab( t );
    window.location.hash = t;
  }

  const activeLabel = tabs.find( ( t ) => t.id === tab )?.label ?? __( 'Dashboard', 'markaroo' );

  return (
    <div className="markaroo-app markaroo-admin">
      <aside className="markaroo-sidebar">
        <div className="markaroo-sidebar__brand">
          <span className="markaroo-sidebar__logo">●</span>
          <span className="markaroo-sidebar__name">Markaroo</span>
        </div>

        <nav
          className="markaroo-sidebar__nav"
          aria-label={ __( 'Markaroo navigation', 'markaroo' ) }
        >
          { tabs.map( ( t ) => (
            <button
              key={ t.id }
              type="button"
              className={ `markaroo-nav__item${
                tab === t.id ? ' markaroo-nav__item--active' : ''
              }` }
              onClick={ () => switchTab( t.id ) }
              aria-current={ tab === t.id ? 'page' : undefined }
            >
              { t.icon }
              <span>{ t.label }</span>
            </button>
          ) ) }
        </nav>

        <a
          className="markaroo-sidebar__help"
          href="https://devemon.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          { __( 'Help & docs', 'markaroo' ) }
        </a>
      </aside>

      <div className="markaroo-shell">
        <header className="markaroo-topbar">
          <h1 className="markaroo-topbar__title">{ activeLabel }</h1>
        </header>

        <main className="markaroo-admin__main">
          { /* Mounted (hidden) whenever Getting Started is not the active tab so its
               state still drives the nav-item visibility. */ }
          <div style={ tab === 'getting-started' ? undefined : { display: 'none' } }>
            <GettingStartedView onLoaded={ onChecklistLoaded } />
          </div>
          { tab === 'overview' && <OverviewView /> }
          { tab === 'tasks' && <TaskListView /> }
          { tab === 'approvals' && <ApprovalsView /> }
          { tab === 'shares' && <ShareLinksView /> }
          { tab === 'settings' && <SettingsView /> }
        </main>
      </div>
    </div>
  );
}
