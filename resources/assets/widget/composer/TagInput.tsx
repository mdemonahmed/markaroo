import { useState } from '@wordpress/element';

interface Props {
  tags: string[];
  onChange: ( tags: string[] ) => void;
}

export function TagInput( { tags, onChange }: Props ) {
  const [ input, setInput ] = useState( '' );

  const cfg = window.markarooConfig;
  const available = ( cfg?.settings?.[ 'tasks.available_tags' ] as string[] | undefined ) ?? [];

  function addTag( tag: string ) {
    const t = tag.trim().toLowerCase();
    if ( t && ! tags.includes( t ) ) {
      onChange( [ ...tags, t ] );
    }
    setInput( '' );
  }

  function handleKey( e: React.KeyboardEvent< HTMLInputElement > ) {
    if ( e.key === 'Enter' || e.key === ',' ) {
      e.preventDefault();
      addTag( input );
    } else if ( e.key === 'Backspace' && ! input && tags.length ) {
      onChange( tags.slice( 0, -1 ) );
    }
  }

  return (
    <div className="markaroo-tag-input">
      <div className="markaroo-tag-input__chips">
        { tags.map( ( t ) => (
          <span key={ t } className="markaroo-tag-input__chip">
            { t }
            <button
              type="button"
              className="markaroo-tag-input__remove"
              aria-label={ `Remove ${ t }` }
              onClick={ () => onChange( tags.filter( ( x ) => x !== t ) ) }
            >
              ×
            </button>
          </span>
        ) ) }
        <input
          className="markaroo-tag-input__field"
          type="text"
          placeholder={ tags.length ? '' : 'Add tags…' }
          value={ input }
          list="markaroo-tag-suggestions"
          onChange={ ( e ) => setInput( e.target.value ) }
          onKeyDown={ handleKey }
          onBlur={ () => {
            if ( input ) {
              addTag( input );
            }
          } }
        />
      </div>
      { available.length > 0 && (
        <datalist id="markaroo-tag-suggestions">
          { available
            .filter( ( t ) => ! tags.includes( t ) )
            .map( ( t ) => (
              <option key={ t } value={ t } />
            ) ) }
        </datalist>
      ) }
    </div>
  );
}
