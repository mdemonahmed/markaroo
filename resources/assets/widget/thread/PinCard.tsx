import { useState, useEffect, useRef } from '@wordpress/element';
import { ReplyComposer } from './ReplyComposer';
import { AttachmentList } from './AttachmentList';
import { Lightbox } from './Lightbox';
import { apiFetch, apiPatch, apiDelete } from '../api';
import { useWidget, useWidgetDispatch } from '../store/WidgetContext';
import { anchorStyle, pageRectToViewport } from '../support/anchor';
import type { FeedbackItem, ReplyItem } from '../types';

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

const PANEL_W = 380;
const PANEL_H = 560;

interface WPUser {
  id: number;
  name: string;
}

function timeStamp( iso: string ): string {
  const d = new Date( iso );
  return Number.isNaN( d.getTime() ) ? iso : d.toLocaleString();
}

function initials( name: string ): string {
  return (
    name
      .trim()
      .split( /\s+/ )
      .map( ( p ) => p[ 0 ] ?? '' )
      .slice( 0, 2 )
      .join( '' )
      .toUpperCase() || '?'
  );
}

function ReplyRow( {
  reply,
  canEdit,
  onUpdated,
  onDeleted,
}: {
  reply: ReplyItem;
  canEdit: boolean;
  onUpdated: ( r: ReplyItem ) => void;
  onDeleted: ( id: number ) => void;
} ) {
  const [ editing, setEditing ] = useState( false );
  const [ draft, setDraft ] = useState( reply.comment );

  async function save() {
    if ( ! draft.trim() ) {
      return;
    }
    const updated = await apiPatch< ReplyItem >( `replies/${ reply.id }`, {
      comment: draft.trim(),
    } ).catch( () => null );
    if ( updated ) {
      onUpdated( updated );
    }
    setEditing( false );
  }

  return (
    <div className="markaroo-reply">
      <div className="markaroo-reply__meta">
        <span className="markaroo-reply__author">{ reply.author }</span>
        <span className="markaroo-reply__time">{ timeStamp( reply.created_at ) }</span>
      </div>
      { editing ? (
        <div className="markaroo-reply__edit">
          <textarea
            className="markaroo-reply__edit-textarea"
            value={ draft }
            onChange={ ( e ) => setDraft( e.target.value ) }
            rows={ 2 }
            aria-label="Edit reply"
          />
          <div className="markaroo-reply__edit-actions">
            <button
              className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
              type="button"
              onClick={ save }
            >
              Save
            </button>
            <button
              className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
              type="button"
              onClick={ () => setEditing( false ) }
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="markaroo-reply__body">{ reply.comment }</p>
      ) }
      { canEdit && ! editing && (
        <div className="markaroo-reply__actions">
          <button
            className="markaroo-reply__action"
            type="button"
            onClick={ () => setEditing( true ) }
          >
            Edit
          </button>
          <button
            className="markaroo-reply__action markaroo-reply__action--danger"
            type="button"
            onClick={ () =>
              apiDelete( `replies/${ reply.id }` )
                .then( () => onDeleted( reply.id ) )
                .catch( () => null )
            }
          >
            Delete
          </button>
        </div>
      ) }
    </div>
  );
}

interface Props {
  feedback: FeedbackItem;
  onClose: () => void;
}

// Docked list panel reserves ~340px on the right; keep the card clear of it.
const PANEL_RESERVE = 360;

