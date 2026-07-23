# wporg-submission Delta

## MODIFIED Requirements

### Requirement: Non-compressed source is available

The plugin SHALL make its non-minified JavaScript/CSS source available inside the distribution ZIP itself, satisfying the WordPress.org human-readable-code guideline without relying on an external repository URL.

#### Scenario: Source ships in the ZIP
- **WHEN** the release ZIP is built and inspected with `unzip -l`
- **THEN** it contains `resources/assets/` (React/TS source), `package.json`, and `webpack.config.js`

#### Scenario: readme documents in-package source
- **WHEN** `readme.txt` is read
- **THEN** its `== Source Code ==` section states that compiled bundles in `public/` are built from the uncompiled source under `resources/assets/` included in the package, gives the build commands (`npm install && npm run build`), and documents the bundled html2canvas version, license, and the webpack vendor chunk file it compiles into

## ADDED Requirements

### Requirement: No locked or artificially capped free features

The free plugin SHALL NOT restrict any capability that its own schema and code support (trialware, Guideline 5). There SHALL be no hardcoded count caps, no early returns gated on an upgrade, no DB columns hidden from the UI as an upsell, and no settings present in the schema but absent from the settings screen.

#### Scenario: Codebase audit is clean
- **WHEN** the codebase is audited for count limits, upgrade gates, unexposed schema columns, and missing settings
- **THEN** every finding is either fixed (feature unlocked) or documented as a genuine technical constraint unrelated to upselling

### Requirement: No inline style or script echoes

Shipped PHP SHALL NOT echo raw `<style>` or `<script>` tags. Admin CSS SHALL be attached via `wp_register_style` + `wp_add_inline_style` on the `admin_enqueue_scripts` hook.

#### Scenario: Zero echo hits
- **WHEN** `grep -rn "<style" plugin/` and `grep -rn "<script" plugin/` are run
- **THEN** no shipped PHP echoes markup tags (doc comments excepted)

#### Scenario: Admin inline CSS uses the API
- **WHEN** the admin pages that previously echoed styles load
- **THEN** the same CSS rules are delivered via `wp_add_inline_style` on a registered handle hooked to `admin_enqueue_scripts`, and rendering is unchanged

### Requirement: Email template output is escaped

The email base template SHALL escape its body content with `wp_kses` against an explicit allowed-tags list at the point of output, with no `phpcs:ignore EscapeOutput` annotations remaining in shipped view files.

#### Scenario: Filtered body cannot inject
- **WHEN** a third party hooks `markaroo/notify/body` and returns HTML containing `<script>` or event-handler attributes
- **THEN** the rendered email strips the disallowed markup while preserving the template's legitimate inline-styled table/link/span markup

#### Scenario: No EscapeOutput ignores remain
- **WHEN** `grep -rn "phpcs:ignore.*EscapeOutput" plugin/ resources/` is run
- **THEN** there are zero hits

### Requirement: No compiled translation files ship

The repository and the distribution ZIP SHALL NOT contain compiled translation files (`.po`, `.mo`, translation `.json`); translations come from translate.wordpress.org. `markaroo.pot` MAY remain.

#### Scenario: Languages folder is clean
- **WHEN** `languages/` is inspected in the repo and in the built ZIP
- **THEN** it contains at most `markaroo.pot`
