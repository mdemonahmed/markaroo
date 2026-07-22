/**
 * Widget tab classification: approved items belong to NEITHER tab (they vanish
 * from the on-page widget once signed off), reopened returns to Unresolved.
 */
import { isResolvedTab, isUnresolvedTab } from '../support/status';
import type { FeedbackItem } from '../types';

const withStatus = ( status: string ) => ( { status } ) as FeedbackItem;

describe( 'widget status tabs', () => {
  it( 'puts open, in_progress and reopened in the Unresolved tab', () => {
    for ( const s of [ 'open', 'in_progress', 'reopened' ] ) {
      expect( isUnresolvedTab( withStatus( s ) ) ).toBe( true );
      expect( isResolvedTab( withStatus( s ) ) ).toBe( false );
    }
  } );

  it( 'puts resolved only in the Resolved tab', () => {
    expect( isResolvedTab( withStatus( 'resolved' ) ) ).toBe( true );
    expect( isUnresolvedTab( withStatus( 'resolved' ) ) ).toBe( false );
  } );

  it( 'hides approved from both tabs', () => {
    expect( isResolvedTab( withStatus( 'approved' ) ) ).toBe( false );
    expect( isUnresolvedTab( withStatus( 'approved' ) ) ).toBe( false );
  } );
} );
