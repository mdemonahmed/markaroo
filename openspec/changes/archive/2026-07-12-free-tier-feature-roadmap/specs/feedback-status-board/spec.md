## ADDED Requirements

### Requirement: Kanban status board
The dashboard SHALL provide a status-board view with one column per status (open / in progress / resolved / approved), each column fetched with `per_page=25` using the summary field mode.

#### Scenario: Board renders columns
- **WHEN** a reviewer opens the status board
- **THEN** each status column loads its first 25 matching items using summary columns only

### Requirement: Drag to change status
Dragging a card between columns SHALL change that feedback's status via a single PATCH and SHALL fire the existing `markaroo/status/changed` action.

#### Scenario: Drag to resolved
- **WHEN** the user drags a card from "open" to "resolved"
- **THEN** the system issues one PATCH updating that row's status and `markaroo/status/changed` fires

#### Scenario: Failed move reverts
- **WHEN** the PATCH for a drag fails
- **THEN** the card returns to its original column and an error is surfaced
