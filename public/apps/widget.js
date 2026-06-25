/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
    panelOpen,
    captureState
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_0__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_0__.useWidgetDispatch)();

  // Clean mode — no visible UI.
  if ('clean' === mode) {
    return null;
  }
  const label = window.markarooConfig?.i18n?.feedback ?? 'Feedback';
  const isCapturing = 'active' === captureState;
  function handleClick() {
    if (isCapturing) {
      return;
    }
    dispatch({
      type: 'TOGGLE_PANEL'
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
    className: `markaroo-launcher${panelOpen ? ' markaroo-launcher--active' : ''}${isCapturing ? ' markaroo-launcher--hidden' : ''}`,
    onClick: handleClick,
    "aria-label": label,
    "aria-expanded": panelOpen,
    type: "button",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
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

/***/ "./resources/assets/widget/PinsPanel.tsx"
/*!***********************************************!*\
  !*** ./resources/assets/widget/PinsPanel.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PinsPanel: () => (/* binding */ PinsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var _thread_ThreadView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./thread/ThreadView */ "./resources/assets/widget/thread/ThreadView.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
    className: `markaroo-feedback-row${active ? ' markaroo-feedback-row--active' : ''}`,
    type: "button",
    onClick: onOpen,
    "aria-pressed": active,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "markaroo-feedback-row__badge",
      style: {
        backgroundColor: PRIORITY_COLORS[item.priority] ?? '#6366f1'
      },
      children: number
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "markaroo-feedback-row__text",
      children: item.comment.slice(0, 80)
    }), item.status === 'resolved' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "markaroo-feedback-row__resolved",
      "aria-label": "Resolved",
      children: "\u2713"
    })]
  });
}
function PinsPanel() {
  const {
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
  if ('clean' === mode || !panelOpen || captureState === 'active') {
    return null;
  }
  const open = feedbacks.filter(f => f.status === 'open');
  const resolved = feedbacks.filter(f => f.status === 'resolved');
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("aside", {
    className: "markaroo-panel",
    role: "complementary",
    "aria-label": "Feedback panel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "markaroo-panel__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
        className: "markaroo-panel__title",
        children: "Feedback"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "markaroo-panel__header-actions",
        children: [showNewButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
          type: "button",
          onClick: () => dispatch({
            type: 'START_CAPTURE'
          }),
          children: "+ New"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          className: "markaroo-panel__close",
          type: "button",
          "aria-label": "Close",
          onClick: () => dispatch({
            type: 'CLOSE_PANEL'
          }),
          children: "\xD7"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "markaroo-panel__tabs",
      role: "tablist",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        className: `markaroo-panel__tab${tab === 'open' ? ' markaroo-panel__tab--active' : ''}`,
        role: "tab",
        "aria-selected": tab === 'open',
        type: "button",
        onClick: () => setTab('open'),
        children: ["Open (", open.length, ")"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        className: `markaroo-panel__tab${tab === 'resolved' ? ' markaroo-panel__tab--active' : ''}`,
        role: "tab",
        "aria-selected": tab === 'resolved',
        type: "button",
        onClick: () => setTab('resolved'),
        children: ["Resolved (", resolved.length, ")"]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "markaroo-panel__body",
      role: "tabpanel",
      children: activePinId !== null && feedbacks.find(f => f.id === activePinId) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_thread_ThreadView__WEBPACK_IMPORTED_MODULE_2__.ThreadView, {
        feedback: feedbacks.find(f => f.id === activePinId),
        onClose: () => dispatch({
          type: 'SET_ACTIVE_PIN',
          id: null
        })
      }) : visible.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "markaroo-panel__empty",
        children: tab === 'open' ? 'No open feedback yet.' : 'No resolved feedback.'
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "markaroo-feedback-list",
        children: visible.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(FeedbackRow, {
          item: item,
          number: feedbacks.indexOf(item) + 1,
          active: activePinId === item.id,
          onOpen: () => openPin(item.id)
        }, item.id))
      })
    })]
  });
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
/* harmony import */ var _PinsPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PinsPanel */ "./resources/assets/widget/PinsPanel.tsx");
/* harmony import */ var _pins_PinLayer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pins/PinLayer */ "./resources/assets/widget/pins/PinLayer.tsx");
/* harmony import */ var _capture_CaptureOverlay__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./capture/CaptureOverlay */ "./resources/assets/widget/capture/CaptureOverlay.tsx");
/* harmony import */ var _capture_AnnotationCanvas__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./capture/AnnotationCanvas */ "./resources/assets/widget/capture/AnnotationCanvas.tsx");
/* harmony import */ var _composer_ComposerPanel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./composer/ComposerPanel */ "./resources/assets/widget/composer/ComposerPanel.tsx");
/* harmony import */ var _capture_Screenshot__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./capture/Screenshot */ "./resources/assets/widget/capture/Screenshot.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);











