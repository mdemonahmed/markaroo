/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/assets/widget/FeedbackPanel.tsx"
/*!***************************************************!*\
  !*** ./resources/assets/widget/FeedbackPanel.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeedbackPanel: () => (/* binding */ FeedbackPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _support_Avatar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./support/Avatar */ "./resources/assets/widget/support/Avatar.tsx");
/* harmony import */ var _support_pinNumbers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./support/pinNumbers */ "./resources/assets/widget/support/pinNumbers.ts");
/* harmony import */ var _support_status__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./support/status */ "./resources/assets/widget/support/status.ts");
/* harmony import */ var _support_timeAgo__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./support/timeAgo */ "./resources/assets/widget/support/timeAgo.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









function FeedbackRow({
  item,
  number,
  active,
  canResolve,
  onOpen,
  onResolve
}) {
  const resolved = item.status === 'resolved';
  const title = item.title?.trim();
  const snippet = item.comment.slice(0, 80);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    className: `markaroo-feedback-row${active ? ' markaroo-feedback-row--active' : ''}${resolved ? ' markaroo-feedback-row--resolved' : ''}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("button", {
      className: "markaroo-feedback-row__main",
      type: "button",
      onClick: onOpen,
      "aria-pressed": active,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
        className: "markaroo-feedback-row__top",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_support_Avatar__WEBPACK_IMPORTED_MODULE_4__.Avatar, {
          name: item.author,
          src: item.avatar,
          size: 24
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "markaroo-feedback-row__author",
          children: item.author
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "markaroo-feedback-row__time",
          title: (0,_support_timeAgo__WEBPACK_IMPORTED_MODULE_7__.absoluteTime)(item.created_at),
          children: (0,_support_timeAgo__WEBPACK_IMPORTED_MODULE_7__.timeAgo)(item.created_at)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "markaroo-feedback-row__ref",
          children: `#${number}`
        })]
      }), title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
        className: "markaroo-feedback-row__title",
        children: title
      }), snippet && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
        className: "markaroo-feedback-row__text",
        children: snippet
      })]
    }), canResolve && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
      className: `markaroo-feedback-row__resolve${resolved ? ' is-resolved' : ''}`,
      type: "button",
      "aria-label": resolved ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unresolve', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolve', 'markaroo'),
      "aria-pressed": resolved,
      onClick: e => {
        e.stopPropagation();
        onResolve();
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        "aria-hidden": "true",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("circle", {
          cx: "12",
          cy: "12",
          r: "9"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("path", {
          d: "M8.5 12.5l2.5 2.5 4.5-5"
        })]
      })
    })]
  });
}
function FeedbackPanel() {
  const {
    enabled,
    panelOpen,
    feedbacks,
    mode,
    captureState,
    activePinId,
    statusFilter
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_2__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_2__.useWidgetDispatch)();
  const config = window.markarooConfig;
  const canCreate = config?.currentUser?.canCreate ?? false;
  const shareCanComment = config?.shareRights?.canComment ?? false;
  const showNewButton = (canCreate || shareCanComment) && mode === 'comment' && captureState !== 'active';
  const canResolve = (config?.currentUser?.canResolve || config?.currentUser?.canManage) ?? false;

  // Tab state lives in the store so the on-page pin layer follows it too.
  const tab = statusFilter;

  // Display numbers come from the FULL list, ranked by creation order, so they
  // match the on-page pins and survive tab switches.
  const numberById = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_support_pinNumbers__WEBPACK_IMPORTED_MODULE_5__.pinNumbers)(feedbacks), [feedbacks]);
  if ('clean' === mode || !enabled || !panelOpen) {
    return null;
  }
  const open = feedbacks.filter(_support_status__WEBPACK_IMPORTED_MODULE_6__.isUnresolvedTab);
  const resolved = feedbacks.filter(_support_status__WEBPACK_IMPORTED_MODULE_6__.isResolvedTab);
  const visible = tab === 'open' ? open : resolved;
  function openPin(id) {
    dispatch({
      type: 'SET_ACTIVE_PIN',
      id: activePinId === id ? null : id
    });
    window.dispatchEvent(new CustomEvent('markaroo:pin-opened', {
      detail: {
        id
      }
    }));
  }
  async function toggleResolve(item) {
    const ep = item.status === 'resolved' ? `feedback/${item.id}/unresolve` : `feedback/${item.id}/resolve`;
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiFetch)(ep, {
      method: 'POST',
      body: ''
    }).catch(() => null);
    if (updated) {
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
      window.dispatchEvent(new CustomEvent('markaroo:pin-resolved', {
        detail: {
          id: item.id,
          status: updated.status
        }
      }));
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("aside", {
    className: "markaroo-panel",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feedback panel', 'markaroo'),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "markaroo-panel__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h2", {
        className: "markaroo-panel__title",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Feedback', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "markaroo-panel__header-actions",
        children: [showNewButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
          type: "button",
          onClick: () => dispatch({
            type: 'START_CAPTURE'
          }),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('+ New', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
          className: "markaroo-panel__close",
          type: "button",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'markaroo'),
          onClick: () => dispatch({
            type: 'CLOSE_PANEL'
          }),
          children: "\xD7"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "markaroo-panel__tabs",
      role: "tablist",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("button", {
        className: `markaroo-panel__tab${tab === 'open' ? ' markaroo-panel__tab--active' : ''}`,
        role: "tab",
        "aria-selected": tab === 'open',
        type: "button",
        onClick: () => dispatch({
          type: 'SET_STATUS_FILTER',
          filter: 'open'
        }),
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unresolved', 'markaroo'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "markaroo-panel__tab-count",
          children: open.length
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("button", {
        className: `markaroo-panel__tab${tab === 'resolved' ? ' markaroo-panel__tab--active' : ''}`,
        role: "tab",
        "aria-selected": tab === 'resolved',
        type: "button",
        onClick: () => dispatch({
          type: 'SET_STATUS_FILTER',
          filter: 'resolved'
        }),
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolved', 'markaroo'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "markaroo-panel__tab-count",
          children: resolved.length
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      className: "markaroo-panel__body",
      role: "tabpanel",
      children: visible.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
        className: "markaroo-panel__empty",
        children: tab === 'open' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No open feedback yet.', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No resolved feedback.', 'markaroo')
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        className: "markaroo-feedback-list",
        children: visible.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(FeedbackRow, {
          item: item,
          number: numberById.get(item.id) ?? 0,
          active: activePinId === item.id,
          canResolve: canResolve,
          onOpen: () => openPin(item.id),
          onResolve: () => toggleResolve(item)
        }, item.id))
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      className: "markaroo-panel__footer",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("button", {
        className: "markaroo-panel__exit",
        type: "button",
        onClick: () => dispatch({
          type: 'DISABLE_SESSION'
        }),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("path", {
            d: "M6 6l12 12M18 6L6 18"
          })
        }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Exit Feedback', 'markaroo')]
      })
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/KeyboardShortcuts.tsx"
/*!*******************************************************!*\
  !*** ./resources/assets/widget/KeyboardShortcuts.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyboardShortcuts: () => (/* binding */ KeyboardShortcuts)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ "./resources/assets/widget/api.ts");



/**
 * Single document-level keydown listener, active only while a feedback session
 * is running (never per-pin listeners). Shortcuts:
 *   n        start a new pin capture
 *   Escape   cancel the active capture, else deselect the active pin
 *   r        resolve/unresolve the active pin
 *   [ / ]    cycle to the previous / next pin
 *
 * Keys are ignored while the user is typing in a field or holding a modifier.
 */
function KeyboardShortcuts() {
  const state = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();

  // Read the latest state through a ref so the listener stays stable and is
  // bound/unbound only when the session toggles.
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(state);
  stateRef.current = state;
  const enabled = state.enabled && state.mode !== 'clean';
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!enabled) {
      return;
    }
    function isTextTarget(target) {
      const el = target;
      if (!el) {
        return false;
      }
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
    }
    async function toggleResolve(id) {
      const s = stateRef.current;
      const item = s.feedbacks.find(f => f.id === id);
      if (!item) {
        return;
      }
      const endpoint = item.status === 'open' ? `feedback/${id}/resolve` : `feedback/${id}/unresolve`;
      try {
        const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_2__.apiFetch)(endpoint, {
          method: 'POST',
          body: ''
        });
        dispatch({
          type: 'FEEDBACK_UPDATED',
          item: updated
        });
      } catch {
        /* non-fatal */
      }
    }
    function cycle(dir) {
      const s = stateRef.current;
      if (s.feedbacks.length === 0) {
        return;
      }
      const ids = s.feedbacks.map(f => f.id);
      const currentIndex = s.activePinId === null ? -1 : ids.indexOf(s.activePinId);
      const nextIndex = (currentIndex + dir + ids.length) % ids.length;
      dispatch({
        type: 'SET_ACTIVE_PIN',
        id: ids[nextIndex]
      });
      window.dispatchEvent(new CustomEvent('markaroo:pin-opened', {
        detail: {
          id: ids[nextIndex]
        }
      }));
    }
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || isTextTarget(e.target)) {
        return;
      }
      const s = stateRef.current;
      switch (e.key) {
        case 'n':
        case 'N':
          if (s.capturePhase === 'idle') {
            e.preventDefault();
            dispatch({
              type: 'START_CAPTURE'
            });
          }
          break;
        case 'Escape':
          if (s.captureState === 'active') {
            e.preventDefault();
            dispatch({
              type: 'END_CAPTURE'
            });
          } else if (s.activePinId !== null) {
            e.preventDefault();
            dispatch({
              type: 'SET_ACTIVE_PIN',
              id: null
            });
          }
          break;
        case 'r':
        case 'R':
          if (s.activePinId !== null) {
            e.preventDefault();
            toggleResolve(s.activePinId);
          }
          break;
        case '[':
          e.preventDefault();
          cycle(-1);
          break;
        case ']':
          e.preventDefault();
          cycle(1);
          break;
        default:
          break;
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, dispatch]);
  return null;
}

/***/ },

/***/ "./resources/assets/widget/Launcher.tsx"
/*!**********************************************!*\
  !*** ./resources/assets/widget/Launcher.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Launcher: () => (/* binding */ Launcher)
/* harmony export */ });
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Launcher() {
  const {
    mode,
    enabled,
    captureState,
    panelOpen
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_0__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_0__.useWidgetDispatch)();
  const config = window.markarooConfig;
  const canComment = (config?.currentUser?.canCreate || config?.shareRights?.canComment) ?? false;

  // Clean mode (or no comment rights) — no launcher.
  if ('clean' === mode || !canComment) {
    return null;
  }
  const isCapturing = 'active' === captureState;
  const label = enabled ? config?.i18n?.pins ?? 'Pins' : config?.i18n?.feedback ?? 'Feedback';
  function handleClick() {
    if (isCapturing) {
      return;
    }
    if (!enabled) {
      // First click — enter feedback mode and go straight to pin placement,
      // no separate "New" click needed. Cancel returns to the panel.
      dispatch({
        type: 'ENABLE_SESSION'
      });
      dispatch({
        type: 'START_CAPTURE'
      });
      return;
    }
    // Already in feedback mode — toggle the list panel.
    dispatch({
      type: 'TOGGLE_PANEL'
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
    className: `markaroo-launcher${enabled ? ' markaroo-launcher--active' : ''}${isCapturing ? ' markaroo-launcher--hidden' : ''}`,
    onClick: handleClick,
    "aria-label": label,
    "aria-expanded": enabled ? panelOpen : false,
    type: "button",
    children: [enabled ?
    /*#__PURE__*/
    // List icon — feedback session active.
    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
      className: "markaroo-launcher__icon",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("line", {
        x1: "8",
        y1: "6",
        x2: "21",
        y2: "6"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("line", {
        x1: "8",
        y1: "12",
        x2: "21",
        y2: "12"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("line", {
        x1: "8",
        y1: "18",
        x2: "21",
        y2: "18"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("line", {
        x1: "3",
        y1: "6",
        x2: "3.01",
        y2: "6"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("line", {
        x1: "3",
        y1: "12",
        x2: "3.01",
        y2: "12"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("line", {
        x1: "3",
        y1: "18",
        x2: "3.01",
        y2: "18"
      })]
    }) :
    /*#__PURE__*/
    // Markaroo mark — idle.
    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
      className: "markaroo-launcher__icon",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      fill: "currentColor",
      "aria-hidden": "true",
      focusable: "false",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
        d: "M25.9776 0.894851C34.308 0.398992 42.8831 -0.361666 50.7904 2.85027C71.8554 11.4067 177.357 106.105 201.791 127.376C215.581 139.381 230.903 156.017 247.714 163.507C256.743 167.53 265.814 164.497 274.065 160.032C287.466 152.782 299.627 139.949 311.102 129.988C339.475 105.355 440.305 10.755 462.258 2.97249C471.377 -0.260137 482.972 -1.5402 491.996 2.67507C499.76 6.30171 504.612 13.7763 507.348 21.5264C509.597 27.8965 510.595 34.6977 510.861 41.4134C511.839 66.0446 510.728 91.1878 510.702 115.879L510.633 269.363L510.569 412.202C510.506 444.706 522.597 508.517 477.575 510.552C427.272 512.826 376.539 511.496 326.161 511.44C269.463 511.378 323.803 443.693 336.739 422.312C348.724 402.568 369.838 370.226 376.288 348.846C384.789 320.247 381.362 289.506 366.76 263.389C350.598 234.08 323.247 212.267 290.713 202.743C259.846 193.887 226.643 197.648 198.638 213.171C170.825 228.273 149.016 254.245 139.226 284.946C116.702 355.579 178.147 413.363 207.732 472.114C217.272 491.055 220.974 513.127 191.604 511.926C136.13 509.658 80.4128 514.698 25.4329 509.683C-7.42013 506.321 0.958875 428.034 0.949149 399.909L0.99941 253.129L1.12098 121.573C0.968606 93.0338 -1.86492 52.5726 3.8605 24.0967C6.20286 12.443 15.4994 6.02577 25.9776 0.894851Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
        d: "M248.45 273.261C274.578 268.204 299.955 284.834 305.22 310.462C310.483 336.089 293.655 361.073 267.572 366.353C241.329 371.663 215.688 355.019 210.392 329.233C205.095 303.447 222.161 278.349 248.45 273.261Z"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-launcher__label",
      children: label
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/ModeManager.tsx"
/*!*************************************************!*\
  !*** ./resources/assets/widget/ModeManager.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModeManager: () => (/* binding */ ModeManager),
/* harmony export */   useSetMode: () => (/* binding */ useSetMode)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function ModeManager({
  children
}) {
  const {
    mode
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.dispatchEvent(new CustomEvent('markaroo:mode-changed', {
      detail: {
        mode
      }
    }));
  }, [mode]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: children
  });
}
function useSetMode() {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();
  return mode => {
    dispatch({
      type: 'SET_MODE',
      mode
    });
  };
}

/***/ },

/***/ "./resources/assets/widget/WidgetRoot.tsx"
/*!************************************************!*\
  !*** ./resources/assets/widget/WidgetRoot.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WidgetRoot: () => (/* binding */ WidgetRoot)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _ModeManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ModeManager */ "./resources/assets/widget/ModeManager.tsx");
/* harmony import */ var _KeyboardShortcuts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./KeyboardShortcuts */ "./resources/assets/widget/KeyboardShortcuts.tsx");
/* harmony import */ var _Launcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Launcher */ "./resources/assets/widget/Launcher.tsx");
/* harmony import */ var _FeedbackPanel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FeedbackPanel */ "./resources/assets/widget/FeedbackPanel.tsx");
/* harmony import */ var _pins_PinLayer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pins/PinLayer */ "./resources/assets/widget/pins/PinLayer.tsx");
/* harmony import */ var _pins_QueuedPins__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pins/QueuedPins */ "./resources/assets/widget/pins/QueuedPins.tsx");
/* harmony import */ var _capture_CaptureOverlay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./capture/CaptureOverlay */ "./resources/assets/widget/capture/CaptureOverlay.tsx");
/* harmony import */ var _composer_ComposerPanel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./composer/ComposerPanel */ "./resources/assets/widget/composer/ComposerPanel.tsx");
/* harmony import */ var _thread_PinCard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./thread/PinCard */ "./resources/assets/widget/thread/PinCard.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);












