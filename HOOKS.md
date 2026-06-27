# Markaroo Hook Reference

This file documents every action and filter the **free** Markaroo plugin exposes.
These are a **stable contract** — names and signatures will not change without a deprecation shim.

> Pro plugin hooks in here. Free plugin never implements pro features.

---

## PHP Actions

### Lifecycle

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/init` | — | On plugin boot |
| `markaroo/db/migrated` | — | After database migrations run |
| `markaroo/uninstall` | — | During `uninstall.php` teardown |

### Settings

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/settings/updated` | `$new_settings (array)`, `$old_settings (array)` | `Settings::save()` |

### Feedback

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/feedback/created` | `$feedback (object)` | `FeedbackController::create` |
| `markaroo/feedback/updated` | `$feedback (object)`, `$changes (array)` | `FeedbackController::update` |
| `markaroo/feedback/assigned` | `$feedback (object)`, `$user_id (int)` | `FeedbackController::update` when `assigned_to_id` changes |
| `markaroo/feedback/resolved` | `$feedback (object)` | `FeedbackController::resolve` |
| `markaroo/feedback/unresolved` | `$feedback (object)` | `FeedbackController::unresolve` |
| `markaroo/feedback/deleted` | `$id (int)`, `$feedback (object)` | `FeedbackController::destroy` |

### Replies & Mentions

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/reply/created` | `$reply (object)`, `$feedback (object)` | `FeedbackController::create_reply` |
| `markaroo/mention` | `$user_ids (int[])`, `$context (array{comment, feedback_id})` | `FeedbackController::create_reply` when `@username` detected |

### Share Links

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/share/created` | `$share (object)` | `ShareController::create` |
| `markaroo/share/revoked` | `$share (object)` | `ShareController::destroy` |

### Attachments & Screenshots

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/attachment/uploaded` | `$meta (array)`, `$feedback_id (int)` | `AttachmentsController::create` |
| `markaroo/screenshot/before_capture` | `$feedback_id (int)`, `$file (array)` | `ScreenshotController::create` before processing |
| `markaroo/screenshot/after_capture` | `$feedback_id (int)`, `$attachment_id (int)` | `ScreenshotController::create` after WP media insert |

### Notifications

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/notify/digests_sent` | — | After cron flush completes |
| `markaroo/notify/digest_flush` | — | Alias — same event, kept for hook-spec compat |

### Asset Loading

| Action | Args | Where fired |
|--------|------|-------------|
| `markaroo/widget/enqueue` | `$context (array)` | `FrontendServiceProvider::maybe_enqueue` |
| `markaroo/admin/enqueue` | `$hook (string)` | `AdminMenuServiceProvider::enqueue_assets` |

---

## PHP Filters

### JS Config

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/config` | full payload array | Extend `window.markarooConfig` with extra keys |

### Settings

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/settings` | settings array | Override/extend loaded settings at read time |
| `markaroo/settings/defaults` | defaults array | Extend the default settings schema |

### Feedback Queries

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/feedback/query_args` | `$args (array)`, `$context (string)` | Mutate list query (e.g. add role-scoping) |
| `markaroo/rest/feedback_response` | `$item (array)`, `$row (object)` | Add/remove fields in REST feedback responses |

### Permissions

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/rest/permission` | `$can (bool)`, `$ability (string)`, `$request` | Override REST endpoint auth (Pro: role-based) |
| `markaroo/can/manage` | `$can (bool)` | Override manage capability check |
| `markaroo/can/resolve` | `$can (bool)` | Override resolve capability check |
| `markaroo/can/delete` | `$can (bool)` | Override delete capability check |
| `markaroo/can/assign` | `$can (bool)` | Override assign capability check |
| `markaroo/share/authorize` | `$can (bool)`, `$share`, `$request` | Override share token authorization |

### Widget UI

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/widget/should_load` | `$should_load (bool)`, `$context (array)` | Prevent or force widget loading per page |
| `markaroo/composer/fields` | `['comment','priority']` | Add extra composer field slugs (Pro injects from registry) |
| `markaroo/annotation/tools` | `['arrow','rect','circle']` | Add extra annotation tool slugs |
| `markaroo/pin/color` | status+priority → hex map | Theme pin colors |
| `markaroo/comment/render` | `'markdown'` | Switch comment render mode (markdown/html/plain) |

### Metadata

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/priority/levels` | 4-level array | Add/remove priority levels exposed to JS |
| `markaroo/status/list` | `[open, resolved]` | Add statuses (e.g. `in_progress`) |
| `markaroo/mention/candidates` | `$users (array)`, `$request` | Filter or extend `@mention` autocomplete users |

### Attachments

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/attachments/allowed_types` | MIME map | Add types (Pro: SVG with sanitizer) |
| `markaroo/attachments/max_size` | `int $bytes` | Override max upload size |

