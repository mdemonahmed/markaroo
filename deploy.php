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
 * Bones' built-in default skip list always drops webpack.config.js, but the
 * WordPress.org human-readable-code guideline requires the build config to
 * ship alongside the uncompiled source — remove it from the defaults.
 *
 * @param array $folders Default list of files/folders to skip
 * @return array Filtered list
 */
add_filter('wpbones_console_deploy_default_skip_files_folders', function ($folders) {
  return array_values(array_diff($folders, ['/webpack.config.js']));
});

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
  // Build the release with `php bones deploy <target> --wp`: --wp force-keeps
  // the uncompiled JS/CSS source (resources/assets, package.json, lockfiles,
  // tsconfig) INSIDE the ZIP, and webpack.config.js is deliberately NOT
  // skipped below. Shipping readable source in-package is what satisfies the
  // WordPress.org human-readable-code guideline — the readme.txt
  // "== Source Code ==" section documents the build steps.
  return array_merge($folders, [
    // AI / agent / spec tooling
    '/graphify-out',
    '/openspec',
    '/.codegraph',
	'/.mcp.json',
    // Dev docs (only readme.txt ships)
    '/CLAUDE.md',
    '/PERFORMANCE_AUDIT.md',
    '/DESIGN-SYSTEM.md',
    '/HOOKS.md',
    '/FEATURES.md',
    '/Before_Submitting.md',
    // Dev tooling / config that should not ship (webpack.config.js DOES ship —
    // it is required to rebuild the bundles from the included source)
    '/deploy.php',
    '/release.sh',
    '/jest.config.js',
    '/phpcs.xml',
    '/phpcs.xml.dist',
    '/skills-lock.json',
    '/.distignore.removed',
    // Compiled translations never ship — translate.wordpress.org handles them.
    // Only languages/markaroo.pot may remain in the repo.
    '/languages/markaroo.mo',
    '/languages/markaroo.po',
    '/languages/markaroo-it_IT.mo',
    '/languages/markaroo-it_IT.po',
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
    // CLI shims/binaries — never executed by WordPress at runtime. Reviewer
    // flagged vendor/bin/{phpcs,phpcbf,yaml-lint} and symfony/yaml's bundled
    // yaml-lint. symfony/yaml itself is a runtime dep (wpbones/wpkirk-helpers)
    // so only its Resources/bin goes, not the library.
    '/vendor/bin',
    '/vendor/symfony/yaml/Resources/bin',
  ]);
});

/**
 * Fired when the deploy command is completed
 *
 * @param object $console Instance of WPBones Console
 * @param string $path Destination path
 */
add_action('wpbones_console_deploy_completed', function ($console, $path) {
  // xcopy mkdirs a parent before its skipped child is evaluated, so skipping
  // /vendor/symfony/yaml/Resources/bin leaves an empty Resources/ shell —
  // remove it (rmdir only succeeds on empty dirs, so this is safe).
  @rmdir("{$path}/vendor/symfony/yaml/Resources");
}, 10, 2);
