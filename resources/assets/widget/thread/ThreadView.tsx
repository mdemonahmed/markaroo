import { useState, useEffect } from '@wordpress/element';
import { ReplyComposer } from './ReplyComposer';
import { AttachmentList } from './AttachmentList';
import { apiFetch, apiPatch, apiDelete } from '../api';
import { useWidgetDispatch } from '../store/WidgetContext';
import type { FeedbackItem, ReplyItem } from '../types';

function timeAgo( iso: string ): string {
	const diff = Date.now() - new Date( iso ).getTime();
	const m    = Math.floor( diff / 60000 );
	if ( m < 1 )  return 'just now';
	if ( m < 60 ) return `${ m }m ago`;
	const h = Math.floor( m / 60 );
	if ( h < 24 ) return `${ h }h ago`;
	return `${ Math.floor( h / 24 ) }d ago`;
}

interface ReplyRowProps {
	reply:      ReplyItem;
	canEdit:    boolean;
	onUpdated:  ( r: ReplyItem ) => void;
	onDeleted:  ( id: number ) => void;
}

function ReplyRow( { reply, canEdit, onUpdated, onDeleted }: ReplyRowProps ) {
	const [ editing, setEditing ]   = useState( false );
	const [ draft,   setDraft   ]   = useState( reply.comment );
	const [ confirm, setConfirm ]   = useState( false );

	async function saveEdit() {
		if ( ! draft.trim() ) return;
		try {
			const updated = await apiPatch< ReplyItem >( `replies/${ reply.id }`, { comment: draft.trim() } );
			onUpdated( updated );
			setEditing( false );
		} catch { setEditing( false ); }
	}

	async function confirmDelete() {
		await apiDelete( `replies/${ reply.id }` ).catch( () => null );
		onDeleted( reply.id );
	}

	return (
		<div className="markaroo-reply">
			<div className="markaroo-reply__meta">
				<span className="markaroo-reply__author">{ reply.author }</span>
				<span className="markaroo-reply__time" title={ reply.created_at }>
					{ timeAgo( reply.created_at ) }
				</span>
			</div>

			{ editing ? (
				<div className="markaroo-reply__edit">
					<textarea
						className="markaroo-reply__edit-textarea"
						value={ draft }
						onChange={ ( e ) => setDraft( e.target.value ) }
						rows={ 2 }
						autoFocus
					/>
					<div className="markaroo-reply__edit-actions">
						<button className="markaroo-btn markaroo-btn--primary markaroo-btn--sm" type="button" onClick={ saveEdit }>Save</button>
						<button className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm" type="button" onClick={ () => setEditing( false ) }>Cancel</button>
					</div>
				</div>
			) : (
				<p className="markaroo-reply__body">{ reply.comment }</p>
			) }

			{ canEdit && ! editing && (
				<div className="markaroo-reply__actions">
					<button className="markaroo-reply__action" type="button" onClick={ () => setEditing( true ) }>Edit</button>
					{ ! confirm
						? <button className="markaroo-reply__action markaroo-reply__action--danger" type="button" onClick={ () => setConfirm( true ) }>Delete</button>
						: <>
							<span className="markaroo-reply__confirm-text">Sure?</span>
							<button className="markaroo-reply__action markaroo-reply__action--danger" type="button" onClick={ confirmDelete }>Yes</button>
							<button className="markaroo-reply__action" type="button" onClick={ () => setConfirm( false ) }>No</button>
						</>
					}
				</div>
			) }
		</div>
	);
}

interface Props {
	feedback: FeedbackItem;
	onClose:  () => void;
}

