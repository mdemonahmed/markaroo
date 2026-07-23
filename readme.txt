=== Markaroo — Visual Feedback, Review & Task Management ===
Contributors: emonahmed
Tags: feedback, collaboration, task-management, visual-feedback, annotations
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 8.1
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Visual feedback, collaboration & task management for WordPress. Drop pins on any page, capture screenshots, and manage tasks without leaving the site.

== Description ==

**Markaroo** turns website feedback into tracked work.

Your client opens the page, clicks the element that's wrong, draws on it, and types what they want. You get a pin with a screenshot, the exact URL, and the browser details. Assign it, set a priority, reply in thread, and mark it done.

No screenshots pasted into email. No "the button on the third section, you know the one." No login required for the person leaving feedback.

**Markaroo** lets clients and team members leave visual feedback directly on your WordPress site. Click anywhere on a page to drop a feedback pin, capture a screenshot, add annotations, and turn comments into trackable tasks — all without leaving the browser.

Built for web agencies, freelance developers, and content creators. No external service required. All data stays on your server.

**Free features:**

* Click-to-pin feedback anywhere on a page
* Drag-to-select region capture with an on-page overlay
* Automatic page screenshots via html2canvas (runs in-browser, no server calls)
* Annotation tools: arrow (default), rectangle, circle — drawn on the screenshot
* Markdown comment composer with toolbar shortcuts
* Priority badges (urgent/high/normal/low), task assignment, due dates, tags
* Threaded replies and @mention autocomplete for WP users
* File attachments (images, PDFs, documents, spreadsheets, CSV, text)
* Admin dashboard with filterable/sortable task list and overview analytics
* Guest share links — send clients a unique URL, no account required
* Three widget modes: Comment, View only, Clean (widget hidden)
* Smart email notifications: off / instant / digest / smart (based on activity)
* GDPR-compliant: WP personal-data exporter and eraser built in
* Clean uninstall: optionally remove all tables, options, and transients
* Works with any theme, page builder, or site structure


== Installation ==

**From the WordPress Plugin Directory:**

1. In your WordPress admin, go to **Plugins → Add New**.
2. Search for "Markaroo".
3. Click **Install Now**, then **Activate**.

**Manual installation:**

1. Download the plugin zip.
2. Upload the `markaroo` folder to `/wp-content/plugins/`.
3. Activate via **Plugins** in wp-admin.

**After activation:**

Navigate to **Markaroo** in the left sidebar to open the dashboard. The feedback widget is automatically loaded for logged-in users with the correct capability. Use **Share Links** to grant guest access without requiring a WordPress account.

== Frequently Asked Questions ==

= Does this work with page builders? =

Yes. Markaroo works with any theme or page builder including Elementor, Divi, Beaver Builder, Bricks, and Oxygen.

= Do clients need a WordPress account? =

No. Use the Share Links feature to generate a unique URL for each client or project. They click the link and can leave feedback immediately with just their name.

= Does the screenshot feature send data to an external server? =

No. Screenshots are taken entirely in the browser using html2canvas and are uploaded directly to your WordPress media library. No data is sent to any third-party service.

= How do I control who can see and leave feedback? =

By default, any logged-in user with the `markaroo_manage_feedback` capability (assigned to administrators) can manage feedback. The create capability is given to editors and above. You can adjust these via WordPress roles or the `markaroo/can/*` filters.

= Is it GDPR-compliant? =

Yes. Markaroo integrates with WordPress's built-in personal-data tools. Site admins can export or erase a user's feedback and replies from **Tools → Export Personal Data / Erase Personal Data**. The plugin also suggests standard privacy policy content.

= Can I remove all data if I deactivate or delete the plugin? =

Yes. Go to **Markaroo → Settings → Advanced** and enable **Delete data on uninstall**. When the plugin is then deleted from wp-admin, all database tables, options, transients, and cron events are removed. If the setting is off (default), your data is preserved.

= What PHP version is required? =

PHP 8.1 or higher. WordPress 6.5 or higher.

== Screenshots ==

1. Feedback widget — click to place a pin, draw annotations, write a comment.
2. Annotation tools overlay with arrow, rectangle, and circle drawing.
3. Threaded replies panel with @mention autocomplete.
4. Admin dashboard task list with filters and sorting.
5. Overview analytics — open/resolved/overdue stats and top pages.
6. Share Links manager — create guest access links with configurable permissions.

== Changelog ==

= 1.0.0 =
* Initial release.
* Click-to-pin feedback widget with screenshot and annotation tools.
* Admin dashboard with task list, overview analytics, and share links manager.
* Threaded replies, @mentions, file attachments.
* Task layer: priority, assignment, due dates, tags.
* Guest share links with configurable widget mode and permissions.
* Smart email notifications (off/instant/digest/smart).
* GDPR personal-data exporter and eraser.
* Clean uninstall option.
* 30+ actions and filters for developer extensibility (see the source repository).

== Upgrade Notice ==

= 1.0.0 =
Initial release. No upgrade required.

== Third-party libraries ==

* **html2canvas** (https://html2canvas.hertzen.com/) — MIT License. Used for in-browser page screenshots. Bundled in the plugin.

== Source Code ==

The admin dashboard, frontend widget, welcome screen, and deactivation survey
are built with React/TypeScript and compiled with webpack. The compiled bundles
in `public/apps` and `public/js` are generated from the uncompiled source
included in this package under `resources/assets/` (React/TypeScript apps,
frontend widget, and CSS).

* Repository: https://github.com/mdemonahmed/markaroo
* Uncompiled source lives under `resources/assets/` (React/TypeScript apps + the
  frontend widget) and `resources/assets/css/`.

To build the assets from source:

1. Install dependencies: `npm install`
2. Build for production: `npm run build`

The build uses @wordpress/scripts (webpack); `webpack.config.js` and
`package.json` are included in this package.

Bundled third-party library:
html2canvas 1.4.1 (MIT) - https://github.com/niklasvh/html2canvas
Compiled into `public/js/html2canvas.js` by the webpack build.
