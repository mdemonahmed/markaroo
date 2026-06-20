# 19 — Extensibility hooks for the Pro plugin

**Depends on:** runs alongside every task
**Goal:** Guarantee the free plugin exposes a complete, stable hook surface so the separate Pro plugin can add its features without forking core. This task is the single registry of all hooks — keep it in sync.

## Principle
Pro is a separate plugin the user installs alongside free. It must be able to:
- add admin pages/tabs, settings, and widget UI,
- override permissions (role-based access),
- intercept data on read/write,
- react to every mutation,
- replace notification delivery,
- add capture/annotation/asset capabilities.

No pro logic lives in free. Free only fires actions and exposes filters.

## Required PHP actions
- `markaroo/init`
- `markaroo/db/migrated`
- `markaroo/settings/updated`
- `markaroo/feedback/created` · `markaroo/feedback/updated` · `markaroo/feedback/assigned` · `markaroo/feedback/resolved` · `markaroo/feedback/unresolved` · `markaroo/feedback/deleted`
- `markaroo/reply/created`
- `markaroo/mention`
- `markaroo/share/created` · `markaroo/share/revoked`
- `markaroo/attachment/uploaded`
- `markaroo/screenshot/before_capture` · `markaroo/screenshot/after_capture`
- `markaroo/notify/send` · `markaroo/notify/digest_flush`
- `markaroo/widget/enqueue` · `markaroo/admin/enqueue`
- `markaroo/uninstall` (task 21)

## Required PHP filters
- `markaroo/config` (JS payload)
- `markaroo/settings` · `markaroo/settings/defaults`
- `markaroo/feedback/query_args`
- `markaroo/rest/feedback_response` · `markaroo/rest/permission`
- `markaroo/can/manage` · `markaroo/can/resolve` · `markaroo/can/delete` · `markaroo/can/assign`
- `markaroo/share/authorize`
- `markaroo/composer/fields` · `markaroo/comment/render`
- `markaroo/annotation/tools`
- `markaroo/priority/levels` · `markaroo/status/list`
- `markaroo/pin/color`
- `markaroo/attachments/allowed_types` · `markaroo/attachments/max_size`
- `markaroo/mention/candidates`
- `markaroo/notify/recipients` · `markaroo/notify/email`
- `markaroo/analytics/metrics` · `markaroo/dashboard/columns`
- `markaroo/admin/menu`
- `markaroo/widget/should_load`

## Required JS extension points
- Custom `window` events: `markaroo:ready`, `markaroo:mode-changed`, `markaroo:capture-start`, `markaroo:pin-placed`, `markaroo:region-selected`, `markaroo:screenshot-ready`, `markaroo:annotation-changed`, `markaroo:feedback-submitted`, `markaroo:pin-opened`, `markaroo:pin-moved`, `markaroo:pin-resolved`, `markaroo:admin-ready`.
- A small JS registry on `window.markaroo` for registering: extra composer fields, extra annotation tools, extra admin tabs, extra pin renderers. Document its shape.

## Steps
1. As each feature task is built, confirm its hooks here exist and fire with documented arguments.
2. Add a `pro_active` flag in `window.markarooConfig` (detect a known pro constant) so the UI can show/hide upsell affordances without bundling pro code.
3. Document each hook's signature in a `HOOKS.md` generated/maintained file.
4. Treat hook names/signatures as a stable contract — don't rename without a deprecation shim.

## Acceptance
- Every action/filter listed here is actually fired/exposed in the codebase with the documented args.
- A trivial test "pro stub" plugin can: add a settings key, add an admin tab, override `markaroo/can/resolve`, and intercept `markaroo/notify/send` — with zero edits to free.
- `HOOKS.md` documents all signatures.
