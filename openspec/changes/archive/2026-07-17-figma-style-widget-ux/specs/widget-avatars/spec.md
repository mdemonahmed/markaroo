## ADDED Requirements

### Requirement: Server exposes avatar URLs
The plugin SHALL expose avatar URLs (via `get_avatar_url()`) for: the current user in `window.markarooConfig.currentUser.avatar`, feedback/reply authors in REST responses (`avatar` field derived from `author_id`), and users returned by the users endpoint. Guests (author_id 0) SHALL have an empty avatar value.

#### Scenario: Logged-in author
- **WHEN** feedback authored by a WP user is fetched
- **THEN** the response includes an `avatar` URL for that author

#### Scenario: Guest author
- **WHEN** feedback authored by a guest is fetched
- **THEN** the `avatar` field is empty

### Requirement: Widget renders avatars with initials fallback
Everywhere the widget shows an author (pin card thread, hover preview, panel rows, reply composer), it SHALL render the avatar image when a URL is available and fall back to the existing initials chip when not.

#### Scenario: Avatar available
- **WHEN** a thread entry's author has an avatar URL
- **THEN** the avatar image renders in place of the initials chip

#### Scenario: No avatar
- **WHEN** the author is a guest with no avatar URL
- **THEN** the initials chip renders as fallback
