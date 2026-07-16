# widget-relative-time Specification

## Purpose

Show human-friendly relative timestamps ("10 minutes ago") across the feedback widget instead of raw datetimes.

## Requirements

### Requirement: Relative timestamps across the widget
All timestamps rendered by the frontend widget (pin card thread entries, hover preview, panel rows) SHALL display as translatable relative time ("just now", "10 minutes ago", "2 hours ago", "3 days ago"; older than 7 days falls back to a localized date). The absolute localized datetime SHALL be available via the element's `title` attribute. All widget surfaces SHALL use the same shared `timeAgo` utility.

#### Scenario: Recent item
- **WHEN** a feedback item was created 10 minutes ago
- **THEN** its timestamp renders as "10 minutes ago" with the absolute datetime as a tooltip

#### Scenario: Old item
- **WHEN** a feedback item is older than 7 days
- **THEN** its timestamp renders as a localized date

### Requirement: Timezone-correct REST timestamps
The REST API SHALL emit `created_at`/`updated_at` as RFC 3339 strings with the site's UTC offset (the database stores naive site-local datetimes), so browser-local parsing never drifts.

#### Scenario: Visitor in a different timezone
- **WHEN** a pin created moments ago is viewed from a browser whose timezone differs from the site's
- **THEN** its relative time reads "just now", not offset by the timezone difference
