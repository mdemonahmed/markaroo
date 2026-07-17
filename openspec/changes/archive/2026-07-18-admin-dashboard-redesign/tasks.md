## 1. Navigation + routes skeleton

- [x] 1.1 `AdminShell.tsx`: rename "All Reviews" → "All Feedback"; add tabs `email-notification`, `plugin-feedback`, `how-to-use`; register stub views so every nav item routes.
- [x] 1.2 Replace all nav icons with a consistent meaningful SVG set (24px viewBox, stroke 2, currentColor): home, chat-bubbles, kanban, check-badge, envelope, gear, code, paper-plane, book.
- [x] 1.3 Support `#tab?key=value` hash filters (parse once in AdminShell, pass to views) for stat-box deep links.
- [x] 1.4 Nav polish: active state, hover, focus-visible, spacing per 8px rhythm.

## 2. Shared feedback detail modal

- [x] 2.1 Create `components/FeedbackDetailModal.tsx`: fetch `feedback/{id}`, render title, markdown comment (reuse widget `renderMarkdown`), status + priority selects, assignee select (users endpoint), tags, page link, author/timestamps, screenshot, attachments, replies (+ reply input).
- [x] 2.2 Wire edits: PATCH on change (status, priority, assignee, title/comment edit), optimistic list refresh via `onChanged` callback.
- [x] 2.3 Modal a11y/UX: centered overlay, Escape/outside-click/close-button dismissal, focus trap, `role="dialog"`, body scroll lock.
- [x] 2.4 Optional `showApprovalActions` prop rendering Approve/Reopen buttons wired to existing endpoints.
- [x] 2.5 Modal styles in `markaroo-common.css` (light surface, indigo accent, consistent with widget pincard).

## 3. All Feedback redesign

- [x] 3.1 Reorder columns to ID, Title, Comment (truncated), Status, Priority, Assignee, Created, Page; remove the Due column and its sort.
- [x] 3.2 Row click opens FeedbackDetailModal; checkbox/inline controls stopPropagation.
- [x] 3.3 Assignee end-to-end: verify list rows carry `assigned_to_id`/`assigned_to_name`; fix anything broken; confirm assign-in-modal → column updates → assignee filter matches.
- [x] 3.4 Visual redesign: cleaner header, row hover, status/priority badges, pagination, filter bar polish, empty state.

## 4. Approvals redesign

- [x] 4.1 Rebuild ApprovalsView on the same table design as All Feedback (extract/reuse the table pieces where practical).
- [x] 4.2 Add per-row Approve and Reopen buttons wired to existing endpoints, updating in place.
- [x] 4.3 Row click opens FeedbackDetailModal with `showApprovalActions`.

## 5. Board upgrade

- [x] 5.1 Cards show title as primary text with meta (priority badge, assignee, relative time) below.
- [x] 5.2 Card click opens FeedbackDetailModal (attachments included). Drag/drop unaffected.

## 6. Email Notification page + Settings cleanup

- [x] 6.1 Create `EmailNotificationView.tsx`: enable checkbox (`notify_mode !== 'off'`), Delivery Mode select (digest/smart), Digest Frequency select (15/30/60), Instant Alerts checkboxes (assignment, mention — visible in Smart mode only), Send Test Email button reusing `POST /notifications/test-digest`; save via existing settings endpoint with success/error feedback.
- [x] 6.2 Remove the Notifications group from `SettingsView.tsx`.
- [x] 6.3 Settings visual pass: consistent field/checkbox styling, section grouping with icons, helper text placement.

## 7. Overview cleanup

- [x] 7.1 Remove the Overdue stat box.
- [x] 7.2 Stat boxes link to All Feedback with matching status filter (`#tasks?status=…`).
- [x] 7.3 Top Pages: display full URL (`site_url + page_key`), rendered as a link opening in a new tab; row count links to All Feedback filtered by page.

## 8. Give us Feedback + How to Use

- [x] 8.1 Backend: `POST markaroo/v1/plugin-feedback` route (permission `manage_options`), sanitize + `is_email` validation, transient rate-limit, `wp_mail` to hello@devemon.com with reply-to submitter; append plugin version + site URL (disclosed).
- [x] 8.2 `PluginFeedbackView.tsx`: Name, Email, Subject, Message fields with labels + helper copy + disclosure notice; sending/success/error states; field-level validation.
- [x] 8.3 `HowToUseView.tsx`: static translatable guide — Getting started, Pinning feedback, Replies & mentions, Tasks & assignment, Share links, Notifications. Short scannable sections, no fetch.

## 9. Quality gates

- [x] 9.1 `npx wp-scripts build` clean; no console errors on any admin view.
- [x] 9.2 Lint clean on changed/new files; `phpcs` clean on new PHP.
- [x] 9.3 New strings translatable; regenerate `.pot`.
- [ ] 9.4 Manual smoke: click through all 9 nav items; open detail modal from list/board/approvals; assign a user; approve + reopen; save notification settings + send test email; submit plugin feedback; verify overview links.
