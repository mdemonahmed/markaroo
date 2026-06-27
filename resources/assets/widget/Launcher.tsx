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
        // Chat bubble — idle.
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ) }
      <span className="markaroo-launcher__label">{ label }</span>
    </button>
  );
}
