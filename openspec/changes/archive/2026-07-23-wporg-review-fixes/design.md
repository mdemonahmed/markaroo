# Design — wporg-review-fixes

## Context

WordPress.org reviewer flagged five items; Guideline 5 (trialware) is a hard blocker. Current state, verified against the code:

- `ShareRepository::get_or_create_singleton()` (ShareRepository.php:116) and `regenerate()` (:149) wipe all rows and keep exactly one site-wide link. `ShareController` only exposes `GET /shares/guest-link` + `POST /shares/guest-link/regenerate`. The React side is a single `shared/GuestLinkCard.tsx` used in Overview/Settings/HowToUse/onboarding. Meanwhile `wp_markaroo_shares` has label, scope, page_key, can_view, can_comment, widget_mode, expires_at — and `resolve_public()` already honors all of them per-row. Classic locked feature.
- Three `echo '<style>'` calls: `AdminMenuServiceProvider.php:214`, `:220`, `OnboardingServiceProvider.php:79`. Grep shows no other `<style`/`<script` echoes in plugin/.
- One unescaped output: `resources/views/emails/base.php:44` with a `phpcs:ignore EscapeOutput` — the only such ignore in the codebase.
- Deploy (`deploy.php`) intentionally strips source: no `--wp`, plus explicit skip of `/webpack.config.js`; readme points to a GitHub repo. The scanner found no source in the ZIP. Advisor's call: ship source in the ZIP, self-contained.
- `languages/` holds compiled `.po`/`.mo`/`.json` files that must go.
- Webpack chunk `354.js` already renamed by the current build to `vendors-node_modules_html2canvas_dist_html2canvas_js.js` (git status: 354.js deleted, named vendor chunk present) — needs documentation in readme, and the enqueue side must still load it correctly.

## Goals / Non-Goals

**Goals:**
- Fully unlock share links: CRUD REST + dashboard management UI for every schema column.
- Eliminate the three inline-style echoes via `wp_add_inline_style`.
- Escape email body output with `wp_kses`; drop the phpcs ignore.
- ZIP self-contained: uncompiled source + build config inside, readme rewritten.
- Remove compiled translation files permanently.
- One audit pass for any other trialware smell.

**Non-Goals:**
- No schema/migration changes (`wp_markaroo_shares` already complete).
- No pro-plugin work; existing `markaroo/share/*` hooks stay as pro seams.
- No redesign of the widget's token resolution (already per-row correct).
- No GitHub repo publication (in-package source satisfies the guideline).

## Decisions

1. **REST shape: replace singleton endpoints with resource CRUD.**
   `GET/POST /markaroo/v1/shares`, `PUT|PATCH /shares/{id}`, `DELETE /shares/{id}`. Drop `GET /shares/guest-link` and `POST /shares/guest-link/regenerate` outright — plugin is unreleased, no external consumers; keeping compat shims would preserve the singleton semantics the reviewer objected to. `regenerate()` and `get_or_create_singleton()` are deleted, not deprecated.

2. **Repository: thin CRUD, reuse existing raw-$wpdb pattern.**
   Add `update(int $id, array $data): bool` to `ShareRepository` (mirrors FeedbackRepository style, busts token cache via `forget_token_cache`). `list()`, `find()`, `find_by_token()`, `create()`, `revoke()` already exist and stay. Sanitization whitelist in the controller: label (sanitize_text_field), scope (site|page), page_key, can_view/can_comment (0|1), widget_mode (comment|view|clean), expires_at (nullable datetime, validated).

3. **UI: one ShareLinksView in dashboard-markaroo, GuestLinkCard becomes its entry point.**
   New view (list table/cards + create/edit form + copy/revoke) following existing view conventions (lucide-react, `markaroo-` classes, shared timeAgo). `GuestLinkCard` on Overview/onboarding shows the newest active site link + "Manage share links" navigation instead of a regenerate-singleton button. Widget `resolve_public` payload unchanged.

4. **Inline styles: one shared helper, `admin_enqueue_scripts`.**
   Register `markaroo-admin-inline` (`wp_register_style(handle, false, [], MARKAROO_VERSION)`), enqueue, and `wp_add_inline_style` the page-conditional rules. Menu-icon CSS attaches globally; `#wpcontent` full-bleed rules only on markaroo screens; onboarding menu-hide rule from OnboardingServiceProvider adds its line to the same handle. Same conditionals as today, only the delivery mechanism changes.

5. **Email escaping: `wp_kses` with explicit allowed array, not `wp_kses_post`.**
   The template's body markup is inline-styled tables/spans/links (email idiom). Define `$markaroo_allowed` covering exactly what Mailer bodies emit (table/tr/td/a/span/strong/br/p/div/img with style/href/width/align/etc. attributes) — audit Mailer output during implementation and size the array to reality. Explicit array is deterministic across WP versions and documents intent to the reviewer. Remove the ignore comment.

6. **Packaging: deploy with `--wp` and stop skipping build config.**
   Use `php bones deploy <target> --wp` (bones force-keeps `resources/assets`, `package.json`, etc.). Remove `/webpack.config.js` from skip_folders (required to rebuild); keep skipping jest/phpcs/deploy tooling and dev markdown. Add skips for `/languages/markaroo.mo`, `.po`, it_IT files and the translation `.json` (and delete them from the repo). Rewrite readme `== Source Code ==` per the advisor's in-package wording, documenting html2canvas 1.4.1 (MIT) compiled into the named vendor chunk. Verify with `unzip -l` greps. Update the outdated deploy.php comment block (lines 57–69) that documents the no-`--wp` strategy.

7. **Trialware audit: manual sweep, fix-or-document.**
   Grep for count caps, upgrade-gated early returns, schema columns without UI, settings keys without a settings-screen control. Known candidates checked in planning: `access.allow_guest_links` (exposed — fine, it's a kill switch not an upsell), attachments `max_upload_mb` (exposed, technical bound — fine). Share columns were the only violation found; the sweep re-verifies after implementation.

## Risks / Trade-offs

- [Dropping `/shares/guest-link` breaks any cached admin JS] → Ship PHP + rebuilt bundles in the same version bump; REST consumers are only our own apps.
- [`wp_kses` allowed-list too narrow strips legit email markup] → Derive the array from actual Mailer bodies + a manual test-send of each notification type before done.
- [`--wp` re-inflates ZIP with dev files] → skip_folders still excludes vendor dev packages, phpcs, jest, dev docs; verify final ZIP contents and size (~expect < 5 MB) with `unzip -l`.
- [Onboarding menu-hide CSS timing: admin_head vs admin_enqueue_scripts] → `wp_add_inline_style` prints in `admin_print_styles` (head), same paint pass — no FOUC expected; verify visually.
- [`354.js` rename shifts asset names between builds] → enqueue relies on wp-scripts asset manifests; verify vendor chunk loads on a fresh build (widget screenshot path).

## Migration Plan

Single release (first submission — nothing live to migrate). Order: PHP share CRUD → dashboard UI → inline styles → email escaping → languages cleanup → deploy/readme → rebuild assets → full audit + Plugin Check on built ZIP. Rollback: git revert; no data migration involved (schema untouched, existing share rows remain valid).

## Open Questions

- None blocking. If Mailer bodies turn out to be plain-text-safe (only esc_html'd fragments), `wp_kses_post` would suffice — decide at implementation after reading Mailer; explicit array remains the default.
