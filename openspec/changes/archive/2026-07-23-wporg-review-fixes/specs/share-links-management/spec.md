# share-links-management Delta

## ADDED Requirements

### Requirement: Multiple guest share links

The plugin SHALL support an unlimited number of concurrent guest share links, each an independent row in `wp_markaroo_shares`. No code path SHALL collapse, cap, or wipe existing links to enforce a single-link limit.

#### Scenario: Creating a second link keeps the first
- **WHEN** an admin creates a new share link while one already exists
- **THEN** both links resolve successfully via `GET /markaroo/v1/share/{token}` and both appear in the admin list

#### Scenario: No singleton collapse
- **WHEN** the share list endpoint or any other code path runs against a table with multiple rows (any scope)
- **THEN** no rows are deleted or replaced as a side effect

### Requirement: Per-link configuration

Each share link SHALL expose and honor its own label, scope (`site` or `page` + `page_key`), `can_view`, `can_comment`, widget mode (`comment` / `view` / `clean`), and optional `expires_at` — all editable from the free plugin's dashboard UI.

#### Scenario: Page-scoped link
- **WHEN** a link is created with scope `page` and a `page_key`
- **THEN** the public resolve payload returns that scope and page_key, and the widget restricts the guest to that page

#### Scenario: Expiry honored
- **WHEN** a guest resolves a link whose `expires_at` is in the past
- **THEN** the API returns 404 `markaroo_invalid_token`

#### Scenario: View-only link
- **WHEN** a link is created with `can_comment` = 0 or widget mode `view`
- **THEN** the guest widget shows feedback but does not allow submitting comments

### Requirement: Share links REST CRUD

The plugin SHALL expose authenticated REST endpoints under `markaroo/v1`: list all links, create a link, update a link, and revoke (delete) a link. All write endpoints SHALL verify the manage capability and nonce, sanitize inputs, and fire `markaroo/share/token_created` on create and `markaroo/share/revoked` on delete.

#### Scenario: List returns all links
- **WHEN** an authorized user calls `GET /markaroo/v1/shares`
- **THEN** every share row is returned with id, label, token, share_url, scope, page_key, permissions, widget_mode, expires_at, and created_at

#### Scenario: Unauthorized write rejected
- **WHEN** a user without the manage capability calls any share write endpoint
- **THEN** the request is rejected with a 403

### Requirement: Dashboard share links management UI

The admin dashboard SHALL provide a share-links management UI listing all links with their settings, supporting create (with all per-link options), edit, copy-URL, and revoke with confirmation. Existing single-link touchpoints (onboarding, overview) SHALL link into or embed this UI rather than presenting a fixed singleton link.

#### Scenario: Full options on create
- **WHEN** an admin opens the create-link form
- **THEN** label, scope (site/page), permissions, widget mode, and expiry are all configurable — none locked behind an upgrade

#### Scenario: Revoke with confirmation
- **WHEN** an admin revokes a link and confirms
- **THEN** the row is deleted, the token stops resolving, and the list updates
