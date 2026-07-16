import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ReplyComposer } from './ReplyComposer';
import { AttachmentList } from './AttachmentList';
import { Lightbox } from './Lightbox';
import { apiFetch, apiPatch, apiDelete, fetchUsers } from '../api';
import { useWidget, useWidgetDispatch } from '../store/WidgetContext';
import { anchorStyle, pageRectToViewport } from '../support/anchor';
import { Avatar } from '../support/Avatar';
import { timeAgo, absoluteTime } from '../support/timeAgo';
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

/**
 * Hover/focus-revealed ⋯ menu with Edit/Delete actions.
 * @param root0
 * @param root0.canEdit
 * @param root0.canDelete
 * @param root0.onEdit
 * @param root0.onDelete
 */
function EntryMenu( {
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
} ) {
  const [ open, setOpen ] = useState( false );

  if ( ! canEdit && ! canDelete ) {
    return null;
  }

  return (
    <div className="markaroo-entry__menu">
      <button
        className="markaroo-entry__menu-btn"
        type="button"
        aria-label={ __( 'More actions', 'markaroo' ) }
        aria-expanded={ open }
        onClick={ () => setOpen( ( v ) => ! v ) }
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
      { open && (
        <div className="markaroo-entry__dropdown" role="menu">
          { canEdit && (
            <button
              className="markaroo-entry__dropdown-item"
              type="button"
              role="menuitem"
              onClick={ () => {
                setOpen( false );
                onEdit();
              } }
            >
              { __( 'Edit', 'markaroo' ) }
            </button>
          ) }
          { canDelete && (
            <button
              className="markaroo-entry__dropdown-item markaroo-entry__dropdown-item--danger"
              type="button"
              role="menuitem"
              onClick={ () => {
                setOpen( false );
                onDelete();
              } }
            >
              { __( 'Delete', 'markaroo' ) }
            </button>
          ) }
        </div>
      ) }
    </div>
  );
}

/**
 * One avatar-led thread entry (root comment or reply).
 * @param root0
 * @param root0.author
 * @param root0.avatar
 * @param root0.createdAt
 */
