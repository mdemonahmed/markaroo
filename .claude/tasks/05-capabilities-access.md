# 05 — Capabilities & access (free)

**Depends on:** 01
**Goal:** Simple, safe access control for the free version. Full role-based access (Client/Dev/No Access) and granular per-role rights are **pro** — only expose the filter seams here.

## Scope (free)
- One management capability gate. Authors can edit/delete their own items. Guests act only through a share token.
- A central permission helper that the REST layer and UI both call.

## Model (free)
- **Manage:** users with `markaroo_settings.manage_capability` (default `manage_options`) can see the dashboard, view all feedback, resolve, assign, delete anything, manage shares and settings.
- **Author:** any logged-in user can create feedback/replies and edit/delete **their own**.
- **Guest:** via share token only; rights limited to the share's `can_view`/`can_comment` flags.

## Steps
1. `Capabilities` helper (`plugin/Support/Capabilities.php`):
   - `wp_markaroo_current_user_can_manage(): bool`
   - `can_edit(Feedback|Reply $item): bool` (author or manage)
   - `can_resolve(): bool`, `can_delete($item): bool`, `can_assign(): bool`
   - Each method ends with `apply_filters('markaroo/can/{ability}', $allowed, $context)` so pro can override per role.
2. Add a `markaroo_manage_feedback` meta-capability mapped to `manage_capability` on init, so future granularity is clean.
3. Use these helpers in every REST `permission_callback` and to gate UI affordances in `window.markarooConfig.currentUser` (`canManage`, `canResolve`, etc.).
4. Do **not** build role assignment UI. Leave that to pro.

## Hooks
- `apply_filters('markaroo/can/manage', $bool, $user)`
- `apply_filters('markaroo/can/resolve', $bool, $ctx)`
- `apply_filters('markaroo/can/delete', $bool, $ctx)`
- `apply_filters('markaroo/can/assign', $bool, $ctx)`

## Acceptance
- A subscriber-level logged-in user can create and edit their own feedback but cannot resolve/delete others'.
- A manage-cap user can do everything.
- Guests cannot reach manage endpoints even with a valid share token.
- Every permission decision routes through `Capabilities` (no inline `current_user_can` scattered in controllers).
