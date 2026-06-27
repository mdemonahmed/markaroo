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

export function AttachmentList( { attachments }: { attachments: AttachmentMeta[] } ) {
  if ( ! attachments || attachments.length === 0 ) {
    return null;
  }

  return (
    <div className="markaroo-attachments markaroo-attachments--view">
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
        </div>
      ) ) }
    </div>
  );
}
