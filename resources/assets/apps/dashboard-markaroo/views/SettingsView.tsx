import { useState, useEffect } from '@wordpress/element';

type SettingsMap = Record< string, Record< string, unknown > >;

interface PageOption {
  id: number;
  title: string;
}

interface GuestLink {
  enabled: boolean;
  token: string;
  share_url: string;
}

export function SettingsView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';

  const [ settings, setSettings ] = useState< SettingsMap >( {} );
  const [ loading, setLoading ] = useState( true );
  const [ saving, setSaving ] = useState( false );
  const [ error, setError ] = useState< string | null >( null );
  const [ saved, setSaved ] = useState( false );

  // Page picker (loaded lazily when scope = 'pages').
  const [ pages, setPages ] = useState< PageOption[] >( [] );
  const [ pagesLoaded, setPagesLoaded ] = useState( false );

  // Guest feedback link.
  const [ guest, setGuest ] = useState< GuestLink | null >( null );
  const [ regenerating, setRegenerating ] = useState( false );
  const [ copied, setCopied ] = useState( false );

  useEffect( () => {
    fetch( restBase + 'settings', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) =>
        r.ok ? ( r.json() as Promise< SettingsMap > ) : Promise.reject( r.status )
      )
      .then( setSettings )
      .catch( () => setError( 'Could not load settings.' ) )
      .finally( () => setLoading( false ) );

    fetch( restBase + 'shares/guest-link', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) => ( r.ok ? ( r.json() as Promise< GuestLink > ) : Promise.reject( r.status ) ) )
      .then( setGuest )
      .catch( () => null );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  const g = settings.general ?? {};
  const scope = String( g.widget_scope ?? 'site' );

  // Fetch published pages + posts once, when the page-scope picker is shown.
  useEffect( () => {
    if ( 'pages' !== scope || pagesLoaded ) {
      return;
    }
    setPagesLoaded( true );

    const headers = { 'X-WP-Nonce': config.nonce };
    const fields = 'per_page=100&status=publish&_fields=id,title';

    Promise.all( [
      fetch( `${ config.restUrl }wp/v2/pages?${ fields }`, { headers } ).then( ( r ) =>
        r.ok ? r.json() : []
      ),
      fetch( `${ config.restUrl }wp/v2/posts?${ fields }`, { headers } ).then( ( r ) =>
        r.ok ? r.json() : []
      ),
    ] )
      .then( ( [ wpPages, wpPosts ] ) => {
        const toOption = ( p: { id: number; title?: { rendered?: string } } ): PageOption => ( {
          id: p.id,
          title: p.title?.rendered || `#${ p.id }`,
        } );
        const all = [ ...wpPages, ...wpPosts ].map( toOption );
        all.sort( ( a, b ) => a.title.localeCompare( b.title ) );
        setPages( all );
      } )
      .catch( () => null );
  }, [ scope, pagesLoaded ] ); // eslint-disable-line react-hooks/exhaustive-deps

  function setField( group: string, key: string, value: unknown ) {
    setSettings( ( prev ) => ( {
      ...prev,
      [ group ]: { ...( prev[ group ] ?? {} ), [ key ]: value },
    } ) );
  }

  async function handleSave( e: React.FormEvent ) {
    e.preventDefault();
    setError( null );
    setSaving( true );
    setSaved( false );

    try {
      const res = await fetch( restBase + 'settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce },
        body: JSON.stringify( settings ),
      } );
      if ( ! res.ok ) {
        throw new Error( await res.text() );
      }
      setSaved( true );
      setTimeout( () => setSaved( false ), 3000 );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : 'Save failed.' );
    } finally {
      setSaving( false );
    }
  }

  function togglePage( id: number ) {
    const current = Array.isArray( g.widget_pages ) ? ( g.widget_pages as number[] ) : [];
    const next = current.includes( id )
      ? current.filter( ( pid ) => pid !== id )
      : [ ...current, id ];
    setField( 'general', 'widget_pages', next );
  }

  function copyUrl( url: string ) {
    const done = () => {
      setCopied( true );
      setTimeout( () => setCopied( false ), 1500 );
    };
    if ( navigator.clipboard && window.isSecureContext ) {
      navigator.clipboard
        .writeText( url )
        .then( done )
        .catch( () => window.prompt( 'Copy this link:', url ) );
      return;
    }
    // Fallback for insecure (http://) dev contexts.
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
      window.prompt( 'Copy this link:', url );
    }
    document.body.removeChild( ta );
  }

  async function regenerate() {
    if (
      ! window.confirm( 'Regenerate the guest link? The old link will stop working immediately.' )
    ) {
      return;
    }
    setRegenerating( true );
    try {
      const res = await fetch( restBase + 'shares/guest-link/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce },
      } );
      if ( ! res.ok ) {
        throw new Error( await res.text() );
      }
      setGuest( ( await res.json() ) as GuestLink );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : 'Could not regenerate link.' );
    } finally {
      setRegenerating( false );
    }
  }

  if ( loading ) {
    return <p className="markaroo-admin__loading">Loading…</p>;
  }

  const c = settings.capture ?? {};
  const t = settings.tasks ?? {};
  const a = settings.access ?? {};
  const n = settings.notifications ?? {};
  const at = settings.attachments ?? {};
  const selectedPages = Array.isArray( g.widget_pages ) ? ( g.widget_pages as number[] ) : [];

  return (
    <div className="markaroo-admin-settings">
      <h2 className="markaroo-admin__section-title">Settings</h2>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }
      { saved && <div className="markaroo-admin__success-box">Settings saved.</div> }

      <form onSubmit={ handleSave }>
        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">Widget</h3>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( g.widget_enabled ?? true ) }
              onChange={ ( e ) => setField( 'general', 'widget_enabled', e.target.checked ) }
            />
            Allow feedback (show the widget on the front end)
          </label>

          <label>
            Where to show the widget
            <select
              value={ scope }
              onChange={ ( e ) => setField( 'general', 'widget_scope', e.target.value ) }
            >
              <option value="site">Entire site</option>
              <option value="pages">Specific pages</option>
            </select>
          </label>

          { 'pages' === scope && (
            <div className="markaroo-settings-pages">
              <span className="markaroo-settings-pages__label">Pages with feedback enabled</span>
              <div className="markaroo-settings-pages__list">
                { pages.length === 0 && (
                  <p className="markaroo-admin__empty">No published pages found.</p>
                ) }
                { pages.map( ( p ) => (
                  <label key={ p.id } className="markaroo-settings-toggle">
                    <input
                      type="checkbox"
                      checked={ selectedPages.includes( p.id ) }
                      onChange={ () => togglePage( p.id ) }
                    />
                    { p.title }
                  </label>
                ) ) }
              </div>
            </div>
          ) }

          <label>
            Feedback button position
            <select
              value={ String( g.widget_position ?? 'bottom-right' ) }
              onChange={ ( e ) => setField( 'general', 'widget_position', e.target.value ) }
            >
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
            </select>
          </label>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( g.enable_screenshots ?? true ) }
              onChange={ ( e ) => setField( 'general', 'enable_screenshots', e.target.checked ) }
            />
            Enable screenshots
          </label>

          <label>
            Screenshot format
            <select
              value={ String( g.screenshot_format ?? 'jpeg' ) }
              onChange={ ( e ) => setField( 'general', 'screenshot_format', e.target.value ) }
            >
              <option value="jpeg">JPEG (smaller files)</option>
              <option value="png">PNG (lossless)</option>
            </select>
          </label>

          <label>
            Screenshot quality ({ Math.round( Number( g.screenshot_quality ?? 0.8 ) * 100 ) }%)
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={ Number( g.screenshot_quality ?? 0.8 ) }
              onChange={ ( e ) =>
                setField( 'general', 'screenshot_quality', Number( e.target.value ) )
              }
            />
          </label>
        </div>

        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">Capture</h3>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( c.mask_inputs_in_screenshots ?? true ) }
              onChange={ ( e ) =>
                setField( 'capture', 'mask_inputs_in_screenshots', e.target.checked )
              }
            />
            Mask form inputs in screenshots
          </label>
        </div>

        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">Tasks</h3>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( t.enable_assignment ?? false ) }
              onChange={ ( e ) => setField( 'tasks', 'enable_assignment', e.target.checked ) }
            />
            Enable task assignment
          </label>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( t.enable_due_dates ?? false ) }
              onChange={ ( e ) => setField( 'tasks', 'enable_due_dates', e.target.checked ) }
            />
            Enable due dates
          </label>
        </div>

        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">Guest Feedback Link</h3>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( a.allow_guest_links ?? true ) }
              onChange={ ( e ) => setField( 'access', 'allow_guest_links', e.target.checked ) }
            />
            Allow feedback from clients without WordPress accounts
          </label>

          <p className="markaroo-settings-group__hint">
            Anyone with the token link can view pins on the shared page and submit new feedback.
            Keep the link private.
          </p>

          { guest && (
            <div className="markaroo-guest-link">
              <input
                type="text"
                readOnly
                className="markaroo-guest-link__url"
                value={ guest.share_url }
                onFocus={ ( e ) => e.target.select() }
              />
              <button
                type="button"
                className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                onClick={ () => copyUrl( guest.share_url ) }
              >
                { copied ? 'Copied!' : 'Copy URL' }
              </button>
              <button
                type="button"
                className="markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm"
                onClick={ regenerate }
                disabled={ regenerating }
              >
                { regenerating ? 'Regenerating…' : 'Regenerate' }
              </button>
            </div>
          ) }
        </div>

        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">Attachments</h3>

          <label>
            Max upload size (MB)
            <input
              type="number"
              min="1"
              max="50"
              value={ Number( at.max_upload_mb ?? 5 ) }
              onChange={ ( e ) =>
                setField( 'attachments', 'max_upload_mb', Number( e.target.value ) )
              }
            />
          </label>
        </div>

        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">Notifications</h3>

          <label>
            Mode
            <select
              value={ String( n.notify_mode ?? 'smart' ) }
              onChange={ ( e ) => setField( 'notifications', 'notify_mode', e.target.value ) }
            >
              <option value="off">Off</option>
              <option value="instant">Instant</option>
              <option value="digest">Digest</option>
              <option value="smart">Smart</option>
            </select>
          </label>
        </div>

        <div className="markaroo-settings-actions">
          <button
            type="submit"
            className="markaroo-admin-btn markaroo-admin-btn--primary"
            disabled={ saving }
          >
            { saving ? 'Saving…' : 'Save settings' }
          </button>
        </div>
      </form>
    </div>
  );
}
