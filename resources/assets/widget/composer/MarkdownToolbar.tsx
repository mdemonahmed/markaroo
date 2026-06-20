import type { RefObject } from '@wordpress/element';

interface ToolbarAction {
	label: string;
	icon: React.ReactNode;
	apply: ( selected: string ) => { text: string; offset: number };
}

const ACTIONS: ToolbarAction[] = [
	{
		label: 'Bold',
		icon: <strong>B</strong>,
		apply: ( s ) => ( { text: `**${ s || 'bold' }**`, offset: s ? 0 : -2 } ),
	},
	{
		label: 'Italic',
		icon: <em>I</em>,
		apply: ( s ) => ( { text: `*${ s || 'italic' }*`, offset: s ? 0 : -1 } ),
	},
	{
		label: 'Bullet list',
		icon: '≡',
		apply: ( s ) => ( { text: `\n- ${ s || 'item' }`, offset: s ? 0 : 0 } ),
	},
	{
		label: 'Numbered list',
		icon: '1.',
		apply: ( s ) => ( { text: `\n1. ${ s || 'item' }`, offset: s ? 0 : 0 } ),
	},
	{
		label: 'Link',
		icon: '🔗',
		apply: ( s ) => ( { text: `[${ s || 'text' }](url)`, offset: s ? -1 - 3 : -1 - 3 } ),
	},
	{
		label: 'Code',
		icon: <code>{'<>'}</code>,
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
		if ( ! el ) return;

		const start = el.selectionStart;
		const end   = el.selectionEnd;
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
