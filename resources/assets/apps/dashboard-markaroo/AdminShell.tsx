import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { OverviewView } from './views/OverviewView';
import { TaskListView } from './views/TaskListView';
import { StatusBoardView } from './views/StatusBoardView';
import { SettingsView } from './views/SettingsView';
import { ApprovalsView } from './views/ApprovalsView';
import { DevelopersView } from './views/DevelopersView';
import { EmailNotificationView } from './views/EmailNotificationView';
import { PluginFeedbackView } from './views/PluginFeedbackView';
import { HowToUseView } from './views/HowToUseView';

type Tab =
  | 'overview'
  | 'tasks'
  | 'board'
  | 'approvals'
  | 'email-notification'
  | 'settings'
  | 'developers'
  | 'plugin-feedback'
  | 'how-to-use';

const TAB_IDS: Tab[] = [
  'overview',
  'tasks',
  'board',
  'approvals',
  'email-notification',
  'settings',
  'developers',
  'plugin-feedback',
  'how-to-use',
];

interface Route {
  tab: Tab;
  params: URLSearchParams;
}

// Hash routes are `#tab` or `#tab?key=value` (e.g. #tasks?status=open).
function parseHash(): Route {
  const raw = window.location.hash.replace( '#', '' );
  const [ tab, query ] = raw.split( '?' );
  return {
    tab: TAB_IDS.includes( tab as Tab ) ? ( tab as Tab ) : 'overview',
    params: new URLSearchParams( query ?? '' ),
  };
}

interface TabDef {
  id: Tab;
  label: string;
  icon: JSX.Element;
}

