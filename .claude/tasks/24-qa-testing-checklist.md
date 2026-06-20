# 24 — QA & test checklist

**Depends on:** all
**Goal:** A repeatable end-to-end check before any release.

## Environments
- Default WP theme, Elementor, and Divi pages.
- Desktop + mobile viewport; at least two browsers.
- Logged-in manage user, logged-in author (subscriber), and guest via share link.

## Functional checklist
- [ ] Activate on clean WP 6.5+/PHP 8.1 — tables created, no notices.
- [ ] Widget loads only for permitted users/guests; absent for logged-out visitors (no assets).
- [ ] Click-to-pin places a pin; drag-to-select makes a resizable/draggable region.
- [ ] Pins panel auto-hides on capture; drag-to-select notice shows.
- [ ] Screenshot captures without Markaroo UI; JPEG/PNG + quality settings apply; html2canvas lazy-loads.
- [ ] Masked inputs are blanked in the screenshot.
- [ ] Annotation: arrow (default), rectangle, circle draw and burn into the image; undo/clear work.
- [ ] Markdown toolbar inserts syntax; rendered output is safe.
- [ ] One-click submit creates feedback with full metadata (URL, viewport, UA→OS/browser); screenshot attaches after.
- [ ] Existing feedback renders as numbered, color-coded pins; visible during new capture.
- [ ] Drag a saved pin → position persists.
- [ ] Resolve/unresolve updates color + tab + counts.
- [ ] Threaded replies post/edit/delete; delete asks for confirm.
- [ ] @mention autocomplete works; mentioned user notified once.
- [ ] Priority badges/dots correct; assignment writes id+name; due date overdue styling; tags add/remove.
- [ ] Attachments upload (allowed types/size enforced), show badges/thumbnails, open in new tab; SVG sanitized.
- [ ] Guest share link: name prompt, comment-only rights enforced, page scope enforced, revoke/expire works.
- [ ] Three widget modes behave (comment/view/clean).
- [ ] Admin dashboard: list filters/sorts/paginates; overview + per-page counts + resolution rate accurate; settings save; share manager works.
- [ ] Notifications: instant for mention/assignment; digest batches on cron; smart mode mixes; per-event toggles; off = silent; guests never emailed.

## Non-functional checklist
- [ ] phpcs (WordPress ruleset) clean; React lints clean.
- [ ] No console errors front or admin.
- [ ] Conditional/async assets verified; html2canvas separate chunk; transients cache + bust.
- [ ] GDPR export/erase return/remove the user's items; privacy content added.
- [ ] Uninstall with flag on removes all data; off keeps data; `markaroo/uninstall` fires.
- [ ] i18n: POT complete; translated locale flips admin + widget.
- [ ] Plugin Check passes with zero errors.
- [ ] Hook contract (task 19) verified with a pro stub: add setting, add admin tab, override a `can/*` filter, intercept `notify/send`.

## Regression guardrails
- All naming prefixes intact (grep for unprefixed functions/tables/options/classes).
- No pro logic leaked into free.
- DB schema matches CLAUDE.md.