export function PinCard( { feedback, onClose }: Props ) {
  const dispatch = useWidgetDispatch();
  const { panelOpen } = useWidget();
  const config = window.markarooConfig;
  const userId = config?.currentUser?.id ?? 0;
  const canManage = config?.currentUser?.canManage ?? false;
  const canAssign = config?.currentUser?.canAssign ?? false;
  const enableAssignment = config?.settings?.[ 'tasks.enable_assignment' ] as boolean | undefined;

  const panelRef = useRef< HTMLDivElement >( null );
  const [ item, setItem ] = useState< FeedbackItem >( feedback );
  const [ replies, setReplies ] = useState< ReplyItem[] >( [] );
  const [ loading, setLoading ] = useState( true );
  const [ editingComment, setEditingComment ] = useState( false );
  const [ commentDraft, setCommentDraft ] = useState( feedback.comment );
  const [ title, setTitle ] = useState( feedback.title ?? '' );
  const [ confirmDelete, setConfirmDelete ] = useState( false );
  const [ users, setUsers ] = useState< WPUser[] >( [] );
  const [ lightbox, setLightbox ] = useState( false );

  // The list panel docks opposite the launcher: launcher bottom-right → panel
  // left, otherwise panel right. Keep the card clear of whichever side it's on.
  const panelOnLeft =
    document.getElementById( 'markaroo-root' )?.getAttribute( 'data-position' ) === 'bottom-right';

  // Anchor next to the pin's region (or pin point), in viewport coords.
  function computePos(): { left: number; top: number } {
    const r = item.screenshot_rect?.rect ?? null;
    const anchor = r
      ? pageRectToViewport( r.xPct, r.yPct, r.wPct, r.hPct )
      : pageRectToViewport( item.x, item.y, 0, 0 );
    const el = panelRef.current;
    const size = el
      ? { width: el.offsetWidth, height: el.offsetHeight }
      : { width: PANEL_W, height: PANEL_H };
    const reserve = panelOpen
      ? panelOnLeft
        ? { minLeft: PANEL_RESERVE }
        : { maxRight: window.innerWidth - PANEL_RESERVE }
      : {};
    return anchorStyle( anchor, size, reserve );
  }

  const [ pos, setPos ] = useState< { left: number; top: number } >( computePos );

  useEffect( () => {
    apiFetch< FeedbackItem & { replies: ReplyItem[] } >( `feedback/${ feedback.id }` )
      .then( ( data ) => {
        setItem( data );
        setTitle( data.title ?? '' );
        setReplies( data.replies ?? [] );
      } )
      .catch( () => null )
      .finally( () => setLoading( false ) );
  }, [ feedback.id ] );

  // Reposition on item change and as the page scrolls/resizes so the card tracks
  // the pin (fixed-positioned popover anchored to a scrolling element).
  useEffect( () => {
    function reposition() {
      setPos( computePos() );
    }
    reposition();
    window.addEventListener( 'scroll', reposition, { passive: true } );
    window.addEventListener( 'resize', reposition );
    return () => {
      window.removeEventListener( 'scroll', reposition );
      window.removeEventListener( 'resize', reposition );
    };
  }, [ item, panelOpen ] ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => {
    if ( ! enableAssignment || ! canAssign ) {
      return;
    }
    apiFetch< WPUser[] >( 'users?per_page=50' )
      .then( setUsers )
      .catch( () => null );
  }, [ enableAssignment, canAssign ] );

  const canEditComment = canManage || userId === item.author_id;
  const canDeleteItem = canManage || userId === item.author_id;
  const canReply = config?.currentUser?.canCreate || config?.shareRights?.canComment;

  async function patch( changes: Partial< FeedbackItem > ) {
    const updated = await apiPatch< FeedbackItem >( `feedback/${ item.id }`, changes ).catch(
      () => null
    );
    if ( updated ) {
      setItem( updated );
      dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
    }
    return updated;
  }

  async function saveComment() {
    await patch( { comment: commentDraft } );
    setEditingComment( false );
  }

  async function saveTitle() {
    if ( ( title ?? '' ) !== ( item.title ?? '' ) ) {
      await patch( { title } );
    }
  }

  async function toggleResolve() {
    const ep =
      item.status === 'open' ? `feedback/${ item.id }/resolve` : `feedback/${ item.id }/unresolve`;
    const updated = await apiFetch< FeedbackItem >( ep, { method: 'POST', body: '' } ).catch(
      () => null
    );
    if ( updated ) {
      setItem( updated );
      dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
    }
  }

  async function handleDelete() {
    await apiDelete( `feedback/${ item.id }` ).catch( () => null );
    dispatch( { type: 'FEEDBACK_DELETED', id: item.id } );
    onClose();
  }

  return (
    <div
      ref={ panelRef }
      className="markaroo-pincard"
      style={ { left: pos.left, top: pos.top } }
      role="dialog"
      aria-label={ `Feedback #${ item.id }` }
    >
      <div className="markaroo-pincard__head">
        <span className="markaroo-pincard__avatar" aria-hidden="true">
          { initials( item.author ) }
        </span>
        <div className="markaroo-pincard__who">
          <span className="markaroo-pincard__author">{ item.author }</span>
          <span className="markaroo-pincard__time">{ timeStamp( item.created_at ) }</span>
        </div>
        <div className="markaroo-pincard__head-actions">
          { canEditComment && (
            <button
              className="markaroo-iconbtn markaroo-iconbtn--primary markaroo-iconbtn--sm"
              type="button"
              aria-label="Edit"
              onClick={ () => setEditingComment( ( v ) => ! v ) }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
          ) }
          <button
            className="markaroo-iconbtn markaroo-iconbtn--ghost markaroo-iconbtn--sm"
            type="button"
            aria-label="Close"
            onClick={ onClose }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          { canManage && (
            <button
              className="markaroo-iconbtn markaroo-iconbtn--success markaroo-iconbtn--sm"
              type="button"
              aria-label={ item.status === 'resolved' ? 'Unresolve' : 'Resolve' }
              onClick={ toggleResolve }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) }
          { canDeleteItem && (
            <button
              className="markaroo-iconbtn markaroo-iconbtn--danger markaroo-iconbtn--sm"
              type="button"
              aria-label="Delete"
              onClick={ () => setConfirmDelete( true ) }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
            </button>
          ) }
        </div>
      </div>

      <span
        className="markaroo-pincard__priority"
        style={
          { '--pri-color': PRIORITY_COLORS[ item.priority ] ?? '#6366f1' } as React.CSSProperties
        }
      >
        { item.priority.toUpperCase() }
      </span>

      { confirmDelete && (
        <div className="markaroo-pincard__confirm" role="alert">
          <span>Delete this feedback?</span>
          <button
            className="markaroo-btn markaroo-btn--danger markaroo-btn--sm"
            type="button"
            onClick={ handleDelete }
          >
            Yes, delete
          </button>
          <button
            className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
            type="button"
            onClick={ () => setConfirmDelete( false ) }
          >
            Cancel
          </button>
        </div>
      ) }

      <div className="markaroo-pincard__body">
        { enableAssignment && canAssign && (
          <div className="markaroo-pincard__field">
            <label htmlFor="markaroo-pincard-assignee">Assign to</label>
            <select
              id="markaroo-pincard-assignee"
              className="markaroo-composer__select"
              value={ item.assigned_to_id }
              onChange={ ( e ) => {
                const id = Number( e.target.value );
                patch( {
                  assigned_to_id: id,
                  assigned_to_name: users.find( ( u ) => u.id === id )?.name ?? '',
                } );
              } }
            >
              <option value="0">Unassigned</option>
              { users.map( ( u ) => (
                <option key={ u.id } value={ u.id }>
                  { u.name }
                </option>
              ) ) }
            </select>
          </div>
        ) }

        { canEditComment ? (
          <input
            className="markaroo-composer__input"
            type="text"
            value={ title }
            placeholder="Add a title…"
            maxLength={ 191 }
            aria-label="Title"
            onChange={ ( e ) => setTitle( e.target.value ) }
            onBlur={ saveTitle }
          />
        ) : (
          item.title && <p className="markaroo-pincard__titletext">{ item.title }</p>
        ) }

        { editingComment ? (
          <div className="markaroo-reply__edit">
            <textarea
              className="markaroo-reply__edit-textarea"
              value={ commentDraft }
              onChange={ ( e ) => setCommentDraft( e.target.value ) }
              rows={ 3 }
              aria-label="Edit comment"
            />
            <div className="markaroo-reply__edit-actions">
              <button
                className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
                type="button"
                onClick={ saveComment }
              >
                Save
              </button>
              <button
                className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
                type="button"
                onClick={ () => setEditingComment( false ) }
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="markaroo-pincard__comment">{ item.comment }</p>
        ) }

        { item.screenshot_url && (
          <div className="markaroo-pincard__section">
            <span className="markaroo-pincard__label">Pinned content</span>
            <div className="markaroo-pincard__shot">
              <img src={ item.screenshot_url } alt="Pinned content" loading="lazy" />
              <button
                className="markaroo-pincard__zoom"
                type="button"
                aria-label="Zoom screenshot"
                onClick={ () => setLightbox( true ) }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </button>
            </div>
          </div>
        ) }

        <div className="markaroo-pincard__section">
          <span className="markaroo-pincard__label">Attachments</span>
          <AttachmentList attachments={ item.attachments } />
        </div>

        <div className="markaroo-pincard__section">
          <span className="markaroo-pincard__label">
            Replies <span className="markaroo-pincard__count">{ replies.length }</span>
          </span>
          { loading && <p className="markaroo-pincard__loading">Loading…</p> }
          { ! loading && replies.length === 0 && (
            <p className="markaroo-pincard__empty">No replies yet.</p>
          ) }
          { replies.map( ( r ) => (
            <ReplyRow
              key={ r.id }
              reply={ r }
              canEdit={ canManage || userId === r.author_id }
              onUpdated={ ( u ) =>
                setReplies( ( prev ) => prev.map( ( x ) => ( x.id === u.id ? u : x ) ) )
              }
              onDeleted={ ( id ) => setReplies( ( prev ) => prev.filter( ( x ) => x.id !== id ) ) }
            />
          ) ) }
          { canReply && (
            <ReplyComposer
              feedbackId={ item.id }
              onPosted={ ( r ) => setReplies( ( prev ) => [ ...prev, r ] ) }
            />
          ) }
        </div>
      </div>

      { lightbox && item.screenshot_url && (
        <Lightbox src={ item.screenshot_url } onClose={ () => setLightbox( false ) } />
      ) }
    </div>
  );
}
