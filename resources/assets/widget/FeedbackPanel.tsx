import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useWidget, useWidgetDispatch } from './store/WidgetContext';
import { apiFetch } from './api';
import { Avatar } from './support/Avatar';
import { timeAgo, absoluteTime } from './support/timeAgo';
import type { FeedbackItem } from './types';

function FeedbackRow( {
  item,
  number,
  active,
  canResolve,
  onOpen,
  onResolve,
}: {
  item: FeedbackItem;
  number: number;
  active: boolean;
  canResolve: boolean;
  onOpen: () => void;
  onResolve: () => void;
} ) {
  const resolved = item.status === 'resolved';
  const title = item.title?.trim();
  const snippet = item.comment.slice( 0, 80 );

  return (
    <div
      className={ `markaroo-feedback-row${ active ? ' markaroo-feedback-row--active' : '' }${
        resolved ? ' markaroo-feedback-row--resolved' : ''
      }` }
    >
      <button
        className="markaroo-feedback-row__main"
        type="button"
        onClick={ onOpen }
        aria-pressed={ active }
      >
        <span className="markaroo-feedback-row__top">
          <Avatar name={ item.author } src={ item.avatar } size={ 24 } />
          <span className="markaroo-feedback-row__ref">
            { `#${ number } · ${ __( 'Page', 'markaroo' ) }` }
          </span>
        </span>
        <span className="markaroo-feedback-row__who">
          <span className="markaroo-feedback-row__author">{ item.author }</span>
          <span className="markaroo-feedback-row__time" title={ absoluteTime( item.created_at ) }>
            { timeAgo( item.created_at ) }
          </span>
        </span>
        <span className="markaroo-feedback-row__text">{ title || snippet }</span>
      </button>
      { canResolve && (
        <button
          className={ `markaroo-feedback-row__resolve${ resolved ? ' is-resolved' : '' }` }
          type="button"
          aria-label={ resolved ? __( 'Unresolve', 'markaroo' ) : __( 'Resolve', 'markaroo' ) }
          aria-pressed={ resolved }
          onClick={ ( e ) => {
            e.stopPropagation();
            onResolve();
          } }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
        </button>
      ) }
    </div>
  );
}

export function FeedbackPanel() {
  const { enabled, panelOpen, feedbacks, mode, captureState, activePinId } = useWidget();
  const dispatch = useWidgetDispatch();

  const config = window.markarooConfig;
  const canCreate = config?.currentUser?.canCreate ?? false;
  const shareCanComment = config?.shareRights?.canComment ?? false;
  const showNewButton =
    ( canCreate || shareCanComment ) && mode === 'comment' && captureState !== 'active';
  const canResolve = ( config?.currentUser?.canResolve || config?.currentUser?.canManage ) ?? false;

  const [ tab, setTab ] = useState< 'open' | 'resolved' >( 'open' );

  if ( 'clean' === mode || ! enabled || ! panelOpen ) {
    return null;
  }

  const open = feedbacks.filter( ( f ) => f.status !== 'resolved' );
  const resolved = feedbacks.filter( ( f ) => f.status === 'resolved' );
  const visible = tab === 'open' ? open : resolved;

  function openPin( id: number ) {
    dispatch( { type: 'SET_ACTIVE_PIN', id: activePinId === id ? null : id } );
    window.dispatchEvent( new CustomEvent( 'markaroo:pin-opened', { detail: { id } } ) );
  }

  async function toggleResolve( item: FeedbackItem ) {
    const ep =
      item.status === 'resolved'
        ? `feedback/${ item.id }/unresolve`
        : `feedback/${ item.id }/resolve`;
    const updated = await apiFetch< FeedbackItem >( ep, { method: 'POST', body: '' } ).catch(
      () => null
    );
    if ( updated ) {
      dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
      window.dispatchEvent(
        new CustomEvent( 'markaroo:pin-resolved', {
          detail: { id: item.id, status: updated.status },
        } )
      );
    }
  }

  return (
    <aside className="markaroo-panel" aria-label={ __( 'Feedback panel', 'markaroo' ) }>
      <div className="markaroo-panel__header">
        <h2 className="markaroo-panel__title">{ __( 'Comments', 'markaroo' ) }</h2>
        <div className="markaroo-panel__header-actions">
          { showNewButton && (
            <button
              className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
              type="button"
              onClick={ () => dispatch( { type: 'START_CAPTURE' } ) }
            >
              { __( '+ New', 'markaroo' ) }
            </button>
          ) }
          <button
            className="markaroo-panel__close"
            type="button"
            aria-label={ __( 'Close', 'markaroo' ) }
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
          { __( 'Unresolved', 'markaroo' ) }{ ' ' }
          <span className="markaroo-panel__tab-count">{ open.length }</span>
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
          { __( 'Resolved', 'markaroo' ) }{ ' ' }
          <span className="markaroo-panel__tab-count">{ resolved.length }</span>
        </button>
      </div>

      <div className="markaroo-panel__body" role="tabpanel">
        { visible.length === 0 ? (
          <p className="markaroo-panel__empty">
            { tab === 'open'
              ? __( 'No open feedback yet.', 'markaroo' )
              : __( 'No resolved feedback.', 'markaroo' ) }
          </p>
        ) : (
          <div className="markaroo-feedback-list">
            { visible.map( ( item ) => (
              <FeedbackRow
                key={ item.id }
                item={ item }
                number={ feedbacks.indexOf( item ) + 1 }
                active={ activePinId === item.id }
                canResolve={ canResolve }
                onOpen={ () => openPin( item.id ) }
                onResolve={ () => toggleResolve( item ) }
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
          { __( 'Exit Feedback', 'markaroo' ) }
        </button>
      </div>
    </aside>
  );
}
