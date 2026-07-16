import { useState } from '@wordpress/element';

export function initials( name: string ): string {
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

interface Props {
  name: string;
  src?: string;
  size?: 24 | 32;
}

/**
 * Author avatar image with initials-chip fallback for guests/broken URLs.
 * @param root0
 * @param root0.name
 * @param root0.src
 * @param root0.size
 */
export function Avatar( { name, src, size = 24 }: Props ) {
  const [ failed, setFailed ] = useState( false );
  const cls = `markaroo-avatar markaroo-avatar--${ size }`;

  if ( src && ! failed ) {
    return (
      <img
        className={ cls }
        src={ src }
        alt=""
        aria-hidden="true"
        width={ size }
        height={ size }
        loading="lazy"
        onError={ () => setFailed( true ) }
      />
    );
  }
  return (
    <span className={ `${ cls } markaroo-avatar--initials` } aria-hidden="true">
      { initials( name ) }
    </span>
  );
}
