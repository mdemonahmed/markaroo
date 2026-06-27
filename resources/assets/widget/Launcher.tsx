import { useWidget, useWidgetDispatch } from './store/WidgetContext';

export function Launcher() {
  const { mode, panelOpen, captureState } = useWidget();
  const dispatch = useWidgetDispatch();

  // Clean mode — no visible UI.
  if ( 'clean' === mode ) {
    return null;
  }

  const label = window.markarooConfig?.i18n?.feedback ?? 'Feedback';
  const isCapturing = 'active' === captureState;

  function handleClick() {
    if ( isCapturing ) {
      return;
    }
    dispatch( { type: 'TOGGLE_PANEL' } );
  }

  return (
    <button
      className={ `markaroo-launcher${ panelOpen ? ' markaroo-launcher--active' : '' }${
        isCapturing ? ' markaroo-launcher--hidden' : ''
      }` }
      onClick={ handleClick }
      aria-label={ label }
      aria-expanded={ panelOpen }
      type="button"
    >
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
      <span className="markaroo-launcher__label">{ label }</span>
    </button>
  );
}
