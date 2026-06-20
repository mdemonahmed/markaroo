import { useState, useRef } from '@wordpress/element';
import { MarkdownToolbar } from './MarkdownToolbar';
import { apiPost } from '../api';
import { uploadScreenshot } from '../capture/Screenshot';
import type { CaptureData, FeedbackItem } from '../types';

type Priority = 'urgent' | 'high' | 'normal' | 'low';

const PRIORITIES: { value: Priority; label: string }[] = [
	{ value: 'urgent', label: 'Urgent' },
	{ value: 'high',   label: 'High' },
	{ value: 'normal', label: 'Normal' },
	{ value: 'low',    label: 'Low' },
];

const GUEST_NAME_KEY = 'markaroo_guest_name';

function getPageKey(): string {
	return ( window.location.pathname.replace( /\/+$/, '' ) || '/' ) + window.location.search;
}

function getViewport(): string {
	return `${ window.innerWidth }x${ window.innerHeight }`;
}

interface Props {
	captureData: CaptureData;
	screenshotBlob: Blob | null;
	onSubmitted: ( item: FeedbackItem ) => void;
	onCancel: () => void;
}

export function ComposerPanel( { captureData, screenshotBlob, onSubmitted, onCancel }: Props ) {
	const config      = window.markarooConfig;
	const isGuest     = config.currentUser?.id === 0;
	const defaultPri  = ( config.settings?.['general.default_priority'] as Priority | undefined ) ?? 'normal';

	const textareaRef = useRef< HTMLTextAreaElement >( null );
	const [ comment,  setComment  ] = useState( '' );
	const [ priority, setPriority ] = useState< Priority >( defaultPri );
	const [ guestName, setGuestName ] = useState(
		() => ( typeof localStorage !== 'undefined' && localStorage.getItem( GUEST_NAME_KEY ) ) || ''
	);
	const [ error,    setError    ] = useState< string | null >( null );
	const [ loading,  setLoading  ] = useState( false );

	// Screenshot preview URL from blob.
	const previewUrl = screenshotBlob ? URL.createObjectURL( screenshotBlob ) : null;

	async function handleSubmit( e: React.FormEvent ) {
		e.preventDefault();

		if ( ! comment.trim() ) {
			setError( 'Comment cannot be empty.' );
			return;
		}

		if ( isGuest && ! guestName.trim() ) {
			setError( 'Please enter your name.' );
			return;
		}

		setError( null );
		setLoading( true );

		// Persist guest name for next time.
		if ( isGuest && typeof localStorage !== 'undefined' ) {
			localStorage.setItem( GUEST_NAME_KEY, guestName.trim() );
		}

		const payload: Record< string, unknown > = {
			comment,
			priority,
			page_key:      getPageKey(),
			page_url:      window.location.href,
			viewport:      getViewport(),
			user_agent:    navigator.userAgent,
			x:             captureData.x,
			y:             captureData.y,
			screenshot_rect: captureData.screenshotRect,
		};

		if ( isGuest ) {
			payload.author = guestName.trim();
		}

		/**
		 * Pro can add extra fields via markaroo/composer/fields filter.
		 * JS-side hook fires so UI extensions can inject data before POST.
		 */
		window.dispatchEvent(
			new CustomEvent( 'markaroo:composer-before-submit', { detail: { payload } } )
		);

		try {
			const item = await apiPost< FeedbackItem >( 'feedback', payload );

			// Deferred screenshot upload — non-fatal if it fails.
			if ( screenshotBlob && item.id ) {
				uploadScreenshot( item.id, screenshotBlob ).catch( () => null );
			}

			window.dispatchEvent(
				new CustomEvent( 'markaroo:feedback-submitted', { detail: { feedback: item } } )
			);

			onSubmitted( item );
		} catch ( err ) {
			setError( err instanceof Error ? err.message : 'Submission failed.' );
		} finally {
			setLoading( false );
		}
	}

	return (
		<div className="markaroo-composer" role="dialog" aria-label="New feedback">
			<div className="markaroo-composer__header">
				<span className="markaroo-composer__title">New feedback</span>
				<button
					className="markaroo-composer__close"
					type="button"
					aria-label="Cancel"
					onClick={ onCancel }
				>
					✕
				</button>
			</div>

			{ previewUrl && (
				<div className="markaroo-composer__preview">
					<img src={ previewUrl } alt="Screenshot preview" />
				</div>
			) }

			<form className="markaroo-composer__form" onSubmit={ handleSubmit } noValidate>

				{ isGuest && (
					<div className="markaroo-composer__field">
						<label htmlFor="markaroo-guest-name">Your name</label>
						<input
							id="markaroo-guest-name"
							type="text"
							className="markaroo-composer__input"
							value={ guestName }
							onChange={ ( e ) => setGuestName( e.target.value ) }
							placeholder="Enter your name"
							maxLength={ 191 }
							required
						/>
					</div>
				) }

				<div className="markaroo-composer__field markaroo-composer__field--comment">
					<label htmlFor="markaroo-comment">Comment</label>
					<MarkdownToolbar
						textareaRef={ textareaRef }
						value={ comment }
						onChange={ setComment }
					/>
					<textarea
						ref={ textareaRef }
						id="markaroo-comment"
						className="markaroo-composer__textarea"
						value={ comment }
						onChange={ ( e ) => setComment( e.target.value ) }
						placeholder="Describe the feedback…"
						rows={ 5 }
						required
					/>
				</div>

				<div className="markaroo-composer__field">
					<label htmlFor="markaroo-priority">Priority</label>
					<select
						id="markaroo-priority"
						className="markaroo-composer__select"
						value={ priority }
						onChange={ ( e ) => setPriority( e.target.value as Priority ) }
					>
						{ PRIORITIES.map( ( p ) => (
							<option key={ p.value } value={ p.value }>{ p.label }</option>
						) ) }
					</select>
				</div>

				{ error && (
					<div className="markaroo-composer__error" role="alert">
						{ error }
					</div>
				) }

				<div className="markaroo-composer__actions">
					<button
						type="button"
						className="markaroo-btn markaroo-btn--ghost"
						onClick={ onCancel }
						disabled={ loading }
					>
						Cancel
					</button>
					<button
						type="submit"
						className="markaroo-btn markaroo-btn--primary"
						disabled={ loading }
					>
						{ loading ? 'Submitting…' : 'Submit' }
					</button>
				</div>
			</form>
		</div>
	);
}
