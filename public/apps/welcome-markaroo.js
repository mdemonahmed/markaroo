/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/assets/apps/welcome-markaroo/WelcomeApp.tsx"
/*!***************************************************************!*\
  !*** ./resources/assets/apps/welcome-markaroo/WelcomeApp.tsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WelcomeApp: () => (/* binding */ WelcomeApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



/**
 * First-run onboarding: welcome screen + 3-step quick-setup wizard.
 * Full-bleed, always skippable, fires once (guarded server-side).
 */

const boot = window.markarooWelcome ?? {
  dashboardUrl: '',
  siteUrl: '',
  firstName: ''
};
const config = window.markarooConfig ?? {
  restUrl: '',
  nonce: '',
  pluginUrl: ''
};
const restBase = config.restUrl + 'markaroo/v1/onboarding/';
function post(route, body) {
  return fetch(restBase + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': config.nonce
    },
    body: JSON.stringify(body)
  });
}
function WelcomeApp() {
  const [phase, setPhase] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('welcome');
  const [access, setAccess] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('team_clients');
  const [screenshots, setScreenshots] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [annotate, setAnnotate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [checklist, setChecklist] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [busy, setBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const markUrl = config.pluginUrl + 'public/images/wpbones-logo.png';
  const finish = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(target => {
    setBusy(true);
    post('complete', {}).finally(() => {
      window.location.href = target || boot.dashboardUrl;
    });
  }, []);
  const saveStep = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((step, data) => {
    // Fire-and-forget; the wizard never blocks on a slow network.
    post('step', {
      step,
      data
    }).catch(() => undefined);
  }, []);
  function goStep2() {
    saveStep(1, {
      access
    });
    setPhase(2);
  }
  function goStep3() {
    saveStep(2, {
      screenshots,
      annotate
    });
    setPhase(3);
    // Pull live checklist state for the final step.
    fetch(restBase + 'state', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : null).then(s => s && setChecklist(s)).catch(() => undefined);
  }
  const ACCESS_CHOICES = [{
    value: 'team_only',
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('My team only', 'markaroo'),
    hint: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Logged-in WordPress users only.', 'markaroo')
  }, {
    value: 'team_clients',
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Team + clients', 'markaroo'),
    hint: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your team plus people you share links with.', 'markaroo')
  }, {
    value: 'anyone_link',
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Anyone with a link', 'markaroo'),
    hint: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No login required to comment.', 'markaroo')
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "markaroo-app markaroo-welcome",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "markaroo-welcome__card",
      children: [phase !== 'welcome' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "markaroo-stepper",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Setup progress', 'markaroo'),
        children: [1, 2, 3].map(n => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: 'markaroo-stepper__dot' + (phase === n ? ' markaroo-stepper__dot--active' : '') + (typeof phase === 'number' && n < phase ? ' markaroo-stepper__dot--done' : '')
        }, n))
      }), phase === 'welcome' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "markaroo-welcome__mark",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
            src: markUrl,
            alt: ""
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "markaroo-welcome__eyebrow",
          children: boot.firstName ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: user first name. */(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hello, %s!', 'markaroo'), boot.firstName) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hello there!', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h1", {
          className: "markaroo-welcome__title",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Welcome to Markaroo', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "markaroo-welcome__body",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collect visual feedback right on your live pages. Turn comments into tasks. Share a no-login link with clients in seconds.', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "markaroo-welcome__actions",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--primary markaroo-btn--lg",
            onClick: () => setPhase(1),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Let's Start", 'markaroo')
          })
        })]
      }), phase === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
          className: "markaroo-welcome__step-head",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Who gives feedback?', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "markaroo-welcome__step-sub",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sets your default access. You can change it anytime in Settings.', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "markaroo-welcome__choices",
          children: ACCESS_CHOICES.map(c => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
            type: "button",
            className: 'markaroo-choice' + (access === c.value ? ' markaroo-choice--active' : ''),
            "aria-pressed": access === c.value,
            onClick: () => setAccess(c.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              className: "markaroo-choice__title",
              children: c.title
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              className: "markaroo-choice__hint",
              children: c.hint
            })]
          }, c.value))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "markaroo-welcome__nav",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--ghost",
            onClick: () => setPhase('welcome'),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Back', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--primary",
            onClick: goStep2,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Continue', 'markaroo')
          })]
        })]
      }), phase === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
          className: "markaroo-welcome__step-head",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Capture defaults', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "markaroo-welcome__step-sub",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('How much detail should each comment capture?', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "markaroo-welcome__choices",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
            className: "markaroo-toggle",
            htmlFor: "markaroo-onboard-screenshots",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Capture screenshots with each comment', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              id: "markaroo-onboard-screenshots",
              type: "checkbox",
              checked: screenshots,
              onChange: e => setScreenshots(e.target.checked)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
            className: "markaroo-toggle",
            htmlFor: "markaroo-onboard-annotate",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Let reviewers draw and annotate', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              id: "markaroo-onboard-annotate",
              type: "checkbox",
              checked: annotate,
              onChange: e => setAnnotate(e.target.checked)
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "markaroo-welcome__nav",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--ghost",
            onClick: () => setPhase(1),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Back', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--primary",
            onClick: goStep3,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Continue', 'markaroo')
          })]
        })]
      }), phase === 3 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
          className: "markaroo-welcome__step-head",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("You're set!", 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "markaroo-welcome__step-sub",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Finish these to get the most out of Markaroo.', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("ul", {
          className: "markaroo-checklist",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChecklistItem, {
            done: !!checklist?.configured,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Configure capture defaults', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChecklistItem, {
            done: !!checklist?.has_share_link,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Create your first share link', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChecklistItem, {
            done: !!checklist?.has_feedback,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collect your first feedback', 'markaroo')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "markaroo-welcome__nav",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--secondary",
            disabled: busy,
            onClick: () => finish(boot.siteUrl),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Open my site', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            className: "markaroo-btn markaroo-btn--primary",
            disabled: busy,
            onClick: () => finish(boot.dashboardUrl),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Go to Dashboard', 'markaroo')
          })]
        })]
      })]
    }), phase === 'welcome' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
      type: "button",
      className: "markaroo-welcome__skip",
      disabled: busy,
      onClick: () => finish(boot.dashboardUrl),
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('I already know, skip it!', 'markaroo')
    })]
  });
}
function ChecklistItem({
  done,
  label
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
    className: "markaroo-checklist__item",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: 'markaroo-checklist__tick' + (done ? ' markaroo-checklist__tick--done' : ''),
      children: done ? '✓' : ''
    }), label]
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
/*!**********************************************************!*\
  !*** ./resources/assets/apps/welcome-markaroo/index.tsx ***!
  \**********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WelcomeApp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WelcomeApp */ "./resources/assets/apps/welcome-markaroo/WelcomeApp.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const container = document.getElementById('markaroo-welcome-root');
if (container) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(container).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_WelcomeApp__WEBPACK_IMPORTED_MODULE_1__.WelcomeApp, {}));
}
})();

/******/ })()
;
//# sourceMappingURL=welcome-markaroo.js.map