/**
 * timeAgo() renders translatable relative labels for recent items and falls
 * back to a localized date past 7 days; absoluteTime() feeds title attrs.
 */
import { absoluteTime, timeAgo } from '../support/timeAgo';

describe( 'timeAgo', () => {
  const NOW = new Date( '2026-07-17T12:00:00Z' ).getTime();

  beforeEach( () => {
    jest.spyOn( Date, 'now' ).mockReturnValue( NOW );
  } );

  afterEach( () => {
    jest.restoreAllMocks();
  } );

  const iso = ( msAgo: number ) => new Date( NOW - msAgo ).toISOString();

  it( 'returns "just now" under a minute', () => {
    expect( timeAgo( iso( 30_000 ) ) ).toBe( 'just now' );
  } );

  it( 'returns minutes ago', () => {
    expect( timeAgo( iso( 10 * 60_000 ) ) ).toBe( '10 minutes ago' );
    expect( timeAgo( iso( 60_000 ) ) ).toBe( '1 minute ago' );
  } );

  it( 'returns hours ago', () => {
    expect( timeAgo( iso( 2 * 3_600_000 ) ) ).toBe( '2 hours ago' );
  } );

  it( 'returns days ago under a week', () => {
    expect( timeAgo( iso( 3 * 86_400_000 ) ) ).toBe( '3 days ago' );
  } );

  it( 'falls back to localized date past 7 days', () => {
    const old = iso( 8 * 86_400_000 );
    expect( timeAgo( old ) ).toBe( new Date( old ).toLocaleDateString() );
  } );

  it( 'passes through invalid input', () => {
    expect( timeAgo( 'not-a-date' ) ).toBe( 'not-a-date' );
    expect( absoluteTime( 'not-a-date' ) ).toBe( 'not-a-date' );
  } );

  it( 'absoluteTime returns localized datetime', () => {
    const ts = iso( 60_000 );
    expect( absoluteTime( ts ) ).toBe( new Date( ts ).toLocaleString() );
  } );
} );
