import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { FeedbackItem } from '../../../../widget/types';
import {
  fetchFeedback,
  bulkFeedback,
  exportCsv,
  getSettings,
  saveSavedFilters,
  type SavedFilter,
} from '../api';

const PRIORITIES = [
  { value: '', label: __( 'All priorities', 'markaroo' ) },
  { value: 'urgent', label: __( 'Urgent', 'markaroo' ) },
  { value: 'high', label: __( 'High', 'markaroo' ) },
  { value: 'normal', label: __( 'Normal', 'markaroo' ) },
  { value: 'low', label: __( 'Low', 'markaroo' ) },
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
  assignee: number;
  tag: string;
  search: string;
  order_by: string;
  order: 'ASC' | 'DESC';
  page: number;
}

const DEFAULT_FILTERS: Filters = {
  status: 'open',
  priority: '',
  assignee: 0,
  tag: '',
  search: '',
  order_by: 'created_at',
  order: 'DESC',
  page: 1,
};

function statusOptions(): Array< { value: string; label: string } > {
  const list = window.markarooConfig.statusList ?? [
    { value: 'open', label: 'Open' },
    { value: 'resolved', label: 'Resolved' },
  ];
  return [ { value: '', label: __( 'All statuses', 'markaroo' ) }, ...list ];
}

