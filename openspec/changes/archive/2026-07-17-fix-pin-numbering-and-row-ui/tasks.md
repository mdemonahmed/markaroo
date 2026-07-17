## 1. Shared numbering helper

- [x] 1.1 Add `resources/assets/widget/support/pinNumbers.ts` exporting `pinNumbers( items: FeedbackItem[] ): Map< number, number >` — sorts a copy ascending by `id` and returns id → 1-based number
- [x] 1.2 Add `resources/assets/widget/__tests__/pinNumbers.test.ts` asserting: newest-first input yields oldest = `#1`; appending a newer item keeps existing numbers and gives it the next number

## 2. Wire both consumers

- [x] 2.1 `pins/PinLayer.tsx`: replace the local index-based `numberById` useMemo (lines ~159-163) with `useMemo( () => pinNumbers( feedbacks ), [ feedbacks ] )`
- [x] 2.2 `FeedbackPanel.tsx`: replace `number={ feedbacks.indexOf( item ) + 1 }` with a lookup from the same helper, memoized over the full `feedbacks` list

## 3. Panel row UI

- [x] 3.1 `FeedbackPanel.tsx` `FeedbackRow`: drop the `#N · Page` line; restructure to avatar + author name + relative time on the top line, title below, comment snippet below that
- [x] 3.2 Keep `#N` as muted inline text next to the relative time; remove the now-unused `Page` translatable string
- [x] 3.3 Update `.markaroo-feedback-row__*` styles for the new hierarchy — title dominant, author/time/`#N` muted; keep `markaroo-` prefix and `#markaroo-root` scoping

## 4. Verify

- [x] 4.1 `yarn test` and the widget build pass; ESLint/Prettier clean on touched files
- [x] 4.2 Regenerate `languages/markaroo.pot`
- [x] 4.3 Manual check on a page with several pins: oldest pin badge reads `#1`, newest reads highest; panel row and pin badge agree; numbers unchanged when switching Unresolved/Resolved; submitting new feedback gives it the next number without renumbering others; no console errors
