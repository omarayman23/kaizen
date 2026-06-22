# Kaizen Site Fixes & Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-page URLs with browser back/forward, fix the capabilities deep-link scroll, make the contact project-type single-select with a collapsible note, restyle/slow the home counter, lock down iPhone gestures, and add drafted Privacy & Terms pages.

**Architecture:** Replace the in-memory `useState<Page>` navigation in `App.tsx` with a tiny custom history router (`useRoute.ts`) using `history.pushState` + `popstate` — no new dependency, preserving the existing `motion/react` `AnimatePresence` page-transition structure. All other tasks are localized component/CSS edits.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind v4 (CSS-first), motion/react, lucide-react. Hosting: Vercel (SPA rewrite already in `vercel.json`).

## Global Constraints

- No new npm dependencies. Use the existing custom router approach, not `react-router` (even though it is installed).
- This project has **no test runner** — only `pnpm build` (`vite build`) and `pnpm dev`. Each task's verification cycle is: `pnpm build` passes with no new TypeScript errors, then a browser-preview behavior check. There are no unit-test files to write.
- The scroll container is the `<body>` (html/body `height:100%` + overflow), so `window.scrollTo` alone is unreliable — use `scrollIntoView` / the existing `scrollToTop` helper that sets all three scroll targets.
- Clean URL paths (no hash for the page itself): `/`, `/about`, `/capabilities`, `/our-work`, `/contact`, `/privacy`, `/terms`. Capability deep-links use a hash suffix, e.g. `/capabilities#project-management`.
- Palette tokens live in `src/styles/theme.css` (`--navy`, `--gold`, `--red`, `--cream`, `--muted-ink`). Reuse them; do not hardcode hex in components.
- Commit after each task with a `feat:`/`fix:` message. Work stays on branch `feat/site-fixes-routing-legal`.

---

## File Structure

| File | Responsibility | Tasks |
|------|----------------|-------|
| `src/app/useRoute.ts` (new) | Path ⇆ page mapping, `navigate`, `popstate` handling | 1, 7 |
| `src/app/App.tsx` | Consume router; deep-link scroll skip; privacy/terms cases | 1, 2, 7 |
| `src/app/components/Nav.tsx` | `Page` type (source of truth) | 1, 7 |
| `src/app/components/pages/Services.tsx` | Scroll to capability box on deep-link | 2 |
| `index.html` | Viewport meta (gesture lock) | 3 |
| `src/styles/theme.css` | Overscroll/pinch lock; (no new stats classes needed) | 3 |
| `src/app/components/pages/Contact.tsx` | Single-select project type; collapsible note | 4, 5 |
| `api/contact.ts` | Single project type; optional message | 4, 5 |
| `src/app/components/pages/Home.tsx` | Stats strip restyle + slower counter | 6 |
| `src/app/components/pages/Privacy.tsx` (new) | Privacy Policy page | 7 |
| `src/app/components/pages/Terms.tsx` (new) | Terms of Service page | 7 |
| `src/app/components/Footer.tsx` | Privacy/Terms footer links | 7 |

---

## Task 1: Minimal history router

