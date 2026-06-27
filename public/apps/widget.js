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
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
function FeedbackRow({
  item,
  number,
  active,
  onOpen
}) {
  const label = item.title?.trim() || item.comment;
  const dotColor = item.status === 'resolved' ? '#22c55e' : PRIORITY_COLORS[item.priority] ?? '#6366f1';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
    className: `markaroo-feedback-row${active ? ' markaroo-feedback-row--active' : ''}`,
    type: "button",
    onClick: onOpen,
    "aria-pressed": active,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "markaroo-feedback-row__badge",
      children: number
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "markaroo-feedback-row__dot",
      style: {
        backgroundColor: dotColor
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "markaroo-feedback-row__text",
      children: label.slice(0, 80)
    }), item.status === 'resolved' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "markaroo-feedback-row__resolved",
      "aria-label": "Resolved",
      children: "\u2713"
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
    activePinId
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();
  const config = window.markarooConfig;
  const canCreate = config?.currentUser?.canCreate ?? false;
  const shareCanComment = config?.shareRights?.canComment ?? false;
  const showNewButton = (canCreate || shareCanComment) && mode === 'comment';
  const [tab, setTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('open');
  if ('clean' === mode || !enabled || !panelOpen || captureState === 'active') {
    return null;
  }
  const open = feedbacks.filter(f => f.status !== 'resolved');
  const resolved = feedbacks.filter(f => f.status === 'resolved');
  const visible = tab === 'open' ? open : resolved;
  const pageCount = feedbacks.length > 0 ? 1 : 0;
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("aside", {
    className: "markaroo-panel",
    "aria-label": "Feedback panel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-panel__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
        className: "markaroo-panel__title",
        children: "Pins"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "markaroo-panel__header-actions",
        children: [showNewButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
          type: "button",
          onClick: () => dispatch({
            type: 'START_CAPTURE'
          }),
          children: "+ New"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "markaroo-panel__hide",
          type: "button",
          onClick: () => dispatch({
            type: 'CLOSE_PANEL'
          }),
          children: "Hide panel"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "markaroo-panel__close",
          type: "button",
          "aria-label": "Close",
          onClick: () => dispatch({
            type: 'CLOSE_PANEL'
          }),
          children: "\xD7"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-panel__tabs",
      role: "tablist",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        className: `markaroo-panel__tab${tab === 'open' ? ' markaroo-panel__tab--active' : ''}`,
        role: "tab",
        "aria-selected": tab === 'open',
        type: "button",
        onClick: () => setTab('open'),
        children: ["Unresolved ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "markaroo-panel__tab-count",
          children: open.length
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        className: `markaroo-panel__tab${tab === 'resolved' ? ' markaroo-panel__tab--active' : ''}`,
        role: "tab",
        "aria-selected": tab === 'resolved',
        type: "button",
        onClick: () => setTab('resolved'),
        children: ["Resolved ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "markaroo-panel__tab-count",
          children: resolved.length
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-panel__pages",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        className: "markaroo-panel__pages-label",
        children: "Pages"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
        className: "markaroo-panel__pages-pill",
        children: ["View pages ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "markaroo-panel__pages-count",
          children: pageCount
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "markaroo-panel__body",
      role: "tabpanel",
      children: visible.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "markaroo-panel__empty",
        children: tab === 'open' ? 'No open feedback yet.' : 'No resolved feedback.'
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-feedback-list",
        children: visible.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FeedbackRow, {
          item: item,
          number: feedbacks.indexOf(item) + 1,
          active: activePinId === item.id,
          onOpen: () => openPin(item.id)
        }, item.id))
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "markaroo-panel__footer",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        className: "markaroo-panel__exit",
        type: "button",
        onClick: () => dispatch({
          type: 'DISABLE_SESSION'
        }),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M6 6l12 12M18 6L6 18"
          })
        }), "Exit Feedback"]
      })
    })]
  });
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
      // First click — enter feedback mode (reveals pins + opens panel).
      dispatch({
        type: 'ENABLE_SESSION'
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
    // Chat bubble — idle.
    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
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
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      })
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
/* harmony import */ var _Launcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Launcher */ "./resources/assets/widget/Launcher.tsx");
/* harmony import */ var _FeedbackPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FeedbackPanel */ "./resources/assets/widget/FeedbackPanel.tsx");
/* harmony import */ var _pins_PinLayer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pins/PinLayer */ "./resources/assets/widget/pins/PinLayer.tsx");
/* harmony import */ var _capture_CaptureOverlay__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./capture/CaptureOverlay */ "./resources/assets/widget/capture/CaptureOverlay.tsx");
/* harmony import */ var _composer_ComposerPanel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./composer/ComposerPanel */ "./resources/assets/widget/composer/ComposerPanel.tsx");
/* harmony import */ var _thread_PinCard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./thread/PinCard */ "./resources/assets/widget/thread/PinCard.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_ModeManager__WEBPACK_IMPORTED_MODULE_2__.ModeManager, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_Launcher__WEBPACK_IMPORTED_MODULE_3__.Launcher, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_FeedbackPanel__WEBPACK_IMPORTED_MODULE_4__.FeedbackPanel, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_pins_PinLayer__WEBPACK_IMPORTED_MODULE_5__.PinLayer, {}), 'clean' !== mode && 'selecting' === capturePhase && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_capture_CaptureOverlay__WEBPACK_IMPORTED_MODULE_6__.CaptureOverlay, {}), 'clean' !== mode && 'composing' === capturePhase && captureData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_composer_ComposerPanel__WEBPACK_IMPORTED_MODULE_7__.ComposerPanel, {
      captureData: captureData,
      onSubmitted: handleSubmitted,
      onCancel: handleCancelCapture
    }), 'clean' !== mode && 'idle' === capturePhase && activePin && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_thread_PinCard__WEBPACK_IMPORTED_MODULE_8__.PinCard, {
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

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.WidgetProvider, {
    initialMode: initialMode,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(WidgetInner, {})
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
/* harmony export */   apiPost: () => (/* binding */ apiPost)
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
  return `${cfg().restUrl}markaroo/v1/${path}`;
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
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _ClickCapture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ClickCapture */ "./resources/assets/widget/capture/ClickCapture.tsx");
/* harmony import */ var _RegionAnnotator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RegionAnnotator */ "./resources/assets/widget/capture/RegionAnnotator.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function CaptureOverlay() {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();
  const [tool, setTool] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('region');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.dispatchEvent(new CustomEvent('markaroo:capture-start', {
      detail: {
        tool
      }
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    children: [tool === 'region' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_RegionAnnotator__WEBPACK_IMPORTED_MODULE_3__.RegionAnnotator, {
      onCapture: handleCapture,
      onCancel: cancel
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ClickCapture__WEBPACK_IMPORTED_MODULE_2__.ClickCapture, {
      onCapture: handleCapture
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "markaroo-capture-switch",
      role: "toolbar",
      "aria-label": "Capture mode",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
        className: `markaroo-capture-switch__btn${tool === 'region' ? ' is-active' : ''}`,
        onClick: () => setTool('region'),
        type: "button",
        "aria-pressed": tool === 'region',
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("rect", {
            x: "3",
            y: "3",
            width: "18",
            height: "18",
            rx: "2",
            strokeDasharray: "4 3"
          })
        }), "Area"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
        className: `markaroo-capture-switch__btn${tool === 'click' ? ' is-active' : ''}`,
        onClick: () => setTool('click'),
        type: "button",
        "aria-pressed": tool === 'click',
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
            d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
          })
        }), "Pin"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
        className: "markaroo-capture-switch__cancel",
        onClick: cancel,
        type: "button",
        children: "Cancel"
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/capture/ClickCapture.tsx"
/*!**********************************************************!*\
  !*** ./resources/assets/widget/capture/ClickCapture.tsx ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClickCapture: () => (/* binding */ ClickCapture)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _captureUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function ClickCapture({
  onCapture
}) {
  const overlayRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  function handleClick(e) {
    // Ignore if clicked on an interactive Markaroo element that bubbled up.
    if (e.target.closest('.markaroo-capture-toolbar')) {
      return;
    }
    const data = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_1__.buildClickCaptureData)(e.clientX, e.clientY);
    window.dispatchEvent(new CustomEvent('markaroo:pin-placed', {
      detail: {
        captureData: data
      }
    }));
    onCapture(data);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    ref: overlayRef,
    className: "markaroo-capture-overlay markaroo-capture-overlay--click",
    onClick: handleClick,
    role: "presentation"
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
/* harmony import */ var _captureUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



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
    e.currentTarget.setPointerCapture(e.pointerId);
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
  const onPointerUp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const g = gestureRef.current;
    gestureRef.current = {
      kind: 'none'
    };
    if (g.kind === 'draw-box') {
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
  }, []);

  // ---- Box body move / handle resize ---------------------------------------
  function startMove(e) {
    if (isShape || !box) {
      return;
    }
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
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
    e.currentTarget.setPointerCapture(e.pointerId);
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
    const data = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_1__.buildRegionCaptureData)(box.left, box.top, box.width, box.height);
    const annotations = anns.map(a => {
      const from = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_1__.toPagePct)(a.x0, a.y0);
      const to = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_1__.toPagePct)(a.x1, a.y1);
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: `markaroo-ra-overlay${isShape ? ' markaroo-ra-overlay--draw' : ''}`,
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    role: "presentation",
    children: [!box && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "markaroo-ra-hint",
      children: 'Drag to select an area'
    }), box && showShapes.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
      className: "markaroo-ra-shapes",
      "aria-hidden": "true",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("defs", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("marker", {
          id: "markaroo-ra-arrow",
          markerWidth: "10",
          markerHeight: "10",
          refX: "7",
          refY: "3",
          orient: "auto",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M0,0 L7,3 L0,6 Z",
            fill: ANN_COLOR
          })
        })
      }), showShapes.map((s, i) => {
        if (s.tool === 'arrow') {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
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
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("rect", {
            x: Math.min(s.x0, s.x1),
            y: Math.min(s.y0, s.y1),
            width: Math.abs(s.x1 - s.x0),
            height: Math.abs(s.y1 - s.y0),
            fill: "none",
            stroke: ANN_COLOR,
            strokeWidth: 3
          }, i);
        }
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("ellipse", {
          cx: (s.x0 + s.x1) / 2,
          cy: (s.y0 + s.y1) / 2,
          rx: Math.abs(s.x1 - s.x0) / 2,
          ry: Math.abs(s.y1 - s.y0) / 2,
          fill: "none",
          stroke: ANN_COLOR,
          strokeWidth: 3
        }, i);
      })]
    }), box && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-ra-box",
      style: {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height
      },
      children: [!isShape && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-ra-box__body",
        onPointerDown: startMove
      }), !isShape && HANDLES.map(h => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: `markaroo-ra-handle markaroo-ra-handle--${h}`,
        onPointerDown: e => startResize(e, h)
      }, h)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "markaroo-ra-toolbar",
        role: "toolbar",
        "aria-label": "Annotation tools",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: `markaroo-ra-tool${tool === 'rect' ? ' is-active' : ''}`,
          "aria-label": "Rectangle",
          "aria-pressed": tool === 'rect',
          onClick: () => setTool(tool === 'rect' ? 'select' : 'rect'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("rect", {
              x: "4",
              y: "4",
              width: "16",
              height: "16",
              rx: "2"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: `markaroo-ra-tool${tool === 'circle' ? ' is-active' : ''}`,
          "aria-label": "Circle",
          "aria-pressed": tool === 'circle',
          onClick: () => setTool(tool === 'circle' ? 'select' : 'circle'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("circle", {
              cx: "12",
              cy: "12",
              r: "8"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: `markaroo-ra-tool${tool === 'arrow' ? ' is-active' : ''}`,
          "aria-label": "Arrow",
          "aria-pressed": tool === 'arrow',
          onClick: () => setTool(tool === 'arrow' ? 'select' : 'arrow'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M7 17L17 7M17 7H9M17 7V15"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: "markaroo-ra-tool",
          "aria-label": "Undo",
          onClick: undo,
          disabled: anns.length === 0,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M3 7v6h6"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M3 13a9 9 0 1 0 3.5-6.9L3 9"
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: "markaroo-ra-tool markaroo-ra-tool--cancel",
          "aria-label": "Cancel",
          onClick: onCancel,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M6 6l12 12M18 6L6 18"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: "markaroo-ra-tool markaroo-ra-tool--confirm",
          "aria-label": "Confirm",
          onClick: confirm,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
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
    const mod = await __webpack_require__.e(/*! import() */ "vendors-node_modules_html2canvas_dist_html2canvas_js").then(__webpack_require__.t.bind(__webpack_require__, /*! html2canvas */ "./node_modules/html2canvas/dist/html2canvas.js", 23));
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
    scale: window.devicePixelRatio ?? 1,
    ...cfg,
    ...overrides
  };
}
function isEnabled() {
  const cfg = window.markarooConfig?.screenshotOptions;
  return cfg?.enabled !== false;
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
/* harmony import */ var _MarkdownToolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MarkdownToolbar */ "./resources/assets/widget/composer/MarkdownToolbar.tsx");
/* harmony import */ var _TagInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TagInput */ "./resources/assets/widget/composer/TagInput.tsx");
/* harmony import */ var _AttachmentPicker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AttachmentPicker */ "./resources/assets/widget/composer/AttachmentPicker.tsx");
/* harmony import */ var _thread_MentionAutocomplete__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../thread/MentionAutocomplete */ "./resources/assets/widget/thread/MentionAutocomplete.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _capture_Screenshot__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../capture/Screenshot */ "./resources/assets/widget/capture/Screenshot.ts");
/* harmony import */ var _capture_captureUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../capture/captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var _support_anchor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../support/anchor */ "./resources/assets/widget/support/anchor.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










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
  const defaultPri = config.settings?.['general.default_priority'] ?? 'normal';
  const panelRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const textareaRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const enableAssignment = config.settings?.['tasks.enable_assignment'];
  const enableDueDates = config.settings?.['tasks.enable_due_dates'];
  const enableTags = config.settings?.['tasks.enable_tags'];
  const canAssign = config.currentUser?.canAssign ?? false;
  const [comment, setComment] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [priority, setPriority] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultPri);
  const [assigneeId, setAssigneeId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [assigneeName, setAssigneeName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [dueDate, setDueDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [tags, setTags] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [attachments, setAttachments] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [attachScreenshot, setAttachScreenshot] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [guestName, setGuestName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => typeof localStorage !== 'undefined' && localStorage.getItem(GUEST_NAME_KEY) || '');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Mention detection in the comment textarea.
  const [mentionQuery, setMentionQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [mentionOffset, setMentionOffset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);

  // Anchor the panel next to the selected region.
  const [pos, setPos] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    const r = captureData.screenshotRect.rect;
    const anchor = r ? (0,_support_anchor__WEBPACK_IMPORTED_MODULE_8__.pageRectToViewport)(r.xPct, r.yPct, r.wPct, r.hPct) : {
      left: captureData.x * window.innerWidth,
      top: captureData.y * window.innerHeight,
      width: 0,
      height: 0
    };
    return (0,_support_anchor__WEBPACK_IMPORTED_MODULE_8__.anchorStyle)(anchor, {
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
    const anchor = r ? (0,_support_anchor__WEBPACK_IMPORTED_MODULE_8__.pageRectToViewport)(r.xPct, r.yPct, r.wPct, r.hPct) : {
      left: captureData.x * window.innerWidth,
      top: captureData.y * window.innerHeight,
      width: 0,
      height: 0
    };
    setPos((0,_support_anchor__WEBPACK_IMPORTED_MODULE_8__.anchorStyle)(anchor, {
      width: el.offsetWidth,
      height: el.offsetHeight
    }));
  }, [captureData]);

  // Load assignable users once if feature enabled.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    if (!enableAssignment || !canAssign) {
      return;
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiFetch)('users?per_page=50').then(setUsers).catch(() => null);
  });
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
    setMentionQuery(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty.');
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

    // Capture the cropped "Pinned content" image (annotations burned in) as base64.
    let screenshot = null;
    if (attachScreenshot) {
      screenshot = await (0,_capture_Screenshot__WEBPACK_IMPORTED_MODULE_6__.captureCroppedDataUrl)(captureData.screenshotRect.rect, captureData.screenshotRect.annotations);
    }
    const payload = {
      comment,
      priority,
      page_key: (0,_capture_captureUtils__WEBPACK_IMPORTED_MODULE_7__.getPageKey)(),
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
      ...(screenshot ? {
        screenshot
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
    try {
      const item = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.apiPost)('feedback', payload);
      window.dispatchEvent(new CustomEvent('markaroo:feedback-submitted', {
        detail: {
          feedback: item
        }
      }));
      onSubmitted(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    ref: panelRef,
    className: "markaroo-composer markaroo-composer--anchored",
    style: {
      left: pos.left,
      top: pos.top
    },
    role: "dialog",
    "aria-label": "Write feedback",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "markaroo-composer__header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: "markaroo-composer__title",
        children: "Write feedback"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("form", {
      className: "markaroo-composer__form",
      onSubmit: handleSubmit,
      noValidate: true,
      children: [isGuest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("label", {
          htmlFor: "markaroo-guest-name",
          children: "Your name"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
          id: "markaroo-guest-name",
          type: "text",
          className: "markaroo-composer__input",
          value: guestName,
          onChange: e => setGuestName(e.target.value),
          placeholder: "Enter your name",
          maxLength: 191,
          required: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field markaroo-composer__field--comment",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_MarkdownToolbar__WEBPACK_IMPORTED_MODULE_1__.MarkdownToolbar, {
          textareaRef: textareaRef,
          value: comment,
          onChange: setComment
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-composer__input-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("textarea", {
            ref: textareaRef,
            id: "markaroo-comment",
            className: "markaroo-composer__textarea",
            value: comment,
            onChange: e => handleCommentChange(e.target.value),
            placeholder: "Describe the issue or feedback\u2026 Type @ to mention a user.",
            rows: 4,
            "aria-label": "Feedback comment",
            required: true
          }), mentionQuery !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_thread_MentionAutocomplete__WEBPACK_IMPORTED_MODULE_4__.MentionAutocomplete, {
            query: mentionQuery,
            onSelect: insertMention,
            onClose: () => setMentionQuery(null)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("label", {
          htmlFor: "markaroo-priority",
          children: "Priority"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("select", {
          id: "markaroo-priority",
          className: "markaroo-composer__select",
          value: priority,
          onChange: e => setPriority(e.target.value),
          children: PRIORITIES.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
            value: p.value,
            children: p.label
          }, p.value))
        })]
      }), enableAssignment && canAssign && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("label", {
          htmlFor: "markaroo-assignee",
          children: "Assign to"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("select", {
          id: "markaroo-assignee",
          className: "markaroo-composer__select",
          value: assigneeId,
          onChange: e => {
            const id = Number(e.target.value);
            setAssigneeId(id);
            setAssigneeName(users.find(u => u.id === id)?.name ?? '');
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
            value: "0",
            children: "Unassigned"
          }), users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
            value: u.id,
            children: u.name
          }, u.id))]
        })]
      }), enableDueDates && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("label", {
          htmlFor: "markaroo-due",
          children: "Due date"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
          id: "markaroo-due",
          type: "date",
          className: "markaroo-composer__input",
          value: dueDate,
          onChange: e => setDueDate(e.target.value)
        })]
      }), enableTags && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "markaroo-composer__label",
          children: "Tags"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TagInput__WEBPACK_IMPORTED_MODULE_2__.TagInput, {
          tags: tags,
          onChange: setTags
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field markaroo-composer__field--check",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
          id: "markaroo-attach-shot",
          type: "checkbox",
          checked: attachScreenshot,
          onChange: e => setAttachScreenshot(e.target.checked)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("label", {
          htmlFor: "markaroo-attach-shot",
          className: "markaroo-composer__checkbox",
          children: "Attach screenshot"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "markaroo-composer__label",
          children: "Attach files"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_AttachmentPicker__WEBPACK_IMPORTED_MODULE_3__.AttachmentPicker, {
          attachments: attachments,
          onChange: setAttachments
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "markaroo-composer__error",
        role: "alert",
        children: error
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-composer__actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "submit",
          className: "markaroo-iconbtn markaroo-iconbtn--primary",
          "aria-label": "Save feedback",
          disabled: loading,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
              d: "M5 13l4 4L19 7"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "button",
          className: "markaroo-iconbtn markaroo-iconbtn--ghost",
          "aria-label": "Cancel",
          onClick: onCancel,
          disabled: loading,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
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

const ACTIONS = [{
  label: 'Bold',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
    children: "B"
  }),
  apply: s => ({
    text: `**${s || 'bold'}**`,
    offset: s ? 0 : -2
  })
}, {
  label: 'Italic',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
    children: "I"
  }),
  apply: s => ({
    text: `*${s || 'italic'}*`,
    offset: s ? 0 : -1
  })
}, {
  label: 'Bullet list',
  icon: '≡',
  apply: s => ({
    text: `\n- ${s || 'item'}`,
    offset: s ? 0 : 0
  })
}, {
  label: 'Numbered list',
  icon: '1.',
  apply: s => ({
    text: `\n1. ${s || 'item'}`,
    offset: s ? 0 : 0
  })
}, {
  label: 'Link',
  icon: '🔗',
  apply: s => ({
    text: `[${s || 'text'}](url)`,
    offset: s ? -1 - 3 : -1 - 3
  })
}, {
  label: 'Code',
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
    children: '<>'
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
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _capture_captureUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../capture/captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function docSize() {
  const d = document.documentElement;
  return {
    w: d.scrollWidth,
    h: d.scrollHeight
  };
}
function PinLayer() {
  const {
    feedbacks,
    enabled,
    captureState,
    activePinId,
    mode
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__.useWidgetDispatch)();
  const loadedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(docSize);

  // Keep document dimensions current so pin pixel positions track reflow/resize.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function update() {
      setPage(prev => {
        const next = docSize();
        return prev.w === next.w && prev.h === next.h ? prev : next;
      });
    }
    update();
    window.addEventListener('resize', update);
    const id = window.setInterval(update, 1000);
    return () => {
      window.removeEventListener('resize', update);
      window.clearInterval(id);
    };
  }, [feedbacks.length]);

  // Load page feedback the first time the session is enabled (Annotix-style:
  // nothing is fetched or shown until the user enters feedback mode).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (loadedRef.current || !enabled || mode === 'clean') {
      return;
    }
    loadedRef.current = true;
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.apiFetch)(`feedback?page_key=${encodeURIComponent((0,_capture_captureUtils__WEBPACK_IMPORTED_MODULE_4__.getPageKey)())}&per_page=100`).then(res => dispatch({
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

  function handlePinClick(id) {
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
  async function handlePinMove(id, x, y) {
    try {
      const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_2__.apiPatch)(`feedback/${id}`, {
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
  }
  async function handleResolve(id) {
    try {
      const item = feedbacks.find(f => f.id === id);
      const endpoint = item?.status === 'open' ? `feedback/${id}/resolve` : `feedback/${id}/unresolve`;
      const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_2__.apiFetch)(endpoint, {
        method: 'POST',
        body: ''
      });
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
      window.dispatchEvent(new CustomEvent('markaroo:pin-resolved', {
        detail: {
          id,
          status: updated.status
        }
      }));
    } catch {
      // Resolve toggle failure is non-fatal; state stays as-is.
    }
  }
  if (!enabled || mode === 'clean' || feedbacks.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    className: "markaroo-pin-layer",
    "aria-label": "Feedback pins",
    children: feedbacks.map((item, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_PinMarker__WEBPACK_IMPORTED_MODULE_1__.PinMarker, {
      item: item,
      number: idx + 1,
      dimmed: captureState === 'active',
      active: activePinId === item.id,
      canDrag: mode === 'comment',
      pageW: page.w,
      pageH: page.h,
      onClick: () => handlePinClick(item.id),
      onMove: (x, y) => handlePinMove(item.id, x, y),
      onResolve: () => handleResolve(item.id)
    }, item.id))
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
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
function PinMarker({
  item,
  number,
  dimmed,
  active,
  canDrag,
  pageW,
  pageH,
  onClick,
  onMove,
  onResolve
}) {
  const pinRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const dragRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [dragging, setDragging] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [localX, setLocalX] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(item.x);
  const [localY, setLocalY] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(item.y);

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
    e.currentTarget.setPointerCapture(e.pointerId);
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
      onMove(localX, localY);
    } else {
      onClick();
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
    ref: pinRef,
    className: ['markaroo-pin', active ? 'markaroo-pin--active' : '', dimmed ? 'markaroo-pin--dimmed' : '', dragging ? 'markaroo-pin--dragging' : '', item.status === 'resolved' ? 'markaroo-pin--resolved' : ''].filter(Boolean).join(' '),
    style: {
      left: pinLeft,
      top: pinTop,
      '--pin-color': color
    },
    "aria-label": `Feedback #${number}: ${item.comment.slice(0, 60)}`,
    "aria-pressed": active,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    type: "button",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-pin__badge",
      children: number
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-pin__priority-dot"
    })]
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
 * window.markaroo — JS extension registry for the Pro plugin and third-party code.
 *
 * Usage (Pro plugin or custom code):
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
/* harmony export */   useWidgetDispatch: () => (/* binding */ useWidgetDispatch)
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
    case 'START_CAPTURE':
      return {
        ...state,
        captureState: 'active',
        capturePhase: 'selecting',
        captureData: null,
        panelOpen: false,
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
    case 'END_CAPTURE':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null
      };
    case 'FEEDBACK_SUBMITTED':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        activePinId: action.item.id,
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

const GAP = 14;
const MARGIN = 12;
function anchorStyle(anchor, panel, opts = {}) {
  const vh = window.innerHeight;
  const maxRight = opts.maxRight ?? document.documentElement.clientWidth;
  const minLeft = opts.minLeft ?? MARGIN;

  // Horizontal: prefer right of the anchor, else left, else clamp within bounds.
  let left = anchor.left + anchor.width + GAP;
  if (left + panel.width + MARGIN > maxRight) {
    const leftSide = anchor.left - panel.width - GAP;
    left = leftSide >= minLeft ? leftSide : Math.max(minLeft, maxRight - panel.width - MARGIN);
  }
  // Final clamp so a left-docked panel never overlaps the card.
  if (left < minLeft) {
    left = minLeft;
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
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!query) {
      setUsers([]);
      return;
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.apiFetch)(`users?search=${encodeURIComponent(query)}&per_page=6`).then(setUsers).catch(() => setUsers([]));
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
/* harmony import */ var _ReplyComposer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ReplyComposer */ "./resources/assets/widget/thread/ReplyComposer.tsx");
/* harmony import */ var _AttachmentList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AttachmentList */ "./resources/assets/widget/thread/AttachmentList.tsx");
/* harmony import */ var _Lightbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Lightbox */ "./resources/assets/widget/thread/Lightbox.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _support_anchor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../support/anchor */ "./resources/assets/widget/support/anchor.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
const PANEL_W = 380;
const PANEL_H = 560;
function timeStamp(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}
function initials(name) {
  return name.trim().split(/\s+/).map(p => p[0] ?? '').slice(0, 2).join('').toUpperCase() || '?';
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
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiPatch)(`replies/${reply.id}`, {
      comment: draft.trim()
    }).catch(() => null);
    if (updated) {
      onUpdated(updated);
    }
    setEditing(false);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "markaroo-reply",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "markaroo-reply__meta",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "markaroo-reply__author",
        children: reply.author
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "markaroo-reply__time",
        children: timeStamp(reply.created_at)
      })]
    }), editing ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "markaroo-reply__edit",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("textarea", {
        className: "markaroo-reply__edit-textarea",
        value: draft,
        onChange: e => setDraft(e.target.value),
        rows: 2,
        "aria-label": "Edit reply"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-reply__edit-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
          type: "button",
          onClick: save,
          children: "Save"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
          type: "button",
          onClick: () => setEditing(false),
          children: "Cancel"
        })]
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "markaroo-reply__body",
      children: reply.comment
    }), canEdit && !editing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "markaroo-reply__actions",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        className: "markaroo-reply__action",
        type: "button",
        onClick: () => setEditing(true),
        children: "Edit"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        className: "markaroo-reply__action markaroo-reply__action--danger",
        type: "button",
        onClick: () => (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiDelete)(`replies/${reply.id}`).then(() => onDeleted(reply.id)).catch(() => null),
        children: "Delete"
      })]
    })]
  });
}
// Docked list panel reserves ~340px on the right; keep the card clear of it.
const PANEL_RESERVE = 360;
function PinCard({
  feedback,
  onClose
}) {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_5__.useWidgetDispatch)();
  const {
    panelOpen
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_5__.useWidget)();
  const config = window.markarooConfig;
  const userId = config?.currentUser?.id ?? 0;
  const canManage = config?.currentUser?.canManage ?? false;
  const canAssign = config?.currentUser?.canAssign ?? false;
  const enableAssignment = config?.settings?.['tasks.enable_assignment'];
  const panelRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [item, setItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback);
  const [replies, setReplies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [editingComment, setEditingComment] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [commentDraft, setCommentDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback.comment);
  const [title, setTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback.title ?? '');
  const [confirmDelete, setConfirmDelete] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [lightbox, setLightbox] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // The list panel docks opposite the launcher: launcher bottom-right → panel
  // left, otherwise panel right. Keep the card clear of whichever side it's on.
  const panelOnLeft = document.getElementById('markaroo-root')?.getAttribute('data-position') === 'bottom-right';

  // Anchor next to the pin's region (or pin point), in viewport coords.
  function computePos() {
    const r = item.screenshot_rect?.rect ?? null;
    const anchor = r ? (0,_support_anchor__WEBPACK_IMPORTED_MODULE_6__.pageRectToViewport)(r.xPct, r.yPct, r.wPct, r.hPct) : (0,_support_anchor__WEBPACK_IMPORTED_MODULE_6__.pageRectToViewport)(item.x, item.y, 0, 0);
    const el = panelRef.current;
    const size = el ? {
      width: el.offsetWidth,
      height: el.offsetHeight
    } : {
      width: PANEL_W,
      height: PANEL_H
    };
    const reserve = panelOpen ? panelOnLeft ? {
      minLeft: PANEL_RESERVE
    } : {
      maxRight: window.innerWidth - PANEL_RESERVE
    } : {};
    return (0,_support_anchor__WEBPACK_IMPORTED_MODULE_6__.anchorStyle)(anchor, size, reserve);
  }
  const [pos, setPos] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(computePos);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiFetch)(`feedback/${feedback.id}`).then(data => {
      setItem(data);
      setTitle(data.title ?? '');
      setReplies(data.replies ?? []);
    }).catch(() => null).finally(() => setLoading(false));
  }, [feedback.id]);

  // Reposition on item change and as the page scrolls/resizes so the card tracks
  // the pin (fixed-positioned popover anchored to a scrolling element).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function reposition() {
      setPos(computePos());
    }
    reposition();
    window.addEventListener('scroll', reposition, {
      passive: true
    });
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
    };
  }, [item, panelOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!enableAssignment || !canAssign) {
      return;
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiFetch)('users?per_page=50').then(setUsers).catch(() => null);
  }, [enableAssignment, canAssign]);
  const canEditComment = canManage || userId === item.author_id;
  const canDeleteItem = canManage || userId === item.author_id;
  const canReply = config?.currentUser?.canCreate || config?.shareRights?.canComment;
  async function patch(changes) {
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiPatch)(`feedback/${item.id}`, changes).catch(() => null);
    if (updated) {
      setItem(updated);
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
    }
    return updated;
  }
  async function saveComment() {
    await patch({
      comment: commentDraft
    });
    setEditingComment(false);
  }
  async function saveTitle() {
    if ((title ?? '') !== (item.title ?? '')) {
      await patch({
        title
      });
    }
  }
  async function toggleResolve() {
    const ep = item.status === 'open' ? `feedback/${item.id}/resolve` : `feedback/${item.id}/unresolve`;
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiFetch)(ep, {
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
    await (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiDelete)(`feedback/${item.id}`).catch(() => null);
    dispatch({
      type: 'FEEDBACK_DELETED',
      id: item.id
    });
    onClose();
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    ref: panelRef,
    className: "markaroo-pincard",
    style: {
      left: pos.left,
      top: pos.top
    },
    role: "dialog",
    "aria-label": `Feedback #${item.id}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "markaroo-pincard__head",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "markaroo-pincard__avatar",
        "aria-hidden": "true",
        children: initials(item.author)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-pincard__who",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "markaroo-pincard__author",
          children: item.author
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "markaroo-pincard__time",
          children: timeStamp(item.created_at)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-pincard__head-actions",
        children: [canEditComment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          className: "markaroo-iconbtn markaroo-iconbtn--primary markaroo-iconbtn--sm",
          type: "button",
          "aria-label": "Edit",
          onClick: () => setEditingComment(v => !v),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("path", {
              d: "M12 20h9"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("path", {
              d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          className: "markaroo-iconbtn markaroo-iconbtn--ghost markaroo-iconbtn--sm",
          type: "button",
          "aria-label": "Close",
          onClick: onClose,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("path", {
              d: "M6 6l12 12M18 6L6 18"
            })
          })
        }), canManage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          className: "markaroo-iconbtn markaroo-iconbtn--success markaroo-iconbtn--sm",
          type: "button",
          "aria-label": item.status === 'resolved' ? 'Unresolve' : 'Resolve',
          onClick: toggleResolve,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("path", {
              d: "M5 13l4 4L19 7"
            })
          })
        }), canDeleteItem && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          className: "markaroo-iconbtn markaroo-iconbtn--danger markaroo-iconbtn--sm",
          type: "button",
          "aria-label": "Delete",
          onClick: () => setConfirmDelete(true),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("polyline", {
              points: "3 6 5 6 21 6"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("path", {
              d: "M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
            })]
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "markaroo-pincard__priority",
      style: {
        '--pri-color': PRIORITY_COLORS[item.priority] ?? '#6366f1'
      },
      children: item.priority.toUpperCase()
    }), confirmDelete && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "markaroo-pincard__confirm",
      role: "alert",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        children: "Delete this feedback?"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        className: "markaroo-btn markaroo-btn--danger markaroo-btn--sm",
        type: "button",
        onClick: handleDelete,
        children: "Yes, delete"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
        type: "button",
        onClick: () => setConfirmDelete(false),
        children: "Cancel"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "markaroo-pincard__body",
      children: [enableAssignment && canAssign && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-pincard__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
          htmlFor: "markaroo-pincard-assignee",
          children: "Assign to"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("select", {
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
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("option", {
            value: "0",
            children: "Unassigned"
          }), users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("option", {
            value: u.id,
            children: u.name
          }, u.id))]
        })]
      }), canEditComment ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
        className: "markaroo-composer__input",
        type: "text",
        value: title,
        placeholder: "Add a title\u2026",
        maxLength: 191,
        "aria-label": "Title",
        onChange: e => setTitle(e.target.value),
        onBlur: saveTitle
      }) : item.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "markaroo-pincard__titletext",
        children: item.title
      }), editingComment ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-reply__edit",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("textarea", {
          className: "markaroo-reply__edit-textarea",
          value: commentDraft,
          onChange: e => setCommentDraft(e.target.value),
          rows: 3,
          "aria-label": "Edit comment"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "markaroo-reply__edit-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
            type: "button",
            onClick: saveComment,
            children: "Save"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
            type: "button",
            onClick: () => setEditingComment(false),
            children: "Cancel"
          })]
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "markaroo-pincard__comment",
        children: item.comment
      }), item.screenshot_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-pincard__section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "markaroo-pincard__label",
          children: "Pinned content"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "markaroo-pincard__shot",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
            src: item.screenshot_url,
            alt: "Pinned content",
            loading: "lazy"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            className: "markaroo-pincard__zoom",
            type: "button",
            "aria-label": "Zoom screenshot",
            onClick: () => setLightbox(true),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              "aria-hidden": "true",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("circle", {
                cx: "11",
                cy: "11",
                r: "7"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("path", {
                d: "M21 21l-4.3-4.3"
              })]
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-pincard__section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "markaroo-pincard__label",
          children: "Attachments"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_AttachmentList__WEBPACK_IMPORTED_MODULE_2__.AttachmentList, {
          attachments: item.attachments
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "markaroo-pincard__section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
          className: "markaroo-pincard__label",
          children: ["Replies ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
            className: "markaroo-pincard__count",
            children: replies.length
          })]
        }), loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "markaroo-pincard__loading",
          children: "Loading\u2026"
        }), !loading && replies.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "markaroo-pincard__empty",
          children: "No replies yet."
        }), replies.map(r => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ReplyRow, {
          reply: r,
          canEdit: canManage || userId === r.author_id,
          onUpdated: u => setReplies(prev => prev.map(x => x.id === u.id ? u : x)),
          onDeleted: id => setReplies(prev => prev.filter(x => x.id !== id))
        }, r.id)), canReply && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ReplyComposer__WEBPACK_IMPORTED_MODULE_1__.ReplyComposer, {
          feedbackId: item.id,
          onPosted: r => setReplies(prev => [...prev, r])
        })]
      })]
    }), lightbox && item.screenshot_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_Lightbox__WEBPACK_IMPORTED_MODULE_3__.Lightbox, {
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
/* harmony import */ var _MentionAutocomplete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MentionAutocomplete */ "./resources/assets/widget/thread/MentionAutocomplete.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




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
  const textareaRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [text, setText] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [guestName, setGuestName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => typeof localStorage !== 'undefined' && localStorage.getItem(GUEST_NAME_KEY) || '');
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Mention detection.
  const [mentionQuery, setMentionQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [mentionOffset, setMentionOffset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  function handleTextChange(val) {
    setText(val);
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
    setMentionQuery(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      return;
    }
    if (isGuest) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(GUEST_NAME_KEY, guestName.trim());
      }
    }
    setLoading(true);
    setError(null);
    try {
      const reply = await (0,_api__WEBPACK_IMPORTED_MODULE_2__.apiPost)(`feedback/${feedbackId}/replies`, {
        reply_uuid: generateUUID(),
        comment: text.trim(),
        ...(isGuest ? {
          author: guestName.trim()
        } : {})
      });
      setText('');
      onPosted(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply.');
    } finally {
      setLoading(false);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
    className: "markaroo-reply-composer",
    onSubmit: handleSubmit,
    children: [isGuest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
      className: "markaroo-reply-composer__name",
      type: "text",
      placeholder: "Your name",
      value: guestName,
      onChange: e => setGuestName(e.target.value),
      maxLength: 191
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "markaroo-reply-composer__input-wrap",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("textarea", {
        ref: textareaRef,
        className: "markaroo-reply-composer__textarea",
        rows: 2,
        placeholder: "Write a reply\u2026 (@mention to notify)",
        value: text,
        onChange: e => handleTextChange(e.target.value)
      }), mentionQuery !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_MentionAutocomplete__WEBPACK_IMPORTED_MODULE_1__.MentionAutocomplete, {
        query: mentionQuery,
        onSelect: insertMention,
        onClose: () => setMentionQuery(null)
      })]
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "markaroo-reply-composer__error",
      role: "alert",
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
      className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
      type: "submit",
      disabled: loading || !text.trim(),
      children: loading ? 'Posting…' : 'Reply'
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
/******/ 			return "" + chunkId + ".js?ver=" + "9af699799b33bd75c1f5" + "";
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