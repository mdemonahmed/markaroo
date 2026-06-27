import { useState } from '@wordpress/element';
import { useWidget, useWidgetDispatch } from './store/WidgetContext';
import type { FeedbackItem } from './types';

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

function FeedbackRow( {
  item,
  number,
  active,
  onOpen,
}: {
  item: FeedbackItem;
  number: number;
  active: boolean;
  onOpen: () => void;
} ) {
  const label = item.title?.trim() || item.comment;
  const dotColor =
    item.status === 'resolved' ? '#22c55e' : PRIORITY_COLORS[ item.priority ] ?? '#6366f1';
  return (
    <button
      className={ `markaroo-feedback-row${ active ? ' markaroo-feedback-row--active' : '' }` }
      type="button"
      onClick={ onOpen }
      aria-pressed={ active }
    >
      <span className="markaroo-feedback-row__badge">{ number }</span>
      <span className="markaroo-feedback-row__dot" style={ { backgroundColor: dotColor } } />
      <span className="markaroo-feedback-row__text">{ label.slice( 0, 80 ) }</span>
      { item.status === 'resolved' && (
        <span className="markaroo-feedback-row__resolved" aria-label="Resolved">
          ✓
        </span>
      ) }
    </button>
  );
}

export function FeedbackPanel() {
  const { enabled, panelOpen, feedbacks, mode, captureState, activePinId } = useWidget();
  const dispatch = useWidgetDispatch();

  const config = window.markarooConfig;
  const canCreate = config?.currentUser?.canCreate ?? false;
  const shareCanComment = config?.shareRights?.canComment ?? false;
  const showNewButton = ( canCreate || shareCanComment ) && mode === 'comment';

  const [ tab, setTab ] = useState< 'open' | 'resolved' >( 'open' );

  if ( 'clean' === mode || ! enabled || ! panelOpen || captureState === 'active' ) {
    return null;
  }

  const open = feedbacks.filter( ( f ) => f.status !== 'resolved' );
  const resolved = feedbacks.filter( ( f ) => f.status === 'resolved' );
  const visible = tab === 'open' ? open : resolved;
  const pageCount = feedbacks.length > 0 ? 1 : 0;

  function openPin( id: number ) {
    dispatch( { type: 'SET_ACTIVE_PIN', id: activePinId === id ? null : id } );
    window.dispatchEvent( new CustomEvent( 'markaroo:pin-opened', { detail: { id } } ) );
  }

  return (
    <aside className="markaroo-panel" aria-label="Feedback panel">
      <div className="markaroo-panel__header">
        <h2 className="markaroo-panel__title">Pins</h2>
        <div className="markaroo-panel__header-actions">
          { showNewButton && (
            <button
              className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
              type="button"
              onClick={ () => dispatch( { type: 'START_CAPTURE' } ) }
            >
              + New
            </button>
          ) }
          <button
            className="markaroo-panel__hide"
            type="button"
            onClick={ () => dispatch( { type: 'CLOSE_PANEL' } ) }
          >
            Hide panel
          </button>
          <button
            className="markaroo-panel__close"
            type="button"
            aria-label="Close"
            onClick={ () => dispatch( { type: 'CLOSE_PANEL' } ) }
          >
            &times;
          </button>
        </div>
      </div>

      <div className="markaroo-panel__tabs" role="tablist">
        <button
          className={ `markaroo-panel__tab${
            tab === 'open' ? ' markaroo-panel__tab--active' : ''
          }` }
          role="tab"
          aria-selected={ tab === 'open' }
          type="button"
          onClick={ () => setTab( 'open' ) }
        >
          Unresolved <span className="markaroo-panel__tab-count">{ open.length }</span>
        </button>
        <button
          className={ `markaroo-panel__tab${
            tab === 'resolved' ? ' markaroo-panel__tab--active' : ''
          }` }
          role="tab"
          aria-selected={ tab === 'resolved' }
          type="button"
          onClick={ () => setTab( 'resolved' ) }
        >
          Resolved <span className="markaroo-panel__tab-count">{ resolved.length }</span>
        </button>
      </div>

      <div className="markaroo-panel__pages">
        <span className="markaroo-panel__pages-label">Pages</span>
        <span className="markaroo-panel__pages-pill">
          View pages <span className="markaroo-panel__pages-count">{ pageCount }</span>
        </span>
      </div>

      <div className="markaroo-panel__body" role="tabpanel">
        { visible.length === 0 ? (
          <p className="markaroo-panel__empty">
            { tab === 'open' ? 'No open feedback yet.' : 'No resolved feedback.' }
          </p>
        ) : (
          <div className="markaroo-feedback-list">
            { visible.map( ( item ) => (
              <FeedbackRow
                key={ item.id }
                item={ item }
                number={ feedbacks.indexOf( item ) + 1 }
                active={ activePinId === item.id }
                onOpen={ () => openPin( item.id ) }
              />
            ) ) }
          </div>
        ) }
      </div>

      <div className="markaroo-panel__footer">
        <button
          className="markaroo-panel__exit"
          type="button"
          onClick={ () => dispatch( { type: 'DISABLE_SESSION' } ) }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          Exit Feedback
        </button>
      </div>
    </aside>
  );
}
