# 23 — WordPress.org submission readiness

**Depends on:** all
**Goal:** Make the free plugin pass WordPress.org Plugin Directory review and the Plugin Check (PCP) tool.

## Scope (free)
- Compliant `readme.txt`, headers, licensing, and build.
- Pass the official Plugin Check plugin with no errors.

## Steps
1. **readme.txt** (WordPress.org format):
   - Header: Contributors, Tags (max 5, relevant), Requires at least 6.5, Tested up to (current), Requires PHP 8.1, Stable tag matching the version, License GPLv2+.
   - Sections: short description (≤150 chars), Description, Installation, FAQ, Screenshots, Changelog, Upgrade Notice.
   - Describe the free feature set honestly; mention a separate Pro add-on exists without misleading "freemium nag" patterns.
2. **Headers:** main file header complete (task 00); `License: GPLv2 or later`, `License URI`.
3. **Licensing of bundled code:** `html2canvas` (MIT) and any libs must be GPL-compatible and disclosed. Include `composer.json` (reviewers want it; deploy with `--wp`). Do not bundle minified-only third-party code without source.
4. **No restricted behavior:** no calling external services in free, no tracking without consent, no obfuscated code, no "powered by" injected into the site front-end without opt-in, no admin nags that violate guidelines, sanitize/escape everywhere (task 21).
5. **Prefixes:** confirm everything is prefixed (`wp_markaroo_`, `markaroo_`, `markaroo/`, table `..._markaroo_*`) to avoid collisions — reviewers check this.
6. **Plugin Check (PCP):** install the official Plugin Check plugin and resolve all errors and as many warnings as feasible (i18n, escaping, sanitization, file structure, forbidden functions).
7. **Build artifact:** deploy build excludes dev files (node_modules, src maps as needed) per WP Bones `--wp` deploy. Keep `composer.json` per WP Bones guidance.
8. **Assets:** add `assets/` banner/icon/screenshots for the directory listing (separate from plugin zip).
9. **Versioning:** semantic version; stable tag in readme matches header.

## Hooks
- None.

## Acceptance
- Plugin Check passes with zero errors.
- `readme.txt` validates (WordPress readme validator) and stable tag matches.
- Build zip activates cleanly on a fresh WP, no external calls, no PHP warnings.
- All prefixes verified by grep; no generic function/table/option names.
