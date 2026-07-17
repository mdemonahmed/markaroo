/**
 * pinNumbers() ranks feedback by creation order (oldest = #1) independently of
 * the order the REST list returns items in, so the newest pin never shows #1.
 */
import { pinNumbers } from '../support/pinNumbers';
import type { FeedbackItem } from '../types';

const item = ( id: number ) => ( { id } ) as FeedbackItem;

describe( 'pinNumbers', () => {
  it( 'numbers a newest-first list with the oldest as #1', () => {
    // REST returns created_at DESC, so ids descend.
    const map = pinNumbers( [ item( 6 ), item( 5 ), item( 4 ), item( 3 ), item( 2 ), item( 1 ) ] );

    expect( map.get( 1 ) ).toBe( 1 );
    expect( map.get( 6 ) ).toBe( 6 );
  } );

  it( 'gives a newly prepended item the next number and keeps the rest stable', () => {
    const existing = [ item( 5 ), item( 4 ), item( 3 ), item( 2 ), item( 1 ) ];
    const before = pinNumbers( existing );
    const after = pinNumbers( [ item( 6 ), ...existing ] );

    expect( after.get( 6 ) ).toBe( 6 );
    for ( const id of [ 1, 2, 3, 4, 5 ] ) {
      expect( after.get( id ) ).toBe( before.get( id ) );
    }
  } );

  it( 'is empty for an empty list', () => {
    expect( pinNumbers( [] ).size ).toBe( 0 );
  } );
} );
