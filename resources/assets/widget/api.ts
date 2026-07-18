/**
 * Thin REST client. Reads nonce + share token from markarooConfig.
 * Always rejects with an Error whose message is the WP error message.
 */

function cfg() {
  return window.markarooConfig;
}

function authHeaders( extra: Record< string, string > = {} ): Record< string, string > {
  const config = cfg();
  const headers: Record< string, string > = {
    'Content-Type': 'application/json',
    'X-WP-Nonce': config.nonce,
    ...extra,
  };
  if ( config.shareToken ) {
    headers[ 'X-Markaroo-Share' ] = config.shareToken;
  }
  return headers;
}

function apiUrl( path: string ): string {
  const base = cfg().restUrl;
  const full = `${ base }markaroo/v1/${ path }`;
  // With plain permalinks, rest_url() returns the `…?rest_route=/` form, so the
  // base already contains a `?`. Any query string carried by `path` would add a
  // second `?`, which breaks the route — turn that path-level `?` into `&`.
  if ( ! base.includes( '?' ) ) {
    return full;
  }
  return full.slice( 0, base.length ) + full.slice( base.length ).replace( '?', '&' );
}

export async function apiFetch< T = unknown >(
  path: string,
  init: RequestInit = {}
): Promise< T > {
  const res = await fetch( apiUrl( path ), {
    ...init,
    headers: authHeaders( init.headers as Record< string, string > ),
  } );

  if ( ! res.ok ) {
    const body = ( await res.json().catch( () => ( {} ) ) ) as Record< string, unknown >;
    throw new Error( ( body.message as string ) || `HTTP ${ res.status }` );
  }

  return res.json() as Promise< T >;
}

/**
 * POST with a JSON body.
 * @param path
 * @param data
 */
export function apiPost< T = unknown >( path: string, data: unknown ): Promise< T > {
  return apiFetch< T >( path, { method: 'POST', body: JSON.stringify( data ) } );
}

/**
 * PATCH with a JSON body.
 * @param path
 * @param data
 */
export function apiPatch< T = unknown >( path: string, data: unknown ): Promise< T > {
  return apiFetch< T >( path, { method: 'PATCH', body: JSON.stringify( data ) } );
}

/**
 * DELETE.
 * @param path
 */
export function apiDelete< T = unknown >( path: string ): Promise< T > {
  return apiFetch< T >( path, { method: 'DELETE' } );
}

/**
 * POST multipart form data (file uploads). No Content-Type header — the
 * browser sets it with the multipart boundary.
 * @param path
 * @param form
 */
export async function apiPostForm< T = unknown >( path: string, form: FormData ): Promise< T > {
  const config = cfg();
  const headers: Record< string, string > = { 'X-WP-Nonce': config.nonce };
  if ( config.shareToken ) {
    headers[ 'X-Markaroo-Share' ] = config.shareToken;
  }

  const res = await fetch( apiUrl( path ), { method: 'POST', body: form, headers } );

  if ( ! res.ok ) {
    const body = ( await res.json().catch( () => ( {} ) ) ) as Record< string, unknown >;
    throw new Error( ( body.message as string ) || `HTTP ${ res.status }` );
  }

  return res.json() as Promise< T >;
}

export interface ApiUser {
  id: number;
  name: string;
  slug?: string;
  avatar?: string;
}

let usersPromise: Promise< ApiUser[] > | null = null;

/**
 * Fetch the mentionable/assignable users list once per page session. Several
 * components (composer, pin card, mention autocomplete) need the same list;
 * sharing one in-flight promise avoids N identical `users?per_page=50` calls.
 */
export function fetchUsers(): Promise< ApiUser[] > {
  if ( ! usersPromise ) {
    usersPromise = apiFetch< ApiUser[] >( 'users?per_page=50' ).catch( ( err ) => {
      usersPromise = null; // Allow a retry after a failed fetch.
      throw err;
    } );
  }
  return usersPromise;
}
