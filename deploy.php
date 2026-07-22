<?php

/**
 * This file is included by "bones" command. You'll find
 *
 * $this Instance of bones command console
 * $path Destination path
 *
 * You'll able to:
 *
 * Delete a file
 *   @unlink("{$path}/myfile");
 *
 * Delete a folder
 *   $console->deleteDirectory("{$path}/docs");
 *
 *
 */

/**
 * Fired when the deploy command is started
 *
 * @param object $console Instance of WPBones Console
 * @param string $path Destination path
 */
add_action('wpbones_console_deploy_start', function ($console, $path) {
  // Do something
}, 10, 2);

/**
 * Fired before building assets
 *
 * @param object $console Instance of WPBones Console
 * @param string $path Destination path
 */
add_action('wpbones_console_deploy_before_build_assets', function ($console, $path) {
  // Do something
}, 10, 2);

/**
 * Fired after building assets
 *
 * @param object $console Instance of WPBones Console
 * @param string $path Destination path
 */
add_action('wpbones_console_deploy_after_build_assets', function ($console, $path) {
  // Do something
}, 10, 2);

/**
 * Filter the list of the folder to skip for the deploy version
 *
 * @param array $folders List of folders to skip
 * @return array List of folders to skip
 */
add_filter('wpbones_console_deploy_skip_folders', function ($folders) {
  // Dev-only files/folders that must never reach the WordPress.org ZIP.
  //
  // IMPORTANT: entries MUST start with a leading slash. Bones' skip() strips
  // the plugin root from each path and compares the "/relative" remainder, so
  // an entry without the slash (e.g. "openspec") never matches and silently
  // ships. Dot-prefixed files (.git, .DS_Store, …) are auto-skipped by xcopy
  // regardless, so they don't need to be listed here.
  //
  // The JS/CSS *source* (resources/assets, package.json, lockfiles, tsconfig,
  // composer.*) is skipped by simply NOT passing --wp: bones only force-keeps
  // that source under --wp. We ship a lean production ZIP and point reviewers
  // to the public repo via the "== Source Code ==" section in readme.txt,
  // which satisfies the human-readable-source guideline.
  return array_merge($folders, [
    // AI / agent / spec tooling
    '/graphify-out',
    '/openspec',
    // Dev docs (only readme.txt ships)
    '/CLAUDE.md',
    '/PERFORMANCE_AUDIT.md',
    '/DESIGN-SYSTEM.md',
    '/HOOKS.md',
    '/FEATURES.md',
    '/Before_Submitting.md',
    // Dev tooling / config that should not ship
    '/deploy.php',
    '/release.sh',
    '/webpack.config.js',
    '/jest.config.js',
    '/phpcs.xml',
    '/phpcs.xml.dist',
    '/skills-lock.json',
    '/.distignore.removed',
    // Dev-only composer packages (require-dev: PHPCS + standards, ~16 MB).
    // These are linting tools, never autoloaded at runtime, so the production
    // ZIP must not carry them. (For a strictly composer-correct build you'd run
    // `composer install --no-dev` instead; skipping the dirs achieves the same
    // ~16 MB saving without wiping the local dev toolchain.)
    '/vendor/squizlabs',
    '/vendor/wp-coding-standards',
    '/vendor/phpcompatibility',
    '/vendor/phpcsstandards',
    '/vendor/dealerdirect',
  ]);
});

/**
 * Fired when the deploy command is completed
 *
 * @param object $console Instance of WPBones Console
 * @param string $path Destination path
 */
add_action('wpbones_console_deploy_completed', function ($console, $path) {
  // Do something
}, 10, 2);