### Notifications

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/notify/send` | `true`, `$notification (array)` | Return false to cancel email; Pro routes to Slack/webhook |
| `markaroo/notify/should_send` | `true`, `$event`, `$user_id`, `$data` | Per-user event suppression |
| `markaroo/notify/managers` | admin user IDs | Control who receives new-feedback emails |
| `markaroo/notify/headers` | `string[]`, `$notification` | Extend email headers |
| `markaroo/notify/body` | `$html`, `$event`, `$data`, `$user` | Replace or decorate email body |

### Admin / Analytics

| Filter | Default | Purpose |
|--------|---------|---------|
| `markaroo/analytics/metrics` | `[]`, `$payload` | Inject extra metrics into `/counts` (Pro: avg_time_to_resolve) |
| `markaroo/counts/response` | `$payload (array)` | Mutate full `/counts` response |
| `markaroo/dashboard/columns` | column slug array | Add/remove admin task list columns |
| `markaroo/admin/menu` | `[]`, `$hook` | Inject extra admin config (tabs, permissions) |

---

## JS Extension Points

### `window.markaroo` Registry

Initialized before the widget mounts. Pro and custom code can call:

```js
// Register an extra composer field
window.markaroo.registerComposerField({
  id: 'sprint',
  label: 'Sprint',
  render: (props) => React.createElement(SprintField, props),
});

// Register an extra annotation tool
window.markaroo.registerAnnotationTool({
  id: 'blur',
  icon: '⬜',
  label: 'Blur',
  draw: (ctx, from, to) => { /* canvas drawing code */ },
});

// Register an extra admin tab
window.markaroo.registerAdminTab({
  id: 'reports',
  label: 'Reports',
  render: () => React.createElement(ReportsView),
});

// Register a custom pin renderer
window.markaroo.registerPinRenderer({
  id: 'custom',
  render: (feedback) => React.createElement(CustomPin, { feedback }),
});
```

### Custom Events (dispatched on `window`)

| Event | Detail | When |
|-------|--------|------|
| `markaroo:ready` | `{ mode, config }` | Widget React app mounted |
| `markaroo:admin-ready` | `{ tab }` | Admin shell mounted |
| `markaroo:mode-changed` | `{ mode }` | Widget mode switched |
| `markaroo:capture-start` | — | User clicks "New feedback" |
| `markaroo:pin-placed` | `{ x, y }` | Pin coordinates set |
| `markaroo:region-selected` | `{ rect }` | Drag-to-select region complete |
| `markaroo:screenshot-ready` | `{ blob }` | html2canvas capture done |
| `markaroo:annotation-changed` | `{ annotations }` | Annotation added/removed/cleared |
| `markaroo:feedback-submitted` | `{ feedback }` | POST /feedback succeeded |
| `markaroo:composer-before-submit` | `{ payload }` | Just before POST — mutate payload |
| `markaroo:pin-opened` | `{ id }` | Pin clicked / panel opened |
| `markaroo:pin-moved` | `{ id, x, y }` | Pin dragged to new position |
| `markaroo:pin-resolved` | `{ id, status }` | Pin resolve toggled |

---

## `window.markarooConfig` Keys (JS)

| Key | Type | Purpose |
|-----|------|---------|
| `restUrl` | string | WP REST base URL |
| `restNamespace` | string | `markaroo/v1` |
| `nonce` | string | WP REST nonce |
| `pluginUrl` | string | Plugin root URL |
| `currentUser` | object | `{ id, name, canManage, canCreate, canResolve, canAssign }` |
| `settings` | object | Public settings (all groups) |
| `widgetMode` | string | `comment` / `view` / `clean` |
| `shareToken` | string? | Active guest share token |
| `shareRights` | object? | `{ canView, canComment }` |
| `screenshotOptions` | object | `{ enabled, format, quality, maskInputs, scale }` |
| `annotationTools` | string[] | Available tool slugs |
| `composerFields` | string[] | Field slugs shown in composer |
| `priorityLevels` | array | `[{ value, label, color }]` |
| `statusList` | array | `[{ value, label }]` |
| `pinColors` | object | Status+priority → hex |
| `commentRender` | string | `markdown` / `html` / `plain` |
| `proActive` | bool | True if `MARKAROO_PRO` constant defined |
| `i18n` | object | Translated UI strings |


## Task 26 — additional functionality

### Actions
| Hook | Args | Fired when |
|---|---|---|
| `markaroo/status/changed` | `$feedback_id, $old, $new, $user_id` | any feedback status change (badges, resolution rate, Pro integrations) |
| `markaroo/feedback/approved` | `$feedback` | a resolved item is approved (signed off) |
| `markaroo/share/token_created` | `$share` | a guest share token is created (branded client portals) |

### Filters
| Hook | Value | Use |
|---|---|---|
| `markaroo/status/statuses` | `string[]` | add/override the valid status allow-list |
| `markaroo/status/list` | `[{value,label}]` | status list exposed to JS (widget + admin) |
| `markaroo/checklist/items` | `array[]` | extend the Getting Started checklist |
| `markaroo/approval/steps` | `string[]` | multi-approver chains (free ships single-step `['approved']`) |
| `markaroo/capabilities` | `array` | finer capability/role mapping |
| `markaroo/can/give_feedback` | `bool, $user` | gate the front-end admin-bar launcher |
| `markaroo/can/approve` | `bool, $ctx` | gate the approval (sign-off) action |