function WidgetInner() {
  const {
    capturePhase,
    captureData,
    mode,
    activePinId,
    feedbacks
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();

  // Admin-bar / external launcher: start a capture on `.markaroo-launch` click.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onLaunch(e) {
      const el = e.target;
      if (el && el.closest('.markaroo-launch')) {
        e.preventDefault();
        dispatch({
          type: 'ENABLE_SESSION'
        });
      }
    }
    document.addEventListener('click', onLaunch);
    return () => document.removeEventListener('click', onLaunch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add feedback that finally submitted from the offline queue to state.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onRestored(e) {
      const item = e.detail?.feedback;
      if (item) {
        dispatch({
          type: 'FEEDBACK_SUBMITTED',
          item
        });
      }
    }
    window.addEventListener('markaroo:feedback-restored', onRestored);
    return () => window.removeEventListener('markaroo:feedback-restored', onRestored);
  }, [dispatch]);
  function handleSubmitted(item) {
    dispatch({
      type: 'FEEDBACK_SUBMITTED',
      item
    });
  }
  function handleCancelCapture() {
    dispatch({
      type: 'END_CAPTURE'
    });
  }
  const activePin = activePinId !== null ? feedbacks.find(f => f.id === activePinId) ?? null : null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_ModeManager__WEBPACK_IMPORTED_MODULE_2__.ModeManager, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_KeyboardShortcuts__WEBPACK_IMPORTED_MODULE_3__.KeyboardShortcuts, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_Launcher__WEBPACK_IMPORTED_MODULE_4__.Launcher, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_FeedbackPanel__WEBPACK_IMPORTED_MODULE_5__.FeedbackPanel, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_pins_PinLayer__WEBPACK_IMPORTED_MODULE_6__.PinLayer, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_pins_QueuedPins__WEBPACK_IMPORTED_MODULE_7__.QueuedPins, {}), 'clean' !== mode && 'selecting' === capturePhase && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_capture_CaptureOverlay__WEBPACK_IMPORTED_MODULE_8__.CaptureOverlay, {}), 'clean' !== mode && 'composing' === capturePhase && captureData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_composer_ComposerPanel__WEBPACK_IMPORTED_MODULE_9__.ComposerPanel, {
      captureData: captureData,
      onSubmitted: handleSubmitted,
      onCancel: handleCancelCapture
    }), 'clean' !== mode && 'idle' === capturePhase && activePin && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_thread_PinCard__WEBPACK_IMPORTED_MODULE_10__.PinCard, {
      feedback: activePin,
      onClose: () => dispatch({
        type: 'SET_ACTIVE_PIN',
        id: null
      })
    }, activePin.id)]
  });
}
function WidgetRoot() {
  const config = window.markarooConfig;
  const initialMode = config?.widgetMode ?? 'comment';
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.dispatchEvent(new CustomEvent('markaroo:ready', {
      detail: {
        mode: initialMode,
        config
      }
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.WidgetProvider, {
    initialMode: initialMode,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(WidgetInner, {})
  });
}

/***/ },

/***/ "./resources/assets/widget/api.ts"
/*!****************************************!*\
  !*** ./resources/assets/widget/api.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiDelete: () => (/* binding */ apiDelete),
/* harmony export */   apiFetch: () => (/* binding */ apiFetch),
/* harmony export */   apiPatch: () => (/* binding */ apiPatch),
/* harmony export */   apiPost: () => (/* binding */ apiPost),
/* harmony export */   apiPostForm: () => (/* binding */ apiPostForm),
/* harmony export */   fetchUsers: () => (/* binding */ fetchUsers)
/* harmony export */ });
/**
 * Thin REST client. Reads nonce + share token from markarooConfig.
 * Always rejects with an Error whose message is the WP error message.
 */

function cfg() {
  return window.markarooConfig;
}
function authHeaders(extra = {}) {
  const config = cfg();
  const headers = {
    'Content-Type': 'application/json',
    'X-WP-Nonce': config.nonce,
    ...extra
  };
  if (config.shareToken) {
    headers['X-Markaroo-Share'] = config.shareToken;
  }
  return headers;
}
function apiUrl(path) {
  const base = cfg().restUrl;
  const full = `${base}markaroo/v1/${path}`;
  // With plain permalinks, rest_url() returns the `…?rest_route=/` form, so the
  // base already contains a `?`. Any query string carried by `path` would add a
  // second `?`, which breaks the route — turn that path-level `?` into `&`.
  if (!base.includes('?')) {
    return full;
  }
  return full.slice(0, base.length) + full.slice(base.length).replace('?', '&');
}
async function apiFetch(path, init = {}) {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: authHeaders(init.headers)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * POST with a JSON body.
 * @param path
 * @param data
 */
function apiPost(path, data) {
  return apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PATCH with a JSON body.
 * @param path
 * @param data
 */
function apiPatch(path, data) {
  return apiFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE.
 * @param path
 */
function apiDelete(path) {
  return apiFetch(path, {
    method: 'DELETE'
  });
}

/**
 * POST multipart form data (file uploads). No Content-Type header — the
 * browser sets it with the multipart boundary.
 * @param path
 * @param form
 */
async function apiPostForm(path, form) {
  const config = cfg();
  const headers = {
    'X-WP-Nonce': config.nonce
  };
  if (config.shareToken) {
    headers['X-Markaroo-Share'] = config.shareToken;
  }
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    body: form,
    headers
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json();
}
let usersPromise = null;

/**
 * Fetch the mentionable/assignable users list once per page session. Several
 * components (composer, pin card, mention autocomplete) need the same list;
 * sharing one in-flight promise avoids N identical `users?per_page=50` calls.
 */
function fetchUsers() {
  if (!usersPromise) {
    usersPromise = apiFetch('users?per_page=50').catch(err => {
      usersPromise = null; // Allow a retry after a failed fetch.
      throw err;
    });
  }
  return usersPromise;
}

/***/ },

/***/ "./resources/assets/widget/capture/CaptureOverlay.tsx"
/*!************************************************************!*\
  !*** ./resources/assets/widget/capture/CaptureOverlay.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CaptureOverlay: () => (/* binding */ CaptureOverlay)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _RegionAnnotator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RegionAnnotator */ "./resources/assets/widget/capture/RegionAnnotator.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





// Unified capture: a click places a point pin, a drag selects a region.
function CaptureOverlay() {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_2__.useWidgetDispatch)();
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.dispatchEvent(new CustomEvent('markaroo:capture-start', {
      detail: {
        tool: 'region'
      }
    }));
  }, []);
  function cancel() {
    dispatch({
      type: 'END_CAPTURE'
    });
  }
  function handleCapture(data) {
    dispatch({
      type: 'PIN_PLACED',
      data
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_RegionAnnotator__WEBPACK_IMPORTED_MODULE_3__.RegionAnnotator, {
      onCapture: handleCapture,
      onCancel: cancel
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "markaroo-capture-switch",
      role: "toolbar",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Capture mode', 'markaroo'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
        className: "markaroo-capture-switch__cancel",
        onClick: cancel,
        type: "button",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'markaroo')
      })
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/capture/RegionAnnotator.tsx"
/*!*************************************************************!*\
  !*** ./resources/assets/widget/capture/RegionAnnotator.tsx ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegionAnnotator: () => (/* binding */ RegionAnnotator)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _captureUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




// -----------------------------------------------------------------------
// Geometry
// -----------------------------------------------------------------------

const HANDLES = ['nw', 'ne', 'se', 'sw'];
const MIN_SIZE = 16;
const ANN_COLOR = '#ef4444';
function clampBox(b) {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const left = Math.max(0, Math.min(b.left, vw - MIN_SIZE));
  const top = Math.max(0, Math.min(b.top, vh - MIN_SIZE));
  return {
    left,
    top,
    width: Math.max(MIN_SIZE, Math.min(b.width, vw - left)),
    height: Math.max(MIN_SIZE, Math.min(b.height, vh - top))
  };
}
function rectFrom(x0, y0, x1, y1) {
  return {
    left: Math.min(x0, x1),
    top: Math.min(y0, y1),
    width: Math.abs(x1 - x0),
    height: Math.abs(y1 - y0)
  };
}
function applyResize(orig, h, dx, dy) {
  let {
    left,
    top,
    width,
    height
  } = orig;
  if (h.includes('n')) {
    top += dy;
    height -= dy;
  }
  if (h.includes('s')) {
    height += dy;
  }
  if (h.includes('w')) {
    left += dx;
    width -= dx;
  }
  if (h.includes('e')) {
    width += dx;
  }
  return clampBox({
    left,
    top,
    width,
    height
  });
}

// Draft annotation in viewport-px while drawing; converted to page-pct on confirm.

function RegionAnnotator({
  onCapture,
  onCancel
}) {
  const settings = window.markarooConfig?.settings;
  // Settings → Capture: hide the drawing tools entirely when disabled, and
  // preselect the configured drawing tool once a region has been drawn.
  const drawingEnabled = settings?.['capture.enable_area_select'] !== false;
  const rawDefault = String(settings?.['capture.default_annotation_tool'] ?? 'arrow');
  const defaultTool = 'rectangle' === rawDefault ? 'rect' : ['rect', 'circle', 'arrow'].includes(rawDefault) ? rawDefault : 'arrow';
  const [box, setBox] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [tool, setTool] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('select');
  const [anns, setAnns] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [draft, setDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const gestureRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    kind: 'none'
  });
  const isShape = tool !== 'select';

  // ---- Pointer handlers on the overlay -------------------------------------
  const onPointerDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const target = e.target;
    // Toolbar / handle / box-body have their own handlers.
    if (target.closest('.markaroo-ra-toolbar')) {
      return;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {} // synthetic/stale pointers have no capturable id

    if (isShape && box) {
      gestureRef.current = {
        kind: 'annotate',
        x0: e.clientX,
        y0: e.clientY
      };
      setDraft({
        tool: tool,
        x0: e.clientX,
        y0: e.clientY,
        x1: e.clientX,
        y1: e.clientY
      });
      return;
    }
    if (!box) {
      gestureRef.current = {
        kind: 'draw-box',
        x0: e.clientX,
        y0: e.clientY
      };
    }
  }, [box, isShape, tool]);
  const onPointerMove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const g = gestureRef.current;
    if (g.kind === 'draw-box') {
      setBox(rectFrom(g.x0, g.y0, e.clientX, e.clientY));
    } else if (g.kind === 'move') {
      setBox(clampBox({
        left: g.orig.left + (e.clientX - g.startX),
        top: g.orig.top + (e.clientY - g.startY),
        width: g.orig.width,
        height: g.orig.height
      }));
    } else if (g.kind === 'resize') {
      setBox(applyResize(g.orig, g.handle, e.clientX - g.startX, e.clientY - g.startY));
    } else if (g.kind === 'annotate') {
      setDraft(d => d ? {
        ...d,
        x1: e.clientX,
        y1: e.clientY
      } : d);
    }
  }, []);
  const onPointerUp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const g = gestureRef.current;
    gestureRef.current = {
      kind: 'none'
    };
    if (g.kind === 'draw-box') {
      // A simple click (no real drag) places a point pin right there.
      if (Math.abs(e.clientX - g.x0) < MIN_SIZE && Math.abs(e.clientY - g.y0) < MIN_SIZE) {
        setBox(null);
        const data = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_2__.buildClickCaptureData)(g.x0, g.y0);
        window.dispatchEvent(new CustomEvent('markaroo:pin-placed', {
          detail: {
            captureData: data
          }
        }));
        onCapture(data);
        return;
      }
      setBox(b => {
        if (!b || b.width < MIN_SIZE || b.height < MIN_SIZE) {
          return null;
        }
        return clampBox(b);
      });
    } else if (g.kind === 'annotate') {
      setDraft(d => {
        if (d && (Math.abs(d.x1 - d.x0) > 4 || Math.abs(d.y1 - d.y0) > 4)) {
          setAnns(prev => [...prev, d]);
        }
        return null;
      });
    }
  }, [onCapture]);

  // ---- Box body move / handle resize ---------------------------------------
  function startMove(e) {
    if (isShape || !box) {
      return;
    }
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {} // synthetic/stale pointers have no capturable id
    gestureRef.current = {
      kind: 'move',
      startX: e.clientX,
      startY: e.clientY,
      orig: box
    };
  }
  function startResize(e, handle) {
    if (isShape || !box) {
      return;
    }
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {} // synthetic/stale pointers have no capturable id
    gestureRef.current = {
      kind: 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      orig: box
    };
  }

  // ---- Toolbar actions ------------------------------------------------------
  function undo() {
    setAnns(prev => prev.slice(0, -1));
  }
  function confirm() {
    if (!box) {
      return;
    }
    const data = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_2__.buildRegionCaptureData)(box.left, box.top, box.width, box.height);
    const annotations = anns.map(a => {
      const from = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_2__.toPagePct)(a.x0, a.y0);
      const to = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_2__.toPagePct)(a.x1, a.y1);
      return {
        tool: a.tool,
        from,
        to,
        color: ANN_COLOR,
        width: 3
      };
    });
    data.screenshotRect.annotations = annotations;
    window.dispatchEvent(new CustomEvent('markaroo:region-selected', {
      detail: {
        captureData: data
      }
    }));
    onCapture(data);
  }

  // ---- Render ---------------------------------------------------------------
  const showShapes = [...anns, ...(draft ? [draft] : [])];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `markaroo-ra-overlay${isShape ? ' markaroo-ra-overlay--draw' : ''}`,
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    role: "presentation",
    children: [!box && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "markaroo-ra-hint",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click to place a pin — drag to select an area', 'markaroo')
    }), box && showShapes.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("svg", {
      className: "markaroo-ra-shapes",
      "aria-hidden": "true",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("defs", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("marker", {
          id: "markaroo-ra-arrow",
          markerWidth: "10",
          markerHeight: "10",
          refX: "7",
          refY: "3",
          orient: "auto",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
            d: "M0,0 L7,3 L0,6 Z",
            fill: ANN_COLOR
          })
        })
      }), showShapes.map((s, i) => {
        if (s.tool === 'arrow') {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("line", {
            x1: s.x0,
            y1: s.y0,
            x2: s.x1,
            y2: s.y1,
            stroke: ANN_COLOR,
            strokeWidth: 3,
            markerEnd: "url(#markaroo-ra-arrow)"
          }, i);
        }
        if (s.tool === 'rect') {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("rect", {
            x: Math.min(s.x0, s.x1),
            y: Math.min(s.y0, s.y1),
            width: Math.abs(s.x1 - s.x0),
            height: Math.abs(s.y1 - s.y0),
            fill: "none",
            stroke: ANN_COLOR,
            strokeWidth: 3
          }, i);
        }
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("ellipse", {
          cx: (s.x0 + s.x1) / 2,
          cy: (s.y0 + s.y1) / 2,
          rx: Math.abs(s.x1 - s.x0) / 2,
          ry: Math.abs(s.y1 - s.y0) / 2,
          fill: "none",
          stroke: ANN_COLOR,
          strokeWidth: 3
        }, i);
      })]
    }), box && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "markaroo-ra-box",
      style: {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height
      },
      children: [!isShape && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "markaroo-ra-box__body",
        onPointerDown: startMove
      }), !isShape && HANDLES.map(h => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: `markaroo-ra-handle markaroo-ra-handle--${h}`,
        onPointerDown: e => startResize(e, h)
      }, h)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "markaroo-ra-toolbar",
        role: "toolbar",
        "aria-label": "Annotation tools",
        children: [drawingEnabled && [{
          id: 'arrow',
          label: 'Arrow',
          icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
            d: "M7 17L17 7M17 7H9M17 7V15"
          })
        }, {
          id: 'rect',
          label: 'Rectangle',
          icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("rect", {
            x: "4",
            y: "4",
            width: "16",
            height: "16",
            rx: "2"
          })
        }, {
          id: 'circle',
          label: 'Circle',
          icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("circle", {
            cx: "12",
            cy: "12",
            r: "8"
          })
        }].slice().sort((a, b) => a.id === defaultTool ? -1 : b.id === defaultTool ? 1 : 0).map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          className: `markaroo-ra-tool${tool === t.id ? ' is-active' : ''}`,
          "aria-label": t.label,
          "aria-pressed": tool === t.id,
          onClick: () => setTool(tool === t.id ? 'select' : t.id),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: t.icon
          })
        }, t.id)), drawingEnabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          className: "markaroo-ra-tool",
          "aria-label": "Undo",
          onClick: undo,
          disabled: anns.length === 0,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              d: "M9 14L4 9l5-5"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              d: "M4 9h11a5 5 0 0 1 0 10h-4"
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          className: "markaroo-ra-tool markaroo-ra-tool--cancel",
          "aria-label": "Cancel",
          onClick: onCancel,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              d: "M6 6l12 12M18 6L6 18"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          className: "markaroo-ra-tool markaroo-ra-tool--confirm",
          "aria-label": "Confirm",
          onClick: confirm,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              d: "M5 13l4 4L19 7"
            })
          })
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/capture/Screenshot.ts"
/*!*******************************************************!*\
  !*** ./resources/assets/widget/capture/Screenshot.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureAndUpload: () => (/* binding */ captureAndUpload),
