import { useState, useEffect, useRef } from '@wordpress/element';
import { fetchUsers } from '../api';

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

  // Filter the shared, once-per-session users list client-side instead of
  // hitting the REST API on every keystroke. An empty query (just typed `@`)
  // lists everyone so the user can pick without typing a name first.
  useEffect( () => {
    let cancelled = false;
    const q = query.toLowerCase();
    fetchUsers()
      .then( ( all ) => {
        if ( ! cancelled ) {
          const matched = q ? all.filter( ( u ) => u.name.toLowerCase().includes( q ) ) : all;
          setUsers( matched.slice( 0, 6 ) );
        }
      } )
      .catch( () => setUsers( [] ) );
    return () => {
      cancelled = true;
    };
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
