# admin-plugin-feedback Specification

## Purpose

Two admin support pages: a "Give us Feedback" form that emails the plugin authors only on explicit submit (with full sanitization, nonce, and capability checks), and a static, translatable "How to Use" guide that renders entirely from bundled content.

## Requirements

### Requirement: Give us Feedback form

The admin SHALL have a "Give us Feedback" page with a form: Your Name, Your Email, Subject, Message, with helper copy "Share a bug report, feature request, or question with Native Infotech." and a notice that the message will be emailed to hello@devemon.com. Submitting SHALL send the message via `wp_mail` to hello@devemon.com through an admin-only REST endpoint with nonce and capability checks, sanitized inputs, and a valid-email requirement. Nothing SHALL be sent without the user explicitly submitting the form. The UI SHALL show sending, success, and error states.

#### Scenario: Successful submission
- **WHEN** the admin fills all fields with a valid email and submits
- **THEN** the message is emailed to hello@devemon.com and a success confirmation shows

#### Scenario: Invalid email rejected
- **WHEN** the admin submits with a malformed email address
- **THEN** a field-level error shows and nothing is sent

#### Scenario: No background transmission
- **WHEN** the admin visits the page without submitting
- **THEN** no request leaves the site

### Requirement: How to Use help page

The admin SHALL have a "How to Use" page presenting a plain-English, step-by-step guide to the plugin (enabling the widget, dropping pins, replying, resolving, share links, tasks, notifications). Content SHALL be static (no network fetch), translatable, and organized in short scannable sections.

#### Scenario: Help renders offline
- **WHEN** the admin opens How to Use
- **THEN** the full guide renders from bundled content with no external requests
