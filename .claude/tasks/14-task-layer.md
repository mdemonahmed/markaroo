# 14 — Task layer: priority, assignment, due date, tags, status

**Depends on:** 04, 12
**Goal:** Every comment is already a task row. Add the productivity fields: priority with color badges, optional assignment to WP users, optional due dates, tags/labels, and status tracking.

## Scope (free)
- Priority: Urgent / High / Normal / Low with color badges + dots.
- Assignment: optional, to WP users, via dropdown (toggle with `enable_assignment`).
- Due dates: optional (toggle with `enable_due_dates`).
- Tags/labels: free-form or from `available_tags`.
- Status: open / resolved, with basic workload counts (per assignee).

## Steps
1. **Priority:** editable in composer (task 11) and detail popover. Color map (define once, reuse in pins/list/dashboard):
   - urgent = red, high = orange, normal = blue, low = gray (align with screenshots).
   Render as a badge in lists and a colored dot on pins.
2. **Assignment:** dropdown sourced from `/users`. Setting it writes `assigned_to_id` + `assigned_to_name` (denormalized so guest views show the name). "Unassigned" = 0. Only shown when `enable_assignment`. Gate with `can_assign()`.
3. **Due date:** date picker writing `due_date` (nullable). Only shown when `enable_due_dates`. Surface overdue state in the dashboard (task 17).
4. **Tags:** chip input; suggest from `available_tags` but allow new ones; store JSON array in `tags`. Used as a filter in the dashboard.
5. **Status:** resolve/unresolve already toggles `status` (task 12). Track `updated_at` on change.
6. **Workload (basic):** counts per assignee (open/total) computed in `/counts` and shown on the dashboard (task 17). No SLA logic in free.
7. All edits go through PATCH `/feedback/{id}` with field whitelist; fire `markaroo/feedback/updated`.

## Hooks
- `apply_filters('markaroo/priority/levels', $levels)` — pro custom priorities.
- `apply_filters('markaroo/status/list', $statuses)` — pro custom statuses (in-progress, etc.).
- `do_action('markaroo/feedback/assigned', $feedback, $user_id)`.

## Acceptance
- Priority badges/dots show the right colors everywhere.
- Assignment writes both id and name; "Unassigned" works; field hidden when setting is off.
- Due date saves and shows overdue styling past the date.
- Tags add/remove and persist; dashboard can filter by tag.
- Workload counts per assignee match the DB.
