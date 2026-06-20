# 03 — Settings & options

**Depends on:** 01
**Goal:** A single settings store and a typed accessor, covering all free-version options surfaced in the admin (task 16).

## Scope (free)
- One option `markaroo_settings` (array) with defaults.
- Server-side getter/setter with defaults merge and a filter.

## Settings keys (free)
- **General:** `screenshot_format` (jpeg|png, default jpeg), `screenshot_quality` (0.1–1.0, default 0.8), `enable_screenshots` (bool), `default_widget_mode` (comment|view|clean), `widget_button_label`, `widget_position`.
- **Capture:** `enable_area_select` (bool), `default_annotation_tool` (arrow, default), `mask_inputs_in_screenshots` (bool, default true — see task 21 data masking).
- **Tasks:** `enable_assignment` (bool, default true), `enable_due_dates` (bool, default true), `available_tags` (array of strings), `priority_default` (normal).
- **Access:** `allow_guest_links` (bool, default true), `manage_capability` (default `manage_options`).
- **Notifications:** `notify_mode` (off|instant|digest|smart, default smart), `digest_interval` (15|30|60, default 30), `events` (per-event toggles: new_feedback, reply, mention, assignment, resolved).
- **Attachments:** `max_upload_mb`, `allowed_types` (array).
- **Advanced:** `delete_data_on_uninstall` (bool, default false), `async_assets` (bool, default true).

## Steps
1. `Settings` class in `plugin/Support/` (or use WP Bones Options) with `get($key, $default)`, `all()`, `update($partial)`. Sanitize on write.
2. Define `defaults()` and merge so missing keys never break callers.
3. Expose `apply_filters('markaroo/settings', $settings)` and `apply_filters('markaroo/settings/defaults', $defaults)`.
4. Include the settings (minus sensitive ones) in `window.markarooConfig.settings` for the widget and admin.

## Files
- `plugin/Support/Settings.php`

## Hooks
- `apply_filters('markaroo/settings', $settings)`
- `do_action('markaroo/settings/updated', $new, $old)`

## Acceptance
- Fresh install returns full defaults via `Settings::all()`.
- Updating a partial array persists and merges correctly; bad values are sanitized.
- `markaroo/settings/updated` fires on save.