function BrandMark() {
  return (
    <svg
      className="markaroo-topnav__logo"
      viewBox="0 0 1309 243"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      role="img"
      aria-label="Markaroo"
    >
      <g clipPath="url(#clip0_1_44)">
        <path
          d="M12.3172 1.16672C16.1715 0.932829 20.139 0.574035 23.7975 2.08907C33.5437 6.12503 82.3567 50.7931 93.6615 60.8265C100.042 66.4891 107.131 74.336 114.909 77.8691C119.086 79.7667 123.283 78.336 127.101 76.2298C133.301 72.81 138.928 66.7571 144.237 62.0583C157.364 50.4395 204.016 5.81766 214.173 2.14672C218.392 0.621925 223.757 0.0181326 227.932 2.00643C231.524 3.71707 233.769 7.24277 235.035 10.8984C236.075 13.9031 236.537 17.1111 236.66 20.2789C237.113 31.8971 236.599 43.7569 236.587 55.4033L236.555 127.8L236.525 195.175C236.496 210.507 242.09 240.606 221.26 241.566C197.986 242.639 174.513 242.011 151.204 241.985C124.972 241.956 150.113 210.029 156.098 199.944C161.644 190.631 171.412 175.376 174.397 165.291C178.33 151.801 176.744 137.301 169.988 124.982C162.511 111.157 149.856 100.869 134.803 96.3762C120.522 92.1991 105.16 93.9727 92.2027 101.295C79.3342 108.418 69.2437 120.669 64.7145 135.151C54.2932 168.467 82.722 195.723 96.4102 223.435C100.824 232.37 102.537 242.781 88.9485 242.214C63.282 241.144 37.503 243.521 12.0652 241.156C-3.135 239.57 0.741742 202.643 0.737242 189.377L0.760497 120.143L0.816745 58.089C0.746244 44.6276 -0.564754 25.5425 2.08425 12.1108C3.168 6.61383 7.46924 3.58692 12.3172 1.16672Z"
          fill="#5B4FCF"
        />
        <path
          d="M455.45 52.7906L485.136 52.7185L485.142 202.797C474.986 202.845 464.828 202.841 454.672 202.784L454.671 153.81L454.501 109.528C438.363 135.548 422.422 161.691 406.682 187.955L393.428 188.069C377.493 161.643 361.289 135.382 344.818 109.288C345.692 139.111 344.959 172.768 344.969 202.823L314.801 202.845L314.871 52.7778L344.136 52.747L400.141 144.363L455.45 52.7906Z"
          fill="#030D25"
        />
        <path
          d="M553.154 89.8024C569.023 86.0718 585.872 94.4892 596.859 105.396C596.508 101.987 596.665 95.8988 596.66 92.2726C606.332 92.1203 616.343 92.3072 626.041 92.3642C624.767 126.601 625.711 168.135 625.949 202.841L596.707 202.829C596.715 200.094 597.107 192.283 595.981 190.467L594.779 191.476C577.187 209.425 545.811 209.851 527.118 195.007C487.536 163.576 501.408 97.6755 553.154 89.8024ZM572.641 178.299C589.576 174.198 600.046 157.205 596.101 140.219C592.157 123.235 575.272 112.604 558.266 116.398C541.041 120.241 530.252 137.405 534.248 154.608C538.244 171.811 555.489 182.453 572.641 178.299Z"
          fill="#030D25"
        />
        <path
          d="M896.722 89.7881C913.275 86.7076 928.44 93.8181 939.975 105.16V92.3514C949.245 92.0444 959.588 92.2899 969.03 92.1863L969.038 202.781L940.02 202.826L939.84 189.795L935.332 194.351C929.1 199.786 921.472 203.378 913.312 204.722C839.827 217.485 820.057 102.449 896.722 89.7881ZM915.24 178.528C932.467 174.817 943.388 157.79 939.593 140.568C935.798 123.346 918.728 112.499 901.545 116.385C884.475 120.243 873.735 137.176 877.5 154.276C881.272 171.375 898.132 182.213 915.24 178.528Z"
          fill="#030D25"
        />
        <path
          d="M1117.17 89.978C1148.83 85.5622 1178.06 107.707 1182.4 139.403C1186.75 171.098 1164.56 200.304 1132.88 204.587C1101.3 208.857 1072.22 186.73 1067.89 155.129C1063.56 123.528 1085.6 94.3811 1117.17 89.978ZM1131.32 178.008C1148.29 174.686 1159.32 158.202 1155.94 141.236C1152.57 124.269 1136.05 113.279 1119.12 116.719C1102.26 120.141 1091.34 136.565 1094.71 153.448C1098.07 170.332 1114.44 181.313 1131.32 178.008Z"
          fill="#030D25"
        />
        <path
          d="M736.035 49.2379C745.867 49.0578 756.12 49.1892 765.983 49.1704L766.005 143.278C779.632 126.729 796.035 108.446 810.397 92.4169C822.187 91.974 836.085 92.2232 847.807 92.4694L799.792 144.998C807.682 155.052 821.28 169.538 830.017 179.449C836.94 187.19 843.795 194.995 850.575 202.863C838.642 202.585 825.255 202.865 813.233 202.874L765.922 148.915C766.35 166.643 765.877 184.933 766.23 202.859L735.997 202.844C736.935 152.719 736.162 99.5687 736.035 49.2379Z"
          fill="#030D25"
        />
        <path
          d="M1244.58 89.8311C1258.92 88.2998 1273.08 91.3683 1284.91 99.7909C1297.22 108.612 1305.48 122.001 1307.86 136.965C1313.6 171.106 1293.14 198.545 1259.29 204.131C1257.47 174.593 1274.18 178.378 1281.14 157.679C1283.89 149.638 1283.33 140.83 1279.59 133.198C1274.95 123.852 1268.34 119.544 1258.85 116.342C1249.34 114.045 1238.43 116.746 1231.29 123.412C1217.66 136.14 1217.09 153.213 1227.76 168.049C1232.74 174.974 1239.67 180.88 1242.85 188.918C1244.78 193.734 1244.29 198.901 1244.17 204.014C1233.95 203.004 1225.2 199.828 1216.97 193.599C1205.04 184.483 1197.22 170.996 1195.23 156.109C1190.67 123.183 1211.34 94.3024 1244.58 89.8311Z"
          fill="#030D25"
        />
        <path
          d="M1045.51 91.2436C1052.2 90.6544 1056.08 90.9284 1062.75 91.6242C1063.01 100.782 1062.81 110.76 1062.8 119.979C1058.74 119.162 1054.62 118.71 1050.49 118.629C1037.39 118.42 1023.5 126.457 1022.1 139.548C1019.99 159.163 1021.15 182.944 1021.15 202.777C1012 202.892 1002.71 202.815 993.562 202.828C992.31 202.833 992.745 202.918 991.65 202.17C991.11 165.89 991.552 128.653 991.582 92.3028C1001.31 92.1819 1011.03 92.2059 1020.76 92.3741L1020.73 108.462C1027.55 97.8948 1033.51 94.12 1045.51 91.2436Z"
          fill="#030D25"
        />
        <path
          d="M703.552 91.2585C709.365 90.6153 713.978 91.0228 719.73 91.7517L719.835 120.159C715.463 119.146 710.993 118.63 706.508 118.622C693.533 118.675 680.813 127.08 679.305 139.916C677.01 159.512 678.142 183.046 678.24 202.811L650.213 202.835L649.275 202.606C648.308 200.364 648.803 103.176 648.78 92.4167C658.44 92.0482 668.43 92.2561 678.128 92.3387L678.052 109.212C678.577 108.283 679.133 107.372 679.718 106.479C685.958 96.9332 692.737 93.5044 703.552 91.2585Z"
          fill="#030D25"
        />
        <path
          d="M115.249 129.639C127.338 127.253 139.079 135.097 141.515 147.186C143.951 159.274 136.165 171.058 124.097 173.549C111.955 176.054 100.091 168.203 97.641 156.04C95.19 143.877 103.086 132.039 115.249 129.639Z"
          fill="#5B4FCF"
        />
        <path
          d="M1248.05 134.891C1255.09 132.863 1262.46 136.868 1264.59 143.884C1266.72 150.899 1262.83 158.327 1255.85 160.562C1251.24 162.038 1246.2 160.915 1242.65 157.625C1239.11 154.336 1237.6 149.388 1238.72 144.68C1239.84 139.97 1243.4 136.23 1248.05 134.891Z"
          fill="#5B4FCF"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_44">
          <rect width="1309" height="243" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
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
      // Home
      icon: <NavIcon d="M3 10.5L12 3l9 7.5M5.5 8.5V21h13V8.5M9.5 21v-6h5v6" />,
    },
    {
      id: 'tasks',
      label: __( 'All Feedback', 'markaroo' ),
      // Chat bubble with lines
      icon: <NavIcon d="M21 12a8 8 0 01-8 8H4l2.4-2.7A8 8 0 1121 12zM8.5 10h7M8.5 13.5h4.5" />,
    },
    {
      id: 'board',
      label: __( 'Board', 'markaroo' ),
      // Kanban columns
      icon: <NavIcon d="M4 4h4.5v16H4zM9.75 4h4.5v11h-4.5zM15.5 4H20v13.5h-4.5z" />,
    },
    {
      id: 'approvals',
      label: __( 'Approvals', 'markaroo' ),
      // Check badge
      icon: (
        <NavIcon d="M9 12.5l2 2 4-4.5M12 2.5l2.4 2 3.1.2 1 3 2.5 1.9-1 3 1 3-2.5 1.9-1 3-3.1.2-2.4 2-2.4-2-3.1-.2-1-3L2 15.6l1-3-1-3 2.5-1.9 1-3 3.1-.2z" />
      ),
    },
    {
      id: 'email-notification',
      label: __( 'Email Notification', 'markaroo' ),
      // Envelope
      icon: <NavIcon d="M3 6h18v12H3zM3 7l9 6.5L21 7" />,
    },
    {
      id: 'settings',
      label: __( 'Settings', 'markaroo' ),
      // Gear
      icon: (
        <NavIcon d="M12 9a3 3 0 100 6 3 3 0 000-6M19 12l2-1-2-4-2 1a7 7 0 00-2-1l-1-2H10L9 5a7 7 0 00-2 1L5 5 3 9l2 1v2l-2 1 2 4 2-1a7 7 0 002 1l1 2h4l1-2a7 7 0 002-1l2 1 2-4-2-1z" />
      ),
    },
    {
      id: 'developers',
      label: __( 'Developers', 'markaroo' ),
      // Code brackets
      icon: <NavIcon d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" />,
    },
    {
      id: 'plugin-feedback',
      label: __( 'Give us Feedback', 'markaroo' ),
      // Paper plane
      icon: <NavIcon d="M21 3L10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" />,
    },
    {
      id: 'how-to-use',
      label: __( 'How to Use', 'markaroo' ),
      // Open book
      icon: (
        <NavIcon d="M12 6.5C10.5 5 8.5 4.5 6 4.5c-1.2 0-2.3.2-3 .5v14c.7-.3 1.8-.5 3-.5 2.5 0 4.5.5 6 2 1.5-1.5 3.5-2 6-2 1.2 0 2.3.2 3 .5v-14c-.7-.3-1.8-.5-3-.5-2.5 0-4.5.5-6 2zM12 6.5v14" />
      ),
    },
  ];
}

