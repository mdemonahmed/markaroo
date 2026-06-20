# Markaroo — Task Plan

Build the **free** plugin one task at a time, in order. Read `../CLAUDE.md` first. Every task assumes the naming rules and scope defined there.

## Order

| # | Task | Depends on |
|---|---|---|
| 00 | Project setup & boilerplate rename | — |
| 01 | Conventions, scaffolding & service providers | 00 |
| 02 | Database migrations & Eloquent models | 01 |
| 03 | Settings & options API | 01 |
| 04 | REST API (feedback, replies, shares) | 02, 03 |
| 05 | Capabilities & access control (free) | 01 |
| 06 | Guest share links | 04, 05 |
| 07 | Frontend widget bootstrap (loader, modes, asset loading) | 04, 05 |
| 08 | Capture: click-to-pin & drag-to-select region | 07 |
| 09 | Screenshot capture (html2canvas, lazy load) | 08 |
| 10 | Annotation tools (arrow/rectangle/circle) | 09 |
| 11 | Comment composer + markdown toolbar | 08 |
| 12 | Feedback pins rendering & repositioning | 04, 07 |
| 13 | Threaded replies & @mentions | 04, 12 |
| 14 | Task layer: priority, assignment, due date, tags, status | 04, 12 |
| 15 | Attachments | 04, 11 |
| 16 | Admin dashboard (React shell) | 03, 04 |
| 17 | Tasks list, overview & analytics | 16 |
| 18 | Notifications (mentions, assignments, digest, smart) | 04, 14 |
| 19 | Extensibility hooks for the Pro plugin | runs alongside all |
| 20 | Performance (lazy load, caching, conditional assets) | 07, 09 |
| 21 | Security, GDPR & clean uninstall | 02, 03 |
| 22 | Internationalization | all UI tasks |
| 23 | WordPress.org submission readiness | all |
| 24 | QA & test checklist | all |

## Rules of engagement

- One task = one focused change set. Finish the Definition of Done in `CLAUDE.md` before moving on.
- Do not pull pro features forward. Where pro would extend, fire the hook listed in task 19.
- If you must change the DB schema or a hook contract, update `CLAUDE.md` + the relevant task file in the same change.
- Prefer the bones CLI for scaffolding; verify command names via the Context7 WP Bones docs.
