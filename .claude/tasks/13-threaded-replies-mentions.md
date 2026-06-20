# 13 — Threaded replies & @mentions

**Depends on:** 04, 12
**Goal:** Threaded conversation under each feedback item, with @mentions that notify the mentioned user, inline editing of one's own comments/replies, and delete with confirmation.

## Scope (free)
- Reply thread per feedback (stored in `markaroo_replies`).
- @mention autocomplete in comments and replies; mention triggers a notification (task 18).
- Inline edit of own comment/reply; delete with a confirm dialog.

## Steps
1. **Thread UI** in the feedback detail popover/panel: list replies oldest→newest with author, time, rendered markdown. "Write a reply…" composer at the bottom.
2. **Post reply:** generate a client `reply_uuid`, optimistic insert, POST `/feedback/{id}/replies`. Reconcile on response. Guests with comment rights can reply.
3. **@mentions:** typing `@` opens an autocomplete from `/users` (manage context) — for guest context, mentions can target only WP users surfaced by the share (keep it simple: only show mentionable users the requester is allowed to see). Store mentions as part of the text plus a parsed list sent to the server so it can notify.
4. **Notify:** on create, server detects mentioned user IDs and fires `markaroo/mention` (task 18 sends the email/notification). De-dupe so a user isn't notified twice for the same item.
5. **Inline edit:** author (or manage) can edit their comment/reply in place; PATCH; show an "edited" marker. Validate non-empty.
6. **Delete with confirmation:** require an explicit confirm step in the UI before DELETE. Deleting a feedback item cascades its replies (handle in repository/model).
7. Render markdown safely (same renderer as task 11).

## Hooks
- `do_action('markaroo/mention', $mentioned_user_ids, $context)` (context = feedback or reply).
- `do_action('markaroo/reply/created', $reply, $feedback)` (already from task 04; reuse).
- `apply_filters('markaroo/mention/candidates', $users, $request)` — pro role-aware mention lists.

## Acceptance
- Replies post, render, and persist; guests with comment rights can reply.
- `@` autocomplete works; selecting a user inserts the mention and, on submit, that user is notified once.
- Editing own comment/reply updates it and shows an edited marker; non-authors without manage cap cannot edit.
- Delete always asks for confirmation; deleting a feedback removes its replies.
