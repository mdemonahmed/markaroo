# CLAUDE.md — Markaroo

## What Markaroo is

Markaroo is a visual website feedback, collaboration, and task-management plugin for WordPress, built for web agencies. Clients and team members drop feedback pins directly on any page without leaving the site. Each comment becomes a trackable task.

This repository is the **free** plugin. Pro features ship as a **separate plugin** that hooks into the free one. Do not build pro features here. Instead, fire actions and expose filters so the pro plugin can extend behavior.

## Tech stack

- **Framework:** WP Bones (Laravel-style WordPress framework). Docs: https://wpbones.com/docs (use the Context7 MCP for live docs).
- **Backend:** PHP 8.1+, WP Bones service providers, REST API, migrations, Eloquent models.
- **Frontend:** React (admin dashboard + frontend feedback widget), bundled via the WP Bones React pipeline in `resources/`.
- **Screenshots:** `html2canvas`, lazy-loaded on demand.
- **Min WordPress:** 6.5+. Tested up to current stable.

A single admin page rendered by a controller, with assets auto-discovered by the v2 webpack
pipeline:

- `resources/assets/apps/app.tsx` — React bundle mounted on `#react-app`, built to `public/apps/app.js`
- `resources/assets/js/greet.ts` — TypeScript helper with a Jest test alongside it
- `resources/assets/css/wp-kirk-common.scss` — SCSS styling, compiled to `public/css/wp-kirk-common.css`
- `plugin/Console/Commands/SimpleCommand.php` / `WordPressCommand.php` — custom `php bones` CLI commands

**Key files to read first:**

| File | What to look at |
| --- | --- |
| `webpack.config.js` | Auto-discovery rules for `apps/`, `js/`, `css/` |
| `plugin/Http/Controllers/Dashboard/DashboardController.php` | Classic controller + `view()` call |
| `resources/views/dashboard/index.php` | Blade-free view that embeds the React mount point |
| `plugin/Console/Kernel.php` | Registers custom bones CLI commands |

## Smoke test (manual, ~30s)

With the plugin active:

1. Log in to `wp-admin` and open **WP Kirk → Main View**.
2. Confirm the React app renders: _"WP Bones — Hello!"_ heading should be visible.
3. Confirm the SCSS loaded: the page uses the `.wp-kirk-*` styles.
4. Run Jest locally: `yarn test` should pass (greet + any other `__tests__`).
5. Run a sample CLI command: `php bones` should list `wpkirk:sample` and `wp:sample` among the commands.

If any of the above fail: check `wp-content/debug.log` for PHP errors, and the browser devtools
Console for runtime errors.

Start swapping `resources/assets/` and `plugin/Http/Controllers/` for your own code. The webpack
config picks up new files automatically — no config edits needed.

## WP Bones layout (do not invent new top-level folders)

```
markaroo/
  bootstrap/        framework bootstrap + autoload
  config/           plugin.php and config files
  database/
    migrations/     php bones migrate:create output
    seeders/
  languages/        markaroo.pot + .mo
  plugin/           PHP core code (namespace Markaroo\)
    Http/Controllers/
    Models/
    Providers/
    Repositories/
    Support/
  public/           front controller + compiled assets
  resources/
    assets/         React source (admin app + frontend widget)
    views/          Blade/PHP views
  vendor/           WP Bones framework
  markaroo.php       main plugin file
  readme.txt         WordPress.org readme
  composer.json
  package.json
```

Use the bones CLI for scaffolding: `php bones make:controller`, `php bones make:model`, `php bones migrate:create`, etc. Confirm exact command names against Context7 docs before running.

## Naming rules (NON-NEGOTIABLE)

| Thing | Rule | Example |
|---|---|---|
| PHP namespace | `Markaroo\...` | `Markaroo\Http\Controllers\FeedbackController` |
| Global PHP functions | prefix `wp_markaroo_` | `wp_markaroo_current_user_can_manage()` |
| Hooks (actions/filters) | prefix `markaroo/` | `do_action('markaroo/feedback/created', $feedback)` |
| Options keys | prefix `markaroo_` | `markaroo_settings` |
| Transients | prefix `markaroo_` | `markaroo_screenshot_lib` |
| DB tables | `{wp_prefix}_markaroo_*` | `wp_markaroo_feedback` |
| REST namespace | `markaroo/v1` | `/wp-json/markaroo/v1/feedback` |
| Text domain | `markaroo` | `__('Resolve', 'markaroo')` |
| CSS classes | prefix `markaroo-`, scoped under a root container | `.markaroo-pin`, `.markaroo-panel` |
| JS global config | `window.markarooConfig` | nonce, restUrl, currentUser, settings |
| Capabilities | prefix `markaroo_` | `markaroo_manage_feedback` |

CSS rule: never use bare class names. Every selector starts with `markaroo-` and the whole widget/admin mounts inside `#markaroo-root`. No global resets, no styling generic tags. This prevents conflicts with themes and page builders.

## Database tables (match the provided field screenshots)

