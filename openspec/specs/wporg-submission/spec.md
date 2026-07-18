# wporg-submission Specification

## Purpose

Define the contract for producing a WordPress.org-compliant Markaroo distribution: the file-exclusion manifest that determines what ships in the release ZIP, and the code/header/readme compliance requirements the shipped files must satisfy to pass the Plugin Check tool with zero ERRORs.

## Requirements

### Requirement: Distribution excludes all non-production files

The distributed plugin ZIP SHALL contain only production runtime files. The release SHALL be built with the WP Bones deploy command (`php bones deploy <target> --wp`), and its `deploy.php` `wpbones_console_deploy_skip_folders` filter SHALL exclude all development-only files and directories so that Plugin Check, run against the built ZIP, reports zero `hidden_files`, `application_detected`, `ai_instruction_directory`, and `unexpected_markdown_file` findings.

#### Scenario: Hidden and dev files are absent from the ZIP
- **WHEN** the release ZIP is built with `php bones deploy --wp` and inspected
- **THEN** it contains no `.DS_Store`, no dotfiles (`.gitignore`, `.editorconfig`, `.prettierrc`, `.eslintignore`, `.stylelintignore`, `.php-cs-fixer.cache`, `.gitattributes`), no `.claude/`, `.agents/`, `graphify-out/`, `.codegraph/`, or `openspec/` directories, and no `.distignore`

#### Scenario: Dev scripts and non-shipping PHP are absent
- **WHEN** the release ZIP is inspected
- **THEN** it contains no shell scripts (`*.sh`) and no `deploy.php`

#### Scenario: Only permitted markdown ships
- **WHEN** the release ZIP root is inspected
- **THEN** `CLAUDE.md`, `PERFORMANCE_AUDIT.md`, `DESIGN-SYSTEM.md`, `HOOKS.md`, `FEATURES.md`, and `Before_Submitting.md` are absent, and only `readme.txt` (plus any WP-expected files) remain

### Requirement: Plugin header and readme are directory-compliant

The plugin header and `readme.txt` SHALL satisfy the WordPress.org header requirements so that Plugin Check reports no `plugin_header_invalid_domain_path`, `outdated_tested_upto_header`, or `mismatched_plugin_name` findings.

#### Scenario: Domain Path is a valid path
- **WHEN** Plugin Check parses `markaroo.php`
- **THEN** the `Domain Path` header value starts with a forward slash (`/languages`)

#### Scenario: Tested-up-to is current
- **WHEN** Plugin Check parses `readme.txt`
- **THEN** the `Tested up to` value equals the current stable WordPress version and does not trigger `outdated_tested_upto_header`

#### Scenario: Plugin name matches the header
- **WHEN** Plugin Check compares the `readme.txt` title with the plugin header `Plugin Name`
- **THEN** the two names match and `mismatched_plugin_name` is not raised

### Requirement: Shipped PHP passes i18n and escaping sniffs

All PHP that ships in the ZIP SHALL pass the WordPress i18n and output-escaping sniffs so Plugin Check reports no `WordPress.WP.I18n.*` or `WordPress.Security.EscapeOutput.*` ERRORs in production files.

#### Scenario: Plural translations carry a translators comment
- **WHEN** Plugin Check scans `Mailer.php`
- **THEN** the `_n()` call at the digest branch has a `translators:` comment on the line directly above it, and `MissingTranslatorsComment` is not raised

#### Scenario: No mismatched text domains ship
- **WHEN** Plugin Check scans all shipped PHP
- **THEN** every i18n function uses the `markaroo` text domain and no `TextDomainMismatch` ERROR is reported

### Requirement: Direct database access is prepared, annotated, and prefixed

Production `$wpdb` usage SHALL use `$wpdb->prepare()` for all value placeholders, safely handle table-name identifiers, and carry justified `phpcs:ignore` annotations for unavoidable direct/uncached queries, so that Plugin Check reports no unresolved `WordPress.DB.PreparedSQL.*` or `PluginCheck.Security.DirectDB.*` findings in shipped files.

#### Scenario: Value parameters are prepared
- **WHEN** Plugin Check scans the repository and support layer
- **THEN** every interpolated value parameter uses a `$wpdb->prepare()` placeholder, and `InterpolatedNotPrepared` / `UnfinishedPrepare` are not raised for value parameters

#### Scenario: Table identifiers and direct calls are annotated
- **WHEN** a query must interpolate a `{$table}` identifier or run a direct/uncached call that cannot use placeholders or object cache
- **THEN** the line carries a `phpcs:ignore` annotation naming the sniff and the reason, so the sniff is acknowledged rather than left open

### Requirement: Plugin-defined globals and classes are prefixed

Migration classes and plugin-scoped global variables SHALL carry the plugin prefix so Plugin Check reports no `WordPress.NamingConventions.PrefixAllGlobals.*` findings in shipped files.

#### Scenario: Migration classes are prefixed
- **WHEN** Plugin Check scans `database/migrations/*.php`
- **THEN** each migration class name is prefixed (e.g. `Markaroo_Create_Feedback_Table`) and `NonPrefixedClassFound` is not raised

#### Scenario: Bootstrap globals are prefixed or scoped
- **WHEN** Plugin Check scans `bootstrap/autoload.php` and migration files
- **THEN** plugin-defined globals (`$start`, `$instance`) are prefixed or refactored to local scope and `NonPrefixedVariableFound` is not raised

### Requirement: Shipped PHP avoids WordPress.org-rejected patterns

Production PHP SHALL avoid the syntax patterns the WordPress.org SVN pre-commit hooks reject, so a commit to the plugin directory is not blocked.

#### Scenario: No class-constant lists
- **WHEN** a plain array lists class names (e.g. the service-provider list in `config/plugin.php`)
- **THEN** each entry is a fully-qualified string (`'Markaroo\Providers\X'`), not a `::class` constant

#### Scenario: No static::class
- **WHEN** code needs the current class name for late static binding
- **THEN** it uses `get_called_class()` rather than `static::class`

#### Scenario: No inline empty() on a method call
- **WHEN** a method result is tested with `empty()`
- **THEN** the result is assigned to a variable first, then tested

### Requirement: Non-compressed source is available

The plugin SHALL make its non-minified JavaScript/CSS source available, satisfying the WordPress.org human-readable-code guideline.

#### Scenario: Source ships and is documented
- **WHEN** the release is built with `php bones deploy --wp`
- **THEN** the `resources/assets/` source is retained in the ZIP, and `readme.txt` documents the public source repository and the build command

### Requirement: Built ZIP passes Plugin Check with zero errors

Before submission, Plugin Check run against the built distribution ZIP SHALL report zero ERROR-level findings.

#### Scenario: Clean check on the built artifact
- **WHEN** the release ZIP is built with `php bones deploy --wp` and re-scanned with Plugin Check
- **THEN** the report contains zero ERROR rows
