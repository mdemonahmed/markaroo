## Context

`FeedbackRepository::list()` defaults to `ORDER BY created_at DESC`, and the widget stores that array verbatim (`FEEDBACKS_LOADED` in `WidgetContext.tsx`). Two call sites turn array position into a display number:

- `PinLayer.tsx:159-163` — `feedbacks.forEach( ( f, i ) => map.set( f.id, i + 1 ) )`
- `FeedbackPanel.tsx:191` — `number={ feedbacks.indexOf( item ) + 1 }`

Both are index-based, so with a DESC list the newest item is `#1`. `FEEDBACK_CREATED` prepends the new item, which also renumbers every existing pin on submit. The two sites agree today only because they happen to share the same array — a coincidence, not a contract.

`FeedbackRow` currently renders `#N · Page` on its own line above the author name, then the title in the same weight class. "Page" is a hardcoded constant string, identical on every row.

## Goals / Non-Goals

**Goals:**
- Pin number reflects creation order (oldest = `#1`), stable across fetch order, tab switches, and new submissions.
- One numbering source shared by the pin layer and the panel.
- Panel row with a readable hierarchy: avatar + author + time, then title, then snippet.

**Non-Goals:**
- Changing REST sort order or panel list order (newest-first stays).
- Persisting a number column in the database.
- Any PHP, REST, or schema change.

## Decisions

**Rank client-side by ascending `id`, not by changing the REST sort.**
`id` is an autoincrement primary key, so ascending `id` is creation order — no date parsing, no timezone hazard (the DB stores naive site-local datetimes; `created_at` string comparison is avoidable risk for zero gain). Alternatives rejected: (a) flipping the repository default to `ASC` — would invert the panel list, which the user did not ask for, and leaves the frontend still fetch-order-dependent; (b) a persisted `pin_number` column — a migration and a backfill for a value that is derivable.

**One helper in `resources/assets/widget/support/`, mirroring `timeAgo.ts`.**
`pinNumbers( feedbacks ): Map< number, number >` sorts a copy by ascending `id` and returns id→number. Both consumers call it inside `useMemo( …, [ feedbacks ] )`. Fixing it in the shared helper rather than at each call site is the smaller diff and makes a third consumer correct by default. Alternative rejected: computing in the reducer and storing in state — duplicates derived data into the store and risks staleness.

**Numbers come from the full `feedbacks` list, not the filtered view.**
Preserves the existing `panel-comment-list` requirement that numbers match across tabs.

**Row layout: avatar + name + time on line one, title on line two, snippet on line three.**
Hierarchy comes from type weight and colour, not from a badge line. The `#N` reference stays but moves inline next to the time as muted small text, so it remains available for "look at pin 3" conversations without competing with the title. The `Page` label is deleted outright — a constant string carries no information.

## Risks / Trade-offs

- **Panel list is newest-first while numbers ascend, so `#6` appears above `#1`.** → Matches how a comment feed with reverse-chronological order normally reads; the number is an identity, not a row index. Accepted deliberately; changing list order is out of scope.
- **Ascending `id` diverges from `created_at` order if rows are ever backdated or imported.** → No such path exists in the free plugin (`created_at` is set at insert). If an import feature lands, the helper is the single place to revisit.
- **Removing the `Page` string changes the `.pot`.** → Regenerate as part of the change; covered in tasks.
- **Row markup change touches `.markaroo-feedback-row__*` CSS.** → Class prefix and `#markaroo-root` scoping rules unchanged; only inner element styles move.
