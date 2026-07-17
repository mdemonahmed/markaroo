## ADDED Requirements

### Requirement: Navigation uses the defined item set with consistent icons

The admin navigation SHALL present, in order: Dashboard, All Feedback, Board, Approvals, Email Notification, Settings, Developers, Give us Feedback, How to Use. Every item SHALL have a semantically meaningful SVG icon from one consistent set (same stroke width and sizing). The active item SHALL be visually highlighted, and each view SHALL be deep-linkable via URL hash.

#### Scenario: Renamed and new items present
- **WHEN** the admin dashboard loads
- **THEN** the nav shows "All Feedback" (not "All Reviews") and includes Email Notification, Give us Feedback, and How to Use

#### Scenario: Deep link restores view
- **WHEN** the admin opens the dashboard URL with `#board`
- **THEN** the Board view is active and highlighted in the nav

### Requirement: Overview stats are linked and Overdue is removed

The Overview SHALL NOT show an Overdue stat box. Each remaining stat box SHALL link to the All Feedback view filtered accordingly. The Top Pages list SHALL display each page's full URL, rendered as a link that opens that page in a new tab.

#### Scenario: No overdue box
- **WHEN** the Overview renders
- **THEN** no Overdue stat box is present

#### Scenario: Top page links out
- **WHEN** the admin clicks a Top Pages entry
- **THEN** the full page URL opens in a new tab

#### Scenario: Stat box navigates
- **WHEN** the admin clicks the Open stat box
- **THEN** the All Feedback view opens filtered to open items

### Requirement: Shared feedback detail modal

Clicking a feedback row (All Feedback, Approvals) or card (Board) SHALL open a centered modal showing the item's full detail: title, markdown-rendered comment, status and priority controls, assignee select, screenshot (when present), attachments (when present), tags, a link to the page, author and timestamps, and replies. The modal SHALL close on Escape, on outside click, and via a visible close button. Edits made in the modal SHALL persist via the existing REST endpoints and reflect in the underlying list without a page reload.

#### Scenario: Row click opens detail
- **WHEN** the admin clicks a row in All Feedback
- **THEN** a centered modal opens with that item's full details including attachments and replies

#### Scenario: Assignment from modal persists
- **WHEN** the admin selects an assignee in the modal
- **THEN** the change saves via REST and the table's Assignee column updates without reload

#### Scenario: Modal dismissal
- **WHEN** the admin presses Escape or clicks outside the modal
- **THEN** the modal closes and the list state is preserved
