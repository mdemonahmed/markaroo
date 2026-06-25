import { useState, useEffect } from '@wordpress/element';

interface ShareRow {
  id: number;
  token: string;
  label: string | null;
  scope: string;
  page_key: string | null;
  can_comment: boolean;
  can_view: boolean;
  widget_mode: string;
  expires_at: string | null;
  created_at: string;
  share_url: string;
}

export function ShareLinksView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';

  const [ shares, setShares ] = useState< ShareRow[] >( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );
  const [ creating, setCreating ] = useState( false );

  // New link form state.
  const [ label, setLabel ] = useState( '' );
  const [ scope, setScope ] = useState( 'site' );
  const [ pageKey, setPageKey ] = useState( '' );
  const [ mode, setMode ] = useState( 'comment' );
  const [ canComment, setCanComment ] = useState( true );
  const [ canView, setCanView ] = useState( true );
  const [ expires, setExpires ] = useState( '' );
  const [ showForm, setShowForm ] = useState( false );

  function headers() {
    return { 'X-WP-Nonce': config.nonce, 'Content-Type': 'application/json' };
  }

  useEffect( () => {
    fetch( restBase + 'shares', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) =>
        r.ok ? ( r.json() as Promise< ShareRow[] > ) : Promise.reject( r.status )
      )
      .then( setShares )
      .catch( () => setError( 'Could not load share links.' ) )
      .finally( () => setLoading( false ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  async function createShare( e: React.FormEvent ) {
    e.preventDefault();
    setCreating( true );
    setError( null );

    try {
      const body: Record< string, unknown > = {
        label: label || null,
        scope,
        widget_mode: mode,
        can_comment: canComment,
        can_view: canView,
      };
      if ( scope === 'page' && pageKey ) {
        body.page_key = pageKey;
      }
      if ( expires ) {
        body.expires_at = expires;
      }

      const res = await fetch( restBase + 'shares', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify( body ),
      } );
      if ( ! res.ok ) {
        throw new Error( await res.text() );
      }
      const row = ( await res.json() ) as ShareRow;
      setShares( ( prev ) => [ row, ...prev ] );
      setShowForm( false );
      setLabel( '' );
      setExpires( '' );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : 'Create failed.' );
    } finally {
      setCreating( false );
    }
  }

  async function revokeShare( id: number ) {
    if ( ! window.confirm( 'Revoke this share link? Anyone using it will lose access.' ) ) {
      return;
    }
    await fetch( restBase + `shares/${ id }`, { method: 'DELETE', headers: headers() } );
    setShares( ( prev ) => prev.filter( ( s ) => s.id !== id ) );
  }

  function copyUrl( url: string ) {
    navigator.clipboard.writeText( url ).catch( () => null );
  }

  if ( loading ) {
    return <p className="markaroo-admin__loading">Loading…</p>;
  }

  return (
    <div className="markaroo-admin-shares">
      <div className="markaroo-admin-shares__head">
        <h2 className="markaroo-admin__section-title">Share Links</h2>
        <button
          className="markaroo-admin-btn markaroo-admin-btn--primary"
          type="button"
          onClick={ () => setShowForm( ! showForm ) }
        >
          { showForm ? 'Cancel' : '+ New link' }
        </button>
      </div>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }

      { showForm && (
        <form className="markaroo-share-form" onSubmit={ createShare }>
          <label>
            Label (internal)
            <input
              type="text"
              value={ label }
              onChange={ ( e ) => setLabel( e.target.value ) }
              placeholder="e.g. Client review"
            />
          </label>

          <label>
            Scope
            <select value={ scope } onChange={ ( e ) => setScope( e.target.value ) }>
              <option value="site">Entire site</option>
              <option value="page">Single page</option>
            </select>
          </label>

          { scope === 'page' && (
            <label>
              Page path
              <input
                type="text"
                value={ pageKey }
                onChange={ ( e ) => setPageKey( e.target.value ) }
                placeholder="/my-page"
              />
            </label>
          ) }

          <label>
            Widget mode
            <select value={ mode } onChange={ ( e ) => setMode( e.target.value ) }>
              <option value="comment">Comment</option>
              <option value="view">View only</option>
              <option value="clean">Clean</option>
            </select>
          </label>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ canComment }
              onChange={ ( e ) => setCanComment( e.target.checked ) }
            />
            Allow commenting
          </label>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ canView }
              onChange={ ( e ) => setCanView( e.target.checked ) }
            />
            Allow viewing pins
          </label>

          <label>
            Expires (optional)
            <input
              type="datetime-local"
              value={ expires }
              onChange={ ( e ) => setExpires( e.target.value ) }
            />
          </label>

          <button
            className="markaroo-admin-btn markaroo-admin-btn--primary"
            type="submit"
            disabled={ creating }
          >
            { creating ? 'Creating…' : 'Create link' }
          </button>
        </form>
      ) }

      { shares.length === 0 && ! showForm && (
        <p className="markaroo-admin__empty">No share links yet.</p>
      ) }

      { shares.length > 0 && (
        <table className="markaroo-admin-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Scope</th>
              <th>Mode</th>
              <th>Expires</th>
              <th>URL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { shares.map( ( s ) => (
              <tr key={ s.id }>
                <td>{ s.label ?? <em>—</em> }</td>
                <td>{ s.scope === 'page' ? <code>{ s.page_key }</code> : 'site' }</td>
                <td>{ s.widget_mode }</td>
                <td>{ s.expires_at ? new Date( s.expires_at ).toLocaleDateString() : '—' }</td>
                <td>
                  <button
                    className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                    type="button"
                    onClick={ () => copyUrl( s.share_url ) }
                    title={ s.share_url }
                  >
                    Copy URL
                  </button>
                </td>
                <td>
                  <button
                    className="markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm"
                    type="button"
                    onClick={ () => revokeShare( s.id ) }
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ) ) }
          </tbody>
        </table>
      ) }
    </div>
  );
}
