# Kaizen Site — Fixes & Features Design

Date: 2026-06-21
Status: Approved (pending spec review)

## Context

The Kaizen marketing site is a Vite + React + Tailwind single-page app. Navigation
is currently in-memory: `App.tsx` holds `useState<Page>` and a `navigate()` function
that only mutates React state. There is no router and no per-page URL. Page
transitions use `motion/react` `AnimatePresence` with `mode="wait"`, and the scroll
container is the `<body>`. Production hosting is Vercel; `vercel.json` already
rewrites all non-`/api` routes to `index.html`.

This design covers eight requested changes. The routing change is the foundation
that unblocks three of them.

## Goals (the eight tasks)

1. Contact "Project type" buttons: single-select only; fix the iPhone tap glitch.
2. Per-page URLs so a refresh keeps you on the same page (not scroll position).
3. Draft real Privacy Policy and Terms of Service pages, linked in the footer.
4. Home stats strip: slow the counter, restyle the strip, remove bold.
5. Browser back/forward (and iPhone edge-swipe) navigate between pages.
6. Block iPhone pinch-zoom and the white-background overscroll.
7. Capability boxes 01/02/03 (Home cards + Services index pills) scroll to the
   matching section instead of the top of the Capabilities page.
8. Contact: replace the always-visible message textarea with a "Note" button that
   expands the textarea on click.

## Decisions (from brainstorming)

- URL style: **clean paths** (`/contact`, `/capabilities`, ...), not hash URLs.
- Legal pages: **draft full text** + build pages + footer links (with a
  "pending legal review" note).
- Counter "change theme": **restyle the stats strip only** (lighter navy-on-cream
  numerals), not a site-wide theme change.
- Note dropdown: **collapsed by default, optional** — the form submits even if the
  note is never opened.
- Router: **minimal custom history router** (no new dependency), not react-router.
- Stats strip look: **lighter** navy-on-cream numerals (approved).

## Architecture

### Routing (foundation — tasks #2, #5, #7)

Replace state-only navigation with a thin history-based router. No library.

- New hook `src/app/useRoute.ts`:
  - Holds the current path in state, initialized from `window.location.pathname`.
  - `navigate(page, opts?)`:
    - Maps `page` → path (table below). If `opts.category` is set, append
      `#<category>` to the URL.
    - Calls `window.history.pushState({ page, category }, "", url)`.
    - Updates local state so React re-renders the new page.
  - Subscribes to `popstate`: on back/forward (and iPhone edge-swipe), read the
    path/hash from `window.location`, derive page + category, update state. This is
    what makes history traversal work.
- Path ⇆ page table (single source of truth, used both directions):

  | Page       | Path            |
  |------------|-----------------|
  | home       | `/`             |
  | about      | `/about`        |
  | services   | `/capabilities` |
  | contract   | `/our-work`     |
  | contact    | `/contact`      |
  | privacy    | `/privacy`      |
  | terms      | `/terms`        |

  Unknown paths fall back to `home`.
- Capability deep-link: `/capabilities#project-management`. The category is read
  from the hash on load and on navigation.
- On refresh: the app reads `location.pathname` (+ hash) and renders that page at
  the top. Scroll position is deliberately not restored (existing
  `history.scrollRestoration = "manual"` is kept).
- `App.tsx` consumes `useRoute()` instead of `useState<Page>`. The `Page` type
  expands to include `"privacy" | "terms"`. The `AnimatePresence` key stays
  `page:category` so transitions are unchanged.

### Capability deep-link scroll fix (task #7)

Root cause: `onExitComplete={scrollToTop}` in `App.tsx` runs ~450ms after exit,
*after* `Services.tsx` has already scrolled to the category — so the top-scroll
wins.

Fix:
- `scrollToTop` (run on `onExitComplete`) skips when the incoming navigation
  targets a capability category (i.e. there is an active category / hash).
- `Services.tsx` scrolls to the target box once the page has settled (after the
  enter transition / on layout), using the existing `refs` map and `scroll-mt`.
- Both entry points already pass the category: Home cards
  (`setPage("services", { category })`) and the Services index pills. Verify both
  land on the correct box.

