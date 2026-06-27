import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { OverviewView } from './views/OverviewView';
import { TaskListView } from './views/TaskListView';
import { SettingsView } from './views/SettingsView';
import { ApprovalsView } from './views/ApprovalsView';

type Tab = 'overview' | 'tasks' | 'approvals' | 'settings';

const TAB_IDS: Tab[] = [ 'overview', 'tasks', 'approvals', 'settings' ];

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

function getTabs(): TabDef[] {
  return [
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
      id: 'settings',
      label: __( 'Settings', 'markaroo' ),
      icon: (
        <NavIcon d="M12 9a3 3 0 100 6 3 3 0 000-6M19 12l2-1-2-4-2 1a7 7 0 00-2-1l-1-2H10L9 5a7 7 0 00-2 1L5 5 3 9l2 1v2l-2 1 2 4 2-1a7 7 0 002 1l1 2h4l1-2a7 7 0 002-1l2 1 2-4-2-1z" />
      ),
    },
  ];
}

export function AdminShell() {
  const [ tab, setTab ] = useState< Tab >( initialTab );

  useEffect( () => {
    window.dispatchEvent( new CustomEvent( 'markaroo:admin-ready', { detail: { tab } } ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  function switchTab( t: Tab ) {
    setTab( t );
    window.location.hash = t;
  }

  const tabs = getTabs();

  return (
    <div className="markaroo-app markaroo-admin">
      <header className="markaroo-topnav">
        <div className="markaroo-topnav__brand">
          <span className="markaroo-topnav__logo">●</span>
          <span className="markaroo-topnav__name">Markaroo</span>
        </div>

        <nav
          className="markaroo-topnav__nav"
          aria-label={ __( 'Markaroo navigation', 'markaroo' ) }
        >
          { tabs.map( ( t ) => (
            <button
              key={ t.id }
              type="button"
              className={ `markaroo-topnav__item${
                tab === t.id ? ' markaroo-topnav__item--active' : ''
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
          className="markaroo-topnav__help"
          href="https://devemon.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          { __( 'Help & docs', 'markaroo' ) }
        </a>
      </header>

      <main className="markaroo-admin__main">
        { tab === 'overview' && <OverviewView /> }
        { tab === 'tasks' && <TaskListView /> }
        { tab === 'approvals' && <ApprovalsView /> }
        { tab === 'settings' && <SettingsView /> }
      </main>
    </div>
  );
}
