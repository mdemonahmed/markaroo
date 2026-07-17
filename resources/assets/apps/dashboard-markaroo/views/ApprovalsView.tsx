import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Check, RotateCcw } from 'lucide-react';
import type { FeedbackItem } from '../../../widget/types';
import { FeedbackDetailModal } from '../components/FeedbackDetailModal';
import { stripMarkdown } from '../../../widget/support/renderMarkdown';
import { fetchFeedback, approveFeedback, reopenFeedback } from '../api';

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

function timeAgo( iso: string ): string {
  const diff = Date.now() - new Date( iso ).getTime();
  const m = Math.floor( diff / 60000 );
  if ( m < 1 ) {
    return __( 'just now', 'markaroo' );
  }
  if ( m < 60 ) {
    return `${ m }m`;
  }
  const h = Math.floor( m / 60 );
  if ( h < 24 ) {
    return `${ h }h`;
  }
  return `${ Math.floor( h / 24 ) }d`;
}

/**
 * Approvals workflow. Lists resolved items awaiting sign-off using the same
 * table design as All Feedback, plus Approve/Reopen actions per row and in
 * the shared detail modal.
 */
export function ApprovalsView() {
  const config = window.markarooConfig;
  const canApprove = !! config.currentUser?.canApprove;

  const [ items, setItems ] = useState< FeedbackItem[] >( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );
  const [ busyId, setBusyId ] = useState< number | null >( null );
  const [ detailId, setDetailId ] = useState< number | null >( null );

  const load = useCallback( () => {
    setLoading( true );
    const params = new URLSearchParams( {
      status: 'resolved',
      per_page: '50',
      order_by: 'updated_at',
      order: 'DESC',
    } );
    fetchFeedback( params )
      .then( ( body ) => setItems( body.data ?? [] ) )
      .catch( () => setError( __( 'Could not load approvals.', 'markaroo' ) ) )
      .finally( () => setLoading( false ) );
  }, [] );

  useEffect( () => {
    load();
  }, [ load ] );

  async function act( id: number, action: 'approve' | 'reopen' ) {
    setBusyId( id );
    setError( null );
    try {
      await ( action === 'approve' ? approveFeedback( id ) : reopenFeedback( id ) );
      // Either action removes the row from the "awaiting approval" list.
      setItems( ( prev ) => prev.filter( ( i ) => i.id !== id ) );
    } catch {
      setError( __( 'Action failed. Please try again.', 'markaroo' ) );
    } finally {
      setBusyId( null );
    }
  }

  if ( loading ) {
    return <p className="markaroo-admin__loading">{ __( 'Loading…', 'markaroo' ) }</p>;
  }

  return (
    <div className="markaroo-admin-approvals">
      <h2 className="markaroo-admin__section-title">{ __( 'Approvals', 'markaroo' ) }</h2>
      <p className="markaroo-getstarted__sub">
        { __( 'Resolved items awaiting sign-off.', 'markaroo' ) }
      </p>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }
      { ! canApprove && (
        <div className="markaroo-admin__error-box">
          { __(
            'You can review these items, but only an approver can sign them off.',
            'markaroo'
          ) }
        </div>
      ) }

      { items.length === 0 ? (
        <p className="markaroo-admin__empty">{ __( 'Nothing awaiting approval.', 'markaroo' ) }</p>
      ) : (
        <table className="markaroo-admin-table markaroo-admin-tasklist__table">
          <thead>
            <tr>
              <th>{ __( 'ID', 'markaroo' ) }</th>
              <th>{ __( 'Title', 'markaroo' ) }</th>
              <th>{ __( 'Comment', 'markaroo' ) }</th>
              <th>{ __( 'Priority', 'markaroo' ) }</th>
              <th>{ __( 'Assignee', 'markaroo' ) }</th>
              <th>{ __( 'Updated', 'markaroo' ) }</th>
              <th>{ __( 'Page', 'markaroo' ) }</th>
              <th>{ __( 'Actions', 'markaroo' ) }</th>
            </tr>
          </thead>
          <tbody>
            { items.map( ( item ) => (
              <tr
                key={ item.id }
                className="markaroo-admin-table__row"
                onClick={ () => setDetailId( item.id ) }
              >
                <td>#{ item.id }</td>
                <td className="markaroo-admin-tasklist__title">
                  { item.title || <em style={ { color: '#9ca3af' } }>—</em> }
                </td>
                <td className="markaroo-admin-tasklist__comment">
                  { ( () => {
                    const plain = stripMarkdown( item.comment );
                    return plain.length > 60 ? plain.slice( 0, 60 ) + '…' : plain;
                  } )() }
                </td>
                <td>
                  <span
                    className="markaroo-admin-badge"
                    style={ { backgroundColor: PRIORITY_COLORS[ item.priority ] ?? '#9ca3af' } }
                  >
                    { item.priority }
                  </span>
                </td>
                <td>{ item.assigned_to_name || <em style={ { color: '#9ca3af' } }>—</em> }</td>
                <td title={ item.updated_at }>{ timeAgo( item.updated_at ) }</td>
                <td>
                  <code className="markaroo-admin-page-key">{ item.page_key }</code>
                </td>
                <td
                  className="markaroo-admin-approvals__actions"
                  onClick={ ( e ) => e.stopPropagation() }
                >
                  { canApprove && (
                    <button
                      type="button"
                      className="markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm"
                      disabled={ busyId === item.id }
                      onClick={ () => act( item.id, 'approve' ) }
                    >
                      <Check size={ 15 } strokeWidth={ 2 } />
                      { __( 'Approve', 'markaroo' ) }
                    </button>
                  ) }
                  <button
                    type="button"
                    className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                    disabled={ busyId === item.id }
                    onClick={ () => act( item.id, 'reopen' ) }
                  >
                    <RotateCcw size={ 15 } strokeWidth={ 2 } />
                    { __( 'Reopen', 'markaroo' ) }
                  </button>
                </td>
              </tr>
            ) ) }
          </tbody>
        </table>
      ) }

      { detailId !== null && (
        <FeedbackDetailModal
          id={ detailId }
          showApprovalActions
          onClose={ () => setDetailId( null ) }
          onChanged={ ( updated ) => {
            // Approving or reopening moves the item out of "resolved".
            if ( updated && updated.status !== 'resolved' ) {
              setItems( ( prev ) => prev.filter( ( i ) => i.id !== updated.id ) );
            } else if ( updated ) {
              setItems( ( prev ) => prev.map( ( i ) => ( i.id === updated.id ? updated : i ) ) );
            } else {
              load();
            }
          } }
        />
      ) }
    </div>
  );
}
