# Markaroo Widget — Annotix-Style Frontend Rebuild

## Context

The free Markaroo feedback widget already has all the *building blocks* of an
annotation tool (capture phases, region select, annotation canvas, screenshot
service, markdown composer, threaded replies) but its UX differs from the
reference plugin `annotix-website-feedback` that the user wants to clone exactly:

- Markaroo annotates on a **separate full-screen screenshot canvas**, then opens a
  **sidebar** composer/thread. Annotix keeps everything **anchored to the pin** on
  the live page (see the 3 reference screenshots).
- Markaroo stores a **full-page** screenshot uploaded **after** create. Annotix
  stores the screenshot **cropped to the selected region** ("Pinned content") with
  annotations burned in, sent **at submit**.
- Annotix detail card has an editable **Title** field; Markaroo has no title column.

**Goal:** make the live-site widget look and behave exactly like annotix —
1. **Image 1**: drag a red-dashed selection box with corner handles + a floating
   vertical toolbar (rectangle / circle / arrow / undo / cancel / confirm) to draw
   annotations live on the page.
2. **Image 2**: a **"Write feedback"** panel anchored beside the box — markdown
   toolbar (B / I / • / 1. / link / code), `@`-mention textarea, Priority, Assign to,
   "Attach screenshot" checkbox, Attach files, ✔ save / ✕ cancel.
3. **Image 3**: clicking a numbered pin opens an anchored detail card — avatar +
   author + timestamp, edit / close / resolve / delete, priority badge, Assign to,
   editable **Title**, **Pinned content** (the cropped screenshot thumbnail with a
   zoom icon → lightbox), Attachments, Replies thread + `@`-mention reply box.

Decisions (confirmed with user): fully anchored panels (drop sidebar as the primary
surface), add a `title` column + UI, crop screenshot to region + burn annotations +
send base64 at submit, region-drag is the primary capture (keep quick click-to-pin).

User decisions chosen: all "Recommended" options.

---

## Backend changes (PHP)

### 1. Migration — add `title`
New `database/migrations/0004_add_title_to_markaroo_feedback.php` (mirror the style
of `0001_create_markaroo_feedback_table.php`): add `title VARCHAR(191) NULL` after
`comment`. Run via the plugin's migrate flow on activation/upgrade.
Also update the schema table in `markaroo/CLAUDE.md` (add the `title` row).

### 2. `FeedbackController::create()` — accept title + base64 screenshot
File `plugin/Http/Controllers/FeedbackController.php`:
- Add `'title' => sanitize_text_field( $request->get_param('title') ?? '' )` to `$data`.
- After the row is created and `$id` is known, read a new `screenshot` param
  (a `data:image/(jpeg|png);base64,...` string). If present and valid, decode and
  store it **before** building the response so `screenshot_url` is returned
  immediately (the "Pinned content" shows with no second request).
- Reuse storage logic by refactoring `ScreenshotController` (below).

### 3. `ScreenshotController` — shared base64 store helper
File `plugin/Http/Controllers/ScreenshotController.php`:
- Extract a static `store_data_url( int $feedback_id, string $data_url ): array|WP_Error`
  that validates the mime (reuse `ALLOWED_MIMES`), decodes base64, writes via
  `wp_upload_bits()`, `wp_insert_attachment()` + `wp_generate_attachment_metadata()`,
  updates the row `screenshot_id` / `screenshot_path`, and fires the existing
  `markaroo/screenshot/before_capture` / `after_capture` actions.
- `upload()` (multipart) keeps working (kept for editing/re-capture); `create()`
  calls `store_data_url()`. Keep the deferred multipart endpoint as a fallback.

### 4. `FeedbackController::update()` — allow inline title edit
Add `'title'` to the `$allowed` whitelist with `sanitize_text_field`. (Assign change
is already supported.) `format_item()` already returns every column, so `title`
flows out automatically once the column exists.

---

## Frontend changes (React/TS, `resources/assets/widget/`)

