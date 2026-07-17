import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { FeedbackItem } from '../../../widget/types';
import { FeedbackDetailModal } from '../components/FeedbackDetailModal';
import { fetchFeedback, setStatus } from '../api';

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

const PER_COLUMN = 25;

interface Column {
  value: string;
  label: string;
}

function columns(): Column[] {
  return (
    window.markarooConfig.statusList ?? [
      { value: 'open', label: 'Open' },
      { value: 'in_progress', label: 'In progress' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'approved', label: 'Approved' },
    ]
  );
}

function cardTimeAgo( iso: string ): string {
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

function Card( {
  item,
  onDragStart,
  onOpen,
}: {
  item: FeedbackItem;
  onDragStart: ( id: number, from: string ) => void;
  onOpen: ( id: number ) => void;
} ) {
  return (
    <div
      className="markaroo-board-card"
      role="button"
      tabIndex={ 0 }
      draggable
      onDragStart={ () => onDragStart( item.id, item.status ) }
      onClick={ () => onOpen( item.id ) }
      onKeyDown={ ( e ) => {
        if ( e.key === 'Enter' || e.key === ' ' ) {
          e.preventDefault();
          onOpen( item.id );
        }
      } }
    >
      <div className="markaroo-board-card__top">
        <span className="markaroo-board-card__id">#{ item.id }</span>
        <span
          className="markaroo-admin-badge"
          style={ { backgroundColor: PRIORITY_COLORS[ item.priority ] ?? '#9ca3af' } }
        >
          { item.priority }
        </span>
      </div>
      { item.title && <p className="markaroo-board-card__title">{ item.title }</p> }
      { item.comment && (
        <p className="markaroo-board-card__comment">
          { item.comment.length > 100 ? item.comment.slice( 0, 100 ) + '…' : item.comment }
        </p>
      ) }
      <div className="markaroo-board-card__meta">
        { item.assigned_to_name && (
          <span className="markaroo-board-card__assignee">{ item.assigned_to_name }</span>
        ) }
        <span className="markaroo-board-card__time" title={ item.created_at }>
          { cardTimeAgo( item.created_at ) }
        </span>
      </div>
    </div>
  );
}

export function StatusBoardView() {
  const cols = columns();
  const [ byStatus, setByStatus ] = useState< Record< string, FeedbackItem[] > >( {} );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );
  const [ dragOver, setDragOver ] = useState< string | null >( null );
  const [ detailId, setDetailId ] = useState< number | null >( null );

  const load = useCallback( () => {
    setLoading( true );
    setError( null );

    Promise.all(
      cols.map( ( c ) => {
        const params = new URLSearchParams();
        params.set( 'status', c.value );
        params.set( 'per_page', String( PER_COLUMN ) );
        params.set( 'page', '1' );
        params.set( 'order_by', 'updated_at' );
        params.set( 'order', 'DESC' );
        return fetchFeedback( params ).then( ( body ) => [ c.value, body.data ?? [] ] as const );
      } )
    )
      .then( ( pairs ) => {
        const map: Record< string, FeedbackItem[] > = {};
        pairs.forEach( ( [ status, data ] ) => {
          map[ status ] = data;
        } );
        setByStatus( map );
      } )
      .catch( () => setError( __( 'Could not load the board.', 'markaroo' ) ) )
      .finally( () => setLoading( false ) );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect( () => {
    load();
  }, [ load ] );

  // Drag payload kept in a ref-like closure via state is fine here (single drag).
  const [ dragging, setDragging ] = useState< { id: number; from: string } | null >( null );

  function onDragStart( id: number, from: string ) {
    setDragging( { id, from } );
  }

  async function onDrop( to: string ) {
    setDragOver( null );
    if ( ! dragging || dragging.from === to ) {
      setDragging( null );
      return;
    }

    const { id, from } = dragging;
    setDragging( null );

    // Optimistic move.
    setByStatus( ( prev ) => {
      const source = prev[ from ] ?? [];
      const moved = source.find( ( i ) => i.id === id );
      if ( ! moved ) {
        return prev;
      }
      const src = source.filter( ( i ) => i.id !== id );
      const target = [
        { ...moved, status: to as FeedbackItem[ 'status' ] },
        ...( prev[ to ] ?? [] ),
      ];
      return { ...prev, [ from ]: src, [ to ]: target };
    } );

    try {
      await setStatus( id, to );
    } catch {
      setError( __( 'Could not move the card.', 'markaroo' ) );
      load(); // revert to server truth
    }
  }

  return (
    <div className="markaroo-board">
      <div className="markaroo-admin-tasklist__toolbar">
        <h2 className="markaroo-admin__section-title" style={ { margin: 0 } }>
          { __( 'Status board', 'markaroo' ) }
        </h2>
      </div>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }

      <div className="markaroo-board__columns">
        { cols.map( ( c ) => {
          const list = byStatus[ c.value ] ?? [];
          return (
            <div
              key={ c.value }
              className={ `markaroo-board__column${ dragOver === c.value ? ' is-over' : '' }` }
              onDragOver={ ( e ) => {
                e.preventDefault();
                setDragOver( c.value );
              } }
              onDragLeave={ () => setDragOver( ( prev ) => ( prev === c.value ? null : prev ) ) }
              onDrop={ () => onDrop( c.value ) }
            >
              <div className="markaroo-board__column-head">
                <span>{ c.label }</span>
                <span className="markaroo-board__column-count">{ list.length }</span>
              </div>
              <div className="markaroo-board__column-body">
                { loading && (
                  <div className="markaroo-board__loading">{ __( 'Loading…', 'markaroo' ) }</div>
                ) }
                { ! loading &&
                  list.map( ( item ) => (
                    <Card
                      key={ item.id }
                      item={ item }
                      onDragStart={ onDragStart }
                      onOpen={ setDetailId }
                    />
                  ) ) }
                { ! loading && list.length === 0 && (
                  <div className="markaroo-board__empty">{ __( 'Nothing here.', 'markaroo' ) }</div>
                ) }
              </div>
            </div>
          );
        } ) }
      </div>

      { detailId !== null && (
        <FeedbackDetailModal
          id={ detailId }
          onClose={ () => setDetailId( null ) }
          onChanged={ ( updated ) => {
            if ( ! updated ) {
              load();
              return;
            }
            // Status may have changed in the modal — move the card if needed.
            setByStatus( ( prev ) => {
              const next: Record< string, FeedbackItem[] > = {};
              Object.keys( prev ).forEach( ( status ) => {
                next[ status ] = prev[ status ].filter( ( i ) => i.id !== updated.id );
              } );
              next[ updated.status ] = [ updated, ...( next[ updated.status ] ?? [] ) ];
              return next;
            } );
          } }
        />
      ) }
    </div>
  );
}
