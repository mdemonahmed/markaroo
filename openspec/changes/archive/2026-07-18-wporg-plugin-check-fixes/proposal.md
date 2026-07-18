## Why

Markaroo is ready for its first WordPress.org plugin-directory submission, but the Plugin Check tool run on 2026-07-18 reported a wall of ERRORs and WARNINGs (`markaroo-markaroo-php-20260718-132055.md`). Almost all of them come from one root cause: **Plugin Check scanned the raw development tree, which ships dev-only files that must never be in a distributed plugin ZIP** (`.DS_Store`, `.claude/`, `.agents/`, `graphify-out/`, `openspec/`, dev markdown, dotfiles, `deploy.php`). A handful of genuine production-file issues remain (i18n comment, header format, readme headers, `$wpdb` sniffs). Fixing both classes is a hard blocker for approval — the directory rejects any plugin with unresolved ERRORs.

## What Changes

- **Add a distribution manifest** (`.distignore`) so the packaged ZIP contains only production files. This alone clears every `hidden_files`, `application_detected`, `ai_instruction_directory`, `unexpected_markdown_file`, and the `.claude/` text-domain / escaping / direct-access findings.
- **Fix the production-file ERRORs** that ship in the ZIP:
  - `markaroo.php`: `Domain Path` header must start with `/` (`languages` → `/languages`).
  - `Mailer.php:106`: move the `translators:` comment to the line directly above the `_n()` call.
  - `readme.txt`: bump `Tested up to` to the current stable WordPress, and resolve the plugin-name mismatch against the plugin header.
- **Harden the production-file WARNINGs** so the report is clean, not just error-free: `$wpdb` prepared-statement / caching / interpolation sniffs across the repository + support layer, migration class-name prefixes, and non-prefixed global variables.
- **Untrack and ignore** `.DS_Store` and other stray dev artifacts from the working tree.
- **Re-run Plugin Check against the built ZIP** and confirm zero ERRORs before submission.

## Capabilities

### New Capabilities
- `wporg-submission`: The contract for producing a WordPress.org-compliant distribution — the file-exclusion manifest that defines what ships, and the code/header/readme compliance requirements the shipped files must satisfy to pass Plugin Check with zero ERRORs.

### Modified Capabilities
<!-- None — no existing feature spec changes its behavior; this is packaging + compliance hardening. -->

## Impact

- **New file**: `.distignore` (distribution exclusion manifest).
- **Headers/docs**: `markaroo.php` plugin header, `readme.txt`.
- **PHP source**: `plugin/Support/Notifications/Mailer.php`, `plugin/Repositories/*.php`, `plugin/Support/{Privacy,Cache,Uninstall}.php`, `plugin/Support/Notifications/NotificationQueue.php`, `plugin/Console/Commands/WordPressCommand.php`, `database/migrations/*.php`, `bootstrap/autoload.php`.
- **VCS hygiene**: `.gitignore` (add `.DS_Store`), untrack committed `.DS_Store` files.
- **No runtime behavior change** for end users: all edits are compliance/annotation/packaging; feature behavior is preserved.
- **Excluded from ZIP (not deleted from repo)**: dev tooling (`.claude/`, `.agents/`, `graphify-out/`, `.codegraph/`, `openspec/`), dev markdown, build config, source `resources/`, dotfiles, `deploy.php`.
