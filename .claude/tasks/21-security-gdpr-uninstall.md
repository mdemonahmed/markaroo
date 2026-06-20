# 21 — Security, GDPR & clean uninstall

**Depends on:** 02, 03
**Goal:** Make the plugin safe and privacy-compliant, with a clean uninstall that can remove all data. (SOC 2 / EU data centers are SaaS-infra claims that don't apply to a self-hosted plugin — data stays on the user's own server. Don't claim them.)

## Scope (free)
- Input sanitization, output escaping, nonce + capability checks everywhere (audit).
- GDPR: integrate with WP's personal-data export & erase tools; data masking option for screenshots.
- Clean uninstall: optionally remove tables, options, transients, scheduled events, and uploaded files.

## Steps
1. **Security audit pass:**
   - Every REST/AJAX write checks a nonce (or valid share token) AND a capability via the `Capabilities` helper.
   - Sanitize all input (`sanitize_text_field`, `wp_kses_post` for comment HTML, type/size checks for uploads).
   - Escape all output (`esc_html/attr/url`, `wp_kses_post`).
   - SVG uploads sanitized (strip scripts) or disabled by default.
   - No secrets/keys in the repo; no external calls in free.
   - `defined('ABSPATH') || exit;` in every PHP file.
2. **Data masking:** the `mask_inputs_in_screenshots` setting (task 09) blanks input/textarea values and `[data-markaroo-mask]` regions in the screenshot clone. Document how site owners mark sensitive regions. (Advanced obfuscation in replays is pro.)
3. **GDPR tooling:**
   - Register a personal-data **exporter** (`wp_privacy_personal_data_exporters`) returning a user's feedback + replies (by `author_id` and by matching email if stored).
   - Register a personal-data **eraser** (`wp_privacy_personal_data_erasers`) to delete/anonymize a user's items.
   - Add a privacy-policy suggestion via `wp_add_privacy_policy_content`.
4. **Clean uninstall** (`uninstall.php` or WP Bones uninstall hook):
   - Fire `do_action('markaroo/uninstall')` first (so pro can clean its own data).
   - If `delete_data_on_uninstall` is true: drop the three tables, delete all `markaroo_*` options/transients, unschedule cron events, and remove uploaded attachment files created by Markaroo.
   - If false: leave data intact (default), only remove transients/cron.
5. **Activation/deactivation:** deactivation unschedules cron and clears transients but never deletes data.

## Hooks
- `do_action('markaroo/uninstall')`
- `apply_filters('markaroo/gdpr/export', $data, $user)` · `apply_filters('markaroo/gdpr/erase', $count, $user)`

## Acceptance
- Static audit: no unescaped output, no write path without nonce+capability, no direct file access.
- WP "Export Personal Data" returns the user's Markaroo items; "Erase" removes/anonymizes them.
- With `delete_data_on_uninstall` on, uninstall removes all tables/options/transients/cron/uploads; with it off, data remains.
- `markaroo/uninstall` fires before cleanup so pro can hook.
