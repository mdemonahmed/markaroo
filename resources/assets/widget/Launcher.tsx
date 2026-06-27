import { useWidget, useWidgetDispatch } from './store/WidgetContext';

export function Launcher() {
  const { mode, captureState } = useWidget();
  const dispatch = useWidgetDispatch();

  const config = window.markarooConfig;
  const canComment = ( config?.currentUser?.canCreate || config?.shareRights?.canComment ) ?? false;

  // Clean mode (or no comment rights) — no launcher.
  if ( 'clean' === mode || ! canComment ) {
    return null;
  }

  const label = config?.i18n?.feedback ?? 'Feedback';
  const isCapturing = 'active' === captureState;

  function handleClick() {
    if ( isCapturing ) {
      return;
    }
    // Enter feedback mode: drag a region / drop a pin.
    dispatch( { type: 'START_CAPTURE' } );
  }

  return (
    <button
      className={ `markaroo-launcher${ isCapturing ? ' markaroo-launcher--hidden' : '' }` }
      onClick={ handleClick }
      aria-label={ label }
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
