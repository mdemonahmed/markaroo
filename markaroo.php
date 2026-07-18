<?php

/**
 * Plugin Name: Markaroo — Visual Feedback & Task Management
 * Plugin URI: https://devemon.com/
 * Description: Visual Feedback, Collaboration & Task Management for Websites
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
