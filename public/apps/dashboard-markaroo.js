(() => {
  'use strict';
  const e = window.wp.element,
    a = window.wp.i18n,
    s = window.ReactJSXRuntime;
  function t({ label: e, value: a, accent: t }) {
    return (0, s.jsxs)('div', {
      className: 'markaroo-stat-card',
      children: [
        (0, s.jsx)('span', {
          className: 'markaroo-stat-card__value',
          style: t ? { color: t } : void 0,
          children: a,
        }),
        (0, s.jsx)('span', { className: 'markaroo-stat-card__label', children: e }),
      ],
    });
  }
  function r() {
    const a = window.markarooConfig,
      r = a.restUrl + 'markaroo/v1/',
      [n, o] = (0, e.useState)(null),
      [l, i] = (0, e.useState)(!0),
      [c, d] = (0, e.useState)(null);
    return (
      (0, e.useEffect)(() => {
        fetch(r + 'counts', { headers: { 'X-WP-Nonce': a.nonce } })
          .then((e) => (e.ok ? e.json() : Promise.reject(e.status)))
          .then(o)
          .catch(() => d('Could not load counts.'))
          .finally(() => i(!1));
      }, []),
      l
        ? (0, s.jsx)('p', { className: 'markaroo-admin__loading', children: 'Loading…' })
        : c
        ? (0, s.jsx)('p', { className: 'markaroo-admin__error', children: c })
        : (0, s.jsxs)('div', {
            className: 'markaroo-admin-overview',
            children: [
              (0, s.jsx)('h2', {
                className: 'markaroo-admin__section-title',
                children: 'Overview',
              }),
              (0, s.jsxs)('div', {
                className: 'markaroo-stat-grid',
                children: [
                  (0, s.jsx)(t, { label: 'Total', value: n?.total ?? 0 }),
                  (0, s.jsx)(t, { label: 'Open', value: n?.open ?? 0, accent: '#6366f1' }),
                  (0, s.jsx)(t, { label: 'Resolved', value: n?.resolved ?? 0, accent: '#22c55e' }),
                  (0, s.jsx)(t, { label: 'Today', value: n?.today ?? 0 }),
                  (0, s.jsx)(t, { label: 'Overdue', value: n?.overdue ?? 0, accent: '#ef4444' }),
                  (0, s.jsx)(t, { label: 'Unassigned', value: n?.unassigned ?? 0 }),
                ],
              }),
              (n?.resolution_rate ?? 0) > 0 &&
                (0, s.jsxs)('p', {
                  className: 'markaroo-admin-rate',
                  children: [
                    'Resolution rate: ',
                    (0, s.jsxs)('strong', { children: [n.resolution_rate, '%'] }),
                  ],
                }),
              n?.by_priority &&
                (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsx)('h3', {
                      className: 'markaroo-admin__sub-title',
                      children: 'By Priority',
                    }),
                    (0, s.jsx)('div', {
                      className: 'markaroo-stat-grid',
                      children: Object.entries(n.by_priority).map(([e, a]) =>
                        (0, s.jsx)(
                          t,
                          { label: e.charAt(0).toUpperCase() + e.slice(1), value: a },
                          e
                        )
                      ),
                    }),
                  ],
                }),
              n?.by_page &&
                n.by_page.length > 0 &&
                (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsx)('h3', {
                      className: 'markaroo-admin__sub-title',
                      children: 'Top Pages',
                    }),
                    (0, s.jsxs)('table', {
                      className: 'markaroo-admin-table',
                      children: [
                        (0, s.jsx)('thead', {
                          children: (0, s.jsxs)('tr', {
                            children: [
                              (0, s.jsx)('th', { children: 'Page' }),
                              (0, s.jsx)('th', { children: 'Feedback count' }),
                            ],
                          }),
                        }),
                        (0, s.jsx)('tbody', {
                          children: n.by_page
                            .slice(0, 10)
                            .map((e) =>
                              (0, s.jsxs)(
                                'tr',
                                {
                                  children: [
                                    (0, s.jsx)('td', {
                                      children: (0, s.jsx)('code', { children: e.page_key }),
                                    }),
                                    (0, s.jsx)('td', { children: e.count }),
                                  ],
                                },
                                e.page_key
                              )
                            ),
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          })
    );
  }
  const n = [
      { value: '', label: 'All priorities' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'high', label: 'High' },
      { value: 'normal', label: 'Normal' },
      { value: 'low', label: 'Low' },
    ],
    o = [
      { value: '', label: 'All statuses' },
      { value: 'open', label: 'Open' },
      { value: 'resolved', label: 'Resolved' },
    ],
    l = { urgent: '#ef4444', high: '#f97316', normal: '#6366f1', low: '#9ca3af' };
  function i(e) {
    const a = Date.now() - new Date(e).getTime(),
      s = Math.floor(a / 6e4);
    if (s < 1) return 'just now';
    if (s < 60) return `${s}m`;
    const t = Math.floor(s / 60);
    return t < 24 ? `${t}h` : `${Math.floor(t / 24)}d`;
  }
  function c({ priority: e }) {
    return (0, s.jsx)('span', {
      className: 'markaroo-admin-badge',
      style: { backgroundColor: l[e] ?? '#9ca3af' },
      children: e,
    });
  }
  function d() {
    const a = window.markarooConfig,
      t = a.restUrl + 'markaroo/v1/',
      [r, l] = (0, e.useState)({
        status: 'open',
        priority: '',
        search: '',
        order_by: 'created_at',
        order: 'DESC',
        page: 1,
      }),
      [d, m] = (0, e.useState)([]),
      [h, u] = (0, e.useState)(0),
      [x, p] = (0, e.useState)(1),
      [k, g] = (0, e.useState)(!0),
      [j, _] = (0, e.useState)(null),
      b = (function (a, s = 300) {
        const [t, r] = (0, e.useState)(a);
        return (
          (0, e.useEffect)(() => {
            const e = setTimeout(() => r(a), s);
            return () => clearTimeout(e);
          }, [a, s]),
          t
        );
      })(r.search),
      v = (0, e.useCallback)(() => {
        g(!0), _(null);
        const e = new URLSearchParams();
        r.status && e.set('status', r.status),
          r.priority && e.set('priority', r.priority),
          b && e.set('search', b),
          e.set('order_by', r.order_by),
          e.set('order', r.order),
          e.set('per_page', '25'),
          e.set('page', String(r.page)),
          fetch(`${t}feedback?${e}`, { headers: { 'X-WP-Nonce': a.nonce } })
            .then((e) => {
              if (!e.ok) throw new Error(String(e.status));
              return e.json();
            })
            .then((e) => {
              m(e.data ?? []), u(e.meta?.total ?? 0), p(e.meta?.pages ?? 1);
            })
            .catch(() => _('Could not load reviews.'))
            .finally(() => g(!1));
      }, [r, b, t, a.nonce]);
    function f(e, a) {
      l((s) => ({ ...s, [e]: a, page: 'page' === e ? a : 1 }));
    }
    function y({ col: e, label: a }) {
      const t = r.order_by === e;
      return (0, s.jsxs)('button', {
        type: 'button',
        className: 'markaroo-admin-sort' + (t ? ' markaroo-admin-sort--active' : ''),
        onClick: () =>
          (function (e) {
            l((a) => ({
              ...a,
              order_by: e,
              order: a.order_by === e && 'DESC' === a.order ? 'ASC' : 'DESC',
              page: 1,
            }));
          })(e),
        children: [a, t ? ('DESC' === r.order ? ' ↓' : ' ↑') : ''],
      });
    }
    (0, e.useEffect)(() => {
      v();
    }, [v]);
    const N = a.restUrl.replace('/wp-json/', '/');
    return (0, s.jsxs)('div', {
      className: 'markaroo-admin-tasklist',
      children: [
        (0, s.jsxs)('div', {
          className: 'markaroo-admin-tasklist__toolbar',
          children: [
            (0, s.jsx)('h2', {
              className: 'markaroo-admin__section-title',
              style: { margin: 0 },
              children: 'All Reviews',
            }),
            (0, s.jsxs)('div', {
              className: 'markaroo-admin-tasklist__filters',
              children: [
                (0, s.jsx)('select', {
                  value: r.status,
                  onChange: (e) => f('status', e.target.value),
                  children: o.map((e) =>
                    (0, s.jsx)('option', { value: e.value, children: e.label }, e.value)
                  ),
                }),
                (0, s.jsx)('select', {
                  value: r.priority,
                  onChange: (e) => f('priority', e.target.value),
                  children: n.map((e) =>
                    (0, s.jsx)('option', { value: e.value, children: e.label }, e.value)
                  ),
                }),
                (0, s.jsx)('input', {
                  type: 'search',
                  placeholder: 'Search…',
                  value: r.search,
                  onChange: (e) => f('search', e.target.value),
                  className: 'markaroo-admin-tasklist__search',
                }),
                (0, s.jsx)('span', {
                  className: 'markaroo-admin-tasklist__count',
                  children: k ? '…' : `${h} item${1 !== h ? 's' : ''}`,
                }),
              ],
            }),
          ],
        }),
        j && (0, s.jsx)('div', { className: 'markaroo-admin__error-box', children: j }),
        (0, s.jsxs)('table', {
          className: 'markaroo-admin-table markaroo-admin-tasklist__table',
          children: [
            (0, s.jsx)('thead', {
              children: (0, s.jsxs)('tr', {
                children: [
                  (0, s.jsx)('th', { children: (0, s.jsx)(y, { col: 'created_at', label: '#' }) }),
                  (0, s.jsx)('th', { children: 'Comment' }),
                  (0, s.jsx)('th', { children: (0, s.jsx)(y, { col: 'status', label: 'Status' }) }),
                  (0, s.jsx)('th', {
                    children: (0, s.jsx)(y, { col: 'priority', label: 'Priority' }),
                  }),
                  (0, s.jsx)('th', { children: 'Assignee' }),
                  (0, s.jsx)('th', { children: (0, s.jsx)(y, { col: 'due_date', label: 'Due' }) }),
                  (0, s.jsx)('th', {
                    children: (0, s.jsx)(y, { col: 'created_at', label: 'Created' }),
                  }),
                  (0, s.jsx)('th', { children: 'Page' }),
                ],
              }),
            }),
            (0, s.jsxs)('tbody', {
              children: [
                k &&
                  (0, s.jsx)('tr', {
                    children: (0, s.jsx)('td', {
                      colSpan: 8,
                      className: 'markaroo-admin-tasklist__loading-row',
                      children: 'Loading…',
                    }),
                  }),
                !k &&
                  0 === d.length &&
                  (0, s.jsx)('tr', {
                    children: (0, s.jsx)('td', {
                      colSpan: 8,
                      className: 'markaroo-admin__empty',
                      style: { padding: '20px', textAlign: 'center' },
                      children: 'No reviews found.',
                    }),
                  }),
                d.map((e) =>
                  (0, s.jsxs)(
                    'tr',
                    {
                      children: [
                        (0, s.jsx)('td', {
                          children: (0, s.jsxs)('a', {
                            href: `${N.replace(/\/$/, '')}${e.page_key}?markaroo_open=${e.id}`,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'markaroo-admin-link',
                            children: ['#', e.id],
                          }),
                        }),
                        (0, s.jsx)('td', {
                          className: 'markaroo-admin-tasklist__comment',
                          children:
                            e.comment.length > 80 ? e.comment.slice(0, 80) + '…' : e.comment,
                        }),
                        (0, s.jsx)('td', {
                          children: (0, s.jsx)('span', {
                            className: `markaroo-admin-status markaroo-admin-status--${e.status}`,
                            children: e.status,
                          }),
                        }),
                        (0, s.jsx)('td', { children: (0, s.jsx)(c, { priority: e.priority }) }),
                        (0, s.jsx)('td', {
                          children:
                            e.assigned_to_name ||
                            (0, s.jsx)('em', { style: { color: '#9ca3af' }, children: '—' }),
                        }),
                        (0, s.jsx)('td', {
                          children: e.due_date
                            ? (0, s.jsx)('span', {
                                className:
                                  new Date(e.due_date) < new Date() && 'open' === e.status
                                    ? 'markaroo-admin-overdue'
                                    : '',
                                children: new Date(e.due_date).toLocaleDateString(),
                              })
                            : '—',
                        }),
                        (0, s.jsx)('td', { title: e.created_at, children: i(e.created_at) }),
                        (0, s.jsx)('td', {
                          children: (0, s.jsx)('code', {
                            className: 'markaroo-admin-page-key',
                            children: e.page_key,
                          }),
                        }),
                      ],
                    },
                    e.id
                  )
                ),
              ],
            }),
          ],
        }),
        x > 1 &&
          (0, s.jsxs)('div', {
            className: 'markaroo-admin-pagination',
            children: [
              (0, s.jsx)('button', {
                type: 'button',
                className: 'markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm',
                disabled: r.page <= 1,
                onClick: () => f('page', r.page - 1),
                children: '← Prev',
              }),
              (0, s.jsxs)('span', { children: [r.page, ' / ', x] }),
              (0, s.jsx)('button', {
                type: 'button',
                className: 'markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm',
                disabled: r.page >= x,
                onClick: () => f('page', r.page + 1),
                children: 'Next →',
              }),
            ],
          }),
      ],
    });
  }
  function m() {
    const a = window.markarooConfig,
      t = a.restUrl + 'markaroo/v1/',
      [r, n] = (0, e.useState)({}),
      [o, l] = (0, e.useState)(!0),
      [i, c] = (0, e.useState)(!1),
      [d, m] = (0, e.useState)(null),
      [h, u] = (0, e.useState)(!1);
    function x(e, a, s) {
      n((t) => ({ ...t, [e]: { ...(t[e] ?? {}), [a]: s } }));
    }
    if (
      ((0, e.useEffect)(() => {
        fetch(t + 'settings', { headers: { 'X-WP-Nonce': a.nonce } })
          .then((e) => (e.ok ? e.json() : Promise.reject(e.status)))
          .then(n)
          .catch(() => m('Could not load settings.'))
          .finally(() => l(!1));
      }, []),
      o)
    )
      return (0, s.jsx)('p', { className: 'markaroo-admin__loading', children: 'Loading…' });
    const p = r.general ?? {},
      k = r.capture ?? {},
      g = r.tasks ?? {},
      j = r.access ?? {},
      _ = r.notifications ?? {},
      b = r.attachments ?? {};
    return (0, s.jsxs)('div', {
      className: 'markaroo-admin-settings',
      children: [
        (0, s.jsx)('h2', { className: 'markaroo-admin__section-title', children: 'Settings' }),
        d && (0, s.jsx)('div', { className: 'markaroo-admin__error-box', children: d }),
        h &&
          (0, s.jsx)('div', {
            className: 'markaroo-admin__success-box',
            children: 'Settings saved.',
          }),
        (0, s.jsxs)('form', {
          onSubmit: async function (e) {
            e.preventDefault(), m(null), c(!0), u(!1);
            try {
              const e = await fetch(t + 'settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': a.nonce },
                body: JSON.stringify(r),
              });
              if (!e.ok) throw new Error(await e.text());
              u(!0), setTimeout(() => u(!1), 3e3);
            } catch (e) {
              m(e instanceof Error ? e.message : 'Save failed.');
            } finally {
              c(!1);
            }
          },
          children: [
            (0, s.jsxs)('fieldset', {
              className: 'markaroo-settings-group',
              children: [
                (0, s.jsx)('legend', { children: 'General' }),
                (0, s.jsxs)('label', {
                  children: [
                    'Widget mode',
                    (0, s.jsxs)('select', {
                      value: String(p.default_widget_mode ?? 'comment'),
                      onChange: (e) => x('general', 'default_widget_mode', e.target.value),
                      children: [
                        (0, s.jsx)('option', { value: 'comment', children: 'Comment' }),
                        (0, s.jsx)('option', { value: 'view', children: 'View' }),
                        (0, s.jsx)('option', { value: 'clean', children: 'Clean' }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsxs)('label', {
                  children: [
                    'Default priority',
                    (0, s.jsxs)('select', {
                      value: String(p.default_priority ?? 'normal'),
                      onChange: (e) => x('general', 'default_priority', e.target.value),
                      children: [
                        (0, s.jsx)('option', { value: 'urgent', children: 'Urgent' }),
                        (0, s.jsx)('option', { value: 'high', children: 'High' }),
                        (0, s.jsx)('option', { value: 'normal', children: 'Normal' }),
                        (0, s.jsx)('option', { value: 'low', children: 'Low' }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsxs)('label', {
                  className: 'markaroo-settings-toggle',
                  children: [
                    (0, s.jsx)('input', {
                      type: 'checkbox',
                      checked: Boolean(p.enable_screenshots ?? !0),
                      onChange: (e) => x('general', 'enable_screenshots', e.target.checked),
                    }),
                    'Enable screenshots',
                  ],
                }),
              ],
            }),
            (0, s.jsxs)('fieldset', {
              className: 'markaroo-settings-group',
              children: [
                (0, s.jsx)('legend', { children: 'Capture' }),
                (0, s.jsxs)('label', {
                  className: 'markaroo-settings-toggle',
                  children: [
                    (0, s.jsx)('input', {
                      type: 'checkbox',
                      checked: Boolean(k.mask_inputs_in_screenshots ?? !0),
                      onChange: (e) => x('capture', 'mask_inputs_in_screenshots', e.target.checked),
                    }),
                    'Mask form inputs in screenshots',
                  ],
                }),
              ],
            }),
            (0, s.jsxs)('fieldset', {
              className: 'markaroo-settings-group',
              children: [
                (0, s.jsx)('legend', { children: 'Tasks' }),
                (0, s.jsxs)('label', {
                  className: 'markaroo-settings-toggle',
                  children: [
                    (0, s.jsx)('input', {
                      type: 'checkbox',
                      checked: Boolean(g.enable_assignment ?? !1),
                      onChange: (e) => x('tasks', 'enable_assignment', e.target.checked),
                    }),
                    'Enable task assignment',
                  ],
                }),
                (0, s.jsxs)('label', {
                  className: 'markaroo-settings-toggle',
                  children: [
                    (0, s.jsx)('input', {
                      type: 'checkbox',
                      checked: Boolean(g.enable_due_dates ?? !1),
                      onChange: (e) => x('tasks', 'enable_due_dates', e.target.checked),
                    }),
                    'Enable due dates',
                  ],
                }),
                (0, s.jsxs)('label', {
                  className: 'markaroo-settings-toggle',
                  children: [
                    (0, s.jsx)('input', {
                      type: 'checkbox',
                      checked: Boolean(g.enable_tags ?? !1),
                      onChange: (e) => x('tasks', 'enable_tags', e.target.checked),
                    }),
                    'Enable tags',
                  ],
                }),
              ],
            }),
            (0, s.jsxs)('fieldset', {
              className: 'markaroo-settings-group',
              children: [
                (0, s.jsx)('legend', { children: 'Access' }),
                (0, s.jsxs)('label', {
                  className: 'markaroo-settings-toggle',
                  children: [
                    (0, s.jsx)('input', {
                      type: 'checkbox',
                      checked: Boolean(j.allow_guest_links ?? !0),
                      onChange: (e) => x('access', 'allow_guest_links', e.target.checked),
                    }),
                    'Allow guest share links',
                  ],
                }),
              ],
            }),
            (0, s.jsxs)('fieldset', {
              className: 'markaroo-settings-group',
              children: [
                (0, s.jsx)('legend', { children: 'Attachments' }),
                (0, s.jsxs)('label', {
                  children: [
                    'Max upload size (MB)',
                    (0, s.jsx)('input', {
                      type: 'number',
                      min: '1',
                      max: '100',
                      value: Number(b.max_upload_mb ?? 10),
                      onChange: (e) => x('attachments', 'max_upload_mb', Number(e.target.value)),
                    }),
                  ],
                }),
              ],
            }),
            (0, s.jsxs)('fieldset', {
              className: 'markaroo-settings-group',
              children: [
                (0, s.jsx)('legend', { children: 'Notifications' }),
                (0, s.jsxs)('label', {
                  children: [
                    'Mode',
                    (0, s.jsxs)('select', {
                      value: String(_.mode ?? 'digest'),
                      onChange: (e) => x('notifications', 'mode', e.target.value),
                      children: [
                        (0, s.jsx)('option', { value: 'off', children: 'Off' }),
                        (0, s.jsx)('option', { value: 'instant', children: 'Instant' }),
                        (0, s.jsx)('option', { value: 'digest', children: 'Digest' }),
                        (0, s.jsx)('option', { value: 'smart', children: 'Smart' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, s.jsx)('div', {
              className: 'markaroo-settings-actions',
              children: (0, s.jsx)('button', {
                type: 'submit',
                className: 'markaroo-admin-btn markaroo-admin-btn--primary',
                disabled: i,
                children: i ? 'Saving…' : 'Save settings',
              }),
            }),
          ],
        }),
      ],
    });
  }
  function h() {
    const a = window.markarooConfig,
      t = a.restUrl + 'markaroo/v1/',
      [r, n] = (0, e.useState)([]),
      [o, l] = (0, e.useState)(!0),
      [i, c] = (0, e.useState)(null),
      [d, m] = (0, e.useState)(!1),
      [h, u] = (0, e.useState)(''),
      [x, p] = (0, e.useState)('site'),
      [k, g] = (0, e.useState)(''),
      [j, _] = (0, e.useState)('comment'),
      [b, v] = (0, e.useState)(!0),
      [f, y] = (0, e.useState)(!0),
      [N, w] = (0, e.useState)(''),
      [S, C] = (0, e.useState)(!1);
    function E() {
      return { 'X-WP-Nonce': a.nonce, 'Content-Type': 'application/json' };
    }
    return (
      (0, e.useEffect)(() => {
        fetch(t + 'shares', { headers: { 'X-WP-Nonce': a.nonce } })
          .then((e) => (e.ok ? e.json() : Promise.reject(e.status)))
          .then(n)
          .catch(() => c('Could not load share links.'))
          .finally(() => l(!1));
      }, []),
      o
        ? (0, s.jsx)('p', { className: 'markaroo-admin__loading', children: 'Loading…' })
        : (0, s.jsxs)('div', {
            className: 'markaroo-admin-shares',
            children: [
              (0, s.jsxs)('div', {
                className: 'markaroo-admin-shares__head',
                children: [
                  (0, s.jsx)('h2', {
                    className: 'markaroo-admin__section-title',
                    children: 'Share Links',
                  }),
                  (0, s.jsx)('button', {
                    className: 'markaroo-admin-btn markaroo-admin-btn--primary',
                    type: 'button',
                    onClick: () => C(!S),
                    children: S ? 'Cancel' : '+ New link',
                  }),
                ],
              }),
              i && (0, s.jsx)('div', { className: 'markaroo-admin__error-box', children: i }),
              S &&
                (0, s.jsxs)('form', {
                  className: 'markaroo-share-form',
                  onSubmit: async function (e) {
                    e.preventDefault(), m(!0), c(null);
                    try {
                      const e = {
                        label: h || null,
                        scope: x,
                        widget_mode: j,
                        can_comment: b,
                        can_view: f,
                      };
                      'page' === x && k && (e.page_key = k), N && (e.expires_at = N);
                      const a = await fetch(t + 'shares', {
                        method: 'POST',
                        headers: E(),
                        body: JSON.stringify(e),
                      });
                      if (!a.ok) throw new Error(await a.text());
                      const s = await a.json();
                      n((e) => [s, ...e]), C(!1), u(''), w('');
                    } catch (e) {
                      c(e instanceof Error ? e.message : 'Create failed.');
                    } finally {
                      m(!1);
                    }
                  },
                  children: [
                    (0, s.jsxs)('label', {
                      children: [
                        'Label (internal)',
                        (0, s.jsx)('input', {
                          type: 'text',
                          value: h,
                          onChange: (e) => u(e.target.value),
                          placeholder: 'e.g. Client review',
                        }),
                      ],
                    }),
                    (0, s.jsxs)('label', {
                      children: [
                        'Scope',
                        (0, s.jsxs)('select', {
                          value: x,
                          onChange: (e) => p(e.target.value),
                          children: [
                            (0, s.jsx)('option', { value: 'site', children: 'Entire site' }),
                            (0, s.jsx)('option', { value: 'page', children: 'Single page' }),
                          ],
                        }),
                      ],
                    }),
                    'page' === x &&
                      (0, s.jsxs)('label', {
                        children: [
                          'Page path',
                          (0, s.jsx)('input', {
                            type: 'text',
                            value: k,
                            onChange: (e) => g(e.target.value),
                            placeholder: '/my-page',
                          }),
                        ],
                      }),
                    (0, s.jsxs)('label', {
                      children: [
                        'Widget mode',
                        (0, s.jsxs)('select', {
                          value: j,
                          onChange: (e) => _(e.target.value),
                          children: [
                            (0, s.jsx)('option', { value: 'comment', children: 'Comment' }),
                            (0, s.jsx)('option', { value: 'view', children: 'View only' }),
                            (0, s.jsx)('option', { value: 'clean', children: 'Clean' }),
                          ],
                        }),
                      ],
                    }),
                    (0, s.jsxs)('label', {
                      className: 'markaroo-settings-toggle',
                      children: [
                        (0, s.jsx)('input', {
                          type: 'checkbox',
                          checked: b,
                          onChange: (e) => v(e.target.checked),
                        }),
                        'Allow commenting',
                      ],
                    }),
                    (0, s.jsxs)('label', {
                      className: 'markaroo-settings-toggle',
                      children: [
                        (0, s.jsx)('input', {
                          type: 'checkbox',
                          checked: f,
                          onChange: (e) => y(e.target.checked),
                        }),
                        'Allow viewing pins',
                      ],
                    }),
                    (0, s.jsxs)('label', {
                      children: [
                        'Expires (optional)',
                        (0, s.jsx)('input', {
                          type: 'datetime-local',
                          value: N,
                          onChange: (e) => w(e.target.value),
                        }),
                      ],
                    }),
                    (0, s.jsx)('button', {
                      className: 'markaroo-admin-btn markaroo-admin-btn--primary',
                      type: 'submit',
                      disabled: d,
                      children: d ? 'Creating…' : 'Create link',
                    }),
                  ],
                }),
              0 === r.length &&
                !S &&
                (0, s.jsx)('p', {
                  className: 'markaroo-admin__empty',
                  children: 'No share links yet.',
                }),
              r.length > 0 &&
                (0, s.jsxs)('table', {
                  className: 'markaroo-admin-table',
                  children: [
                    (0, s.jsx)('thead', {
                      children: (0, s.jsxs)('tr', {
                        children: [
                          (0, s.jsx)('th', { children: 'Label' }),
                          (0, s.jsx)('th', { children: 'Scope' }),
                          (0, s.jsx)('th', { children: 'Mode' }),
                          (0, s.jsx)('th', { children: 'Expires' }),
                          (0, s.jsx)('th', { children: 'URL' }),
                          (0, s.jsx)('th', {}),
                        ],
                      }),
                    }),
                    (0, s.jsx)('tbody', {
                      children: r.map((e) =>
                        (0, s.jsxs)(
                          'tr',
                          {
                            children: [
                              (0, s.jsx)('td', {
                                children: e.label ?? (0, s.jsx)('em', { children: '—' }),
                              }),
                              (0, s.jsx)('td', {
                                children:
                                  'page' === e.scope
                                    ? (0, s.jsx)('code', { children: e.page_key })
                                    : 'site',
                              }),
                              (0, s.jsx)('td', { children: e.widget_mode }),
                              (0, s.jsx)('td', {
                                children: e.expires_at
                                  ? new Date(e.expires_at).toLocaleDateString()
                                  : '—',
                              }),
                              (0, s.jsx)('td', {
                                children: (0, s.jsx)('button', {
                                  className:
                                    'markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm',
                                  type: 'button',
                                  onClick: () => {
                                    return (
                                      (a = e.share_url),
                                      void navigator.clipboard.writeText(a).catch(() => null)
                                    );
                                    var a;
                                  },
                                  title: e.share_url,
                                  children: 'Copy URL',
                                }),
                              }),
                              (0, s.jsx)('td', {
                                children: (0, s.jsx)('button', {
                                  className:
                                    'markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm',
                                  type: 'button',
                                  onClick: () =>
                                    (async function (e) {
                                      window.confirm(
                                        'Revoke this share link? Anyone using it will lose access.'
                                      ) &&
                                        (await fetch(t + `shares/${e}`, {
                                          method: 'DELETE',
                                          headers: E(),
                                        }),
                                        n((a) => a.filter((a) => a.id !== e)));
                                    })(e.id),
                                  children: 'Revoke',
                                }),
                              }),
                            ],
                          },
                          e.id
                        )
                      ),
                    }),
                  ],
                }),
            ],
          })
    );
  }
  function u() {
    const t = window.markarooConfig,
      r = t.restUrl + 'markaroo/v1/',
      n = !!t.currentUser?.canApprove,
      [o, l] = (0, e.useState)([]),
      [i, c] = (0, e.useState)(!0),
      [d, m] = (0, e.useState)(null),
      [h, u] = (0, e.useState)(null),
      x = t.restUrl.replace('/wp-json/', '/').replace(/\/$/, ''),
      p = (0, e.useCallback)(() => {
        c(!0),
          fetch(`${r}feedback?status=resolved&per_page=50&order_by=updated_at&order=DESC`, {
            headers: { 'X-WP-Nonce': t.nonce },
          })
            .then((e) => (e.ok ? e.json() : Promise.reject(e.status)))
            .then((e) => l(e.data ?? []))
            .catch(() => m((0, a.__)('Could not load approvals.', 'markaroo')))
            .finally(() => c(!1));
      }, [r, t.nonce]);
    async function k(e, s) {
      u(e), m(null);
      try {
        const a = await fetch(`${r}feedback/${e}/${s}`, {
          method: 'POST',
          headers: { 'X-WP-Nonce': t.nonce, 'Content-Type': 'application/json' },
          body: '',
        });
        if (!a.ok) throw new Error(String(a.status));
        l((a) => a.filter((a) => a.id !== e));
      } catch {
        m((0, a.__)('Action failed. Please try again.', 'markaroo'));
      } finally {
        u(null);
      }
    }
    return (
      (0, e.useEffect)(() => {
        p();
      }, [p]),
      i
        ? (0, s.jsx)('p', {
            className: 'markaroo-admin__loading',
            children: (0, a.__)('Loading…', 'markaroo'),
          })
        : (0, s.jsxs)('div', {
            className: 'markaroo-admin-approvals',
            children: [
              (0, s.jsx)('h2', {
                className: 'markaroo-admin__section-title',
                children: (0, a.__)('Approvals', 'markaroo'),
              }),
              (0, s.jsx)('p', {
                className: 'markaroo-getstarted__sub',
                children: (0, a.__)('Resolved items awaiting sign-off.', 'markaroo'),
              }),
              d && (0, s.jsx)('div', { className: 'markaroo-admin__error-box', children: d }),
              !n &&
                (0, s.jsx)('div', {
                  className: 'markaroo-admin__error-box',
                  children: (0, a.__)(
                    'You can review these items, but only an approver can sign them off.',
                    'markaroo'
                  ),
                }),
              0 === o.length
                ? (0, s.jsx)('p', {
                    className: 'markaroo-admin__empty',
                    children: (0, a.__)('Nothing awaiting approval. 🎉', 'markaroo'),
                  })
                : (0, s.jsxs)('table', {
                    className: 'markaroo-admin-table',
                    children: [
                      (0, s.jsx)('thead', {
                        children: (0, s.jsxs)('tr', {
                          children: [
                            (0, s.jsx)('th', { children: '#' }),
                            (0, s.jsx)('th', { children: (0, a.__)('Comment', 'markaroo') }),
                            (0, s.jsx)('th', { children: (0, a.__)('Assignee', 'markaroo') }),
                            (0, s.jsx)('th', { children: (0, a.__)('Page', 'markaroo') }),
                            (0, s.jsx)('th', {}),
                          ],
                        }),
                      }),
                      (0, s.jsx)('tbody', {
                        children: o.map((e) =>
                          (0, s.jsxs)(
                            'tr',
                            {
                              children: [
                                (0, s.jsx)('td', {
                                  children: (0, s.jsxs)('a', {
                                    href: `${x}${e.page_key}?markaroo_open=${e.id}`,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    className: 'markaroo-admin-link',
                                    children: ['#', e.id],
                                  }),
                                }),
                                (0, s.jsx)('td', {
                                  className: 'markaroo-admin-tasklist__comment',
                                  children:
                                    e.comment.length > 80
                                      ? e.comment.slice(0, 80) + '…'
                                      : e.comment,
                                }),
                                (0, s.jsx)('td', {
                                  children:
                                    e.assigned_to_name ||
                                    (0, s.jsx)('em', {
                                      style: { color: '#9ca3af' },
                                      children: '—',
                                    }),
                                }),
                                (0, s.jsx)('td', {
                                  children: (0, s.jsx)('code', {
                                    className: 'markaroo-admin-page-key',
                                    children: e.page_key,
                                  }),
                                }),
                                (0, s.jsxs)('td', {
                                  className: 'markaroo-admin-approvals__actions',
                                  children: [
                                    n &&
                                      (0, s.jsx)('button', {
                                        type: 'button',
                                        className:
                                          'markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm',
                                        disabled: h === e.id,
                                        onClick: () => k(e.id, 'approve'),
                                        children: (0, a.__)('Approve', 'markaroo'),
                                      }),
                                    (0, s.jsx)('button', {
                                      type: 'button',
                                      className:
                                        'markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm',
                                      disabled: h === e.id,
                                      onClick: () => k(e.id, 'reopen'),
                                      children: (0, a.__)('Reopen', 'markaroo'),
                                    }),
                                  ],
                                }),
                              ],
                            },
                            e.id
                          )
                        ),
                      }),
                    ],
                  }),
            ],
          })
    );
  }
  function x({ onLoaded: t }) {
    const r = window.markarooConfig,
      n = r.restUrl + 'markaroo/v1/',
      [o, l] = (0, e.useState)(null),
      [i, c] = (0, e.useState)(!0);
    (0, e.useEffect)(() => {
      fetch(n + 'onboarding/state', { headers: { 'X-WP-Nonce': r.nonce } })
        .then((e) => (e.ok ? e.json() : Promise.reject()))
        .then((e) => {
          l(e), t?.(e);
        })
        .catch(() => {})
        .finally(() => c(!1));
    }, []);
    const d = r.restUrl.replace('/wp-json/', '/');
    if (i)
      return (0, s.jsx)('p', {
        className: 'markaroo-admin__loading',
        children: (0, a.__)('Loading…', 'markaroo'),
      });
    if (!o) return null;
    const m = o.items.findIndex((e) => !e.done);
    return (0, s.jsxs)('div', {
      className: 'markaroo-getstarted',
      children: [
        (0, s.jsx)('h2', {
          className: 'markaroo-admin__section-title',
          children: (0, a.__)('Getting Started', 'markaroo'),
        }),
        (0, s.jsx)('p', {
          className: 'markaroo-getstarted__sub',
          children: (0, a.__)('Three quick steps to your first round of feedback.', 'markaroo'),
        }),
        (0, s.jsx)('ol', {
          className: 'markaroo-getstarted__list',
          children: o.items.map((e, a) =>
            (0, s.jsxs)(
              'li',
              {
                className:
                  'markaroo-getstarted__item' + (e.done ? ' markaroo-getstarted__item--done' : ''),
                children: [
                  (0, s.jsx)('span', {
                    className: 'markaroo-getstarted__num',
                    children: e.done ? '✓' : a + 1,
                  }),
                  (0, s.jsxs)('div', {
                    className: 'markaroo-getstarted__body',
                    children: [
                      (0, s.jsx)('span', {
                        className: 'markaroo-getstarted__title',
                        children: e.title,
                      }),
                      (0, s.jsx)('span', {
                        className: 'markaroo-getstarted__help',
                        children: e.help,
                      }),
                    ],
                  }),
                  !e.done &&
                    (0, s.jsx)('button', {
                      type: 'button',
                      className:
                        'markaroo-btn ' +
                        (a === m ? 'markaroo-btn--primary' : 'markaroo-btn--secondary'),
                      onClick: () => {
                        var a;
                        'has_feedback' === (a = e.key)
                          ? window.open(d, '_blank', 'noopener')
                          : (window.location.hash = 'has_share_link' === a ? 'shares' : 'settings');
                      },
                      children: e.action,
                    }),
                ],
              },
              e.key
            )
          ),
        }),
      ],
    });
  }
  const p = ['getting-started', 'overview', 'tasks', 'approvals', 'shares', 'settings'];
  function k() {
    const e = window.location.hash.replace('#', '');
    return p.includes(e) ? e : 'overview';
  }
  function g({ d: e }) {
    return (0, s.jsx)('svg', {
      className: 'markaroo-nav__icon',
      width: '18',
      height: '18',
      viewBox: '0 0 24 24',
      fill: 'none',
      'aria-hidden': 'true',
      children: (0, s.jsx)('path', {
        d: e,
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    });
  }
  function j() {
    const [t, n] = (0, e.useState)(k),
      [o, l] = (0, e.useState)(!0);
    function i(e) {
      n(e), (window.location.hash = e);
    }
    (0, e.useEffect)(() => {
      window.dispatchEvent(new CustomEvent('markaroo:admin-ready', { detail: { tab: t } }));
    }, []);
    const c = (function (e) {
      const t = [];
      return (
        e &&
          t.push({
            id: 'getting-started',
            label: (0, a.__)('Getting Started', 'markaroo'),
            icon: (0, s.jsx)(g, { d: 'M9 11l3 3 8-8M21 12a9 9 0 11-6.219-8.56' }),
          }),
        t.push(
          {
            id: 'overview',
            label: (0, a.__)('Dashboard', 'markaroo'),
            icon: (0, s.jsx)(g, { d: 'M3 12l9-9 9 9M5 10v10h14V10' }),
          },
          {
            id: 'tasks',
            label: (0, a.__)('All Reviews', 'markaroo'),
            icon: (0, s.jsx)(g, { d: 'M4 6h16M4 12h16M4 18h10' }),
          },
          {
            id: 'approvals',
            label: (0, a.__)('Approvals', 'markaroo'),
            icon: (0, s.jsx)(g, { d: 'M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z' }),
          },
          {
            id: 'shares',
            label: (0, a.__)('Share Links', 'markaroo'),
            icon: (0, s.jsx)(g, {
              d: 'M9 12a3 3 0 106 0 3 3 0 00-6 0M7 9L4 6m13 3l3-3M7 15l-3 3m13-3l3 3',
            }),
          },
          {
            id: 'settings',
            label: (0, a.__)('Settings', 'markaroo'),
            icon: (0, s.jsx)(g, {
              d: 'M12 9a3 3 0 100 6 3 3 0 000-6M19 12l2-1-2-4-2 1a7 7 0 00-2-1l-1-2H10L9 5a7 7 0 00-2 1L5 5 3 9l2 1v2l-2 1 2 4 2-1a7 7 0 002 1l1 2h4l1-2a7 7 0 002-1l2 1 2-4-2-1z',
            }),
          }
        ),
        t
      );
    })(o);
    return (0, s.jsxs)('div', {
      className: 'markaroo-app markaroo-admin',
      children: [
        (0, s.jsxs)('header', {
          className: 'markaroo-topnav',
          children: [
            (0, s.jsxs)('div', {
              className: 'markaroo-topnav__brand',
              children: [
                (0, s.jsx)('span', { className: 'markaroo-topnav__logo', children: '●' }),
                (0, s.jsx)('span', { className: 'markaroo-topnav__name', children: 'Markaroo' }),
              ],
            }),
            (0, s.jsx)('nav', {
              className: 'markaroo-topnav__nav',
              'aria-label': (0, a.__)('Markaroo navigation', 'markaroo'),
              children: c.map((e) =>
                (0, s.jsxs)(
                  'button',
                  {
                    type: 'button',
                    className:
                      'markaroo-topnav__item' +
                      (t === e.id ? ' markaroo-topnav__item--active' : ''),
                    onClick: () => i(e.id),
                    'aria-current': t === e.id ? 'page' : void 0,
                    children: [e.icon, (0, s.jsx)('span', { children: e.label })],
                  },
                  e.id
                )
              ),
            }),
            (0, s.jsx)('a', {
              className: 'markaroo-topnav__help',
              href: 'https://devemon.com/',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: (0, a.__)('Help & docs', 'markaroo'),
            }),
          ],
        }),
        (0, s.jsxs)('main', {
          className: 'markaroo-admin__main',
          children: [
            (0, s.jsx)('div', {
              style: 'getting-started' === t ? void 0 : { display: 'none' },
              children: (0, s.jsx)(x, {
                onLoaded: function (e) {
                  l(!e.done), e.done && 'getting-started' === t && i('overview');
                },
              }),
            }),
            'overview' === t && (0, s.jsx)(r, {}),
            'tasks' === t && (0, s.jsx)(d, {}),
            'approvals' === t && (0, s.jsx)(u, {}),
            'shares' === t && (0, s.jsx)(h, {}),
            'settings' === t && (0, s.jsx)(m, {}),
          ],
        }),
      ],
    });
  }
  const _ = document.getElementById('dashboard-markaroo-root');
  _ && (0, e.createRoot)(_).render((0, s.jsx)(j, {}));
})();
