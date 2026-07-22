import type { FeedbackItem } from '../types';

/**
 * Which tab a feedback item belongs to in the frontend widget.
 *
 * - `resolved` → Resolved tab.
 * - open / in_progress / reopened → Unresolved tab.
 * - `approved` → shown in NEITHER: approved items are signed off in the
 *   dashboard and should disappear from the on-page widget entirely.
 * @param item
 */
export function isResolvedTab( item: FeedbackItem ): boolean {
  return item.status === 'resolved';
}

export function isUnresolvedTab( item: FeedbackItem ): boolean {
  return item.status !== 'resolved' && item.status !== 'approved';
}
