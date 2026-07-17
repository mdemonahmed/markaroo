import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MentionAutocomplete } from './MentionAutocomplete';
import { apiPost } from '../api';
import { Avatar } from '../support/Avatar';
import type { ReplyItem } from '../types';

const GUEST_NAME_KEY = 'markaroo_guest_name';

interface Props {
  feedbackId: number;
  onPosted: ( reply: ReplyItem ) => void;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( c ) => {
    const r = ( Math.random() * 16 ) | 0;
    return ( c === 'x' ? r : ( r & 0x3 ) | 0x8 ).toString( 16 );
  } );
}

export function ReplyComposer( { feedbackId, onPosted }: Props ) {
  const config = window.markarooConfig;
  const isGuest = config?.currentUser?.id === 0;
  const meName = config?.currentUser?.name || __( 'Guest', 'markaroo' );
  const meAvatar = config?.currentUser?.avatar;

  const textareaRef = useRef< HTMLTextAreaElement >( null );
  const [ text, setText ] = useState( '' );
  const [ guestName, setGuestName ] = useState(
    () => ( typeof localStorage !== 'undefined' && localStorage.getItem( GUEST_NAME_KEY ) ) || ''
  );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState< string | null >( null );

  // Mention detection. Selected user IDs travel with the reply so the backend
  // resolves them by ID regardless of spaces in the display name.
  const [ mentionQuery, setMentionQuery ] = useState< string | null >( null );
  const [ mentionOffset, setMentionOffset ] = useState( 0 );
  const [ mentionIds, setMentionIds ] = useState< number[] >( [] );

  function autoGrow() {
    const ta = textareaRef.current;
    if ( ta ) {
      ta.style.height = 'auto';
      ta.style.height = `${ Math.min( ta.scrollHeight, 72 ) }px`;
    }
  }

  function handleTextChange( val: string ) {
    setText( val );
    autoGrow();
    const ta = textareaRef.current;
    const cursor = ta?.selectionStart ?? val.length;
    const before = val.slice( 0, cursor );
    const match = before.match( /@(\w*)$/ );
    if ( match ) {
      setMentionQuery( match[ 1 ] );
      setMentionOffset( match.index! );
    } else {
      setMentionQuery( null );
    }
  }

  function insertMention( user: { id: number; name: string } ) {
    const handle = `@${ user.name } `;
    const before = text.slice( 0, mentionOffset );
    const after = text.slice( textareaRef.current?.selectionStart ?? text.length );
    const next = before + handle + after;
    setText( next );
    setMentionIds( ( prev ) => ( prev.includes( user.id ) ? prev : [ ...prev, user.id ] ) );
    setMentionQuery( null );
  }

  async function submit() {
    if ( ! text.trim() || loading ) {
      return;
    }

    if ( isGuest && typeof localStorage !== 'undefined' ) {
      localStorage.setItem( GUEST_NAME_KEY, guestName.trim() );
    }

    setLoading( true );
    setError( null );

    try {
      const reply = await apiPost< ReplyItem >( `feedback/${ feedbackId }/replies`, {
        reply_uuid: generateUUID(),
        comment: text.trim(),
        ...( mentionIds.length ? { mention_ids: mentionIds } : {} ),
        ...( isGuest ? { author: guestName.trim() } : {} ),
      } );
      setText( '' );
      setMentionIds( [] );
      if ( textareaRef.current ) {
        textareaRef.current.style.height = 'auto';
      }
      onPosted( reply );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : __( 'Failed to post reply.', 'markaroo' ) );
    } finally {
      setLoading( false );
    }
  }

  function handleSubmit( e: React.FormEvent ) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown( e: React.KeyboardEvent< HTMLTextAreaElement > ) {
    // Enter submits; Shift+Enter inserts a newline. Let the mention
    // autocomplete consume Enter while it's open.
    if ( e.key === 'Enter' && ! e.shiftKey && mentionQuery === null ) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form className="markaroo-reply-composer" onSubmit={ handleSubmit }>
      { isGuest && (
        <input
          className="markaroo-reply-composer__name"
          type="text"
          placeholder={ __( 'Your name', 'markaroo' ) }
          value={ guestName }
          onChange={ ( e ) => setGuestName( e.target.value ) }
          maxLength={ 191 }
        />
      ) }

      <div className="markaroo-reply-composer__pill">
        <Avatar name={ meName } src={ meAvatar } size={ 32 } />
        <div className="markaroo-reply-composer__input-wrap">
          <textarea
            ref={ textareaRef }
            className="markaroo-reply-composer__textarea"
            rows={ 1 }
            placeholder={ __( 'Reply', 'markaroo' ) }
            value={ text }
            onChange={ ( e ) => handleTextChange( e.target.value ) }
            onKeyDown={ handleKeyDown }
          />
          { mentionQuery !== null && (
            <MentionAutocomplete
              query={ mentionQuery }
              onSelect={ insertMention }
              onClose={ () => setMentionQuery( null ) }
            />
          ) }
        </div>
        <button
          className="markaroo-reply-composer__send"
          type="submit"
          aria-label={ loading ? __( 'Posting…', 'markaroo' ) : __( 'Reply', 'markaroo' ) }
          disabled={ loading || ! text.trim() }
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
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      { error && (
        <p className="markaroo-reply-composer__error" role="alert">
          { error }
        </p>
      ) }
    </form>
  );
}
