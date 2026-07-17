## Context

The admin app is a hash-routed React SPA (`AdminShell.tsx` + 6 views, ~1.8k lines) styled by `markaroo-common.css`. Current state per survey:

- Nav: `overview / tasks("All Reviews") / board / approvals / settings / developers`, thin generic `NavIcon` paths.
- `TaskListView` (689 lines): table with Due column; Assignee column renders `assigned_to_name` but items are widget-created (assignee empty) and there is no way to assign from the admin — the only setter is the frontend composer/pincard. Backend filter chain (`assigned_to` param → repo `assigned_to_id`) is wired correctly.
- `OverviewView`: Overdue StatCard; Top Pages render bare `page_key` in `<code>`, unlinked. Feedback rows carry `page_url`, but by-page counts only aggregate `page_key` — full URL must be derived (site_url + page_key path, or a representative `page_url` added to the counts query).
- `SettingsView` (452 lines): includes a Notifications group (`notify_mode`, digest interval, test-digest button). Backend already models `notifications.notify_mode (off|instant|digest|smart)`, `digest_interval (15|30|60)`, `events.{mention,assignment,...}` and a `POST /notifications/test-digest` route.
- No detail view anywhere in admin; the frontend widget already has PinCard, `renderMarkdown`, `AttachmentList` patterns to mirror.

ui-ux-pro-max consulted for the design system; its generated palette (OLED dark + Fira Code) was rejected as unfit for a WP admin — retained its density guidance, icon rules (one consistent SVG set, no emoji, 4.5:1 contrast, visible focus), form rules (visible labels, helper text below inputs, error near field, success feedback), and table/nav checklists.

## Goals / Non-Goals

**Goals:**
- Coherent nav with meaningful icons and three new pages (Email Notification, Give us Feedback, How to Use).
- One shared `FeedbackDetailModal` used by All Feedback, Board, and Approvals.
- All Feedback: ID, Title, Comment, Status, Priority, Assignee, Created, Page; Due removed; assignment works from admin.
- Overview: no Overdue box, linked stat boxes, full linked page URLs.
- Settings visual cleanup; notifications extracted.
- Polished, consistent light UI reusing the existing indigo (#6366f1) accent and `--mk-*` tokens.

**Non-Goals:**
- No DB migrations, no new settings keys (Email Notification page maps onto existing keys).
- No changes to the frontend widget.
- No react-router/library additions — keep the existing hash-tab mechanism and plain fetch.
- Developers page untouched.

## Decisions

- **Design language:** stay light, white surfaces, indigo accent, slate text — matching the widget and WP admin. Density: dashboard-tight (8px rhythm). Icons: single inline SVG set, 24px viewBox, stroke 2, `stroke="currentColor"` — extend the existing `NavIcon` helper rather than adding an icon dependency. Nav icon mapping: Dashboard=home/grid, All Feedback=chat-bubbles, Board=kanban columns, Approvals=check-badge, Email Notification=envelope-bell, Settings=gear, Developers=code brackets, Give us Feedback=paper-plane/heart, How to Use=book/help.
- **Shared modal:** new `FeedbackDetailModal.tsx` in `dashboard-markaroo/components/`, props `{ id, onClose, onChanged }`. Fetches `GET feedback/{id}` (full detail incl. replies/attachments), renders markdown via the widget's `renderMarkdown` (import across app roots is fine — same bundle pipeline), saves edits with `PATCH feedback/{id}`, replies list read-only-plus-reply via existing endpoints. Approve/Reopen buttons render only when opened from Approvals (prop flag). Focus-trapped, Escape/overlay close, `role="dialog"`.
- **Assignee fix:** root cause is a missing setter in admin, not a broken filter — the modal's assignee `<select>` (users from the existing users endpoint) is the fix. Verify the summary-list SELECT includes `assigned_to_id`/`assigned_to_name` (it does) and repair anything found broken during implementation.
- **Top pages URL:** derive `site_url + page_key` client-side for display/link (page_key is a normalized path). `ponytail:` if page_key normalization ever diverges from a real path, switch the counts query to also return a representative `page_url`.
- **Stat box links:** stat boxes become buttons that switch to the All Feedback tab with a pre-applied status filter (hash param, e.g. `#tasks?status=open`).
- **Email Notification page:** new `EmailNotificationView.tsx`. Enable checkbox = `notify_mode !== 'off'`; unchecking stores `off`, checking restores the selected mode (digest default). Delivery Mode maps `digest|smart`; Digest Frequency maps `digest_interval`; Instant Alerts map `events.assignment` / `events.mention` and render only in Smart mode (progressive disclosure). Send Test Email reuses `POST /notifications/test-digest`. Settings save path unchanged (same settings endpoint).
- **Give us Feedback:** new `PluginFeedbackView.tsx` + `POST markaroo/v1/plugin-feedback` (permission: `manage_options`, nonce via X-WP-Nonce). Server sanitizes, validates email (`is_email`), rate-limits with a short transient, and `wp_mail`s to `hello@devemon.com` with reply-to set to the submitter. Plugin version + site URL appended to the body for context (disclosed in the notice text).
- **How to Use:** `HowToUseView.tsx`, static translatable JSX sections (Getting started → Pinning → Replies & mentions → Tasks → Share links → Notifications). No fetch.
- **Order of work:** 1) nav + icons + routes (skeleton for new pages), 2) shared detail modal, 3) All Feedback redesign, 4) Approvals, 5) Board, 6) Email Notification page + Settings cleanup, 7) Overview cleanup, 8) Give us Feedback + How to Use, 9) polish pass (focus states, empty states, responsive).

## Risks / Trade-offs

- **Importing widget helpers into the admin bundle** (renderMarkdown) grows the admin chunk slightly — negligible (~1.5KB) vs duplicating logic.
- **Deriving top-page URLs from page_key** assumes page_key is a path; share-token stripping already normalizes this. Fallback noted above.
- **Hash-param filters** are a light convention (`#tab?key=value`) — kept deliberately simpler than adding a router.
- **Plugin-feedback email** sends user-entered data to an external address; it is explicit, user-initiated, disclosed on the form, and admin-only — consistent with the "no automatic external calls" rule.
- Approvals/All Feedback share table components; refactoring TaskListView (689 lines) risks regressions — mitigated by extracting the table incrementally and keeping filters/bulk logic intact.
