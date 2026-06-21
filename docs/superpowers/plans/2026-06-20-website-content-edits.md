# Website Content Edits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a batch of content, labeling, and layout edits across Nav, QuickReach, Footer, About, Capabilities, Our Work, and Home pages of the Kaizen React/Vite site.

**Architecture:** All pages are single-file React components under `src/app/components/pages/`. Shared data lives in `src/app/services.ts`. No routing library — page switching is prop-drilled state. All changes are text/JSX edits in existing files; no new files needed except moving the image asset import.

**Tech Stack:** React 18, TypeScript, Vite 6, Tailwind CSS v4, lucide-react icons

---

## File Map

| File | Changes |
|------|---------|
| `src/app/components/Nav.tsx` | Remove "Home" from menu; rename "Projects" → "Our Work" |
| `src/app/components/QuickReach.tsx` | Rename heading "Six Disciplines" → "Our Expertise"; add Contact link at bottom |
| `src/app/components/Footer.tsx` | Remove tagline; reorder columns (Explore, Contact, NAICS, Logo); fix NAICS spacing; wrap email |
| `src/app/components/pages/About.tsx` | Update Vision/Mission/Philosophy body text; replace image import (flag → Kaizen-Option-C.jpg); remove capabilities boxes 01/02/03 |
| `src/app/services.ts` | Update all three service `short`, `long`, and `bullets` fields |
| `src/app/components/pages/Services.tsx` | Update page header copy to drop "Six disciplines" |
| `src/app/components/pages/ContractVehicles.tsx` | Remove intro paragraph; remove entire Federal Projects section |
| `src/app/components/pages/Home.tsx` | Capabilities cards: add description sentence, remove "Learn more", keep arrow only, center text |

---

### Task 1: Nav — remove Home link, rename Projects → Our Work

**Files:**
- Modify: `src/app/components/Nav.tsx:7-13`

- [ ] **Step 1: Edit the links array**

Replace the `links` array (lines 7–13) with:

```tsx
const links: { id: Page; label: string; index: string }[] = [
  { id: "about", label: "About Us", index: "01" },
  { id: "services", label: "Capabilities", index: "02" },
  { id: "contract", label: "Our Work", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
];
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:5173, click Menu. Confirm "Home" is gone, "Our Work" appears, logo still navigates home.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Nav.tsx
git commit -m "feat: remove Home nav link, rename Projects to Our Work"
```

---

### Task 2: Footer — rename Projects → Our Work in navLinks

**Files:**
- Modify: `src/app/components/Footer.tsx:5-11`

- [ ] **Step 1: Update navLinks array**

Replace the `navLinks` array (lines 5–11) with:

```tsx
const navLinks: { id: Page; label: string }[] = [
  { id: "about", label: "About Us" },
  { id: "services", label: "Capabilities" },
  { id: "contract", label: "Our Work" },
  { id: "contact", label: "Contact" },
];
```

(Home is intentionally removed from footer Explore list to match Nav.)

- [ ] **Step 2: Verify**

Footer "Explore" column should now list: About Us, Capabilities, Our Work, Contact.

---

### Task 3: Footer — reorder columns, remove tagline, fix NAICS, wrap email

**Files:**
- Modify: `src/app/components/Footer.tsx:13-115`

- [ ] **Step 1: Replace the entire Footer JSX**

Replace the full `Footer` function with:

```tsx
export function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-paper text-ink border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid md:grid-cols-12 gap-10">

        {/* Column 1: Explore */}
        <div className="md:col-span-2">
          <p className="eyebrow text-ink/60 mb-4">Explore</p>
          <ul className="space-y-2">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => setPage(l.id)}
                  className="group relative inline-flex items-center gap-3 text-ink/85 transition-colors hover:text-red"
                >
                  <span className="h-px w-0 bg-red transition-all duration-500 group-hover:w-6" />
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Contact */}
        <div className="md:col-span-3">
          <p className="eyebrow text-ink/60 mb-4">Contact</p>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:contract@kaizenpmconsulting.com"
                className="group inline-flex items-start gap-3 text-ink/85 transition-colors hover:text-red"
              >
                <Mail size={18} className="shrink-0 mt-0.5" />
                <span className="break-all">contract@<wbr />kaizenpmconsulting.com</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+15712930418"
                className="group inline-flex items-center gap-3 text-ink/85 transition-colors hover:text-red"
              >
                <Phone size={18} className="shrink-0" />
                <span>+1 571-293-0418</span>
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-ink/85">
              <MapPin size={18} className="shrink-0" />
              <span>Virginia, United States</span>
            </li>
          </ul>
        </div>

        {/* Column 3: NAICS Codes */}
        <div className="md:col-span-3">
          <p className="eyebrow text-ink/60 mb-4">NAICS Codes</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-ink/85 font-serif text-sm">
            {[
              "541618",
              "541611",
              "541512",
              "541513",
              "541519",
              "541690",
              "541330",
              "541990",
              "611430",
              "561110",
              "541614",
            ].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Column 4: Logo */}
        <div className="md:col-span-4">
          <button
            onClick={() => setPage("home")}
            className="flex items-center mb-6 group"
          >
            <img
              src={footerLogo}
              alt="Kaizen"
              className="h-32 md:h-40 w-auto object-contain transition-transform duration-500 group-hover:translate-x-1"
            />
          </button>
          <div className="mt-8 flex items-center gap-3">
            <span className="rule-red" />
            <span className="eyebrow text-ink/80">Est. 2024 — Virginia</span>
          </div>
        </div>

      </div>

      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-ink/55 text-sm">
            © 2024 Kaizen Project Management and Consulting, LLC. All rights reserved.
          </p>
          <p className="eyebrow text-ink/70">SAM.gov Registered</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

Footer column order: Explore → Contact → NAICS → Logo. Email wraps cleanly. NAICS codes have tighter column spacing.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Footer.tsx
git commit -m "feat: reorder footer columns, remove tagline, improve email and NAICS layout"
```

---

### Task 4: QuickReach — rename heading, add Contact link

**Files:**
- Modify: `src/app/components/QuickReach.tsx:47-75`

- [ ] **Step 1: Replace the panel content**

Replace lines 47–75 (the `<div className="p-6 w-[320px]">` block) with:

```tsx
          <div className="p-6 w-[320px] flex flex-col h-full">
            <p
              className="eyebrow mb-4"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Our Expertise
            </p>
            <ul className="space-y-3 flex-1">
              {services.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setPage("services", { category: s.id });
                      setOpen(false);
                      onOpen?.();
                    }}
                    className="w-full text-left flex items-baseline gap-3 group"
                  >
                    <span className="text-paper/40 text-xs w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-paper/90 group-hover:text-red transition-colors">
                      {s.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  setPage("contact");
                  setOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 group"
              >
                <span className="text-paper/60 text-xs eyebrow">Contact Us</span>
                <span className="ml-auto text-paper/60 group-hover:text-red transition-colors">→</span>
              </button>
            </div>
          </div>
```

- [ ] **Step 2: Verify**

Click the Quick Reach tab on the right side. Heading should say "Our Expertise". A "Contact Us →" link appears at the bottom.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/QuickReach.tsx
git commit -m "feat: rename Quick Reach heading to Our Expertise, add contact link"
```

---

### Task 5: services.ts — update all three service entries

**Files:**
- Modify: `src/app/services.ts`

- [ ] **Step 1: Replace the entire services array**

Replace everything in `src/app/services.ts` with:

```ts
export type ServiceCategory = {
  id: string;
  title: string;
  short: string;
  long: string;
  bullets: string[];
};

