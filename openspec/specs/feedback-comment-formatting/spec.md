# feedback-comment-formatting Specification

## Purpose

Make the pin card composer and display trustworthy for rich feedback: comment and reply text render a safe markdown subset, the formatting toolbar is visually consistent, mention autocomplete resolves users reliably (by ID, notifying on both feedback and replies), and uploaded attachments are persisted and shown without letting clients spoof media.

## Requirements

### Requirement: Comment and reply text render markdown on display

Feedback comment text and reply text SHALL render a safe subset of markdown when displayed in the pin card: bold (`**x**`), italic (`*x*`), inline code (`` `x` ``), links (`[text](url)`), and unordered/ordered lists. Raw markdown source SHALL NOT be shown to the reader. Rendering SHALL escape all other content and MUST NOT inject arbitrary HTML (no `dangerouslySetInnerHTML` of untrusted text); only `http`/`https`/`mailto` link targets SHALL be honored.

#### Scenario: Bold and italic render
- **WHEN** a comment stored as `**bold** and *italic*` is displayed in the pin card
- **THEN** "bold" renders bold and "italic" renders italic, with no literal asterisks shown

#### Scenario: Link renders safely
- **WHEN** a comment contains `[docs](https://example.com)`
- **THEN** a clickable link labeled "docs" pointing to that URL renders

#### Scenario: HTML is not injected
- **WHEN** a comment contains `<script>alert(1)</script>`
- **THEN** the text is shown escaped and no script executes

### Requirement: Composer formatting toolbar uses a consistent icon set

The markdown toolbar above the comment textarea SHALL present each formatting action (bold, italic, list, ordered list, link, code) with a consistent SVG icon set (not a mix of text letters and emoji). Activating a button SHALL insert the corresponding markdown at the cursor and keep textarea focus.

#### Scenario: Icons are consistent
- **WHEN** the composer is open
- **THEN** every toolbar button shows an SVG icon of matching visual weight

#### Scenario: Insertion still works
- **WHEN** the user selects text and clicks the bold button
- **THEN** the selection is wrapped in `**` and the textarea keeps focus

### Requirement: Mention autocomplete lists all users on empty query

When the user types `@` with no following characters, the mention autocomplete SHALL immediately list assignable users (capped to a small number). Typing further characters SHALL filter that list by name. The list SHALL close on Escape, outside click, or selection.

#### Scenario: Bare @ shows everyone
- **WHEN** the user types `@` in the comment or reply field
- **THEN** the autocomplete shows the available users without requiring more typing

#### Scenario: Typing filters
- **WHEN** the user has typed `@jo`
- **THEN** only users whose name contains "jo" are shown

### Requirement: Selected mentions persist and notify reliably

Selecting a user from the mention autocomplete SHALL record that user's ID with the submission so the backend resolves the mention deterministically (independent of whether the display name contains spaces). On feedback create and on reply create, the server SHALL fire the `markaroo/mention` action for the recorded mentioned user IDs.

#### Scenario: Mention with a spaced display name saves
- **WHEN** the user picks "John Doe" from the autocomplete and submits
- **THEN** John Doe's user ID is recorded and `markaroo/mention` fires for that ID

#### Scenario: Mention on new feedback notifies
- **WHEN** a new feedback comment mentions a user
- **THEN** `markaroo/mention` fires on feedback create, not only on replies

### Requirement: File attachments are persisted with the feedback and shown on the pin card

Files and images uploaded in the composer SHALL be linked to the feedback item on create and displayed in the pin card's Attachments section when the pin is viewed. The server SHALL derive each attachment's stored metadata from its media ID and SHALL reject IDs that were not uploaded through Markaroo, so a client cannot spoof URLs or link foreign media.

#### Scenario: Uploaded file appears on the pin card
- **WHEN** the user attaches a PDF and an image in the composer and submits
- **THEN** reopening that pin shows both in the Attachments section

#### Scenario: Foreign media ID is rejected
- **WHEN** a create request lists an attachment ID that is not a Markaroo upload
- **THEN** that entry is dropped and not stored on the feedback item
