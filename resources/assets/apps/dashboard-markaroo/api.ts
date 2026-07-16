import type { FeedbackItem } from '../../widget/types';

/**
 * Thin REST helper for the admin dashboard. All calls send the WP nonce and
 * target the markaroo/v1 namespace off window.markarooConfig.restUrl.
 */

function base(): string {
  return window.markarooConfig.restUrl + 'markaroo/v1/';
}

function headers( json = true ): Record< string, string > {
  const h: Record< string, string > = { 'X-WP-Nonce': window.markarooConfig.nonce };
  if ( json ) {
    h[ 'Content-Type' ] = 'application/json';
  }
  return h;
}

async function ok< T >( res: Response ): Promise< T > {
  if ( ! res.ok ) {
    throw new Error( String( res.status ) );
  }
  return ( await res.json() ) as T;
}

export interface FeedbackListResponse {
  data: FeedbackItem[];
  meta: { total: number; pages: number; page: number; per_page: number };
}

export function fetchFeedback( params: URLSearchParams ): Promise< FeedbackListResponse > {
  return fetch( `${ base() }feedback?${ params }`, { headers: headers( false ) } ).then( ( r ) =>
    ok< FeedbackListResponse >( r )
  );
}

export interface BulkChanges {
  status?: string;
  priority?: string;
  assigned_to_id?: number;
  assigned_to_name?: string;
  tags?: string[];
  due_date?: string | null;
  delete?: boolean;
}

export interface BulkResponse {
  updated: number;
  ids: number[];
}

export function bulkFeedback( ids: number[], changes: BulkChanges ): Promise< BulkResponse > {
  return fetch( `${ base() }feedback/bulk`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify( { ids, ...changes } ),
  } ).then( ( r ) => ok< BulkResponse >( r ) );
}

export function patchFeedback(
  id: number,
  changes: Record< string, unknown >
): Promise< FeedbackItem > {
  return fetch( `${ base() }feedback/${ id }`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify( changes ),
  } ).then( ( r ) => ok< FeedbackItem >( r ) );
}

export function setStatus( id: number, status: string ): Promise< FeedbackItem > {
  return fetch( `${ base() }feedback/${ id }/status`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify( { status } ),
  } ).then( ( r ) => ok< FeedbackItem >( r ) );
}

/**
 * Download the current filtered feedback list as a CSV file. Fetches as a Blob
 * (so the nonce header rides along) and triggers a browser save.
 * @param params
 */
export async function exportCsv( params: URLSearchParams ): Promise< void > {
  const res = await fetch( `${ base() }feedback/export?${ params }`, {
    headers: headers( false ),
  } );
  if ( ! res.ok ) {
    throw new Error( String( res.status ) );
  }
  const blob = await res.blob();
  const url = URL.createObjectURL( blob );
  const a = document.createElement( 'a' );
  a.href = url;
  a.download = `markaroo-feedback-${ new Date().toISOString().slice( 0, 10 ) }.csv`;
  document.body.appendChild( a );
  a.click();
  a.remove();
  URL.revokeObjectURL( url );
}

export interface SavedFilter {
  name: string;
  filters: { status: string; priority: string; assignee: number; tag: string };
}

export interface SettingsPayload {
  saved_filters?: SavedFilter[];
  [ key: string ]: unknown;
}

export function getSettings(): Promise< SettingsPayload > {
  return fetch( `${ base() }settings`, { headers: headers( false ) } ).then( ( r ) =>
    ok< SettingsPayload >( r )
  );
}

export function saveSavedFilters( savedFilters: SavedFilter[] ): Promise< SettingsPayload > {
  return fetch( `${ base() }settings`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify( { saved_filters: savedFilters } ),
  } ).then( ( r ) => ok< SettingsPayload >( r ) );
}

export function sendTestDigest(): Promise< { sent: boolean; email: string } > {
  return fetch( `${ base() }notifications/test-digest`, {
    method: 'POST',
    headers: headers(),
  } ).then( ( r ) => ok< { sent: boolean; email: string } >( r ) );
}