/* harmony export */   captureCroppedDataUrl: () => (/* binding */ captureCroppedDataUrl),
/* harmony export */   captureScreenshot: () => (/* binding */ captureScreenshot),
/* harmony export */   uploadScreenshot: () => (/* binding */ uploadScreenshot)
/* harmony export */ });
/* harmony import */ var _annotationUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./annotationUtils */ "./resources/assets/widget/capture/annotationUtils.ts");
/**
 * Screenshot capture service.
 *
 * html2canvas is lazy-loaded on first capture and cached.
 * Failure is always non-fatal — feedback submission succeeds regardless.
 */


/** Module-level cache — loaded once per page session. */
let h2cFn = null;
async function loadHtml2Canvas() {
  if (!h2cFn) {
    // webpackChunkName gives the split chunk a readable filename
    // (public/js/html2canvas.js) instead of a numeric id like 354.js —
    // WordPress.org reviewers need to identify bundled third-party code.
    const mod = await __webpack_require__.e(/*! import() | js/html2canvas */ "js/html2canvas").then(__webpack_require__.t.bind(__webpack_require__, /*! html2canvas */ "./node_modules/html2canvas/dist/html2canvas.js", 23));
    h2cFn = mod.default;
  }
  return h2cFn;
}
function resolveOptions(overrides) {
  // JS reads from markarooConfig.screenshotOptions (injected by PHP via markaroo/screenshot/options filter).
  const cfg = window.markarooConfig?.screenshotOptions;
  return {
    format: 'jpeg',
    quality: 0.8,
    maskInputs: true,
    // Default to 1 (not devicePixelRatio): a 2-3x retina scale quadruples the
    // rasterized canvas and the upload payload. PHP can raise it via the
    // markaroo/screenshot/options filter.
    scale: 1,
    ...cfg,
    ...overrides
  };
}
function isEnabled() {
  return window.markarooConfig?.screenshotOptions?.enabled !== false;
}

/**
 * Mask sensitive elements inside the cloned document.
 * Never touches the live DOM.
 * @param doc
 */
function maskClone(doc) {
  doc.querySelectorAll('input, textarea, [data-markaroo-mask]').forEach(el => {
    el.style.color = 'transparent';
    el.style.textShadow = 'none';
    el.style.backgroundColor = '#e2e8f0';
    el.style.backgroundImage = 'none';
    // Clear value so html2canvas doesn't render it.
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = '';
    }
  });
}

/**
 * Capture the current viewport as a Blob.
 *
 * - Hides #markaroo-root via visibility (keeps layout intact) before capture.
 * - Uses html2canvas onclone to hide in the clone as well (belt-and-suspenders).
 * - Masks inputs in the clone when maskInputs = true.
 * - Returns null when screenshots are disabled or html2canvas fails.
 * @param overrides
 */
async function captureScreenshot(overrides) {
  if (!isEnabled()) {
    return null;
  }
  const opts = resolveOptions(overrides);
  const h2c = await loadHtml2Canvas();
  const root = document.getElementById('markaroo-root');

  // Hide widget UI so it doesn't appear in the shot.
  if (root) {
    root.style.visibility = 'hidden';
  }
  let canvas;
  try {
    canvas = await h2c(document.body, {
      useCORS: true,
      allowTaint: false,
      scale: opts.scale,
      onclone: clonedDoc => {
        const clonedRoot = clonedDoc.getElementById('markaroo-root');
        if (clonedRoot) {
          clonedRoot.style.display = 'none';
        }
        if (opts.maskInputs) {
          maskClone(clonedDoc);
        }
      }
    });
  } finally {
    // Always restore UI even if html2canvas throws.
    if (root) {
      root.style.visibility = '';
    }
  }
  return new Promise(resolve => {
    const mime = opts.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = opts.format === 'jpeg' ? opts.quality : undefined;
    canvas.toBlob(blob => {
      if (blob) {
        window.dispatchEvent(new CustomEvent('markaroo:screenshot-ready', {
          detail: {
            blob,
            options: opts
          }
        }));
      }
      resolve(blob);
    }, mime, quality);
  });
}
function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image load failed'));
    };
    img.src = url;
  });
}

/**
 * Capture the full page, burn in annotations, then crop to the selected region
 * and return a base64 data URL — this is the "Pinned content" image sent inside
 * the create request.
 *
 * `rect` is page-percentage (0–1). When null, the whole page is returned.
 * Annotations are page-percentage too, so they're burned onto the full screenshot
 * (page-pct === full-canvas-pct) before cropping. Always resolves; null on failure.
 *
 * @param rect        Crop region as page-percentages, or null for the full page.
 * @param annotations Annotations to burn in (page-percentage coords).
 */
async function captureCroppedDataUrl(rect, annotations = []) {
  try {
    const full = await captureScreenshot();
    if (!full) {
      return null;
    }
    const opts = resolveOptions();
    const mime = opts.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = opts.format === 'jpeg' ? opts.quality : undefined;
    const burned = (await (0,_annotationUtils__WEBPACK_IMPORTED_MODULE_0__.burnAnnotationsIntoBlob)(full, annotations, opts.format, opts.quality)) ?? full;
    const img = await blobToImage(burned);
    const nW = img.naturalWidth;
    const nH = img.naturalHeight;

    // Crop box in natural px. Clamp to image bounds; fall back to full image.
    let sx = 0;
    let sy = 0;
    let sw = nW;
    let sh = nH;
    if (rect && rect.wPct > 0 && rect.hPct > 0) {
      sx = Math.max(0, Math.round(rect.xPct * nW));
      sy = Math.max(0, Math.round(rect.yPct * nH));
      sw = Math.min(nW - sx, Math.round(rect.wPct * nW));
      sh = Math.min(nH - sy, Math.round(rect.hPct * nH));
      if (sw < 1 || sh < 1) {
        sx = 0;
        sy = 0;
        sw = nW;
        sh = nH;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    return canvas.toDataURL(mime, quality);
  } catch {
    // Screenshot failure must never block the feedback submission.
    return null;
  }
}

/**
 * Upload a screenshot blob to the REST API.
 * Returns upload metadata on success, null on failure (non-fatal).
 * @param feedbackId
 * @param blob
 */
async function uploadScreenshot(feedbackId, blob) {
  const config = window.markarooConfig;
  if (!config) {
    return null;
  }
  const fmt = resolveOptions().format;
  const filename = `markaroo-${feedbackId}-${Date.now()}.${fmt}`;
  const formData = new FormData();
  formData.append('screenshot', blob, filename);
  const headers = {
    'X-WP-Nonce': config.nonce
  };
  if (config.shareToken) {
    headers['X-Markaroo-Share'] = config.shareToken;
  }
  try {
    const res = await fetch(`${config.restUrl}markaroo/v1/feedback/${feedbackId}/screenshot`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    window.dispatchEvent(new CustomEvent('markaroo:screenshot-uploaded', {
      detail: {
        feedbackId,
        ...data
      }
    }));
    return data;
  } catch {
    return null;
  }
}

/**
 * Capture then upload in one call. Always resolves — never rejects.
 * Call this after feedback has been created (you need the feedbackId).
 * @param feedbackId
 * @param captureOverrides
 */
async function captureAndUpload(feedbackId, captureOverrides) {
  try {
    const blob = await captureScreenshot(captureOverrides);
    if (!blob) {
      return null;
    }
    return await uploadScreenshot(feedbackId, blob);
  } catch {
    // Screenshot failure must never block the feedback submission.
    return null;
  }
}

/***/ },

/***/ "./resources/assets/widget/capture/annotationUtils.ts"
/*!************************************************************!*\
  !*** ./resources/assets/widget/capture/annotationUtils.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   burnAnnotationsIntoBlob: () => (/* binding */ burnAnnotationsIntoBlob),
/* harmony export */   canvasPct: () => (/* binding */ canvasPct),
/* harmony export */   renderAnnotationItem: () => (/* binding */ renderAnnotationItem),
/* harmony export */   renderAnnotations: () => (/* binding */ renderAnnotations)
/* harmony export */ });
// -----------------------------------------------------------------------
// Primitive drawers (work in canvas-px space)
// -----------------------------------------------------------------------

function setStroke(ctx, color, width) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}
function drawArrow(ctx, fx, fy, tx, ty, color, width) {
  setStroke(ctx, color, width);
  const angle = Math.atan2(ty - fy, tx - fx);
  const headLen = Math.max(12, width * 5);
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  // Filled arrowhead.
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - headLen * Math.cos(angle - Math.PI / 7), ty - headLen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(tx - headLen * Math.cos(angle + Math.PI / 7), ty - headLen * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();
}
function drawRect(ctx, fx, fy, tx, ty, color, width) {
  setStroke(ctx, color, width);
  ctx.beginPath();
  ctx.strokeRect(fx, fy, tx - fx, ty - fy);
}
function drawCircle(ctx, fx, fy, tx, ty, color, width) {
  setStroke(ctx, color, width);
  const cx = (fx + tx) / 2;
  const cy = (fy + ty) / 2;
  const rx = Math.abs(tx - fx) / 2;
  const ry = Math.abs(ty - fy) / 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
  ctx.stroke();
}

// -----------------------------------------------------------------------
// Render helpers
// -----------------------------------------------------------------------

/**
 * Draw one annotation onto ctx. Converts percentage coords → canvas px.
 * @param ctx
 * @param ann
 * @param canvasW
 * @param canvasH
 */
function renderAnnotationItem(ctx, ann, canvasW, canvasH) {
  const fx = ann.from.xPct * canvasW;
  const fy = ann.from.yPct * canvasH;
  const tx = ann.to.xPct * canvasW;
  const ty = ann.to.yPct * canvasH;
  switch (ann.tool) {
    case 'arrow':
      drawArrow(ctx, fx, fy, tx, ty, ann.color, ann.width);
      break;
    case 'rect':
      drawRect(ctx, fx, fy, tx, ty, ann.color, ann.width);
      break;
    case 'circle':
      drawCircle(ctx, fx, fy, tx, ty, ann.color, ann.width);
      break;
  }
}

/**
 * Draw all annotations in order.
 * @param ctx
 * @param annotations
 * @param canvasW
 * @param canvasH
 */
function renderAnnotations(ctx, annotations, canvasW, canvasH) {
  annotations.forEach(ann => renderAnnotationItem(ctx, ann, canvasW, canvasH));
}

// -----------------------------------------------------------------------
// Burn-in: draw annotations onto the screenshot blob
// -----------------------------------------------------------------------

async function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image load failed'));
    };
    img.src = url;
  });
}

/**
 * Composite annotations onto a screenshot blob and return a new blob.
 * Returns null if anything fails (burn-in failure must not block submission).
 * @param sourceBlob
 * @param annotations
 * @param format
 * @param quality
 */
async function burnAnnotationsIntoBlob(sourceBlob, annotations, format = 'jpeg', quality = 0.8) {
  if (annotations.length === 0) {
    return sourceBlob;
  }
  try {
    const img = await loadImage(sourceBlob);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return sourceBlob;
    }
    ctx.drawImage(img, 0, 0);
    renderAnnotations(ctx, annotations, canvas.width, canvas.height);
    return new Promise(resolve => {
      canvas.toBlob(resolve, format === 'png' ? 'image/png' : 'image/jpeg', format === 'jpeg' ? quality : undefined);
    });
  } catch {
    return sourceBlob;
  }
}

// -----------------------------------------------------------------------
// Coordinate helpers
// -----------------------------------------------------------------------

/**
 * Convert a pointer event position on a canvas element to percentage coords.
 * @param clientX
 * @param clientY
 * @param canvas
 */
function canvasPct(clientX, clientY, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    xPct: Math.min(1, Math.max(0, (clientX - rect.left) * scaleX / canvas.width)),
    yPct: Math.min(1, Math.max(0, (clientY - rect.top) * scaleY / canvas.height))
  };
}

/***/ },

/***/ "./resources/assets/widget/capture/captureUtils.ts"
/*!*********************************************************!*\
  !*** ./resources/assets/widget/capture/captureUtils.ts ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildClickCaptureData: () => (/* binding */ buildClickCaptureData),
/* harmony export */   buildRegionCaptureData: () => (/* binding */ buildRegionCaptureData),
/* harmony export */   getElementSelector: () => (/* binding */ getElementSelector),
/* harmony export */   getPageElementAt: () => (/* binding */ getPageElementAt),
/* harmony export */   getPageKey: () => (/* binding */ getPageKey),
/* harmony export */   getViewport: () => (/* binding */ getViewport),
/* harmony export */   toCaptureRect: () => (/* binding */ toCaptureRect),
/* harmony export */   toElementOffset: () => (/* binding */ toElementOffset),
/* harmony export */   toPagePct: () => (/* binding */ toPagePct)
/* harmony export */ });
function getViewport() {
  return `${window.innerWidth}x${window.innerHeight}`;
}

/**
 * Normalized page identifier for feedback. Strips the `markaroo_share` token so a
 * page keys the same with or without a guest share link in the URL — pins stay
 * stable across share navigation.
 */
function getPageKey() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(window.location.search);
  params.delete('markaroo_share');
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Convert viewport-relative px to page-relative percentage.
 * Accounts for scroll position so pin survives layout reflows.
 * @param clientX
 * @param clientY
 */
function toPagePct(clientX, clientY) {
  const totalW = document.documentElement.scrollWidth;
  const totalH = document.documentElement.scrollHeight;
  const pageX = clientX + window.scrollX;
  const pageY = clientY + window.scrollY;
  return {
    xPct: clampPct(pageX / totalW),
    yPct: clampPct(pageY / totalH)
  };
}

/**
 * Offset of a point within an element (as percentage of element dimensions).
 * @param clientX
 * @param clientY
 * @param el
 */
function toElementOffset(clientX, clientY, el) {
  const r = el.getBoundingClientRect();
  return {
    xPct: clampPct((clientX - r.left) / r.width),
    yPct: clampPct((clientY - r.top) / r.height)
  };
}

/**
 * Convert a viewport-px rect to page-percentage rect.
 * @param left
 * @param top
 * @param width
 * @param height
 */
function toCaptureRect(left, top, width, height) {
  const totalW = document.documentElement.scrollWidth;
  const totalH = document.documentElement.scrollHeight;
  const pageLeft = left + window.scrollX;
  const pageTop = top + window.scrollY;
  return {
    xPct: clampPct(pageLeft / totalW),
    yPct: clampPct(pageTop / totalH),
    wPct: clampPct(width / totalW),
    hPct: clampPct(height / totalH)
  };
}

/**
 * Return the topmost non-Markaroo element at a viewport point.
 * Temporarily strips pointer-events from all #markaroo-root children
 * so elementsFromPoint sees through the overlay.
 * @param clientX
 * @param clientY
 */
