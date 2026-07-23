# Tasks — wporg-review-fixes

## 1. Unlock share links — backend (Guideline 5)

- [x] 1.1 ShareRepository: delete `get_or_create_singleton()` and `regenerate()`; add `update(int $id, array $data): bool` that busts token cache via `forget_token_cache` (raw $wpdb pattern, phpcs annotations)
- [x] 1.2 ShareController: replace guest_link/regenerate with `index` (list all, full payload: id, label, token, share_url, scope, page_key, can_view, can_comment, widget_mode, expires_at, created_at, is_expired), `store` (create with sanitized whitelist + `markaroo/share/token_created`), `update` (partial edit, sanitize, bust cache), `destroy` (revoke + `markaroo/share/revoked`); keep `resolve_public` unchanged
- [x] 1.3 RestServiceProvider: swap `/shares/guest-link*` routes for `GET|POST /shares`, `PUT|PATCH|DELETE /shares/(?P<id>\d+)` — manage capability + nonce on all writes
- [x] 1.4 Grep for remaining `guest-link` / `get_or_create_singleton` / `regenerate` references in PHP and fix (OnboardingController, FrontendServiceProvider, etc.)

## 2. Unlock share links — dashboard UI

- [x] 2.1 New `ShareLinksView` in dashboard-markaroo: list all links (label, scope, mode, permissions, expiry, created), copy-URL, create form with every option (label, site/page scope + page key, can_view/can_comment, widget mode, expiry), inline edit, revoke with confirm — lucide-react icons, `markaroo-` classes, shared timeAgo
- [x] 2.2 Register the view in dashboard navigation/router
- [x] 2.3 Rework `shared/GuestLinkCard.tsx`: show newest active site-wide link (create one via POST /shares if none) + "Manage share links" entry point; remove regenerate-singleton semantics; update Overview/Settings/HowToUse/onboarding touchpoints
- [x] 2.4 Build (`npm run build`), verify no console errors, links CRUD works end-to-end against local site

## 3. Inline styles

- [x] 3.1 AdminMenuServiceProvider: replace both `echo '<style>'` (lines 214, 220) with `markaroo-admin-inline` handle + `wp_add_inline_style` on `admin_enqueue_scripts`, preserving existing page conditionals
- [x] 3.2 OnboardingServiceProvider:79: attach menu-hide rule to the same handle/hook
- [x] 3.3 Verify: `grep -rn "<style" plugin/` and `grep -rn "<script" plugin/` → zero echoed-markup hits; visually confirm admin pages render identically (menu icon size, full-bleed dashboard, hidden welcome menu item)

## 4. Email template escaping

- [x] 4.1 Read Mailer body builders; define `$markaroo_allowed` wp_kses array covering exactly the emitted markup (or confirm `wp_kses_post` suffices)
- [x] 4.2 emails/base.php:44: `echo wp_kses( $markaroo_content, $markaroo_allowed )`; remove the phpcs:ignore line
- [x] 4.3 Verify: `grep -rn "phpcs:ignore.*EscapeOutput" plugin/ resources/` → zero hits; test-send each notification type and confirm markup intact

## 5. Translation files

- [x] 5.1 Delete `languages/markaroo.mo`, `markaroo.po`, `markaroo-it_IT.mo`, `markaroo-it_IT.po`, and the it_IT `.json`; keep `markaroo.pot`
- [x] 5.2 deploy.php: add skips so compiled translation files never ship

## 6. Packaging — source in ZIP

- [x] 6.1 deploy.php: remove `/webpack.config.js` from skip list; update the stale comment block documenting the no-`--wp` strategy; switch documented flow to `php bones deploy <target> --wp`
- [x] 6.2 readme.txt: rewrite `== Source Code ==` to the in-package wording (source under `resources/assets/`, `npm install && npm run build`, html2canvas 1.4.1 MIT compiled into the named vendor chunk); drop the repo-URL dependency
- [x] 6.3 Build ZIP with `php bones deploy <target> --wp`; verify with `unzip -l`: `resources/assets/` present, `package.json` + `webpack.config.js` present, no `.po`/`.mo`, no dev docs/vendor phpcs; check size sane
- [x] 6.4 Verify named html2canvas vendor chunk loads on a fresh build (widget screenshot capture works); confirm no `354.js` references anywhere

## 7. Trialware audit + final checks

- [x] 7.1 Audit sweep: hardcoded count limits, upgrade-gated early returns, DB columns without UI, settings keys missing from settings screen, capability checks that silently cap — fix or document each finding
- [x] 7.2 phpcs (WordPress ruleset) clean on all touched PHP; Jest passes
- [x] 7.3 Plugin Check against the built ZIP: zero ERRORs; smoke-test share links as guest (multi-link, page scope, expiry, view-only) per spec scenarios