export const services: ServiceCategory[] = [
  {
    id: "strategic-consulting",
    title: "Strategy Consulting",
    short:
      "We help federal and corporate leaders frame the right questions, then shape strategies, operating models, and roadmaps that deliver business value.",
    long: "We help federal and corporate leaders frame the right questions, then shape strategies, operating models, and roadmaps that deliver business value.",
    bullets: [
      "Enterprise Solutioning",
      "Executive Planning",
      "Operational Efficiency",
      "Portfolio-level Risk Management",
    ],
  },
  {
    id: "project-management",
    title: "Project Management",
    short:
      "Kaizen provides expert end-to-end project and program management, delivering desired outcomes to clients through excellence, integrity, and transparency.",
    long: "Kaizen provides expert end-to-end project and program management, delivering desired outcomes to clients through excellence, integrity, and transparency.",
    bullets: [
      "Delivery Excellence",
      "Process and Lifecycle Engineering",
      "Agile/Waterfall/Hybrid Methodology",
      "Project Management Skills Training",
    ],
  },
  {
    id: "it-modernization",
    title: "IT Modernization",
    short:
      "Our goal is to help customers achieve a competitive edge in technology advancement by providing seamless integration of systems and platforms — securely and at scale.",
    long: "Our goal is to help customers achieve a competitive edge in technology advancement by providing seamless integration of systems and platforms — securely and at scale.",
    bullets: [
      "Digital Transformation",
      "Software Implementation",
      "AI Integration",
      "Change Management",
    ],
  },
];
```

- [ ] **Step 2: Verify**

Navigate to Capabilities page — all three service titles, descriptions, and bullet lists should reflect the new content.

- [ ] **Step 3: Commit**

```bash
git add src/app/services.ts
git commit -m "feat: update service descriptions and bullets for all three capabilities"
```

---

### Task 6: Services page — update header copy

**Files:**
- Modify: `src/app/components/pages/Services.tsx:32-36`

- [ ] **Step 1: Replace the h1 in the header section**

Find lines 32–36:
```tsx
            <h1 className="font-serif">
              Six disciplines,
              <em className="italic text-navy"> delivered with editorial precision.</em>
            </h1>
```

Replace with:
```tsx
            <h1 className="font-serif">
              Our capabilities,
              <em className="italic text-navy"> delivered with precision.</em>
            </h1>
```

- [ ] **Step 2: Verify**

Capabilities page header should no longer say "Six disciplines".

- [ ] **Step 3: Commit**

```bash
git add src/app/components/pages/Services.tsx
git commit -m "feat: update capabilities page header copy"
```

---

### Task 7: About page — update Vision / Mission / Philosophy text

**Files:**
- Modify: `src/app/components/pages/About.tsx:8-27`

- [ ] **Step 1: Replace the tabs array**

Replace lines 8–27 (the `tabs` array) with:

```tsx
const tabs: { id: TabId; label: string; body: string | string[] }[] = [
  {
    id: "vision",
    label: "Vision",
    body: [
      "Kaizen Project Management and Consulting, LLC strives to be a trusted partner for federal agencies and commercial organizations seeking delivery excellence and long-lasting, reliable partnerships.",
      "Our team features senior-level experts with decades of government and private industry experience. Their expertise and integrity form the cornerstones of successful project delivery in the DC metropolitan area and beyond.",
      "Guided by innovative strategies and a relentless pursuit of excellence, Kaizen aims to expand its track record across commercial, federal, and state engagements, contributing to the advancement of the organizations and communities across the DC Metropolitan area.",
    ],
  },
  {
    id: "mission",
    label: "Mission",
    body: [
      "Kaizen Project Management and Consulting, LLC is dedicated to delivering exceptional project management services. We collaborate closely with clients, leveraging our team's expertise to drive efficiencies and achieve mission success.",
      "Our leadership team consists of certified project management professionals. They bring deep industry knowledge, decades of experience, and extensive problem-solving capabilities to the most complex business environments.",
    ],
  },
  {
    id: "philosophy",
    label: "Philosophy",
    body: [
      "We chose the name \"Kaizen\" (Kai = Change, Zen = Good) because it is rooted in the Japanese philosophy of continuous improvement.",
      "This principle guides our commitment to changing for the better to deliver long-term success for our partners.",
    ],
  },
];
```

- [ ] **Step 2: Update tab body rendering to handle string arrays**

Find the tab body render block (around line 91–97):
```tsx
            <div key={active.id} className="fade-up">
              <span className="eyebrow">Our {active.label}</span>
              <p className="mt-6 font-serif text-[1.45rem] leading-[1.45] text-ink">
                {active.body}
              </p>
            </div>
```

Replace with:
```tsx
            <div key={active.id} className="fade-up">
              <span className="eyebrow">Our {active.label}</span>
              {(Array.isArray(active.body) ? active.body : [active.body]).map((para, i) => (
                <p key={i} className="mt-6 font-serif text-[1.45rem] leading-[1.45] text-ink">
                  {para}
                </p>
              ))}
            </div>