Replace state-only navigation with a URL-backed router so refresh keeps the page (spec §Routing, tasks #2 & #5).

**Files:**
- Create: `src/app/useRoute.ts`
- Modify: `src/app/App.tsx` (full rewrite below)

**Interfaces:**
- Produces: `useRoute(): { page: Page; category?: string; navigate: (p: Page, opts?: { category?: string }) => void }`. The `navigate` signature is identical to the old `App` `navigate`, so `Nav`, `Footer`, `QuickReach`, `Home`, `Services` need no prop changes.
- Consumes: `Page` type from `./components/Nav`.

- [ ] **Step 1: Create the router hook**

Create `src/app/useRoute.ts`:

```ts
import { useCallback, useEffect, useState } from "react";
import type { Page } from "./components/Nav";

// Single source of truth: page -> clean URL path.
// (Tasks add privacy/terms in Task 7; keep these five for now.)
const PATHS: Record<Page, string> = {
  home: "/",
  about: "/about",
  services: "/capabilities",
  contract: "/our-work",
  contact: "/contact",
};

const PAGE_BY_PATH = Object.fromEntries(
  Object.entries(PATHS).map(([page, path]) => [path, page as Page])
) as Record<string, Page>;

export type RouteState = { page: Page; category?: string };

function parseLocation(): RouteState {
  // Normalize: strip trailing slashes, default to "/".
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = PAGE_BY_PATH[path] ?? "home";
  const hash = window.location.hash ? window.location.hash.slice(1) : "";
  return { page, category: hash || undefined };
}

export function useRoute() {
  const [route, setRoute] = useState<RouteState>(() => parseLocation());

  const navigate = useCallback((page: Page, opts?: { category?: string }) => {
    const category = opts?.category;
    const url = PATHS[page] + (category ? `#${category}` : "");
    window.history.pushState({ page, category }, "", url);
    setRoute({ page, category });
  }, []);

  // Back/forward buttons + iPhone edge-swipe fire popstate.
  useEffect(() => {
    const onPop = () => setRoute(parseLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return { page: route.page, category: route.category, navigate };
}
```

- [ ] **Step 2: Rewrite `App.tsx` to consume the router**

Replace the entire contents of `src/app/App.tsx` with:

```tsx
import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { QuickReach } from "./components/QuickReach";
import { Home } from "./components/pages/Home";
import { About } from "./components/pages/About";
import { Services } from "./components/pages/Services";
import { ContractVehicles } from "./components/pages/ContractVehicles";
import { Contact } from "./components/pages/Contact";
import { useRoute } from "./useRoute";

// This app's scroll container is the <body> (the html/body height:100% +
// overflow setup makes the body itself scroll, not the window), so a plain
// window.scrollTo is a no-op. Reset every candidate to guarantee the top.
function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function App() {
  const { page, category, navigate } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);

  // On first load / refresh, don't restore the previous scroll position —
  // always begin at the top.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    scrollToTop();
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home setPage={navigate} />;
      case "about":
        return <About setPage={navigate} />;
      case "services":
        return <Services activeCategory={category} setPage={navigate} />;
      case "contract":
        return <ContractVehicles />;
      case "contact":
        return <Contact />;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper text-ink font-sans">
        <Nav page={page} setPage={navigate} open={menuOpen} setOpen={setMenuOpen} />

        {/* mode="wait": the current page fully fades out, THEN we snap to the
            top (onExitComplete), THEN the next page fades up from there. */}
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          <motion.main
            key={`${page}:${category ?? ""}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {renderPage()}
          </motion.main>
        </AnimatePresence>

        <QuickReach setPage={navigate} />
        <Footer setPage={navigate} />
      </div>
    </MotionConfig>
  );
}
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: build succeeds, no TypeScript errors.

- [ ] **Step 4: Preview-verify routing**

Run `pnpm dev`. In the preview browser:
- Click nav → "About Us": URL becomes `/about`, About page shows.
- Refresh: still on `/about` (not home).
- Browser Back: returns to `/` (home). Forward: returns to `/about`.
- Click "Capabilities": URL `/capabilities`.

Expected: URL reflects the page; refresh stays; back/forward traverse pages.

- [ ] **Step 5: Commit**

```bash
git add src/app/useRoute.ts src/app/App.tsx
git commit -m "feat: add history-based router with per-page URLs and back/forward"
```

---

## Task 2: Capability deep-link scroll fix

Make the Home capability cards and the Services 01/02/03 index pills scroll to the matching section instead of the top (spec §Capability deep-link, task #7).

**Files:**
- Modify: `src/app/App.tsx` (the `onExitComplete` handler)
- Modify: `src/app/components/pages/Services.tsx:14-20` (scroll effect) and `:77` (scroll-margin)

**Interfaces:**
- Consumes: `page`, `category` from `useRoute()` (Task 1); the `refs` map in `Services.tsx`.

- [ ] **Step 1: Skip the top-scroll when deep-linking to a category**

In `src/app/App.tsx`, replace `onExitComplete={scrollToTop}` with a handler that lets the Services page own the scroll when a category is targeted:

```tsx
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            // When deep-linking to a capability, Services scrolls to the box
            // itself — don't clobber it by snapping to the top.
            if (page === "services" && category) return;
            scrollToTop();
          }}
        >
```

- [ ] **Step 2: Make Services scroll to the box reliably**

In `src/app/components/pages/Services.tsx`, replace the existing effect (lines 14-20):

```tsx
  useEffect(() => {
    if (activeCategory && refs.current[activeCategory]) {
      const el = refs.current[activeCategory]!;
      const top = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [activeCategory]);
```

with a version that waits for the enter transition/layout to settle and uses
`scrollIntoView` (which finds the real scroll container and respects
`scroll-margin-top`, unlike `window.scrollTo` on a body-scrolled page):

```tsx
  useEffect(() => {
    if (!activeCategory) return;
    const el = refs.current[activeCategory];
    if (!el) return;
    // Defer so the page-enter transition and layout have settled before we
    // measure/scroll, otherwise the target moves out from under us.
    const id = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(id);
  }, [activeCategory]);
```

- [ ] **Step 3: Increase the section scroll-margin for the sticky header + index**

In `src/app/components/pages/Services.tsx`, in the category section wrapper
`className` (currently contains `scroll-mt-32`), change `scroll-mt-32` to
`scroll-mt-[150px] md:scroll-mt-[210px]` so the box lands below the sticky
header (72/120px) and the sticky category index bar.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: succeeds, no TypeScript errors.

- [ ] **Step 5: Preview-verify deep-link scroll**

In the preview:
- From Home, click the **second** capability card ("Project Management"): lands on `/capabilities#project-management`, scrolled to that section (not the page top).
- On the Capabilities page, click index pill **03**: scrolls to the third section.
- Navigate to Capabilities via the top nav (no category): lands at the top.

Expected: deep-links land on the correct box; plain navigation lands at top.

- [ ] **Step 6: Commit**

```bash
git add src/app/App.tsx src/app/components/pages/Services.tsx
git commit -m "fix: capability deep-links scroll to the section instead of page top"
```

---

## Task 3: Lock down iPhone gestures

Block pinch-zoom and the white-background overscroll (spec §Mobile gesture lock, task #6).

**Files:**
- Modify: `index.html:5` (viewport meta)
- Modify: `src/styles/theme.css` (the `html` and `body` base rules, lines ~111-131)

- [ ] **Step 1: Disable user scaling in the viewport meta**

In `index.html`, replace line 5:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

with:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

- [ ] **Step 2: Stop overscroll showing white + block pinch-zoom**

In `src/styles/theme.css`, update the `html` base rule (currently lines ~111-118) to add `overscroll-behavior`, a non-white background, and `touch-action`:

```css
  html {
    font-size: var(--font-size);
    scroll-behavior: smooth;
    /* Stop iOS Safari from inflating text on rotation, and kill sideways scroll */
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    overflow-x: hidden;
    /* No rubber-band white flash, and no pinch-zoom (vertical scroll stays) */
    overscroll-behavior: none;
    touch-action: pan-y;
    background: var(--paper);
  }
```

Then update the `body` base rule (currently lines ~120-131) to also prevent overscroll chaining:

```css
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--font-sans);
    font-weight: 300;
    font-size: var(--text-body);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
    max-width: 100%;
    overscroll-behavior: none;
  }
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 4: Preview-verify on mobile emulation**

In the preview, set a mobile device (e.g. iPhone) viewport:
- Attempt pinch-zoom: page does not zoom.
- Scroll past the top/bottom edge: no white background is revealed (paper background shows).
- Vertical scrolling still works normally.

Expected: pinch-zoom blocked, no white overscroll, vertical scroll intact.

- [ ] **Step 5: Commit**

```bash
git add index.html src/styles/theme.css
git commit -m "fix: block iPhone pinch-zoom and white overscroll"
```

---

## Task 4: Contact project type → single-select

Convert the multi-select toggle to single-select and fix the iPhone tap glitch (spec §Single-select, task #1). Also update the API payload.

**Files:**
- Modify: `src/app/components/pages/Contact.tsx` (state + the "Project type" block + submit body)
- Modify: `api/contact.ts` (`Submission` type, body parse, email rendering)

**Interfaces:**
- Produces: POST body now sends `projectType: string` (single) instead of `projectTypes: string[]`.

- [ ] **Step 1: Switch Contact state to a single value**

In `src/app/components/pages/Contact.tsx`:

Replace line 13:

```tsx
  const [selectedTypes, setSelectedTypes] = useState<string[]>([projectTypes[0]]);
```

with:

```tsx
  const [selectedType, setSelectedType] = useState<string>(projectTypes[0]);
```

Replace the `toggleType` function (lines 27-30):

```tsx
  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
```

with:

```tsx
  const selectType = (t: string) => setSelectedType(t);
```

In `resetForm` (lines 32-36), replace `setSelectedTypes([projectTypes[0]]);` with `setSelectedType(projectTypes[0]);`.

- [ ] **Step 2: Send a single project type in the submit body**

In `handleSubmit`, replace the `body` line (line 46):

```tsx
        body: JSON.stringify({ ...form, projectTypes: selectedTypes }),
```

with:

```tsx
        body: JSON.stringify({ ...form, projectType: selectedType }),
```

- [ ] **Step 3: Render the pills as single-select radios (and kill the tap glitch)**

Replace the "Project type" block (lines 176-193) with:

```tsx
                <div>
                  <label className="eyebrow block mb-3">Project type</label>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project type">
                    {projectTypes.map((t) => {
                      const active = selectedType === t;
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          key={t}
                          onClick={() => selectType(t)}
                          style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                          className={`pill ${active ? "pill-primary" : "pill-ghost"} !py-2 !px-4 text-sm`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
```

- [ ] **Step 4: Update the API to accept a single project type**

In `api/contact.ts`:

Change the `Submission` type (lines 37-43) field `projectTypes: string[];` to `projectType: string;`.

Replace the body parse (lines 235-237):

```ts
  const projectTypes = Array.isArray(body.projectTypes)
    ? body.projectTypes.map((t: unknown) => String(t)).filter(Boolean)
    : [];
```

with (accept the new single field, fall back to the old array for safety):

```ts
  const projectType = String(
    body.projectType ||
      (Array.isArray(body.projectTypes) ? body.projectTypes.join(", ") : "")
  ).trim();
```

Update the `submission` object (line 259) from `{ name, email, company, projectTypes, message }` to `{ name, email, company, projectType, message }`.

In `confirmationEmail` (line 138) replace `escapeHtml(s.projectTypes.join(", ") || "—")` with `escapeHtml(s.projectType || "—")`.

In `notificationEmail` (line 189) replace `escapeHtml(s.projectTypes.join(", ") || "—")` with `escapeHtml(s.projectType || "—")`.

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: succeeds, no TypeScript errors (no remaining references to `selectedTypes` or `s.projectTypes`).

- [ ] **Step 6: Preview-verify single-select**

On `/contact`:
- Tap "Project Management": it becomes active and any previously active pill deactivates.
- Only ever one pill is active. Rapid taps on mobile emulation don't select multiple or trigger zoom.

Expected: exactly one project type selectable.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/pages/Contact.tsx api/contact.ts
git commit -m "feat: make contact project type single-select and fix iPhone tap glitch"
```

---

## Task 5: Contact collapsible "Note" + optional message

Hide the message behind a "+ Add a note" button; make the message optional end-to-end (spec §Note dropdown, task #8).

**Files:**
- Modify: `src/app/components/pages/Contact.tsx` (note state + the message block + submit copy)
- Modify: `api/contact.ts` (drop the required-message validation)

**Interfaces:**
- Consumes: existing `form.message` + `update("message")` from Contact.

- [ ] **Step 1: Add note-open state**

In `src/app/components/pages/Contact.tsx`, add to the component state (right after the `selectedType` line from Task 4):

```tsx
  const [noteOpen, setNoteOpen] = useState(false);
```

In `resetForm`, add `setNoteOpen(false);` so a reset re-collapses the note.

- [ ] **Step 2: Replace the always-on textarea with a collapsible note**

Replace the message block (the `<div>` containing `Tell us about the project`, lines 195-205) with:

```tsx
                <div>
                  {!noteOpen ? (
                    <button
                      type="button"
                      onClick={() => setNoteOpen(true)}
                      style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                      className="pill pill-ghost !py-2 !px-4 text-sm"
                    >
                      + Add a note
                    </button>
                  ) : (
                    <div className="fade-up">
                      <label className="eyebrow block mb-3">Note</label>
                      <textarea
                        rows={5}
                        autoFocus
                        value={form.message}
                        onChange={update("message")}
                        placeholder="Tell us about the project. A paragraph is plenty. Links welcome."
                        className="w-full bg-cream border border-border p-4 outline-none focus:border-navy transition-colors resize-none"
                      />
                    </div>
                  )}
                </div>
```

(Note: the `required` attribute is removed — the note is optional.)

- [ ] **Step 3: Update the helper copy under the submit button**

The line "We reply to every note, usually within 48 hours." (line 217-219) stays accurate — no change needed.

- [ ] **Step 4: Make the API treat message as optional**

In `api/contact.ts`, replace the required-fields check (lines 239-243):

```ts
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please add your name, email, and a short message." });
  }
```

with (message no longer required):

```ts
  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Please add your name and email." });
  }
```

The email templates already fall back to "—"/empty for the message; the
`white-space:pre-wrap` blocks render an empty string harmlessly.

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 6: Preview-verify the note dropdown**

On `/contact`:
- The textarea is hidden; a "+ Add a note" button shows.
- Click it: the labelled "Note" textarea appears and is focused.
- Fill name + email, leave the note closed, submit: the form submits successfully (success state shows) — no validation block on the message.

Expected: note is collapsed by default, expands on click, and the form submits without it.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/pages/Contact.tsx api/contact.ts
git commit -m "feat: collapsible optional Note field on the contact form"
```

---

## Task 6: Home stats strip restyle + slower counter

Slow the count-up, restyle the stats strip, and remove bold — stats strip only (spec §Stats strip, task #4).

**Files:**
- Modify: `src/app/components/pages/Home.tsx` (the `StatsStrip` render, lines ~266-289)

- [ ] **Step 1: Restyle the numbers and slow the count**

In `src/app/components/pages/Home.tsx`, replace the `StatsStrip` return body's
inner `.map` cell (lines 269-285) with a stacked, lighter, larger treatment that
removes the bold weight and passes a longer `duration`:

```tsx
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`count-rise px-6 py-10 text-center ${visible ? "is-visible" : ""}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span
              className="block font-serif text-navy tabular-nums"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              <CountUp target={s.value} run={visible} duration={2600} />
              <span style={{ color: "var(--gold)" }}>{s.suffix}</span>
            </span>
            <span className="mt-3 block eyebrow text-muted-ink">{s.label}</span>
          </div>
        ))}
```

Note: this removes `font-semibold` (the bold), drops the inline `fontWeight: 800`
path by overriding it to `300`, enlarges the numerals, tints the suffix gold,
moves the label beneath as an eyebrow, and slows the animation from 1400ms to
2600ms via the `duration` prop.

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 3: Preview-verify the stats strip**

On `/` (home), scroll to the stats band ("15+ Years Experience", etc.):
- Numbers are large, light-weight (not bold), navy with a gold suffix, label beneath.
- The count animation is visibly slower than before (~2.6s).

Expected: restyled, un-bolded, slower counter; rest of the site unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/pages/Home.tsx
git commit -m "feat: restyle home stats strip, remove bold, slow the counter"
```

---

## Task 7: Privacy & Terms pages

Add drafted Privacy Policy and Terms of Service pages, route them, and link them in the footer (spec §Privacy & Terms, task #3).

**Files:**
- Modify: `src/app/components/Nav.tsx:5` (`Page` type — add `"privacy" | "terms"`)
- Modify: `src/app/useRoute.ts` (`PATHS` — add privacy/terms)
- Create: `src/app/components/pages/Privacy.tsx`
- Create: `src/app/components/pages/Terms.tsx`
- Modify: `src/app/App.tsx` (imports + render cases)
- Modify: `src/app/components/Footer.tsx` (legal links row)

**Interfaces:**
- Consumes: `navigate` (as `setPage`) from `App`.
- Produces: `Page` now includes `"privacy"` and `"terms"`; `PATHS` maps them to `/privacy` and `/terms`.

- [ ] **Step 1: Extend the `Page` type**

In `src/app/components/Nav.tsx`, change line 5:

```tsx
type Page = "home" | "about" | "services" | "contract" | "contact";
```

to:

```tsx
type Page = "home" | "about" | "services" | "contract" | "contact" | "privacy" | "terms";
```

- [ ] **Step 2: Add routes to the router**

In `src/app/useRoute.ts`, extend the `PATHS` map:

```ts
const PATHS: Record<Page, string> = {
  home: "/",
  about: "/about",
  services: "/capabilities",
  contract: "/our-work",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
};
```

- [ ] **Step 3: Create the Privacy page**

Create `src/app/components/pages/Privacy.tsx`:

```tsx
const EFFECTIVE_DATE = "June 21, 2026";

export function Privacy() {
  return (
    <div className="fade-up">
      <section className="bg-paper">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow">Legal</span>
          </div>
          <h1 className="font-serif">
            Privacy <em className="italic text-navy">Policy.</em>
          </h1>
          <p className="mt-4 text-ink/60 text-sm">Effective {EFFECTIVE_DATE}</p>
          <p className="mt-4 text-ink/60 text-sm">
            This document is a working draft provided for review and is pending
            final legal counsel. It is not yet legal advice.
          </p>
        </div>
      </section>

      <section className="bg-cream border-t border-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-16 space-y-10">
          <Block title="Who we are">
            Kaizen Project Management and Consulting, LLC ("Kaizen," "we," "us,"
            or "our") is a project and program management consulting firm based in
            Virginia, United States. This Privacy Policy explains how we collect,
            use, and protect information when you visit kaizenpmconsulting.com (the
            "Site") or contact us.
          </Block>

          <Block title="Information we collect">
            We collect the information you choose to provide through our contact
            form: your name, email address, company or agency name, the project
            type you select, and any message you send. We do not ask for or
            intentionally collect sensitive personal information. We do not sell
            personal information.
          </Block>

          <Block title="How we use your information">
            We use your information solely to respond to your inquiry, communicate
            with you about a potential or existing engagement, and keep a record of
            our correspondence. We do not use it for advertising or share it with
            third parties for their own marketing.
          </Block>

          <Block title="Email processing">
            Contact form submissions are delivered to us and acknowledged to you by
            email through Resend (resend.com), our email delivery provider, acting
            as a processor on our behalf. Your message is transmitted to Resend
            only to deliver these emails.
          </Block>

          <Block title="Cookies and analytics">
            The Site does not set advertising cookies. If we use privacy-respecting
            analytics to understand aggregate, non-identifying usage, that data is
            not used to identify individual visitors.
          </Block>

          <Block title="Data retention">
            We keep contact correspondence for as long as needed to serve you and
            to meet legal, accounting, or reporting obligations, after which it is
            deleted or anonymized.
          </Block>

          <Block title="Your rights">
            You may ask us to access, correct, or delete the personal information
            you have provided. To make a request, email us at the address below and
            we will respond within a reasonable time.
          </Block>

          <Block title="Security">
            We take reasonable technical and organizational measures to protect your
            information. No method of transmission over the Internet is completely
            secure, however, and we cannot guarantee absolute security.
          </Block>

          <Block title="Governing law">
            This Policy is governed by the laws of the Commonwealth of Virginia,
            United States, without regard to its conflict-of-laws principles.
          </Block>

          <Block title="Changes to this policy">
            We may update this Policy from time to time. The effective date above
            reflects the most recent revision.
          </Block>

          <Block title="Contact">
            Questions about this Policy? Email{" "}
            <a className="text-navy underline" href="mailto:contract@kaizenpmconsulting.com">
              contract@kaizenpmconsulting.com
            </a>{" "}
            or call +1 571-293-0418.
          </Block>
        </div>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-navy mb-3">{title}</h2>
      <p className="text-ink/80 leading-relaxed">{children}</p>
    </div>
  );
}
```

- [ ] **Step 4: Create the Terms page**

Create `src/app/components/pages/Terms.tsx`:

```tsx
const EFFECTIVE_DATE = "June 21, 2026";

export function Terms() {
  return (
    <div className="fade-up">
      <section className="bg-paper">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow">Legal</span>
          </div>
          <h1 className="font-serif">
            Terms of <em className="italic text-navy">Service.</em>
          </h1>
          <p className="mt-4 text-ink/60 text-sm">Effective {EFFECTIVE_DATE}</p>
          <p className="mt-4 text-ink/60 text-sm">
            This document is a working draft provided for review and is pending
            final legal counsel. It is not yet legal advice.
          </p>
        </div>
      </section>

      <section className="bg-cream border-t border-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-16 space-y-10">
          <Block title="Acceptance of these terms">
            By accessing kaizenpmconsulting.com (the "Site"), you agree to these
            Terms of Service. If you do not agree, please do not use the Site.
          </Block>

          <Block title="About the Site">
            The Site is operated by Kaizen Project Management and Consulting, LLC, a
            Virginia limited liability company. It provides information about our
            project management, program management, and consulting services.
          </Block>

          <Block title="Informational purpose only">
            Content on the Site is provided for general information. It does not
            constitute professional, legal, or financial advice, and it does not
            create a consulting relationship. Any engagement is governed by a
            separate written agreement between you and Kaizen.
          </Block>

          <Block title="Acceptable use">
            You agree not to misuse the Site — including attempting to gain
            unauthorized access, disrupting its operation, scraping it at scale, or
            submitting unlawful, misleading, or harmful content through the contact
            form.
          </Block>

          <Block title="Intellectual property">
            The Site and its content — including text, graphics, logos, and the
            Kaizen name and marks — are owned by or licensed to Kaizen and are
            protected by applicable law. You may not reproduce or reuse them without
            our prior written permission.
          </Block>

          <Block title="Third-party links">
            The Site may link to third-party websites for convenience. We are not
            responsible for the content, policies, or practices of those sites.
          </Block>

          <Block title="Disclaimer of warranties">
            The Site is provided "as is" and "as available" without warranties of
            any kind, whether express or implied, including fitness for a particular
            purpose and non-infringement, to the fullest extent permitted by law.
          </Block>

          <Block title="Limitation of liability">
            To the fullest extent permitted by law, Kaizen will not be liable for
            any indirect, incidental, or consequential damages arising from your use
            of the Site.
          </Block>

          <Block title="Governing law">
            These Terms are governed by the laws of the Commonwealth of Virginia,
            United States, without regard to its conflict-of-laws principles.
          </Block>

          <Block title="Changes to these terms">
            We may revise these Terms from time to time. The effective date above
            reflects the most recent revision, and continued use of the Site
            constitutes acceptance of the current Terms.
          </Block>

          <Block title="Contact">
            Questions about these Terms? Email{" "}
            <a className="text-navy underline" href="mailto:contract@kaizenpmconsulting.com">
              contract@kaizenpmconsulting.com
            </a>{" "}
            or call +1 571-293-0418.
          </Block>
        </div>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-navy mb-3">{title}</h2>
      <p className="text-ink/80 leading-relaxed">{children}</p>
    </div>
  );
}
```

- [ ] **Step 5: Wire the pages into `App.tsx`**

In `src/app/App.tsx`, add imports after the `Contact` import:

```tsx
import { Privacy } from "./components/pages/Privacy";
import { Terms } from "./components/pages/Terms";
```

Add two cases to the `renderPage` switch, after the `contact` case:

```tsx
      case "privacy":
        return <Privacy />;
      case "terms":
        return <Terms />;
```

- [ ] **Step 6: Add footer legal links**

In `src/app/components/Footer.tsx`, replace the bottom bar block (lines 111-118):

```tsx
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-ink/55">
            © 2024 Kaizen Project Management and Consulting, LLC. All rights reserved.
          </p>
          <p className="eyebrow text-ink/70">SAM.gov Registered</p>
        </div>
      </div>
```

with a version that adds Privacy/Terms buttons:

```tsx
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-ink/55">
            © 2024 Kaizen Project Management and Consulting, LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setPage("privacy")}
              className="text-ink/70 transition-colors hover:text-red"
            >
              Privacy
            </button>
            <button
              onClick={() => setPage("terms")}
              className="text-ink/70 transition-colors hover:text-red"
            >
              Terms
            </button>
            <span className="eyebrow text-ink/70">SAM.gov Registered</span>
          </div>
        </div>
      </div>
```

- [ ] **Step 7: Build**

Run: `pnpm build`
Expected: succeeds, no TypeScript errors (the `Page` union now includes privacy/terms everywhere it's used).

- [ ] **Step 8: Preview-verify the legal pages**

In the preview:
- Footer shows "Privacy" and "Terms"; clicking "Privacy" goes to `/privacy` and renders the policy; "Terms" goes to `/terms`.
- Refresh on `/privacy`: stays on the privacy page.
- Back button returns to the previous page.

Expected: both pages render, are routed at clean URLs, refresh-stable, and linked from the footer.

- [ ] **Step 9: Commit**

```bash
git add src/app/components/Nav.tsx src/app/useRoute.ts src/app/App.tsx src/app/components/Footer.tsx src/app/components/pages/Privacy.tsx src/app/components/pages/Terms.tsx
git commit -m "feat: add drafted Privacy and Terms pages with routing and footer links"
```

---

## Final verification

- [ ] Run `pnpm build` once more — clean build.
- [ ] Full preview pass against the spec's testing checklist: refresh-stable pages, back/forward, deep-link scroll, single-select, optional note, slower restyled counter, mobile gesture lock, privacy/terms pages.
- [ ] Confirm no leftover references to `selectedTypes` or `s.projectTypes`:
  `grep -rn "selectedTypes\|projectTypes" src api` should return only the
  backward-compat fallback in `api/contact.ts`.

## Self-review notes (author)

- Spec coverage: task #1→Task 4; #2→Task 1; #3→Task 7; #4→Task 6; #5→Task 1; #6→Task 3; #7→Task 2; #8→Task 5. All eight covered.
- Conflict resolved: `api/contact.ts` previously required `message`; Task 5 removes that so the optional note doesn't block submission.
- Type consistency: `navigate(page, opts?)` signature matches the old `App` prop, so `Nav`/`Footer`/`QuickReach`/`Home`/`Services` props are unchanged; `Page` union extended in one place (`Nav.tsx`) and mirrored in `useRoute` `PATHS` (a `Record<Page, string>`, so a missing entry would be a compile error — caught by Step 7).
