(() => {
  'use strict';
  const a = window.wp.element,
    e = window.wp.i18n,
    o = window.ReactJSXRuntime,
    r = window.markarooWelcome ?? { dashboardUrl: '', siteUrl: '', firstName: '' },
    s = window.markarooConfig ?? { restUrl: '', nonce: '', pluginUrl: '' },
    t = s.restUrl + 'markaroo/v1/onboarding/';
  function n(a, e) {
    return fetch(t + a, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': s.nonce },
      body: JSON.stringify(e),
    });
  }
  function l() {
    const [l, m] = (0, a.useState)('welcome'),
      [i, k] = (0, a.useState)('team_clients'),
      [d, _] = (0, a.useState)(!0),
      [h, u] = (0, a.useState)(!0),
      [p, b] = (0, a.useState)(null),
      [j, x] = (0, a.useState)(!1),
      w = s.pluginUrl + 'public/images/wpbones-logo.png',
      N = (0, a.useCallback)((a) => {
        x(!0),
          n('complete', {}).finally(() => {
            window.location.href = a || r.dashboardUrl;
          });
      }, []),
      g = (0, a.useCallback)((a, e) => {
        n('step', { step: a, data: e }).catch(() => {});
      }, []),
      y = [
        {
          value: 'team_only',
          title: (0, e.__)('My team only', 'markaroo'),
          hint: (0, e.__)('Logged-in WordPress users only.', 'markaroo'),
        },
        {
          value: 'team_clients',
          title: (0, e.__)('Team + clients', 'markaroo'),
          hint: (0, e.__)('Your team plus people you share links with.', 'markaroo'),
        },
        {
          value: 'anyone_link',
          title: (0, e.__)('Anyone with a link', 'markaroo'),
          hint: (0, e.__)('No login required to comment.', 'markaroo'),
        },
      ];
    return (0, o.jsxs)('div', {
      className: 'markaroo-app markaroo-welcome',
      children: [
        (0, o.jsxs)('div', {
          className: 'markaroo-welcome__card',
          children: [
            'welcome' !== l &&
              (0, o.jsx)('div', {
                className: 'markaroo-stepper',
                'aria-label': (0, e.__)('Setup progress', 'markaroo'),
                children: [1, 2, 3].map((a) =>
                  (0, o.jsx)(
                    'span',
                    {
                      className:
                        'markaroo-stepper__dot' +
                        (l === a ? ' markaroo-stepper__dot--active' : '') +
                        ('number' == typeof l && a < l ? ' markaroo-stepper__dot--done' : ''),
                    },
                    a
                  )
                ),
              }),
            'welcome' === l &&
              (0, o.jsxs)(o.Fragment, {
                children: [
                  (0, o.jsx)('span', {
                    className: 'markaroo-welcome__mark',
                    children: (0, o.jsx)('img', { src: w, alt: '' }),
                  }),
                  (0, o.jsx)('p', {
                    className: 'markaroo-welcome__eyebrow',
                    children: r.firstName
                      ? (0, e.sprintf)(
                          /* translators: %s: user first name. */ /* translators: %s: user first name. */ (0,
                          e.__)('Hello, %s!', 'markaroo'),
                          r.firstName
                        )
                      : (0, e.__)('Hello there!', 'markaroo'),
                  }),
                  (0, o.jsx)('h1', {
                    className: 'markaroo-welcome__title',
                    children: (0, e.__)('Welcome to Markaroo', 'markaroo'),
                  }),
                  (0, o.jsx)('p', {
                    className: 'markaroo-welcome__body',
                    children: (0, e.__)(
                      'Collect visual feedback right on your live pages. Turn comments into tasks. Share a no-login link with clients in seconds.',
                      'markaroo'
                    ),
                  }),
                  (0, o.jsx)('div', {
                    className: 'markaroo-welcome__actions',
                    children: (0, o.jsx)('button', {
                      type: 'button',
                      className: 'markaroo-btn markaroo-btn--primary markaroo-btn--lg',
                      onClick: () => m(1),
                      children: (0, e.__)("Let's Start", 'markaroo'),
                    }),
                  }),
                ],
              }),
            1 === l &&
              (0, o.jsxs)(o.Fragment, {
                children: [
                  (0, o.jsx)('h2', {
                    className: 'markaroo-welcome__step-head',
                    children: (0, e.__)('Who gives feedback?', 'markaroo'),
                  }),
                  (0, o.jsx)('p', {
                    className: 'markaroo-welcome__step-sub',
                    children: (0, e.__)(
                      'Sets your default access. You can change it anytime in Settings.',
                      'markaroo'
                    ),
                  }),
                  (0, o.jsx)('div', {
                    className: 'markaroo-welcome__choices',
                    children: y.map((a) =>
                      (0, o.jsxs)(
                        'button',
                        {
                          type: 'button',
                          className:
                            'markaroo-choice' + (i === a.value ? ' markaroo-choice--active' : ''),
                          'aria-pressed': i === a.value,
                          onClick: () => k(a.value),
                          children: [
                            (0, o.jsx)('span', {
                              className: 'markaroo-choice__title',
                              children: a.title,
                            }),
                            (0, o.jsx)('span', {
                              className: 'markaroo-choice__hint',
                              children: a.hint,
                            }),
                          ],
                        },
                        a.value
                      )
                    ),
                  }),
                  (0, o.jsxs)('div', {
                    className: 'markaroo-welcome__nav',
                    children: [
                      (0, o.jsx)('button', {
                        type: 'button',
                        className: 'markaroo-btn markaroo-btn--ghost',
                        onClick: () => m('welcome'),
                        children: (0, e.__)('Back', 'markaroo'),
                      }),
                      (0, o.jsx)('button', {
                        type: 'button',
                        className: 'markaroo-btn markaroo-btn--primary',
                        onClick: function () {
                          g(1, { access: i }), m(2);
                        },
                        children: (0, e.__)('Continue', 'markaroo'),
                      }),
                    ],
                  }),
                ],
              }),
            2 === l &&
              (0, o.jsxs)(o.Fragment, {
                children: [
                  (0, o.jsx)('h2', {
                    className: 'markaroo-welcome__step-head',
                    children: (0, e.__)('Capture defaults', 'markaroo'),
                  }),
                  (0, o.jsx)('p', {
                    className: 'markaroo-welcome__step-sub',
                    children: (0, e.__)('How much detail should each comment capture?', 'markaroo'),
                  }),
                  (0, o.jsxs)('div', {
                    className: 'markaroo-welcome__choices',
                    children: [
                      (0, o.jsxs)('label', {
                        className: 'markaroo-toggle',
                        htmlFor: 'markaroo-onboard-screenshots',
                        children: [
                          (0, o.jsx)('span', {
                            children: (0, e.__)(
                              'Capture screenshots with each comment',
                              'markaroo'
                            ),
                          }),
                          (0, o.jsx)('input', {
                            id: 'markaroo-onboard-screenshots',
                            type: 'checkbox',
                            checked: d,
                            onChange: (a) => _(a.target.checked),
                          }),
                        ],
                      }),
                      (0, o.jsxs)('label', {
                        className: 'markaroo-toggle',
                        htmlFor: 'markaroo-onboard-annotate',
                        children: [
                          (0, o.jsx)('span', {
                            children: (0, e.__)('Let reviewers draw and annotate', 'markaroo'),
                          }),
                          (0, o.jsx)('input', {
                            id: 'markaroo-onboard-annotate',
                            type: 'checkbox',
                            checked: h,
                            onChange: (a) => u(a.target.checked),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, o.jsxs)('div', {
                    className: 'markaroo-welcome__nav',
                    children: [
                      (0, o.jsx)('button', {
                        type: 'button',
                        className: 'markaroo-btn markaroo-btn--ghost',
                        onClick: () => m(1),
                        children: (0, e.__)('Back', 'markaroo'),
                      }),
                      (0, o.jsx)('button', {
                        type: 'button',
                        className: 'markaroo-btn markaroo-btn--primary',
                        onClick: function () {
                          g(2, { screenshots: d, annotate: h }),
                            m(3),
                            fetch(t + 'state', { headers: { 'X-WP-Nonce': s.nonce } })
                              .then((a) => (a.ok ? a.json() : null))
                              .then((a) => a && b(a))
                              .catch(() => {});
                        },
                        children: (0, e.__)('Continue', 'markaroo'),
                      }),
                    ],
                  }),
                ],
              }),
            3 === l &&
              (0, o.jsxs)(o.Fragment, {
                children: [
                  (0, o.jsx)('h2', {
                    className: 'markaroo-welcome__step-head',
                    children: (0, e.__)("You're set!", 'markaroo'),
                  }),
                  (0, o.jsx)('p', {
                    className: 'markaroo-welcome__step-sub',
                    children: (0, e.__)(
                      'Finish these to get the most out of Markaroo.',
                      'markaroo'
                    ),
                  }),
                  (0, o.jsxs)('ul', {
                    className: 'markaroo-checklist',
                    children: [
                      (0, o.jsx)(c, {
                        done: !!p?.configured,
                        label: (0, e.__)('Configure capture defaults', 'markaroo'),
                      }),
                      (0, o.jsx)(c, {
                        done: !!p?.has_share_link,
                        label: (0, e.__)('Create your first share link', 'markaroo'),
                      }),
                      (0, o.jsx)(c, {
                        done: !!p?.has_feedback,
                        label: (0, e.__)('Collect your first feedback', 'markaroo'),
                      }),
                    ],
                  }),
                  (0, o.jsxs)('div', {
                    className: 'markaroo-welcome__nav',
                    children: [
                      (0, o.jsx)('button', {
                        type: 'button',
                        className: 'markaroo-btn markaroo-btn--secondary',
                        disabled: j,
                        onClick: () => N(r.siteUrl),
                        children: (0, e.__)('Open my site', 'markaroo'),
                      }),
                      (0, o.jsx)('button', {
                        type: 'button',
                        className: 'markaroo-btn markaroo-btn--primary',
                        disabled: j,
                        onClick: () => N(r.dashboardUrl),
                        children: (0, e.__)('Go to Dashboard', 'markaroo'),
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
        'welcome' === l &&
          (0, o.jsx)('button', {
            type: 'button',
            className: 'markaroo-welcome__skip',
            disabled: j,
            onClick: () => N(r.dashboardUrl),
            children: (0, e.__)('I already know, skip it!', 'markaroo'),
          }),
      ],
    });
  }
  function c({ done: a, label: e }) {
    return (0, o.jsxs)('li', {
      className: 'markaroo-checklist__item',
      children: [
        (0, o.jsx)('span', {
          className: 'markaroo-checklist__tick' + (a ? ' markaroo-checklist__tick--done' : ''),
          children: a ? '✓' : '',
        }),
        e,
      ],
    });
  }
  const m = document.getElementById('markaroo-welcome-root');
  m && (0, a.createRoot)(m).render((0, o.jsx)(l, {}));
})();
