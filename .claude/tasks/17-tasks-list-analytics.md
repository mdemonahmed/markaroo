# 17 — Tasks list, overview & analytics

**Depends on:** 16
**Goal:** The dashboard's main view: all feedback as a filterable task list, an overview of status/workload, and basic analytics (counts per page, resolution rate).

## Scope (free)
- Task list with filters and sorting.
- Overview cards: totals, open vs resolved, overdue, by priority, by assignee (workload).
- Analytics: feedback counts per page across the site, resolution rate, basic efficiency.

## Steps
1. **Task list:** columns — number, comment excerpt, page, priority badge, assignee, status, due date, created. Filters: status, priority, assignee, tag, page, search. Sort by created/priority/due. Pagination from `/feedback`.
2. **Row actions:** open detail (comment, screenshot, replies, attachments), resolve/unresolve, reassign, change priority/due/tags, delete (confirm) — all via REST, capability-gated.
3. **Overview cards** (from `/counts`): total feedback, open, resolved, overdue, unassigned; breakdown by priority; workload per assignee (open/total).
4. **Analytics:**
   - **Counts per page:** table/list of `page_key` → counts (open/resolved/total). Link opens that page with the widget in view mode if possible.
   - **Resolution rate:** resolved / total, plus a simple trend (e.g. resolved per week) if cheap to compute.
   - **Efficiency (basic):** average time-to-resolve (resolved `updated_at` − `created_at`). No SLA features (pro).
5. Charts can be lightweight (CSS bars or a small chart lib already in the bundle). Keep it fast.
6. Deep-link from a task to its page/pin where feasible.

## Hooks
- `apply_filters('markaroo/analytics/metrics', $metrics)` — pro adds team/QA performance, advanced reports.
- `apply_filters('markaroo/dashboard/columns', $columns)`.

## Acceptance
- List filters/sorts/paginates correctly against the DB.
- Overview numbers reconcile with `/counts` and the raw data.
- Per-page counts and resolution rate are accurate; average time-to-resolve computes from real timestamps.
- All row actions work and respect capabilities.
