# 25 - Onboarding Welcome Screen & SaaS Design System

Design spec for the first-run welcome flow and the admin app shell. Goal: make Markaroo feel like a standalone SaaS product, not a stock WordPress plugin screen.

Conventions used here: function prefix `wp_markaroo_`, text domain `markaroo`, CSS class prefix `markaroo-`, REST namespace `markaroo/v1`, DB tables `wp_markaroo_*`. React for all UI.

---

## Part A - Activation Welcome Flow

### A.1 Behavior rules (read first)

These rules keep you WP.org compliant. Auto-redirecting to a welcome page on every activation triggers Guideline 11 (admin dashboard hijacking). Follow these:

- Fire the welcome screen **once**, on first activation only.
- Use a transient guard set in the activation hook. Delete it after the first view.
- Always show a visible **skip** link.
- Never block the user. The plugin stays fully usable if they skip.
- Do not show the screen again after dismissal or completion. Store a flag in an option.

```php
// On activation
register_activation_hook( __FILE__, 'wp_markaroo_on_activate' );
function wp_markaroo_on_activate() {
    if ( false === get_option( 'wp_markaroo_onboarded' ) ) {
        set_transient( 'wp_markaroo_show_welcome', 1, 60 );
    }
}

// On admin_init - redirect once, then clear the guard
add_action( 'admin_init', 'wp_markaroo_maybe_redirect_welcome' );
function wp_markaroo_maybe_redirect_welcome() {
    if ( ! get_transient( 'wp_markaroo_show_welcome' ) ) {
        return;
    }
    delete_transient( 'wp_markaroo_show_welcome' );
    if ( wp_doing_ajax() || is_network_admin() ) {
        return;
    }
    wp_safe_redirect( admin_url( 'admin.php?page=markaroo-welcome' ) );
    exit;
}
```

The welcome page itself is a React route mounted on a dedicated admin screen with no WP admin sidebar chrome (full-bleed). Completion or skip calls a REST endpoint that sets `wp_markaroo_onboarded` to `1`.

### A.2 Layout (full-screen, centered card)

Reference layout matches the Tutor LMS welcome you shared: a soft gradient backdrop, a centered white card, brand mark at top, illustration, headline, one short paragraph, one primary button, and a quiet skip link below the card.

```
+--------------------------------------------------+
|  (soft gradient background, full viewport)       |
|                                                  |
|        +----------------------------------+      |
|        |          [ Markaroo mark ]       |      |
|        |        Hello, {first_name}!      |      |
|        |     Welcome to Markaroo          |      |  <- H1
|        |                                  |      |
|        |        [ illustration ]          |      |
|        |                                  |      |
|        |   One-line value proposition.    |      |
|        |                                  |      |
|        |        [  Let's Start  ]         |      |  <- primary
|        +----------------------------------+      |
|              I already know, skip it!            |  <- text link
+--------------------------------------------------+
```

Copy suggestions:

- Eyebrow: `Hello, {first_name}!`
- H1: `Welcome to Markaroo`
- Body: `Collect visual feedback right on your live pages. Turn comments into tasks. Share a no-login link with clients in seconds.`
- Primary button: `Let's Start`
- Skip link: `I already know, skip it!`

### A.3 Quick setup wizard (3 steps)

After "Let's Start", run a short wizard inside the same full-screen shell. Keep it to 3 steps so people finish it. Each step writes to settings via `markaroo/v1/settings`.

**Step 1 - Who gives feedback?**
- Cards: `My team only` / `Team + clients` / `Anyone with a link`
- Sets default access control mode.

**Step 2 - Capture defaults**
- Toggle: `Capture screenshots with each comment` (on/off)
- Toggle: `Let reviewers draw and annotate` (on/off)

**Step 3 - You're set**
- Show a 3-item Getting Started checklist (see doc 26).
- Two buttons: `Open my site` (launches widget on front end) and `Go to Dashboard`.

