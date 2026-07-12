## ADDED Requirements

### Requirement: Retry queue for failed submissions
When `POST /feedback` fails due to a network error, the widget SHALL persist the submission metadata in `sessionStorage` and retry with exponential backoff, capping the queue at 5 items.

#### Scenario: Network failure queues
- **WHEN** a feedback submit fails with a network error
- **THEN** the payload metadata is stored in `sessionStorage` and a retry is scheduled with backoff

#### Scenario: Queue cap
- **WHEN** a 6th submission fails while 5 are already queued
- **THEN** the oldest or newest item is dropped per policy and the queue never exceeds 5

#### Scenario: Successful retry drains
- **WHEN** connectivity returns and a queued retry succeeds
- **THEN** that item is removed from the queue and its pin leaves the queued state

### Requirement: Queued pin state and in-memory screenshots
The pin SHALL display a "queued" state while pending, and screenshot Blobs SHALL remain in memory (not serialized to `sessionStorage`); only metadata persists.

#### Scenario: Queued pin indicator
- **WHEN** a submission is queued
- **THEN** its pin shows a "queued" visual state

#### Scenario: Screenshots not persisted
- **WHEN** a submission is queued
- **THEN** its screenshot Blob is held in memory and is not written to `sessionStorage`
