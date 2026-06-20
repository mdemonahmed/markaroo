# 07 — Frontend widget bootstrap

**Depends on:** 04, 05
**Goal:** Load the React feedback widget on the front end for permitted users/guests, with three modes and conditional, async asset loading. Works with any theme or page builder.

## Scope (free)
- A floating "Feedback" launcher button (see competitor screenshots: bottom-right pill).
- Three widget modes: **comment** (full capture + comment), **view** (read pins only), **clean** (no UI, used for clean screenshots / preview).
- Mount React into `#markaroo-root` appended to `<body>`, isolated CSS prefixed `markaroo-`.
- Pins panel that auto-hides shortly after feedback mode starts (so it doesn't block screenshots), with a soft "drag to select" notice.

## Steps
1. `FrontendServiceProvider` decides whether to load:
   - load if current user can manage OR can author, OR a valid `markaroo_share` token is present;
   - never load for plain visitors with no rights;
   - respect `default_widget_mode` and any per-share mode.
2. Enqueue the widget bundle + `window.markarooConfig` (from task 01) only when loading. Use `defer`/async per `async_assets` setting. Do **not** enqueue `html2canvas` here — it lazy-loads on demand (task 09).
3. React widget structure (`resources/assets/widget/`):
   - `WidgetRoot` — reads config, mode, share rights.
   - `Launcher` — floating button, toggles feedback mode.
   - `PinsPanel` — list of pins (unresolved/resolved tabs, pages list, counts). Auto-hide after entering capture; reappear via launcher.
   - `ModeManager` — comment/view/clean switching.
   - State store (lightweight, e.g. Zustand or React context) for pins, active pin, capture state.
4. CSS: a single scoped stylesheet, every class `markaroo-`, mounted inside `#markaroo-root`. Use high z-index but avoid `!important` wars; reset only inside the root.
5. Network: all data via the REST layer (task 04) using `restUrl` + nonce (or share token header for guests).
6. Mobile/responsive: launcher and panels must work on small screens; capture supports touch (task 08).

## Hooks
- `do_action('markaroo/widget/enqueue', $context)` (PHP) before enqueue.
- JS event bus: dispatch `markaroo:ready`, `markaroo:mode-changed` custom events on `window` so pro scripts can hook.
- `apply_filters('markaroo/widget/should_load', $bool, $context)` (PHP).

## Acceptance
- Widget loads only for permitted users/guests; absent for unauthorized visitors (verify no JS/CSS enqueued).
- All three modes switch correctly; clean mode renders no visible Markaroo UI.
- Pins panel auto-hides after entering capture and shows the drag-to-select notice.
- No CSS bleed into the host theme; widget works on a default theme + Elementor + Divi test page.
- No console errors on load.