Progress indicator: a 3-dot stepper at the top of the card. Keep a `Back` link on steps 2 and 3.

### A.4 REST endpoints for onboarding

| Method | Route | Purpose |
|---|---|---|
| POST | `markaroo/v1/onboarding/complete` | Set `wp_markaroo_onboarded = 1` |
| POST | `markaroo/v1/onboarding/step` | Save a wizard step's answers |
| GET | `markaroo/v1/onboarding/state` | Read checklist completion |

Every route needs `permission_callback` returning `current_user_can( 'manage_options' )`. Omitting it is treated as a security defect at review.

---

## Part B - Admin App Shell

The default WordPress admin look is the thing that makes plugins feel cheap. Fix it with a custom shell that takes over the plugin's own screens only.

### B.1 Structure

```
+-------------------------------------------------------------+
| [WP admin bar - left as is]                                 |
+----------------+--------------------------------------------+
|                |  Top bar: page title | search | + New      |
|  MARKAROO      +--------------------------------------------+
|  (brand)       |                                            |
|                |                                            |
|  Getting       |          Page content (React)              |
|  Started       |                                            |
|  Feedback      |                                            |
|  Tasks         |                                            |
|  Approvals     |                                            |
|  Share Links   |                                            |
|  Settings      |                                            |
|                |                                            |
|  [help / docs] |                                            |
+----------------+--------------------------------------------+
```

The plugin sidebar sits inside your content area, not the WP admin menu. The WP admin menu collapses or you hide it on plugin screens with CSS scoped to your screen IDs. Keep the WP admin bar so users can navigate out.

### B.2 Hide WP chrome on plugin screens

```php
add_action( 'admin_head', 'wp_markaroo_full_bleed' );
function wp_markaroo_full_bleed() {
    $screen = get_current_screen();
    if ( ! $screen || false === strpos( $screen->id, 'markaroo' ) ) {
        return;
    }
    echo '<style>
      #wpcontent { padding-left: 0; }
      #wpbody-content { padding-bottom: 0; }
      .markaroo-app { min-height: calc(100vh - 32px); }
    </style>';
}
```

Scope every override to `markaroo` screen IDs. Never touch unrelated admin pages.

### B.3 Sidebar items

Maps to your reference (Reviso). Free tier:

- **Getting Started** - checklist, only shown until all items done, then auto-hides or moves to a help menu
- **Feedback** - inbox of incoming comments and pins
- **Tasks** - the task layer (status, assignee, page)
- **Approvals** - sign-off workflow for resolved items
- **Share Links** - create, copy, revoke guest tokens
- **Settings** - tabbed settings

Each item: icon + label. Active item gets a left accent bar and a tinted background.

### B.4 Top bar

- Left: current page title
- Center/right: global search (filters tasks and feedback)
- Right: primary action button, contextual per page (`+ New share link` on Share Links, etc.)

---

## Part C - Design System

A small token set. Define once as CSS custom properties on `.markaroo-app`. Reuse everywhere. This is what separates a SaaS look from a default plugin look.

### C.1 Color tokens

```css
.markaroo-app {
  /* Brand */
  --mk-primary: #3538cd;        /* indigo, matches your welcome screen */
  --mk-primary-hover: #2d30b0;
  --mk-primary-soft: #eef0fb;   /* tinted backgrounds, active nav */

  /* Neutrals */
  --mk-ink: #101828;            /* headings */
  --mk-text: #475467;           /* body */
  --mk-muted: #98a2b3;          /* secondary text */
  --mk-border: #eaecf0;
  --mk-surface: #ffffff;
  --mk-bg: #f5f6f8;             /* app background */

  /* Semantic */
  --mk-success: #16a34a;
  --mk-warning: #f59e0b;
  --mk-danger: #dc2626;
  --mk-info: #2563eb;
}
```

Status colors (feedback/task states):

