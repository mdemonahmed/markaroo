# 02 — Database migrations & models

**Depends on:** 01
**Goal:** Create the three tables and their Eloquent models. Migrations run on activation.

## Scope (free)
- Tables: `markaroo_feedback`, `markaroo_replies`, `markaroo_shares` (real names get the WP prefix).
- Eloquent models with relationships and casts.
- Repository layer so controllers never touch `$wpdb` directly.

## Steps
1. `php bones migrate:create create_markaroo_feedback_table` — define all columns from the `wp_markaroo_feedback` table in `CLAUDE.md` (screenshot fields + `due_date`, `tags`, `share_id`, `os`, `browser`). Set `protected $usePrefix = true`. Add indexes on `page_key`, `status`, `assigned_to_id`, `author_id`, `created_at`.
2. `create_markaroo_replies_table` — columns per `CLAUDE.md`. Index `feedback_id`, unique `reply_uuid`.
3. `create_markaroo_shares_table` — columns per `CLAUDE.md`. Unique index on `token`.
4. Models in `plugin/Models/`:
   - `Feedback` — `hasMany(Reply)`, casts `attachments`/`tags`/`screenshot_rect` to array, `created_at`/`updated_at`/`due_date` to datetime, accessor for `priority_label` and `status_label`.
   - `Reply` — `belongsTo(Feedback)`.
   - `Share` — token helpers, `isExpired()` accessor.
5. Repositories in `plugin/Repositories/`: `FeedbackRepository`, `ReplyRepository`, `ShareRepository` with methods the REST layer will call (list/filter, create, update, resolve, delete, counts-per-page, etc.).
6. Wire migrations to run on activation via `LifecycleServiceProvider`. Store a DB schema version in `markaroo_db_version` option for future upgrades.

## Files
- `database/migrations/*_create_markaroo_*_table.php`
- `plugin/Models/{Feedback,Reply,Share}.php`
- `plugin/Repositories/{Feedback,Reply,Share}Repository.php`

## Hooks
- `apply_filters('markaroo/feedback/query_args', $args, $context)` — let pro alter list queries.
- `do_action('markaroo/db/migrated', $version)`.

## Acceptance
- Activating the plugin creates all three tables with the correct columns and indexes (verify in DB).
- `markaroo_db_version` option is set.
- Models read/write through Eloquent; casts return arrays/datetimes as expected.
- No raw SQL outside repositories.
