import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MarkdownToolbar } from './MarkdownToolbar';
import { TagInput } from './TagInput';
import { AttachmentPicker } from './AttachmentPicker';
import { MentionAutocomplete } from '../thread/MentionAutocomplete';
import { fetchUsers } from '../api';
import { submitOrQueue } from '../offlineQueue';
import { captureCroppedDataUrl } from '../capture/Screenshot';
import { getPageKey } from '../capture/captureUtils';
import { anchorStyle, pageRectToViewport } from '../support/anchor';
import type { CaptureData, FeedbackItem } from '../types';

type Priority = 'urgent' | 'high' | 'normal' | 'low';

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'normal', label: 'Normal', color: '#6366f1' },
  { value: 'low', label: 'Low', color: '#9ca3af' },
];

interface WPUser {
  id: number;
  name: string;
}

const GUEST_NAME_KEY = 'markaroo_guest_name';
const PANEL_W = 360;
const PANEL_H = 520;

function getViewport(): string {
  return `${ window.innerWidth }x${ window.innerHeight }`;
}

interface Props {
  captureData: CaptureData;
  onSubmitted: ( item: FeedbackItem ) => void;
  onCancel: () => void;
}

export function ComposerPanel( { captureData, onSubmitted, onCancel }: Props ) {
  const config = window.markarooConfig;
  const isGuest = config.currentUser?.id === 0;
  const defaultPri =
    ( config.settings?.[ 'general.default_priority' ] as Priority | undefined ) ?? 'normal';

  const panelRef = useRef< HTMLDivElement >( null );
  const textareaRef = useRef< HTMLTextAreaElement >( null );
  const enableAssignment = config.settings?.[ 'tasks.enable_assignment' ] as boolean | undefined;
  const enableDueDates = config.settings?.[ 'tasks.enable_due_dates' ] as boolean | undefined;
  const enableTags = config.settings?.[ 'tasks.enable_tags' ] as boolean | undefined;
  const canAssign = config.currentUser?.canAssign ?? false;
  // Screenshot capture is opt-in and only offered when enabled in settings.
  const screenshotEnabled = config.screenshotOptions?.enabled ?? true;

  const [ title, setTitle ] = useState( '' );
  const [ comment, setComment ] = useState( '' );
  const [ priority, setPriority ] = useState< Priority >( defaultPri );
  const [ assigneeId, setAssigneeId ] = useState( 0 );
  const [ assigneeName, setAssigneeName ] = useState( '' );
  const [ dueDate, setDueDate ] = useState( '' );
  const [ tags, setTags ] = useState< string[] >( [] );
  const [ attachments, setAttachments ] = useState< import('../types').AttachmentMeta[] >( [] );
  const [ attachScreenshot, setAttachScreenshot ] = useState( false );
  const [ users, setUsers ] = useState< WPUser[] >( [] );
  const [ guestName, setGuestName ] = useState(
    () => ( typeof localStorage !== 'undefined' && localStorage.getItem( GUEST_NAME_KEY ) ) || ''
  );
  const [ error, setError ] = useState< string | null >( null );
  const [ loading, setLoading ] = useState( false );

  // Mention detection in the comment textarea. Selected user IDs are captured
  // so the backend resolves mentions by ID (a display name with a space can't
  // be matched from the raw text alone).
  const [ mentionQuery, setMentionQuery ] = useState< string | null >( null );
  const [ mentionOffset, setMentionOffset ] = useState( 0 );
  const [ mentionIds, setMentionIds ] = useState< number[] >( [] );

  // Anchor the panel next to the selected region.
  const [ pos, setPos ] = useState< { left: number; top: number } >( () => {
    const r = captureData.screenshotRect.rect;
    const anchor = r
      ? pageRectToViewport( r.xPct, r.yPct, r.wPct, r.hPct )
      : {
          left: captureData.x * window.innerWidth,
          top: captureData.y * window.innerHeight,
          width: 0,
          height: 0,
        };
    return anchorStyle( anchor, { width: PANEL_W, height: PANEL_H } );
  } );

  useEffect( () => {
    const el = panelRef.current;
    if ( ! el ) {
      return;
    }
    const r = captureData.screenshotRect.rect;
    const anchor = r
      ? pageRectToViewport( r.xPct, r.yPct, r.wPct, r.hPct )
      : {
          left: captureData.x * window.innerWidth,
          top: captureData.y * window.innerHeight,
          width: 0,
          height: 0,
        };
    setPos( anchorStyle( anchor, { width: el.offsetWidth, height: el.offsetHeight } ) );
  }, [ captureData ] );

  // Load assignable users once if feature enabled (shared session cache).
  useEffect( () => {
    if ( ! enableAssignment || ! canAssign ) {
      return;
    }
    fetchUsers()
      .then( setUsers )
      .catch( () => null );
  }, [ enableAssignment, canAssign ] );

  function handleCommentChange( val: string ) {
    setComment( val );
    const ta = textareaRef.current;
    const cursor = ta?.selectionStart ?? val.length;
    const before = val.slice( 0, cursor );
    const match = before.match( /@(\w*)$/ );
    if ( match ) {
      setMentionQuery( match[ 1 ] );
      setMentionOffset( match.index ?? 0 );
    } else {
      setMentionQuery( null );
    }
  }

  function insertMention( user: WPUser ) {
    const handle = `@${ user.name } `;
    const before = comment.slice( 0, mentionOffset );
    const after = comment.slice( textareaRef.current?.selectionStart ?? comment.length );
    setComment( before + handle + after );
    setMentionIds( ( prev ) => ( prev.includes( user.id ) ? prev : [ ...prev, user.id ] ) );
    setMentionQuery( null );
  }

  async function handleSubmit( e: React.FormEvent ) {
    e.preventDefault();

    // Title is the only required field; the comment is optional.
    if ( ! title.trim() ) {
      setError( __( 'Title is required.', 'markaroo' ) );
      return;
    }
    if ( isGuest && ! guestName.trim() ) {
      setError( 'Please enter your name.' );
      return;
    }

    setError( null );
    setLoading( true );

    if ( isGuest && typeof localStorage !== 'undefined' ) {
      localStorage.setItem( GUEST_NAME_KEY, guestName.trim() );
    }

    // Capture the cropped "Pinned content" image (annotations burned in) and
    // convert to a binary Blob up front, so the offline queue can retry the
    // multipart upload without re-capturing.
    let screenshotBlob: Blob | null = null;
    if ( attachScreenshot ) {
      const dataUrl = await captureCroppedDataUrl(
        captureData.screenshotRect.rect,
        captureData.screenshotRect.annotations
      );
      if ( dataUrl ) {
        try {
          screenshotBlob = await ( await fetch( dataUrl ) ).blob();
        } catch {
          screenshotBlob = null;
        }
      }
    }

    // The screenshot is uploaded as a binary multipart request AFTER the
    // feedback row is created — base64-in-JSON is ~33% bigger and forces the
    // server to decode the whole payload inside the create request.
    const payload: Record< string, unknown > = {
      comment,
      priority,
      ...( title.trim() ? { title: title.trim() } : {} ),
      page_key: getPageKey(),
      page_url: window.location.href,
      viewport: getViewport(),
      user_agent: navigator.userAgent,
      x: captureData.x,
      y: captureData.y,
      screenshot_rect: captureData.screenshotRect,
      ...( assigneeId ? { assigned_to_id: assigneeId, assigned_to_name: assigneeName } : {} ),
      ...( dueDate ? { due_date: dueDate } : {} ),
      ...( tags.length ? { tags: JSON.stringify( tags ) } : {} ),
      ...( mentionIds.length ? { mention_ids: mentionIds } : {} ),
      ...( attachments.length ? { attachments: JSON.stringify( attachments ) } : {} ),
    };

    if ( isGuest ) {
      payload.author = guestName.trim();
    }

    window.dispatchEvent(
      new CustomEvent( 'markaroo:composer-before-submit', { detail: { payload } } )
    );

    const uuid =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `q-${ Date.now() }-${ Math.round( Math.random() * 1e9 ) }`;

    try {
      // submitOrQueue owns the create + screenshot upload, and falls back to
      // the offline retry queue on a network error (created items and retried
      // items both dispatch markaroo:feedback-submitted).
      const result = await submitOrQueue( payload, screenshotBlob, uuid );

      if ( result.status === 'created' && result.item ) {
        window.dispatchEvent(
          new CustomEvent( 'markaroo:feedback-submitted', { detail: { feedback: result.item } } )
        );
        onSubmitted( result.item );
      } else {
        // Queued for retry — surface it and close the composer.
        window.dispatchEvent(
          new CustomEvent( 'markaroo:feedback-queued', {
            detail: { uuid, x: captureData.x, y: captureData.y },
          } )
        );
        onCancel();
      }
    } catch ( err ) {
      setError( err instanceof Error ? err.message : 'Submission failed.' );
    } finally {
      setLoading( false );
    }
  }

  return (
    <div
      ref={ panelRef }
      className="markaroo-composer markaroo-composer--anchored"
      style={ { left: pos.left, top: pos.top } }
      role="dialog"
      aria-label="Write feedback"
    >
      <div className="markaroo-composer__header">
        <span className="markaroo-composer__title">Write feedback</span>
      </div>

      <form className="markaroo-composer__form" onSubmit={ handleSubmit } noValidate>
        { isGuest && (
          <div className="markaroo-composer__field">
            <label htmlFor="markaroo-guest-name">Your name</label>
            <input
              id="markaroo-guest-name"
              type="text"
              className="markaroo-composer__input"
              value={ guestName }
              onChange={ ( e ) => setGuestName( e.target.value ) }
              placeholder="Enter your name"
              maxLength={ 191 }
              required
            />
          </div>
        ) }

        <div className="markaroo-composer__field">
          <input
            id="markaroo-title"
            type="text"
            className="markaroo-composer__input"
            value={ title }
            onChange={ ( e ) => setTitle( e.target.value ) }
            placeholder={ __( 'Add a title', 'markaroo' ) }
            maxLength={ 191 }
            aria-label={ __( 'Title', 'markaroo' ) }
            required
            onKeyDown={ ( e ) => {
              // Enter in the title must not submit a comment-less form.
              if ( e.key === 'Enter' ) {
                e.preventDefault();
                textareaRef.current?.focus();
              }
            } }
          />
        </div>

        <div className="markaroo-composer__field markaroo-composer__field--comment">
          <MarkdownToolbar textareaRef={ textareaRef } value={ comment } onChange={ setComment } />
          <div className="markaroo-composer__input-wrap">
            <textarea
              ref={ textareaRef }
              id="markaroo-comment"
              className="markaroo-composer__textarea"
              value={ comment }
              onChange={ ( e ) => handleCommentChange( e.target.value ) }
              placeholder={ __(
                'Describe the issue (optional)… Type @ to mention a user.',
                'markaroo'
              ) }
              rows={ 4 }
              aria-label={ __( 'Feedback comment', 'markaroo' ) }
            />
            { mentionQuery !== null && (
              <MentionAutocomplete
                query={ mentionQuery }
                onSelect={ insertMention }
                onClose={ () => setMentionQuery( null ) }
              />
            ) }
          </div>
        </div>

        <div className="markaroo-composer__field">
          <label htmlFor="markaroo-priority">Priority</label>
          <select
            id="markaroo-priority"
            className="markaroo-composer__select"
            value={ priority }
            onChange={ ( e ) => setPriority( e.target.value as Priority ) }
          >
            { PRIORITIES.map( ( p ) => (
              <option key={ p.value } value={ p.value }>
                { p.label }
              </option>
            ) ) }
          </select>
        </div>

        { enableAssignment && canAssign && (
          <div className="markaroo-composer__field">
            <label htmlFor="markaroo-assignee">Assign to</label>
            <select
              id="markaroo-assignee"
              className="markaroo-composer__select"
              value={ assigneeId }
              onChange={ ( e ) => {
                const id = Number( e.target.value );
                setAssigneeId( id );
                setAssigneeName( users.find( ( u ) => u.id === id )?.name ?? '' );
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

        { enableDueDates && (
          <div className="markaroo-composer__field">
            <label htmlFor="markaroo-due">Due date</label>
            <input
              id="markaroo-due"
              type="date"
              className="markaroo-composer__input"
              value={ dueDate }
              onChange={ ( e ) => setDueDate( e.target.value ) }
            />
          </div>
        ) }

        { enableTags && (
          <div className="markaroo-composer__field">
            <span className="markaroo-composer__label">Tags</span>
            <TagInput tags={ tags } onChange={ setTags } />
          </div>
        ) }

        { screenshotEnabled && (
          <div className="markaroo-composer__field markaroo-composer__field--check">
            <input
              id="markaroo-attach-shot"
              type="checkbox"
              checked={ attachScreenshot }
              onChange={ ( e ) => setAttachScreenshot( e.target.checked ) }
            />
            <label htmlFor="markaroo-attach-shot" className="markaroo-composer__checkbox">
              Attach screenshot
            </label>
          </div>
        ) }

        <div className="markaroo-composer__field">
          <span className="markaroo-composer__label">Attach files</span>
          <AttachmentPicker attachments={ attachments } onChange={ setAttachments } />
        </div>

        { error && (
          <div className="markaroo-composer__error" role="alert">
            { error }
          </div>
        ) }

        <div className="markaroo-composer__actions">
          <button
            type="submit"
            className="markaroo-iconbtn markaroo-iconbtn--primary"
            aria-label="Save feedback"
            disabled={ loading }
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
          <button
            type="button"
            className="markaroo-iconbtn markaroo-iconbtn--ghost"
            aria-label="Cancel"
            onClick={ onCancel }
            disabled={ loading }
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
      </form>
    </div>
  );
}
