# 18 — Notifications

**Depends on:** 04, 14
**Goal:** Email notifications for mentions and assignments, with digest batching, a smart mode, and per-event toggles. (Email-on-every-feedback for all team members is a **pro** feature — only fire the hook.)

## Scope (free)
- Instant emails for @mentions and assignments to the affected user.
- Digest mode: batch notifications at 15 / 30 / 60-minute intervals.
- Smart mode: digest for general activity + instant for mentions/assignments.
- Per-event toggles (new_feedback, reply, mention, assignment, resolved). Off mode disables all.

## Steps
1. **Trigger points:** hook into `markaroo/mention`, `markaroo/feedback/assigned`, `markaroo/reply/created`, `markaroo/feedback/resolved`. Each maps to a per-event toggle in settings.
2. **Recipient resolution:** mention → mentioned user(s); assignment → assignee; reply → feedback author + thread participants (free can keep this to author + assignee to stay light). Never email guests (no account) unless an email was provided — keep free to WP users only.
3. **Modes:**
   - `off`: send nothing.
   - `instant`: send immediately per enabled event.
   - `digest`: queue events; a WP-Cron job every `digest_interval` minutes sends one summary email per user with the batched items, then clears the queue.
   - `smart`: mentions + assignments go instant; everything else batches into the digest.
4. **Queue:** store pending digest items in a `markaroo_notify_queue` option/table keyed by user (option array is fine for free volume; document the limit). Schedule the cron in `NotificationsServiceProvider`; clear on uninstall.
5. **Emails:** use `wp_mail` with translatable templates (plain + simple HTML). Include item link (admin or page+pin), comment excerpt, author, priority. Respect a sane "from".
6. **Dedupe:** don't double-send the same event to the same user across mention + general.

## Hooks
- `do_action('markaroo/notify/send', $user_id, $event, $payload)` — central send point; pro can intercept/redirect (Slack, etc.).
- `apply_filters('markaroo/notify/recipients', $user_ids, $event, $context)`
- `apply_filters('markaroo/notify/email', $email_args, $event)`
- `do_action('markaroo/notify/digest_flush', $user_id, $items)`

## Acceptance
- A mention/assignment sends an instant email in instant and smart modes; nothing in off mode.
- Digest mode sends a single batched email per user on the cron interval and clears the queue.
- Per-event toggles enable/disable the right emails.
- Guests are never emailed (free); no duplicate emails for the same event.
