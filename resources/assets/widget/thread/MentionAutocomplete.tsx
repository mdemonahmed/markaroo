import { useState, useEffect, useRef } from '@wordpress/element';
import { apiFetch } from '../api';

interface WPUser {
  id: number;
  name: string;
}

interface Props {
  query: string;
  onSelect: ( user: WPUser ) => void;
  onClose: () => void;
}

export function MentionAutocomplete( { query, onSelect, onClose }: Props ) {
  const [ users, setUsers ] = useState< WPUser[] >( [] );
  const ref = useRef< HTMLDivElement >( null );

  useEffect( () => {
    if ( ! query ) {
      setUsers( [] );
      return;
    }
    apiFetch< WPUser[] >( `users?search=${ encodeURIComponent( query ) }&per_page=6` )
      .then( setUsers )
      .catch( () => setUsers( [] ) );
  }, [ query ] );

  // Close on outside click.
  useEffect( () => {
    function handle( e: MouseEvent ) {
      if ( ref.current && ! ref.current.contains( e.target as Node ) ) {
        onClose();
      }
    }
    document.addEventListener( 'mousedown', handle );
    return () => document.removeEventListener( 'mousedown', handle );
  }, [ onClose ] );

  if ( users.length === 0 ) {
    return null;
  }

  return (
    <div
      ref={ ref }
      className="markaroo-mention-popup"
      role="listbox"
      aria-label="Mention suggestions"
    >
      { users.map( ( u ) => (
        <button
          key={ u.id }
          className="markaroo-mention-popup__item"
          role="option"
          type="button"
          onMouseDown={ ( e ) => {
            e.preventDefault();
            onSelect( u );
          } }
        >
          { u.name }
        </button>
      ) ) }
    </div>
  );
}
