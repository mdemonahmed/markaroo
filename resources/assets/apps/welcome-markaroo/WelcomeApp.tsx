import { useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * First-run onboarding: welcome screen + 3-step quick-setup wizard.
 * Full-bleed, always skippable, fires once (guarded server-side).
 */

interface WelcomeBootstrap {
  dashboardUrl: string;
  siteUrl: string;
  firstName: string;
}

// The full window.markarooConfig type is declared globally by the widget
// (resources/assets/widget/types.ts); this app only needs a few fields.
interface WelcomeConfig {
  restUrl: string;
  nonce: string;
  pluginUrl: string;
}

declare global {
  interface Window {
    markarooWelcome?: WelcomeBootstrap;
  }
}

type AccessMode = 'team_only' | 'team_clients' | 'anyone_link';

type Phase = 'welcome' | 1 | 2 | 3;

interface ChecklistState {
  configured: boolean;
  has_share_link: boolean;
  has_feedback: boolean;
}

const boot: WelcomeBootstrap = window.markarooWelcome ?? {
  dashboardUrl: '',
  siteUrl: '',
  firstName: '',
};
const config: WelcomeConfig = window.markarooConfig ?? { restUrl: '', nonce: '', pluginUrl: '' };
const restBase = config.restUrl + 'markaroo/v1/onboarding/';

function post( route: string, body: Record< string, unknown > ): Promise< Response > {
  return fetch( restBase + route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce },
    body: JSON.stringify( body ),
  } );
}

