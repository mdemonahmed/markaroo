# deactivation-dialog Specification

## Purpose

Intercept Markaroo's Deactivate link on `plugins.php` with a branded modal that lets an admin keep or delete all data, optionally report a bug or give a reason, and always offers a plain-deactivate escape hatch — never trapping the user.

## Requirements

### Requirement: Deactivate link interception
The plugin SHALL intercept clicks on Markaroo's Deactivate link on the `plugins.php` screen and show a Markaroo-branded modal instead of deactivating immediately. Assets for the modal SHALL load only on `plugins.php` and only for users who can `activate_plugins`. Other plugins' Deactivate links MUST NOT be affected.

#### Scenario: Click opens the modal
- **WHEN** an admin clicks Deactivate under Markaroo on the plugins screen
- **THEN** the modal opens and the browser does not navigate to the deactivation URL

#### Scenario: Other plugins unaffected
- **WHEN** an admin clicks Deactivate under any other plugin
- **THEN** that plugin deactivates normally with no Markaroo modal

#### Scenario: Assets scoped
- **WHEN** any admin page other than `plugins.php` loads
- **THEN** the deactivation modal JS/CSS are not enqueued

### Requirement: Keep-data path
The modal SHALL offer "Keep data & deactivate" as the default, pre-selected action. Choosing it SHALL navigate to the original WordPress deactivation URL unchanged, preserving current behavior (transients and cron cleared by the existing deactivation hook, all data intact).

#### Scenario: Keep and deactivate
- **WHEN** the user confirms with "Keep data & deactivate" selected
- **THEN** the plugin deactivates and all Markaroo tables, options, and media remain

### Requirement: Delete-data path
The modal SHALL offer "Delete all data & deactivate". Because this is irreversible, the confirm button SHALL stay disabled until the user completes an explicit safeguard (checking an "I understand this permanently deletes all Markaroo data" checkbox). On confirm, the modal SHALL call the purge endpoint, show progress, and navigate to the deactivation URL only after the purge succeeds.

#### Scenario: Safeguard gates the destructive action
- **WHEN** "Delete all data" is selected but the confirmation checkbox is unchecked
- **THEN** the confirm button is disabled

#### Scenario: Purge then deactivate
- **WHEN** the user checks the safeguard and confirms
- **THEN** the purge endpoint is called, and the plugin deactivates only after a success response

#### Scenario: Purge failure keeps the plugin active
- **WHEN** the purge endpoint returns an error
- **THEN** the modal shows the error, the plugin remains active, and no navigation occurs

### Requirement: Bug report path
The modal SHALL offer a "Found a bug?" path with an inline form (email + message) that submits through the existing plugin-feedback pipeline. Submitting the report MUST NOT delete data and MUST NOT block subsequent deactivation.

#### Scenario: Report then continue
- **WHEN** the user submits a bug report from the modal
- **THEN** the report is emailed via the existing pipeline and the user can still choose keep or delete and deactivate

### Requirement: Optional reason survey
The modal SHALL show an optional single-choice reason list (temporary deactivation, found a bug, missing feature, done with this project, other + free text). Selection SHALL be sent through the existing plugin-feedback pipeline alongside the chosen action, and skipping it MUST NOT block any path.

#### Scenario: Survey is skippable
- **WHEN** the user confirms deactivation without selecting a reason
- **THEN** deactivation proceeds and no survey email is sent

### Requirement: Escape hatch
The modal SHALL always provide a way out that never traps the user: closing the modal (X, Escape key, overlay click) cancels deactivation entirely, and a "Skip & deactivate" link performs plain deactivation with no survey and no purge.

#### Scenario: Close cancels
- **WHEN** the user presses Escape or clicks the X or the overlay
- **THEN** the modal closes and the plugin stays active

#### Scenario: Skip deactivates plainly
- **WHEN** the user clicks "Skip & deactivate"
- **THEN** the plugin deactivates immediately, keeping all data

### Requirement: Accessibility and i18n
The modal SHALL be keyboard operable (focus moves into the dialog on open, Escape closes, `role="dialog"` + `aria-modal`), all strings SHALL be translatable in the `markaroo` text domain, and all CSS classes SHALL use the `markaroo-` prefix.

#### Scenario: Keyboard flow
- **WHEN** the modal opens
- **THEN** focus is inside the dialog and Escape closes it