function getPageElementAt(clientX, clientY) {
  const candidates = document.elementsFromPoint(clientX, clientY);
  return candidates.find(el => !el.closest('#markaroo-root') && el !== document.documentElement && el !== document.body) ?? null;
}

/**
 * Build a reasonably robust CSS selector path for an element (max 5 hops).
 * Returns null if the element is part of Markaroo UI.
 * @param el
 */
function getElementSelector(el) {
  if (!el || el.closest('#markaroo-root')) {
    return null;
  }
  const parts = [];
  let current = el;
  while (current && current !== document.body && parts.length < 5) {
    if (current.id) {
      parts.unshift(`#${CSS.escape(current.id)}`);
      break;
    }
    let part = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current.tagName);
      if (siblings.length > 1) {
        part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }
    }
    parts.unshift(part);
    current = current.parentElement;
  }
  return parts.length > 0 ? parts.join(' > ') : null;
}

/**
 * Build CaptureData for a click-to-pin interaction.
 * @param clientX
 * @param clientY
 */
function buildClickCaptureData(clientX, clientY) {
  const {
    xPct,
    yPct
  } = toPagePct(clientX, clientY);
  const el = getPageElementAt(clientX, clientY);
  const selector = getElementSelector(el);
  const elementOffset = el ? toElementOffset(clientX, clientY, el) : null;

  // Derive a crop rect for the "Pinned content" thumbnail: the clicked element's
  // bounds, or a default box centred on the click when no element was hit.
  const rect = el ? (() => {
    const r = el.getBoundingClientRect();
    return toCaptureRect(r.left, r.top, r.width, r.height);
  })() : toCaptureRect(clientX - 150, clientY - 100, 300, 200);
  const screenshotRect = {
    type: 'point',
    selector,
    elementOffset,
    rect,
    annotations: []
  };
  return {
    x: xPct,
    y: yPct,
    viewport: getViewport(),
    screenshotRect
  };
}

/**
 * Build CaptureData for a drag-to-region interaction.
 * @param left
 * @param top
 * @param width
 * @param height
 */
function buildRegionCaptureData(left, top, width, height) {
  const rect = toCaptureRect(left, top, width, height);
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const {
    xPct,
    yPct
  } = toPagePct(centerX, centerY);
  const screenshotRect = {
    type: 'region',
    selector: null,
    elementOffset: null,
    rect,
    annotations: []
  };
  return {
    x: xPct,
    y: yPct,
    viewport: getViewport(),
    screenshotRect
  };
}
function clampPct(v) {
  return Math.round(Math.min(1, Math.max(0, v)) * 10000) / 10000;
}

/***/ },

/***/ "./resources/assets/widget/composer/AttachmentPicker.tsx"
/*!***************************************************************!*\
  !*** ./resources/assets/widget/composer/AttachmentPicker.tsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttachmentPicker: () => (/* binding */ AttachmentPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const BADGE_COLORS = {
  PDF: '#ef4444',
  DOC: '#2563eb',
  DOCX: '#2563eb',
  XLS: '#16a34a',
  XLSX: '#16a34a',
  CSV: '#16a34a',
  TXT: '#6b7280'
};
function isImage(meta) {
  return meta.mime.startsWith('image/');
}
function AttachmentPicker({
  attachments,
  onChange
}) {
  const inputRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [uploading, setUploading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const config = window.markarooConfig;
  async function handleFiles(files) {
    if (!files || files.length === 0) {
      return;
    }
    setError(null);
    setUploading(true);
    const headers = {
      'X-WP-Nonce': config.nonce
    };
    if (config.shareToken) {
      headers['X-Markaroo-Share'] = config.shareToken;
    }
    const results = [...attachments];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      try {
        const res = await fetch(`${config.restUrl}markaroo/v1/attachments`, {
          method: 'POST',
          headers,
          body
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.message ?? `Upload failed (${res.status})`);
          continue;
        }
        const meta = await res.json();
        results.push(meta);
      } catch (e) {
        setError('Upload failed. Please try again.');
      }
    }
    onChange(results);
    setUploading(false);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-attachments",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-attachments__list",
      children: attachments.map(a => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-attachments__item",
        children: [isImage(a) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
          href: a.url,
          target: "_blank",
          rel: "noopener noreferrer",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
            className: "markaroo-attachments__thumb",
            src: a.url,
            alt: a.filename,
            loading: "lazy"
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("a", {
          className: "markaroo-attachments__file",
          href: a.url,
          target: "_blank",
          rel: "noopener noreferrer",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "markaroo-attachments__badge",
            style: {
              backgroundColor: BADGE_COLORS[a.type_badge] ?? '#6366f1'
            },
            children: a.type_badge
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "markaroo-attachments__name",
            children: a.filename
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          className: "markaroo-attachments__remove",
          type: "button",
          "aria-label": "Remove attachment",
          onClick: () => onChange(attachments.filter(x => x.id !== a.id)),
          children: "\xD7"
        })]
      }, a.id))
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-attachments__error",
      role: "alert",
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
      type: "button",
      disabled: uploading,
      onClick: () => inputRef.current?.click(),
      children: uploading ? 'Uploading…' : '+ Attach file'
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
      ref: inputRef,
      type: "file",
      multiple: true,
      hidden: true,
      onChange: e => handleFiles(e.target.files),
      onClick: e => {
        e.target.value = '';
      }
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/composer/ComposerPanel.tsx"
/*!************************************************************!*\
  !*** ./resources/assets/widget/composer/ComposerPanel.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComposerPanel: () => (/* binding */ ComposerPanel),
/* harmony export */   PRIORITIES: () => (/* binding */ PRIORITIES)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MarkdownToolbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MarkdownToolbar */ "./resources/assets/widget/composer/MarkdownToolbar.tsx");
/* harmony import */ var _TagInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagInput */ "./resources/assets/widget/composer/TagInput.tsx");
/* harmony import */ var _AttachmentPicker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AttachmentPicker */ "./resources/assets/widget/composer/AttachmentPicker.tsx");
/* harmony import */ var _thread_MentionAutocomplete__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../thread/MentionAutocomplete */ "./resources/assets/widget/thread/MentionAutocomplete.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _offlineQueue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../offlineQueue */ "./resources/assets/widget/offlineQueue.ts");
/* harmony import */ var _capture_Screenshot__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../capture/Screenshot */ "./resources/assets/widget/capture/Screenshot.ts");
/* harmony import */ var _capture_captureUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../capture/captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var _support_anchor__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../support/anchor */ "./resources/assets/widget/support/anchor.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);












const PRIORITIES = [{
  value: 'urgent',
  label: 'Urgent',
  color: '#ef4444'
}, {
  value: 'high',
  label: 'High',
  color: '#f97316'
}, {
  value: 'normal',
  label: 'Normal',
  color: '#6366f1'
}, {
  value: 'low',
  label: 'Low',
  color: '#9ca3af'
}];
const GUEST_NAME_KEY = 'markaroo_guest_name';
const PANEL_W = 360;
const PANEL_H = 520;
function getViewport() {
  return `${window.innerWidth}x${window.innerHeight}`;
}
function ComposerPanel({
  captureData,
  onSubmitted,
  onCancel
}) {
  const config = window.markarooConfig;
  const isGuest = config.currentUser?.id === 0;
  const defaultPri = config.settings?.['tasks.priority_default'] ?? 'normal';
  const panelRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const textareaRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const enableAssignment = config.settings?.['tasks.enable_assignment'];
  const enableDueDates = config.settings?.['tasks.enable_due_dates'];
  // Default-on: an absent key must never hide the feature (older stored
  // settings won't have tasks.enable_tags yet).
  const enableTags = config.settings?.['tasks.enable_tags'] !== false;
  const canAssign = config.currentUser?.canAssign ?? false;
  // Screenshot capture is opt-in and only offered when enabled in settings.
  const screenshotEnabled = config.screenshotOptions?.enabled ?? true;
  const [title, setTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [comment, setComment] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [priority, setPriority] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultPri);
  const [assigneeId, setAssigneeId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [assigneeName, setAssigneeName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [dueDate, setDueDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [tags, setTags] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [attachments, setAttachments] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [attachScreenshot, setAttachScreenshot] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [guestName, setGuestName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => typeof localStorage !== 'undefined' && localStorage.getItem(GUEST_NAME_KEY) || '');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Mention detection in the comment textarea. Selected user IDs are captured
  // so the backend resolves mentions by ID (a display name with a space can't
  // be matched from the raw text alone).
  const [mentionQuery, setMentionQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [mentionOffset, setMentionOffset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [mentionIds, setMentionIds] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);

  // Anchor the panel next to the selected region.
  const [pos, setPos] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    const r = captureData.screenshotRect.rect;
    const anchor = r ? (0,_support_anchor__WEBPACK_IMPORTED_MODULE_10__.pageRectToViewport)(r.xPct, r.yPct, r.wPct, r.hPct) : {
      left: captureData.x * window.innerWidth,
      top: captureData.y * window.innerHeight,
      width: 0,
      height: 0
    };
    return (0,_support_anchor__WEBPACK_IMPORTED_MODULE_10__.anchorStyle)(anchor, {
      width: PANEL_W,
      height: PANEL_H
    });
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const el = panelRef.current;
    if (!el) {
      return;
    }
    const r = captureData.screenshotRect.rect;
    const anchor = r ? (0,_support_anchor__WEBPACK_IMPORTED_MODULE_10__.pageRectToViewport)(r.xPct, r.yPct, r.wPct, r.hPct) : {
      left: captureData.x * window.innerWidth,
      top: captureData.y * window.innerHeight,
      width: 0,
      height: 0
    };
    setPos((0,_support_anchor__WEBPACK_IMPORTED_MODULE_10__.anchorStyle)(anchor, {
      width: el.offsetWidth,
      height: el.offsetHeight
    }));
  }, [captureData]);

  // Load assignable users once if feature enabled (shared session cache).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!enableAssignment || !canAssign) {
      return;
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_6__.fetchUsers)().then(setUsers).catch(() => null);
  }, [enableAssignment, canAssign]);
  function handleCommentChange(val) {
    setComment(val);
    const ta = textareaRef.current;
    const cursor = ta?.selectionStart ?? val.length;
    const before = val.slice(0, cursor);
    const match = before.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setMentionOffset(match.index ?? 0);
    } else {
      setMentionQuery(null);
    }
  }
  function insertMention(user) {
    const handle = `@${user.name} `;
    const before = comment.slice(0, mentionOffset);
    const after = comment.slice(textareaRef.current?.selectionStart ?? comment.length);
    setComment(before + handle + after);
    setMentionIds(prev => prev.includes(user.id) ? prev : [...prev, user.id]);
    setMentionQuery(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    // Title is the only required field; the comment is optional.
    if (!title.trim()) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title is required.', 'markaroo'));
      return;
    }
    if (isGuest && !guestName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError(null);
    setLoading(true);
    if (isGuest && typeof localStorage !== 'undefined') {
      localStorage.setItem(GUEST_NAME_KEY, guestName.trim());
    }

    // Capture the cropped "Pinned content" image (annotations burned in) and
    // convert to a binary Blob up front, so the offline queue can retry the
    // multipart upload without re-capturing.
    let screenshotBlob = null;
    if (attachScreenshot) {
      const dataUrl = await (0,_capture_Screenshot__WEBPACK_IMPORTED_MODULE_8__.captureCroppedDataUrl)(captureData.screenshotRect.rect, captureData.screenshotRect.annotations);
      if (dataUrl) {
        try {
          screenshotBlob = await (await fetch(dataUrl)).blob();
        } catch {
          screenshotBlob = null;
        }
      }
    }

    // The screenshot is uploaded as a binary multipart request AFTER the
    // feedback row is created — base64-in-JSON is ~33% bigger and forces the
    // server to decode the whole payload inside the create request.
    const payload = {
      comment,
      priority,
      ...(title.trim() ? {
        title: title.trim()
      } : {}),
      page_key: (0,_capture_captureUtils__WEBPACK_IMPORTED_MODULE_9__.getPageKey)(),
      page_url: window.location.href,
      viewport: getViewport(),
      user_agent: navigator.userAgent,
      x: captureData.x,
      y: captureData.y,
      screenshot_rect: captureData.screenshotRect,
      ...(assigneeId ? {
        assigned_to_id: assigneeId,
        assigned_to_name: assigneeName
      } : {}),
      ...(dueDate ? {
        due_date: dueDate
      } : {}),
      ...(tags.length ? {
        tags: JSON.stringify(tags)
      } : {}),
      ...(mentionIds.length ? {
        mention_ids: mentionIds
      } : {}),
      ...(attachments.length ? {
        attachments: JSON.stringify(attachments)
      } : {})
    };
    if (isGuest) {
      payload.author = guestName.trim();
    }
    window.dispatchEvent(new CustomEvent('markaroo:composer-before-submit', {
      detail: {
        payload
      }
    }));
    const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `q-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    try {
      // submitOrQueue owns the create + screenshot upload, and falls back to
      // the offline retry queue on a network error (created items and retried
      // items both dispatch markaroo:feedback-submitted).
      const result = await (0,_offlineQueue__WEBPACK_IMPORTED_MODULE_7__.submitOrQueue)(payload, screenshotBlob, uuid);
      if (result.status === 'created' && result.item) {
        window.dispatchEvent(new CustomEvent('markaroo:feedback-submitted', {
          detail: {
            feedback: result.item
          }
        }));
        onSubmitted(result.item);
      } else {
        // Queued for retry — surface it and close the composer.
        window.dispatchEvent(new CustomEvent('markaroo:feedback-queued', {
          detail: {
            uuid,
            x: captureData.x,
            y: captureData.y
          }
        }));
        onCancel();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    ref: panelRef,
    className: "markaroo-composer markaroo-composer--anchored",
    style: {
      left: pos.left,
      top: pos.top
    },
    role: "dialog",
    "aria-label": "Write feedback",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "markaroo-composer__header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
        className: "markaroo-composer__title",
        children: "Write feedback"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("form", {
      className: "markaroo-composer__form",
      onSubmit: handleSubmit,
      noValidate: true,
      children: [isGuest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
          htmlFor: "markaroo-guest-name",
          children: "Your name"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
          id: "markaroo-guest-name",
          type: "text",
          className: "markaroo-composer__input",
          value: guestName,
          onChange: e => setGuestName(e.target.value),
          placeholder: "Enter your name",
          maxLength: 191,
          required: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "markaroo-composer__field",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
          id: "markaroo-title",
          type: "text",
          className: "markaroo-composer__input",
          value: title,
          onChange: e => setTitle(e.target.value),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add a title', 'markaroo'),
          maxLength: 191,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'markaroo'),
          required: true,
          onKeyDown: e => {
            // Enter in the title must not submit a comment-less form.
            if (e.key === 'Enter') {
              e.preventDefault();
              textareaRef.current?.focus();
            }
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field markaroo-composer__field--comment",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_MarkdownToolbar__WEBPACK_IMPORTED_MODULE_2__.MarkdownToolbar, {
          textareaRef: textareaRef,
          value: comment,
          onChange: setComment
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "markaroo-composer__input-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("textarea", {
            ref: textareaRef,
            id: "markaroo-comment",
            className: "markaroo-composer__textarea",
            value: comment,
            onChange: e => handleCommentChange(e.target.value),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the issue (optional)…', 'markaroo'),
            rows: 4,
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feedback comment', 'markaroo')
          }), mentionQuery !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_thread_MentionAutocomplete__WEBPACK_IMPORTED_MODULE_5__.MentionAutocomplete, {
            query: mentionQuery,
            onSelect: insertMention,
            onClose: () => setMentionQuery(null)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
          htmlFor: "markaroo-priority",
          children: "Priority"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("select", {
          id: "markaroo-priority",
          className: "markaroo-composer__select",
          value: priority,
          onChange: e => setPriority(e.target.value),
          children: PRIORITIES.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: p.value,
            children: p.label
          }, p.value))
        })]
      }), enableAssignment && canAssign && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
          htmlFor: "markaroo-assignee",
          children: "Assign to"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select", {
          id: "markaroo-assignee",
          className: "markaroo-composer__select",
          value: assigneeId,
          onChange: e => {
            const id = Number(e.target.value);
            setAssigneeId(id);
            setAssigneeName(users.find(u => u.id === id)?.name ?? '');
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: "0",
            children: "Unassigned"
          }), users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: u.id,
            children: u.name
          }, u.id))]
        })]
      }), enableDueDates && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
          htmlFor: "markaroo-due",
          children: "Due date"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
          id: "markaroo-due",
          type: "date",
          className: "markaroo-composer__input",
          value: dueDate,
          onChange: e => setDueDate(e.target.value)
        })]
      }), enableTags && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
          className: "markaroo-composer__label",
          children: "Tags"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_TagInput__WEBPACK_IMPORTED_MODULE_3__.TagInput, {
          tags: tags,
          onChange: setTags
        })]
      }), screenshotEnabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field markaroo-composer__field--check",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
          id: "markaroo-attach-shot",
          type: "checkbox",
          checked: attachScreenshot,
          onChange: e => setAttachScreenshot(e.target.checked)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
          htmlFor: "markaroo-attach-shot",
          className: "markaroo-composer__checkbox",
          children: "Attach screenshot"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
          className: "markaroo-composer__label",
          children: "Attach files"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_AttachmentPicker__WEBPACK_IMPORTED_MODULE_4__.AttachmentPicker, {
          attachments: attachments,
          onChange: setAttachments
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "markaroo-composer__error",
        role: "alert",
        children: error
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-composer__actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          type: "submit",
          className: "markaroo-iconbtn markaroo-iconbtn--primary",
          "aria-label": "Save feedback",
          disabled: loading,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
              d: "M5 13l4 4L19 7"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          type: "button",
          className: "markaroo-iconbtn markaroo-iconbtn--ghost",
          "aria-label": "Cancel",
          onClick: onCancel,
          disabled: loading,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
              d: "M6 6l12 12M18 6L6 18"
            })
          })
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/composer/MarkdownToolbar.tsx"
/*!**************************************************************!*\
  !*** ./resources/assets/widget/composer/MarkdownToolbar.tsx ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MarkdownToolbar: () => (/* binding */ MarkdownToolbar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Shared SVG wrapper so every toolbar glyph has identical weight and size.
 * @param root0
 * @param root0.children
 */
function Icon({
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: children
  });
}
const ACTIONS = [{
  label: 'Bold',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"
    })
  }),
  apply: s => ({
    text: `**${s || 'bold'}**`,
    offset: s ? 0 : -2
  })
}, {
  label: 'Italic',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M10 5h8M6 19h8M14 5l-4 14"
    })
  }),
  apply: s => ({
    text: `*${s || 'italic'}*`,
    offset: s ? 0 : -1
  })
}, {
  label: 'Bullet list',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Icon, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M9 6h11M9 12h11M9 18h11"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "4.5",
      cy: "6",
      r: "1",
      fill: "currentColor",
      stroke: "none"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "4.5",
      cy: "12",
      r: "1",
      fill: "currentColor",
      stroke: "none"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "4.5",
      cy: "18",
      r: "1",
      fill: "currentColor",
      stroke: "none"
    })]
  }),
  apply: s => ({
    text: `\n- ${s || 'item'}`,
    offset: s ? 0 : 0
  })
}, {
  label: 'Numbered list',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M10 6h10M10 12h10M10 18h10M4 5v3M3 8h2M3 15h2a1 1 0 0 1 0 2H3.5M3 19h2"
    })
  }),
  apply: s => ({
    text: `\n1. ${s || 'item'}`,
    offset: s ? 0 : 0
  })
}, {
  label: 'Link',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M9 15l6-6M10.5 6.5l1.7-1.7a4 4 0 0 1 5.7 5.7l-1.7 1.7M13.5 17.5l-1.7 1.7a4 4 0 0 1-5.7-5.7l1.7-1.7"
    })
  }),
  apply: s => ({
    text: `[${s || 'text'}](url)`,
    offset: s ? -1 - 3 : -1 - 3
  })
}, {
  label: 'Code',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M9 8l-4 4 4 4M15 8l4 4-4 4"
    })
  }),
  apply: s => ({
    text: `\`${s || 'code'}\``,
    offset: s ? 0 : -1
  })
}];
function MarkdownToolbar({
  textareaRef,
  value,
  onChange
}) {
  function applyAction(action) {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const {
      text,
      offset
    } = action.apply(selected);
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);

    // Restore cursor after React re-renders.
    requestAnimationFrame(() => {
      const cursor = start + text.length + offset;
      el.setSelectionRange(cursor, cursor);
      el.focus();
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: "markaroo-composer-toolbar",
    role: "toolbar",
    "aria-label": "Markdown toolbar",
    children: ACTIONS.map(action => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
      type: "button",
      className: "markaroo-composer-toolbar__btn",
      title: action.label,
      "aria-label": action.label,
      onMouseDown: e => {
        // Prevent textarea from losing focus.
        e.preventDefault();
        applyAction(action);
      },
      children: action.icon
    }, action.label))
  });
}