export function WelcomeApp() {
  const [ phase, setPhase ] = useState< Phase >( 'welcome' );
  const [ access, setAccess ] = useState< AccessMode >( 'team_clients' );
  const [ screenshots, setScreenshots ] = useState( true );
  const [ annotate, setAnnotate ] = useState( true );
  const [ checklist, setChecklist ] = useState< ChecklistState | null >( null );
  const [ busy, setBusy ] = useState( false );

  const markUrl = config.pluginUrl + 'public/images/brand/icon.svg';

  const finish = useCallback( ( target: string ) => {
    setBusy( true );
    post( 'complete', {} ).finally( () => {
      window.location.href = target || boot.dashboardUrl;
    } );
  }, [] );

  const saveStep = useCallback( ( step: number, data: Record< string, unknown > ) => {
    // Fire-and-forget; the wizard never blocks on a slow network.
    post( 'step', { step, data } ).catch( () => undefined );
  }, [] );

  function goStep2() {
    saveStep( 1, { access } );
    setPhase( 2 );
  }

  function goStep3() {
    saveStep( 2, { screenshots, annotate } );
    setPhase( 3 );
    // Pull live checklist state for the final step.
    fetch( restBase + 'state', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) => ( r.ok ? r.json() : null ) )
      .then( ( s: ChecklistState | null ) => s && setChecklist( s ) )
      .catch( () => undefined );
  }

  const ACCESS_CHOICES: { value: AccessMode; title: string; hint: string }[] = [
    {
      value: 'team_only',
      title: __( 'My team only', 'markaroo' ),
      hint: __( 'Logged-in WordPress users only.', 'markaroo' ),
    },
    {
      value: 'team_clients',
      title: __( 'Team + clients', 'markaroo' ),
      hint: __( 'Your team plus people you share links with.', 'markaroo' ),
    },
    {
      value: 'anyone_link',
      title: __( 'Anyone with a link', 'markaroo' ),
      hint: __( 'No login required to comment.', 'markaroo' ),
    },
  ];

  return (
    <div className="markaroo-app markaroo-welcome">
      <div className="markaroo-welcome__card">
        { phase !== 'welcome' && (
          <div className="markaroo-stepper" aria-label={ __( 'Setup progress', 'markaroo' ) }>
            { [ 1, 2, 3 ].map( ( n ) => (
              <span
                key={ n }
                className={
                  'markaroo-stepper__dot' +
                  ( phase === n ? ' markaroo-stepper__dot--active' : '' ) +
                  ( typeof phase === 'number' && n < phase ? ' markaroo-stepper__dot--done' : '' )
                }
              />
            ) ) }
          </div>
        ) }

        { phase === 'welcome' && (
          <>
            <span className="markaroo-welcome__mark">
              <img src={ markUrl } alt="" />
            </span>
            <p className="markaroo-welcome__eyebrow">
              { boot.firstName
                ? sprintf(
                    /* translators: %s: user first name. */ __( 'Hello, %s!', 'markaroo' ),
                    boot.firstName
                  )
                : __( 'Hello there!', 'markaroo' ) }
            </p>
            <h1 className="markaroo-welcome__title">{ __( 'Welcome to Markaroo', 'markaroo' ) }</h1>
            <p className="markaroo-welcome__body">
              { __(
                'Collect visual feedback right on your live pages. Turn comments into tasks. Share a no-login link with clients in seconds.',
                'markaroo'
              ) }
            </p>
            <div className="markaroo-welcome__actions">
              <button
                type="button"
                className="markaroo-btn markaroo-btn--primary markaroo-btn--lg"
                onClick={ () => setPhase( 1 ) }
              >
                { __( "Let's Start", 'markaroo' ) }
              </button>
            </div>
          </>
        ) }

        { phase === 1 && (
          <>
            <h2 className="markaroo-welcome__step-head">
              { __( 'Who gives feedback?', 'markaroo' ) }
            </h2>
            <p className="markaroo-welcome__step-sub">
              { __(
                'Sets your default access. You can change it anytime in Settings.',
                'markaroo'
              ) }
            </p>
            <div className="markaroo-welcome__choices">
              { ACCESS_CHOICES.map( ( c ) => (
                <button
                  key={ c.value }
                  type="button"
                  className={
                    'markaroo-choice' + ( access === c.value ? ' markaroo-choice--active' : '' )
                  }
                  aria-pressed={ access === c.value }
                  onClick={ () => setAccess( c.value ) }
                >
                  <span className="markaroo-choice__title">{ c.title }</span>
                  <span className="markaroo-choice__hint">{ c.hint }</span>
                </button>
              ) ) }
            </div>
            <div className="markaroo-welcome__nav">
              <button
                type="button"
                className="markaroo-btn markaroo-btn--ghost"
                onClick={ () => setPhase( 'welcome' ) }
              >
                { __( 'Back', 'markaroo' ) }
              </button>
              <button
                type="button"
                className="markaroo-btn markaroo-btn--primary"
                onClick={ goStep2 }
              >
                { __( 'Continue', 'markaroo' ) }
              </button>
            </div>
          </>
        ) }

        { phase === 2 && (
          <>
            <h2 className="markaroo-welcome__step-head">
              { __( 'Capture defaults', 'markaroo' ) }
            </h2>
            <p className="markaroo-welcome__step-sub">
              { __( 'How much detail should each comment capture?', 'markaroo' ) }
            </p>
            <div className="markaroo-welcome__choices">
              <label className="markaroo-toggle" htmlFor="markaroo-onboard-screenshots">
                <span>{ __( 'Capture screenshots with each comment', 'markaroo' ) }</span>
                <input
                  id="markaroo-onboard-screenshots"
                  type="checkbox"
                  checked={ screenshots }
                  onChange={ ( e ) => setScreenshots( e.target.checked ) }
                />
              </label>
              <label className="markaroo-toggle" htmlFor="markaroo-onboard-annotate">
                <span>{ __( 'Let reviewers draw and annotate', 'markaroo' ) }</span>
                <input
                  id="markaroo-onboard-annotate"
                  type="checkbox"
                  checked={ annotate }
                  onChange={ ( e ) => setAnnotate( e.target.checked ) }
                />
              </label>
            </div>
            <div className="markaroo-welcome__nav">
              <button
                type="button"
                className="markaroo-btn markaroo-btn--ghost"
                onClick={ () => setPhase( 1 ) }
              >
                { __( 'Back', 'markaroo' ) }
              </button>
              <button
                type="button"
                className="markaroo-btn markaroo-btn--primary"
                onClick={ goStep3 }
              >
                { __( 'Continue', 'markaroo' ) }
              </button>
            </div>
          </>
        ) }

        { phase === 3 && (
          <>
            <h2 className="markaroo-welcome__step-head">{ __( "You're set!", 'markaroo' ) }</h2>
            <p className="markaroo-welcome__step-sub">
              { __( 'Finish these to get the most out of Markaroo.', 'markaroo' ) }
            </p>
            <ul className="markaroo-checklist">
              <ChecklistItem
                done={ !! checklist?.configured }
                label={ __( 'Configure capture defaults', 'markaroo' ) }
              />
              <ChecklistItem
                done={ !! checklist?.has_share_link }
                label={ __( 'Create your first share link', 'markaroo' ) }
              />
              <ChecklistItem
                done={ !! checklist?.has_feedback }
                label={ __( 'Collect your first feedback', 'markaroo' ) }
              />
            </ul>
            <div className="markaroo-welcome__nav">
              <button
                type="button"
                className="markaroo-btn markaroo-btn--secondary"
                disabled={ busy }
                onClick={ () => finish( boot.siteUrl ) }
              >
                { __( 'Open my site', 'markaroo' ) }
              </button>
              <button
                type="button"
                className="markaroo-btn markaroo-btn--primary"
                disabled={ busy }
                onClick={ () => finish( boot.dashboardUrl ) }
              >
                { __( 'Go to Dashboard', 'markaroo' ) }
              </button>
            </div>
          </>
        ) }
      </div>

      { phase === 'welcome' && (
        <button
          type="button"
          className="markaroo-welcome__skip"
          disabled={ busy }
          onClick={ () => finish( boot.dashboardUrl ) }
        >
          { __( 'I already know, skip it!', 'markaroo' ) }
        </button>
      ) }
    </div>
  );
}

function ChecklistItem( { done, label }: { done: boolean; label: string } ) {
  return (
    <li className="markaroo-checklist__item">
      <span
        className={ 'markaroo-checklist__tick' + ( done ? ' markaroo-checklist__tick--done' : '' ) }
      >
        { done ? '✓' : '' }
      </span>
      { label }
    </li>
  );
}