| State | Token | Use |
|---|---|---|
| Open | `--mk-info` | new, unactioned |
| In progress | `--mk-warning` | being worked |
| Resolved | `--mk-success` | done |
| Approved | `--mk-primary` | signed off |

### C.2 Typography

Use the system font stack. No web font load, no extra request, no WP.org flag for remote assets.

```css
--mk-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Scale:

| Role | Size | Weight | Line height |
|---|---|---|---|
| Display (welcome H1) | 40px | 700 | 1.1 |
| H1 (page title) | 24px | 600 | 1.25 |
| H2 (section) | 18px | 600 | 1.3 |
| Body | 14px | 400 | 1.5 |
| Small / meta | 12px | 500 | 1.4 |

### C.3 Spacing, radius, shadow

```css
--mk-space-1: 4px;
--mk-space-2: 8px;
--mk-space-3: 12px;
--mk-space-4: 16px;
--mk-space-6: 24px;
--mk-space-8: 32px;

--mk-radius-sm: 8px;
--mk-radius-md: 12px;   /* cards */
--mk-radius-lg: 16px;   /* welcome card */
--mk-radius-pill: 999px;

--mk-shadow-card: 0 1px 3px rgba(16,24,40,.06), 0 1px 2px rgba(16,24,40,.04);
--mk-shadow-pop:  0 12px 32px rgba(16,24,40,.12);
```

Round corners, soft shadows, and generous whitespace do most of the SaaS lift. Avoid hard 1px gray borders everywhere; lean on shadow and background tint.

### C.4 Core components

**Buttons**
- Primary: indigo fill, white text, `--mk-radius-sm`, no border, subtle shadow on hover.
- Secondary: white fill, `--mk-border` border, `--mk-ink` text.
- Ghost: transparent, text only, used for skip/cancel.
- Danger: red text or red fill for destructive actions (revoke link, delete).

**Cards**
- White surface, `--mk-radius-md`, `--mk-shadow-card`, `--mk-space-6` padding.
- Optional numbered badge in top-left for step cards (matches your Reviso reference: circled `1`, `2`).

**Overview stat cards** (dashboard top row)
- Big number, label below, small trend pill (up/down).
- 4 across on desktop, stack on mobile.

**Tabs (Settings)**
- Underline style. Active tab: `--mk-ink` text + 2px indigo underline. Inactive: `--mk-muted`.
- Tabs: Screenshots, Capture, Task fields, Access, Notifications, Attachments, Advanced.

**Data table (Tasks / Feedback list)**
- No heavy zebra striping. Use row hover tint `--mk-primary-soft`.
- Sortable headers, status badge column, assignee avatar, page link, per-row action menu.
- Sticky header on scroll.

**Status badge**
- Pill, soft background of the state color at ~12% opacity, solid text in the state color.

**Empty states**
- Centered icon, one-line headline, one-line help, one primary action.
- Example (Feedback empty): icon, `No feedback yet`, `Open a page and drop your first pin`, button `Open my site`.

**Toasts**
- Bottom-right, auto-dismiss, success/error variants. Use after save, copy link, revoke.

### C.5 CSS namespace note

Open question from your notes: hyphens vs underscores for the CSS prefix. Recommendation: **hyphens** (`markaroo-`, `mk-` for tokens). It matches BEM and WordPress block conventions, reads cleaner in markup, and avoids confusion with PHP `wp_markaroo_` function names. Keep PHP underscores and CSS hyphens distinct on purpose.

---

## Build notes

- Welcome + wizard: one React app, its own admin screen, full-bleed, no plugin sidebar.
- Dashboard + sub-pages: a second React app with the app shell (sidebar + top bar).
- Tokens live in one SCSS partial imported by both apps.
- All copy wrapped in `__( '...', 'markaroo' )`.
- Every REST route gets a `permission_callback`.
- Onboarding fires once, stays skippable, never nags.
