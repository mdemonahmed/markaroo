<?php

defined( 'ABSPATH' ) || exit;

use Markaroo\WPBones\Database\Migrations\Migration;

const MARKAROO_DB_VERSION = '1.0.0';

class Create_Markaroo_Shares_Table extends Migration {

	protected $usePrefix = true;

	public function up(): void {
		$this->create(
			'markaroo_shares',
			"(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL DEFAULT '',
  `label` varchar(191) DEFAULT NULL,
  `scope` varchar(20) NOT NULL DEFAULT 'site',
  `page_key` varchar(255) DEFAULT NULL,
  `can_comment` tinyint(1) NOT NULL DEFAULT 1,
  `can_view` tinyint(1) NOT NULL DEFAULT 1,
  `widget_mode` varchar(20) NOT NULL DEFAULT 'comment',
  `expires_at` datetime DEFAULT NULL,
  `created_by` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `token` (`token`)
) {$this->charsetCollate}"
		);
	}
}

// After all three migrations run (this file is last), record the schema version.
$instance = new Create_Markaroo_Shares_Table();

update_option( 'markaroo_db_version', MARKAROO_DB_VERSION );

/**
 * Fires after all Markaroo database tables have been created or updated.
 *
 * @param string $version The new DB schema version.
 */
do_action( 'markaroo/db/migrated', MARKAROO_DB_VERSION );

return $instance;
