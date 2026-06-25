<?php

defined( 'ABSPATH' ) || exit;

/*
|--------------------------------------------------------------------------
| Plugin activation
|--------------------------------------------------------------------------
|
| WP Bones automatically runs all files in database/migrations/ after this
| file is included. The markaroo/db/migrated action and markaroo_db_version
| option are set by the last migration file (0003_create_markaroo_shares_table)
| so they fire AFTER all tables exist.
|
*/
