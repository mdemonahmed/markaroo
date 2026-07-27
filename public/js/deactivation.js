/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!*********************************************!*\
  !*** ./resources/assets/js/deactivation.ts ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Deactivation dialog for plugins.php.
 *
 * Intercepts Markaroo's Deactivate link and offers: keep data (default),
 * delete ALL data (checkbox-gated, calls the purge endpoint), an optional
 * reason survey, and an inline bug-report form. Closing the dialog always
 * cancels; "Skip & deactivate" always works — the user is never trapped.
 */

const config = window.markarooDeactivation;
const REASONS = [['temporary', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Temporary deactivation', 'markaroo')], ['bug', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('I found a bug', 'markaroo')], ['missing-feature', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Missing a feature I need', 'markaroo')], ['project-done', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Done with this project', 'markaroo')], ['other', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Other', 'markaroo')]];
function el(root, sel) {
  return root.querySelector(sel);
}

/**
 * Escape a string for safe interpolation into the modal's HTML template
 * (element and double-quoted attribute contexts). Everything interpolated is
 * a `__()` translation, but translation files are not a trust boundary we
 * want to rely on.
 * @param s
 */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Send survey/bug text through the existing plugin-feedback pipeline.
 * @param subject
 * @param message
 * @param keepalive
 */
function sendFeedback(subject, message, keepalive) {
  return fetch(`${config.restUrl}/plugin-feedback`, {
    method: 'POST',
    keepalive,
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': config.nonce
    },
    body: JSON.stringify({
      name: config.userName || 'WordPress admin',
      email: config.userEmail,
      subject,
      message
    })
  });
}
function buildModal() {
  const overlay = document.createElement('div');
  overlay.className = 'markaroo-deactivation-overlay';
  overlay.innerHTML = `
	<div class="markaroo-deactivation" role="dialog" aria-modal="true" aria-label="${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deactivate Markaroo', 'markaroo'))}" tabindex="-1">
		<div class="markaroo-deactivation__head">
			<h2>${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deactivate Markaroo', 'markaroo'))}</h2>
			<button type="button" class="markaroo-deactivation__close" aria-label="${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close', 'markaroo'))}">&times;</button>
		</div>

		<fieldset class="markaroo-deactivation__reasons">
			<legend>${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Why are you deactivating? (optional)', 'markaroo'))}</legend>
			${REASONS.map(([value, label]) => `
			<label><input type="radio" name="markaroo-reason" value="${value}"> ${esc(label)}</label>`).join('')}
			<textarea class="markaroo-deactivation__reason-other" rows="2" placeholder="${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tell us more…', 'markaroo'))}" hidden></textarea>
		</fieldset>

		<fieldset class="markaroo-deactivation__data">
			<legend>${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('What should happen to your Markaroo data?', 'markaroo'))}</legend>
			<label><input type="radio" name="markaroo-data" value="keep" checked> ${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Keep data — I might use Markaroo again', 'markaroo'))}</label>
			<label><input type="radio" name="markaroo-data" value="delete"> ${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete all data — feedback, replies, share links, settings, and all screenshots/attachments', 'markaroo'))}</label>
			<label class="markaroo-deactivation__confirm-wrap" hidden>
				<input type="checkbox" class="markaroo-deactivation__confirm">
				${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('I understand this permanently deletes all Markaroo data and cannot be undone.', 'markaroo'))}
			</label>
		</fieldset>

		<details class="markaroo-deactivation__bug">
			<summary>${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Found a bug? Tell us and we may fix it fast.', 'markaroo'))}</summary>
			<textarea class="markaroo-deactivation__bug-text" rows="3" placeholder="${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('What went wrong?', 'markaroo'))}"></textarea>
			<button type="button" class="markaroo-deactivation__btn markaroo-deactivation__btn--ghost markaroo-deactivation__btn--sm markaroo-deactivation__bug-send">${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Send bug report', 'markaroo'))}</button>
			<span class="markaroo-deactivation__bug-status" role="status"></span>
		</details>

		<p class="markaroo-deactivation__error" role="alert" hidden></p>

		<div class="markaroo-deactivation__actions">
			<button type="button" class="markaroo-deactivation__link markaroo-deactivation__skip">${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Skip & deactivate', 'markaroo'))}</button>
			<span class="markaroo-deactivation__spacer"></span>
			<button type="button" class="markaroo-deactivation__btn markaroo-deactivation__btn--ghost markaroo-deactivation__cancel">${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', 'markaroo'))}</button>
			<button type="button" class="markaroo-deactivation__btn markaroo-deactivation__btn--primary markaroo-deactivation__go">${esc((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deactivate', 'markaroo'))}</button>
		</div>
	</div>`;
  return overlay;
}
function openModal(deactivateHref) {
  const overlay = buildModal();
  document.body.appendChild(overlay);
  const dialog = el(overlay, '.markaroo-deactivation');
  const confirmWrap = el(overlay, '.markaroo-deactivation__confirm-wrap');
  const confirmBox = el(overlay, '.markaroo-deactivation__confirm');
  const otherText = el(overlay, '.markaroo-deactivation__reason-other');
  const errorBox = el(overlay, '.markaroo-deactivation__error');
  const goBtn = el(overlay, '.markaroo-deactivation__go');
  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
  };
  const onKey = e => {
    if (e.key === 'Escape') {
      close();
    }
  };
  document.addEventListener('keydown', onKey);
  dialog.focus();
  overlay.addEventListener('mousedown', e => {
    if (e.target === overlay) {
      close();
    }
  });
  el(overlay, '.markaroo-deactivation__close').onclick = close;
  el(overlay, '.markaroo-deactivation__cancel').onclick = close;
  el(overlay, '.markaroo-deactivation__skip').onclick = () => {
    window.location.href = deactivateHref;
  };
  const dataChoice = () => overlay.querySelector('input[name="markaroo-data"]:checked').value;

  // Delete choice reveals the safeguard; confirm button stays disabled
  // until the checkbox is ticked.
  const syncGate = () => {
    const deleting = dataChoice() === 'delete';
    confirmWrap.hidden = !deleting;
    goBtn.disabled = deleting && !confirmBox.checked;
    goBtn.textContent = deleting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete data & deactivate', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deactivate', 'markaroo');
    goBtn.classList.toggle('markaroo-deactivation__btn--primary', !deleting);
    goBtn.classList.toggle('markaroo-deactivation__btn--danger', deleting);
  };
  overlay.querySelectorAll('input[name="markaroo-data"]').forEach(r => r.addEventListener('change', syncGate));
  confirmBox.addEventListener('change', syncGate);

  // "Other" reason gets a free-text field.
  overlay.querySelectorAll('input[name="markaroo-reason"]').forEach(r => r.addEventListener('change', () => {
    otherText.hidden = overlay.querySelector('input[name="markaroo-reason"]:checked')?.value !== 'other';
  }));

  // Inline bug report: awaited, shows result, never blocks deactivation.
  el(overlay, '.markaroo-deactivation__bug-send').onclick = async e => {
    const btn = e.currentTarget;
    const text = el(overlay, '.markaroo-deactivation__bug-text').value.trim();
    if (!text) {
      return;
    }
    const status = el(overlay, '.markaroo-deactivation__bug-status');
    btn.disabled = true;
    try {
      const res = await sendFeedback((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bug report (deactivation)', 'markaroo'), text, false);
      status.textContent = res.ok ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thanks — report sent.', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Could not send. Please try again.', 'markaroo');
    } catch {
      status.textContent = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Could not send. Please try again.', 'markaroo');
    }
    btn.disabled = false;
  };
  goBtn.onclick = async () => {
    errorBox.hidden = true;

    // Optional survey — fire-and-forget with keepalive so navigation
    // doesn't cancel it. Failure never blocks deactivation.
    const reason = overlay.querySelector('input[name="markaroo-reason"]:checked');
    if (reason) {
      const detail = reason.value === 'other' ? `: ${otherText.value.trim()}` : '';
      sendFeedback((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deactivation survey', 'markaroo'), `Reason: ${reason.value}${detail}\nData choice: ${dataChoice()}`, true).catch(() => undefined);
    }
    if (dataChoice() === 'delete') {
      goBtn.disabled = true;
      goBtn.textContent = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deleting data…', 'markaroo');
      try {
        const res = await fetch(`${config.restUrl}/deactivate-cleanup`, {
          method: 'POST',
          headers: {
            'X-WP-Nonce': config.nonce
          }
        });
        if (!res.ok) {
          throw new Error(String(res.status));
        }
      } catch {
        errorBox.textContent = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Deleting data failed — nothing was deactivated. Please try again.', 'markaroo');
        errorBox.hidden = false;
        goBtn.disabled = false;
        syncGate();
        return;
      }
    }
    window.location.href = deactivateHref;
  };
}
function init() {
  if (!config) {
    return;
  }
  const link = document.querySelector(`tr[data-plugin="${config.basename}"] .deactivate a`);
  if (!link) {
    return;
  }
  link.addEventListener('click', e => {
    e.preventDefault();
    openModal(link.href);
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();

/******/ })()
;
//# sourceMappingURL=deactivation.js.map