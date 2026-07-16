# panel-comment-list Specification

## Purpose

Present the docked feedback panel as a Figma-like list of comment cards, with the Unresolved/Resolved tabs controlling both the list and the pins shown on the page.

## Requirements

### Requirement: Comment-card rows in the feedback panel
Each row in the `markaroo-panel` list SHALL render as a comment card showing: author avatar, `#<id> · <page label>` line, author name with relative time, and the title (bold) or a comment snippet. Resolved items SHALL be visually distinct. Clicking a row SHALL open that pin's card. The panel SHALL always dock on the right side of the viewport, above the capture overlay so it stays usable while pinning.

#### Scenario: Row content
- **WHEN** the panel lists a feedback item with a title
- **THEN** its row shows avatar, `#N · page`, author + relative time, and the bold title

#### Scenario: Resolved styling
- **WHEN** a listed item is resolved
- **THEN** its row renders with distinct resolved styling

#### Scenario: Row click opens pin
- **WHEN** the user clicks a row
- **THEN** the corresponding pin card opens

### Requirement: Inline resolve from panel rows
Each panel row SHALL offer a resolve/unresolve check control for users with resolve rights, without opening the pin card.

#### Scenario: Resolve from row
- **WHEN** a user with resolve rights clicks the row's resolve check on an open item
- **THEN** the item becomes resolved and moves to the Resolved tab

#### Scenario: No rights
- **WHEN** a user without resolve rights views the panel
- **THEN** no resolve control renders on rows

### Requirement: On-page pins follow the panel tab
The Unresolved/Resolved tab SHALL act as a shared status filter: the panel list AND the on-page pin markers SHALL show only items matching the selected tab. The default SHALL be Unresolved. Creating new feedback SHALL snap the filter back to Unresolved so the new pin is visible. Pin display numbers SHALL come from the full list so they match the panel regardless of tab.

#### Scenario: Default shows unresolved
- **WHEN** the session is enabled with both open and resolved feedback on the page
- **THEN** only unresolved pins render on the page

#### Scenario: Switch to Resolved
- **WHEN** the user selects the Resolved tab
- **THEN** only resolved pins render on the page and in the list

#### Scenario: Resolving hides the pin
- **WHEN** the user resolves an item while on the Unresolved tab
- **THEN** its pin and row disappear from the current view
