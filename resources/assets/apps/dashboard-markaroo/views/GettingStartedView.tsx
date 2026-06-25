import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

interface ChecklistItem {
  key: string;
  title: string;
  help: string;
  action: string;
  done: boolean;
}

export interface OnboardingState {
  has_feedback: boolean;
  has_share_link: boolean;
  access_set: boolean;
  items: ChecklistItem[];
  done: boolean;
}

/**
 * Getting Started checklist (Task 26 §1). Reads booleans derived from real
 * data via GET onboarding/state — never stored "I clicked done" flags.
 * @param root0
 * @param root0.onLoaded
 */
export function GettingStartedView({ onLoaded }: { onLoaded?: (s: OnboardingState) => void }) {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';

  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(restBase + 'onboarding/state', { headers: { 'X-WP-Nonce': config.nonce } })
      .then((r) => (r.ok ? (r.json() as Promise<OnboardingState>) : Promise.reject()))
      .then((s) => {
        setState(s);
        onLoaded?.(s);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const siteUrl = config.restUrl.replace('/wp-json/', '/');

  function go(key: string) {
    if ('has_feedback' === key) {
      window.open(siteUrl, '_blank', 'noopener');
    } else if ('has_share_link' === key) {
      window.location.hash = 'shares';
    } else {
      window.location.hash = 'settings';
    }
  }

  if (loading) {
    return <p className="markaroo-admin__loading">{__('Loading…', 'markaroo')}</p>;
  }
  if (!state) {
    return null;
  }

  const firstUndone = state.items.findIndex((i) => !i.done);

  return (
    <div className="markaroo-getstarted">
      <h2 className="markaroo-admin__section-title">{__('Getting Started', 'markaroo')}</h2>
      <p className="markaroo-getstarted__sub">
        {__('Three quick steps to your first round of feedback.', 'markaroo')}
      </p>

      <ol className="markaroo-getstarted__list">
        {state.items.map((item, i) => (
          <li
            key={item.key}
            className={
              'markaroo-getstarted__item' + (item.done ? ' markaroo-getstarted__item--done' : '')
            }
          >
            <span className="markaroo-getstarted__num">{item.done ? '✓' : i + 1}</span>
            <div className="markaroo-getstarted__body">
              <span className="markaroo-getstarted__title">{item.title}</span>
              <span className="markaroo-getstarted__help">{item.help}</span>
            </div>
            {!item.done && (
              <button
                type="button"
                className={
                  'markaroo-btn ' +
                  (i === firstUndone ? 'markaroo-btn--primary' : 'markaroo-btn--secondary')
                }
                onClick={() => go(item.key)}
              >
                {item.action}
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
