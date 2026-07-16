## ADDED Requirements

### Requirement: Comment-card rows in the feedback panel
Each row in the `markaroo-panel` list SHALL render as a comment card showing: author avatar, `#<id> · <page label>` line, author name with relative time, the title (bold) or comment snippet, and a reply count when replies exist. Resolved items SHALL be visually distinct. Clicking a row SHALL open that pin's card (existing behavior preserved).

#### Scenario: Row content
- **WHEN** the panel lists a feedback item with a title and 2 replies
- **THEN** its row shows avatar, `#id · page`, author + relative time, bold title, and "2 replies"

#### Scenario: Resolved styling
- **WHEN** a listed item is resolved
- **THEN** its row renders with distinct resolved styling

#### Scenario: Row click opens pin
- **WHEN** the user clicks a row
- **THEN** the corresponding pin card opens and the page scrolls the pin into view

### Requirement: Inline resolve from panel rows
Each panel row SHALL offer a resolve/unresolve check control for users with resolve rights, without opening the pin card.

#### Scenario: Resolve from row
- **WHEN** a user with resolve rights clicks the row's resolve check on an open item
- **THEN** the item becomes resolved and moves to the Resolved tab

#### Scenario: No rights
- **WHEN** a user without resolve rights views the panel
- **THEN** no resolve control renders on rows