function availableTags(): string[] {
  const settings = window.markarooConfig.settings as
    | { tasks?: { available_tags?: string[] } }
    | undefined;
  return settings?.tasks?.available_tags ?? [];
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

function buildParams( filters: Filters, perPage: number ): URLSearchParams {
  const params = new URLSearchParams();
  if ( filters.status ) {
    params.set( 'status', filters.status );
  }
  if ( filters.priority ) {
    params.set( 'priority', filters.priority );
  }
  if ( filters.assignee ) {
    params.set( 'assigned_to', String( filters.assignee ) );
  }
  if ( filters.tag ) {
    params.set( 'tag', filters.tag );
  }
  if ( filters.search ) {
    params.set( 'search', filters.search );
  }
  params.set( 'order_by', filters.order_by );
  params.set( 'order', filters.order );
  params.set( 'per_page', String( perPage ) );
  params.set( 'page', String( filters.page ) );
  return params;
}

export function TaskListView() {
  const currentUserId = window.markarooConfig.currentUser?.id ?? 0;
  const currentUserName = window.markarooConfig.currentUser?.name ?? '';

  const [ filters, setFilters ] = useState< Filters >( DEFAULT_FILTERS );
  const [ items, setItems ] = useState< FeedbackItem[] >( [] );
  const [ total, setTotal ] = useState( 0 );
  const [ pages, setPages ] = useState( 1 );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );

  const [ selected, setSelected ] = useState< Set< number > >( () => new Set() );
  const [ busy, setBusy ] = useState( false );
  const [ exporting, setExporting ] = useState( false );

  const [ savedFilters, setSavedFilters ] = useState< SavedFilter[] >( [] );
  const [ activeView, setActiveView ] = useState< string >( 'all' );

  const debouncedSearch = useDebouncedValue( filters.search );

  const load = useCallback( () => {
    setLoading( true );
    setError( null );

    const params = buildParams( { ...filters, search: debouncedSearch }, 25 );

    fetchFeedback( params )
      .then( ( body ) => {
        setItems( body.data ?? [] );
        setTotal( body.meta?.total ?? 0 );
        setPages( body.meta?.pages ?? 1 );
        setSelected( new Set() );
      } )
      .catch( () => setError( __( 'Could not load reviews.', 'markaroo' ) ) )
      .finally( () => setLoading( false ) );
  }, [ filters, debouncedSearch ] );

  useEffect( () => {
    load();
  }, [ load ] );

  // Load the current user's saved filters once.
  useEffect( () => {
    getSettings()
      .then( ( s ) => setSavedFilters( s.saved_filters ?? [] ) )
      .catch( () => {
        /* non-fatal — saved filters are optional */
      } );
  }, [] );

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

  // ---- Saved views / tabs -------------------------------------------------

  function applyView( view: 'all' | 'mine' | string ) {
    setActiveView( view );
    if ( view === 'all' ) {
      setFilters( { ...DEFAULT_FILTERS } );
      return;
    }
    if ( view === 'mine' ) {
      setFilters( { ...DEFAULT_FILTERS, status: '', assignee: currentUserId } );
      return;
    }
    const saved = savedFilters.find( ( f ) => f.name === view );
    if ( saved ) {
      setFilters( {
        ...DEFAULT_FILTERS,
        status: saved.filters.status,
        priority: saved.filters.priority,
        assignee: saved.filters.assignee,
        tag: saved.filters.tag,
      } );
    }
  }

  function saveCurrentView() {
    // eslint-disable-next-line no-alert
    const name = window.prompt( __( 'Name this filter view:', 'markaroo' ) );
    if ( ! name ) {
      return;
    }
    const entry: SavedFilter = {
      name,
      filters: {
        status: filters.status,
        priority: filters.priority,
        assignee: filters.assignee,
        tag: filters.tag,
      },
    };
    const next = [ ...savedFilters.filter( ( f ) => f.name !== name ), entry ];
    setSavedFilters( next );
    setActiveView( name );
    saveSavedFilters( next ).catch( () => setError( __( 'Could not save view.', 'markaroo' ) ) );
  }

  function deleteView( name: string ) {
    const next = savedFilters.filter( ( f ) => f.name !== name );
    setSavedFilters( next );
    if ( activeView === name ) {
      applyView( 'all' );
    }
    saveSavedFilters( next ).catch( () => setError( __( 'Could not delete view.', 'markaroo' ) ) );
  }

  // ---- Selection ----------------------------------------------------------

  const allSelected = useMemo(
    () => items.length > 0 && items.every( ( i ) => selected.has( i.id ) ),
    [ items, selected ]
  );

  function toggleAll() {
    setSelected( ( prev ) => {
      if ( prev.size === items.length ) {
        return new Set();
      }
      return new Set( items.map( ( i ) => i.id ) );
    } );
  }

  function toggleOne( id: number ) {
    setSelected( ( prev ) => {
      const next = new Set( prev );
      if ( next.has( id ) ) {
        next.delete( id );
      } else {
        next.add( id );
      }
      return next;
    } );
  }

  // ---- Bulk actions -------------------------------------------------------

  async function runBulk( changes: Parameters< typeof bulkFeedback >[ 1 ] ) {
    const ids = Array.from( selected );
    if ( ids.length === 0 ) {
      return;
    }
    setBusy( true );
    setError( null );
    try {
      await bulkFeedback( ids, changes );
      load();
    } catch {
      setError( __( 'Bulk action failed.', 'markaroo' ) );
    } finally {
      setBusy( false );
    }
  }

  function bulkDelete() {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      __( 'Delete the selected reviews? This cannot be undone.', 'markaroo' )
    );
    if ( ! confirmed ) {
      return;
    }
    runBulk( { delete: true } );
  }

  async function handleExport() {
    setExporting( true );
    setError( null );
    try {
      await exportCsv( buildParams( { ...filters, search: debouncedSearch, page: 1 }, 25 ) );
    } catch {
      setError( __( 'Export failed.', 'markaroo' ) );
    } finally {
      setExporting( false );
    }
  }

  function SortButton( { col, label }: { col: string; label: string } ) {
    const active = filters.order_by === col;
    let arrow = '';
    if ( active ) {
      arrow = filters.order === 'DESC' ? ' ↓' : ' ↑';
    }
    return (
      <button
        type="button"
        className={ `markaroo-admin-sort${ active ? ' markaroo-admin-sort--active' : '' }` }
        onClick={ () => toggleSort( col ) }
      >
        { label }
        { arrow }
      </button>
    );
  }

  const frontUrl = window.markarooConfig.restUrl.replace( '/wp-json/', '/' );
  const tags = availableTags();
  const selectedCount = selected.size;

  return (
    <div className="markaroo-admin-tasklist">
      <div className="markaroo-admin-tasklist__toolbar">
        <h2 className="markaroo-admin__section-title" style={ { margin: 0 } }>
          { __( 'All Reviews', 'markaroo' ) }
        </h2>

        <div className="markaroo-admin-tasklist__filters">
          <select
            value={ filters.status }
            onChange={ ( e ) => setFilter( 'status', e.target.value ) }
          >
            { statusOptions().map( ( s ) => (
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

          { tags.length > 0 && (
            <select value={ filters.tag } onChange={ ( e ) => setFilter( 'tag', e.target.value ) }>
              <option value="">{ __( 'All tags', 'markaroo' ) }</option>
              { tags.map( ( t ) => (
                <option key={ t } value={ t }>
                  { t }
                </option>
              ) ) }
            </select>
          ) }

          <input
            type="search"
            placeholder={ __( 'Search…', 'markaroo' ) }
            value={ filters.search }
            onChange={ ( e ) => setFilter( 'search', e.target.value ) }
            className="markaroo-admin-tasklist__search"
          />

          <button
            type="button"
            className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
            onClick={ handleExport }
            disabled={ exporting }
          >
            { exporting ? __( 'Exporting…', 'markaroo' ) : __( 'Export CSV', 'markaroo' ) }
          </button>

          <span className="markaroo-admin-tasklist__count">
            { loading
              ? '…'
              : /* translators: %d: number of review items. */
                `${ total } ${
                  total !== 1 ? __( 'items', 'markaroo' ) : __( 'item', 'markaroo' )
                }` }
          </span>
        </div>
      </div>

      { /* Saved views / tabs */ }
      <div className="markaroo-admin-tasklist__views" role="tablist">
        <button
          type="button"
          className={ `markaroo-admin-view-tab${ activeView === 'all' ? ' is-active' : '' }` }
          onClick={ () => applyView( 'all' ) }
        >
          { __( 'All', 'markaroo' ) }
        </button>
        <button
          type="button"
          className={ `markaroo-admin-view-tab${ activeView === 'mine' ? ' is-active' : '' }` }
          onClick={ () => applyView( 'mine' ) }
          title={ currentUserName }
        >
          { __( 'Assigned to me', 'markaroo' ) }
        </button>
        { savedFilters.map( ( f ) => (
          <span key={ f.name } className="markaroo-admin-view-tab-wrap">
            <button
              type="button"
              className={ `markaroo-admin-view-tab${ activeView === f.name ? ' is-active' : '' }` }
              onClick={ () => applyView( f.name ) }
            >
              { f.name }
            </button>
            <button
              type="button"
              className="markaroo-admin-view-tab__remove"
              aria-label={ __( 'Delete view', 'markaroo' ) }
              onClick={ () => deleteView( f.name ) }
            >
              ×
            </button>
          </span>
        ) ) }
        <button
          type="button"
          className="markaroo-admin-view-tab markaroo-admin-view-tab--add"
          onClick={ saveCurrentView }
        >
          { __( '+ Save view', 'markaroo' ) }
        </button>
      </div>

      { /* Bulk toolbar */ }
      { selectedCount > 0 && (
        <div
          className="markaroo-admin-bulkbar"
          role="region"
          aria-label={ __( 'Bulk actions', 'markaroo' ) }
        >
          <span className="markaroo-admin-bulkbar__count">
            { /* translators: %d: number of selected reviews. */ }
            { `${ selectedCount } ${ __( 'selected', 'markaroo' ) }` }
          </span>

          <select
            defaultValue=""
            disabled={ busy }
            onChange={ ( e ) => {
              if ( e.target.value ) {
                runBulk( { status: e.target.value } );
                e.target.value = '';
              }
            } }
          >
            <option value="">{ __( 'Set status…', 'markaroo' ) }</option>
            { ( window.markarooConfig.statusList ?? [] ).map( ( s ) => (
              <option key={ s.value } value={ s.value }>
                { s.label }
              </option>
            ) ) }
          </select>

          <select
            defaultValue=""
            disabled={ busy }
            onChange={ ( e ) => {
              if ( e.target.value ) {
                runBulk( { priority: e.target.value } );
                e.target.value = '';
              }
            } }
          >
            <option value="">{ __( 'Set priority…', 'markaroo' ) }</option>
            { PRIORITIES.filter( ( p ) => p.value ).map( ( p ) => (
              <option key={ p.value } value={ p.value }>
                { p.label }
              </option>
            ) ) }
          </select>

          { tags.length > 0 && (
            <select
              defaultValue=""
              disabled={ busy }
              onChange={ ( e ) => {
                if ( e.target.value ) {
                  runBulk( { tags: [ e.target.value ] } );
                  e.target.value = '';
                }
              } }
            >
              <option value="">{ __( 'Set tag…', 'markaroo' ) }</option>
              { tags.map( ( t ) => (
                <option key={ t } value={ t }>
                  { t }
                </option>
              ) ) }
            </select>
          ) }

          <button
            type="button"
            className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
            disabled={ busy || ! currentUserId }
            onClick={ () =>
              runBulk( { assigned_to_id: currentUserId, assigned_to_name: currentUserName } )
            }
          >
            { __( 'Assign to me', 'markaroo' ) }
          </button>

          <button
            type="button"
            className="markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm"
            disabled={ busy }
            onClick={ bulkDelete }
          >
            { __( 'Delete', 'markaroo' ) }
          </button>

          <button
            type="button"
            className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
            onClick={ () => setSelected( new Set() ) }
          >
            { __( 'Clear', 'markaroo' ) }
          </button>
        </div>
      ) }

      { error && <div className="markaroo-admin__error-box">{ error }</div> }

      <table className="markaroo-admin-table markaroo-admin-tasklist__table">
        <thead>
          <tr>
            <th className="markaroo-admin-table__check">
              <input
                type="checkbox"
                checked={ allSelected }
                onChange={ toggleAll }
                aria-label={ __( 'Select all', 'markaroo' ) }
              />
            </th>
            <th>
              <SortButton col="created_at" label="#" />
            </th>
            <th>{ __( 'Comment', 'markaroo' ) }</th>
            <th>
              <SortButton col="status" label={ __( 'Status', 'markaroo' ) } />
            </th>
            <th>
              <SortButton col="priority" label={ __( 'Priority', 'markaroo' ) } />
            </th>
            <th>{ __( 'Assignee', 'markaroo' ) }</th>
            <th>
              <SortButton col="due_date" label={ __( 'Due', 'markaroo' ) } />
            </th>
            <th>
              <SortButton col="created_at" label={ __( 'Created', 'markaroo' ) } />
            </th>
            <th>{ __( 'Page', 'markaroo' ) }</th>
          </tr>
        </thead>
        <tbody>
          { loading && (
            <tr>
              <td colSpan={ 9 } className="markaroo-admin-tasklist__loading-row">
                { __( 'Loading…', 'markaroo' ) }
              </td>
            </tr>
          ) }
          { ! loading && items.length === 0 && (
            <tr>
              <td
                colSpan={ 9 }
                className="markaroo-admin__empty"
                style={ { padding: '20px', textAlign: 'center' } }
              >
                { __( 'No reviews found.', 'markaroo' ) }
              </td>
            </tr>
          ) }
          { items.map( ( item ) => (
            <tr key={ item.id } className={ selected.has( item.id ) ? 'is-selected' : '' }>
              <td className="markaroo-admin-table__check">
                <input
                  type="checkbox"
                  checked={ selected.has( item.id ) }
                  onChange={ () => toggleOne( item.id ) }
                  aria-label={
                    /* translators: %d: review id */ `${ __( 'Select review', 'markaroo' ) } #${
                      item.id
                    }`
                  }
                />
              </td>
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
                  { item.status_label || item.status }
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
            { __( '← Prev', 'markaroo' ) }
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
            { __( 'Next →', 'markaroo' ) }
          </button>
        </div>
      ) }
    </div>
  );
}
