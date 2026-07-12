## ADDED Requirements

### Requirement: Admin-bar open-feedback count
The system SHALL add a WP admin-bar node showing the open feedback count for the current page to logged-in users with `markaroo_manage_feedback`, sourced from the transient-cached `/counts` (`counts_page_<md5>`) with zero extra queries on a warm cache.

#### Scenario: Warm cache render
- **WHEN** a reviewer with a warm counts cache loads a page that has 3 open items
- **THEN** the admin bar shows "3 open" without issuing an additional count query

#### Scenario: No capability
- **WHEN** a user without `markaroo_manage_feedback` loads a page
- **THEN** no admin-bar count node is rendered

#### Scenario: Zero open items
- **WHEN** the current page has no open feedback
- **THEN** the admin-bar node shows a zero/neutral state rather than being hidden inconsistently
