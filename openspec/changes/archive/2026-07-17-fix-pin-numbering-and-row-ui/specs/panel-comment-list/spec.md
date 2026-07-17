## MODIFIED Requirements

### Requirement: Comment-card rows in the feedback panel
Each row in the `markaroo-panel` list SHALL render as a comment card leading with the author's avatar beside the author name and relative time, followed by the title as the visually dominant line and a comment snippet as muted secondary text. The row SHALL NOT render a `<page label>` line, and the `#N` reference SHALL render as muted secondary text rather than as a headline. Author name and title SHALL be visually distinguishable from each other. Resolved items SHALL be visually distinct. Clicking a row SHALL open that pin's card. The panel SHALL always dock on the right side of the viewport, above the capture overlay so it stays usable while pinning.

#### Scenario: Row content
- **WHEN** the panel lists a feedback item with a title
- **THEN** its row shows the author avatar next to the author name and relative time, with the title rendered below in dominant styling

#### Scenario: No page label
- **WHEN** the panel lists any feedback item
- **THEN** no `Page` label renders on the row, and the `#N` reference renders as muted secondary text

#### Scenario: Author and title are distinguishable
- **WHEN** the panel lists a feedback item whose title text resembles its author name
- **THEN** the author name and the title render with different visual weight, so the two lines do not read as the same field

#### Scenario: Resolved styling
- **WHEN** a listed item is resolved
- **THEN** its row renders with distinct resolved styling

#### Scenario: Row click opens pin
- **WHEN** the user clicks a row
- **THEN** the corresponding pin card opens

### Requirement: On-page pins follow the panel tab
The Unresolved/Resolved tab SHALL act as a shared status filter: the panel list AND the on-page pin markers SHALL show only items matching the selected tab. The default SHALL be Unresolved. Creating new feedback SHALL snap the filter back to Unresolved so the new pin is visible. Pin display numbers SHALL be derived from the full list, ranked by creation order — the oldest item is `#1` and the newest carries the highest number — so numbers match the panel regardless of tab and do not depend on the order in which the REST list returns items.

#### Scenario: Default shows unresolved
- **WHEN** the session is enabled with both open and resolved feedback on the page
- **THEN** only unresolved pins render on the page

#### Scenario: Switch to Resolved
- **WHEN** the user selects the Resolved tab
- **THEN** only resolved pins render on the page and in the list

#### Scenario: Resolving hides the pin
- **WHEN** the user resolves an item while on the Unresolved tab
- **THEN** its pin and row disappear from the current view

#### Scenario: Oldest feedback is number one
- **WHEN** a page has six feedback items and the REST list returns them newest-first
- **THEN** the oldest item's pin badge and panel row show `#1` and the newest show `#6`

#### Scenario: New feedback takes the next number
- **WHEN** the user submits new feedback on a page that already has five items
- **THEN** the new pin shows `#6` and the existing pins keep the numbers they had

#### Scenario: Panel and pin agree
- **WHEN** the panel lists an item and its pin renders on the page
- **THEN** both show the same display number