export function AdminShell() {
  const [ route, setRoute ] = useState< Route >( parseHash );
  const { tab, params } = route;

  useEffect( () => {
    window.dispatchEvent( new CustomEvent( 'markaroo:admin-ready', { detail: { tab } } ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the view in sync with the hash so stat-box deep links
  // (#tasks?status=open) work from anywhere.
  useEffect( () => {
    const onHash = () => setRoute( parseHash() );
    window.addEventListener( 'hashchange', onHash );
    return () => window.removeEventListener( 'hashchange', onHash );
  }, [] );

  function switchTab( t: Tab ) {
    window.location.hash = t; // hashchange listener updates state
  }

  const tabs = getTabs();

  return (
    <div className="markaroo-app markaroo-admin">
      <header className="markaroo-topnav">
        <div className="markaroo-topnav__brand">
          <BrandMark />
          <span className="markaroo-topnav__name sr_only">Markaroo</span>
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
        { tab === 'tasks' && (
          <TaskListView
            key={ params.toString() }
            initialStatus={ params.get( 'status' ) ?? undefined }
            initialPageKey={ params.get( 'page_key' ) ?? undefined }
          />
        ) }
        { tab === 'board' && <StatusBoardView /> }
        { tab === 'approvals' && <ApprovalsView /> }
        { tab === 'email-notification' && <EmailNotificationView /> }
        { tab === 'settings' && <SettingsView /> }
        { tab === 'developers' && <DevelopersView /> }
        { tab === 'plugin-feedback' && <PluginFeedbackView /> }
        { tab === 'how-to-use' && <HowToUseView /> }
      </main>
    </div>
  );
}
