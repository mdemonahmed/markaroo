import { useRef, useState } from '@wordpress/element';
import type { AttachmentMeta } from '../types';

const BADGE_COLORS: Record< string, string > = {
  PDF: '#ef4444',
  DOC: '#2563eb',
  DOCX: '#2563eb',
  XLS: '#16a34a',
  XLSX: '#16a34a',
  CSV: '#16a34a',
  TXT: '#6b7280',
};

function isImage( meta: AttachmentMeta ): boolean {
  return meta.mime.startsWith( 'image/' );
}

interface Props {
  attachments: AttachmentMeta[];
  onChange: ( attachments: AttachmentMeta[] ) => void;
}

export function AttachmentPicker( { attachments, onChange }: Props ) {
  const inputRef = useRef< HTMLInputElement >( null );
  const [ uploading, setUploading ] = useState( false );
  const [ error, setError ] = useState< string | null >( null );

  const config = window.markarooConfig;

  async function handleFiles( files: FileList | null ) {
    if ( ! files || files.length === 0 ) {
      return;
    }
    setError( null );
    setUploading( true );

    const headers: Record< string, string > = { 'X-WP-Nonce': config.nonce };
    if ( config.shareToken ) {
      headers[ 'X-Markaroo-Share' ] = config.shareToken;
    }

    const results: AttachmentMeta[] = [ ...attachments ];

    for ( const file of Array.from( files ) ) {
      const body = new FormData();
      body.append( 'file', file );

      try {
        const res = await fetch( `${ config.restUrl }markaroo/v1/attachments`, {
          method: 'POST',
          headers,
          body,
        } );
        if ( ! res.ok ) {
          const err = ( await res.json().catch( () => ( {} ) ) ) as { message?: string };
          setError( err.message ?? `Upload failed (${ res.status })` );
          continue;
        }
        const meta = ( await res.json() ) as AttachmentMeta;
        results.push( meta );
      } catch ( e ) {
        setError( 'Upload failed. Please try again.' );
      }
    }

    onChange( results );
    setUploading( false );
  }

  return (
    <div className="markaroo-attachments">
      <div className="markaroo-attachments__list">
        { attachments.map( ( a ) => (
          <div key={ a.id } className="markaroo-attachments__item">
            { isImage( a ) ? (
              <a href={ a.url } target="_blank" rel="noopener noreferrer">
                <img
                  className="markaroo-attachments__thumb"
                  src={ a.url }
                  alt={ a.filename }
                  loading="lazy"
                />
              </a>
            ) : (
              <a
                className="markaroo-attachments__file"
                href={ a.url }
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="markaroo-attachments__badge"
                  style={ { backgroundColor: BADGE_COLORS[ a.type_badge ] ?? '#6366f1' } }
                >
                  { a.type_badge }
                </span>
                <span className="markaroo-attachments__name">{ a.filename }</span>
              </a>
            ) }
            <button
              className="markaroo-attachments__remove"
              type="button"
              aria-label="Remove attachment"
              onClick={ () => onChange( attachments.filter( ( x ) => x.id !== a.id ) ) }
            >
              ×
            </button>
          </div>
        ) ) }
      </div>

      { error && (
        <p className="markaroo-attachments__error" role="alert">
          { error }
        </p>
      ) }

      <button
        className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm"
        type="button"
        disabled={ uploading }
        onClick={ () => inputRef.current?.click() }
      >
        { uploading ? 'Uploading…' : '+ Attach file' }
      </button>

      <input
        ref={ inputRef }
        type="file"
        multiple
        hidden
        onChange={ ( e ) => handleFiles( e.target.files ) }
        onClick={ ( e ) => {
          ( e.target as HTMLInputElement ).value = '';
        } }
      />
    </div>
  );
}
