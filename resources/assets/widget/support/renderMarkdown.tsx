import { createElement, Fragment } from '@wordpress/element';
import type { ReactNode } from 'react';

// Only these schemes are honored for links; anything else renders as literal
// text so a `[x](javascript:…)` can never become a live href.
const SAFE_URL = /^(https?:|mailto:)/i;

/**
 * Parse the inline markdown the composer toolbar emits — `code`, **bold**,
 * *italic*, [text](url) — into React nodes. Plain runs stay as strings, which
 * React escapes, so untrusted input can never inject markup.
 *
 * Exported for the unit test; prefer renderMarkdown() in components.
 * @param text    One line of markdown.
 * @param keyBase Stable key prefix for the produced elements.
 */
export function parseInline( text: string, keyBase: string ): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;

  while ( ( m = re.exec( text ) ) !== null ) {
    if ( m.index > last ) {
      nodes.push( text.slice( last, m.index ) );
    }
    const key = `${ keyBase }-${ i++ }`;
    if ( m[ 1 ] !== undefined ) {
      nodes.push( createElement( 'code', { key }, m[ 1 ] ) );
    } else if ( m[ 2 ] !== undefined ) {
      nodes.push( createElement( 'strong', { key }, m[ 2 ] ) );
    } else if ( m[ 3 ] !== undefined ) {
      nodes.push( createElement( 'em', { key }, m[ 3 ] ) );
    } else {
      const url = ( m[ 5 ] ?? '' ).trim();
      if ( SAFE_URL.test( url ) ) {
        nodes.push(
          createElement(
            'a',
            { key, href: url, target: '_blank', rel: 'noopener noreferrer' },
            m[ 4 ]
          )
        );
      } else {
        nodes.push( m[ 0 ] ); // Unsafe scheme → literal text.
      }
    }
    last = re.lastIndex;
  }
  if ( last < text.length ) {
    nodes.push( text.slice( last ) );
  }
  return nodes;
}

/**
 * Render a safe subset of markdown (bold/italic/code/link + `-`/`1.` lists) as
 * React nodes. ponytail: line-based block parse — good enough for the toolbar's
 * own output; swap for a real parser only if nested markdown is ever needed.
 * @param text The stored comment/reply text.
 */
export function renderMarkdown( text: string ): ReactNode {
  if ( ! text ) {
    return null;
  }

  const lines = text.split( /\r?\n/ );
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let b = 0;

  const flushPara = () => {
    if ( ! para.length ) {
      return;
    }
    const key = `p-${ b++ }`;
    const kids: ReactNode[] = [];
    para.forEach( ( ln, idx ) => {
      if ( idx > 0 ) {
        kids.push( createElement( 'br', { key: `br-${ key }-${ idx }` } ) );
      }
      kids.push( ...parseInline( ln, `${ key }-${ idx }` ) );
    } );
    blocks.push( createElement( 'p', { key, className: 'markaroo-md__p' }, ...kids ) );
    para = [];
  };

  const flushList = () => {
    if ( ! list ) {
      return;
    }
    const key = `l-${ b++ }`;
    const tag = list.ordered ? 'ol' : 'ul';
    const items = list.items.map( ( it, idx ) =>
      createElement( 'li', { key: `${ key }-${ idx }` }, ...parseInline( it, `${ key }-${ idx }` ) )
    );
    blocks.push( createElement( tag, { key, className: 'markaroo-md__list' }, ...items ) );
    list = null;
  };

  for ( const line of lines ) {
    const ol = line.match( /^\s*\d+\.\s+(.*)$/ );
    const ul = line.match( /^\s*[-*]\s+(.*)$/ );
    if ( ol ) {
      flushPara();
      if ( ! list || ! list.ordered ) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push( ol[ 1 ] );
    } else if ( ul ) {
      flushPara();
      if ( ! list || list.ordered ) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push( ul[ 1 ] );
    } else if ( line.trim() === '' ) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push( line );
    }
  }
  flushPara();
  flushList();

  return createElement( Fragment, null, ...blocks );
}
