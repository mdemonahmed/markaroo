<?php

defined( 'ABSPATH' ) || exit;

use Markaroo\WPBones\Database\Migrations\Migration;

class Markaroo_Create_Feedback_Table extends Migration {

	protected $usePrefix = true;

	public function up(): void {
		$this->create(
			'markaroo_feedback',
			"(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `page_key` varchar(255) NOT NULL DEFAULT '',
  `page_url` text NOT NULL,
  `comment` longtext NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `priority` varchar(20) NOT NULL DEFAULT 'normal',
  `assigned_to_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `assigned_to_name` varchar(191) NOT NULL DEFAULT '',
  `x` float NOT NULL DEFAULT 0,
  `y` float NOT NULL DEFAULT 0,
  `viewport` varchar(190) NOT NULL DEFAULT '',
  `screenshot_rect` longtext DEFAULT NULL,
  `attachments` longtext DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `screenshot_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `screenshot_path` varchar(255) NOT NULL DEFAULT '',
  `author` varchar(191) NOT NULL DEFAULT '',
  `author_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `due_date` datetime DEFAULT NULL,
  `tags` longtext DEFAULT NULL,
  `share_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `os` varchar(60) DEFAULT NULL,
  `browser` varchar(60) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `page_key` (`page_key`(191)),
  KEY `status` (`status`),
  KEY `assigned_to_id` (`assigned_to_id`),
  KEY `author_id` (`author_id`),
  KEY `created_at` (`created_at`)
) {$this->charsetCollate}"
		);
	}
}

return new Markaroo_Create_Feedback_Table();
