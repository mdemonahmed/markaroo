## Context

Plugin Check (2026-07-18) was run against the raw plugin working directory, not a built distribution artifact. The report mixes two very different problem classes:

1. **Packaging noise (~90% of rows)** — dev files that exist in the repo but must never ship: `.DS_Store`, `.claude/`, `.agents/`, `graphify-out/`, `.codegraph/`, `openspec/`, dev markdown, dotfiles, `deploy.php`, and skill reference PHP under `.claude/skills/`. Every `hidden_files`, `application_detected`, `ai_instruction_directory`, `unexpected_markdown_file` finding — plus the `TextDomainMismatch`, `EscapeOutput`, and `missing_direct_file_access_protection` errors, which all live in `.claude/` or `deploy.php` — disappears the moment these files are excluded from the ZIP.

2. **Genuine production findings (~10%)** — a small set of real issues in files that *do* ship: the `Domain Path` header, the `readme.txt` headers, one missing `translators:` comment, and a broad set of `$wpdb` / prefix WARNINGs across the repository + support layer.

WordPress.org rejects submissions with unresolved ERRORs. WARNINGs do not hard-block but a clean report speeds review and is what the user asked for ("fix all one by one").

## Goals / Non-Goals

**Goals:**
- Produce a distribution ZIP that passes Plugin Check with **zero ERRORs**.
- Drive production-file WARNINGs to zero as well (i18n, `$wpdb`, prefixes).
- Keep the repo intact — exclude dev files from the *package*, do not delete them from the repo.
- No end-user runtime behavior change.

**Non-Goals:**
- Rewriting the repository/data layer onto object caching (the direct queries are correct for a custom-table plugin; caching them is out of scope — they get justified `phpcs:ignore` instead).
- Fixing findings that only exist in excluded dev files (`.claude/`, `deploy.php`) at the source — exclusion resolves them.
- Changing the WP Bones build pipeline or any feature spec behavior.

## Decisions

### 1. `.distignore` as the single source of packaging truth
Add a `.distignore` at the plugin root listing every dev-only path. This is the manifest `wp dist-archive` (and most WP.org build flows) honor to strip files from the ZIP. Chosen over a custom build script because it is the standard WP.org tooling contract, declarative, and reviewer-recognizable.

- **Alternative considered — delete dev files from repo:** rejected; the repo legitimately needs `.claude/`, `openspec/`, `resources/` source, and build config for ongoing development.
- **Alternative considered — `.gitattributes export-ignore`:** works only for `git archive`; `.distignore` is the WP.org-native path and covers the `wp dist-archive` flow the team uses.
- Exclude source `resources/` (compiled to `public/`), `node_modules/`, build config (`webpack.config.js`, `package.json`, dev `composer` artifacts), tests, `.git`, and all items enumerated in the proposal.

### 2. Header/readme fixes are literal edits
- `markaroo.php`: `Domain Path: languages` → `Domain Path: /languages` (WP requires a leading slash).
- `readme.txt`: set `Tested up to` to the current stable WordPress; resolve `mismatched_plugin_name` by aligning the readme title with the header `Plugin Name`. Decision: **keep the descriptive readme title as the canonical name and update the plugin header `Plugin Name` to match** ("Markaroo — Visual Feedback & Task Management"), preserving the marketed name in search results. (Reversible — if the folder-slug/branding must stay bare "Markaroo", flip the readme title instead.)

### 3. i18n comment placement
`MissingTranslatorsComment` fires because the `translators:` comment sits above the `sprintf(` wrapper, not directly above the `_n()` call. Move/duplicate the comment to the line immediately preceding `_n()`. Pure sniff-placement fix, no string change.

### 4. `$wpdb` sniffs: prepare what can be prepared, annotate what cannot
The custom-table repositories cannot parameterize table-name identifiers (`{$table}`) — SQL placeholders are for values, not identifiers. Strategy per line:
- **Value interpolation** (`WHERE id = {$x}`) → wrap in `$wpdb->prepare()` with `%d`/`%s`. (Most already do; fix the stragglers, and the dynamic `IN (...)` placeholder builders flagged as `UnfinishedPrepare`.)
- **Identifier interpolation** (`FROM {$table}`) → build the table name from `$wpdb->prefix` (trusted), and add `phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- table name from $wpdb->prefix, not user input`.
- **`DirectDatabaseQuery` / `NoCaching`** → these are inherent to a custom-table plugin; annotate with `phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- custom table, no core API` (add object-cache only where cheap and correct, e.g. share-by-token lookups — optional).
- **`SchemaChange`** in `Uninstall.php` (DROP TABLE) → expected on uninstall; annotate.
- **`SlowDBQuery` meta_key** → annotate; these are bounded admin/cron queries.

### 5. Prefix migrations and bootstrap globals
- Rename migration classes to a `Markaroo_`-prefixed form. Risk: WP Bones may resolve migrations by class name — verify the migrator loads by file, not a hardcoded class map, before renaming (grep the migration runner). If it maps by name, keep the class and add `phpcs:ignore ... PrefixAllGlobals.NonPrefixedClassFound -- WP Bones migration naming convention` instead.
- `bootstrap/autoload.php` `$start` → rename to `$markaroo_start` or scope it out; migration `$instance` similarly.

### 6. Verify against the built ZIP, not the tree
The whole point: re-run Plugin Check on the *packaged* artifact. Build ZIP → upload/scan → confirm zero ERRORs. This is the acceptance gate.

## Risks / Trade-offs

- **[Renaming migration classes breaks the migrator]** → Grep the WP Bones migration runner first; if it loads by class name, annotate instead of rename. Verify migrations still run on a fresh activate.
- **[`.distignore` excludes a file that IS needed at runtime]** → `resources/` is source-only (compiled output lives in `public/`); double-check no runtime PHP requires anything under an excluded path before finalizing the list. Build the ZIP and smoke-test activation.
- **[Over-suppressing sniffs hides a real bug]** → Only annotate the identifier/direct-query/schema-change sniffs that are genuinely unavoidable; actually `prepare()` every value parameter rather than ignoring it.
- **[`Tested up to` drift]** → set to the current stable at submission time; it needs re-bumping on future WP releases (normal maintenance).
- **[Plugin header name change ripples]** → changing `Plugin Name` does not change the folder slug or text domain, so no functional impact; only the display name in the plugins list changes.

## Migration Plan

1. Land `.distignore` + header/readme/code fixes on a branch.
2. Build the distribution ZIP using the team's existing flow (`wp dist-archive` or equivalent), honoring `.distignore`.
3. Run Plugin Check against the ZIP; confirm zero ERRORs (WARNINGs ideally zero too).
4. Smoke-test: install the built ZIP on a clean WordPress, activate, confirm the admin app + widget load and migrations run.
5. Submit. Rollback is trivial — revert the branch; no data or schema change is involved.

## Open Questions

- Does the WP Bones migration runner resolve migrations by class name (blocks the rename in Decision 5) or by file? — resolve by grepping the runner before touching migration classes.
- What is the exact current stable WordPress version to stamp into `Tested up to` at submission time?
- Which build command does the team use for the ZIP (`wp dist-archive`, a Bones command, or CI)? — confirms `.distignore` is the right manifest.
