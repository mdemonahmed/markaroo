## ADDED Requirements

### Requirement: Read-only Developers tab
The admin UI SHALL provide a read-only "Developers" tab that renders the HOOKS.md integration contract from a bundled string, with zero runtime query cost.

#### Scenario: Render hooks doc
- **WHEN** an authorized admin opens the Developers tab
- **THEN** the HOOKS.md content is rendered read-only from bundled content without a network or DB read

#### Scenario: Content stays in sync
- **WHEN** HOOKS.md is updated in the repo and the plugin is rebuilt
- **THEN** the Developers tab reflects the updated content from the bundled string
