# 16 — Admin dashboard (React shell)

**Depends on:** 03, 04
**Goal:** A WordPress admin page hosting the React dashboard: feedback/task list, settings, and share-link management. One-click setup feel.

## Scope (free)
- Admin menu "Markaroo" with sub-pages: Dashboard, Settings, Share Links.
- React app mounted on the admin page, consuming the REST API.
- Settings form bound to task 03 keys; share manager bound to task 06.

## Steps
1. `AdminMenuServiceProvider` registers a top-level menu (icon, `manage_capability`). Use WP Bones menu routing.
2. Enqueue the admin React bundle + `window.markarooConfig` only on Markaroo admin pages (conditional asset loading, task 20).
3. App shell (`resources/assets/admin/`): left nav + routed views:
   - **Dashboard** → task 17 (list, filters, overview, analytics).
   - **Settings** → form for all task 03 keys, grouped (General, Capture, Tasks, Access, Notifications, Attachments, Advanced). Save via PATCH `/settings`.
   - **Share Links** → create/list/revoke guest links (task 06): scope, rights, mode, expiry, copy-link.
4. Reuse the color maps, markdown renderer, and components shared with the widget where practical (extract to `resources/assets/shared/`).
5. CSS prefixed `markaroo-`, scoped to the admin root, no clashes with WP admin styles.
6. Empty/loading/error states for every view.

## Hooks
- `apply_filters('markaroo/admin/menu', $menu)` — pro adds pages (Integrations, Branding, AI).
- `do_action('markaroo/admin/enqueue')`.
- JS `markaroo:admin-ready` event + a small registry so pro can mount extra tabs.

## Acceptance
- Markaroo menu appears only for manage-cap users; sub-pages route in React without full reloads.
- Settings load, edit, and save round-trip correctly.
- Share links can be created, copied, and revoked from the UI.
- Assets load only on Markaroo admin pages.
