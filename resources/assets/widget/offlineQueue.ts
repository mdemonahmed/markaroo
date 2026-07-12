import { apiPost, apiPostForm } from './api';
import type { FeedbackItem } from './types';

/**
 * Offline-tolerant feedback submission.
 *
 * If POST /feedback fails because of a network error (flaky client wifi mid
 * review), the payload metadata is kept in sessionStorage and retried with
 * exponential backoff. Screenshot Blobs stay in memory only — never serialized.
 * The queue is capped so a long offline spell can't grow without bound.
 */

const QUEUE_KEY = 'markaroo_submit_queue';
const MAX_QUEUE = 5;
const MAX_ATTEMPTS = 6;

interface QueueEntry {
  uuid: string;
  payload: Record< string, unknown >;
  attempts: number;
}

// Screenshot Blobs are held here, keyed by entry uuid. They are intentionally
// NOT persisted to sessionStorage (Blobs don't serialize and would bloat it).
const blobs = new Map< string, Blob >();

let retryTimer: number | null = null;

function readQueue(): QueueEntry[] {
  try {
    const raw = sessionStorage.getItem( QUEUE_KEY );
    const parsed = raw ? ( JSON.parse( raw ) as QueueEntry[] ) : [];
    return Array.isArray( parsed ) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue( queue: QueueEntry[] ): void {
  try {
    sessionStorage.setItem( QUEUE_KEY, JSON.stringify( queue ) );
  } catch {
    /* sessionStorage may be unavailable (private mode) — degrade to no queue */
  }
  window.dispatchEvent(
    new CustomEvent( 'markaroo:queue-changed', { detail: { size: queue.length } } )
  );
}

/** Public: current queued entries (for a "queued" UI indicator). */
export function getQueuedEntries(): QueueEntry[] {
  return readQueue();
}

function isNetworkError( err: unknown ): boolean {
  // apiFetch throws a plain Error(message) for HTTP errors; a genuine offline
  // fetch rejects with a TypeError before any response.
  if ( err instanceof TypeError ) {
    return true;
  }
  const msg = err instanceof Error ? err.message : '';
  return /failed to fetch|networkerror|load failed/i.test( msg );
}

async function uploadScreenshot( item: FeedbackItem, blob: Blob | null ): Promise< FeedbackItem > {
  if ( ! blob ) {
    return item;
  }
  try {
    const form = new FormData();
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    form.append( 'screenshot', blob, `markaroo-${ item.id }.${ ext }` );
    const shot = await apiPostForm< { screenshot_id: number; screenshot_url: string } >(
      `feedback/${ item.id }/screenshot`,
      form
    );
    item.screenshot_id = shot.screenshot_id;
    item.screenshot_url = shot.screenshot_url;
  } catch {
    // Pin renders without a thumbnail; non-fatal.
  }
  return item;
}

function announceRestored( item: FeedbackItem ): void {
  // A queued item finally went through (the composer is long gone), so the
  // widget adds it to state via this event. The immediate-create path instead
  // returns the item to the composer, which updates state directly.
  window.dispatchEvent(
    new CustomEvent( 'markaroo:feedback-restored', { detail: { feedback: item } } )
  );
  window.dispatchEvent(
    new CustomEvent( 'markaroo:feedback-submitted', { detail: { feedback: item } } )
  );
}

function enqueue( uuid: string, payload: Record< string, unknown >, blob: Blob | null ): void {
  const queue = readQueue();

  // Cap the queue: drop the oldest entry (and its in-memory blob) when full.
  while ( queue.length >= MAX_QUEUE ) {
    const dropped = queue.shift();
    if ( dropped ) {
      blobs.delete( dropped.uuid );
    }
  }

  queue.push( { uuid, payload, attempts: 0 } );
  if ( blob ) {
    blobs.set( uuid, blob );
  }
  writeQueue( queue );
  scheduleRetry( 0 );
}

function backoffMs( attempts: number ): number {
  // 2s, 4s, 8s, … capped at ~1min.
  return Math.min( 60000, 2000 * 2 ** attempts );
}

function scheduleRetry( delay: number ): void {
  if ( retryTimer !== null ) {
    return;
  }
  retryTimer = window.setTimeout( () => {
    retryTimer = null;
    processQueue();
  }, delay );
}

async function processQueue(): Promise< void > {
  const queue = readQueue();
  if ( queue.length === 0 ) {
    return;
  }

  const entry = queue[ 0 ];

  try {
    const item = await apiPost< FeedbackItem >( 'feedback', entry.payload );
    await uploadScreenshot( item, blobs.get( entry.uuid ) ?? null );

    // Success — remove from queue and free the blob.
    blobs.delete( entry.uuid );
    writeQueue( readQueue().filter( ( e ) => e.uuid !== entry.uuid ) );
    announceRestored( item );

    // Keep draining.
    scheduleRetry( 0 );
  } catch ( err ) {
    if ( isNetworkError( err ) && entry.attempts + 1 < MAX_ATTEMPTS ) {
      // Still offline — bump attempts and back off.
      const next = readQueue().map( ( e ) =>
        e.uuid === entry.uuid ? { ...e, attempts: e.attempts + 1 } : e
      );
      writeQueue( next );
      scheduleRetry( backoffMs( entry.attempts + 1 ) );
    } else {
      // Permanent failure (HTTP error) or gave up — drop it so it can't wedge
      // the queue, and surface the loss.
      blobs.delete( entry.uuid );
      writeQueue( readQueue().filter( ( e ) => e.uuid !== entry.uuid ) );
      window.dispatchEvent(
        new CustomEvent( 'markaroo:queue-dropped', { detail: { uuid: entry.uuid } } )
      );
      scheduleRetry( 0 );
    }
  }
}

export interface SubmitResult {
  status: 'created' | 'queued';
  item?: FeedbackItem;
  uuid?: string;
}

/**
 * Create feedback, falling back to the offline queue on a network error.
 * HTTP errors (validation, auth) reject as before so the composer shows them.
 *
 * @param payload        The feedback create payload.
 * @param screenshotBlob Optional screenshot Blob to upload after create.
 * @param uuid           Client-generated id used to key the queue entry.
 * @return The submission result: created (with item) or queued.
 */
export async function submitOrQueue(
  payload: Record< string, unknown >,
  screenshotBlob: Blob | null,
  uuid: string
): Promise< SubmitResult > {
  try {
    const item = await apiPost< FeedbackItem >( 'feedback', payload );
    await uploadScreenshot( item, screenshotBlob );
    return { status: 'created', item };
  } catch ( err ) {
    if ( isNetworkError( err ) ) {
      enqueue( uuid, payload, screenshotBlob );
      return { status: 'queued', uuid };
    }
    throw err;
  }
}

// Retry the queue when the browser regains connectivity.
if ( typeof window !== 'undefined' ) {
  window.addEventListener( 'online', () => scheduleRetry( 0 ) );
}
