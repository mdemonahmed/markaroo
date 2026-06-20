<?php

if (!defined('ABSPATH')) {
  exit();
}

/*
|--------------------------------------------------------------------------
| Plugin Menus routes
|--------------------------------------------------------------------------
|
| Here is where you can register all the menu routes for a plugin.
| In this context, the route are the menu link.
|
*/

return [
  'markaroo_main_menu' => [
    'page_title' => 'Markaroo',
    'menu_title' => 'Markaroo',
    'capability' => 'manage_options',
    'icon'       => 'wpbones-logo-menu.png',
    'items'      => [
      [
        'page_title' => 'Dashboard',
        'menu_title' => 'Dashboard',
        'capability' => 'manage_options',
        'route'      => [
          'get' => 'Dashboard\DashboardController@index',
        ],
      ],
    ],
  ]
];
