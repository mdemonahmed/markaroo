# widget-keyboard-shortcuts Specification

## Purpose

Provide a keyboard-driven workflow for the feedback widget using a single document-level listener that is active only during a session and never hijacks text entry.

## Requirements

### Requirement: Keyboard-driven pin workflow
While a feedback session is active, the widget SHALL bind a single document-level `keydown` listener (no per-pin listeners) providing: `n` = start new pin capture, `esc` = cancel active capture, `r` = resolve the active pin, `[` and `]` = cycle to previous/next pin.

#### Scenario: New pin
- **WHEN** the session is active and the user presses `n` while not typing in an input
- **THEN** capture mode starts for a new pin

#### Scenario: Cancel capture
- **WHEN** capture mode is active and the user presses `esc`
- **THEN** capture is cancelled and no feedback is created

#### Scenario: Quick resolve
- **WHEN** a pin is active and the user presses `r`
- **THEN** that pin's feedback is toggled resolved via one PATCH

#### Scenario: Cycle pins
- **WHEN** the user presses `[` or `]`
- **THEN** the active pin moves to the previous or next pin respectively

### Requirement: Shortcuts do not hijack text entry
The listener SHALL ignore shortcut keys when focus is in a text input, textarea, or contenteditable.

#### Scenario: Typing in the composer
- **WHEN** the user types `n` inside the comment composer
- **THEN** the character is entered as text and no new capture starts

### Requirement: Listener lifecycle
The listener SHALL be registered only while the session is active and removed when the session ends.

#### Scenario: Session end cleanup
- **WHEN** the user ends the feedback session
- **THEN** the keydown listener is removed
