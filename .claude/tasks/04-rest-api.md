# 04 — REST API

**Depends on:** 02, 03
**Goal:** Full REST surface under `markaroo/v1` for feedback, replies, shares, settings, users, and counts. This is the contract the React widget and admin both consume.

## Scope (free)
- CRUD for feedback and replies, resolve/unresolve, list/filter, attachments meta, settings read/write, assignable users list, mention search, per-page counts.
- Auth: logged-in users via cookie nonce; guests via share token (task 06).

## Endpoints (`/wp-json/markaroo/v1`)
| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/feedback` | list, filters: `page_key`, `status`, `priority`, `assigned_to`, `search`, pagination | manage cap OR valid share (view) |
| POST | `/feedback` | create pin/comment | manage cap OR share (comment) |
| GET | `/feedback/{id}` | single + replies | as above |
| PATCH | `/feedback/{id}` | edit comment/priority/assignee/due/tags/position | author or manage cap |
| POST | `/feedback/{id}/resolve` | resolve | manage cap (configurable) |
| POST | `/feedback/{id}/unresolve` | reopen | manage cap |
| DELETE | `/feedback/{id}` | delete (with confirm on client) | author or manage cap |
| POST | `/feedback/{id}/replies` | add reply | manage cap OR share (comment) |
| PATCH | `/replies/{id}` | edit own reply | author or manage cap |
| DELETE | `/replies/{id}` | delete reply | author or manage cap |
| GET | `/users` | assignable + mentionable WP users (id, name, avatar) | manage cap |
| GET | `/counts` | feedback counts per `page_key`, totals, resolution rate | manage cap |
| GET | `/settings` | read settings | manage cap |
| PATCH | `/settings` | update settings | manage cap |
| GET/POST/DELETE | `/shares` | manage guest links (task 06) | manage cap |
| POST | `/attachments` | upload file, return media meta (task 15) | manage cap OR share (comment) |

## Steps
1. Controllers in `plugin/Http/Controllers/`: `FeedbackController`, `ReplyController`, `ShareController`, `SettingsController`, `UsersController`, `CountsController`, `AttachmentsController`.
2. Register routes in `RestServiceProvider` under namespace `markaroo/v1`. Use `register_rest_route` with `permission_callback` (never `__return_true` on writes).
3. Validation/sanitization with `args` schema per route. Enforce field whitelists on PATCH.
4. Standard JSON response shape: `{ data, meta }` for lists; single object for items. Consistent error shape with proper HTTP codes.
5. Every write: nonce check (`X-WP-Nonce`) for logged-in, share-token check for guests; capability check; then act through repositories.
6. Fire hooks at each mutation (see below) and run the data through filters before returning.

## Hooks
- `do_action('markaroo/feedback/created', $feedback, $request)`
- `do_action('markaroo/feedback/updated', $feedback, $changes)`
- `do_action('markaroo/feedback/resolved', $feedback)` / `markaroo/feedback/unresolved`
- `do_action('markaroo/feedback/deleted', $id, $feedback)`
- `do_action('markaroo/reply/created', $reply, $feedback)`
- `apply_filters('markaroo/rest/feedback_response', $payload, $feedback)`
- `apply_filters('markaroo/rest/permission', $allowed, $route, $request)` — lets pro add role-based rules (task 19).

## Acceptance
- All endpoints return correct codes; writes reject missing/invalid nonce or token with 401/403.
- Creating feedback persists every field and fires `markaroo/feedback/created`.
- Filters on `/feedback` (status/priority/assignee/search) work and are paginated.
- `/counts` returns per-page counts and resolution rate matching the DB.
- A guest with a comment-only share can POST feedback/replies but cannot resolve/delete others' items.
