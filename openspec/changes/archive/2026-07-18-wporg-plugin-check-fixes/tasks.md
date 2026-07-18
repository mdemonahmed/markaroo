## 1. Distribution manifest (clears ~90% of the report)

- [x] 1.1 Create `.distignore` at the plugin root excluding: `.DS_Store`, all dotfiles (`.gitignore`, `.editorconfig`, `.prettierrc`, `.eslintignore`, `.stylelintignore`, `.php-cs-fixer.cache`, `.gitattributes`), `.claude/`, `.agents/`, `graphify-out/`, `.codegraph/`, `openspec/`, dev markdown (`CLAUDE.md`, `PERFORMANCE_AUDIT.md`, `DESIGN-SYSTEM.md`, `HOOKS.md`, `FEATURES.md`, `Before_Submitting.md`, and the stray `markaroo-markaroo-php-*.md` report), `deploy.php`, source `resources/`, `node_modules/`, tests, build config (`webpack.config.js`, `package.json`, `package-lock.json`/`yarn.lock`, `.babelrc`, `tsconfig*.json`), and `.git`
- [x] 1.2 Confirm no runtime PHP `require`s anything under an excluded path (grep for `resources/` and `deploy` includes); compiled assets must already live under `public/`
- [x] 1.3 Add `.DS_Store` to `.gitignore` and untrack every committed `.DS_Store` (`git rm --cached`)

## 2. Production header & readme ERRORs

- [x] 2.1 `markaroo.php`: change `Domain Path: languages` → `Domain Path: /languages`
- [x] 2.2 `readme.txt`: set `Tested up to` to the current stable WordPress version (confirm exact number at implementation time)
- [x] 2.3 Resolve `mismatched_plugin_name`: align the plugin header `Plugin Name` with the `readme.txt` title (per design: set header to "Markaroo — Visual Feedback & Task Management")

## 3. Production i18n ERROR

- [x] 3.1 `plugin/Support/Notifications/Mailer.php`: move the `translators:` comment to the line directly above the `_n()` call (currently line ~106) so `MissingTranslatorsComment` clears

## 4. Production `$wpdb` WARNINGs — value placeholders

- [x] 4.1 `plugin/Repositories/FeedbackRepository.php`: wrap all interpolated value parameters in `$wpdb->prepare()` (count/select builders at ~113-122, delete `IN (...)` builders at ~281/283/308 — build the `%d` placeholder list and pass ids to `prepare()`, clearing `UnfinishedPrepare`)
- [x] 4.2 `plugin/Repositories/ReplyRepository.php` and `ShareRepository.php`: ensure every `WHERE ... = %d/%s` runs through `$wpdb->prepare()`
- [x] 4.3 `plugin/Support/Privacy.php` and `NotificationQueue.php`: prepare interpolated value parameters

## 5. Production `$wpdb` WARNINGs — identifiers, direct/uncached, schema, slow

- [x] 5.1 Repositories + support layer: for unavoidable `{$table}` identifier interpolation (table names from `$wpdb->prefix`), add `phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- table name from $wpdb->prefix` on each flagged line
- [x] 5.2 Add `phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- custom table, no core API` to each flagged direct/uncached query (FeedbackRepository, ReplyRepository, ShareRepository, Privacy, NotificationQueue, Cache, Uninstall)
- [x] 5.3 `plugin/Support/Uninstall.php`: annotate the DROP TABLE lines with `phpcs:ignore WordPress.DB.DirectDatabaseQuery.SchemaChange -- uninstall drops plugin tables`
- [x] 5.4 `Uninstall.php` and `WordPressCommand.php`: annotate `SlowDBQuery` meta_key/meta_value lines (bounded admin/cron queries)

## 6. Prefix WARNINGs

- [x] 6.1 Grep the WP Bones migration runner to determine if migrations resolve by class name; if safe, rename migration classes (`0001`–`0005`) to a `Markaroo_`-prefixed form — otherwise annotate `phpcs:ignore ... PrefixAllGlobals.NonPrefixedClassFound -- WP Bones migration convention`
- [x] 6.2 Migration `$instance` global (`0005`): prefix or scope to remove `NonPrefixedVariableFound`
- [x] 6.3 `bootstrap/autoload.php`: rename `$start` → `$markaroo_start` (or scope locally)

## 7. Build & verify (acceptance gate)

- [ ] 7.1 Build the distribution ZIP honoring `.distignore` (confirm the team's build command: `wp dist-archive` or Bones/CI equivalent)
- [ ] 7.2 Run Plugin Check against the built ZIP; confirm **zero ERRORs** (capture the report)
- [ ] 7.3 Install the built ZIP on a clean WordPress, activate, confirm admin app + frontend widget load and migrations run with no console/PHP errors