function WidgetInner() {
  const {
    capturePhase,
    captureData,
    screenshotBlob,
    mode
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();

  // Trigger screenshot capture when transitioning into 'annotating'.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (capturePhase !== 'annotating') {
      return;
    }
    (0,_capture_Screenshot__WEBPACK_IMPORTED_MODULE_9__.captureScreenshot)().then(blob => {
      dispatch({
        type: 'SCREENSHOT_TAKEN',
        blob
      });
    });
  }, [capturePhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Admin-bar / external launcher: open the panel on click of `.markaroo-launch`.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onLaunch(e) {
      const el = e.target;
      if (el && el.closest('.markaroo-launch')) {
        e.preventDefault();
        dispatch({
          type: 'OPEN_PANEL'
        });
      }
    }
    document.addEventListener('click', onLaunch);
    return () => document.removeEventListener('click', onLaunch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnnotationsDone(annotations, burnedBlob) {
    dispatch({
      type: 'ANNOTATIONS_DONE',
      annotations,
      burnedBlob
    });
  }
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_ModeManager__WEBPACK_IMPORTED_MODULE_2__.ModeManager, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_Launcher__WEBPACK_IMPORTED_MODULE_3__.Launcher, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_pins_PinLayer__WEBPACK_IMPORTED_MODULE_5__.PinLayer, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_PinsPanel__WEBPACK_IMPORTED_MODULE_4__.PinsPanel, {}), 'clean' !== mode && 'selecting' === capturePhase && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_capture_CaptureOverlay__WEBPACK_IMPORTED_MODULE_6__.CaptureOverlay, {}), 'clean' !== mode && 'annotating' === capturePhase && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_capture_AnnotationCanvas__WEBPACK_IMPORTED_MODULE_7__.AnnotationCanvas, {
      screenshotBlob: screenshotBlob,
      onDone: handleAnnotationsDone,
      onCancel: handleCancelCapture
    }), 'clean' !== mode && 'composing' === capturePhase && captureData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_composer_ComposerPanel__WEBPACK_IMPORTED_MODULE_8__.ComposerPanel, {
      captureData: captureData,
      screenshotBlob: screenshotBlob,
      onSubmitted: handleSubmitted,
      onCancel: handleCancelCapture
    })]
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

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.WidgetProvider, {
    initialMode: initialMode,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(WidgetInner, {})
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

/***/ "./resources/assets/widget/capture/AnnotationCanvas.tsx"
/*!**************************************************************!*\
  !*** ./resources/assets/widget/capture/AnnotationCanvas.tsx ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnnotationCanvas: () => (/* binding */ AnnotationCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _annotationUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./annotationUtils */ "./resources/assets/widget/capture/annotationUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const COLORS = [{
  value: '#ef4444',
  label: 'Red'
}, {
  value: '#3b82f6',
  label: 'Blue'
}, {
  value: '#22c55e',
  label: 'Green'
}, {
  value: '#f59e0b',
  label: 'Yellow'
}, {
  value: '#1a1a2e',
  label: 'Black'
}];
const DEFAULT_COLOR = '#ef4444';
const STROKE_WIDTH = 3;
function AnnotationCanvas({
  screenshotBlob,
  onDone,
  onCancel
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const bgImageRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const drawingRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const currentRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [annotations, setAnnotations] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [tool, setTool] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('arrow');
  const [color, setColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(DEFAULT_COLOR);
  const [bgLoaded, setBgLoaded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Mirror state into refs so the canvas pointer handlers always have fresh values.
  const annotationsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(annotations);
  annotationsRef.current = annotations;
  const toolRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(tool);
  toolRef.current = tool;
  const colorRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(color);
  colorRef.current = color;

  // -----------------------------------------------------------------------
  // Canvas drawing
  // -----------------------------------------------------------------------
  const redraw = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0);
    }
    (0,_annotationUtils__WEBPACK_IMPORTED_MODULE_1__.renderAnnotations)(ctx, annotationsRef.current, canvas.width, canvas.height);
    if (currentRef.current) {
      (0,_annotationUtils__WEBPACK_IMPORTED_MODULE_1__.renderAnnotationItem)(ctx, currentRef.current, canvas.width, canvas.height);
    }
  }, []);

  // Load background image when blob changes.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!screenshotBlob) {
      // No screenshot — set canvas to viewport size.
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setBgLoaded(true);
      }
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(screenshotBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      bgImageRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      setBgLoaded(true);
      redraw();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setBgLoaded(true);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [screenshotBlob, redraw]);

  // Redraw when annotations change.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (bgLoaded) {
      redraw();
    }
  }, [annotations, bgLoaded, redraw]);

  // -----------------------------------------------------------------------
  // Pointer handlers (pointer events = works on touch + mouse)
  // -----------------------------------------------------------------------
  function handlePointerDown(e) {
    if (!canvasRef.current) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const {
      xPct,
      yPct
    } = (0,_annotationUtils__WEBPACK_IMPORTED_MODULE_1__.canvasPct)(e.clientX, e.clientY, canvasRef.current);
    currentRef.current = {
      tool: toolRef.current,
      from: {
        xPct,
        yPct
      },
      to: {
        xPct,
        yPct
      },
      color: colorRef.current,
      width: STROKE_WIDTH
    };
  }
  function handlePointerMove(e) {
    if (!drawingRef.current || !canvasRef.current || !currentRef.current) {
      return;
    }
    const {
      xPct,
      yPct
    } = (0,_annotationUtils__WEBPACK_IMPORTED_MODULE_1__.canvasPct)(e.clientX, e.clientY, canvasRef.current);
    currentRef.current = {
      ...currentRef.current,
      to: {
        xPct,
        yPct
      }
    };
    redraw();
  }
  function handlePointerUp() {
    if (!drawingRef.current || !currentRef.current) {
      return;
    }
    drawingRef.current = false;
    const ann = currentRef.current;
    currentRef.current = null;

    // Ignore tiny accidental clicks.
    const dx = Math.abs(ann.to.xPct - ann.from.xPct);
    const dy = Math.abs(ann.to.yPct - ann.from.yPct);
    if (dx > 0.005 || dy > 0.005) {
      setAnnotations(prev => {
        const next = [...prev, ann];
        window.dispatchEvent(new CustomEvent('markaroo:annotation-changed', {
          detail: {
            annotations: next
          }
        }));
        return next;
      });
    } else {
      redraw();
    }
  }

  // -----------------------------------------------------------------------
  // Toolbar actions
  // -----------------------------------------------------------------------
  function undo() {
    setAnnotations(prev => prev.slice(0, -1));
  }
  function clear() {
    setAnnotations([]);
  }
  async function handleDone() {
    const anns = annotationsRef.current;

    // Build format/quality from config for burn-in.
    const opts = window.markarooConfig?.screenshotOptions;
    const burned = screenshotBlob ? await (0,_annotationUtils__WEBPACK_IMPORTED_MODULE_1__.burnAnnotationsIntoBlob)(screenshotBlob, anns, opts?.format ?? 'jpeg', opts?.quality ?? 0.8) : null;
    onDone(anns, burned);
  }

  // -----------------------------------------------------------------------
  // Available tools from config filter seam (PHP injects annotationTools).
  // -----------------------------------------------------------------------
  const availableTools = (window.markarooConfig?.annotationTools ?? ['arrow', 'rect', 'circle']).filter(t => ['arrow', 'rect', 'circle'].includes(t));
  const toolIcons = {
    arrow: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      "aria-hidden": "true",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
        d: "M5 12h14M12 5l7 7-7 7"
      })
    }),
    rect: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      "aria-hidden": "true",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "1"
      })
    }),
    circle: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      "aria-hidden": "true",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      })
    })
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "markaroo-annotation-wrap",
    children: [!bgLoaded && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "markaroo-annotation-loading",
      "aria-live": "polite",
      children: "Capturing screenshot\u2026"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: `markaroo-annotation-stage${bgLoaded ? ' markaroo-annotation-stage--ready' : ''}`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("canvas", {
        ref: canvasRef,
        className: "markaroo-annotation-canvas",
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        style: {
          cursor: 'crosshair'
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-annotation-toolbar",
      role: "toolbar",
      "aria-label": "Annotation tools",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-annotation-tools",
        children: availableTools.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: `markaroo-annotation-tool${tool === t ? ' markaroo-annotation-tool--active' : ''}`,
          onClick: () => setTool(t),
          "aria-pressed": tool === t,
          "aria-label": t,
          type: "button",
          children: toolIcons[t]
        }, t))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-annotation-divider",
        role: "separator"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-annotation-colors",
        role: "group",
        "aria-label": "Color",
        children: COLORS.map(c => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: `markaroo-annotation-color${color === c.value ? ' markaroo-annotation-color--active' : ''}`,
          style: {
            backgroundColor: c.value
          },
          onClick: () => setColor(c.value),
          "aria-label": c.label,
          "aria-pressed": color === c.value,
          type: "button"
        }, c.value))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-annotation-divider",
        role: "separator"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: "markaroo-annotation-action",
        onClick: undo,
        disabled: annotations.length === 0,
        "aria-label": "Undo",
        type: "button",
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
        className: "markaroo-annotation-action",
        onClick: clear,
        disabled: annotations.length === 0,
        "aria-label": "Clear all",
        type: "button",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          "aria-hidden": "true",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
            points: "3 6 5 6 21 6"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M19 6l-1 14H6L5 6"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-annotation-divider",
        role: "separator"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: "markaroo-annotation-action markaroo-annotation-action--cancel",
        onClick: onCancel,
        type: "button",
        children: "Cancel"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: "markaroo-annotation-action markaroo-annotation-action--done",
        onClick: handleDone,
        type: "button",
        children: "Done"
      })]
    })]
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
/* harmony import */ var _RegionSelect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RegionSelect */ "./resources/assets/widget/capture/RegionSelect.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function CaptureOverlay() {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_1__.useWidgetDispatch)();
  const [tool, setTool] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('click');
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
    children: [tool === 'click' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ClickCapture__WEBPACK_IMPORTED_MODULE_2__.ClickCapture, {
      onCapture: handleCapture
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_RegionSelect__WEBPACK_IMPORTED_MODULE_3__.RegionSelect, {
      onCapture: handleCapture
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "markaroo-capture-toolbar",
      role: "toolbar",
      "aria-label": "Capture tools",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "markaroo-capture-notice",
        children: tool === 'click' ? 'Click anywhere to place a feedback pin' : 'Drag to select a region'
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "markaroo-capture-tools",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
          className: `markaroo-capture-tool${tool === 'click' ? ' markaroo-capture-tool--active' : ''}`,
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
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
          className: `markaroo-capture-tool${tool === 'region' ? ' markaroo-capture-tool--active' : ''}`,
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
              rx: "2"
            })
          }), "Region"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
        className: "markaroo-capture-cancel",
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

