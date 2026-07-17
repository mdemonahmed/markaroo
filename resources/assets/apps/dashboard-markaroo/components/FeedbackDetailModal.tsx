import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { X, Check, RotateCcw, ExternalLink, Send } from 'lucide-react';
import type { FeedbackItem, ReplyItem, AttachmentMeta } from '../../../widget/types';
import { renderMarkdown } from '../../../widget/support/renderMarkdown';
import {
  fetchFeedbackDetail,
  patchFeedback,
  setStatus,
  approveFeedback,
  reopenFeedback,
  postReply,
  fetchUsers,
  type WPUser,
} from '../api';

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

const PRIORITIES = [ 'urgent', 'high', 'normal', 'low' ];

function isImage( a: AttachmentMeta ): boolean {
  return a.mime.startsWith( 'image/' );
}

interface Props {
  id: number;
  showApprovalActions?: boolean;
  onClose: () => void;
  /** Called with the fresh item after any persisted change (or null after delete). */
  onChanged: ( item: FeedbackItem | null ) => void;
}

export function FeedbackDetailModal( { id, showApprovalActions, onClose, onChanged }: Props ) {
  const config = window.markarooConfig;
  const canApprove = !! config.currentUser?.canApprove;
  const statusList = config.statusList ?? [
    { value: 'open', label: 'Open' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const dialogRef = useRef< HTMLDivElement >( null );
  const [ item, setItem ] = useState< FeedbackItem | null >( null );
  const [ replies, setReplies ] = useState< ReplyItem[] >( [] );
  const [ users, setUsers ] = useState< WPUser[] >( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );
  const [ busy, setBusy ] = useState( false );
  const [ replyText, setReplyText ] = useState( '' );

  useEffect( () => {
    fetchFeedbackDetail( id )
      .then( ( data ) => {
        setItem( data );
        setReplies( data.replies ?? [] );
      } )
      .catch( () => setError( __( 'Could not load the feedback item.', 'markaroo' ) ) )
      .finally( () => setLoading( false ) );
    fetchUsers()
      .then( setUsers )
      .catch( () => null );
  }, [ id ] );

  // Escape closes; body scroll locks while open.
  useEffect( () => {
    function onKey( e: KeyboardEvent ) {
      if ( e.key === 'Escape' ) {
        onClose();
      }
    }
    document.addEventListener( 'keydown', onKey );
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener( 'keydown', onKey );
      document.body.style.overflow = prevOverflow;
    };
  }, [ onClose ] );

  function applyUpdate( updated: FeedbackItem ) {
    setItem( updated );
    onChanged( updated );
  }

  async function run( action: () => Promise< FeedbackItem > ) {
    setBusy( true );
    setError( null );
    try {
      applyUpdate( await action() );
    } catch {
      setError( __( 'Action failed. Please try again.', 'markaroo' ) );
    } finally {
      setBusy( false );
    }
  }

  async function submitReply( e: React.FormEvent ) {
    e.preventDefault();
    if ( ! replyText.trim() || busy ) {
      return;
    }
    setBusy( true );
    setError( null );
    try {
      const reply = await postReply( id, replyText.trim() );
      setReplies( ( prev ) => [ ...prev, reply ] );
      setReplyText( '' );
    } catch {
      setError( __( 'Could not post the reply.', 'markaroo' ) );
    } finally {
      setBusy( false );
    }
  }

  const pageUrl =
    item?.page_url || ( item ? config.restUrl.replace( /\/wp-json\/?$/, '' ) + item.page_key : '' );

  return (
    <div
      className="markaroo-detail-overlay"
      role="presentation"
      onMouseDown={ ( e ) => {
        if ( e.target === e.currentTarget ) {
          onClose();
        }
      } }
    >
      <div
        ref={ dialogRef }
        className="markaroo-detail"
        role="dialog"
        aria-modal="true"
        aria-label={ `${ __( 'Feedback', 'markaroo' ) } #${ id }` }
        tabIndex={ -1 }
      >
        <div className="markaroo-detail__head">
          <span className="markaroo-detail__id">#{ id }</span>
          { item && (
            <span
              className="markaroo-admin-badge"
              style={ { backgroundColor: PRIORITY_COLORS[ item.priority ] ?? '#9ca3af' } }
            >
              { item.priority }
            </span>
          ) }
          { item && (
            <span className={ `markaroo-admin-status markaroo-admin-status--${ item.status }` }>
              { item.status_label || item.status }
            </span>
          ) }
          <button
            type="button"
            className="markaroo-detail__close"
            aria-label={ __( 'Close', 'markaroo' ) }
            onClick={ onClose }
          >
            <X size={ 18 } strokeWidth={ 2 } />
          </button>
        </div>

        { error && <div className="markaroo-admin__error-box">{ error }</div> }
        { loading && <p className="markaroo-admin__loading">{ __( 'Loading…', 'markaroo' ) }</p> }

        { item && (
          <div className="markaroo-detail__body">
            { item.title && <h3 className="markaroo-detail__title">{ item.title }</h3> }

            <div className="markaroo-detail__meta">
              <span>{ item.author }</span>
              <span title={ item.created_at }>
                { new Date( item.created_at ).toLocaleString() }
              </span>
              { pageUrl && (
                <a
                  className="markaroo-detail__pagelink"
                  href={ pageUrl }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={ 13 } strokeWidth={ 2 } />
                  { item.page_key }
                </a>
              ) }
            </div>

            { item.comment && (
              <div className="markaroo-detail__comment">{ renderMarkdown( item.comment ) }</div>
            ) }

            { item.tags.length > 0 && (
              <div className="markaroo-detail__tags">
                { item.tags.map( ( t ) => (
                  <span key={ t } className="markaroo-detail__tag">
                    { t }
                  </span>
                ) ) }
              </div>
            ) }

            <div className="markaroo-detail__controls">
              <label htmlFor="markaroo-detail-status">
                { __( 'Status', 'markaroo' ) }
                <select
                  id="markaroo-detail-status"
                  value={ item.status }
                  disabled={ busy }
                  onChange={ ( e ) => run( () => setStatus( id, e.target.value ) ) }
                >
                  { statusList.map( ( s ) => (
                    <option key={ s.value } value={ s.value }>
                      { s.label }
                    </option>
                  ) ) }
                </select>
              </label>

              <label htmlFor="markaroo-detail-priority">
                { __( 'Priority', 'markaroo' ) }
                <select
                  id="markaroo-detail-priority"
                  value={ item.priority }
                  disabled={ busy }
                  onChange={ ( e ) =>
                    run( () => patchFeedback( id, { priority: e.target.value } ) )
                  }
                >
                  { PRIORITIES.map( ( p ) => (
                    <option key={ p } value={ p }>
                      { p }
                    </option>
                  ) ) }
                </select>
              </label>

              <label htmlFor="markaroo-detail-assignee">
                { __( 'Assignee', 'markaroo' ) }
                <select
                  id="markaroo-detail-assignee"
                  value={ item.assigned_to_id }
                  disabled={ busy }
                  onChange={ ( e ) => {
                    const uid = Number( e.target.value );
                    run( () =>
                      patchFeedback( id, {
                        assigned_to_id: uid,
                        assigned_to_name: users.find( ( u ) => u.id === uid )?.name ?? '',
                      } )
                    );
                  } }
                >
                  <option value={ 0 }>{ __( 'Unassigned', 'markaroo' ) }</option>
                  { users.map( ( u ) => (
                    <option key={ u.id } value={ u.id }>
                      { u.name }
                    </option>
                  ) ) }
                </select>
              </label>
            </div>

            { showApprovalActions && (
              <div className="markaroo-detail__approval">
                { canApprove && (
                  <button
                    type="button"
                    className="markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm"
                    disabled={ busy }
                    onClick={ () => run( () => approveFeedback( id ) ) }
                  >
                    <Check size={ 15 } strokeWidth={ 2 } />
                    { __( 'Approve', 'markaroo' ) }
                  </button>
                ) }
                <button
                  type="button"
                  className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                  disabled={ busy }
                  onClick={ () => run( () => reopenFeedback( id ) ) }
                >
                  <RotateCcw size={ 15 } strokeWidth={ 2 } />
                  { __( 'Reopen', 'markaroo' ) }
                </button>
              </div>
            ) }

            { item.screenshot_url && (
              <div className="markaroo-detail__section">
                <span className="markaroo-detail__label">
                  { __( 'Pinned content', 'markaroo' ) }
                </span>
                <a href={ item.screenshot_url } target="_blank" rel="noopener noreferrer">
                  <img
                    className="markaroo-detail__shot"
                    src={ item.screenshot_url }
                    alt={ __( 'Screenshot', 'markaroo' ) }
                    loading="lazy"
                  />
                </a>
              </div>
            ) }

            { item.attachments.length > 0 && (
              <div className="markaroo-detail__section">
                <span className="markaroo-detail__label">{ __( 'Attachments', 'markaroo' ) }</span>
                <div className="markaroo-detail__attachments">
                  { item.attachments.map( ( a ) => (
                    <a
                      key={ a.id }
                      className="markaroo-detail__attachment"
                      href={ a.url }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      { isImage( a ) ? (
                        <img src={ a.url } alt={ a.filename } loading="lazy" />
                      ) : (
                        <span className="markaroo-detail__attachment-badge">{ a.type_badge }</span>
                      ) }
                      <span className="markaroo-detail__attachment-name">{ a.filename }</span>
                    </a>
                  ) ) }
                </div>
              </div>
            ) }

            <div className="markaroo-detail__section">
              <span className="markaroo-detail__label">
                { __( 'Replies', 'markaroo' ) } ({ replies.length })
              </span>
              { replies.map( ( r ) => (
                <div key={ r.id } className="markaroo-detail__reply">
                  <div className="markaroo-detail__reply-meta">
                    <strong>{ r.author }</strong>
                    <span title={ r.created_at }>
                      { new Date( r.created_at ).toLocaleString() }
                    </span>
                  </div>
                  <div className="markaroo-detail__reply-body">{ renderMarkdown( r.comment ) }</div>
                </div>
              ) ) }
              <form className="markaroo-detail__reply-form" onSubmit={ submitReply }>
                <input
                  type="text"
                  value={ replyText }
                  placeholder={ __( 'Write a reply…', 'markaroo' ) }
                  aria-label={ __( 'Reply', 'markaroo' ) }
                  onChange={ ( e ) => setReplyText( e.target.value ) }
                />
                <button
                  type="submit"
                  className="markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm"
                  disabled={ busy || ! replyText.trim() }
                >
                  <Send size={ 15 } strokeWidth={ 2 } />
                  { __( 'Reply', 'markaroo' ) }
                </button>
              </form>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
}
