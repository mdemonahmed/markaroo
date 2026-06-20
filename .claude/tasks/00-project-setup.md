# 00 — Project setup & boilerplate rename

**Depends on:** none
**Goal:** Stand up the WP Bones boilerplate renamed to Markaroo, installable and activatable on a clean WP 6.5+ site.

## Scope (free)
- Clone/start from the WP Bones boilerplate (`wpbones/WPKirk-Boilerplate`, or Database boilerplate for migrations).
- Rename namespace, slug, text domain, and main file to Markaroo.
- Working build pipeline for React (admin + widget) and styles.

## Steps
1. Initialize the WP Bones boilerplate. Set the plugin namespace to `Markaroo` using the bones rename command (check Context7 docs for the exact `php bones rename` syntax). Confirm the `namespace` file is updated.
2. Main plugin file `markaroo.php` header:
   - Plugin Name: Markaroo
   - Description: Visual feedback, collaboration & task management for websites.
   - Version: 1.0.0
   - Requires at least: 6.5
   - Requires PHP: 8.1
   - Text Domain: markaroo
   - Domain Path: /languages
   - License: GPLv2 or later
3. Set `config/plugin.php` values (name, slug `markaroo`, options key `markaroo_settings`).
4. `composer.json`: name `markaroo/markaroo`, PHP `>=8.1`, include WP Bones. Add Eloquent if the boilerplate doesn't bundle it (task 02 needs models).
5. `package.json`: scripts for dev/build of the React apps; add `html2canvas` as a dependency (used in task 09).
6. Confirm `php bones` CLI runs and the asset build (`npm run build`) produces files in `public/`.
7. Add `.editorconfig`, `phpcs.xml` (WordPress ruleset), and ESLint/Prettier config.
8. Add `defined('ABSPATH') || exit;` guard pattern to the file stubs.

## Files
- `markaroo.php`, `config/plugin.php`, `composer.json`, `package.json`, `phpcs.xml`, `.editorconfig`, `readme.txt` (stub).

## Hooks
- None yet.

## Acceptance
- Plugin activates and deactivates with no PHP notices on WP 6.5+ / PHP 8.1.
- `npm run build` succeeds; compiled assets land in `public/`.
- `phpcs` runs against the WordPress ruleset with no setup errors.
- Plugin namespace, slug, and text domain are all `Markaroo`/`markaroo` (no leftover `WPKirk`).
