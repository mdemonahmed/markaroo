import { useEffect } from '@wordpress/element';

interface Props {
  src: string;
  onClose: () => void;
}

export function Lightbox( { src, onClose }: Props ) {
  useEffect( () => {
    function onKey( e: KeyboardEvent ) {
      if ( e.key === 'Escape' ) {
        onClose();
      }
    }
    document.addEventListener( 'keydown', onKey );
    return () => document.removeEventListener( 'keydown', onKey );
  }, [ onClose ] );

  return (
    <div
      className="markaroo-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot preview"
    >
      <button
        className="markaroo-lightbox__backdrop"
        type="button"
        aria-label="Close preview"
        onClick={ onClose }
      />
      <img className="markaroo-lightbox__img" src={ src } alt="Pinned content" />
      <button
        className="markaroo-lightbox__close"
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
    </div>
  );
}