/***/ "./resources/assets/widget/capture/RegionSelect.tsx"
/*!**********************************************************!*\
  !*** ./resources/assets/widget/capture/RegionSelect.tsx ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegionSelect: () => (/* binding */ RegionSelect)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _captureUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./captureUtils */ "./resources/assets/widget/capture/captureUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const HANDLES = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const MIN_SIZE = 20;
function normalizeRect(x0, y0, x1, y1) {
  return {
    left: Math.min(x0, x1),
    top: Math.min(y0, y1),
    width: Math.abs(x1 - x0),
    height: Math.abs(y1 - y0)
  };
}
function clampRect(r) {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const left = Math.max(0, Math.min(r.left, vw - MIN_SIZE));
  const top = Math.max(0, Math.min(r.top, vh - MIN_SIZE));
  const width = Math.min(r.width, vw - left);
  const height = Math.min(r.height, vh - top);
  return {
    left,
    top,
    width: Math.max(MIN_SIZE, width),
    height: Math.max(MIN_SIZE, height)
  };
}
function applyHandleResize(orig, handle, dx, dy) {
  let {
    left,
    top,
    width,
    height
  } = orig;
  if (handle.includes('n')) {
    top += dy;
    height -= dy;
  }
  if (handle.includes('s')) {
    height += dy;
  }
  if (handle.includes('w')) {
    left += dx;
    width -= dx;
  }
  if (handle.includes('e')) {
    width += dx;
  }
  return clampRect({
    left,
    top,
    width,
    height
  });
}
function RegionSelect({
  onCapture
}) {
  const [phase, setPhase] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    name: 'idle'
  });
  const containerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Pointer down on overlay (start drawing) or on region body (start moving).
  const handleOverlayPointerDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    if (e.target.closest('.markaroo-capture-toolbar,.markaroo-region-handle,.markaroo-region-confirm')) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase({
      name: 'drawing',
      x0: e.clientX,
      y0: e.clientY,
      x1: e.clientX,
      y1: e.clientY
    });
  }, []);
  const handlePointerMove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    setPhase(prev => {
      if (prev.name === 'drawing') {
        return {
          ...prev,
          x1: e.clientX,
          y1: e.clientY
        };
      }
      if (prev.name === 'moving') {
        const dx = e.clientX - prev.startX;
        const dy = e.clientY - prev.startY;
        return {
          ...prev,
          rect: clampRect({
            left: prev.origRect.left + dx,
            top: prev.origRect.top + dy,
            width: prev.origRect.width,
            height: prev.origRect.height
          })
        };
      }
      if (prev.name === 'resizing') {
        const dx = e.clientX - prev.startX;
        const dy = e.clientY - prev.startY;
        return {
          ...prev,
          rect: applyHandleResize(prev.origRect, prev.handle, dx, dy)
        };
      }
      return prev;
    });
  }, []);
  const handlePointerUp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    setPhase(prev => {
      if (prev.name === 'drawing') {
        const rect = normalizeRect(prev.x0, prev.y0, prev.x1, prev.y1);
        if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
          return {
            name: 'idle'
          };
        }
        return {
          name: 'drawn',
          rect
        };
      }
      if (prev.name === 'moving' || prev.name === 'resizing') {
        return {
          name: 'drawn',
          rect: prev.rect
        };
      }
      return prev;
    });
  }, []);
  function startMove(e, rect) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase({
      name: 'moving',
      rect,
      startX: e.clientX,
      startY: e.clientY,
      origRect: rect
    });
  }
  function startResize(e, handle, rect) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase({
      name: 'resizing',
      rect,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origRect: rect
    });
  }
  function confirmRegion(rect) {
    const data = (0,_captureUtils__WEBPACK_IMPORTED_MODULE_1__.buildRegionCaptureData)(rect.left, rect.top, rect.width, rect.height);
    window.dispatchEvent(new CustomEvent('markaroo:region-selected', {
      detail: {
        captureData: data
      }
    }));
    onCapture(data);
  }
  const currentRect = phase.name === 'drawing' ? normalizeRect(phase.x0, phase.y0, phase.x1, phase.y1) : phase.name === 'drawn' || phase.name === 'moving' || phase.name === 'resizing' ? phase.rect : null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    ref: containerRef,
    className: "markaroo-capture-overlay markaroo-capture-overlay--region",
    onPointerDown: handleOverlayPointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    role: "presentation",
    children: currentRect && currentRect.width >= MIN_SIZE && currentRect.height >= MIN_SIZE && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-region-box",
      style: {
        left: currentRect.left,
        top: currentRect.top,
        width: currentRect.width,
        height: currentRect.height
      },
      children: [(phase.name === 'drawn' || phase.name === 'moving') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-region-body",
        onPointerDown: e => startMove(e, currentRect),
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
      }), (phase.name === 'drawn' || phase.name === 'resizing') && HANDLES.map(h => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: `markaroo-region-handle markaroo-region-handle--${h}`,
        onPointerDown: e => startResize(e, h, currentRect),
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
      }, h)), phase.name === 'drawn' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: "markaroo-region-confirm",
        onClick: () => confirmRegion(currentRect),
        type: "button",
        children: "Capture Region"
      })]
    })
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
/* harmony export */   captureScreenshot: () => (/* binding */ captureScreenshot),
/* harmony export */   uploadScreenshot: () => (/* binding */ uploadScreenshot)
/* harmony export */ });
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
/* harmony export */   getViewport: () => (/* binding */ getViewport),
/* harmony export */   toCaptureRect: () => (/* binding */ toCaptureRect),
/* harmony export */   toElementOffset: () => (/* binding */ toElementOffset),
/* harmony export */   toPagePct: () => (/* binding */ toPagePct)
/* harmony export */ });
function getViewport() {
  return `${window.innerWidth}x${window.innerHeight}`;
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
  const screenshotRect = {
    type: 'point',
    selector,
    elementOffset,
    rect: null,
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
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _capture_Screenshot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../capture/Screenshot */ "./resources/assets/widget/capture/Screenshot.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







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
function getPageKey() {
  return (window.location.pathname.replace(/\/+$/, '') || '/') + window.location.search;
}
function getViewport() {
  return `${window.innerWidth}x${window.innerHeight}`;
}
function ComposerPanel({
  captureData,
  screenshotBlob,
  onSubmitted,
  onCancel
}) {
  const config = window.markarooConfig;
  const isGuest = config.currentUser?.id === 0;
  const defaultPri = config.settings?.['general.default_priority'] ?? 'normal';
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
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [guestName, setGuestName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => typeof localStorage !== 'undefined' && localStorage.getItem(GUEST_NAME_KEY) || '');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Load assignable users once if feature enabled.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    if (!enableAssignment || !canAssign) {
      return;
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiFetch)('users?per_page=50').then(setUsers).catch(() => null);
  });

  // Screenshot preview URL from blob.
  const previewUrl = screenshotBlob ? URL.createObjectURL(screenshotBlob) : null;
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

    // Persist guest name for next time.
    if (isGuest && typeof localStorage !== 'undefined') {
      localStorage.setItem(GUEST_NAME_KEY, guestName.trim());
    }
    const payload = {
      comment,
      priority,
      page_key: getPageKey(),
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
      } : {})
    };
    if (isGuest) {
      payload.author = guestName.trim();
    }

    /**
     * Pro can add extra fields via markaroo/composer/fields filter.
     * JS-side hook fires so UI extensions can inject data before POST.
     */
    window.dispatchEvent(new CustomEvent('markaroo:composer-before-submit', {
      detail: {
        payload
      }
    }));
    try {
      const item = await (0,_api__WEBPACK_IMPORTED_MODULE_4__.apiPost)('feedback', payload);

      // Deferred screenshot upload — non-fatal if it fails.
      if (screenshotBlob && item.id) {
        (0,_capture_Screenshot__WEBPACK_IMPORTED_MODULE_5__.uploadScreenshot)(item.id, screenshotBlob).catch(() => null);
      }
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "markaroo-composer",
    role: "dialog",
    "aria-label": "New feedback",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "markaroo-composer__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
        className: "markaroo-composer__title",
        children: "New feedback"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
        className: "markaroo-composer__close",
        type: "button",
        "aria-label": "Cancel",
        onClick: onCancel,
        children: "\u2715"
      })]
    }), previewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "markaroo-composer__preview",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: previewUrl,
        alt: "Screenshot preview"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("form", {
      className: "markaroo-composer__form",
      onSubmit: handleSubmit,
      noValidate: true,
      children: [isGuest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          htmlFor: "markaroo-guest-name",
          children: "Your name"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
          id: "markaroo-guest-name",
          type: "text",
          className: "markaroo-composer__input",
          value: guestName,
          onChange: e => setGuestName(e.target.value),
          placeholder: "Enter your name",
          maxLength: 191,
          required: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field markaroo-composer__field--comment",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          htmlFor: "markaroo-comment",
          children: "Comment"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_MarkdownToolbar__WEBPACK_IMPORTED_MODULE_1__.MarkdownToolbar, {
          textareaRef: textareaRef,
          value: comment,
          onChange: setComment
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("textarea", {
          ref: textareaRef,
          id: "markaroo-comment",
          className: "markaroo-composer__textarea",
          value: comment,
          onChange: e => setComment(e.target.value),
          placeholder: "Describe the feedback\u2026",
          rows: 5,
          required: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          htmlFor: "markaroo-priority",
          children: "Priority"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("select", {
          id: "markaroo-priority",
          className: "markaroo-composer__select",
          value: priority,
          onChange: e => setPriority(e.target.value),
          children: PRIORITIES.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("option", {
            value: p.value,
            children: p.label
          }, p.value))
        })]
      }), enableAssignment && canAssign && users.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          htmlFor: "markaroo-assignee",
          children: "Assign to"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("select", {
          id: "markaroo-assignee",
          className: "markaroo-composer__select",
          value: assigneeId,
          onChange: e => {
            const id = Number(e.target.value);
            setAssigneeId(id);
            setAssigneeName(users.find(u => u.id === id)?.name ?? '');
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("option", {
            value: "0",
            children: "Unassigned"
          }), users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("option", {
            value: u.id,
            children: u.name
          }, u.id))]
        })]
      }), enableDueDates && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          htmlFor: "markaroo-due",
          children: "Due date"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
          id: "markaroo-due",
          type: "date",
          className: "markaroo-composer__input",
          value: dueDate,
          onChange: e => setDueDate(e.target.value)
        })]
      }), enableTags && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          children: "Tags"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_TagInput__WEBPACK_IMPORTED_MODULE_2__.TagInput, {
          tags: tags,
          onChange: setTags
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          children: "Attachments"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_AttachmentPicker__WEBPACK_IMPORTED_MODULE_3__.AttachmentPicker, {
          attachments: attachments,
          onChange: setAttachments
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "markaroo-composer__error",
        role: "alert",
        children: error
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "markaroo-composer__actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          type: "button",
          className: "markaroo-btn markaroo-btn--ghost",
          onClick: onCancel,
          disabled: loading,
          children: "Cancel"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          type: "submit",
          className: "markaroo-btn markaroo-btn--primary",
          disabled: loading,
          children: loading ? 'Submitting…' : 'Submit'
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
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function getPageKey() {
  return (window.location.pathname.replace(/\/+$/, '') || '/') + window.location.search;
}
function PinLayer() {
  const {
    feedbacks,
    captureState,
    activePinId,
    mode
  } = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__.useWidget)();
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_3__.useWidgetDispatch)();
  const loadedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);

  // Load page feedback on mount.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (loadedRef.current || mode === 'clean') {
      return;
    }
    loadedRef.current = true;
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.apiFetch)(`feedback?page_key=${encodeURIComponent(getPageKey())}&per_page=100`).then(res => dispatch({
      type: 'FEEDBACKS_LOADED',
      items: res.data
    })).catch(() => null);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

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
      null;
    }
  }
  if (mode === 'clean' || feedbacks.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "markaroo-pin-layer",
    "aria-label": "Feedback pins",
    children: feedbacks.map((item, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_PinMarker__WEBPACK_IMPORTED_MODULE_1__.PinMarker, {
      item: item,
      number: idx + 1,
      dimmed: captureState === 'active',
      active: activePinId === item.id,
      canDrag: mode === 'comment',
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
  const pinLeft = `${localX * 100}%`;
  const pinTop = `${localY * 100}%`;
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
      const newX = Math.min(1, Math.max(0, dragRef.current.pinX + dx / window.innerWidth));
      const newY = Math.min(1, Math.max(0, dragRef.current.pinY + dy / window.innerHeight));
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
  captureState: 'idle',
  capturePhase: 'idle',
  captureData: null,
  screenshotBlob: null,
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
    case 'START_CAPTURE':
      return {
        ...state,
        captureState: 'active',
        capturePhase: 'selecting',
        captureData: null,
        screenshotBlob: null,
        panelOpen: false
      };
    case 'PIN_PLACED':
      return {
        ...state,
        capturePhase: 'annotating',
        captureData: action.data,
        screenshotBlob: null
      };
    case 'SCREENSHOT_TAKEN':
      return {
        ...state,
        screenshotBlob: action.blob
      };
    case 'ANNOTATIONS_DONE':
      {
        const prevData = state.captureData;
        const nextData = prevData ? {
          ...prevData,
          screenshotRect: {
            ...prevData.screenshotRect,
            annotations: action.annotations
          }
        } : null;
        return {
          ...state,
          capturePhase: 'composing',
          captureData: nextData,
          screenshotBlob: action.burnedBlob ?? state.screenshotBlob
        };
      }
    case 'END_CAPTURE':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        screenshotBlob: null
      };
    case 'FEEDBACK_SUBMITTED':
      return {
        ...state,
        captureState: 'idle',
        capturePhase: 'idle',
        captureData: null,
        screenshotBlob: null,
        panelOpen: true,
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

/***/ "./resources/assets/widget/thread/ThreadView.tsx"
/*!*******************************************************!*\
  !*** ./resources/assets/widget/thread/ThreadView.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThreadView: () => (/* binding */ ThreadView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ReplyComposer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ReplyComposer */ "./resources/assets/widget/thread/ReplyComposer.tsx");
/* harmony import */ var _AttachmentList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AttachmentList */ "./resources/assets/widget/thread/AttachmentList.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./resources/assets/widget/api.ts");
/* harmony import */ var _store_WidgetContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/WidgetContext */ "./resources/assets/widget/store/WidgetContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) {
    return 'just now';
  }
  if (m < 60) {
    return `${m}m ago`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h}h ago`;
  }
  return `${Math.floor(h / 24)}d ago`;
}
function ReplyRow({
  reply,
  canEdit,
  onUpdated,
  onDeleted
}) {
  const [editing, setEditing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [draft, setDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(reply.comment);
  const [confirm, setConfirm] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  async function saveEdit() {
    if (!draft.trim()) {
      return;
    }
    try {
      const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiPatch)(`replies/${reply.id}`, {
        comment: draft.trim()
      });
      onUpdated(updated);
      setEditing(false);
    } catch {
      setEditing(false);
    }
  }
  async function confirmDelete() {
    await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiDelete)(`replies/${reply.id}`).catch(() => null);
    onDeleted(reply.id);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "markaroo-reply",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-reply__meta",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "markaroo-reply__author",
        children: reply.author
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "markaroo-reply__time",
        title: reply.created_at,
        children: timeAgo(reply.created_at)
      })]
    }), editing ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-reply__edit",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("textarea", {
        className: "markaroo-reply__edit-textarea",
        value: draft,
        onChange: e => setDraft(e.target.value),
        rows: 2,
        autoFocus: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "markaroo-reply__edit-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
          type: "button",
          onClick: saveEdit,
          children: "Save"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
          type: "button",
          onClick: () => setEditing(false),
          children: "Cancel"
        })]
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "markaroo-reply__body",
      children: reply.comment
    }), canEdit && !editing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-reply__actions",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "markaroo-reply__action",
        type: "button",
        onClick: () => setEditing(true),
        children: "Edit"
      }), !confirm ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "markaroo-reply__action markaroo-reply__action--danger",
        type: "button",
        onClick: () => setConfirm(true),
        children: "Delete"
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          className: "markaroo-reply__confirm-text",
          children: "Sure?"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          className: "markaroo-reply__action markaroo-reply__action--danger",
          type: "button",
          onClick: confirmDelete,
          children: "Yes"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          className: "markaroo-reply__action",
          type: "button",
          onClick: () => setConfirm(false),
          children: "No"
        })]
      })]
    })]
  });
}
function ThreadView({
  feedback,
  onClose
}) {
  const dispatch = (0,_store_WidgetContext__WEBPACK_IMPORTED_MODULE_4__.useWidgetDispatch)();
  const config = window.markarooConfig;
  const userId = config?.currentUser?.id ?? 0;
  const canManage = config?.currentUser?.canManage ?? false;
  const [item, setItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback);
  const [replies, setReplies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [editingComment, setEditingComment] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [commentDraft, setCommentDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(feedback.comment);
  const [confirmDelete, setConfirmDelete] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiFetch)(`feedback/${feedback.id}`).then(data => {
      setItem(data);
      setReplies(data.replies ?? []);
    }).catch(() => null).finally(() => setLoading(false));
  }, [feedback.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveComment() {
    try {
      const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiPatch)(`feedback/${item.id}`, {
        comment: commentDraft
      });
      setItem(updated);
      dispatch({
        type: 'FEEDBACK_UPDATED',
        item: updated
      });
      setEditingComment(false);
    } catch {
      setEditingComment(false);
    }
  }
  async function handleDelete() {
    await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiDelete)(`feedback/${item.id}`).catch(() => null);
    dispatch({
      type: 'FEEDBACK_DELETED',
      id: item.id
    });
    onClose();
  }
  async function toggleResolve() {
    const ep = item.status === 'open' ? `feedback/${item.id}/resolve` : `feedback/${item.id}/unresolve`;
    const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.apiFetch)(ep, {
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
  const canEditComment = canManage || userId === item.author_id;
  const canDeleteItem = canManage || userId === item.author_id;
  const canResolve = canManage;
  const canReply = config?.currentUser?.canCreate || config?.shareRights?.canComment;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "markaroo-thread",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-thread__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: "markaroo-thread__back",
        type: "button",
        onClick: onClose,
        "aria-label": "Back",
        children: "\u2190"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
        className: "markaroo-thread__title",
        children: ["Feedback #", item.id]
      }), canResolve && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        className: `markaroo-btn markaroo-btn--sm ${item.status === 'resolved' ? 'markaroo-btn--ghost' : 'markaroo-btn--primary'}`,
        type: "button",
        onClick: toggleResolve,
        children: item.status === 'resolved' ? 'Unresolve' : 'Resolve'
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-thread__body",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "markaroo-thread__comment",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "markaroo-reply__meta",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "markaroo-reply__author",
            children: item.author
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "markaroo-reply__time",
            children: timeAgo(item.created_at)
          })]
        }), editingComment ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "markaroo-reply__edit",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("textarea", {
            className: "markaroo-reply__edit-textarea",
            value: commentDraft,
            onChange: e => setCommentDraft(e.target.value),
            rows: 3,
            autoFocus: true
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "markaroo-reply__edit-actions",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
              className: "markaroo-btn markaroo-btn--primary markaroo-btn--sm",
              type: "button",
              onClick: saveComment,
              children: "Save"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
              className: "markaroo-btn markaroo-btn--ghost markaroo-btn--sm",
              type: "button",
              onClick: () => setEditingComment(false),
              children: "Cancel"
            })]
          })]
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "markaroo-thread__comment-body",
          children: item.comment
        }), (canEditComment || canDeleteItem) && !editingComment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "markaroo-reply__actions",
          children: [canEditComment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
            className: "markaroo-reply__action",
            type: "button",
            onClick: () => setEditingComment(true),
            children: "Edit"
          }), canDeleteItem && !confirmDelete && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
            className: "markaroo-reply__action markaroo-reply__action--danger",
            type: "button",
            onClick: () => setConfirmDelete(true),
            children: "Delete"
          }), confirmDelete && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "markaroo-reply__confirm-text",
              children: "Delete this feedback?"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
              className: "markaroo-reply__action markaroo-reply__action--danger",
              type: "button",
              onClick: handleDelete,
              children: "Yes, delete"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
              className: "markaroo-reply__action",
              type: "button",
              onClick: () => setConfirmDelete(false),
              children: "Cancel"
            })]
          })]
        })]
      }), item.screenshot_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
        className: "markaroo-thread__screenshot",
        src: item.screenshot_url,
        alt: "Screenshot",
        loading: "lazy"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_AttachmentList__WEBPACK_IMPORTED_MODULE_2__.AttachmentList, {
        attachments: item.attachments
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "markaroo-thread__replies",
        children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "markaroo-thread__loading",
          children: "Loading\u2026"
        }), replies.map(r => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(ReplyRow, {
          reply: r,
          canEdit: canManage || userId === r.author_id,
          onUpdated: updated => setReplies(prev => prev.map(x => x.id === updated.id ? updated : x)),
          onDeleted: id => setReplies(prev => prev.filter(x => x.id !== id))
        }, r.id))]
      }), canReply && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ReplyComposer__WEBPACK_IMPORTED_MODULE_1__.ReplyComposer, {
        feedbackId: item.id,
        onPosted: r => setReplies(prev => [...prev, r])
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