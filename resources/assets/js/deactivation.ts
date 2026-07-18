/**
 * Deactivation dialog for plugins.php.
 *
 * Intercepts Markaroo's Deactivate link and offers: keep data (default),
 * delete ALL data (checkbox-gated, calls the purge endpoint), an optional
 * reason survey, and an inline bug-report form. Closing the dialog always
 * cancels; "Skip & deactivate" always works — the user is never trapped.
 */
import { __ } from '@wordpress/i18n';

interface DeactivationConfig {
  restUrl: string;
  nonce: string;
  basename: string;
  userName: string;
  userEmail: string;
}

declare global {
  interface Window {
    markarooDeactivation?: DeactivationConfig;
  }
}

const config = window.markarooDeactivation;

const REASONS: Array< [ string, string ] > = [
  [ 'temporary', __( 'Temporary deactivation', 'markaroo' ) ],
  [ 'bug', __( 'I found a bug', 'markaroo' ) ],
  [ 'missing-feature', __( 'Missing a feature I need', 'markaroo' ) ],
  [ 'project-done', __( 'Done with this project', 'markaroo' ) ],
  [ 'other', __( 'Other', 'markaroo' ) ],
];

function el< T extends HTMLElement >( root: HTMLElement, sel: string ): T {
  return root.querySelector( sel ) as T;
}

/**
 * Escape a string for safe interpolation into the modal's HTML template
 * (element and double-quoted attribute contexts). Everything interpolated is
 * a `__()` translation, but translation files are not a trust boundary we
 * want to rely on.
 * @param s
 */
function esc( s: string ): string {
  return s
    .replace( /&/g, '&amp;' )
    .replace( /</g, '&lt;' )
    .replace( />/g, '&gt;' )
    .replace( /"/g, '&quot;' );
}

/**
 * Send survey/bug text through the existing plugin-feedback pipeline.
 * @param subject
 * @param message
 * @param keepalive
 */
function sendFeedback( subject: string, message: string, keepalive: boolean ): Promise< Response > {
  return fetch( `${ config!.restUrl }/plugin-feedback`, {
    method: 'POST',
    keepalive,
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': config!.nonce,
    },
    body: JSON.stringify( {
      name: config!.userName || 'WordPress admin',
      email: config!.userEmail,
      subject,
      message,
    } ),
  } );
}

function buildModal(): HTMLDivElement {
  const overlay = document.createElement( 'div' );
  overlay.className = 'markaroo-deactivation-overlay';
  overlay.innerHTML = `
	<div class="markaroo-deactivation" role="dialog" aria-modal="true" aria-label="${ esc(
    __( 'Deactivate Markaroo', 'markaroo' )
  ) }" tabindex="-1">
		<div class="markaroo-deactivation__head">
			<h2>${ esc( __( 'Deactivate Markaroo', 'markaroo' ) ) }</h2>
			<button type="button" class="markaroo-deactivation__close" aria-label="${ esc(
        __( 'Close', 'markaroo' )
      ) }">&times;</button>
		</div>

		<fieldset class="markaroo-deactivation__reasons">
			<legend>${ esc( __( 'Why are you deactivating? (optional)', 'markaroo' ) ) }</legend>
			${ REASONS.map(
        ( [ value, label ] ) => `
			<label><input type="radio" name="markaroo-reason" value="${ value }"> ${ esc( label ) }</label>`
      ).join( '' ) }
			<textarea class="markaroo-deactivation__reason-other" rows="2" placeholder="${ esc(
        __( 'Tell us more…', 'markaroo' )
      ) }" hidden></textarea>
		</fieldset>

		<fieldset class="markaroo-deactivation__data">
			<legend>${ esc( __( 'What should happen to your Markaroo data?', 'markaroo' ) ) }</legend>
			<label><input type="radio" name="markaroo-data" value="keep" checked> ${ esc(
        __( 'Keep data — I might use Markaroo again', 'markaroo' )
      ) }</label>
			<label><input type="radio" name="markaroo-data" value="delete"> ${ esc(
        __(
          'Delete all data — feedback, replies, share links, settings, and all screenshots/attachments',
          'markaroo'
        )
      ) }</label>
			<label class="markaroo-deactivation__confirm-wrap" hidden>
				<input type="checkbox" class="markaroo-deactivation__confirm">
				${ esc(
          __(
            'I understand this permanently deletes all Markaroo data and cannot be undone.',
            'markaroo'
          )
        ) }
			</label>
		</fieldset>

		<details class="markaroo-deactivation__bug">
			<summary>${ esc( __( 'Found a bug? Tell us and we may fix it fast.', 'markaroo' ) ) }</summary>
			<textarea class="markaroo-deactivation__bug-text" rows="3" placeholder="${ esc(
        __( 'What went wrong?', 'markaroo' )
      ) }"></textarea>
			<button type="button" class="button markaroo-deactivation__bug-send">${ esc(
        __( 'Send bug report', 'markaroo' )
      ) }</button>
			<span class="markaroo-deactivation__bug-status" role="status"></span>
		</details>

		<p class="markaroo-deactivation__error" role="alert" hidden></p>

		<div class="markaroo-deactivation__actions">
			<button type="button" class="button button-link markaroo-deactivation__skip">${ esc(
        __( 'Skip & deactivate', 'markaroo' )
      ) }</button>
			<span class="markaroo-deactivation__spacer"></span>
			<button type="button" class="button markaroo-deactivation__cancel">${ esc(
        __( 'Cancel', 'markaroo' )
      ) }</button>
			<button type="button" class="button button-primary markaroo-deactivation__go">${ esc(
        __( 'Deactivate', 'markaroo' )
      ) }</button>
		</div>
	</div>`;
  return overlay;
}

