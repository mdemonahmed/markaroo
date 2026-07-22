<?php

namespace Markaroo\Http\Controllers\Dashboard;

use Markaroo\Http\Controllers\Controller;

defined( 'ABSPATH' ) || exit;

class DashboardController extends Controller {

	public function index() {
		return Markaroo()
			->view( 'dashboard.index' )
			->withAdminStyle( 'markaroo-common' )
			// false: the app bundle emits no module CSS (styles ship in
			// markaroo-common.css above) — avoids a 404 for apps/dashboard-markaroo.css.
			->withAdminAppsScript( 'dashboard-markaroo', false );
	}
}