```

- [ ] **Step 3: Update the TabId type**

The `TabId` and `tabs` type annotation must remain valid. Update the type definition at line 6:
```tsx
type TabId = "vision" | "mission" | "philosophy";
```
(This is already correct — no change needed.)

Also update the `useState` line to use the new array type. Find:
```tsx
const tabs: { id: TabId; label: string; body: string }[] = [
```
And change `body: string` to `body: string | string[]`:
```tsx
const tabs: { id: TabId; label: string; body: string | string[] }[] = [
```

- [ ] **Step 4: Verify**

About page → Vision, Mission, Philosophy tabs should all show the new multi-paragraph text.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/pages/About.tsx
git commit -m "feat: update About page Vision, Mission, Philosophy content"
```

---

### Task 8: About page — replace image and remove capability boxes

**Files:**
- Modify: `src/app/components/pages/About.tsx:4, 29-45, 106-156`

- [ ] **Step 1: Replace the image import**

At the top of `About.tsx`, line 4:
```tsx
import flagImg from "../../../../flag.jpg";
```

Replace with:
```tsx
import kaizenImg from "../../../../Kaizen-Option-C.jpg";
```

- [ ] **Step 2: Remove the `capabilities` array**

Delete lines 29–45 (the `capabilities` array):
```tsx
const capabilities = [
  {
    title: "Comprehensive Project Management",
    ...
  },
  ...
];
```

Remove it entirely — it will no longer be referenced.

- [ ] **Step 3: Update the image reference in JSX**

In the "THE MEANING BEHIND KAIZEN" section around line 107, find:
```tsx
              <ImageWithFallback
                src={flagImg}
                alt="American flag"
                className="absolute inset-0 w-full h-full object-cover"
              />
```

Replace with:
```tsx
              <ImageWithFallback
                src={kaizenImg}
                alt="Kaizen"
                className="absolute inset-0 w-full h-full object-cover"
              />
```

- [ ] **Step 4: Remove the capabilities boxes grid**

Find and remove the entire `<div className="mt-10 grid gap-px bg-border border border-border">` block (lines 140–155):
```tsx
            <div className="mt-10 grid gap-px bg-border border border-border">
              {capabilities.map((c, i) => (
                <div key={c.title} className="bg-paper p-7 grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-3 flex items-baseline gap-3">
                    <span className="font-serif text-navy text-[1.6rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rule-red" />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="font-serif">{c.title}</h3>
                    <p className="mt-3 text-ink/70">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
```

Remove this block entirely.

- [ ] **Step 5: Verify**

About page → "A name with intent" section shows the Kaizen-Option-C.jpg image and no numbered boxes below the text.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/pages/About.tsx
git commit -m "feat: replace About page image, remove capability boxes from name section"
```

---

### Task 9: Our Work page — remove intro paragraph and federal projects section

**Files:**
- Modify: `src/app/components/pages/ContractVehicles.tsx:190-221`

- [ ] **Step 1: Remove the intro paragraph**

In the HEADER section, find and delete lines 190–198:
```tsx
          <div className="col-span-12 md:col-span-8 md:pt-4">
            <p className="text-ink/75 text-[1.05rem]">
              Discover the track record of Kaizen personnel in successfully delivering projects to
              federal agencies and commercial clients. Their proven expertise ensures seamless
              project management from inception to completion, meeting stringent government and
              industry standards. You can trust Kaizen's skilled personnel to navigate complexities
              and deliver results that exceed expectations across every sector they serve.
            </p>
          </div>
```

Remove this entire `<div>` block.

- [ ] **Step 2: Remove the Federal Projects section**

Find and delete the entire FEDERAL PROJECTS section (lines 202–221):
```tsx
      {/* FEDERAL PROJECTS */}
      <section className="bg-cream border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <div className="col-span-12 md:col-span-7">
              <span className="eyebrow">Federal Projects</span>
              <h2 className="font-serif mt-3">
                Past performance with
                <em className="italic text-navy"> federal agencies.</em>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 md:pt-4">
              <p className="text-ink/70">
                Tap each project to read scope and capabilities used.
              </p>
            </div>
          </div>
          <ProjectAccordion items={federal} prefix="F" />
        </div>
      </section>
```

Remove this entire `<section>` block.

- [ ] **Step 3: Remove unused `federal` data array and `Project` type if only used there**

The `federal` const (lines 9–51) and `Project` type (lines 1–7) are still used by `ProjectAccordion` for commercial too, so only remove the `federal` array (lines 9–51). The `commercial` array and `Project` type remain.

Find and delete:
```tsx
const federal: Project[] = [
  {
    title: "The Guaranteed Availability Project",
    ...
  },
  ...
];
```
(All 4 federal project objects, approximately lines 9–51.)

- [ ] **Step 4: Verify**

Navigate to "Our Work" page. No intro paragraph. Only "Commercial Projects" section with accordion visible.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/pages/ContractVehicles.tsx
git commit -m "feat: remove intro paragraph and federal projects section from Our Work page"
```

---

### Task 10: Home page — update capabilities cards

**Files:**
- Modify: `src/app/components/pages/Home.tsx:173-188`

- [ ] **Step 1: Replace capabilities card JSX**

Find the capabilities grid block (lines 173–188):
```tsx
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setPage("services", { category: s.id })}
                className="group relative text-left bg-paper p-6 md:p-8 transition-colors hover:bg-cream-2 focus:outline-none focus:bg-cream-2"
              >
                <h3 className="font-serif leading-tight">{s.title}</h3>
                <div className="rule-red mt-4" />
                <span className="mt-5 inline-flex items-center gap-2 text-navy text-sm tracking-wide">
                  Learn more
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </button>
            ))}
          </div>
```

Replace with:
```tsx
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setPage("services", { category: s.id })}
                className="group relative text-center bg-paper p-6 md:p-8 transition-colors hover:bg-cream-2 focus:outline-none focus:bg-cream-2 flex flex-col items-center"
              >
                <h3 className="font-serif leading-tight">{s.title}</h3>
                <div className="rule-red mt-4 self-center" />
                <p className="mt-5 text-ink/75 text-sm leading-relaxed max-w-[260px]">
                  {s.short}
                </p>
                <span className="mt-5 text-navy transition-transform duration-500 group-hover:translate-x-1 text-lg">
                  →
                </span>
              </button>
            ))}
          </div>
```

- [ ] **Step 2: Verify**

Home page capabilities section shows each card with: title, red rule, description sentence (centered), arrow. No "Learn more" text. Content is centered with equal spacing on both sides.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/pages/Home.tsx
git commit -m "feat: update home capabilities cards with descriptions, centered layout, arrow only"
```

---

## Self-Review

### Spec Coverage Check

| Requirement | Task |
|-------------|------|
| Remove 'Home' from menu, keep logo linking home | Task 1 |
| Change 'Projects' → 'Our Work' in nav | Task 1 |
| Change 'Projects' → 'Our Work' in footer | Task 2 |
| Quick Reach: rename 'Six Disciplines' → 'Our Expertise' | Task 4 |
| Quick Reach: add Contact link at bottom | Task 4 |
| About: update Vision paragraph | Task 7 |
| About: update Mission paragraph | Task 7 |
| About: update Philosophy paragraph | Task 7 |
| About: replace image with Kaizen-Option-C.jpg | Task 8 |
| About: remove boxes 01, 02, 03 | Task 8 |
| Capabilities: update Strategy Consulting content | Task 5 |
| Capabilities: update Project Management content | Task 5 |
| Capabilities: update IT Modernization content | Task 5 |
| Capabilities page: remove "Six disciplines" header | Task 6 |
| Our Work: remove intro paragraph | Task 9 |
| Our Work: remove Federal Projects section | Task 9 |
| Home capabilities cards: add description sentence | Task 10 |
| Home capabilities cards: remove "Learn more", keep arrow | Task 10 |
| Home capabilities cards: center text | Task 10 |
| Footer: remove tagline sentence | Task 3 |
| Footer: reorder (Explore, Contact, NAICS, Logo) | Task 3 |
| Footer: tighten NAICS code spacing | Task 3 |
| Footer: make email more readable (break-all) | Task 3 |

All requirements covered. ✓

### Placeholder Scan

No TBDs, TODOs, or "similar to" references. All code blocks are complete. ✓

### Type Consistency

- `tabs` array changes `body` from `string` to `string | string[]` — the render block in Task 7 Step 2 handles both via `Array.isArray`. ✓
- `services` array retains the same `ServiceCategory` type shape — `short`, `long`, `bullets` all present. ✓
- `federal` array removal in Task 9 leaves `commercial` intact; `ProjectAccordion` still receives valid data. ✓