/***/ },

/***/ "./resources/assets/widget/composer/TagInput.tsx"
/*!*******************************************************!*\
  !*** ./resources/assets/widget/composer/TagInput.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TagInput: () => (/* binding */ TagInput)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function TagInput({
  tags,
  onChange
}) {
  const [input, setInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const cfg = window.markarooConfig;
  const available = cfg?.settings?.['tasks.available_tags'] ?? [];
  function addTag(tag) {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      onChange([...tags, t]);
    }
    setInput('');
  }
  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-tag-input",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "markaroo-tag-input__chips",
      children: [tags.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
        className: "markaroo-tag-input__chip",
        children: [t, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          className: "markaroo-tag-input__remove",
          "aria-label": `Remove ${t}`,
          onClick: () => onChange(tags.filter(x => x !== t)),
          children: "\xD7"
        })]
      }, t)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
        className: "markaroo-tag-input__field",
        type: "text",
        placeholder: tags.length ? '' : 'Add tags…',
        value: input,
        list: "markaroo-tag-suggestions",
        onChange: e => setInput(e.target.value),
        onKeyDown: handleKey,
        onBlur: () => {
          if (input) {
            addTag(input);
          }
        }
      })]
    }), available.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("datalist", {
      id: "markaroo-tag-suggestions",
      children: available.filter(t => !tags.includes(t)).map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
        value: t
      }, t))
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/offlineQueue.ts"
/*!*************************************************!*\
  !*** ./resources/assets/widget/offlineQueue.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getQueuedEntries: () => (/* binding */ getQueuedEntries),
/* harmony export */   submitOrQueue: () => (/* binding */ submitOrQueue)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./resources/assets/widget/api.ts");

/**
 * Offline-tolerant feedback submission.
 *
 * If POST /feedback fails because of a network error (flaky client wifi mid
 * review), the payload metadata is kept in sessionStorage and retried with
 * exponential backoff. Screenshot Blobs stay in memory only — never serialized.
 * The queue is capped so a long offline spell can't grow without bound.
 */

const QUEUE_KEY = 'markaroo_submit_queue';
const MAX_QUEUE = 5;
const MAX_ATTEMPTS = 6;
// Screenshot Blobs are held here, keyed by entry uuid. They are intentionally
// NOT persisted to sessionStorage (Blobs don't serialize and would bloat it).
const blobs = new Map();
let retryTimer = null;
function readQueue() {
  try {
    const raw = sessionStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeQueue(queue) {
  try {
    sessionStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* sessionStorage may be unavailable (private mode) — degrade to no queue */
  }
  window.dispatchEvent(new CustomEvent('markaroo:queue-changed', {
    detail: {
      size: queue.length
    }
  }));
}

/** Public: current queued entries (for a "queued" UI indicator). */
function getQueuedEntries() {
  return readQueue();
}
function isNetworkError(err) {
  // apiFetch throws a plain Error(message) for HTTP errors; a genuine offline
  // fetch rejects with a TypeError before any response.
  if (err instanceof TypeError) {
    return true;
  }
  const msg = err instanceof Error ? err.message : '';
  return /failed to fetch|networkerror|load failed/i.test(msg);
}
async function uploadScreenshot(item, blob) {
  if (!blob) {
    return item;
  }
  try {
    const form = new FormData();
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    form.append('screenshot', blob, `markaroo-${item.id}.${ext}`);
    const shot = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.apiPostForm)(`feedback/${item.id}/screenshot`, form);
    item.screenshot_id = shot.screenshot_id;
    item.screenshot_url = shot.screenshot_url;
  } catch {
    // Pin renders without a thumbnail; non-fatal.
  }
  return item;
}
function announceRestored(item) {
  // A queued item finally went through (the composer is long gone), so the
  // widget adds it to state via this event. The immediate-create path instead
  // returns the item to the composer, which updates state directly.
  window.dispatchEvent(new CustomEvent('markaroo:feedback-restored', {
    detail: {
      feedback: item
    }
  }));
  window.dispatchEvent(new CustomEvent('markaroo:feedback-submitted', {
    detail: {
      feedback: item
    }
  }));
}
function enqueue(uuid, payload, blob) {
  const queue = readQueue();

  // Cap the queue: drop the oldest entry (and its in-memory blob) when full.
  while (queue.length >= MAX_QUEUE) {
    const dropped = queue.shift();
    if (dropped) {
      blobs.delete(dropped.uuid);
    }
  }
  queue.push({
    uuid,
    payload,
    attempts: 0
  });
  if (blob) {
    blobs.set(uuid, blob);
  }
  writeQueue(queue);
  scheduleRetry(0);
}
function backoffMs(attempts) {
  // 2s, 4s, 8s, … capped at ~1min.
  return Math.min(60000, 2000 * 2 ** attempts);
}
function scheduleRetry(delay) {
  if (retryTimer !== null) {
    return;
  }
  retryTimer = window.setTimeout(() => {
    retryTimer = null;
    processQueue();
  }, delay);
}
async function processQueue() {
  const queue = readQueue();
  if (queue.length === 0) {
    return;
  }
  const entry = queue[0];
  try {
    const item = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.apiPost)('feedback', entry.payload);
    await uploadScreenshot(item, blobs.get(entry.uuid) ?? null);

    // Success — remove from queue and free the blob.
    blobs.delete(entry.uuid);
    writeQueue(readQueue().filter(e => e.uuid !== entry.uuid));
    announceRestored(item);

    // Keep draining.
    scheduleRetry(0);
  } catch (err) {
    if (isNetworkError(err) && entry.attempts + 1 < MAX_ATTEMPTS) {
      // Still offline — bump attempts and back off.
      const next = readQueue().map(e => e.uuid === entry.uuid ? {
        ...e,
        attempts: e.attempts + 1
      } : e);
      writeQueue(next);
      scheduleRetry(backoffMs(entry.attempts + 1));
    } else {
      // Permanent failure (HTTP error) or gave up — drop it so it can't wedge
      // the queue, and surface the loss.
      blobs.delete(entry.uuid);
      writeQueue(readQueue().filter(e => e.uuid !== entry.uuid));
      window.dispatchEvent(new CustomEvent('markaroo:queue-dropped', {
        detail: {
          uuid: entry.uuid
        }
      }));
      scheduleRetry(0);
    }
  }
}
/**
 * Create feedback, falling back to the offline queue on a network error.
 * HTTP errors (validation, auth) reject as before so the composer shows them.
 *
 * @param payload        The feedback create payload.
 * @param screenshotBlob Optional screenshot Blob to upload after create.
 * @param uuid           Client-generated id used to key the queue entry.
 * @return The submission result: created (with item) or queued.
 */
async function submitOrQueue(payload, screenshotBlob, uuid) {
  try {
    const item = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.apiPost)('feedback', payload);
    await uploadScreenshot(item, screenshotBlob);
    return {
      status: 'created',
      item
    };
  } catch (err) {
    if (isNetworkError(err)) {
      enqueue(uuid, payload, screenshotBlob);
      return {
        status: 'queued',
        uuid
      };
    }
    throw err;
  }
}

// Retry the queue when the browser regains connectivity.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => scheduleRetry(0));
}

/***/ },

/***/ "./resources/assets/widget/pins/ClusterMarker.tsx"
/*!********************************************************!*\
  !*** ./resources/assets/widget/pins/ClusterMarker.tsx ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClusterMarker: () => (/* binding */ ClusterMarker)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


/**
 * A single marker standing in for a group of nearby pins. Clicking it expands
 * the cluster to its member pins. Memoized so unrelated pin changes don't
 * re-render every cluster.
 */
const ClusterMarker = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.memo)(function ClusterMarker({
  clusterKey,
  count,
  left,
  top,
  dimmed,
  onExpand
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
    type: "button",
    className: `markaroo-pin markaroo-pin--cluster${dimmed ? ' markaroo-pin--dimmed' : ''}`,
    style: {
      left: `${left}px`,
      top: `${top}px`
    },
    onClick: () => onExpand(clusterKey),
    "aria-label": `${count} feedback pins — click to expand`,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-pin__badge",
      children: count
    })
  });
});

/***/ },

/***/ "./resources/assets/widget/pins/PinLayer.tsx"
/*!***************************************************!*\
  !*** ./resources/assets/widget/pins/PinLayer.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PinLayer: () => (/* binding */ PinLayer)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _PinMarker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PinMarker */ "./resources/assets/widget/pins/PinMarker.tsx");
/* harmony import */ var _ClusterMarker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ClusterMarker */ "./resources/assets/widget/pins/ClusterMarker.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _capture_captureUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../capture/captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var _support_pinNumbers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../support/pinNumbers */ "./resources/assets/widget/support/pinNumbers.ts");
/* harmony import */ var _support_status__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../support/status */ "./resources/assets/widget/support/status.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









function docSize() {
  const d = document.documentElement;
  return {
    w: d.scrollWidth,
    h: d.scrollHeight
  };
}

