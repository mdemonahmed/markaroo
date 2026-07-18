import type { RefObject } from '@wordpress/element';

interface ToolbarAction {
  label: string;
  icon: React.ReactNode;
  apply: ( selected: string ) => { text: string; offset: number };
}

/**
 * Shared SVG wrapper so every toolbar glyph has identical weight and size.
 * @param root0
 * @param root0.children
 */
function Icon( { children }: { children: React.ReactNode } ) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      { children }
    </svg>
  );
}

const ACTIONS: ToolbarAction[] = [
  {
    label: 'Bold',
    icon: (
      <Icon>
        <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
      </Icon>
    ),
    apply: ( s ) => ( { text: `**${ s || 'bold' }**`, offset: s ? 0 : -2 } ),
  },
  {
    label: 'Italic',
    icon: (
      <Icon>
        <path d="M10 5h8M6 19h8M14 5l-4 14" />
      </Icon>
    ),
    apply: ( s ) => ( { text: `*${ s || 'italic' }*`, offset: s ? 0 : -1 } ),
  },
  {
    label: 'Bullet list',
    icon: (
      <Icon>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
      </Icon>
    ),
    apply: ( s ) => ( { text: `\n- ${ s || 'item' }`, offset: s ? 0 : 0 } ),
  },
  {
    label: 'Numbered list',
    icon: (
      <Icon>
        <path d="M10 6h10M10 12h10M10 18h10M4 5v3M3 8h2M3 15h2a1 1 0 0 1 0 2H3.5M3 19h2" />
      </Icon>
    ),
    apply: ( s ) => ( { text: `\n1. ${ s || 'item' }`, offset: s ? 0 : 0 } ),
  },
  {
    label: 'Link',
    icon: (
      <Icon>
        <path d="M9 15l6-6M10.5 6.5l1.7-1.7a4 4 0 0 1 5.7 5.7l-1.7 1.7M13.5 17.5l-1.7 1.7a4 4 0 0 1-5.7-5.7l1.7-1.7" />
      </Icon>
    ),
    apply: ( s ) => ( { text: `[${ s || 'text' }](url)`, offset: s ? -1 - 3 : -1 - 3 } ),
  },
  {
    label: 'Code',
    icon: (
      <Icon>
        <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
      </Icon>
    ),
    apply: ( s ) => ( { text: `\`${ s || 'code' }\``, offset: s ? 0 : -1 } ),
  },
];

interface Props {
  textareaRef: RefObject< HTMLTextAreaElement >;
  value: string;
  onChange: ( v: string ) => void;
}

export function MarkdownToolbar( { textareaRef, value, onChange }: Props ) {
  function applyAction( action: ToolbarAction ) {
    const el = textareaRef.current;
    if ( ! el ) {
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice( start, end );
    const { text, offset } = action.apply( selected );

    const next = value.slice( 0, start ) + text + value.slice( end );
    onChange( next );

    // Restore cursor after React re-renders.
    requestAnimationFrame( () => {
      const cursor = start + text.length + offset;
      el.setSelectionRange( cursor, cursor );
      el.focus();
    } );
  }

  return (
    <div className="markaroo-composer-toolbar" role="toolbar" aria-label="Markdown toolbar">
      { ACTIONS.map( ( action ) => (
        <button
          key={ action.label }
          type="button"
          className="markaroo-composer-toolbar__btn"
          title={ action.label }
          aria-label={ action.label }
          onMouseDown={ ( e ) => {
            // Prevent textarea from losing focus.
            e.preventDefault();
            applyAction( action );
          } }
        >
          { action.icon }
        </button>
      ) ) }
    </div>
  );
}
