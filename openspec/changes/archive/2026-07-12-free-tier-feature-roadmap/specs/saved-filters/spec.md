## ADDED Requirements

### Requirement: Persist per-user saved filters
The system SHALL persist a user's named filter combinations (status, priority, assignee, tag) in the `markaroo_saved_filters` user meta, saved and loaded through the existing settings endpoint, with no new list endpoint.

#### Scenario: Save a filter combo
- **WHEN** a user names and saves the current status+priority+assignee+tag selection
- **THEN** the combo is stored in `markaroo_saved_filters` for that user and appears on reload

#### Scenario: Apply a saved filter
- **WHEN** a user selects a saved filter
- **THEN** the task list re-queries client-side using the existing query args with no additional endpoint call

### Requirement: Default "Assigned to me" view
The task list SHALL provide a default tab that filters to feedback assigned to the current user.

#### Scenario: My tasks tab
- **WHEN** a logged-in reviewer opens the task list
- **THEN** an "Assigned to me" tab shows only rows where `assigned_to_id` equals the current user id
