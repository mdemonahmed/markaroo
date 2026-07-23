# WordPress.org Review Fixes

## Why

WordPress.org plugin review flagged five blockers. The hard one: share links are capped to a single site-wide guest link while the DB schema/code supports multiple links with scope, permissions, widget modes, and expiry — a Guideline 5 (trialware) violation. Reviewer warns next round with the same findings ends the review. Must fix all five before resubmission.

## What Changes

- **Unlock share links (Guideline 5)**: full CRUD for guest share links — multiple links, per-link label, scope (site/page), can_view/can_comment permissions, widget mode (comment/view/clean), optional expiry. REST endpoints + dashboard management UI. Remove `get_or_create_singleton()` collapse-to-one behavior. **BREAKING** for the old single-link REST shape (`/shares/guest-link`) — replaced by `/shares` CRUD; existing token rows remain valid.
- **Trialware self-audit**: sweep for hardcoded count limits, early-return "pro" gates, DB columns never exposed in UI, settings in schema missing from settings screen. Fix or document each.
- **Inline styles → wp_add_inline_style**: replace all three `echo '<style>'` calls (OnboardingServiceProvider.php:79, AdminMenuServiceProvider.php:214 + 220) with registered handle + `wp_add_inline_style` on `admin_enqueue_scripts`. Grep confirms no other hits.
- **Email template escaping**: `resources/views/emails/base.php:44` — escape `$markaroo_content` with `wp_kses` + explicit allowed-tags array (email HTML needs inline `style` attrs on tables/spans/links); remove the `phpcs:ignore EscapeOutput` comment. Only one such ignore exists in the codebase.
- **Ship readable source in the ZIP**: deploy currently strips `resources/assets`, `package.json`, `webpack.config.js` (no `--wp`). Change deploy so the ZIP includes uncompiled source + build config; rewrite `readme.txt` "== Source Code ==" to point at in-package source (drop reliance on repo URL). Document the html2canvas vendor chunk (`vendors-node_modules_html2canvas_dist_html2canvas_js.js`, formerly `354.js`).
- **Remove compiled translation files**: delete `languages/*.po`, `*.mo`, and the `.json` translation file; add skips to `deploy.php` so they never ship. Keep `markaroo.pot`.

## Capabilities

### New Capabilities
- `share-links-management`: multiple guest share links with per-link label, scope, permissions, widget mode, and expiry — REST CRUD + dashboard UI, all free.

### Modified Capabilities
- `wporg-submission`: packaging requirements change — ZIP must contain uncompiled source + build config, no compiled translation files, no inline `<style>` echoes, no unescaped template output.

## Impact

- PHP: `ShareRepository`, `ShareController`, `RestServiceProvider` (new routes), `AdminMenuServiceProvider`, `OnboardingServiceProvider`, `resources/views/emails/base.php`, `deploy.php`.
- React: `dashboard-markaroo` app — new share-links management view/section replacing single `GuestLinkCard`; `shared/GuestLinkCard.tsx`, `SettingsView.tsx`, `OverviewView.tsx`, `HowToUseView.tsx` touchpoints.
- Frontend widget: token resolution (`resolve_public`) already handles scope/permissions/expiry per-row — unchanged.
- Packaging: `php bones deploy` flow, `readme.txt`, `languages/`.
- Data: no schema change — `wp_markaroo_shares` already has every needed column.
