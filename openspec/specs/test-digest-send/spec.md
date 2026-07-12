# test-digest-send Specification

## Purpose

Give admins an on-demand way to send a digest email to themselves, routed through the same notification filters as scheduled digests, so Pro routing and formatting can be exercised without waiting for the cron.

## Requirements

### Requirement: On-demand test digest
The Settings page SHALL provide a "Send test digest" action, backed by `POST markaroo/v1/notifications/test-digest`, that runs `NotificationQueue::flush_digest()` for the current user only, routed through the same `markaroo/notify/*` filters as scheduled digests so Pro routing is exercised.

#### Scenario: Send to self
- **WHEN** an authorized user clicks "Send test digest"
- **THEN** the digest is generated and sent to the current user only, passing through `markaroo/notify/*` filters

#### Scenario: Authorization
- **WHEN** a user without the required capability calls the endpoint
- **THEN** the system returns 403 and sends nothing

### Requirement: Non-blocking behavior
The action SHALL NOT block the request on SMTP beyond what a single digest send requires, and SHALL surface success or failure to the UI.

#### Scenario: Feedback to UI
- **WHEN** the send completes or fails
- **THEN** the Settings UI shows a corresponding success or error state