// Cluster pins once a page gets crowded; below this they render individually.
const CLUSTER_THRESHOLD = 30;
// Grid cell size (document px) used to group nearby pins into one marker.
const CLUSTER_CELL = 64;
function buildClusters(items, pageW, pageH) {
  const buckets = new Map();
  for (const item of items) {
    const px = item.x * pageW;
    const py = item.y * pageH;
    const key = `${Math.floor(px / CLUSTER_CELL)}_${Math.floor(py / CLUSTER_CELL)}`;
    const arr = buckets.get(key);
    if (arr) {
      arr.push(item);
    } else {
      buckets.set(key, [item]);
    }
  }
  const clusters = [];
  buckets.forEach((bucketItems, key) => {
    const cx = bucketItems.reduce((s, i) => s + i.x, 0) / bucketItems.length * pageW;
    const cy = bucketItems.reduce((s, i) => s + i.y, 0) / bucketItems.length * pageH;
    clusters.push({
      key,
      items: bucketItems,
      cx,
      cy
    });
  });
  return clusters;
}
function PinLayer() {
  const {
    feedbacks,
    enabled,
    captureState,
    activePinId,
    mode,
    statusFilter
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_4__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_4__.useWidgetDispatch)();
  const loadedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(docSize);
  const [expanded, setExpanded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => new Set());

  // Keep document dimensions current so pin pixel positions track reflow/resize.
  // ResizeObserver fires only on real layout changes; the 1s interval is kept
  // solely as a fallback for environments without it.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function update() {
      setPage(prev => {
        const next = docSize();
        return prev.w === next.w && prev.h === next.h ? prev : next;
      });
    }
    update();
    window.addEventListener('resize', update);
    let observer = null;
    let intervalId = 0;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update);
      observer.observe(document.documentElement);
      if (document.body) {
        observer.observe(document.body);
      }
    } else {
      intervalId = window.setInterval(update, 1000);
    }
    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [feedbacks.length]);

  // Load page feedback the first time the session is enabled (Annotix-style:
  // nothing is fetched or shown until the user enters feedback mode).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (loadedRef.current || !enabled || mode === 'clean') {
      return;
    }
    loadedRef.current = true;
    (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiFetch)(`feedback?page_key=${encodeURIComponent((0,_capture_captureUtils__WEBPACK_IMPORTED_MODULE_5__.getPageKey)())}&per_page=100`).then(res => dispatch({
      type: 'FEEDBACKS_LOADED',
      items: res.data
    })).catch(() => null);
  }, [enabled, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll the active pin into view so its anchored card is visible.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (activePinId === null) {
      return;
    }
    const item = feedbacks.find(f => f.id === activePinId);
    if (!item) {
      return;
    }
    const targetY = item.y * page.h;
    if (targetY < window.scrollY + 40 || targetY > window.scrollY + window.innerHeight - 40) {
      window.scrollTo({
        top: Math.max(0, targetY - window.innerHeight / 3),
        behavior: 'smooth'
      });
    }
  }, [activePinId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable, id-taking callbacks (latest state read through refs) so the
  // memoized PinMarkers don't all re-render whenever one pin changes.
  const activePinRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(activePinId);
  activePinRef.current = activePinId;
  const handlePinClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(id => {
    dispatch({
      type: 'SET_ACTIVE_PIN',
      id: activePinRef.current === id ? null : id
    });
    window.dispatchEvent(new CustomEvent('markaroo:pin-opened', {
      detail: {
        id
      }
    }));
  }, [dispatch]);
  const handlePinMove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (id, x, y) => {
    try {
      const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiPatch)(`feedback/${id}`, {
        x,
        y
      });
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
      window.dispatchEvent(new CustomEvent('markaroo:pin-moved', {
        detail: {
          id,
          x,
          y
        }
      }));
    } catch {
      // Position revert happens via state (no change dispatched).
    }
  }, [dispatch]);
  const handleExpandCluster = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(key => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  // 1-based display number per feedback — from the FULL list so numbers match
  // the panel and stay stable when the status filter changes.
  const numberById = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_support_pinNumbers__WEBPACK_IMPORTED_MODULE_6__.pinNumbers)(feedbacks), [feedbacks]);

  // On-page pins follow the panel's Unresolved/Resolved tab.
  const visible = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => feedbacks.filter(f => statusFilter === 'resolved' ? (0,_support_status__WEBPACK_IMPORTED_MODULE_7__.isResolvedTab)(f) : (0,_support_status__WEBPACK_IMPORTED_MODULE_7__.isUnresolvedTab)(f)), [feedbacks, statusFilter]);
  const clusters = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => visible.length > CLUSTER_THRESHOLD ? buildClusters(visible, page.w, page.h) : null, [visible, page.w, page.h]);
  if (!enabled || mode === 'clean' || visible.length === 0) {
    return null;
  }
  function renderMarker(item) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_PinMarker__WEBPACK_IMPORTED_MODULE_1__.PinMarker, {
      item: item,
      number: numberById.get(item.id) ?? 0,
      dimmed: captureState === 'active',
      active: activePinId === item.id,
      canDrag: mode === 'comment',
      pageW: page.w,
      pageH: page.h,
      onClick: handlePinClick,
      onMove: handlePinMove
    }, item.id);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    className: "markaroo-pin-layer",
    "aria-label": "Feedback pins",
    children: clusters ? clusters.map(c => c.items.length === 1 || expanded.has(c.key) ? c.items.map(renderMarker) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ClusterMarker__WEBPACK_IMPORTED_MODULE_2__.ClusterMarker, {
      clusterKey: c.key,
      count: c.items.length,
      left: c.cx,
      top: c.cy,
      dimmed: captureState === 'active',
      onExpand: handleExpandCluster
    }, c.key)) : visible.map(renderMarker)
  });
}

/***/ },

/***/ "./resources/assets/widget/pins/PinMarker.tsx"
/*!****************************************************!*\
  !*** ./resources/assets/widget/pins/PinMarker.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PinMarker: () => (/* binding */ PinMarker)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _support_Avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../support/Avatar */ "./resources/assets/widget/support/Avatar.tsx");
/* harmony import */ var _support_timeAgo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../support/timeAgo */ "./resources/assets/widget/support/timeAgo.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
// Memoized (with id-taking stable callbacks from PinLayer) so a state change
// for one pin doesn't re-render every sibling marker.
const PinMarker = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.memo)(function PinMarker({
  item,
  number,
  dimmed,
  active,
  canDrag,
  pageW,
  pageH,
  onClick,
  onMove
}) {
  const pinRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const dragRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [dragging, setDragging] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [localX, setLocalX] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(item.x);
  const [localY, setLocalY] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(item.y);

  // Hover preview: small delay so quick pointer passes don't flash tooltips.
  // Rendered through a portal into #markaroo-root — the pin button itself is
  // rotated (teardrop shape), which would rotate any child tooltip with it.
  const [preview, setPreview] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const hoverTimer = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  function showPreview() {
    if (active || dragging || hoverTimer.current) {
      return;
    }
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      const rect = pinRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      // Flip to the left when the pin sits near the right viewport edge.
      const flip = rect.right > window.innerWidth - 290;
      setPreview({
        left: flip ? rect.left - 6 : rect.right + 6,
        top: rect.top - 2,
        flip
      });
    }, 150);
  }
  function hidePreview() {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setPreview(null);
  }
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
      }
    };
  }, []);

  // Sync if item updates from outside.
  if (!dragging && (localX !== item.x || localY !== item.y)) {
    setLocalX(item.x);
    setLocalY(item.y);
  }
  const color = item.status === 'resolved' ? '#22c55e' : PRIORITY_COLORS[item.priority] ?? '#6366f1';
  // Document-pixel position so the pin sticks to page content and scrolls with it.
  const pinLeft = `${localX * pageW}px`;
  const pinTop = `${localY * pageH}px`;
  function handlePointerDown(e) {
    if (!canDrag) {
      return;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {} // synthetic/stale pointers have no capturable id
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      pinX: localX,
      pinY: localY
    };
    setDragging(false);
  }
  function handlePointerMove(e) {
    if (!dragRef.current) {
      return;
    }
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      setDragging(true);
    }
    if (dragging || Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      const newX = Math.min(1, Math.max(0, dragRef.current.pinX + dx / pageW));
      const newY = Math.min(1, Math.max(0, dragRef.current.pinY + dy / pageH));
      setLocalX(newX);
      setLocalY(newY);
    }
  }
  function handlePointerUp() {
    if (!dragRef.current) {
      return;
    }
    const wasDragging = dragging;
    dragRef.current = null;
    setDragging(false);
    if (wasDragging) {
      onMove(item.id, localX, localY);
    } else {
      onClick(item.id);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
    ref: pinRef,
    className: ['markaroo-pin', active ? 'markaroo-pin--active' : '', dimmed ? 'markaroo-pin--dimmed' : '', dragging ? 'markaroo-pin--dragging' : '', item.status === 'resolved' ? 'markaroo-pin--resolved' : ''].filter(Boolean).join(' '),
    style: {
      left: pinLeft,
      top: pinTop,
      '--pin-color': color
    },
    "aria-label": `Feedback #${number}: ${(item.title || item.comment).slice(0, 60)}`,
    "aria-pressed": active,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onMouseEnter: showPreview,
    onMouseLeave: hidePreview,
    onFocus: showPreview,
    onBlur: hidePreview,
    onClick: hidePreview,
    type: "button",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "markaroo-pin__badge",
      children: number
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "markaroo-pin__priority-dot"
    }), preview && !active && !dragging && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createPortal)(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
      className: `markaroo-pin-preview${preview.flip ? ' markaroo-pin-preview--left' : ''}`,
      style: {
        left: preview.left,
        top: preview.top
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
        className: "markaroo-pin-preview__meta",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_support_Avatar__WEBPACK_IMPORTED_MODULE_1__.Avatar, {
          name: item.author,
          src: item.avatar,
          size: 24
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "markaroo-pin-preview__author",
          children: item.author
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "markaroo-pin-preview__time",
          children: (0,_support_timeAgo__WEBPACK_IMPORTED_MODULE_2__.timeAgo)(item.created_at)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "markaroo-pin-preview__text",
        children: item.title || item.comment.slice(0, 60)
      })]
    }), document.getElementById('markaroo-root') ?? document.body)]
  });
});

/***/ },

/***/ "./resources/assets/widget/pins/QueuedPins.tsx"
/*!*****************************************************!*\
  !*** ./resources/assets/widget/pins/QueuedPins.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QueuedPins: () => (/* binding */ QueuedPins)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _offlineQueue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../offlineQueue */ "./resources/assets/widget/offlineQueue.ts");
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function docSize() {
  const d = document.documentElement;
  return {
    w: d.scrollWidth,
    h: d.scrollHeight
  };
}
function readQueued() {
  return (0,_offlineQueue__WEBPACK_IMPORTED_MODULE_2__.getQueuedEntries)().map(e => ({
    uuid: e.uuid,
    x: Number(e.payload.x ?? 0),
    y: Number(e.payload.y ?? 0)
  }));
}

/**
 * Non-interactive "queued" markers for feedback that failed to submit and is
 * waiting in the offline retry queue. They disappear as the queue drains.
 */
function QueuedPins() {
  const {
    enabled,
    mode
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__.useWidget)();
  const [pins, setPins] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(readQueued);
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(docSize);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function refresh() {
      setPins(readQueued());
      setPage(docSize());
    }
    refresh();
    window.addEventListener('markaroo:queue-changed', refresh);
    window.addEventListener('markaroo:queue-dropped', refresh);
    return () => {
      window.removeEventListener('markaroo:queue-changed', refresh);
      window.removeEventListener('markaroo:queue-dropped', refresh);
    };
  }, []);
  if (!enabled || mode === 'clean' || pins.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "markaroo-pin-layer markaroo-pin-layer--queued",
    "aria-hidden": "true",
    children: pins.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      className: "markaroo-pin markaroo-pin--queued",
      style: {
        left: `${p.x * page.w}px`,
        top: `${p.y * page.h}px`
      },
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Queued — will submit when back online', 'markaroo'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "markaroo-pin__badge",
        children: "\u22EF"
      })
    }, p.uuid))
  });
}

/***/ },

/***/ "./resources/assets/widget/registry.ts"
/*!*********************************************!*\
  !*** ./resources/assets/widget/registry.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initRegistry: () => (/* binding */ initRegistry)
/* harmony export */ });
/**
 * window.markaroo — JS extension registry for the third-party code.
 *
 * Usage:
 *
 *   window.markaroo.registerComposerField({
 *     id: 'sprint', label: 'Sprint', render: (props) => <SprintField {...props} />,
 *   });
 *
 *   window.markaroo.registerAnnotationTool({
 *     id: 'blur', icon: '...',
 *     draw: (ctx, from, to) => { ... },
 *   });
 *
 *   window.markaroo.registerAdminTab({
 *     id: 'reports', label: 'Reports', render: () => <ReportsView />,
 *   });
 *
 *   window.markaroo.registerPinRenderer({
 *     id: 'custom', render: (feedback) => <CustomPin feedback={feedback} />,
 *   });
 */

function initRegistry() {
  if (window.markaroo) {
    return;
  }
  const registry = {
    version: '1.0.0',
    composerFields: [],
    annotationTools: [],
    adminTabs: [],
    pinRenderers: [],
    registerComposerField(def) {
      if (!registry.composerFields.find(f => f.id === def.id)) {
        registry.composerFields.push(def);
      }
    },
    registerAnnotationTool(def) {
      if (!registry.annotationTools.find(t => t.id === def.id)) {
        registry.annotationTools.push(def);
      }
    },
    registerAdminTab(def) {
      if (!registry.adminTabs.find(t => t.id === def.id)) {
        registry.adminTabs.push(def);
      }
    },
    registerPinRenderer(def) {
      if (!registry.pinRenderers.find(r => r.id === def.id)) {
        registry.pinRenderers.push(def);
      }
    }
  };
  window.markaroo = registry;
}

/***/ },

/***/ "./resources/assets/widget/store/WidgetContext.tsx"
/*!*********************************************************!*\
  !*** ./resources/assets/widget/store/WidgetContext.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WidgetProvider: () => (/* binding */ WidgetProvider),
/* harmony export */   useWidget: () => (/* binding */ useWidget),
/* harmony export */   useWidgetDispatch: () => (/* binding */ useWidgetDispatch),
/* harmony export */   widgetReducer: () => (/* binding */ widgetReducer)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const initialState = {
  mode: 'comment',
  enabled: false,
  captureState: 'idle',
  capturePhase: 'idle',
  captureData: null,
  panelOpen: false,
  activePinId: null,
  statusFilter: 'open',
  feedbacks: []
};
function widgetReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode
      };

    // Enter feedback mode: reveal pins and auto-open the list panel.
    case 'ENABLE_SESSION':
      return {
        ...state,
        enabled: true,
        panelOpen: true
      };

    // Exit feedback mode: hide pins/panel/cards and abort any capture.
    case 'DISABLE_SESSION':
      return {
        ...state,
        enabled: false,
        panelOpen: false,
        activePinId: null,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null
      };

    // Panel stays open during capture — the user can browse pins while placing.
    case 'START_CAPTURE':
      return {
        ...state,
        captureState: 'active',
        capturePhase: 'selecting',
        captureData: null,
        activePinId: null
      };

    // Region/click confirmed (annotations already merged into screenshotRect).
    // Goes straight to composing — annotation happens live during 'selecting'.
    case 'PIN_PLACED':
      return {
        ...state,
        capturePhase: 'composing',
        captureData: action.data
      };

    // Cancelled capture: return to the list panel (it auto-hid on START_CAPTURE).
    case 'END_CAPTURE':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        panelOpen: state.enabled
      };

    // New feedback is always open — snap the filter back so the new pin is visible.
    case 'FEEDBACK_SUBMITTED':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        activePinId: action.item.id,
        statusFilter: 'open',
        feedbacks: [action.item, ...state.feedbacks]
      };
    case 'FEEDBACKS_LOADED':
      return {
        ...state,
        feedbacks: action.items
      };
    case 'FEEDBACK_UPDATED':
      return {
        ...state,
        feedbacks: state.feedbacks.map(f => f.id === action.item.id ? action.item : f)
      };
    case 'FEEDBACK_DELETED':
      return {
        ...state,
        feedbacks: state.feedbacks.filter(f => f.id !== action.id),
        activePinId: state.activePinId === action.id ? null : state.activePinId
      };
    case 'OPEN_PANEL':
      return {
        ...state,
        panelOpen: true
      };
    case 'CLOSE_PANEL':
      return {
        ...state,
        panelOpen: false
      };
    case 'TOGGLE_PANEL':
      return {
        ...state,
        panelOpen: !state.panelOpen
      };
    case 'SET_ACTIVE_PIN':
      return {
        ...state,
        activePinId: action.id
      };

    // Panel tab; the pin layer filters on-page markers by the same value.
    case 'SET_STATUS_FILTER':
      return {
        ...state,
        statusFilter: action.filter,
        activePinId: null
      };
    default:
      return state;
  }
}
const WidgetStateContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(initialState);
const WidgetDispatchContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(() => {});
function WidgetProvider({
  children,
  initialMode = 'comment'
}) {
  const [state, dispatch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useReducer)(widgetReducer, {
    ...initialState,
    mode: initialMode
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(WidgetStateContext.Provider, {
    value: state,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(WidgetDispatchContext.Provider, {
      value: dispatch,
      children: children
    })
  });
}
function useWidget() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(WidgetStateContext);
}
function useWidgetDispatch() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(WidgetDispatchContext);
}

/***/ },

/***/ "./resources/assets/widget/support/Avatar.tsx"
/*!****************************************************!*\
  !*** ./resources/assets/widget/support/Avatar.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Avatar: () => (/* binding */ Avatar),
/* harmony export */   initials: () => (/* binding */ initials)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function initials(name) {
  return name.trim().split(/\s+/).map(p => p[0] ?? '').slice(0, 2).join('').toUpperCase() || '?';
}
/**
 * Author avatar image with initials-chip fallback for guests/broken URLs.
 * @param root0
 * @param root0.name
 * @param root0.src
 * @param root0.size
 */
