# 22 — Internationalization

**Depends on:** all UI tasks
**Goal:** Everything user-facing is translatable under the `markaroo` text domain, in both PHP and React. (AI translation of feedback content is **pro** — this task is about UI strings only.)

## Scope (free)
- PHP strings wrapped with the `markaroo` text domain.
- React/JS strings localized via WP's JS i18n (`@wordpress/i18n`) with `wp_set_script_translations`.
- `markaroo.pot` generated and shipped.

## Steps
1. **PHP:** wrap all strings in `__()`, `_e()`, `esc_html__()`, `_n()`, etc., with domain `markaroo`. Load the text domain (WP Bones handles this; verify domain path `/languages`).
2. **React:** import `__`, `_n`, `sprintf` from `@wordpress/i18n`. Pass critical strings/labels through `window.markarooConfig.i18n` where build-time extraction is awkward, but prefer `@wordpress/i18n` so strings appear in the POT.
3. **Script translations:** call `wp_set_script_translations('markaroo-widget', 'markaroo', plugin languages path)` and same for the admin handle.
4. **POT generation:** add a build step (`wp i18n make-pot` or the bones/npm equivalent) covering PHP + JS. Document the command. Ship `languages/markaroo.pot`.
5. **No concatenation** of translatable fragments; use `sprintf` with placeholders. Provide translator comments for ambiguous strings.
6. Locale-aware date/number formatting in the dashboard and pins.

## Hooks
- None required.

## Acceptance
- `markaroo.pot` contains all PHP and JS strings.
- Switching site language to a translated locale translates both admin and widget UI.
- No raw, untranslated user-facing English remains; no string concatenation of fragments.
