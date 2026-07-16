import { __ } from '@wordpress/i18n';

declare global {
  interface Window {
    markarooHooksDoc?: string;
  }
}

/**
 * Read-only "Developers" tab. Renders the bundled HOOKS.md contract so the
 * Pro/integration surface is discoverable from inside wp-admin. The content is
 * inlined by PHP (window.markarooHooksDoc) — zero runtime query cost, and no
 * HTML injection (rendered as plain text in a <pre>).
 */
export function DevelopersView() {
  const doc = window.markarooHooksDoc ?? '';

  return (
    <div className="markaroo-admin-developers">
      <div className="markaroo-admin-tasklist__toolbar">
        <h2 className="markaroo-admin__section-title" style={ { margin: 0 } }>
          { __( 'Developers', 'markaroo' ) }
        </h2>
        <p className="markaroo-admin-developers__intro">
          { __(
            'Actions and filters Markaroo fires. Use these to extend Markaroo from a companion plugin without editing core.',
            'markaroo'
          ) }
        </p>
      </div>

      { doc ? (
        <div className="markaroo-admin-developers__doc" tabIndex={ 0 }>
          <pre className="markaroo-admin-developers__pre">{ doc }</pre>
        </div>
      ) : (
        <div className="markaroo-admin__empty" style={ { padding: '20px' } }>
          { __( 'Hook documentation is unavailable.', 'markaroo' ) }
        </div>
      ) }
    </div>
  );
}