function openModal( deactivateHref: string ): void {
  const overlay = buildModal();
  document.body.appendChild( overlay );

  const dialog = el< HTMLDivElement >( overlay, '.markaroo-deactivation' );
  const confirmWrap = el< HTMLElement >( overlay, '.markaroo-deactivation__confirm-wrap' );
  const confirmBox = el< HTMLInputElement >( overlay, '.markaroo-deactivation__confirm' );
  const otherText = el< HTMLTextAreaElement >( overlay, '.markaroo-deactivation__reason-other' );
  const errorBox = el< HTMLElement >( overlay, '.markaroo-deactivation__error' );
  const goBtn = el< HTMLButtonElement >( overlay, '.markaroo-deactivation__go' );

  const close = () => {
    document.removeEventListener( 'keydown', onKey );
    overlay.remove();
  };
  const onKey = ( e: KeyboardEvent ) => {
    if ( e.key === 'Escape' ) {
      close();
    }
  };
  document.addEventListener( 'keydown', onKey );
  dialog.focus();

  overlay.addEventListener( 'mousedown', ( e ) => {
    if ( e.target === overlay ) {
      close();
    }
  } );
  el( overlay, '.markaroo-deactivation__close' ).onclick = close;
  el( overlay, '.markaroo-deactivation__cancel' ).onclick = close;

  el( overlay, '.markaroo-deactivation__skip' ).onclick = () => {
    window.location.href = deactivateHref;
  };

  const dataChoice = (): string =>
    ( overlay.querySelector( 'input[name="markaroo-data"]:checked' ) as HTMLInputElement ).value;

  // Delete choice reveals the safeguard; confirm button stays disabled
  // until the checkbox is ticked.
  const syncGate = () => {
    const deleting = dataChoice() === 'delete';
    confirmWrap.hidden = ! deleting;
    goBtn.disabled = deleting && ! confirmBox.checked;
    goBtn.textContent = deleting
      ? __( 'Delete data & deactivate', 'markaroo' )
      : __( 'Deactivate', 'markaroo' );
    goBtn.classList.toggle( 'markaroo-deactivation__go--danger', deleting );
  };
  overlay
    .querySelectorAll( 'input[name="markaroo-data"]' )
    .forEach( ( r ) => r.addEventListener( 'change', syncGate ) );
  confirmBox.addEventListener( 'change', syncGate );

  // "Other" reason gets a free-text field.
  overlay.querySelectorAll( 'input[name="markaroo-reason"]' ).forEach( ( r ) =>
    r.addEventListener( 'change', () => {
      otherText.hidden =
        ( overlay.querySelector( 'input[name="markaroo-reason"]:checked' ) as HTMLInputElement )
          ?.value !== 'other';
    } )
  );

  // Inline bug report: awaited, shows result, never blocks deactivation.
  el< HTMLButtonElement >( overlay, '.markaroo-deactivation__bug-send' ).onclick = async ( e ) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const text = el< HTMLTextAreaElement >(
      overlay,
      '.markaroo-deactivation__bug-text'
    ).value.trim();
    if ( ! text ) {
      return;
    }
    const status = el< HTMLElement >( overlay, '.markaroo-deactivation__bug-status' );
    btn.disabled = true;
    try {
      const res = await sendFeedback( __( 'Bug report (deactivation)', 'markaroo' ), text, false );
      status.textContent = res.ok
        ? __( 'Thanks — report sent.', 'markaroo' )
        : __( 'Could not send. Please try again.', 'markaroo' );
    } catch {
      status.textContent = __( 'Could not send. Please try again.', 'markaroo' );
    }
    btn.disabled = false;
  };

  goBtn.onclick = async () => {
    errorBox.hidden = true;

    // Optional survey — fire-and-forget with keepalive so navigation
    // doesn't cancel it. Failure never blocks deactivation.
    const reason = overlay.querySelector(
      'input[name="markaroo-reason"]:checked'
    ) as HTMLInputElement | null;
    if ( reason ) {
      const detail = reason.value === 'other' ? `: ${ otherText.value.trim() }` : '';
      sendFeedback(
        __( 'Deactivation survey', 'markaroo' ),
        `Reason: ${ reason.value }${ detail }\nData choice: ${ dataChoice() }`,
        true
      ).catch( () => undefined );
    }

    if ( dataChoice() === 'delete' ) {
      goBtn.disabled = true;
      goBtn.textContent = __( 'Deleting data…', 'markaroo' );
      try {
        const res = await fetch( `${ config!.restUrl }/deactivate-cleanup`, {
          method: 'POST',
          headers: { 'X-WP-Nonce': config!.nonce },
        } );
        if ( ! res.ok ) {
          throw new Error( String( res.status ) );
        }
      } catch {
        errorBox.textContent = __(
          'Deleting data failed — nothing was deactivated. Please try again.',
          'markaroo'
        );
        errorBox.hidden = false;
        goBtn.disabled = false;
        syncGate();
        return;
      }
    }

    window.location.href = deactivateHref;
  };
}

function init(): void {
  if ( ! config ) {
    return;
  }
  const link = document.querySelector< HTMLAnchorElement >(
    `tr[data-plugin="${ config.basename }"] .deactivate a`
  );
  if ( ! link ) {
    return;
  }
  link.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    openModal( link.href );
  } );
}

if ( document.readyState === 'loading' ) {
  document.addEventListener( 'DOMContentLoaded', init );
} else {
  init();
}
