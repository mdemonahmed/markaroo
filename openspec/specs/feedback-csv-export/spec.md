# feedback-csv-export Specification

## Purpose

Allow authorized reviewers to export the current filtered feedback list as CSV, streamed in bounded chunks using summary fields only so exports never load the full result set into memory.

## Requirements

### Requirement: Chunked CSV export of the filtered list
The system SHALL expose `GET markaroo/v1/feedback/export` that streams the current filtered feedback list as CSV in pages of 500 rows using the `FeedbackRepository::list(['fields' => 'summary'])` mode, never an unbounded `SELECT *`, and SHALL exclude longtext columns (comment body, screenshot_rect, attachments) by default.

#### Scenario: Export current filter
- **WHEN** an authorized user requests export with the active status/priority/assignee/tag filters
- **THEN** the system streams a CSV containing only the summary columns for matching rows, paginated 500 at a time

#### Scenario: Large result set
- **WHEN** the filtered set exceeds 500 rows
- **THEN** the system fetches and streams successive 500-row chunks without loading all rows into memory at once

### Requirement: Authorization on export
The endpoint SHALL verify the nonce and the `markaroo_manage_feedback` capability before streaming.

#### Scenario: Unauthorized export
- **WHEN** a user without `markaroo_manage_feedback` requests the export
- **THEN** the system returns 403 and streams nothing