### `wp_markaroo_feedback`
| Col | Type | Notes |
|---|---|---|
| id | bigint unsigned PK AI | |
| page_key | varchar(255) | normalized page identifier |
| page_url | text | full URL captured |
| title | varchar(191) null | optional short task title, editable in the pin detail card (migration 0004) |
| comment | longtext | markdown/rich text |
| status | varchar(20) default `open` | open / resolved |
| priority | varchar(20) default `normal` | urgent / high / normal / low |
| assigned_to_id | bigint unsigned default 0 | WP user id, optional |
| assigned_to_name | varchar(191) | denormalized for guests |
| x | float default 0 | pin X (% of element/page) |
| y | float default 0 | pin Y (% of element/page) |
| viewport | varchar(190) | e.g. `1440x900` |
| screenshot_rect | longtext null | JSON region/annotation data |
| attachments | longtext null | JSON array of attachment meta |
| user_agent | text null | |
| screenshot_id | bigint unsigned default 0 | WP media attachment id |
| screenshot_path | varchar(255) | fallback path |
| author | varchar(191) | name (WP user or guest) |
| author_id | bigint unsigned default 0 | 0 = guest |
| created_at | datetime | |
| updated_at | datetime | |

Added free-version columns (extend the screenshot schema):
| due_date | datetime null | optional task deadline |
| tags | longtext null | JSON array of label strings |
| share_id | bigint unsigned default 0 | guest share link that created it, 0 = internal |
| os | varchar(60) null | parsed from user_agent |
| browser | varchar(60) null | parsed from user_agent |

### `wp_markaroo_replies`
| Col | Type | Notes |
|---|---|---|
| id | bigint unsigned PK AI | |
| feedback_id | bigint unsigned | FK → feedback.id |
| reply_uuid | char(36) | client-generated UUID |
| comment | text | |
| author | varchar(191) | |
| author_id | bigint unsigned default 0 | 0 = guest |
| created_at | datetime | |

### `wp_markaroo_shares` (guest links)
| Col | Type | Notes |
|---|---|---|
| id | bigint unsigned PK AI | |
| token | varchar(64) unique | random, used in share URL |
| label | varchar(191) null | internal name |
| scope | varchar(20) default `site` | site / page |
| page_key | varchar(255) null | when scope = page |
| can_comment | tinyint default 1 | |
| can_view | tinyint default 1 | |
| widget_mode | varchar(20) default `comment` | comment / view / clean |
| expires_at | datetime null | optional |
| created_by | bigint unsigned default 0 | |
| created_at | datetime | |

Use Eloquent models for all three. Never run raw `$wpdb` queries outside the model/repository layer. Always `$usePrefix = true` so real table names become `{prefix}_markaroo_*`.

## Free vs Pro split

**Build in free:** click-to-comment pins, drag-to-select region (draggable/resizable), draggable saved pins, auto screenshot (html2canvas), drawing tools (arrow/rectangle/circle, arrow default), JPEG/PNG + quality controls, markdown toolbar, existing feedback shown as pins, auto metadata (URL/browser/OS/resolution), one-click submit, threaded replies, @mentions + notification, tags/labels, inline edit, delete with confirm, resolve/unresolve + color-coded pins, comment→task, priority + color badges, optional assignment to WP users, optional due dates, dashboard task list + overview, status + basic workload, attachments (images/docs/sheets/csv/text), guest token share links (no client account, no extension), works with any theme/builder, mobile + multi-resolution review, three widget modes (comment/view/clean), digest + smart notification toggles + per-event toggles, feedback counts per page, resolution-rate tracking, GDPR export/erase, data masking of inputs in screenshots, clean uninstall, all performance items.

**Leave for the Pro plugin (only fire hooks/expose filters, no implementation):** screen/video recording, console log capture, interaction/repro steps, session replay, two-way PM sync (Jira/Asana/Trello/etc.), PDF/Figma/Office review surfaces, role-based access (Client/Dev/No Access) + granular per-role rights + moderation rules, email-on-every-feedback, Zapier/webhooks, MCP AI agent server, AI translate/rewrite/title, white-label/custom branding.

When a free feature has an obvious pro upgrade, add a `do_action('markaroo/...')` at the decision point and an `apply_filters('markaroo/...')` around the data, so pro can hook without core edits. See `tasks/19-extensibility-hooks-for-pro.md` for the required hook list.

## Coding standards

- WordPress Coding Standards (PHP + JS). Run `phpcs` with the WordPress ruleset; no errors before a task is "done".
- Escape on output (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`), sanitize on input, verify nonces, check capabilities on every REST/AJAX handler.
- All strings translatable with text domain `markaroo`.
- No direct file access: every PHP file starts with `defined('ABSPATH') || exit;`.
- React: functional components + hooks, no inline styles for layout, CSS classes prefixed `markaroo-`. Keep the frontend widget bundle small; lazy-load `html2canvas`.
- Never store secrets in the repo. Never call external SaaS from the free plugin.

## Definition of done (every task)

1. Code matches all naming rules above.
2. `phpcs` (WordPress ruleset) passes; React lints clean.
3. Capability + nonce checks on every write path.
4. Strings translatable; `.pot` regenerated if new strings added.
5. Required hooks from the task's "Hooks" section are fired.
6. Manual test steps in the task's "Acceptance" section pass.
7. No console errors on front or admin.

## How to work through tasks

Tasks are numbered `00` → `24` in `.claude/tasks`. Do them in order; later tasks depend on earlier ones. Each task file lists its dependencies, scope, files to touch, steps, hooks, and acceptance checks. Finish one task fully (including Definition of Done) before starting the next. If a task reveals a needed schema or hook change, update this CLAUDE.md and the affected task file in the same PR.
