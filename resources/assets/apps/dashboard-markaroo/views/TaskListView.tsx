import { useState, useEffect, useCallback } from '@wordpress/element';
import type { FeedbackItem } from '../../../../widget/types';

const PRIORITIES = [
  { value: '', label: 'All priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
];

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

const PRIORITY_COLORS: Record< string, string > = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

interface Filters {
  status: string;
  priority: string;
  search: string;
  order_by: string;
  order: 'ASC' | 'DESC';
  page: number;
}

function useDebouncedValue< T >( value: T, delay = 300 ): T {
  const [ debounced, setDebounced ] = useState( value );
  useEffect( () => {
    const id = setTimeout( () => setDebounced( value ), delay );
    return () => clearTimeout( id );
  }, [ value, delay ] );
  return debounced;
}

function timeAgo( iso: string ): string {
  const diff = Date.now() - new Date( iso ).getTime();
  const m = Math.floor( diff / 60000 );
  if ( m < 1 ) {
    return 'just now';
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

function PriorityBadge( { priority }: { priority: string } ) {
  return (
    <span
      className="markaroo-admin-badge"
      style={ { backgroundColor: PRIORITY_COLORS[ priority ] ?? '#9ca3af' } }
    >
      { priority }
    </span>
  );
}

export function TaskListView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';

  const [ filters, setFilters ] = useState< Filters >( {
    status: 'open',
    priority: '',
    search: '',
    order_by: 'created_at',
    order: 'DESC',
    page: 1,
  } );

  const [ items, setItems ] = useState< FeedbackItem[] >( [] );
  const [ total, setTotal ] = useState( 0 );
  const [ pages, setPages ] = useState( 1 );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );

  const debouncedSearch = useDebouncedValue( filters.search );

  const load = useCallback( () => {
    setLoading( true );
    setError( null );

    const params = new URLSearchParams();
    if ( filters.status ) {
      params.set( 'status', filters.status );
    }
    if ( filters.priority ) {
      params.set( 'priority', filters.priority );
    }
    if ( debouncedSearch ) {
      params.set( 'search', debouncedSearch );
    }
    params.set( 'order_by', filters.order_by );
    params.set( 'order', filters.order );
    params.set( 'per_page', '25' );
    params.set( 'page', String( filters.page ) );

    fetch( `${ restBase }feedback?${ params }`, { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) => {
        if ( ! r.ok ) {
          throw new Error( String( r.status ) );
        }
        return r.json() as Promise< {
          data: FeedbackItem[];
          meta: { total: number; pages: number };
        } >;
      } )
      .then( ( body ) => {
        setItems( body.data ?? [] );
        setTotal( body.meta?.total ?? 0 );
        setPages( body.meta?.pages ?? 1 );
      } )
      .catch( () => setError( 'Could not load reviews.' ) )
      .finally( () => setLoading( false ) );
  }, [ filters, debouncedSearch, restBase, config.nonce ] ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => {
    load();
  }, [ load ] );

  function setFilter< K extends keyof Filters >( key: K, value: Filters[ K ] ) {
    setFilters( ( prev ) => ( {
      ...prev,
      [ key ]: value,
      page: key === 'page' ? ( value as number ) : 1,
    } ) );
  }

  function toggleSort( col: string ) {
    setFilters( ( prev ) => ( {
      ...prev,
      order_by: col,
      order: prev.order_by === col && prev.order === 'DESC' ? 'ASC' : 'DESC',
      page: 1,
    } ) );
  }

  function SortButton( { col, label }: { col: string; label: string } ) {
    const active = filters.order_by === col;
    return (
      <button
        type="button"
        className={ `markaroo-admin-sort${ active ? ' markaroo-admin-sort--active' : '' }` }
        onClick={ () => toggleSort( col ) }
      >
        { label }
        { active ? ( filters.order === 'DESC' ? ' ↓' : ' ↑' ) : '' }
      </button>
    );
  }

  const frontUrl = config.restUrl.replace( '/wp-json/', '/' );

  return (
    <div className="markaroo-admin-tasklist">
      <div className="markaroo-admin-tasklist__toolbar">
        <h2 className="markaroo-admin__section-title" style={ { margin: 0 } }>
          All Reviews
        </h2>

        <div className="markaroo-admin-tasklist__filters">
          <select
            value={ filters.status }
            onChange={ ( e ) => setFilter( 'status', e.target.value ) }
          >
            { STATUSES.map( ( s ) => (
              <option key={ s.value } value={ s.value }>
                { s.label }
              </option>
            ) ) }
          </select>

          <select
            value={ filters.priority }
            onChange={ ( e ) => setFilter( 'priority', e.target.value ) }
          >
            { PRIORITIES.map( ( p ) => (
              <option key={ p.value } value={ p.value }>
                { p.label }
              </option>
            ) ) }
          </select>

          <input
            type="search"
            placeholder="Search…"
            value={ filters.search }
            onChange={ ( e ) => setFilter( 'search', e.target.value ) }
            className="markaroo-admin-tasklist__search"
          />

          <span className="markaroo-admin-tasklist__count">
            { loading ? '…' : `${ total } item${ total !== 1 ? 's' : '' }` }
          </span>
        </div>
      </div>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }

      <table className="markaroo-admin-table markaroo-admin-tasklist__table">
        <thead>
          <tr>
            <th>
              <SortButton col="created_at" label="#" />
            </th>
            <th>Comment</th>
            <th>
              <SortButton col="status" label="Status" />
            </th>
            <th>
              <SortButton col="priority" label="Priority" />
            </th>
            <th>Assignee</th>
            <th>
              <SortButton col="due_date" label="Due" />
            </th>
            <th>
              <SortButton col="created_at" label="Created" />
            </th>
            <th>Page</th>
          </tr>
        </thead>
        <tbody>
          { loading && (
            <tr>
              <td colSpan={ 8 } className="markaroo-admin-tasklist__loading-row">
                Loading…
              </td>
            </tr>
          ) }
          { ! loading && items.length === 0 && (
            <tr>
              <td
                colSpan={ 8 }
                className="markaroo-admin__empty"
                style={ { padding: '20px', textAlign: 'center' } }
              >
                No reviews found.
              </td>
            </tr>
          ) }
          { items.map( ( item ) => (
            <tr key={ item.id }>
              <td>
                <a
                  href={ `${ frontUrl.replace( /\/$/, '' ) }${ item.page_key }?markaroo_open=${
                    item.id
                  }` }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="markaroo-admin-link"
                >
                  #{ item.id }
                </a>
              </td>
              <td className="markaroo-admin-tasklist__comment">
                { item.comment.length > 80 ? item.comment.slice( 0, 80 ) + '…' : item.comment }
              </td>
              <td>
                <span className={ `markaroo-admin-status markaroo-admin-status--${ item.status }` }>
                  { item.status }
                </span>
              </td>
              <td>
                <PriorityBadge priority={ item.priority } />
              </td>
              <td>{ item.assigned_to_name || <em style={ { color: '#9ca3af' } }>—</em> }</td>
              <td>
                { item.due_date ? (
                  <span
                    className={
                      new Date( item.due_date ) < new Date() && item.status === 'open'
                        ? 'markaroo-admin-overdue'
                        : ''
                    }
                  >
                    { new Date( item.due_date ).toLocaleDateString() }
                  </span>
                ) : (
                  '—'
                ) }
              </td>
              <td title={ item.created_at }>{ timeAgo( item.created_at ) }</td>
              <td>
                <code className="markaroo-admin-page-key">{ item.page_key }</code>
              </td>
            </tr>
          ) ) }
        </tbody>
      </table>

      { pages > 1 && (
        <div className="markaroo-admin-pagination">
          <button
            type="button"
            className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
            disabled={ filters.page <= 1 }
            onClick={ () => setFilter( 'page', filters.page - 1 ) }
          >
            ← Prev
          </button>
          <span>
            { filters.page } / { pages }
          </span>
          <button
            type="button"
            className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
            disabled={ filters.page >= pages }
            onClick={ () => setFilter( 'page', filters.page + 1 ) }
          >
            Next →
          </button>
        </div>
      ) }
    </div>
  );
}
