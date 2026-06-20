# 06 — Guest share links

**Depends on:** 04, 05
**Goal:** Let clients submit/view feedback with no WordPress account and no browser extension, via a private token URL.

## Scope (free)
- Create/list/revoke share tokens in admin.
- A token in the URL (e.g. `?markaroo_share=TOKEN`) unlocks the widget for guests with the share's rights and widget mode.
- Guests are identified by a name they type once (stored client-side + on each item as `author`, `author_id = 0`).

## Steps
1. **Token issuance** (REST `/shares`): generate a 48–64 char random token (`wp_generate_password(48, false)`), store row in `markaroo_shares` with scope (site/page), `can_view`, `can_comment`, `widget_mode`, optional `expires_at`, `created_by`.
2. **Guest auth layer:** a request carrying a valid, non-expired `markaroo_share` token (header `X-Markaroo-Share` or query param) is treated as a guest principal with that share's rights. Add this to the REST permission helper:
   - comment endpoints require `can_comment`,
   - read endpoints require `can_view`,
   - manage endpoints always denied for guests.
3. **Page scope:** if `scope = page`, the token only authorizes feedback whose `page_key` matches `shares.page_key`.
4. **Frontend:** when the widget detects a `markaroo_share` token, it boots in guest mode: prompts for a display name (persist in `localStorage` under a `markaroo-` key, never browser storage inside an artifact — this is the real plugin, localStorage is fine here), hides admin-only affordances, applies the share's widget mode.
5. **Stamping:** new feedback/replies from a guest set `author` = entered name, `author_id` = 0, `share_id` = the share row id.
6. **Admin UI** (part of dashboard, task 16): list shares with copy-link button, revoke, and per-link rights/mode/expiry.
7. Respect `markaroo_settings.allow_guest_links`; if off, reject all token auth.

## Hooks
- `do_action('markaroo/share/created', $share)`
- `do_action('markaroo/share/revoked', $share)`
- `apply_filters('markaroo/share/authorize', $principal, $share, $request)` — pro role mapping seam.

## Acceptance
- A revoked or expired token is rejected (403).
- A page-scoped token cannot read/post feedback for other pages.
- A comment-only guest can add feedback + replies but cannot resolve/delete.
- Guest name persists across reloads; items show the guest name with `author_id = 0`.
- With `allow_guest_links = false`, all tokens are rejected.
