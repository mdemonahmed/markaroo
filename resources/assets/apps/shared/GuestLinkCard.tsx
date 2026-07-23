import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Link2, Copy, Check } from 'lucide-react';

/**
 * Copy-a-guest-link card. Shows the newest usable site-wide share link
 * (creating one on first use) so an admin can hand it to a client — no login
 * required for the client. Shared by the dashboard Overview and the onboarding
 * final step, so it takes restUrl/nonce as props rather than assuming either
 * app's config shape. Full multi-link management lives in the dashboard's
 * Share Links view (pass manageUrl to surface a link to it).
 */

interface ShareItem {
  scope: string;
  is_expired: boolean;
  can_comment: boolean;
  share_url: string;
}

interface SharesResponse {
  enabled: boolean;
  items: ShareItem[];
}

interface GuestLink {
  enabled: boolean;
  share_url: string;
}

interface Props {
  restUrl: string;
  nonce: string;
  manageUrl?: string;
}

export function GuestLinkCard( { restUrl, nonce, manageUrl }: Props ) {
  const [ link, setLink ] = useState< GuestLink | null >( null );
  const [ copied, setCopied ] = useState( false );

  useEffect( () => {
    const base = restUrl + 'markaroo/v1/shares';
    const headers = { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce };

    fetch( base, { headers } )
      .then( ( r ) => ( r.ok ? ( r.json() as Promise< SharesResponse > ) : Promise.reject( r.status ) ) )
      .then( ( data ) => {
        // Newest usable site-wide link (list is newest-first).
        const existing = data.items.find(
          ( s ) => 'site' === s.scope && ! s.is_expired && s.can_comment
        );
        if ( existing ) {
          setLink( { enabled: data.enabled, share_url: existing.share_url } );
          return;
        }
        if ( ! data.enabled ) {
          setLink( { enabled: false, share_url: '' } );
          return;
        }
        // First use: create a default site-wide link.
        fetch( base, {
          method: 'POST',
          headers,
          body: JSON.stringify( { label: __( 'Guest link', 'markaroo' ) } ),
        } )
          .then( ( r ) => ( r.ok ? ( r.json() as Promise< ShareItem > ) : Promise.reject( r.status ) ) )
          .then( ( created ) => setLink( { enabled: true, share_url: created.share_url } ) )
          .catch( () => null );
      } )
      .catch( () => null );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  function copy() {
    if ( ! link ) {
      return;
    }
    const url = link.share_url;
    const done = () => {
      setCopied( true );
      setTimeout( () => setCopied( false ), 1500 );
    };
    if ( navigator.clipboard && window.isSecureContext ) {
      navigator.clipboard
        .writeText( url )
        .then( done )
        // eslint-disable-next-line no-alert
        .catch( () => window.prompt( __( 'Copy this link:', 'markaroo' ), url ) );
      return;
    }
    // Fallback for insecure (http://) dev contexts like localhost.
    const ta = document.createElement( 'textarea' );
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild( ta );
    ta.focus();
    ta.select();
    try {
      document.execCommand( 'copy' );
      done();
    } catch {
      // eslint-disable-next-line no-alert
      window.prompt( __( 'Copy this link:', 'markaroo' ), url );
    }
    document.body.removeChild( ta );
  }

  // Nothing to show until the link loads (or if the request failed).
  if ( ! link ) {
    return null;
  }

  return (
    <div className="markaroo-guest-card">
      <span className="markaroo-guest-card__icon" aria-hidden="true">
        <Link2 size={ 20 } strokeWidth={ 2 } />
      </span>
      <div className="markaroo-guest-card__body">
        <h3 className="markaroo-guest-card__title">
          { __( 'Share with your client', 'markaroo' ) }
        </h3>
        <p className="markaroo-guest-card__desc">
          { link.enabled
            ? __(
                'Send this link to a client — no account needed. They can drop feedback pins right on your site.',
                'markaroo'
              )
            : __(
                'Guest links are turned off. Turn them on under Settings → Guest Feedback Link to share with clients.',
                'markaroo'
              ) }
        </p>
        { link.enabled && (
          <div className="markaroo-guest-card__row">
            <input
              type="text"
              readOnly
              className="markaroo-guest-card__url"
              value={ link.share_url }
              onFocus={ ( e ) => e.currentTarget.select() }
            />
            <button type="button" className="markaroo-guest-card__btn" onClick={ copy }>
              { copied ? (
                <>
                  <Check size={ 15 } strokeWidth={ 2.5 } /> { __( 'Copied!', 'markaroo' ) }
                </>
              ) : (
                <>
                  <Copy size={ 15 } strokeWidth={ 2 } /> { __( 'Copy link', 'markaroo' ) }
                </>
              ) }
            </button>
          </div>
        ) }
        { manageUrl && (
          <a className="markaroo-guest-card__manage" href={ manageUrl }>
            { __( 'Manage share links', 'markaroo' ) }
          </a>
        ) }
      </div>
    </div>
  );
}