### State machine — collapse the annotation phase
`store/WidgetContext.tsx` + `types.ts`:
- Change `CapturePhase` to `'idle' | 'selecting' | 'composing'` (drop `'annotating'`).
  Annotation now happens **live inside `'selecting'`**, not on a separate screenshot
  canvas. `PIN_PLACED`/confirm goes straight `selecting → composing`.
- Drop `SCREENSHOT_TAKEN` / `ANNOTATIONS_DONE` screenshot plumbing; annotations live
  on `captureData.screenshotRect.annotations` (already the case via `ANNOTATIONS_DONE`
  — fold that merge into the confirm action `PIN_PLACED`).
- Add `title` to `FeedbackItem` in `types.ts`.

### Capture: merge region-select + live annotation (Image 1)
- New `capture/RegionAnnotator.tsx` replacing the separate `RegionSelect` +
  full-screen `AnnotationCanvas` flow. It renders, over the live page:
  - the existing **selection box** (reuse `RegionSelect.tsx` draw/move/resize +
    8-handle logic, `MIN_SIZE`, `clampRect`),
  - a **floating vertical toolbar** anchored to the box (rectangle / circle / arrow /
    undo / cancel / confirm) — reuse the tool icons + actions from
    `AnnotationCanvas.tsx`,
  - a transparent **SVG annotation layer** where shapes are drawn live, stored as
    page-pct `Annotation[]` (reuse `toPagePct` from `captureUtils.ts`).
  - **Confirm (✔)** → dispatch the pin with `screenshotRect.rect` + `annotations`,
    phase → `'composing'`. **Cancel (✕)** → `END_CAPTURE`.
- `CaptureOverlay.tsx`: region-drag is the default; keep `ClickCapture.tsx` as a quick
  point pin (its crop falls back to the nearest element's bounds via the existing
  `selector` / `elementOffset`, else a default box around the point).
- `AnnotationCanvas.tsx` (full-screen) is retired from the live flow; its drawing
  helpers move into `RegionAnnotator` / stay in `annotationUtils.ts`.

### Compose: anchored "Write feedback" panel (Image 2)
`composer/ComposerPanel.tsx`:
- Render **anchored** next to the selection box (new `support/anchor.ts` positioning
  util — place right/below the box, flip when offscreen, clamp to viewport).
- Keep `MarkdownToolbar`; wire `@`-mention into the textarea by reusing
  `thread/MentionAutocomplete.tsx`.
- Show **Assign to** for logged-in users with `canAssign` (already wired); show
  Priority (exists).
- Replace the always-on screenshot preview with an **"Attach screenshot" checkbox**
  (default checked) like annotix.
- ✔ save / ✕ cancel icon buttons (match screenshot).
- On submit: if "Attach screenshot" is checked, call the new
  `captureCroppedDataUrl(rect, annotations)` and add `screenshot` (base64) + `title`
  to the existing POST payload. Remove the deferred `uploadScreenshot()` call.

### Screenshot service — crop + burn, return base64
`capture/Screenshot.ts`:
- New `captureCroppedDataUrl(rect: CaptureRect, annotations: Annotation[]): Promise<string|null>`:
  1. `captureScreenshot()` → full-page blob (existing; html2canvas, masking, hides
     `#markaroo-root`).
  2. `burnAnnotationsIntoBlob(full, annotations, fmt, q)` — annotations are page-pct,
     which equals full-screenshot-canvas-pct, so the existing `annotationUtils` burn
     works unchanged.
  3. Crop the burned image to `rect` (page-pct → natural px) onto a new canvas →
     `toDataURL(mime, quality)`.
- Keep `uploadScreenshot()` for edit/re-capture.

### Pins — numbered markers + anchored detail card (Image 3)
- `pins/PinMarker.tsx` / `PinLayer.tsx`: render **numbered** badges (order index),
  color by status/priority (config `pinColors`). Click → `SET_ACTIVE_PIN`, open the
  detail card anchored to the marker.
