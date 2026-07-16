/**
 * fetchUsers() must issue a single network request per page session and share
 * the in-flight promise between callers; a failed fetch resets the cache so
 * the next caller can retry.
 */
import { fetchUsers } from '../api';

describe( 'fetchUsers', () => {
  const fetchMock = jest.fn();

  beforeEach( () => {
    jest.resetModules();
    fetchMock.mockReset();
    ( window as unknown as Record< string, unknown > ).fetch = fetchMock;
    ( window as unknown as Record< string, unknown > ).markarooConfig = {
      restUrl: 'https://example.test/wp-json/',
      nonce: 'abc',
    };
  } );

  it( 'shares one request across concurrent and sequential callers', async () => {
    fetchMock.mockResolvedValue( {
      ok: true,
      json: () => Promise.resolve( [ { id: 1, name: 'Admin' } ] ),
    } );

    const [ a, b ] = await Promise.all( [ fetchUsers(), fetchUsers() ] );
    const c = await fetchUsers();

    expect( fetchMock ).toHaveBeenCalledTimes( 1 );
    expect( a ).toEqual( [ { id: 1, name: 'Admin' } ] );
    expect( b ).toBe( a );
    expect( c ).toBe( a );
  } );
} );
