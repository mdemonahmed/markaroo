# admin-email-notification-page Specification

## Purpose

A dedicated Email Notification settings page (own nav item) that owns all notification configuration — enable toggle, delivery mode, digest frequency, instant alerts, and a test email — replacing the notifications group formerly in Settings, while reading and writing the existing `notifications` settings keys.

## Requirements

### Requirement: Dedicated Email Notification settings page

The admin SHALL have an Email Notification page (its own nav item) containing, in order: (1) an enable checkbox "Enable Visual Feedback email notifications" with helper text about low-spam digest delivery; (2) a Delivery Mode select with "Digest only (recommended)" and "Smart: Digest + instant assignment/mentions"; (3) a Digest Frequency select with Every 15 / 30 / 60 minutes; (4) Instant Alerts checkboxes (shown for Smart mode) for assignment changes and @mentions; (5) a Send Test Email section with helper text and a button that sends a sample notification to the admin address. The page SHALL read and write the existing `notifications` settings keys (`notify_mode`, `digest_interval`, `events`) — disabling maps to `notify_mode: off`. Saving SHALL give clear success/error feedback.

#### Scenario: Fields map to stored settings
- **WHEN** the admin selects Smart mode, 15-minute frequency, enables mention alerts, and saves
- **THEN** the stored settings show `notify_mode: smart`, `digest_interval: 15`, and `events.mention: true`

#### Scenario: Disable turns notifications off
- **WHEN** the admin unchecks the enable checkbox and saves
- **THEN** `notify_mode` is stored as `off` and no notification emails are sent

#### Scenario: Test email
- **WHEN** the admin clicks Send Test Email
- **THEN** a sample notification is sent to the admin address and the UI confirms success or shows the error

### Requirement: Notifications section removed from Settings

The Settings page SHALL NOT contain the notifications group; it SHALL be replaced by the Email Notification page.

#### Scenario: No duplicate settings
- **WHEN** the admin opens Settings
- **THEN** no notification fields appear there
