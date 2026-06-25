import { useState } from '@wordpress/element';
import { useWidget, useWidgetDispatch } from './store/WidgetContext';
import { ThreadView } from './thread/ThreadView';
import type { FeedbackItem } from './types';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af',
};

function FeedbackRow({
  item,
  number,
  active,
  onOpen,
}: {
  item: FeedbackItem;
  number: number;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      className={`markaroo-feedback-row${active ? ' markaroo-feedback-row--active' : ''}`}
      type="button"
      onClick={onOpen}
      aria-pressed={active}
    >
      <span
        className="markaroo-feedback-row__badge"
        style={{ backgroundColor: PRIORITY_COLORS[item.priority] ?? '#6366f1' }}
      >
        {number}
      </span>
      <span className="markaroo-feedback-row__text">{item.comment.slice(0, 80)}</span>
      {item.status === 'resolved' && (
        <span className="markaroo-feedback-row__resolved" aria-label="Resolved">
          ✓
        </span>
      )}
    </button>
  );
}

export function PinsPanel() {
  const { panelOpen, feedbacks, mode, captureState, activePinId } = useWidget();
  const dispatch = useWidgetDispatch();

  const config = window.markarooConfig;
  const canCreate = config?.currentUser?.canCreate ?? false;
  const shareCanComment = config?.shareRights?.canComment ?? false;
  const showNewButton = (canCreate || shareCanComment) && mode === 'comment';

  const [tab, setTab] = useState<'open' | 'resolved'>('open');

  if ('clean' === mode || !panelOpen || captureState === 'active') {
    return null;
  }

  const open = feedbacks.filter((f) => f.status === 'open');
  const resolved = feedbacks.filter((f) => f.status === 'resolved');
  const visible = tab === 'open' ? open : resolved;

  function openPin(id: number) {
    dispatch({ type: 'SET_ACTIVE_PIN', id: activePinId === id ? null : id });
    window.dispatchEvent(new CustomEvent('markaroo:pin-opened', { detail: { id } }));
  }

  return (
    <aside className="markaroo-panel" role="complementary" aria-label="Feedback panel">
      <div className="markaroo-panel__header">
        <h2 className="markaroo-panel__title">Feedback</h2>
        <div className="markaroo-panel__header-actions">
          {showNewButton && (
            <button
              className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
              type="button"
              onClick={() => dispatch({ type: 'START_CAPTURE' })}
            >
              + New
            </button>
          )}
          <button
            className="markaroo-panel__close"
            type="button"
            aria-label="Close"
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
          >
            &times;
          </button>
        </div>
      </div>

      <div className="markaroo-panel__tabs" role="tablist">
        <button
          className={`markaroo-panel__tab${tab === 'open' ? ' markaroo-panel__tab--active' : ''}`}
          role="tab"
          aria-selected={tab === 'open'}
          type="button"
          onClick={() => setTab('open')}
        >
          Open ({open.length})
        </button>
        <button
          className={`markaroo-panel__tab${
            tab === 'resolved' ? ' markaroo-panel__tab--active' : ''
          }`}
          role="tab"
          aria-selected={tab === 'resolved'}
          type="button"
          onClick={() => setTab('resolved')}
        >
          Resolved ({resolved.length})
        </button>
      </div>

      <div className="markaroo-panel__body" role="tabpanel">
        {activePinId !== null && feedbacks.find((f) => f.id === activePinId) ? (
          <ThreadView
            feedback={feedbacks.find((f) => f.id === activePinId)!}
            onClose={() => dispatch({ type: 'SET_ACTIVE_PIN', id: null })}
          />
        ) : visible.length === 0 ? (
          <p className="markaroo-panel__empty">
            {tab === 'open' ? 'No open feedback yet.' : 'No resolved feedback.'}
          </p>
        ) : (
          <div className="markaroo-feedback-list">
            {visible.map((item) => (
              <FeedbackRow
                key={item.id}
                item={item}
                number={feedbacks.indexOf(item) + 1}
                active={activePinId === item.id}
                onOpen={() => openPin(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
