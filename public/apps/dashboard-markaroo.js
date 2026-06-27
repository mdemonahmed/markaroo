/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/assets/apps/dashboard-markaroo/AdminShell.tsx"
/*!*****************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/AdminShell.tsx ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminShell: () => (/* binding */ AdminShell)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _views_OverviewView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/OverviewView */ "./resources/assets/apps/dashboard-markaroo/views/OverviewView.tsx");
/* harmony import */ var _views_TaskListView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/TaskListView */ "./resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx");
/* harmony import */ var _views_SettingsView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/SettingsView */ "./resources/assets/apps/dashboard-markaroo/views/SettingsView.tsx");
/* harmony import */ var _views_ApprovalsView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/ApprovalsView */ "./resources/assets/apps/dashboard-markaroo/views/ApprovalsView.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







const TAB_IDS = ['overview', 'tasks', 'approvals', 'settings'];
function initialTab() {
  const hash = window.location.hash.replace('#', '');
  return TAB_IDS.includes(hash) ? hash : 'overview';
}
function NavIcon({
  d
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
    className: "markaroo-nav__icon",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
      d: d,
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  });
}
function getTabs() {
  return [{
    id: 'overview',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dashboard', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(NavIcon, {
      d: "M3 12l9-9 9 9M5 10v10h14V10"
    })
  }, {
    id: 'tasks',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Reviews', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(NavIcon, {
      d: "M4 6h16M4 12h16M4 18h10"
    })
  }, {
    id: 'approvals',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approvals', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(NavIcon, {
      d: "M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z"
    })
  }, {
    id: 'settings',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(NavIcon, {
      d: "M12 9a3 3 0 100 6 3 3 0 000-6M19 12l2-1-2-4-2 1a7 7 0 00-2-1l-1-2H10L9 5a7 7 0 00-2 1L5 5 3 9l2 1v2l-2 1 2 4 2-1a7 7 0 002 1l1 2h4l1-2a7 7 0 002-1l2 1 2-4-2-1z"
    })
  }];
}
function AdminShell() {
  const [tab, setTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(initialTab);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.dispatchEvent(new CustomEvent('markaroo:admin-ready', {
      detail: {
        tab
      }
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function switchTab(t) {
    setTab(t);
    window.location.hash = t;
  }
  const tabs = getTabs();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "markaroo-app markaroo-admin",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("header", {
      className: "markaroo-topnav",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-topnav__brand",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "markaroo-topnav__logo",
          children: "\u25CF"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "markaroo-topnav__name",
          children: "Markaroo"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("nav", {
        className: "markaroo-topnav__nav",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Markaroo navigation', 'markaroo'),
        children: tabs.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("button", {
          type: "button",
          className: `markaroo-topnav__item${tab === t.id ? ' markaroo-topnav__item--active' : ''}`,
          onClick: () => switchTab(t.id),
          "aria-current": tab === t.id ? 'page' : undefined,
          children: [t.icon, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
            children: t.label
          })]
        }, t.id))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
        className: "markaroo-topnav__help",
        href: "https://devemon.com/",
        target: "_blank",
        rel: "noopener noreferrer",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Help & docs', 'markaroo')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("main", {
      className: "markaroo-admin__main",
      children: [tab === 'overview' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_views_OverviewView__WEBPACK_IMPORTED_MODULE_2__.OverviewView, {}), tab === 'tasks' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_views_TaskListView__WEBPACK_IMPORTED_MODULE_3__.TaskListView, {}), tab === 'approvals' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_views_ApprovalsView__WEBPACK_IMPORTED_MODULE_5__.ApprovalsView, {}), tab === 'settings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_views_SettingsView__WEBPACK_IMPORTED_MODULE_4__.SettingsView, {})]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/ApprovalsView.tsx"
/*!**************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/ApprovalsView.tsx ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApprovalsView: () => (/* binding */ ApprovalsView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



/**
 * Approvals workflow (Task 26 §4). Lists resolved items awaiting sign-off.
 * Approve locks the item; Reopen sends it back. Gated by canApprove.
 */
function ApprovalsView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const canApprove = !!config.currentUser?.canApprove;
  const [items, setItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [busyId, setBusyId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const frontUrl = config.restUrl.replace('/wp-json/', '/').replace(/\/$/, '');
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setLoading(true);
    fetch(`${restBase}feedback?status=resolved&per_page=50&order_by=updated_at&order=DESC`, {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(body => setItems(body.data ?? [])).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not load approvals.', 'markaroo'))).finally(() => setLoading(false));
  }, [restBase, config.nonce]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load();
  }, [load]);
  async function act(id, action) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`${restBase}feedback/${id}/${action}`, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': config.nonce,
          'Content-Type': 'application/json'
        },
        body: ''
      });
      if (!res.ok) {
        throw new Error(String(res.status));
      }
      // Either action removes the row from the "awaiting approval" list.
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Action failed. Please try again.', 'markaroo'));
    } finally {
      setBusyId(null);
    }
  }
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "markaroo-admin-approvals",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approvals', 'markaroo')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "markaroo-getstarted__sub",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolved items awaiting sign-off.', 'markaroo')
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), !canApprove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can review these items, but only an approver can sign them off.', 'markaroo')
    }), items.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "markaroo-admin__empty",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nothing awaiting approval. 🎉', 'markaroo')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("table", {
      className: "markaroo-admin-table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            children: "#"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Comment', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assignee', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Page', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {})]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("tbody", {
        children: items.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("a", {
              href: `${frontUrl}${item.page_key}?markaroo_open=${item.id}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "markaroo-admin-link",
              children: ["#", item.id]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
            className: "markaroo-admin-tasklist__comment",
            children: item.comment.length > 80 ? item.comment.slice(0, 80) + '…' : item.comment
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
            children: item.assigned_to_name || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("em", {
              style: {
                color: '#9ca3af'
              },
              children: "\u2014"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("code", {
              className: "markaroo-admin-page-key",
              children: item.page_key
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("td", {
            className: "markaroo-admin-approvals__actions",
            children: [canApprove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
              type: "button",
              className: "markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm",
              disabled: busyId === item.id,
              onClick: () => act(item.id, 'approve'),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approve', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
              type: "button",
              className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
              disabled: busyId === item.id,
              onClick: () => act(item.id, 'reopen'),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reopen', 'markaroo')
            })]
          })]
        }, item.id))
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/OverviewView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/OverviewView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OverviewView: () => (/* binding */ OverviewView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function StatCard({
  label,
  value,
  accent
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-stat-card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-stat-card__value",
      style: accent ? {
        color: accent
      } : undefined,
      children: value
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-stat-card__label",
      children: label
    })]
  });
}
function OverviewView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const [counts, setCounts] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(restBase + 'counts', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(setCounts).catch(() => setError('Could not load counts.')).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: "Loading\u2026"
    });
  }
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-admin__error",
      children: error
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-admin-overview",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: "Overview"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "markaroo-stat-grid",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Total",
        value: counts?.total ?? 0
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Open",
        value: counts?.open ?? 0,
        accent: "#6366f1"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Resolved",
        value: counts?.resolved ?? 0,
        accent: "#22c55e"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Today",
        value: counts?.today ?? 0
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Overdue",
        value: counts?.overdue ?? 0,
        accent: "#ef4444"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Unassigned",
        value: counts?.unassigned ?? 0
      })]
    }), (counts?.resolution_rate ?? 0) > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("p", {
      className: "markaroo-admin-rate",
      children: ["Resolution rate: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("strong", {
        children: [counts.resolution_rate, "%"]
      })]
    }), counts?.by_priority && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        className: "markaroo-admin__sub-title",
        children: "By Priority"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "markaroo-stat-grid",
        children: Object.entries(counts.by_priority).map(([k, v]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
          label: k.charAt(0).toUpperCase() + k.slice(1),
          value: v
        }, k))
      })]
    }), counts?.by_page && counts.by_page.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        className: "markaroo-admin__sub-title",
        children: "Top Pages"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table", {
        className: "markaroo-admin-table",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
              children: "Page"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
              children: "Feedback count"
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tbody", {
          children: counts.by_page.slice(0, 10).map(row => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("code", {
                children: row.page_key
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
              children: row.count
            })]
          }, row.page_key))
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/SettingsView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/SettingsView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsView: () => (/* binding */ SettingsView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function SettingsView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saved, setSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Page picker (loaded lazily when scope = 'pages').
  const [pages, setPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [pagesLoaded, setPagesLoaded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Guest feedback link.
  const [guest, setGuest] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [regenerating, setRegenerating] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [copied, setCopied] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(restBase + 'settings', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(setSettings).catch(() => setError('Could not load settings.')).finally(() => setLoading(false));
    fetch(restBase + 'shares/guest-link', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(setGuest).catch(() => null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const g = settings.general ?? {};
  const scope = String(g.widget_scope ?? 'site');

  // Fetch published pages + posts once, when the page-scope picker is shown.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ('pages' !== scope || pagesLoaded) {
      return;
    }
    setPagesLoaded(true);
    const headers = {
      'X-WP-Nonce': config.nonce
    };
    const fields = 'per_page=100&status=publish&_fields=id,title';
    Promise.all([fetch(`${config.restUrl}wp/v2/pages?${fields}`, {
      headers
    }).then(r => r.ok ? r.json() : []), fetch(`${config.restUrl}wp/v2/posts?${fields}`, {
      headers
    }).then(r => r.ok ? r.json() : [])]).then(([wpPages, wpPosts]) => {
      const toOption = p => ({
        id: p.id,
        title: p.title?.rendered || `#${p.id}`
      });
      const all = [...wpPages, ...wpPosts].map(toOption);
      all.sort((a, b) => a.title.localeCompare(b.title));
      setPages(all);
    }).catch(() => null);
  }, [scope, pagesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function setField(group, key, value) {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] ?? {}),
        [key]: value
      }
    }));
  }
  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(restBase + 'settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': config.nonce
        },
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }
  function togglePage(id) {
    const current = Array.isArray(g.widget_pages) ? g.widget_pages : [];
    const next = current.includes(id) ? current.filter(pid => pid !== id) : [...current, id];
    setField('general', 'widget_pages', next);
  }
  function copyUrl(url) {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done).catch(() => window.prompt('Copy this link:', url));
      return;
    }
    // Fallback for insecure (http://) dev contexts.
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch {
      window.prompt('Copy this link:', url);
    }
    document.body.removeChild(ta);
  }
  async function regenerate() {
    if (!window.confirm('Regenerate the guest link? The old link will stop working immediately.')) {
      return;
    }
    setRegenerating(true);
    try {
      const res = await fetch(restBase + 'shares/guest-link/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': config.nonce
        }
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setGuest(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not regenerate link.');
    } finally {
      setRegenerating(false);
    }
  }
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: "Loading\u2026"
    });
  }
  const c = settings.capture ?? {};
  const t = settings.tasks ?? {};
  const a = settings.access ?? {};
  const n = settings.notifications ?? {};
  const at = settings.attachments ?? {};
  const selectedPages = Array.isArray(g.widget_pages) ? g.widget_pages : [];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-admin-settings",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: "Settings"
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), saved && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-admin__success-box",
      children: "Settings saved."
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
      onSubmit: handleSave,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Widget"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(g.widget_enabled ?? true),
            onChange: e => setField('general', 'widget_enabled', e.target.checked)
          }), "Allow feedback (show the widget on the front end)"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Where to show the widget", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: scope,
            onChange: e => setField('general', 'widget_scope', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "site",
              children: "Entire site"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "pages",
              children: "Specific pages"
            })]
          })]
        }), 'pages' === scope && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "markaroo-settings-pages",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "markaroo-settings-pages__label",
            children: "Pages with feedback enabled"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "markaroo-settings-pages__list",
            children: [pages.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
              className: "markaroo-admin__empty",
              children: "No published pages found."
            }), pages.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
              className: "markaroo-settings-toggle",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
                type: "checkbox",
                checked: selectedPages.includes(p.id),
                onChange: () => togglePage(p.id)
              }), p.title]
            }, p.id))]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Feedback button position", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: String(g.widget_position ?? 'bottom-right'),
            onChange: e => setField('general', 'widget_position', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "bottom-right",
              children: "Bottom right"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "bottom-left",
              children: "Bottom left"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(g.enable_screenshots ?? true),
            onChange: e => setField('general', 'enable_screenshots', e.target.checked)
          }), "Enable screenshots"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Screenshot format", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: String(g.screenshot_format ?? 'jpeg'),
            onChange: e => setField('general', 'screenshot_format', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "jpeg",
              children: "JPEG (smaller files)"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "png",
              children: "PNG (lossless)"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Screenshot quality (", Math.round(Number(g.screenshot_quality ?? 0.8) * 100), "%)", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "range",
            min: "0.1",
            max: "1",
            step: "0.05",
            value: Number(g.screenshot_quality ?? 0.8),
            onChange: e => setField('general', 'screenshot_quality', Number(e.target.value))
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Capture"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(c.mask_inputs_in_screenshots ?? true),
            onChange: e => setField('capture', 'mask_inputs_in_screenshots', e.target.checked)
          }), "Mask form inputs in screenshots"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Tasks"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(t.enable_assignment ?? false),
            onChange: e => setField('tasks', 'enable_assignment', e.target.checked)
          }), "Enable task assignment"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(t.enable_due_dates ?? false),
            onChange: e => setField('tasks', 'enable_due_dates', e.target.checked)
          }), "Enable due dates"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Guest Feedback Link"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(a.allow_guest_links ?? true),
            onChange: e => setField('access', 'allow_guest_links', e.target.checked)
          }), "Allow feedback from clients without WordPress accounts"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
          className: "markaroo-settings-group__hint",
          children: "Anyone with the token link can view pins on the shared page and submit new feedback. Keep the link private."
        }), guest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "markaroo-guest-link",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "text",
            readOnly: true,
            className: "markaroo-guest-link__url",
            value: guest.share_url,
            onFocus: e => e.target.select()
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
            onClick: () => copyUrl(guest.share_url),
            children: copied ? 'Copied!' : 'Copy URL'
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm",
            onClick: regenerate,
            disabled: regenerating,
            children: regenerating ? 'Regenerating…' : 'Regenerate'
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Attachments"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Max upload size (MB)", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "number",
            min: "1",
            max: "50",
            value: Number(at.max_upload_mb ?? 5),
            onChange: e => setField('attachments', 'max_upload_mb', Number(e.target.value))
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Notifications"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Mode", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: String(n.notify_mode ?? 'smart'),
            onChange: e => setField('notifications', 'notify_mode', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "off",
              children: "Off"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "instant",
              children: "Instant"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "digest",
              children: "Digest"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "smart",
              children: "Smart"
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "markaroo-settings-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "submit",
          className: "markaroo-admin-btn markaroo-admin-btn--primary",
          disabled: saving,
          children: saving ? 'Saving…' : 'Save settings'
        })
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaskListView: () => (/* binding */ TaskListView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const PRIORITIES = [{
  value: '',
  label: 'All priorities'
}, {
  value: 'urgent',
  label: 'Urgent'
}, {
  value: 'high',
  label: 'High'
}, {
  value: 'normal',
  label: 'Normal'
}, {
  value: 'low',
  label: 'Low'
}];
const STATUSES = [{
  value: '',
  label: 'All statuses'
}, {
  value: 'open',
  label: 'Open'
}, {
  value: 'resolved',
  label: 'Resolved'
}];
const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(value);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) {
    return 'just now';
  }
  if (m < 60) {
    return `${m}m`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h}h`;
  }
  return `${Math.floor(h / 24)}d`;
}
function PriorityBadge({
  priority
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "markaroo-admin-badge",
    style: {
      backgroundColor: PRIORITY_COLORS[priority] ?? '#9ca3af'
    },
    children: priority
  });
}
function TaskListView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const [filters, setFilters] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    status: 'open',
    priority: '',
    search: '',
    order_by: 'created_at',
    order: 'DESC',
    page: 1
  });
  const [items, setItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [total, setTotal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [pages, setPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const debouncedSearch = useDebouncedValue(filters.search);
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filters.status) {
      params.set('status', filters.status);
    }
    if (filters.priority) {
      params.set('priority', filters.priority);
    }
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    params.set('order_by', filters.order_by);
    params.set('order', filters.order);
    params.set('per_page', '25');
    params.set('page', String(filters.page));
    fetch(`${restBase}feedback?${params}`, {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => {
      if (!r.ok) {
        throw new Error(String(r.status));
      }
      return r.json();
    }).then(body => {
      setItems(body.data ?? []);
      setTotal(body.meta?.total ?? 0);
      setPages(body.meta?.pages ?? 1);
    }).catch(() => setError('Could not load reviews.')).finally(() => setLoading(false));
  }, [filters, debouncedSearch, restBase, config.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load();
  }, [load]);
  function setFilter(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  }
  function toggleSort(col) {
    setFilters(prev => ({
      ...prev,
      order_by: col,
      order: prev.order_by === col && prev.order === 'DESC' ? 'ASC' : 'DESC',
      page: 1
    }));
  }
  function SortButton({
    col,
    label
  }) {
    const active = filters.order_by === col;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
      type: "button",
      className: `markaroo-admin-sort${active ? ' markaroo-admin-sort--active' : ''}`,
      onClick: () => toggleSort(col),
      children: [label, active ? filters.order === 'DESC' ? ' ↓' : ' ↑' : '']
    });
  }
  const frontUrl = config.restUrl.replace('/wp-json/', '/');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-admin-tasklist",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "markaroo-admin-tasklist__toolbar",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
        className: "markaroo-admin__section-title",
        style: {
          margin: 0
        },
        children: "All Reviews"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-admin-tasklist__filters",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("select", {
          value: filters.status,
          onChange: e => setFilter('status', e.target.value),
          children: STATUSES.map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
            value: s.value,
            children: s.label
          }, s.value))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("select", {
          value: filters.priority,
          onChange: e => setFilter('priority', e.target.value),
          children: PRIORITIES.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
            value: p.value,
            children: p.label
          }, p.value))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "search",
          placeholder: "Search\u2026",
          value: filters.search,
          onChange: e => setFilter('search', e.target.value),
          className: "markaroo-admin-tasklist__search"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "markaroo-admin-tasklist__count",
          children: loading ? '…' : `${total} item${total !== 1 ? 's' : ''}`
        })]
      })]
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table", {
      className: "markaroo-admin-table markaroo-admin-tasklist__table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SortButton, {
              col: "created_at",
              label: "#"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: "Comment"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SortButton, {
              col: "status",
              label: "Status"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SortButton, {
              col: "priority",
              label: "Priority"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: "Assignee"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SortButton, {
              col: "due_date",
              label: "Due"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SortButton, {
              col: "created_at",
              label: "Created"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            children: "Page"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tbody", {
        children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tr", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            colSpan: 8,
            className: "markaroo-admin-tasklist__loading-row",
            children: "Loading\u2026"
          })
        }), !loading && items.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tr", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            colSpan: 8,
            className: "markaroo-admin__empty",
            style: {
              padding: '20px',
              textAlign: 'center'
            },
            children: "No reviews found."
          })
        }), items.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("a", {
              href: `${frontUrl.replace(/\/$/, '')}${item.page_key}?markaroo_open=${item.id}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "markaroo-admin-link",
              children: ["#", item.id]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            className: "markaroo-admin-tasklist__comment",
            children: item.comment.length > 80 ? item.comment.slice(0, 80) + '…' : item.comment
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: `markaroo-admin-status markaroo-admin-status--${item.status}`,
              children: item.status
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PriorityBadge, {
              priority: item.priority
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: item.assigned_to_name || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("em", {
              style: {
                color: '#9ca3af'
              },
              children: "\u2014"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: item.due_date ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: new Date(item.due_date) < new Date() && item.status === 'open' ? 'markaroo-admin-overdue' : '',
              children: new Date(item.due_date).toLocaleDateString()
            }) : '—'
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            title: item.created_at,
            children: timeAgo(item.created_at)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("code", {
              className: "markaroo-admin-page-key",
              children: item.page_key
            })
          })]
        }, item.id))]
      })]
    }), pages > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "markaroo-admin-pagination",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
        disabled: filters.page <= 1,
        onClick: () => setFilter('page', filters.page - 1),
        children: "\u2190 Prev"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
        children: [filters.page, " / ", pages]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
        disabled: filters.page >= pages,
        onClick: () => setFilter('page', filters.page + 1),
        children: "Next \u2192"
      })]
    })]
  });
}

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/index.tsx ***!
  \************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AdminShell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AdminShell */ "./resources/assets/apps/dashboard-markaroo/AdminShell.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const container = document.getElementById('dashboard-markaroo-root');
if (container) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(container).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_AdminShell__WEBPACK_IMPORTED_MODULE_1__.AdminShell, {}));
}
})();

/******/ })()
;
//# sourceMappingURL=dashboard-markaroo.js.map