export function ThreadView( { feedback, onClose }: Props ) {
	const dispatch = useWidgetDispatch();
	const config   = window.markarooConfig;
	const userId   = config?.currentUser?.id ?? 0;
	const canManage = config?.currentUser?.canManage ?? false;

	const [ item,    setItem    ] = useState< FeedbackItem >( feedback );
	const [ replies, setReplies ] = useState< ReplyItem[] >( [] );
	const [ loading, setLoading ] = useState( true );
	const [ editingComment, setEditingComment ] = useState( false );
	const [ commentDraft,   setCommentDraft   ] = useState( feedback.comment );
	const [ confirmDelete,  setConfirmDelete  ] = useState( false );

	useEffect( () => {
		apiFetch< FeedbackItem & { replies: ReplyItem[] } >( `feedback/${ feedback.id }` )
			.then( ( data ) => {
				setItem( data );
				setReplies( data.replies ?? [] );
			} )
			.catch( () => null )
			.finally( () => setLoading( false ) );
	}, [ feedback.id ] ); // eslint-disable-line react-hooks/exhaustive-deps

	async function saveComment() {
		try {
			const updated = await apiPatch< FeedbackItem >( `feedback/${ item.id }`, { comment: commentDraft } );
			setItem( updated );
			dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
			setEditingComment( false );
		} catch { setEditingComment( false ); }
	}

	async function handleDelete() {
		await apiDelete( `feedback/${ item.id }` ).catch( () => null );
		dispatch( { type: 'FEEDBACK_DELETED', id: item.id } );
		onClose();
	}

	async function toggleResolve() {
		const ep      = item.status === 'open' ? `feedback/${ item.id }/resolve` : `feedback/${ item.id }/unresolve`;
		const updated = await apiFetch< FeedbackItem >( ep, { method: 'POST', body: '' } ).catch( () => null );
		if ( updated ) {
			setItem( updated );
			dispatch( { type: 'FEEDBACK_UPDATED', item: updated } );
		}
	}

	const canEditComment  = canManage || userId === item.author_id;
	const canDeleteItem   = canManage || userId === item.author_id;
	const canResolve      = canManage;
	const canReply        = config?.currentUser?.canCreate || config?.shareRights?.canComment;

	return (
		<div className="markaroo-thread">
			<div className="markaroo-thread__header">
				<button className="markaroo-thread__back" type="button" onClick={ onClose } aria-label="Back">←</button>
				<span className="markaroo-thread__title">Feedback #{ item.id }</span>
				{ canResolve && (
					<button
						className={ `markaroo-btn markaroo-btn--sm ${ item.status === 'resolved' ? 'markaroo-btn--ghost' : 'markaroo-btn--primary' }` }
						type="button"
						onClick={ toggleResolve }
					>
						{ item.status === 'resolved' ? 'Unresolve' : 'Resolve' }
					</button>
				) }
			</div>

			<div className="markaroo-thread__body">
				{ /* Main comment */ }
				<div className="markaroo-thread__comment">
					<div className="markaroo-reply__meta">
						<span className="markaroo-reply__author">{ item.author }</span>
						<span className="markaroo-reply__time">{ timeAgo( item.created_at ) }</span>
					</div>

					{ editingComment ? (
						<div className="markaroo-reply__edit">
							<textarea
								className="markaroo-reply__edit-textarea"
								value={ commentDraft }
								onChange={ ( e ) => setCommentDraft( e.target.value ) }
								rows={ 3 }
								autoFocus
							/>
							<div className="markaroo-reply__edit-actions">
								<button className="markaroo-btn markaroo-btn--primary markaroo-btn--sm" type="button" onClick={ saveComment }>Save</button>
								<button className="markaroo-btn markaroo-btn--ghost markaroo-btn--sm" type="button" onClick={ () => setEditingComment( false ) }>Cancel</button>
							</div>
						</div>
					) : (
						<p className="markaroo-thread__comment-body">{ item.comment }</p>
					) }

					{ ( canEditComment || canDeleteItem ) && ! editingComment && (
						<div className="markaroo-reply__actions">
							{ canEditComment && <button className="markaroo-reply__action" type="button" onClick={ () => setEditingComment( true ) }>Edit</button> }
							{ canDeleteItem && ! confirmDelete && (
								<button className="markaroo-reply__action markaroo-reply__action--danger" type="button" onClick={ () => setConfirmDelete( true ) }>Delete</button>
							) }
							{ confirmDelete && (
								<>
									<span className="markaroo-reply__confirm-text">Delete this feedback?</span>
									<button className="markaroo-reply__action markaroo-reply__action--danger" type="button" onClick={ handleDelete }>Yes, delete</button>
									<button className="markaroo-reply__action" type="button" onClick={ () => setConfirmDelete( false ) }>Cancel</button>
								</>
							) }
						</div>
					) }
				</div>

				{ /* Screenshot thumb */ }
				{ item.screenshot_url && (
					<img className="markaroo-thread__screenshot" src={ item.screenshot_url } alt="Screenshot" loading="lazy" />
				) }

				{ /* Attachments */ }
				<AttachmentList attachments={ item.attachments } />

				{ /* Replies */ }
				<div className="markaroo-thread__replies">
					{ loading && <p className="markaroo-thread__loading">Loading…</p> }
					{ replies.map( ( r ) => (
						<ReplyRow
							key={ r.id }
							reply={ r }
							canEdit={ canManage || userId === r.author_id }
							onUpdated={ ( updated ) => setReplies( ( prev ) => prev.map( ( x ) => x.id === updated.id ? updated : x ) ) }
							onDeleted={ ( id ) => setReplies( ( prev ) => prev.filter( ( x ) => x.id !== id ) ) }
						/>
					) ) }
				</div>

				{ canReply && (
					<ReplyComposer
						feedbackId={ item.id }
						onPosted={ ( r ) => setReplies( ( prev ) => [ ...prev, r ] ) }
					/>
				) }
			</div>
		</div>
	);
}
