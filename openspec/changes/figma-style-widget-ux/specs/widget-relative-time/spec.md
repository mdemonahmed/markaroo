## ADDED Requirements

### Requirement: Relative timestamps across the widget
All timestamps rendered by the frontend widget (pin card thread entries, hover preview, panel rows) SHALL display as translatable relative time ("just now", "10 minutes ago", "2 hours ago", "3 days ago"; older than 7 days falls back to a localized date). The absolute localized datetime SHALL be available via the element's `title` attribute.

#### Scenario: Recent item
- **WHEN** a feedback item was created 10 minutes ago
- **THEN** its timestamp renders as "10 minutes ago" with the absolute datetime as a tooltip

#### Scenario: Old item
- **WHEN** a feedback item is older than 7 days
- **THEN** its timestamp renders as a localized date

#### Scenario: Shared helper
- **WHEN** any widget surface (card, preview, panel) renders a timestamp
- **THEN** it uses the same shared `timeAgo` utility so formatting is consistent
