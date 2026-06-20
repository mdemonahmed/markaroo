<?php

namespace Markaroo\Http\Controllers\Dashboard;

use Markaroo\Http\Controllers\Controller;

if (!defined('ABSPATH')) {
  exit();
}

class DashboardController extends Controller
{
  public function index()
  {
    return Markaroo()
      ->view('dashboard.index')
      ->withAdminStyle('prism')
      ->withAdminScript('prism')
      ->withAdminStyle('markaroo-common')
      ->withAdminAppsScript('app');
  }
}
