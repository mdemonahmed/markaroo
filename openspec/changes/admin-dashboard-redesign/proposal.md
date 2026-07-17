## Why

The admin dashboard is functionally rich but visually and structurally rough: generic nav icons, a cramped "All Reviews" table with a broken assignee column and an unwanted Due column, no way to see a feedback item's full detail (screenshot, attachments, replies) from the admin, notification settings buried inside Settings, and no in-plugin help or plugin-feedback channel. This change is a full admin UX pass so the dashboard matches the polish of the frontend widget.

## What Changes

- **Navigation restructure + icons.** Menu becomes: Dashboard, All Feedback (renamed from "All Reviews"), Board, Approvals, Email Notification, Settings, Developers, Give us Feedback, How to Use. Every item gets a meaningful, consistent SVG icon (one stroke style, one size).
- **Shared feedback detail modal.** A centered popup (admin equivalent of the frontend PinCard) showing title, comment (markdown-rendered), status/priority controls, assignee select, screenshot, attachments, tags, page link, and replies. Opened by clicking a row (All Feedback, Approvals) or a card (Board). Approvals adds Approve/Reopen buttons in the modal.
- **All Feedback redesign.** Column order: ID, Title, Comment, Status, Priority, Assignee, Created, Page. **Due column removed.** Assignee display/assignment fixed (assignable from the detail modal; column renders the name). Row click opens the detail modal.
- **Board upgrade.** Cards show title prominently plus meta (priority, assignee, time); card click opens the same detail modal (incl. attachments).
- **Approvals redesign.** Same table layout as All Feedback plus Approve and Reopen action buttons per row and in the modal.
- **New Email Notification page.** Moves the notification group out of Settings into its own page: enable checkbox, Delivery Mode select (Digest only / Smart), Digest Frequency select (15/30/60 min), Instant Alerts checkboxes (assignment, mentions), and Send Test Email button (existing test-digest endpoint). Backed by the existing `notifications` settings keys — no schema change.
- **Dashboard (Overview) cleanup.** Overdue stat box removed; stat boxes link to filtered All Feedback views; Top Pages show the full page URL (linked, opens the page) instead of a bare page key.
- **Settings cleanup.** Notifications section removed (now its own page); consistent field styling, checkbox/toggle polish, section icons.
- **New "Give us Feedback" page.** Form (name, email, subject, message) that emails the submission to hello@devemon.com via `wp_mail` — user-initiated only, nothing automatic.
- **New "How to Use" page.** Static, plain-English usage guide.
- **Developers page** unchanged.

## Capabilities

### New Capabilities
- `admin-dashboard-ux`: Admin navigation structure/icons, overview stats + top pages behavior, and the shared feedback detail modal contract.
- `admin-feedback-tables`: Column set, ordering, row interaction, and approve/reopen actions for the All Feedback and Approvals tables, plus Board card content and interaction.
- `admin-email-notification-page`: The dedicated Email Notification settings page (fields, mapping to existing notification settings, test email).
- `admin-plugin-feedback`: The "Give us Feedback" form and its mail delivery, and the "How to Use" help page.

### Modified Capabilities
<!-- None — all existing specs cover the frontend widget; admin behavior is newly specified. -->

## Impact

- **Frontend (admin app):** `resources/assets/apps/dashboard-markaroo/AdminShell.tsx` (nav, icons, new tabs), all views under `views/` (Overview, TaskList, StatusBoard, Approvals, Settings), new views `EmailNotificationView.tsx`, `PluginFeedbackView.tsx`, `HowToUseView.tsx`, new shared `FeedbackDetailModal.tsx`; `markaroo-common.css` for the redesigned styles; reuse of the widget's `renderMarkdown`.
- **Backend:** new REST route `POST markaroo/v1/plugin-feedback` (admin-only, `wp_mail`); possibly an assignee fix in the list/summary path once root-caused. No DB migrations.
- **No breaking changes**; notification settings keys unchanged.
