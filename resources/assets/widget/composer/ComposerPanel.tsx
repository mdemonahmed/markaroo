import { useState, useRef } from '@wordpress/element';
import { MarkdownToolbar } from './MarkdownToolbar';
import { TagInput } from './TagInput';
import { AttachmentPicker } from './AttachmentPicker';
import { apiPost, apiFetch } from '../api';
import { uploadScreenshot } from '../capture/Screenshot';
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

function getPageKey(): string {
  return ( window.location.pathname.replace( /\/+$/, '' ) || '/' ) + window.location.search;
}

function getViewport(): string {
  return `${ window.innerWidth }x${ window.innerHeight }`;
}

interface Props {
  captureData: CaptureData;
  screenshotBlob: Blob | null;
  onSubmitted: ( item: FeedbackItem ) => void;
  onCancel: () => void;
}

export function ComposerPanel( { captureData, screenshotBlob, onSubmitted, onCancel }: Props ) {
  const config = window.markarooConfig;
  const isGuest = config.currentUser?.id === 0;
  const defaultPri =
    ( config.settings?.[ 'general.default_priority' ] as Priority | undefined ) ?? 'normal';

  const textareaRef = useRef< HTMLTextAreaElement >( null );
  const enableAssignment = config.settings?.[ 'tasks.enable_assignment' ] as boolean | undefined;
  const enableDueDates = config.settings?.[ 'tasks.enable_due_dates' ] as boolean | undefined;
  const enableTags = config.settings?.[ 'tasks.enable_tags' ] as boolean | undefined;
  const canAssign = config.currentUser?.canAssign ?? false;

  const [ comment, setComment ] = useState( '' );
  const [ priority, setPriority ] = useState< Priority >( defaultPri );
  const [ assigneeId, setAssigneeId ] = useState( 0 );
  const [ assigneeName, setAssigneeName ] = useState( '' );
  const [ dueDate, setDueDate ] = useState( '' );
  const [ tags, setTags ] = useState< string[] >( [] );
  const [ attachments, setAttachments ] = useState< import('../types').AttachmentMeta[] >( [] );
  const [ users, setUsers ] = useState< WPUser[] >( [] );
  const [ guestName, setGuestName ] = useState(
    () => ( typeof localStorage !== 'undefined' && localStorage.getItem( GUEST_NAME_KEY ) ) || ''
  );
  const [ error, setError ] = useState< string | null >( null );
  const [ loading, setLoading ] = useState( false );

  // Load assignable users once if feature enabled.
  useState( () => {
    if ( ! enableAssignment || ! canAssign ) {
      return;
    }
    apiFetch< WPUser[] >( 'users?per_page=50' )
      .then( setUsers )
      .catch( () => null );
  } );

  // Screenshot preview URL from blob.
  const previewUrl = screenshotBlob ? URL.createObjectURL( screenshotBlob ) : null;

  async function handleSubmit( e: React.FormEvent ) {
    e.preventDefault();

    if ( ! comment.trim() ) {
      setError( 'Comment cannot be empty.' );
      return;
    }

    if ( isGuest && ! guestName.trim() ) {
      setError( 'Please enter your name.' );
      return;
    }

    setError( null );
    setLoading( true );

    // Persist guest name for next time.
    if ( isGuest && typeof localStorage !== 'undefined' ) {
      localStorage.setItem( GUEST_NAME_KEY, guestName.trim() );
    }

    const payload: Record< string, unknown > = {
      comment,
      priority,
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
    };

    if ( isGuest ) {
      payload.author = guestName.trim();
    }

    /**
     * Pro can add extra fields via markaroo/composer/fields filter.
     * JS-side hook fires so UI extensions can inject data before POST.
     */
    window.dispatchEvent(
      new CustomEvent( 'markaroo:composer-before-submit', { detail: { payload } } )
    );

    try {
      const item = await apiPost< FeedbackItem >( 'feedback', payload );

      // Deferred screenshot upload — non-fatal if it fails.
      if ( screenshotBlob && item.id ) {
        uploadScreenshot( item.id, screenshotBlob ).catch( () => null );
      }

      window.dispatchEvent(
        new CustomEvent( 'markaroo:feedback-submitted', { detail: { feedback: item } } )
      );

      onSubmitted( item );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : 'Submission failed.' );
    } finally {
      setLoading( false );
    }
  }

  return (
    <div className="markaroo-composer" role="dialog" aria-label="New feedback">
      <div className="markaroo-composer__header">
        <span className="markaroo-composer__title">New feedback</span>
        <button
          className="markaroo-composer__close"
          type="button"
          aria-label="Cancel"
          onClick={ onCancel }
        >
          ✕
        </button>
      </div>

      { previewUrl && (
        <div className="markaroo-composer__preview">
          <img src={ previewUrl } alt="Screenshot preview" />
        </div>
      ) }

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

        <div className="markaroo-composer__field markaroo-composer__field--comment">
          <label htmlFor="markaroo-comment">Comment</label>
          <MarkdownToolbar textareaRef={ textareaRef } value={ comment } onChange={ setComment } />
          <textarea
            ref={ textareaRef }
            id="markaroo-comment"
            className="markaroo-composer__textarea"
            value={ comment }
            onChange={ ( e ) => setComment( e.target.value ) }
            placeholder="Describe the feedback…"
            rows={ 5 }
            required
          />
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

        { enableAssignment && canAssign && users.length > 0 && (
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
            <label>Tags</label>
            <TagInput tags={ tags } onChange={ setTags } />
          </div>
        ) }

        <div className="markaroo-composer__field">
          <label>Attachments</label>
          <AttachmentPicker attachments={ attachments } onChange={ setAttachments } />
        </div>

        { error && (
          <div className="markaroo-composer__error" role="alert">
            { error }
          </div>
        ) }

        <div className="markaroo-composer__actions">
          <button
            type="button"
            className="markaroo-btn markaroo-btn--ghost"
            onClick={ onCancel }
            disabled={ loading }
          >
            Cancel
          </button>
          <button type="submit" className="markaroo-btn markaroo-btn--primary" disabled={ loading }>
            { loading ? 'Submitting…' : 'Submit' }
          </button>
        </div>
      </form>
    </div>
  );
}
