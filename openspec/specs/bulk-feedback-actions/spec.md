# bulk-feedback-actions Specification

## Purpose

Provide a single batched REST endpoint that applies one change set (resolve/unresolve, assign, tag, or delete) to many feedback rows at once, with proper authorization, cache invalidation, and a Pro extension hook.

## Requirements

### Requirement: Batched bulk mutation endpoint
The system SHALL expose `POST markaroo/v1/feedback/bulk` that applies one change set (resolve/unresolve, assign, tag, or delete) to many feedback rows in a single database `UPDATE … WHERE id IN (…)` (or `DELETE`), never one query per row.

#### Scenario: Bulk resolve
- **WHEN** an authorized user submits `{ ids: [1,2,3], changes: { status: "resolved" } }`
- **THEN** the system updates all three rows in one query and returns the updated count

#### Scenario: Empty or oversized id list
- **WHEN** the request has an empty `ids` array or exceeds the allowed maximum
- **THEN** the system returns a 400 error and makes no database write

### Requirement: Authorization and cache invalidation on bulk writes
The endpoint SHALL verify the nonce and the `markaroo_manage_feedback` capability, and SHALL bust the `counts_*` caches exactly once after a successful batch.

#### Scenario: Missing capability
- **WHEN** a user without `markaroo_manage_feedback` calls the endpoint
- **THEN** the system returns 403 and performs no write

#### Scenario: Counts cache freshness
- **WHEN** a bulk update completes
- **THEN** the `counts_*` transients are forgotten once so the next `/counts` read reflects the change

### Requirement: Pro extension hook
The system SHALL fire `do_action('markaroo/feedback/bulk_updated', $ids, $changes)` after a successful batch.

#### Scenario: Hook fires with payload
- **WHEN** a bulk update succeeds for ids `[1,2,3]`
- **THEN** `markaroo/feedback/bulk_updated` fires with those ids and the applied change set
