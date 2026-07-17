import { parseInline } from './renderMarkdown';

describe( 'parseInline', () => {
  it( 'wraps **bold** in a <strong> element', () => {
    const nodes = parseInline( '**hi**', 'k' ) as any[];
    expect( nodes ).toHaveLength( 1 );
    expect( nodes[ 0 ].type ).toBe( 'strong' );
    expect( nodes[ 0 ].props.children ).toBe( 'hi' );
  } );

  it( 'renders a safe link as an <a>', () => {
    const nodes = parseInline( '[docs](https://example.com)', 'k' ) as any[];
    expect( nodes[ 0 ].type ).toBe( 'a' );
    expect( nodes[ 0 ].props.href ).toBe( 'https://example.com' );
  } );

  it( 'leaves an unsafe link scheme as literal text, never an <a>', () => {
    const nodes = parseInline( '[x](javascript:alert(1))', 'k' );
    // No anchor element is produced; the text survives verbatim (possibly split).
    expect( nodes.every( ( n ) => typeof n === 'string' ) ).toBe( true );
    expect( nodes.join( '' ) ).toBe( '[x](javascript:alert(1))' );
  } );

  it( 'keeps raw HTML as an escaped string child, never an element', () => {
    const nodes = parseInline( '<script>alert(1)</script>', 'k' );
    expect( nodes ).toEqual( [ '<script>alert(1)</script>' ] );
    expect( typeof nodes[ 0 ] ).toBe( 'string' );
  } );
} );