function Avatar({
  name,
  src,
  size = 24
}) {
  const [failed, setFailed] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const cls = `markaroo-avatar markaroo-avatar--${size}`;
  if (src && !failed) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
      className: cls,
      src: src,
      alt: "",
      "aria-hidden": "true",
      width: size,
      height: size,
      loading: "lazy",
      onError: () => setFailed(true)
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: `${cls} markaroo-avatar--initials`,
    "aria-hidden": "true",
    children: initials(name)
  });
}

/***/ },

/***/ "./resources/assets/widget/support/anchor.ts"
/*!***************************************************!*\
  !*** ./resources/assets/widget/support/anchor.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anchorStyle: () => (/* binding */ anchorStyle),
/* harmony export */   pageRectToViewport: () => (/* binding */ pageRectToViewport)
/* harmony export */ });
/**
 * Position floating panels (composer / pin card) next to an on-page anchor.
 *
 * Everything is in viewport (fixed) coordinates. We prefer the right side of the
 * anchor, flip to the left when there isn't room, and clamp to the viewport so the
 * panel is never cut off. Returns inline styles for a `position: fixed` element.
 */

const GAP = 8;
const MARGIN = 12;
function anchorStyle(anchor, panel, opts = {}) {
  const vh = window.innerHeight;
  const maxRight = opts.maxRight ?? document.documentElement.clientWidth;
  const minLeft = opts.minLeft ?? MARGIN;

  // Horizontal: hug the anchor — prefer its right side, else flip to its left.
  // Never jump to a far edge: staying adjacent to the pin beats staying fully
  // clear of the sidebar reserve.
  let left = anchor.left + anchor.width + GAP;
  if (left + panel.width + MARGIN > maxRight) {
    left = Math.max(minLeft, anchor.left - panel.width - GAP);
  }

  // Vertical: align near the anchor top, clamp into the viewport.
  let top = anchor.top;
  if (top + panel.height + MARGIN > vh) {
    top = Math.max(MARGIN, vh - panel.height - MARGIN);
  }
  if (top < MARGIN) {
    top = MARGIN;
  }
  return {
    left: Math.round(left),
    top: Math.round(top)
  };
}

/**
 * Convert a page-percentage rect to a viewport-px AnchorRect (accounts for scroll).
 * @param xPct
 * @param yPct
 * @param wPct
 * @param hPct
 */
function pageRectToViewport(xPct, yPct, wPct, hPct) {
  const totalW = document.documentElement.scrollWidth;
  const totalH = document.documentElement.scrollHeight;
  return {
    left: xPct * totalW - window.scrollX,
    top: yPct * totalH - window.scrollY,
    width: wPct * totalW,
    height: hPct * totalH
  };
}

/***/ },

/***/ "./resources/assets/widget/support/pinNumbers.ts"
/*!*******************************************************!*\
  !*** ./resources/assets/widget/support/pinNumbers.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pinNumbers: () => (/* binding */ pinNumbers)
/* harmony export */ });
/**
 * Map of feedback id to its 1-based display number, ranked by creation order
 * (oldest = #1). Ranking uses the autoincrement `id` rather than the array
 * position, so numbers stay correct regardless of the order the REST list
 * returns items in, and stay stable when a new item is prepended.
 * @param items
 */
function pinNumbers(items) {
  const map = new Map();
  [...items].sort((a, b) => a.id - b.id).forEach((item, i) => map.set(item.id, i + 1));
  return map;
}

/***/ },

/***/ "./resources/assets/widget/support/renderMarkdown.tsx"
/*!************************************************************!*\
  !*** ./resources/assets/widget/support/renderMarkdown.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseInline: () => (/* binding */ parseInline),
/* harmony export */   renderMarkdown: () => (/* binding */ renderMarkdown),
/* harmony export */   stripMarkdown: () => (/* binding */ stripMarkdown)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

// Only these schemes are honored for links; anything else renders as literal
// text so a `[x](javascript:…)` can never become a live href.
const SAFE_URL = /^(https?:|mailto:)/i;

/**
 * Parse the inline markdown the composer toolbar emits — `code`, **bold**,
 * *italic*, [text](url) — into React nodes. Plain runs stay as strings, which
 * React escapes, so untrusted input can never inject markup.
 *
 * Exported for the unit test; prefer renderMarkdown() in components.
 * @param text    One line of markdown.
 * @param keyBase Stable key prefix for the produced elements.
 */
function parseInline(text, keyBase) {
  const nodes = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let i = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const key = `${keyBase}-${i++}`;
    if (m[1] !== undefined) {
      nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('code', {
        key
      }, m[1]));
    } else if (m[2] !== undefined) {
      nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('strong', {
        key
      }, m[2]));
    } else if (m[3] !== undefined) {
      nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('em', {
        key
      }, m[3]));
    } else {
      const url = (m[5] ?? '').trim();
      if (SAFE_URL.test(url)) {
        nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('a', {
          key,
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer'
        }, m[4]));
      } else {
        nodes.push(m[0]); // Unsafe scheme → literal text.
      }
    }
    last = re.lastIndex;
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes;
}

/**
 * Strip the markdown the toolbar emits down to readable plain text — for
 * compact previews (table cells, board cards) where rendered formatting would
 * be noise. Not for security; use renderMarkdown() for actual display.
 * @param text The stored comment text.
 */
function stripMarkdown(text) {
  return (text || '').replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/^\s*[-*]\s+/gm, '').replace(/^\s*\d+\.\s+/gm, '').replace(/\s+/g, ' ').trim();
}

/**
 * Render a safe subset of markdown (bold/italic/code/link + `-`/`1.` lists) as
 * React nodes. ponytail: line-based block parse — good enough for the toolbar's
 * own output; swap for a real parser only if nested markdown is ever needed.
 * @param text The stored comment/reply text.
 */
function renderMarkdown(text) {
  if (!text) {
    return null;
  }
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let para = [];
  let list = null;
  let b = 0;
  const flushPara = () => {
    if (!para.length) {
      return;
    }
    const key = `p-${b++}`;
    const kids = [];
    para.forEach((ln, idx) => {
      if (idx > 0) {
        kids.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('br', {
          key: `br-${key}-${idx}`
        }));
      }
      kids.push(...parseInline(ln, `${key}-${idx}`));
    });
    blocks.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
      key,
      className: 'markaroo-md__p'
    }, ...kids));
    para = [];
  };
  const flushList = () => {
    if (!list) {
      return;
    }
    const key = `l-${b++}`;
    const tag = list.ordered ? 'ol' : 'ul';
    const items = list.items.map((it, idx) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
      key: `${key}-${idx}`
    }, ...parseInline(it, `${key}-${idx}`)));
    blocks.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, {
      key,
      className: 'markaroo-md__list'
    }, ...items));
    list = null;
  };
  for (const line of lines) {
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ol) {
      flushPara();
      if (!list || !list.ordered) {
        flushList();
        list = {
          ordered: true,
          items: []
        };
      }
      list.items.push(ol[1]);
    } else if (ul) {
      flushPara();
      if (!list || list.ordered) {
        flushList();
        list = {
          ordered: false,
          items: []
        };
      }
      list.items.push(ul[1]);
    } else if (line.trim() === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ...blocks);
}

/***/ },

/***/ "./resources/assets/widget/support/status.ts"
/*!***************************************************!*\
  !*** ./resources/assets/widget/support/status.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isResolvedTab: () => (/* binding */ isResolvedTab),
/* harmony export */   isUnresolvedTab: () => (/* binding */ isUnresolvedTab)
/* harmony export */ });
/**
 * Which tab a feedback item belongs to in the frontend widget.
 *
 * - `resolved` → Resolved tab.
 * - open / in_progress / reopened → Unresolved tab.
 * - `approved` → shown in NEITHER: approved items are signed off in the
 *   dashboard and should disappear from the on-page widget entirely.
 * @param item
 */
function isResolvedTab(item) {
  return item.status === 'resolved';
}
function isUnresolvedTab(item) {
  return item.status !== 'resolved' && item.status !== 'approved';
}

/***/ },

/***/ "./resources/assets/widget/support/timeAgo.ts"
/*!****************************************************!*\
  !*** ./resources/assets/widget/support/timeAgo.ts ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   absoluteTime: () => (/* binding */ absoluteTime),
/* harmony export */   timeAgo: () => (/* binding */ timeAgo)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Relative time label: "just now", "10 minutes ago", "2 hours ago",
 * "3 days ago"; older than 7 days falls back to a localized date.
 * @param iso
 */
function timeAgo(iso) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  if (Number.isNaN(diff)) {
    return iso;
  }
  if (diff >= WEEK_MS) {
    return date.toLocaleDateString();
  }
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('just now', 'markaroo');
  }
  if (minutes < 60) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of minutes. */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('%d minute ago', '%d minutes ago', minutes, 'markaroo'), minutes);
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of hours. */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('%d hour ago', '%d hours ago', hours, 'markaroo'), hours);
  }
  const days = Math.floor(hours / 24);
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of days. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('%d day ago', '%d days ago', days, 'markaroo'), days);
}

/**
 * Absolute localized datetime, for use in title attributes.
 * @param iso
 */
function absoluteTime(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

/***/ },

/***/ "./resources/assets/widget/thread/AttachmentList.tsx"
/*!***********************************************************!*\
  !*** ./resources/assets/widget/thread/AttachmentList.tsx ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AttachmentList: () => (/* binding */ AttachmentList)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const BADGE_COLORS = {
  PDF: '#ef4444',
  DOC: '#2563eb',
  DOCX: '#2563eb',
  XLS: '#16a34a',
  XLSX: '#16a34a',
  CSV: '#16a34a',
  TXT: '#6b7280'
};
function isImage(meta) {
  return meta.mime.startsWith('image/');
}
function AttachmentList({
  attachments
}) {
  if (!attachments || attachments.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: "markaroo-attachments markaroo-attachments--view",
    children: attachments.map(a => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "markaroo-attachments__item",
      children: isImage(a) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
        href: a.url,
        target: "_blank",
        rel: "noopener noreferrer",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
          className: "markaroo-attachments__thumb",
          src: a.url,
          alt: a.filename,
          loading: "lazy"
        })
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
        className: "markaroo-attachments__file",
        href: a.url,
        target: "_blank",
        rel: "noopener noreferrer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
          className: "markaroo-attachments__badge",
          style: {
            backgroundColor: BADGE_COLORS[a.type_badge] ?? '#6366f1'
          },
          children: a.type_badge
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
          className: "markaroo-attachments__name",
          children: a.filename
        })]
      })
    }, a.id))
  });
}

/***/ },

/***/ "./resources/assets/widget/thread/Lightbox.tsx"
/*!*****************************************************!*\
  !*** ./resources/assets/widget/thread/Lightbox.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lightbox: () => (/* binding */ Lightbox)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Lightbox({
  src,
  onClose
}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-lightbox",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Screenshot preview",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      className: "markaroo-lightbox__backdrop",
      type: "button",
      "aria-label": "Close preview",
      onClick: onClose
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
      className: "markaroo-lightbox__img",
      src: src,
      alt: "Pinned content"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      className: "markaroo-lightbox__close",
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        "aria-hidden": "true",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
          d: "M6 6l12 12M18 6L6 18"
        })
      })
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/thread/MentionAutocomplete.tsx"
/*!****************************************************************!*\
  !*** ./resources/assets/widget/thread/MentionAutocomplete.tsx ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MentionAutocomplete: () => (/* binding */ MentionAutocomplete)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function MentionAutocomplete({
  query,
  onSelect,
  onClose
}) {
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Filter the shared, once-per-session users list client-side instead of
  // hitting the REST API on every keystroke. An empty query (just typed `@`)
  // lists everyone so the user can pick without typing a name first.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let cancelled = false;
    const q = query.toLowerCase();
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.fetchUsers)().then(all => {
      if (!cancelled) {
        const matched = q ? all.filter(u => u.name.toLowerCase().includes(q)) : all;
        setUsers(matched.slice(0, 6));
      }
    }).catch(() => setUsers([]));
    return () => {
      cancelled = true;
    };
  }, [query]);

  // Close on outside click.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);
  if (users.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    ref: ref,
    className: "markaroo-mention-popup",
    role: "listbox",
    "aria-label": "Mention suggestions",
    children: users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
      className: "markaroo-mention-popup__item",
      role: "option",
      type: "button",
      onMouseDown: e => {
        e.preventDefault();
        onSelect(u);
      },
      children: u.name
    }, u.id))
  });
}

/***/ },

/***/ "./resources/assets/widget/thread/PinCard.tsx"
/*!****************************************************!*\
  !*** ./resources/assets/widget/thread/PinCard.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PinCard: () => (/* binding */ PinCard)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ReplyComposer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ReplyComposer */ "./resources/assets/widget/thread/ReplyComposer.tsx");
/* harmony import */ var _AttachmentList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AttachmentList */ "./resources/assets/widget/thread/AttachmentList.tsx");
/* harmony import */ var _Lightbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Lightbox */ "./resources/assets/widget/thread/Lightbox.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _support_anchor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../support/anchor */ "./resources/assets/widget/support/anchor.ts");
/* harmony import */ var _support_renderMarkdown__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../support/renderMarkdown */ "./resources/assets/widget/support/renderMarkdown.tsx");
/* harmony import */ var _support_Avatar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../support/Avatar */ "./resources/assets/widget/support/Avatar.tsx");
/* harmony import */ var _support_timeAgo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../support/timeAgo */ "./resources/assets/widget/support/timeAgo.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);












const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
const PANEL_W = 380;
const PANEL_H = 560;
/**
 * Hover/focus-revealed ⋯ menu with Edit/Delete actions.
 * @param root0
 * @param root0.canEdit
 * @param root0.canDelete
 * @param root0.onEdit
 * @param root0.onDelete
 */
function EntryMenu({
  canEdit,
  canDelete,
  onEdit,
  onDelete
}) {
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  if (!canEdit && !canDelete) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: "markaroo-entry__menu",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
      className: "markaroo-entry__menu-btn",
      type: "button",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('More actions', 'markaroo'),
      "aria-expanded": open,
      onClick: () => setOpen(v => !v),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("svg", {
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("circle", {
          cx: "5",
          cy: "12",
          r: "1.6"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("circle", {
          cx: "12",
          cy: "12",
          r: "1.6"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("circle", {
          cx: "19",
          cy: "12",
          r: "1.6"
        })]
      })
    }), open && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-entry__dropdown",
      role: "menu",
      children: [canEdit && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        className: "markaroo-entry__dropdown-item",
        type: "button",
        role: "menuitem",
        onClick: () => {
          setOpen(false);
          onEdit();
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit', 'markaroo')
      }), canDelete && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        className: "markaroo-entry__dropdown-item markaroo-entry__dropdown-item--danger",
        type: "button",
        role: "menuitem",
        onClick: () => {
          setOpen(false);
          onDelete();
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete', 'markaroo')
      })]
    })]
  });
}

/**
 * One avatar-led thread entry (root comment or reply).
 * @param root0
 * @param root0.author
 * @param root0.avatar
 * @param root0.createdAt
 */