### Contact "Project type" single-select (task #1)

- `selectedTypes: string[]` → `selectedType: string` (single value, defaults to the
  first service title).
- `toggleType` → `selectType(t)` that simply sets the value.
- Submit payload sends `projectType` (single) — update the body sent to
  `/api/contact` and confirm `api/contact.ts` reads it correctly (it currently
  expects `projectTypes`; adjust the API to accept a single value or wrap in an
  array for backward compatibility).
- iPhone glitch fix on the pills: add `touch-action: manipulation` and
  `-webkit-tap-highlight-color: transparent`; give the group `role="radiogroup"`
  and each pill `role="radio"` + `aria-checked`.

### Contact "Note" dropdown (task #8)

- Add `noteOpen` state, default `false`.
- Replace the static textarea block with a "+ Add a note" button. Clicking it sets
  `noteOpen = true` and reveals the textarea with a height/opacity transition.
- The message is **optional**: `required` is removed; the form submits whether or
  not the note is opened or filled.

### Home stats strip restyle + slower counter (task #4)

Scope: only `StatsStrip` / `CountUp` in `Home.tsx` (and any related class in
`theme.css`). No site-wide change.

- Remove bold: drop `font-semibold` on the number span and change the inner
  `CountUp` inline `fontWeight` from `800` to a light/normal weight (~300–400).
- Restyle: numerals become prominent (~`clamp(2.25rem, 5vw, 3.25rem)` — currently
  body-size), navy with the gold accent on the suffix and the existing thin red
  rule; section stays `bg-cream`.
- Slow down: count `duration` `1400ms → ~2600ms`.

### Mobile gesture lock (task #6)

- `index.html` viewport meta: add `maximum-scale=1, user-scalable=no` to the
  existing content.
- `theme.css`: `overscroll-behavior: none` on `html, body`; set a non-white
  background on `html` matching the page so an overscroll never flashes white;
  `touch-action: pan-y` at the root to block pinch-zoom while keeping vertical
  scroll.

### Privacy & Terms pages (task #3)

- New `src/app/components/pages/Privacy.tsx` and `Terms.tsx`, styled to match the
  existing page layout (eyebrow + serif heading + prose sections).
- Content drafted for a SAM.gov-registered Virginia PM consulting firm: what data
  the contact form collects, processing via Resend, cookies/analytics, third
  parties, data retention, user rights, governing law (Virginia), contact email,
  effective date. A visible note states the text is a draft pending legal review.
- Routed at `/privacy` and `/terms`; added to `Footer.tsx` links.

## Files

- `src/app/useRoute.ts` — new router hook.
- `src/app/App.tsx` — consume router; add privacy/terms cases.
- `src/app/components/Nav.tsx` — `Page` type gains privacy/terms (type export).
- `src/app/components/Footer.tsx` — Privacy/Terms links.
- `src/app/components/pages/Home.tsx` — stats strip restyle + slower counter.
- `src/app/components/pages/Services.tsx` — deep-link scroll fix.
- `src/app/components/pages/Contact.tsx` — single-select + Note dropdown.
- `src/app/components/pages/Privacy.tsx` — new.
- `src/app/components/pages/Terms.tsx` — new.
- `api/contact.ts` — accept single project type.
- `src/styles/theme.css` — gesture lock + stats strip styles.
- `index.html` — viewport meta.

## Testing & verification

- `pnpm build` must pass.
- Browser preview verification:
  - Refresh on `/contact`, `/capabilities`, `/about` lands on that page at top.
  - Back/forward buttons move between visited pages.
  - Home card and Services pill 01/02/03 scroll to the correct box.
  - Project type allows exactly one selection; no double-tap zoom on mobile
    emulation.
  - "Note" button expands the textarea; form submits without it.
  - Stats numbers are lighter, larger, and count slowly.
  - Mobile emulation: pinch-zoom blocked; overscroll shows no white.
  - `/privacy` and `/terms` render and are linked from the footer.

## Out of scope

- Site-wide theme/typography change.
- Restoring scroll position on refresh (explicitly not wanted).
- Legal sign-off of the drafted policy text (user/lawyer responsibility).
