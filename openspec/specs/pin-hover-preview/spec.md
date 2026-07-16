# pin-hover-preview Specification

## Purpose

Give users a quick glance at a pin's author, age, and topic on hover, without opening the full card.

## Requirements

### Requirement: Hover preview on pin markers
Hovering a pin marker (`markaroo-pin`) SHALL show a compact preview tooltip containing the author's avatar, author name, relative time, and the feedback title (falling back to a comment snippet when no title exists). The tooltip SHALL render upright regardless of the marker's rotated teardrop shape, disappear when the pointer leaves the marker, and SHALL NOT appear while the pin's full card is already open or while the pin is being dragged. It SHALL flip to the marker's left near the right viewport edge.

#### Scenario: Hover shows preview
- **WHEN** the user hovers a pin marker whose card is closed
- **THEN** a tooltip appears beside the marker showing avatar, author name, relative time, and title/snippet

#### Scenario: Hover ends
- **WHEN** the pointer leaves the pin marker
- **THEN** the tooltip disappears

#### Scenario: Card already open
- **WHEN** the pin's card is open and the user hovers the same marker
- **THEN** no tooltip is shown

#### Scenario: Click still opens card
- **WHEN** the user clicks a pin marker
- **THEN** the full pin card opens
