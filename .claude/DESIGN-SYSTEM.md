# Markaroo Design System

One visual language for the **frontend widget** and the **admin dashboard**. When
building UI in either place, match these specs so the two feel like one product.

## Icons

- **Library:** [Lucide](https://lucide.dev/guide/react/) — `lucide-react`. One library everywhere.
- Import by name: `import { Settings, Mail } from 'lucide-react'`.
- Default size **18** in nav/inline, **16** in dense controls, **20**+ for emphasis.
- Always `strokeWidth={2}`, color inherits (`currentColor`) — never hardcode a hex on an icon.
- Never use emoji or one-off hand-drawn `<svg>` paths for UI icons.

## Color

| Role | Value | Frontend token | Dashboard token |
|---|---|---|---|
| Primary (brand purple) | `#5b4fcf` | `--markaroo-primary` | `--mk-primary` |
| Primary hover | `#4a3eb8` | `--markaroo-primary-hover` | `--mk-primary-hover` |
| Focus ring | `0 0 0 2px rgba(99,102,241,.15)` | — | `--mk-focus-ring` |
| Ink / heading | `#101828` | `--markaroo-text` | `--mk-ink` |
| Body text | `#475467` | `--markaroo-text-light` | `--mk-text` |
| Muted | `#98a2b3` | `--markaroo-text-muted` | `--mk-muted` |
| Field border | `#e5e7eb` | `--markaroo-border` | `--mk-field-border` |
| Surface | `#fff` | `--markaroo-surface` | `--mk-surface` |
| Success / danger | `#16a34a` / `#dc2626` | — | `--mk-success` / `--mk-danger` |

Priority colors (both sides): urgent `#ef4444`, high `#f97316`, normal `#6366f1`, low `#9ca3af`.

## Typography

- Font: system stack (`-apple-system, "Segoe UI", Roboto, …`).
- Base body **14px / 1.5**. Labels **13px / 500**. Section titles **15px / 600**. Helper text **12px**.
- Headings use ink color; body uses body color; helper/labels use muted.

## Spacing & shape

- Spacing scale: 4 · 8 · 12 · 16 · 24 · 32.
- Radius: control **8px**, card **12px**, pill **999px**.
- Card shadow: `0 1px 3px rgba(16,24,40,.06)`. Popover: `0 12px 32px rgba(16,24,40,.12)`.

## Components

### Text input / select / textarea
`width:100%` · padding **8px 10px** · `1px solid #e5e7eb` · radius **8px** · font **14px** ·
surface bg. **Focus:** border → primary + ring `0 0 0 2px rgba(99,102,241,.15)`, no outline.
Textarea `resize: vertical; min-height: 80px`.

### Checkbox / radio
Native control, **16×16**, `accent-color: var(--primary)`. Sits inline with its label, **8px** gap,
label text 13–14px. No custom-drawn boxes.

### Button
Inline-flex, gap 4–6, padding **8px 16px** (sm: 6px 10px), radius **8px**, font **14px / 500**.
- **Primary:** primary bg, white text.
- **Ghost:** transparent/tinted bg, 1px border `#e5e7eb`, muted text.
- **Danger:** red-tinted (`#fef2f2`) bg + text.
Disabled: `opacity .5`.

### Modal / popover
Centered overlay `rgba(15,23,42,.5)`; panel white, radius **12px**, shadow popover. Header row with
title + close (Lucide `X`). Form controls inside use the **exact** input/select spec above — the
modal must not fall back to browser-default fields.

## Rule of thumb

If a field, button, checkbox, or icon looks different between the widget and the dashboard,
it's a bug. Copy the spec above, don't invent a new variant.
