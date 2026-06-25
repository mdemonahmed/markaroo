# 26 - Additional Functionality

New features beyond the 25-task plan, drawn from the Reviso reference you shared and the SaaS direction. Free tier only. Every extension point hooks out cleanly for the future Pro plugin.

Conventions: `wp_markaroo_`, text domain `markaroo`, CSS `markaroo-`, REST `markaroo/v1`, tables `wp_markaroo_*`.

---

## 1. Getting Started checklist

A progress checklist that lives on its own sidebar page and on the dashboard until done. Drives activation and first value.

Items:

1. **Try it on your live site** - open any page, click the Markaroo button in the admin bar, drop a pin. Done when the first feedback row exists.
2. **Share a no-login link** - generate a guest link. Done when the first share token exists.
3. **Invite a teammate or set access** - configure who can give feedback. Done when access mode is saved.

Each item: number badge, title, one-line help, action button. Completed items collapse with a check.

State source: `GET markaroo/v1/onboarding/state` returns booleans derived from real data, not stored flags:

```php
$state = array(
    'has_feedback'    => wp_markaroo_count_feedback() > 0,
    'has_share_link'  => wp_markaroo_count_share_links() > 0,
    'access_set'      => (bool) get_option( 'wp_markaroo_access_configured' ),
);
```

When all three are true, hide the page and move a quiet `Help` link into the sidebar footer.

Card layout mirrors your reference: circled `1` / `2` / `3`, bold title, supporting line, button (filled for the primary next step, outline for the rest).

---

## 2. Admin bar launcher

The fastest path to first feedback. Add a Markaroo button to the WP admin bar that shows on the front end for logged-in users with the right capability.

- Clicking it loads the front-end widget on the current page.
- Label: `Markaroo` with the brand mark.
- Capability gate: `wp_markaroo_give_feedback` (your custom cap).

```php
add_action( 'admin_bar_menu', 'wp_markaroo_admin_bar', 100 );
function wp_markaroo_admin_bar( $bar ) {
    if ( is_admin() || ! current_user_can( 'wp_markaroo_give_feedback' ) ) {
        return;
    }
    $bar->add_node( array(
        'id'    => 'wp-markaroo-launch',
        'title' => __( 'Markaroo', 'markaroo' ),
        'href'  => '#',
        'meta'  => array( 'class' => 'markaroo-launch' ),
    ) );
}
```

The widget script listens for clicks on `.markaroo-launch` and toggles the feedback overlay. Same entry point used by the wizard's `Open my site` button.

---

## 3. No-login share links (client review)

Extends your planned guest share links with the review UX from the reference. The pitch: client opens a live page and comments, no account, nothing to install.

Flow:

1. From the admin bar button or the Share Links page, generate a review link.
2. Link carries a signed token. Token maps to a page scope and a permission set (comment only, or comment + resolve).
3. Client opens the link, sees the live page plus the feedback layer, drops pins and comments as a guest.
4. Guest comments attach a name field (no account). Stored against the token.

Token rules:

- Random, high-entropy token. Never put personal data in the URL.
- Configurable expiry (e.g. 7 / 30 / 90 days / never).
- Revoke instantly from the Share Links page.
- Optional scope: whole site or a single page.

```php
register_rest_route( 'markaroo/v1', '/share/(?P<token>[a-zA-Z0-9]+)', array(
    'methods'             => 'GET',
    'callback'            => 'wp_markaroo_resolve_share',
    // Public by design - the token is the auth. Validate and rate-limit inside.
    'permission_callback' => '__return_true',
) );
```

Public route, so document the reason in a comment and validate the token strictly. Add a basic rate limit to slow token guessing.

Share Links page UI:

- Table: link label, scope, permission, created, expires, status.
- Per-row: copy, edit expiry, revoke.
- `+ New share link` opens a small modal: scope, permission, expiry, then copy.

---

## 4. Approvals workflow

The Reviso sidebar has an Approvals item. Add a light sign-off step so resolved work gets confirmed.

State path:

```
Open  ->  In progress  ->  Resolved  ->  Approved
                              |
                              v
                         Reopened (back to Open)
```

- Anyone with `wp_markaroo_resolve_feedback` can mark **Resolved**.
- Approval is a separate gate: `wp_markaroo_approve_feedback`. The client or a reviewer marks **Approved**.
- Approving locks the item from edits but keeps the thread readable.
- Reopen sends it back to Open and clears the approval.

Approvals page:

- Filter to `Resolved` items awaiting approval.
- Each row: page, summary, who resolved, when.
- Actions: `Approve`, `Reopen`, open thread.

Free tier ships single-step approval. Pro can extend to multi-approver via a filter (see section 6).

---

## 5. Status model

One canonical status field on every feedback/task row. Used by badges, filters, the dashboard resolution rate, and approvals.

| Status | Color token | Who can set |
|---|---|---|
| `open` | `--mk-info` | auto on create |
| `in_progress` | `--mk-warning` | `wp_markaroo_resolve_feedback` |
| `resolved` | `--mk-success` | `wp_markaroo_resolve_feedback` |
| `approved` | `--mk-primary` | `wp_markaroo_approve_feedback` |
| `reopened` | `--mk-info` | anyone who can comment |

Store status as a string column on `wp_markaroo_feedback`. Validate against an allow-list. Fire an action on every change:

```php
do_action( 'wp_markaroo_status_changed', $feedback_id, $old, $new, get_current_user_id() );
```

Dashboard analytics read this: resolution rate = `(resolved + approved) / total`, per-page feedback counts group by page URL.

---

## 6. Pro extension seams

Keep all of the above free and fully working. Leave hooks so Pro adds power without forking core. No Pro logic bundled, no license checks, no gated buttons (that is a WP.org trialware violation).

Filters and actions to expose:

| Hook | Type | Pro use |
|---|---|---|
| `wp_markaroo_status_changed` | action | trigger integrations (Slack, email digest) |
| `wp_markaroo_share_token_created` | action | branded client portals |
| `wp_markaroo_feedback_statuses` | filter | add custom statuses |
| `wp_markaroo_approval_steps` | filter | multi-approver chains |
| `wp_markaroo_checklist_items` | filter | extend Getting Started |
| `wp_markaroo_widget_tools` | filter | add annotation tools |
| `wp_markaroo_capabilities` | filter | finer role mapping |

Rule: every new free feature that has obvious upsell potential gets a filter at the decision point, so Pro hooks in cleanly later.

---

## Build order suggestion

1. Status model (everything else depends on it).
2. Admin bar launcher (unlocks first feedback fast).
3. Getting Started checklist (reads real data).
4. No-login share links UX.
5. Approvals workflow.
6. Wire the Pro hooks as you build each one.
