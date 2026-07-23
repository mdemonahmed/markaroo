import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Mail } from 'lucide-react';
import { sendTestDigest } from '../api';

interface NotifSettings {
  notify_mode: string;
  digest_interval: number;
  events: Record< string, boolean >;
}

const DEFAULTS: NotifSettings = {
  notify_mode: 'digest',
  digest_interval: 30,
  events: { new_feedback: true, reply: true, mention: true, assignment: true, resolved: false },
};

/**
 * Dedicated Email Notification settings page. Maps onto the existing
 * `notifications` settings group: the enable checkbox is notify_mode !== 'off',
 * delivery mode is digest|smart, and instant alerts map to events.*.
 */
export function EmailNotificationView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';

  const [ notif, setNotif ] = useState< NotifSettings >( DEFAULTS );
  // Remember the mode to restore when re-enabling after "off".
  const [ lastMode, setLastMode ] = useState( 'digest' );
  const [ loading, setLoading ] = useState( true );
  const [ saving, setSaving ] = useState( false );
  const [ saved, setSaved ] = useState( false );
  const [ error, setError ] = useState< string | null >( null );
  const [ testing, setTesting ] = useState( false );
  const [ testMsg, setTestMsg ] = useState< string | null >( null );

  useEffect( () => {
    fetch( restBase + 'settings', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) => ( r.ok ? r.json() : Promise.reject( r.status ) ) )
      .then( ( s: { notifications?: Partial< NotifSettings > } ) => {
        const n = s.notifications ?? {};
        const mode = String( n.notify_mode ?? 'digest' );
        setNotif( {
          notify_mode: mode,
          digest_interval: Number( n.digest_interval ?? 30 ),
          events: { ...DEFAULTS.events, ...( n.events ?? {} ) },
        } );
        if ( mode !== 'off' ) {
          setLastMode( mode === 'instant' ? 'smart' : mode );
        }
      } )
      .catch( () => setError( __( 'Could not load settings.', 'markaroo' ) ) )
      .finally( () => setLoading( false ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  const enabled = notif.notify_mode !== 'off';
  // Legacy 'instant' renders as Smart in the two-option select.
  const modeValue = notif.notify_mode === 'digest' ? 'digest' : 'smart';

  function update( changes: Partial< NotifSettings > ) {
    setNotif( ( prev ) => ( { ...prev, ...changes } ) );
  }

  async function handleSave( e: React.FormEvent ) {
    e.preventDefault();
    setSaving( true );
    setError( null );
    setSaved( false );
    try {
      const res = await fetch( restBase + 'settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce },
        body: JSON.stringify( { notifications: notif } ),
      } );
      if ( ! res.ok ) {
        throw new Error( await res.text() );
      }
      setSaved( true );
      setTimeout( () => setSaved( false ), 3000 );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : __( 'Save failed.', 'markaroo' ) );
    } finally {
      setSaving( false );
    }
  }

  async function handleTest() {
    setTesting( true );
    setTestMsg( null );
    try {
      const res = await sendTestDigest();
      /* translators: %s: recipient email address. */
      setTestMsg( `${ __( 'Test email sent to', 'markaroo' ) } ${ res.email }` );
    } catch {
      setTestMsg( __( 'Could not send the test email.', 'markaroo' ) );
    } finally {
      setTesting( false );
      setTimeout( () => setTestMsg( null ), 5000 );
    }
  }

  if ( loading ) {
    return <p className="markaroo-admin__loading">{ __( 'Loading…', 'markaroo' ) }</p>;
  }

  return (
    <div className="markaroo-admin-settings markaroo-admin-notifications">
      <h2 className="markaroo-admin__section-title">{ __( 'Email Notification', 'markaroo' ) }</h2>

      { error && <div className="markaroo-admin__error-box">{ error }</div> }
      { saved && (
        <div className="markaroo-admin__success-box">{ __( 'Settings saved.', 'markaroo' ) }</div>
      ) }

      <form onSubmit={ handleSave }>
        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">
            { __( 'Email Notifications', 'markaroo' ) }
          </h3>

          <label className="markaroo-settings-toggle" htmlFor="markaroo-en-enable">
            <input
              id="markaroo-en-enable"
              type="checkbox"
              checked={ enabled }
              onChange={ ( e ) => {
                if ( e.target.checked ) {
                  update( { notify_mode: lastMode } );
                } else {
                  setLastMode( modeValue );
                  update( { notify_mode: 'off' } );
                }
              } }
            />
            { __( 'Enable Visual Feedback email notifications', 'markaroo' ) }
          </label>
          <p className="markaroo-settings-group__hint">
            { __( 'Uses low-spam delivery with digest by default.', 'markaroo' ) }
          </p>

          { enabled && (
            <>
              <hr className="markaroo-settings-divider" />

              <h4 className="markaroo-settings-subhead">{ __( 'Delivery Mode', 'markaroo' ) }</h4>
              <label htmlFor="markaroo-en-mode">
                { __( 'Mode', 'markaroo' ) }
                <select
                  id="markaroo-en-mode"
                  value={ modeValue }
                  onChange={ ( e ) => {
                    update( { notify_mode: e.target.value } );
                    setLastMode( e.target.value );
                  } }
                >
                  <option value="digest">{ __( 'Digest only (recommended)', 'markaroo' ) }</option>
                  <option value="smart">
                    { __( 'Smart: Digest + instant assignment/mentions', 'markaroo' ) }
                  </option>
                </select>
              </label>

              <h4 className="markaroo-settings-subhead">
                { __( 'Digest Frequency', 'markaroo' ) }
              </h4>
              <label htmlFor="markaroo-en-interval">
                { __( 'Send a digest', 'markaroo' ) }
                <select
                  id="markaroo-en-interval"
                  value={ notif.digest_interval }
                  onChange={ ( e ) => update( { digest_interval: Number( e.target.value ) } ) }
                >
                  <option value={ 15 }>{ __( 'Every 15 minutes', 'markaroo' ) }</option>
                  <option value={ 30 }>{ __( 'Every 30 minutes', 'markaroo' ) }</option>
                  <option value={ 60 }>{ __( 'Every 60 minutes', 'markaroo' ) }</option>
                </select>
              </label>

              { modeValue === 'smart' && (
                <>
                  <h4 className="markaroo-settings-subhead">
                    { __( 'Instant Alerts (Smart mode)', 'markaroo' ) }
                  </h4>

                  <label className="markaroo-settings-toggle" htmlFor="markaroo-en-assignment">
                    <input
                      id="markaroo-en-assignment"
                      type="checkbox"
                      checked={ Boolean( notif.events.assignment ) }
                      onChange={ ( e ) =>
                        update( { events: { ...notif.events, assignment: e.target.checked } } )
                      }
                    />
                    { __( 'Send instant emails for assignment changes', 'markaroo' ) }
                  </label>

                  <label className="markaroo-settings-toggle" htmlFor="markaroo-en-mention">
                    <input
                      id="markaroo-en-mention"
                      type="checkbox"
                      checked={ Boolean( notif.events.mention ) }
                      onChange={ ( e ) =>
                        update( { events: { ...notif.events, mention: e.target.checked } } )
                      }
                    />
                    { __( 'Send instant emails when users are mentioned (@username)', 'markaroo' ) }
                  </label>
                </>
              ) }

              <h4 className="markaroo-settings-subhead">
                { __( 'Events', 'markaroo' ) }
              </h4>

              <label className="markaroo-settings-toggle" htmlFor="markaroo-en-new-feedback">
                <input
                  id="markaroo-en-new-feedback"
                  type="checkbox"
                  checked={ Boolean( notif.events.new_feedback ) }
                  onChange={ ( e ) =>
                    update( { events: { ...notif.events, new_feedback: e.target.checked } } )
                  }
                />
                { __( 'Notify when new feedback is created', 'markaroo' ) }
              </label>

              <label className="markaroo-settings-toggle" htmlFor="markaroo-en-reply">
                <input
                  id="markaroo-en-reply"
                  type="checkbox"
                  checked={ Boolean( notif.events.reply ) }
                  onChange={ ( e ) =>
                    update( { events: { ...notif.events, reply: e.target.checked } } )
                  }
                />
                { __( 'Notify when a reply is posted', 'markaroo' ) }
              </label>

              <label className="markaroo-settings-toggle" htmlFor="markaroo-en-resolved">
                <input
                  id="markaroo-en-resolved"
                  type="checkbox"
                  checked={ Boolean( notif.events.resolved ) }
                  onChange={ ( e ) =>
                    update( { events: { ...notif.events, resolved: e.target.checked } } )
                  }
                />
                { __( 'Notify the author when feedback is resolved', 'markaroo' ) }
              </label>
            </>
          ) }
        </div>

        <div className="markaroo-settings-group">
          <h3 className="markaroo-settings-group__title">
            { __( 'Send Test Email', 'markaroo' ) }
          </h3>
          <p className="markaroo-settings-group__hint">
            { __(
              'Send a sample notification email to the admin address to verify delivery is working.',
              'markaroo'
            ) }
          </p>
          <div className="markaroo-settings-testdigest">
            <button
              type="button"
              className="markaroo-admin-btn markaroo-admin-btn--ghost"
              onClick={ handleTest }
              disabled={ testing }
            >
              <Mail size={ 15 } strokeWidth={ 2 } />
              { testing ? __( 'Sending…', 'markaroo' ) : __( 'Send test email', 'markaroo' ) }
            </button>
            { testMsg && <span className="markaroo-settings-testdigest__msg">{ testMsg }</span> }
          </div>
        </div>

        <div className="markaroo-settings-actions">
          <button
            type="submit"
            className="markaroo-admin-btn markaroo-admin-btn--primary"
            disabled={ saving }
          >
            { saving ? __( 'Saving…', 'markaroo' ) : __( 'Save settings', 'markaroo' ) }
          </button>
        </div>
      </form>
    </div>
  );
}
