## ADDED Requirements

### Requirement: Outside click and Esc close the pin card
When a pin card (`markaroo-pincard`) is open, a pointer-down outside the card (and outside the pin marker that opened it) SHALL close it. Pressing Escape SHALL also close it. Interactions inside the card (including its menus and lightbox) SHALL NOT close it.

#### Scenario: Click outside closes
- **WHEN** a pin card is open and the user clicks on page content outside the card
- **THEN** the card closes

#### Scenario: Esc closes
- **WHEN** a pin card is open and the user presses Escape
- **THEN** the card closes

#### Scenario: Click inside does not close
- **WHEN** a pin card is open and the user clicks a control inside the card
- **THEN** the card stays open

#### Scenario: Click another pin switches card
- **WHEN** a pin card is open and the user clicks a different pin marker
- **THEN** the open card closes and the clicked pin's card opens

### Requirement: Title input shown only at creation
The title field SHALL be an editable input only in the composer during pin creation. When viewing an existing pin, the title SHALL render as static text (or be omitted when empty); editing the title afterwards SHALL be available via an explicit Edit action in the card's overflow (⋯) menu, gated by the same permission as comment editing.

#### Scenario: Creating a pin
- **WHEN** the composer opens for a new pin
- **THEN** a title input is visible and optional

#### Scenario: Viewing an existing pin
- **WHEN** a pin card opens for an existing pin
- **THEN** no title input is shown; the title (if any) renders as static text

#### Scenario: Editing the title later
- **WHEN** a user with edit rights chooses "Edit" from the card's overflow menu
- **THEN** the title and comment become editable and can be saved

### Requirement: Attachments section hidden when empty
The pin card SHALL render the attachments section only when the feedback item has one or more attachments.

#### Scenario: No attachments
- **WHEN** a pin card opens for feedback with no attachments
- **THEN** no attachments section or empty attachment field is shown

#### Scenario: Has attachments
- **WHEN** the feedback has attachments
- **THEN** the attachments section renders them as today

### Requirement: Figma-style thread layout
The pin card SHALL present the feedback and its replies as a single avatar-led thread: each entry shows the author avatar, author name, relative time, and the text; per-entry actions (edit/delete for authorized users) SHALL sit behind a ⋯ menu revealed on hover/focus. The header SHALL contain a "Comment" label, resolve toggle, overflow menu, and close button. The reply composer SHALL be a compact rounded input with the current user's avatar and a submit arrow button.

#### Scenario: Thread rendering
- **WHEN** a pin card opens for feedback with two replies
- **THEN** three thread entries render in order, each with avatar, name, relative time, and text

#### Scenario: Entry actions on hover
- **WHEN** an authorized user hovers a thread entry they can edit
- **THEN** a ⋯ menu appears offering Edit (and Delete where permitted)

#### Scenario: Reply submission
- **WHEN** the user types in the reply input and presses the submit arrow (or Enter)
- **THEN** the reply posts and appears in the thread (existing reply API behavior preserved)

#### Scenario: Resolve from header
- **WHEN** a user with resolve rights clicks the resolve check in the header
- **THEN** the feedback toggles resolved/unresolved (existing behavior preserved)
