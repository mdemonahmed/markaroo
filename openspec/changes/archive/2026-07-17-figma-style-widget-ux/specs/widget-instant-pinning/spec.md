## ADDED Requirements

### Requirement: Launcher click starts pinning immediately
Clicking the `markaroo-launcher` button while the session is disabled SHALL enable the session, open the feedback panel, and enter pin-placement (capture) mode in a single click. The user SHALL NOT need to click a separate "New" button to place their first pin.

#### Scenario: First click on launcher
- **WHEN** the widget is in comment mode and the session is disabled and the user clicks the launcher
- **THEN** existing pins become visible, the panel opens, and capture mode is active so the next click on the page places a pin

#### Scenario: Launcher click while session enabled
- **WHEN** the session is already enabled and capture is not active and the user clicks the launcher
- **THEN** the panel toggles open/closed (current behavior preserved)

#### Scenario: View-only user
- **WHEN** a user without comment rights (view mode) clicks the launcher
- **THEN** the session enables and the panel opens without entering capture mode

### Requirement: Page remains scrollable during pin placement
While capture mode is active, the user SHALL be able to scroll the page before placing a pin.

#### Scenario: Scroll then pin
- **WHEN** capture mode is active and the user scrolls the page and then clicks on page content
- **THEN** a pin is placed at the clicked location with correct page-relative coordinates

### Requirement: Capture toolbar offers Select and Cancel
The capture toolbar (`markaroo-capture-switch`) SHALL show exactly two controls: "Select" (region capture) and "Cancel". The former "Pin" option SHALL be removed; single-click pin placement SHALL be the default behavior whenever the "Select" tool is not engaged. The former "Area" label SHALL be renamed "Select".

#### Scenario: Default click-to-pin
- **WHEN** capture mode is active and no tool is toggled and the user clicks the page
- **THEN** a point pin is placed and the composer opens

#### Scenario: Select tool
- **WHEN** the user activates "Select" and drags a region on the page
- **THEN** the region annotator captures that region (existing Area behavior)

#### Scenario: Cancel
- **WHEN** the user clicks "Cancel"
- **THEN** capture mode ends and the panel reopens
