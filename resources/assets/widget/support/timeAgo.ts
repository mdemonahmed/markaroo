import { __, _n, sprintf } from '@wordpress/i18n';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Relative time label: "just now", "10 minutes ago", "2 hours ago",
 * "3 days ago"; older than 7 days falls back to a localized date.
 * @param iso
 */
export function timeAgo( iso: string ): string {
  const date = new Date( iso );
  const diff = Date.now() - date.getTime();
  if ( Number.isNaN( diff ) ) {
    return iso;
  }
  if ( diff >= WEEK_MS ) {
    return date.toLocaleDateString();
  }
  const minutes = Math.floor( diff / 60000 );
  if ( minutes < 1 ) {
    return __( 'just now', 'markaroo' );
  }
  if ( minutes < 60 ) {
    return sprintf(
      /* translators: %d: number of minutes. */
      _n( '%d minute ago', '%d minutes ago', minutes, 'markaroo' ),
      minutes
    );
  }
  const hours = Math.floor( minutes / 60 );
  if ( hours < 24 ) {
    return sprintf(
      /* translators: %d: number of hours. */
      _n( '%d hour ago', '%d hours ago', hours, 'markaroo' ),
      hours
    );
  }
  const days = Math.floor( hours / 24 );
  return sprintf(
    /* translators: %d: number of days. */
    _n( '%d day ago', '%d days ago', days, 'markaroo' ),
    days
  );
}

/**
 * Absolute localized datetime, for use in title attributes.
 * @param iso
 */
export function absoluteTime( iso: string ): string {
  const date = new Date( iso );
  return Number.isNaN( date.getTime() ) ? iso : date.toLocaleString();
}