function EntryMeta({
  author,
  avatar,
  createdAt
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_support_Avatar__WEBPACK_IMPORTED_MODULE_9__.Avatar, {
      name: author,
      src: avatar,
      size: 24
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
      className: "markaroo-entry__author",
      children: author
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
      className: "markaroo-entry__time",
      title: (0,_support_timeAgo__WEBPACK_IMPORTED_MODULE_10__.absoluteTime)(createdAt),
      children: (0,_support_timeAgo__WEBPACK_IMPORTED_MODULE_10__.timeAgo)(createdAt)
    })]
  });
}
function ReplyRow({
  reply,
  canEdit,
  onUpdated,
  onDeleted
}) {
  const [editing, setEditing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [draft, setDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(reply.comment);
  async function save() {
    if (!draft.trim()) {
      return;
    }
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiPatch)(`replies/${reply.id}`, {
      comment: draft.trim()
    }).catch(() => null);
    if (updated) {
      onUpdated(updated);
    }
    setEditing(false);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: "markaroo-entry",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-entry__meta",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(EntryMeta, {
        author: reply.author,
        avatar: reply.avatar,
        createdAt: reply.created_at
      }), !editing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(EntryMenu, {
        canEdit: canEdit,
        canDelete: canEdit,
        onEdit: () => setEditing(true),
        onDelete: () => (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiDelete)(`replies/${reply.id}`).then(() => onDeleted(reply.id)).catch(() => null)
      })]
    }), editing ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-entry__edit",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("textarea", {
        className: "markaroo-entry__edit-textarea",
        value: draft,
        onChange: e => setDraft(e.target.value),
        rows: 2,
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit reply', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-entry__edit-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
          type: "button",
          onClick: save,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
          type: "button",
          onClick: () => setEditing(false),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'markaroo')
        })]
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "markaroo-entry__body",
      children: (0,_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_8__.renderMarkdown)(reply.comment)
    })]
  });
}
// Docked list panel reserves ~340px on the right; keep the card clear of it.
const PANEL_RESERVE = 360;
function PinCard({
  feedback,
  onClose
}) {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_6__.useWidgetDispatch)();
  const {
    panelOpen
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_6__.useWidget)();
  const config = window.markarooConfig;
  const userId = config?.currentUser?.id ?? 0;
  const canManage = config?.currentUser?.canManage ?? false;
  const canAssign = config?.currentUser?.canAssign ?? false;
  const enableAssignment = config?.settings?.['tasks.enable_assignment'];
  const panelRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [item, setItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback);
  const [replies, setReplies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [editing, setEditing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [commentDraft, setCommentDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback.comment);
  const [titleDraft, setTitleDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback.title ?? '');
  const [confirmDelete, setConfirmDelete] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [lightbox, setLightbox] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const lightboxRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  lightboxRef.current = lightbox;

  // Anchor to the pin POINT, never the screenshot rect — click-placed pins
  // carry a derived crop rect whose edges can sit far from the marker, which
  // would open the card away from its pin.
  function currentAnchor() {
    return (0,_support_anchor__WEBPACK_IMPORTED_MODULE_7__.pageRectToViewport)(item.x, item.y, 0, 0);
  }

  // Initial placement next to the pin, clamped into the viewport.
  function computePos() {
    const el = panelRef.current;
    const size = el ? {
      width: el.offsetWidth,
      height: el.offsetHeight
    } : {
      width: PANEL_W,
      height: PANEL_H
    };
    // The list panel always docks on the right; keep the card clear of it.
    const reserve = panelOpen ? {
      maxRight: window.innerWidth - PANEL_RESERVE
    } : {};
    return (0,_support_anchor__WEBPACK_IMPORTED_MODULE_7__.anchorStyle)(currentAnchor(), size, reserve);
  }
  const [pos, setPos] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(computePos);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiFetch)(`feedback/${feedback.id}`).then(data => {
      setItem(data);
      setTitleDraft(data.title ?? '');
      setCommentDraft(data.comment);
      setReplies(data.replies ?? []);
    }).catch(() => null).finally(() => setLoading(false));
  }, [feedback.id]);

  // Outside pointerdown / Escape closes the card. Pin and cluster markers are
  // excluded (their click handlers toggle/switch the active pin themselves),
  // and so is the docked panel (row clicks switch pins, tabs shouldn't close).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onPointerDown(e) {
      const target = e.target;
      if (!target) {
        return;
      }
      if (panelRef.current?.contains(target) || target.closest('.markaroo-pin') || target.closest('.markaroo-panel')) {
        return;
      }
      onClose();
    }
    function onKeyDown(e) {
      // Lightbox handles its own Escape; don't close the card underneath it.
      if (e.key === 'Escape' && !lightboxRef.current) {
        onClose();
      }
    }
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  // Place the card next to the pin (viewport-clamped once, at open), then keep
  // it RIGIDLY attached to the pin while the page scrolls — re-clamping on
  // scroll would detach the card from its pin at the viewport edge.
  // rAF-throttled: at most one position update per frame.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const initialPos = computePos();
    const anchor0 = currentAnchor();
    const offset = {
      x: initialPos.left - anchor0.left,
      y: initialPos.top - anchor0.top
    };
    setPos(initialPos);
    let rafId = 0;
    function reposition() {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const a = currentAnchor();
        setPos({
          left: Math.round(a.left + offset.x),
          top: Math.round(a.top + offset.y)
        });
      });
    }
    window.addEventListener('scroll', reposition, {
      passive: true
    });
    window.addEventListener('resize', reposition);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
    };
  }, [item, panelOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!enableAssignment || !canAssign) {
      return;
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_5__.fetchUsers)().then(setUsers).catch(() => null);
  }, [enableAssignment, canAssign]);
  const canEditComment = canManage || userId === item.author_id;
  const canDeleteItem = canManage || userId === item.author_id;
  const canReply = config?.currentUser?.canCreate || config?.shareRights?.canComment;
  async function patch(changes) {
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiPatch)(`feedback/${item.id}`, changes).catch(() => null);
    if (updated) {
      setItem(updated);
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
    }
    return updated;
  }
  async function saveEdit() {
    const changes = {};
    if (commentDraft.trim() && commentDraft !== item.comment) {
      changes.comment = commentDraft;
    }
    if ((titleDraft ?? '') !== (item.title ?? '')) {
      changes.title = titleDraft;
    }
    if (Object.keys(changes).length) {
      await patch(changes);
    }
    setEditing(false);
  }
  async function toggleResolve() {
    const ep = item.status === 'open' ? `feedback/${item.id}/resolve` : `feedback/${item.id}/unresolve`;
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiFetch)(ep, {
      method: 'POST',
      body: ''
    }).catch(() => null);
    if (updated) {
      setItem(updated);
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
    }
  }
  async function handleDelete() {
    await (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiDelete)(`feedback/${item.id}`).catch(() => null);
    dispatch({
      type: 'FEEDBACK_DELETED',
      id: item.id
    });
    onClose();
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    ref: panelRef,
    className: "markaroo-pincard",
    style: {
      left: pos.left,
      top: pos.top
    },
    role: "dialog",
    "aria-label": `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feedback', 'markaroo')} #${item.id}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-pincard__head",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
        className: "markaroo-pincard__head-title",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Comment', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
        className: "markaroo-pincard__priority",
        style: {
          '--pri-color': PRIORITY_COLORS[item.priority] ?? '#6366f1'
        },
        children: item.priority.toUpperCase()
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-pincard__head-actions",
        children: [canManage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          className: `markaroo-iconbtn markaroo-iconbtn--sm markaroo-pincard__resolve${item.status === 'resolved' ? ' is-resolved' : ''}`,
          type: "button",
          "aria-label": item.status === 'resolved' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unresolve', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolve', 'markaroo'),
          "aria-pressed": item.status === 'resolved',
          onClick: toggleResolve,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("circle", {
              cx: "12",
              cy: "12",
              r: "9"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
              d: "M8.5 12.5l2.5 2.5 4.5-5"
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          className: "markaroo-iconbtn markaroo-iconbtn--ghost markaroo-iconbtn--sm",
          type: "button",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'markaroo'),
          onClick: onClose,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
              d: "M6 6l12 12M18 6L6 18"
            })
          })
        })]
      })]
    }), confirmDelete && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-pincard__confirm",
      role: "alert",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete this feedback?', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        className: "markaroo-btn markaroo-btn--danger markaroo-btn--sm",
        type: "button",
        onClick: handleDelete,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yes, delete', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
        type: "button",
        onClick: () => setConfirmDelete(false),
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'markaroo')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-pincard__body",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-entry markaroo-entry--root",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "markaroo-entry__meta",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(EntryMeta, {
            author: item.author,
            avatar: item.avatar,
            createdAt: item.created_at
          }), !editing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(EntryMenu, {
            canEdit: canEditComment,
            canDelete: canDeleteItem,
            onEdit: () => setEditing(true),
            onDelete: () => setConfirmDelete(true)
          })]
        }), editing ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "markaroo-entry__edit",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
            className: "markaroo-composer__input",
            type: "text",
            value: titleDraft,
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add a title…', 'markaroo'),
            maxLength: 191,
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'markaroo'),
            onChange: e => setTitleDraft(e.target.value)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("textarea", {
            className: "markaroo-entry__edit-textarea",
            value: commentDraft,
            onChange: e => setCommentDraft(e.target.value),
            rows: 3,
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit comment', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            className: "markaroo-entry__edit-actions",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
              className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
              type: "button",
              onClick: saveEdit,
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
              className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
              type: "button",
              onClick: () => {
                setTitleDraft(item.title ?? '');
                setCommentDraft(item.comment);
                setEditing(false);
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'markaroo')
            })]
          })]
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
          children: [item.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
            className: "markaroo-entry__title",
            children: item.title
          }), item.comment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
            className: "markaroo-entry__body",
            children: (0,_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_8__.renderMarkdown)(item.comment)
          })]
        })]
      }), enableAssignment && canAssign && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-pincard__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
          htmlFor: "markaroo-pincard-assignee",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assign to', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select", {
          id: "markaroo-pincard-assignee",
          className: "markaroo-composer__select",
          value: item.assigned_to_id,
          onChange: e => {
            const id = Number(e.target.value);
            patch({
              assigned_to_id: id,
              assigned_to_name: users.find(u => u.id === id)?.name ?? ''
            });
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: "0",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unassigned', 'markaroo')
          }), users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: u.id,
            children: u.name
          }, u.id))]
        })]
      }), item.screenshot_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-pincard__section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
          className: "markaroo-pincard__label",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pinned content', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: "markaroo-pincard__shot",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("img", {
            src: item.screenshot_url,
            alt: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pinned content', 'markaroo'),
            loading: "lazy"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
            className: "markaroo-pincard__zoom",
            type: "button",
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Zoom screenshot', 'markaroo'),
            onClick: () => setLightbox(true),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              "aria-hidden": "true",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("circle", {
                cx: "11",
                cy: "11",
                r: "7"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
                d: "M21 21l-4.3-4.3"
              })]
            })
          })]
        })]
      }), item.attachments.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-pincard__section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
          className: "markaroo-pincard__label",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Attachments', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_AttachmentList__WEBPACK_IMPORTED_MODULE_3__.AttachmentList, {
          attachments: item.attachments
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-pincard__section markaroo-pincard__section--replies",
        children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
          className: "markaroo-pincard__loading",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
        }), replies.map(r => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(ReplyRow, {
          reply: r,
          canEdit: canManage || userId === r.author_id,
          onUpdated: u => setReplies(prev => prev.map(x => x.id === u.id ? u : x)),
          onDeleted: id => setReplies(prev => prev.filter(x => x.id !== id))
        }, r.id))]
      })]
    }), canReply && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ReplyComposer__WEBPACK_IMPORTED_MODULE_2__.ReplyComposer, {
      feedbackId: item.id,
      onPosted: r => setReplies(prev => [...prev, r])
    }), lightbox && item.screenshot_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_Lightbox__WEBPACK_IMPORTED_MODULE_4__.Lightbox, {
      src: item.screenshot_url,
      onClose: () => setLightbox(false)
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/thread/ReplyComposer.tsx"
/*!**********************************************************!*\
  !*** ./resources/assets/widget/thread/ReplyComposer.tsx ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReplyComposer: () => (/* binding */ ReplyComposer)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MentionAutocomplete__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MentionAutocomplete */ "./resources/assets/widget/thread/MentionAutocomplete.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _support_Avatar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../support/Avatar */ "./resources/assets/widget/support/Avatar.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const GUEST_NAME_KEY = 'markaroo_guest_name';
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}
function ReplyComposer({
  feedbackId,
  onPosted
}) {
  const config = window.markarooConfig;
  const isGuest = config?.currentUser?.id === 0;
  const meName = config?.currentUser?.name || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Guest', 'markaroo');
  const meAvatar = config?.currentUser?.avatar;
  const textareaRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [text, setText] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [guestName, setGuestName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => typeof localStorage !== 'undefined' && localStorage.getItem(GUEST_NAME_KEY) || '');
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Mention detection. Selected user IDs travel with the reply so the backend
  // resolves them by ID regardless of spaces in the display name.
  const [mentionQuery, setMentionQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [mentionOffset, setMentionOffset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [mentionIds, setMentionIds] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  function autoGrow() {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 72)}px`;
    }
  }
  function handleTextChange(val) {
    setText(val);
    autoGrow();
    const ta = textareaRef.current;
    const cursor = ta?.selectionStart ?? val.length;
    const before = val.slice(0, cursor);
    const match = before.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setMentionOffset(match.index);
    } else {
      setMentionQuery(null);
    }
  }
  function insertMention(user) {
    const handle = `@${user.name} `;
    const before = text.slice(0, mentionOffset);
    const after = text.slice(textareaRef.current?.selectionStart ?? text.length);
    const next = before + handle + after;
    setText(next);
    setMentionIds(prev => prev.includes(user.id) ? prev : [...prev, user.id]);
    setMentionQuery(null);
  }
  async function submit() {
    if (!text.trim() || loading) {
      return;
    }
    if (isGuest && typeof localStorage !== 'undefined') {
      localStorage.setItem(GUEST_NAME_KEY, guestName.trim());
    }
    setLoading(true);
    setError(null);
    try {
      const reply = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiPost)(`feedback/${feedbackId}/replies`, {
        reply_uuid: generateUUID(),
        comment: text.trim(),
        ...(mentionIds.length ? {
          mention_ids: mentionIds
        } : {}),
        ...(isGuest ? {
          author: guestName.trim()
        } : {})
      });
      setText('');
      setMentionIds([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      onPosted(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to post reply.', 'markaroo'));
    } finally {
      setLoading(false);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    submit();
  }
  function handleKeyDown(e) {
    // Enter submits; Shift+Enter inserts a newline. Let the mention
    // autocomplete consume Enter while it's open.
    if (e.key === 'Enter' && !e.shiftKey && mentionQuery === null) {
      e.preventDefault();
      submit();
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("form", {
    className: "markaroo-reply-composer",
    onSubmit: handleSubmit,
    children: [isGuest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
      className: "markaroo-reply-composer__name",
      type: "text",
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your name', 'markaroo'),
      value: guestName,
      onChange: e => setGuestName(e.target.value),
      maxLength: 191
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-reply-composer__pill",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_support_Avatar__WEBPACK_IMPORTED_MODULE_4__.Avatar, {
        name: meName,
        src: meAvatar,
        size: 32
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "markaroo-reply-composer__input-wrap",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("textarea", {
          ref: textareaRef,
          className: "markaroo-reply-composer__textarea",
          rows: 1,
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reply', 'markaroo'),
          value: text,
          onChange: e => handleTextChange(e.target.value),
          onKeyDown: handleKeyDown
        }), mentionQuery !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_MentionAutocomplete__WEBPACK_IMPORTED_MODULE_2__.MentionAutocomplete, {
          query: mentionQuery,
          onSelect: insertMention,
          onClose: () => setMentionQuery(null)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "markaroo-reply-composer__send",
        type: "submit",
        "aria-label": loading ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posting…', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reply', 'markaroo'),
        disabled: loading || !text.trim(),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("path", {
            d: "M12 19V5M5 12l7-7 7 7"
          })
        })
      })]
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "markaroo-reply-composer__error",
      role: "alert",
      children: error
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js?ver=" + "bdf43622605933a26cdf" + "";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "@markaroo/markaroo:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (globalThis.importScripts) scriptUrl = globalThis.location + "";
/******/ 		var document = globalThis.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"apps/widget": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunk_markaroo_markaroo"] = globalThis["webpackChunk_markaroo_markaroo"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./resources/assets/apps/widget/index.tsx ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _widget_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../widget/registry */ "./resources/assets/widget/registry.ts");
/* harmony import */ var _widget_WidgetRoot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../widget/WidgetRoot */ "./resources/assets/widget/WidgetRoot.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




// Initialize window.markaroo extension registry before mounting.

(0,_widget_registry__WEBPACK_IMPORTED_MODULE_1__.initRegistry)();
const root = document.getElementById('markaroo-root');
if (root) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_widget_WidgetRoot__WEBPACK_IMPORTED_MODULE_2__.WidgetRoot, {}), root);
}
})();

/******/ })()
;
//# sourceMappingURL=widget.js.map