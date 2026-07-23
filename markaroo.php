<?php

/**
 * Plugin Name: Markaroo — Visual Feedback, Review & Task Management
 * Plugin URI: https://markaroo.devemon.com/
 * Description: Visual Feedback, Review & Task Management for Websites. Collect visual feedback on any page. Clients pin comments, you assign tasks, set priority, and reply without leaving the site.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: Emon Ahmed
 * Author URI: https://devemon.com/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: markaroo
 * Domain Path: /languages
 *
 */

if (!defined('ABSPATH')) {
  exit();
}

// Keep in sync with the "Version:" header above (the release tooling updates both).
if (!defined('MARKAROO_VERSION')) {
  define('MARKAROO_VERSION', '1.0.0');
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our application. We just need to utilize it! We'll simply require it
| into the script here so that we don't have to worry about manual
| loading any of our classes later on. It feels nice to relax.
|
*/

require_once __DIR__ . '/bootstrap/autoload.php';
