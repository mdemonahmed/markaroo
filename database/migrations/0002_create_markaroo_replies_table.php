<?php

defined( 'ABSPATH' ) || exit;

use Markaroo\WPBones\Database\Migrations\Migration;

class Create_Markaroo_Replies_Table extends Migration {

	protected $usePrefix = true;

	public function up(): void {
		$this->create(
			'markaroo_replies',
			"(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `feedback_id` bigint(20) unsigned NOT NULL,
  `reply_uuid` char(36) NOT NULL DEFAULT '',
  `comment` text NOT NULL,
  `author` varchar(191) NOT NULL DEFAULT '',
  `author_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `feedback_id` (`feedback_id`),
  UNIQUE KEY `reply_uuid` (`reply_uuid`)
) {$this->charsetCollate}"
		);
	}
}

return new Create_Markaroo_Replies_Table();
