# pincard-thread-ux Specification

## Purpose

Make the pin detail card behave like a Figma comment thread: easy to dismiss, anchored tight to its pin, avatar-led entries, and a lightweight reply composer — with the title as the primary required field.

## Requirements

### Requirement: Outside click and Esc close the pin card
When a pin card (`markaroo-pincard`) is open, a pointer-down outside the card (and outside pin markers and the docked panel) SHALL close it. Pressing Escape SHALL also close it (unless the screenshot lightbox is open, which consumes Escape first). Interactions inside the card SHALL NOT close it.

#### Scenario: Click outside closes
- **WHEN** a pin card is open and the user clicks on page content outside the card
- **THEN** the card closes

#### Scenario: Esc closes
- **WHEN** a pin card is open and the user presses Escape
- **THEN** the card closes

#### Scenario: Click another pin switches card
- **WHEN** a pin card is open and the user clicks a different pin marker
- **THEN** the open card closes and the clicked pin's card opens

### Requirement: Card anchors to the pin point
The card SHALL open adjacent to the pin marker itself (small gap, preferring the pin's right side and flipping to its left when there is no room), never anchored to a screenshot crop rect. After opening, the card SHALL move rigidly with the pin while the page scrolls, keeping a constant offset.

#### Scenario: Card opens beside the pin
- **WHEN** the user clicks a pin marker
- **THEN** the card opens within a small gap of the pin point

#### Scenario: Card follows the pin on scroll
- **WHEN** a pin card is open and the user scrolls the page
- **THEN** the card keeps the same offset from its pin instead of sticking to the viewport edge

### Requirement: Title required at creation, comment optional
In the composer, the title SHALL be the only required field; the comment SHALL be optional. When viewing an existing pin, the title renders as static bold text; editing title and comment afterwards SHALL be available via an Edit action in the entry's overflow (⋯) menu, gated by the same permission as comment editing. Empty comments SHALL NOT render an empty body.

#### Scenario: Title-only pin
- **WHEN** the user submits the composer with a title and no comment
- **THEN** the pin is created successfully

#### Scenario: Missing title
- **WHEN** the user submits the composer without a title
- **THEN** a "Title is required." error shows and nothing is submitted

#### Scenario: Editing later
- **WHEN** a user with edit rights chooses "Edit" from the entry's ⋯ menu
- **THEN** the title and comment become editable and can be saved

### Requirement: Attachments section hidden when empty
The pin card SHALL render the attachments section only when the feedback item has one or more attachments.

#### Scenario: No attachments
- **WHEN** a pin card opens for feedback with no attachments
- **THEN** no attachments section or empty attachment field is shown

### Requirement: Figma-style thread layout
The pin card SHALL present the feedback and its replies as a single avatar-led thread: each entry shows the author avatar, author name, relative time, and the text; per-entry actions (edit/delete for authorized users) SHALL sit behind a ⋯ menu revealed on hover/focus. The header SHALL contain a "Comment" label, priority badge, resolve toggle, and close button. The reply composer SHALL be a compact rounded pill with the current user's avatar and a submit arrow; Enter submits, Shift+Enter inserts a newline.

#### Scenario: Thread rendering
- **WHEN** a pin card opens for feedback with two replies
- **THEN** three thread entries render in order, each with avatar, name, relative time, and text

#### Scenario: Reply submission
- **WHEN** the user types in the reply pill and presses the submit arrow or Enter
- **THEN** the reply posts and appears in the thread

#### Scenario: Resolve from header
- **WHEN** a user with resolve rights clicks the resolve check in the header
- **THEN** the feedback toggles resolved/unresolved
