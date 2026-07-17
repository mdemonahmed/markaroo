import type { FeedbackItem } from '../types';

/**
 * Map of feedback id to its 1-based display number, ranked by creation order
 * (oldest = #1). Ranking uses the autoincrement `id` rather than the array
 * position, so numbers stay correct regardless of the order the REST list
 * returns items in, and stay stable when a new item is prepended.
 * @param items
 */
export function pinNumbers( items: FeedbackItem[] ): Map< number, number > {
  const map = new Map< number, number >();
  [ ...items ].sort( ( a, b ) => a.id - b.id ).forEach( ( item, i ) => map.set( item.id, i + 1 ) );
  return map;
}
