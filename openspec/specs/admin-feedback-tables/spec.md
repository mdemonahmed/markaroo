# admin-feedback-tables Specification

## Purpose

Consistent list surfaces for feedback: the All Feedback table's column set and row interaction, Board cards led by title, and an Approvals table that mirrors All Feedback with approve/reopen actions — all opening the shared detail modal.

## Requirements

### Requirement: All Feedback table columns and interaction

The All Feedback table SHALL show columns in this order: ID, Title, Comment (truncated), Status, Priority, Assignee, Created, Page. It SHALL NOT show a Due column. The Assignee column SHALL render the assigned user's name (or a clear unassigned marker), and assignment SHALL work end to end (set in the detail modal, persisted, filterable). Rows SHALL be clickable to open the detail modal, with bulk-select checkboxes still usable without triggering the modal.

#### Scenario: Column set
- **WHEN** the All Feedback view renders
- **THEN** the header shows ID, Title, Comment, Status, Priority, Assignee, Created, Page — and no Due column

#### Scenario: Assignee round-trip
- **WHEN** the admin assigns a user from the detail modal and filters the list by that assignee
- **THEN** the item appears in the filtered list and its Assignee column shows the user's name

#### Scenario: Checkbox does not open modal
- **WHEN** the admin clicks a row's bulk-select checkbox
- **THEN** the row is selected and the detail modal does not open

### Requirement: Board cards show title and open the detail modal

Each Board card SHALL display the item's title prominently, alongside its existing meta (priority, assignee, relative time). Clicking a card SHALL open the shared detail modal, including attachments.

#### Scenario: Card content
- **WHEN** the Board renders an item that has a title
- **THEN** the card shows the title as its primary text with meta below

#### Scenario: Card click opens modal
- **WHEN** the admin clicks a Board card
- **THEN** the shared detail modal opens with all of that card's information and attachments

### Requirement: Approvals table matches All Feedback with approve/reopen actions

The Approvals view SHALL use the same table design as All Feedback and additionally provide Approve and Reopen buttons — on each row and inside the detail modal. Acting on an item SHALL persist via the existing approve/reopen endpoints and update the list without a reload.

#### Scenario: Approve from row
- **WHEN** the admin clicks Approve on an Approvals row
- **THEN** the item is approved via REST and the row reflects the new state without reload

#### Scenario: Reopen from modal
- **WHEN** the admin opens an approval item's modal and clicks Reopen
- **THEN** the item reopens and both modal and list reflect it
