import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { sendPluginFeedback } from '../api';

export function PluginFeedbackView() {
  const me = window.markarooConfig.currentUser;
  const [ name, setName ] = useState( me?.name ?? '' );
  const [ email, setEmail ] = useState( '' );
  const [ subject, setSubject ] = useState( '' );
  const [ message, setMessage ] = useState( '' );
  const [ sending, setSending ] = useState( false );
  const [ sent, setSent ] = useState( false );
  const [ error, setError ] = useState< string | null >( null );
  const [ emailError, setEmailError ] = useState< string | null >( null );

  function validEmail( v: string ): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( v );
  }

  async function handleSubmit( e: React.FormEvent ) {
    e.preventDefault();
    setError( null );
    if ( ! validEmail( email ) ) {
      setEmailError( __( 'Please enter a valid email address.', 'markaroo' ) );
      return;
    }
    setEmailError( null );
    setSending( true );
    try {
      await sendPluginFeedback( {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      } );
      setSent( true );
      setSubject( '' );
      setMessage( '' );
    } catch {
      setError( __( 'The message could not be sent. Please try again.', 'markaroo' ) );
    } finally {
      setSending( false );
    }
  }

  return (
    <div className="markaroo-admin-settings markaroo-plugin-feedback">
      <h2 className="markaroo-admin__section-title">
        { __( 'Send Plugin Feedback', 'markaroo' ) }
      </h2>
      <p className="markaroo-getstarted__sub">
        { __(
          'Share a bug report, feature request, or question with Native Infotech.',
          'markaroo'
        ) }
      </p>

      { sent && (
        <div className="markaroo-admin__success-box">
          { __( 'Thanks! Your message has been sent.', 'markaroo' ) }
        </div>
      ) }
      { error && <div className="markaroo-admin__error-box">{ error }</div> }

      <form onSubmit={ handleSubmit } className="markaroo-settings-group" noValidate>
        <label htmlFor="markaroo-pf-name">
          { __( 'Your Name', 'markaroo' ) }
          <input
            id="markaroo-pf-name"
            type="text"
            value={ name }
            required
            maxLength={ 191 }
            onChange={ ( e ) => setName( e.target.value ) }
          />
        </label>

        <label htmlFor="markaroo-pf-email">
          { __( 'Your Email', 'markaroo' ) }
          <input
            id="markaroo-pf-email"
            type="email"
            value={ email }
            required
            maxLength={ 191 }
            onChange={ ( e ) => setEmail( e.target.value ) }
          />
        </label>
        { emailError && <p className="markaroo-field-error">{ emailError }</p> }

        <label htmlFor="markaroo-pf-subject">
          { __( 'Subject', 'markaroo' ) }
          <input
            id="markaroo-pf-subject"
            type="text"
            value={ subject }
            required
            maxLength={ 191 }
            placeholder={ __( 'Feature request, bug report, or question', 'markaroo' ) }
            onChange={ ( e ) => setSubject( e.target.value ) }
          />
        </label>

        <label htmlFor="markaroo-pf-message">
          { __( 'Message', 'markaroo' ) }
          <textarea
            id="markaroo-pf-message"
            rows={ 8 }
            value={ message }
            required
            onChange={ ( e ) => setMessage( e.target.value ) }
          />
        </label>

        <p className="markaroo-settings-group__hint">
          { __(
            'This message will be emailed to hello@devemon.com along with your site URL and plugin version.',
            'markaroo'
          ) }
        </p>

        <div className="markaroo-settings-actions">
          <button
            type="submit"
            className="markaroo-admin-btn markaroo-admin-btn--primary"
            disabled={
              sending || ! name.trim() || ! email.trim() || ! subject.trim() || ! message.trim()
            }
          >
            { sending ? __( 'Sending…', 'markaroo' ) : __( 'Send Feedback', 'markaroo' ) }
          </button>
        </div>
      </form>
    </div>
  );
}
