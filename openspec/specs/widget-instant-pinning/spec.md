# widget-instant-pinning Specification

## Purpose

Let users start pinning feedback in a single click on the launcher, with a unified capture surface where a click places a pin and a drag selects a region — no separate tool switching.

## Requirements

### Requirement: Launcher click starts pinning immediately
Clicking the `markaroo-launcher` button while the session is disabled SHALL enable the session, open the feedback panel, and enter capture mode in a single click. The user SHALL NOT need to click a separate "New" button to place their first pin. The panel SHALL remain open and usable during capture (it renders above the capture overlay).

#### Scenario: First click on launcher
- **WHEN** the widget is in comment mode and the session is disabled and the user clicks the launcher
- **THEN** existing pins become visible, the panel opens, and capture mode is active so the next click on the page places a pin

#### Scenario: Launcher click while session enabled
- **WHEN** the session is already enabled and capture is not active and the user clicks the launcher
- **THEN** the panel toggles open/closed

### Requirement: Unified click-or-drag capture
While capture mode is active, a plain click on page content SHALL place a point pin and open the composer; a drag SHALL draw a region selection (dashed border, resize handles, annotation tools). The capture toolbar SHALL contain only a "Cancel" control; a hint SHALL explain "Click to place a pin — drag to select an area".

#### Scenario: Click places a pin
- **WHEN** capture mode is active and the user clicks the page without dragging
- **THEN** a point pin is placed at the click location and the composer opens

#### Scenario: Drag selects a region
- **WHEN** capture mode is active and the user drags on the page
- **THEN** a bordered region box appears with resize handles and annotation tools (existing region behavior)

#### Scenario: Cancel returns to the panel
- **WHEN** the user clicks "Cancel"
- **THEN** capture mode ends and the panel remains open

### Requirement: Page remains scrollable during pin placement
While capture mode is active, the user SHALL be able to scroll the page before placing a pin.

#### Scenario: Scroll then pin
- **WHEN** capture mode is active and the user scrolls the page and then clicks on page content
- **THEN** a pin is placed at the clicked location with correct page-relative coordinates