- New `thread/PinCard.tsx` — the anchored detail card, reusing the existing
  `ThreadView` pieces (`ReplyRow`, `ReplyComposer`, `AttachmentList`,
  `MentionAutocomplete`). Layout per Image 3:
  - header: avatar (author initials) + author + localized timestamp + edit / close /
    **resolve** (✔) / **delete** (🗑) buttons (reuse capability gates from `ThreadView`),
  - priority badge, **Assign to** dropdown (PATCH on change),
  - editable **Title** input (PATCH `title` on blur/save),
  - **Pinned content**: `screenshot_url` thumbnail + zoom icon → new `thread/Lightbox.tsx`,
  - Attachments (paperclip), Replies count + thread + reply box.
- `WidgetRoot.tsx`: render `RegionAnnotator` in `'selecting'`, anchored `ComposerPanel`
  in `'composing'`, anchored `PinCard` when `activePinId` set. Remove the
  `'annotating'` screenshot `useEffect`. Keep `Launcher` to enter feedback mode.
  `PinsPanel` (sidebar) is no longer the primary surface — leave the file but stop
  rendering it from `WidgetRoot` (per "fully anchored" decision).

### CSS
`resources/assets/css/` widget styles (compiled to `public/css/widget.css`): add
`markaroo-`-prefixed classes (mounted under `#markaroo-root`) for the dashed
selection box + handles, floating annotation toolbar, anchored composer, pin card,
title field, pinned-content thumbnail + zoom, and lightbox. No global resets; match
the rounded-card / indigo-primary look in the screenshots.

---

## Files to create / modify (representative)

**Create**
- `database/migrations/0004_add_title_to_markaroo_feedback.php`
- `resources/assets/widget/capture/RegionAnnotator.tsx`
- `resources/assets/widget/thread/PinCard.tsx`
- `resources/assets/widget/thread/Lightbox.tsx`
- `resources/assets/widget/support/anchor.ts`

**Modify**
- `plugin/Http/Controllers/FeedbackController.php` (create/update: title + base64 screenshot)
- `plugin/Http/Controllers/ScreenshotController.php` (`store_data_url()` helper)
- `resources/assets/widget/store/WidgetContext.tsx`, `types.ts` (phase + title)
- `resources/assets/widget/WidgetRoot.tsx` (wire anchored panels, drop annotating phase)
- `resources/assets/widget/composer/ComposerPanel.tsx` (anchored, @mention, checkbox, submit crop)
- `resources/assets/widget/capture/Screenshot.ts` (`captureCroppedDataUrl`)
- `resources/assets/widget/capture/CaptureOverlay.tsx`, `captureUtils.ts`
- `resources/assets/widget/pins/PinMarker.tsx`, `pins/PinLayer.tsx`
- `resources/assets/css/*` widget styles
- `markaroo/CLAUDE.md` (add `title` to the `wp_markaroo_feedback` schema table)

---

## Verification

1. **Build/lint:** `yarn build` (webpack), `yarn lint` (ESLint/Prettier clean),
   `php -l` on changed PHP, `phpcs --standard=WordPress` clean on changed PHP.
2. **Migration:** confirm `title` column exists (`wp db query "DESCRIBE wp_markaroo_feedback"`).
3. **Manual smoke (logged-in + guest share URL `?markaroo_share=…`):**
   - Enter feedback mode → drag a region → red-dashed box + handles + floating toolbar
     appear (Image 1); draw arrow/rect/circle, undo, cancel, confirm.
   - Compose panel appears anchored beside the box (Image 2); markdown toolbar, `@`
     mention, priority, assign, "Attach screenshot" checked, attach a file → submit.
   - A numbered pin appears at the spot; reload page → pin persists.
   - Click pin → anchored detail card (Image 3) shows author/timestamp, priority,
     assign, editable title, **Pinned content** = the cropped region with the drawn
     annotations, zoom → lightbox, attachments, replies; post a reply, resolve, delete.
4. **No console errors** on front or admin; screenshot failure must stay non-fatal
   (feedback still submits without an image).

> First implementation step: copy this plan to the project root as
> `markaroo-widget-frontend-plan.md` (user asked for the plan in the root folder;
> plan mode only permits editing the plan file itself right now).