function EntryMeta( {
  author,
  avatar,
  createdAt,
}: {
  author: string;
  avatar?: string;
  createdAt: string;
} ) {
  return (
    <>
      <Avatar name={ author } src={ avatar } size={ 24 } />
      <span className="markaroo-entry__author">{ author }</span>
      <span className="markaroo-entry__time" title={ absoluteTime( createdAt ) }>
        { timeAgo( createdAt ) }
      </span>
    </>
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
    <div className="markaroo-entry">
      <div className="markaroo-entry__meta">
        <EntryMeta author={ reply.author } avatar={ reply.avatar } createdAt={ reply.created_at } />
        { ! editing && (
          <EntryMenu
            canEdit={ canEdit }
            canDelete={ canEdit }
            onEdit={ () => setEditing( true ) }
            onDelete={ () =>
              apiDelete( `replies/${ reply.id }` )
                .then( () => onDeleted( reply.id ) )
                .catch( () => null )
            }
          />
        ) }
      </div>
      { editing ? (
        <div className="markaroo-entry__edit">
          <textarea
            className="markaroo-entry__edit-textarea"
            value={ draft }
            onChange={ ( e ) => setDraft( e.target.value ) }
            rows={ 2 }
            aria-label={ __( 'Edit reply', 'markaroo' ) }
          />
          <div className="markaroo-entry__edit-actions">
            <button
              className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
              type="button"
              onClick={ save }
            >
              { __( 'Save', 'markaroo' ) }
            </button>
            <button
              className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
              type="button"
              onClick={ () => setEditing( false ) }
            >
              { __( 'Cancel', 'markaroo' ) }
            </button>
          </div>
        </div>
      ) : (
        <p className="markaroo-entry__body">{ reply.comment }</p>
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
  const [ editing, setEditing ] = useState( false );
  const [ commentDraft, setCommentDraft ] = useState( feedback.comment );
  const [ titleDraft, setTitleDraft ] = useState( feedback.title ?? '' );
  const [ confirmDelete, setConfirmDelete ] = useState( false );
  const [ users, setUsers ] = useState< WPUser[] >( [] );
  const [ lightbox, setLightbox ] = useState( false );
  const lightboxRef = useRef( false );
  lightboxRef.current = lightbox;

  // Anchor to the pin POINT, never the screenshot rect — click-placed pins
  // carry a derived crop rect whose edges can sit far from the marker, which
  // would open the card away from its pin.
  function currentAnchor() {
    return pageRectToViewport( item.x, item.y, 0, 0 );
  }

  // Initial placement next to the pin, clamped into the viewport.
  function computePos(): { left: number; top: number } {
    const el = panelRef.current;
    const size = el
      ? { width: el.offsetWidth, height: el.offsetHeight }
      : { width: PANEL_W, height: PANEL_H };
    // The list panel always docks on the right; keep the card clear of it.
    const reserve = panelOpen ? { maxRight: window.innerWidth - PANEL_RESERVE } : {};
    return anchorStyle( currentAnchor(), size, reserve );
  }

  const [ pos, setPos ] = useState< { left: number; top: number } >( computePos );

  useEffect( () => {
    apiFetch< FeedbackItem & { replies: ReplyItem[] } >( `feedback/${ feedback.id }` )
      .then( ( data ) => {
        setItem( data );
        setTitleDraft( data.title ?? '' );
        setCommentDraft( data.comment );
        setReplies( data.replies ?? [] );
      } )
      .catch( () => null )
      .finally( () => setLoading( false ) );
  }, [ feedback.id ] );

  // Outside pointerdown / Escape closes the card. Pin and cluster markers are
  // excluded (their click handlers toggle/switch the active pin themselves),
  // and so is the docked panel (row clicks switch pins, tabs shouldn't close).
  useEffect( () => {
    function onPointerDown( e: PointerEvent ) {
      const target = e.target as Element | null;
      if ( ! target ) {
        return;
      }
      if (
        panelRef.current?.contains( target ) ||
        target.closest( '.markaroo-pin' ) ||
        target.closest( '.markaroo-panel' )
      ) {
        return;
      }
      onClose();
    }
    function onKeyDown( e: KeyboardEvent ) {
      // Lightbox handles its own Escape; don't close the card underneath it.
      if ( e.key === 'Escape' && ! lightboxRef.current ) {
        onClose();
      }
    }
    document.addEventListener( 'pointerdown', onPointerDown, true );
    document.addEventListener( 'keydown', onKeyDown );
    return () => {
      document.removeEventListener( 'pointerdown', onPointerDown, true );
      document.removeEventListener( 'keydown', onKeyDown );
    };
  }, [ onClose ] );

  // Place the card next to the pin (viewport-clamped once, at open), then keep
  // it RIGIDLY attached to the pin while the page scrolls — re-clamping on
  // scroll would detach the card from its pin at the viewport edge.
  // rAF-throttled: at most one position update per frame.
  useEffect( () => {
    const initialPos = computePos();
    const anchor0 = currentAnchor();
    const offset = { x: initialPos.left - anchor0.left, y: initialPos.top - anchor0.top };
    setPos( initialPos );

    let rafId = 0;
    function reposition() {
      if ( rafId ) {
        return;
      }
      rafId = window.requestAnimationFrame( () => {
        rafId = 0;
        const a = currentAnchor();
        setPos( { left: Math.round( a.left + offset.x ), top: Math.round( a.top + offset.y ) } );
      } );
    }
    window.addEventListener( 'scroll', reposition, { passive: true } );
    window.addEventListener( 'resize', reposition );
    return () => {
      if ( rafId ) {
        window.cancelAnimationFrame( rafId );
      }
      window.removeEventListener( 'scroll', reposition );
      window.removeEventListener( 'resize', reposition );
    };
  }, [ item, panelOpen ] ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => {
    if ( ! enableAssignment || ! canAssign ) {
      return;
    }
    fetchUsers()
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

  async function saveEdit() {
    const changes: Partial< FeedbackItem > = {};
    if ( commentDraft.trim() && commentDraft !== item.comment ) {
      changes.comment = commentDraft;
    }
    if ( ( titleDraft ?? '' ) !== ( item.title ?? '' ) ) {
      changes.title = titleDraft;
    }
    if ( Object.keys( changes ).length ) {
      await patch( changes );
    }
    setEditing( false );
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
      aria-label={ `${ __( 'Feedback', 'markaroo' ) } #${ item.id }` }
    >
      <div className="markaroo-pincard__head">
        <span className="markaroo-pincard__head-title">{ __( 'Comment', 'markaroo' ) }</span>
        <span
          className="markaroo-pincard__priority"
          style={
            { '--pri-color': PRIORITY_COLORS[ item.priority ] ?? '#6366f1' } as React.CSSProperties
          }
        >
          { item.priority.toUpperCase() }
        </span>
        <div className="markaroo-pincard__head-actions">
          { canManage && (
            <button
              className={ `markaroo-iconbtn markaroo-iconbtn--sm markaroo-pincard__resolve${
                item.status === 'resolved' ? ' is-resolved' : ''
              }` }
              type="button"
              aria-label={
                item.status === 'resolved'
                  ? __( 'Unresolve', 'markaroo' )
                  : __( 'Resolve', 'markaroo' )
              }
              aria-pressed={ item.status === 'resolved' }
              onClick={ toggleResolve }
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
          <button
            className="markaroo-iconbtn markaroo-iconbtn--ghost markaroo-iconbtn--sm"
            type="button"
            aria-label={ __( 'Close', 'markaroo' ) }
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
        </div>
      </div>

      { confirmDelete && (
        <div className="markaroo-pincard__confirm" role="alert">
          <span>{ __( 'Delete this feedback?', 'markaroo' ) }</span>
          <button
            className="markaroo-btn markaroo-btn--danger markaroo-btn--sm"
            type="button"
            onClick={ handleDelete }
          >
            { __( 'Yes, delete', 'markaroo' ) }
          </button>
          <button
            className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
            type="button"
            onClick={ () => setConfirmDelete( false ) }
          >
            { __( 'Cancel', 'markaroo' ) }
          </button>
        </div>
      ) }

      <div className="markaroo-pincard__body">
        { /* Root entry: the feedback itself, same layout as replies. */ }
        <div className="markaroo-entry markaroo-entry--root">
          <div className="markaroo-entry__meta">
            <EntryMeta
              author={ item.author }
              avatar={ item.avatar }
              createdAt={ item.created_at }
            />
            { ! editing && (
              <EntryMenu
                canEdit={ canEditComment }
                canDelete={ canDeleteItem }
                onEdit={ () => setEditing( true ) }
                onDelete={ () => setConfirmDelete( true ) }
              />
            ) }
          </div>
          { editing ? (
            <div className="markaroo-entry__edit">
              <input
                className="markaroo-composer__input"
                type="text"
                value={ titleDraft }
                placeholder={ __( 'Add a title…', 'markaroo' ) }
                maxLength={ 191 }
                aria-label={ __( 'Title', 'markaroo' ) }
                onChange={ ( e ) => setTitleDraft( e.target.value ) }
              />
              <textarea
                className="markaroo-entry__edit-textarea"
                value={ commentDraft }
                onChange={ ( e ) => setCommentDraft( e.target.value ) }
                rows={ 3 }
                aria-label={ __( 'Edit comment', 'markaroo' ) }
              />
              <div className="markaroo-entry__edit-actions">
                <button
                  className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
                  type="button"
                  onClick={ saveEdit }
                >
                  { __( 'Save', 'markaroo' ) }
                </button>
                <button
                  className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
                  type="button"
                  onClick={ () => {
                    setTitleDraft( item.title ?? '' );
                    setCommentDraft( item.comment );
                    setEditing( false );
                  } }
                >
                  { __( 'Cancel', 'markaroo' ) }
                </button>
              </div>
            </div>
          ) : (
            <>
              { item.title && <p className="markaroo-entry__title">{ item.title }</p> }
              { item.comment && <p className="markaroo-entry__body">{ item.comment }</p> }
            </>
          ) }
        </div>

        { enableAssignment && canAssign && (
          <div className="markaroo-pincard__field">
            <label htmlFor="markaroo-pincard-assignee">{ __( 'Assign to', 'markaroo' ) }</label>
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
              <option value="0">{ __( 'Unassigned', 'markaroo' ) }</option>
              { users.map( ( u ) => (
                <option key={ u.id } value={ u.id }>
                  { u.name }
                </option>
              ) ) }
            </select>
          </div>
        ) }

        { item.screenshot_url && (
          <div className="markaroo-pincard__section">
            <span className="markaroo-pincard__label">{ __( 'Pinned content', 'markaroo' ) }</span>
            <div className="markaroo-pincard__shot">
              <img
                src={ item.screenshot_url }
                alt={ __( 'Pinned content', 'markaroo' ) }
                loading="lazy"
              />
              <button
                className="markaroo-pincard__zoom"
                type="button"
                aria-label={ __( 'Zoom screenshot', 'markaroo' ) }
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

        { item.attachments.length > 0 && (
          <div className="markaroo-pincard__section">
            <span className="markaroo-pincard__label">{ __( 'Attachments', 'markaroo' ) }</span>
            <AttachmentList attachments={ item.attachments } />
          </div>
        ) }

        <div className="markaroo-pincard__section markaroo-pincard__section--replies">
          { loading && (
            <p className="markaroo-pincard__loading">{ __( 'Loading…', 'markaroo' ) }</p>
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
        </div>
      </div>

      { canReply && (
        <ReplyComposer
          feedbackId={ item.id }
          onPosted={ ( r ) => setReplies( ( prev ) => [ ...prev, r ] ) }
        />
      ) }

      { lightbox && item.screenshot_url && (
        <Lightbox src={ item.screenshot_url } onClose={ () => setLightbox( false ) } />
      ) }
    </div>
  );
}
