import { useState, useEffect } from '@wordpress/element';

type SettingsMap = Record< string, Record< string, unknown > >;

export function SettingsView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';

  const [ settings, setSettings ] = useState< SettingsMap >( {} );
  const [ loading, setLoading ] = useState( true );
  const [ saving, setSaving ] = useState( false );
  const [ error, setError ] = useState< string | null >( null );
  const [ saved, setSaved ] = useState( false );

  useEffect( () => {
    fetch( restBase + 'settings', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) =>
        r.ok ? ( r.json() as Promise< SettingsMap > ) : Promise.reject( r.status )
      )
      .then( setSettings )
      .catch( () => setError( 'Could not load settings.' ) )
      .finally( () => setLoading( false ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

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

  if ( loading ) {
    return <p className="markaroo-admin__loading">Loading…</p>;
  }

  const g = settings.general ?? {};
  const c = settings.capture ?? {};
  const t = settings.tasks ?? {};
  const a = settings.access ?? {};
  const n = settings.notifications ?? {};
  const at = settings.attachments ?? {};

  return (
    <div className="markaroo-admin-settings">
      <h2 className="markaroo-admin__section-title">Settings</h2>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }
      { saved && <div className="markaroo-admin__success-box">Settings saved.</div> }

      <form onSubmit={ handleSave }>
        <fieldset className="markaroo-settings-group">
          <legend>General</legend>

          <label>
            Widget mode
            <select
              value={ String( g.default_widget_mode ?? 'comment' ) }
              onChange={ ( e ) => setField( 'general', 'default_widget_mode', e.target.value ) }
            >
              <option value="comment">Comment</option>
              <option value="view">View</option>
              <option value="clean">Clean</option>
            </select>
          </label>

          <label>
            Default priority
            <select
              value={ String( g.default_priority ?? 'normal' ) }
              onChange={ ( e ) => setField( 'general', 'default_priority', e.target.value ) }
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
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
        </fieldset>

        <fieldset className="markaroo-settings-group">
          <legend>Capture</legend>

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
        </fieldset>

        <fieldset className="markaroo-settings-group">
          <legend>Tasks</legend>

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

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( t.enable_tags ?? false ) }
              onChange={ ( e ) => setField( 'tasks', 'enable_tags', e.target.checked ) }
            />
            Enable tags
          </label>
        </fieldset>

        <fieldset className="markaroo-settings-group">
          <legend>Access</legend>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ Boolean( a.allow_guest_links ?? true ) }
              onChange={ ( e ) => setField( 'access', 'allow_guest_links', e.target.checked ) }
            />
            Allow guest share links
          </label>
        </fieldset>

        <fieldset className="markaroo-settings-group">
          <legend>Attachments</legend>

          <label>
            Max upload size (MB)
            <input
              type="number"
              min="1"
              max="100"
              value={ Number( at.max_upload_mb ?? 10 ) }
              onChange={ ( e ) =>
                setField( 'attachments', 'max_upload_mb', Number( e.target.value ) )
              }
            />
          </label>
        </fieldset>

        <fieldset className="markaroo-settings-group">
          <legend>Notifications</legend>

          <label>
            Mode
            <select
              value={ String( n.mode ?? 'digest' ) }
              onChange={ ( e ) => setField( 'notifications', 'mode', e.target.value ) }
            >
              <option value="off">Off</option>
              <option value="instant">Instant</option>
              <option value="digest">Digest</option>
              <option value="smart">Smart</option>
            </select>
          </label>
        </fieldset>

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
