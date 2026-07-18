# Data Purge

## ADDED Requirements

### Requirement: Purge endpoint
The plugin SHALL expose `POST /markaroo/v1/deactivate-cleanup`. The handler MUST verify a valid REST nonce and the `activate_plugins` capability; any other caller SHALL receive a 403 and no data SHALL be touched.

#### Scenario: Authorized purge
- **WHEN** an admin with `activate_plugins` posts with a valid nonce
- **THEN** the purge runs and the response reports success

#### Scenario: Unauthorized caller rejected
- **WHEN** a request lacks the nonce or the capability
- **THEN** the endpoint returns 403 and nothing is deleted

### Requirement: Complete data removal
The purge SHALL remove all Markaroo data: drop the `{prefix}markaroo_feedback`, `{prefix}markaroo_replies`, and `{prefix}markaroo_shares` tables; delete all `markaroo_*` options and transients; delete Markaroo user meta; unschedule Markaroo cron events; and permanently delete every media attachment tagged with `_markaroo_attachment` meta (screenshots and file uploads), including their files on disk.

#### Scenario: Tables dropped
- **WHEN** the purge runs
- **THEN** the three Markaroo tables no longer exist

#### Scenario: Tagged media deleted
- **WHEN** the purge runs on a site with Markaroo screenshots and uploaded attachments
- **THEN** every attachment with `_markaroo_attachment` meta is force-deleted from the media library and disk

#### Scenario: Non-Markaroo media untouched
- **WHEN** the purge runs
- **THEN** attachments without the `_markaroo_attachment` meta remain intact

### Requirement: Single source of deletion logic
The purge SHALL reuse the same deletion routines as `uninstall.php` (a shared `Support\Uninstall::purge()`), so uninstall and deactivation cleanup can never drift apart. `uninstall.php` behavior and the `delete_data_on_uninstall` setting SHALL remain unchanged.

#### Scenario: Uninstall unchanged
- **WHEN** the plugin is uninstalled with `delete_data_on_uninstall` disabled
- **THEN** data is preserved exactly as before this change

### Requirement: Pro extension hook
The purge SHALL fire `markaroo/deactivate/cleanup` before deleting core data so the Pro plugin can remove its own tables, options, and files in the same pass.

#### Scenario: Pro hook fires
- **WHEN** the purge runs with the Pro plugin active
- **THEN** `markaroo/deactivate/cleanup` fires before core deletion
