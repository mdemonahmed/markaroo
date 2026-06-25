import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { FeedbackItem } from '../../../../widget/types';

/**
 * Approvals workflow (Task 26 §4). Lists resolved items awaiting sign-off.
 * Approve locks the item; Reopen sends it back. Gated by canApprove.
 */
export function ApprovalsView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const canApprove = !!config.currentUser?.canApprove;

  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const frontUrl = config.restUrl.replace('/wp-json/', '/').replace(/\/$/, '');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${restBase}feedback?status=resolved&per_page=50&order_by=updated_at&order=DESC`, {
      headers: { 'X-WP-Nonce': config.nonce },
    })
      .then((r) =>
        r.ok ? (r.json() as Promise<{ data: FeedbackItem[] }>) : Promise.reject(r.status)
      )
      .then((body) => setItems(body.data ?? []))
      .catch(() => setError(__('Could not load approvals.', 'markaroo')))
      .finally(() => setLoading(false));
  }, [restBase, config.nonce]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: number, action: 'approve' | 'reopen') {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`${restBase}feedback/${id}/${action}`, {
        method: 'POST',
        headers: { 'X-WP-Nonce': config.nonce, 'Content-Type': 'application/json' },
        body: '',
      });
      if (!res.ok) {
        throw new Error(String(res.status));
      }
      // Either action removes the row from the "awaiting approval" list.
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError(__('Action failed. Please try again.', 'markaroo'));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="markaroo-admin__loading">{__('Loading…', 'markaroo')}</p>;
  }

  return (
    <div className="markaroo-admin-approvals">
      <h2 className="markaroo-admin__section-title">{__('Approvals', 'markaroo')}</h2>
      <p className="markaroo-getstarted__sub">
        {__('Resolved items awaiting sign-off.', 'markaroo')}
      </p>

      {error && <div className="markaroo-admin__error-box">{error}</div>}
      {!canApprove && (
        <div className="markaroo-admin__error-box">
          {__('You can review these items, but only an approver can sign them off.', 'markaroo')}
        </div>
      )}

      {items.length === 0 ? (
        <p className="markaroo-admin__empty">{__('Nothing awaiting approval. 🎉', 'markaroo')}</p>
      ) : (
        <table className="markaroo-admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{__('Comment', 'markaroo')}</th>
              <th>{__('Assignee', 'markaroo')}</th>
              <th>{__('Page', 'markaroo')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <a
                    href={`${frontUrl}${item.page_key}?markaroo_open=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="markaroo-admin-link"
                  >
                    #{item.id}
                  </a>
                </td>
                <td className="markaroo-admin-tasklist__comment">
                  {item.comment.length > 80 ? item.comment.slice(0, 80) + '…' : item.comment}
                </td>
                <td>{item.assigned_to_name || <em style={{ color: '#9ca3af' }}>—</em>}</td>
                <td>
                  <code className="markaroo-admin-page-key">{item.page_key}</code>
                </td>
                <td className="markaroo-admin-approvals__actions">
                  {canApprove && (
                    <button
                      type="button"
                      className="markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm"
                      disabled={busyId === item.id}
                      onClick={() => act(item.id, 'approve')}
                    >
                      {__('Approve', 'markaroo')}
                    </button>
                  )}
                  <button
                    type="button"
                    className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                    disabled={busyId === item.id}
                    onClick={() => act(item.id, 'reopen')}
                  >
                    {__('Reopen', 'markaroo')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
