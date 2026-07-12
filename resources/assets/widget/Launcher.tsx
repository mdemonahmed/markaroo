import { useWidget, useWidgetDispatch } from './store/WidgetContext';

export function Launcher() {
  const { mode, enabled, captureState, panelOpen } = useWidget();
  const dispatch = useWidgetDispatch();

  const config = window.markarooConfig;
  const canComment = ( config?.currentUser?.canCreate || config?.shareRights?.canComment ) ?? false;

  // Clean mode (or no comment rights) — no launcher.
  if ( 'clean' === mode || ! canComment ) {
    return null;
  }

  const isCapturing = 'active' === captureState;
  const label = enabled
    ? config?.i18n?.pins ?? 'Pins'
    : config?.i18n?.feedback ?? 'Feedback';

  function handleClick() {
    if ( isCapturing ) {
      return;
    }
    if ( ! enabled ) {
      // First click — enter feedback mode (reveals pins + opens panel).
      dispatch( { type: 'ENABLE_SESSION' } );
      return;
    }
    // Already in feedback mode — toggle the list panel.
    dispatch( { type: 'TOGGLE_PANEL' } );
  }

  return (
    <button
      className={ `markaroo-launcher${ enabled ? ' markaroo-launcher--active' : '' }${
        isCapturing ? ' markaroo-launcher--hidden' : ''
      }` }
      onClick={ handleClick }
      aria-label={ label }
      aria-expanded={ enabled ? panelOpen : false }
      type="button"
    >
      { enabled ? (
        // List icon — feedback session active.
        <svg
          className="markaroo-launcher__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ) : (
        // Markaroo mark — idle.
        <svg
          className="markaroo-launcher__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M25.9776 0.894851C34.308 0.398992 42.8831 -0.361666 50.7904 2.85027C71.8554 11.4067 177.357 106.105 201.791 127.376C215.581 139.381 230.903 156.017 247.714 163.507C256.743 167.53 265.814 164.497 274.065 160.032C287.466 152.782 299.627 139.949 311.102 129.988C339.475 105.355 440.305 10.755 462.258 2.97249C471.377 -0.260137 482.972 -1.5402 491.996 2.67507C499.76 6.30171 504.612 13.7763 507.348 21.5264C509.597 27.8965 510.595 34.6977 510.861 41.4134C511.839 66.0446 510.728 91.1878 510.702 115.879L510.633 269.363L510.569 412.202C510.506 444.706 522.597 508.517 477.575 510.552C427.272 512.826 376.539 511.496 326.161 511.44C269.463 511.378 323.803 443.693 336.739 422.312C348.724 402.568 369.838 370.226 376.288 348.846C384.789 320.247 381.362 289.506 366.76 263.389C350.598 234.08 323.247 212.267 290.713 202.743C259.846 193.887 226.643 197.648 198.638 213.171C170.825 228.273 149.016 254.245 139.226 284.946C116.702 355.579 178.147 413.363 207.732 472.114C217.272 491.055 220.974 513.127 191.604 511.926C136.13 509.658 80.4128 514.698 25.4329 509.683C-7.42013 506.321 0.958875 428.034 0.949149 399.909L0.99941 253.129L1.12098 121.573C0.968606 93.0338 -1.86492 52.5726 3.8605 24.0967C6.20286 12.443 15.4994 6.02577 25.9776 0.894851Z" />
          <path d="M248.45 273.261C274.578 268.204 299.955 284.834 305.22 310.462C310.483 336.089 293.655 361.073 267.572 366.353C241.329 371.663 215.688 355.019 210.392 329.233C205.095 303.447 222.161 278.349 248.45 273.261Z" />
        </svg>
      ) }
      <span className="markaroo-launcher__label">{ label }</span>
    </button>
  );
}
