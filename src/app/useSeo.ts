import { useEffect } from "react";
import type { Page } from "./components/Nav";

// Canonical origin for every page URL and absolute structured-data references.
const BASE = "https://www.kaizenpmconsulting.com";

type SeoEntry = { path: string; title: string; description: string };

/**
 * Per-page SEO content. Titles lead with the high-intent, federal-focused
 * service terms buyers actually search ("federal project management",
 * "PMO consulting", "program management"); descriptions stay within the
 * ~160-character range Google renders and read as real sentences, not
 * keyword lists.
 */
const SEO: Record<Page, SeoEntry> = {
  home: {
    path: "/",
    title:
      "Federal Project Management & PMO Consulting Services | Kaizen PM & Consulting",
    description:
      "SAM.gov-registered federal project management and consulting firm in Virginia. Expert PMO setup, program management, strategy consulting and IT modernization for agencies and contractors nationwide.",
  },
  about: {
    path: "/about",
    title: "About Us | Federal Project Management & Consulting Firm | Kaizen",
    description:
      "Kaizen Project Management & Consulting is a Virginia-based, SAM.gov-registered firm delivering federal program and project management built on continuous improvement.",
  },
  services: {
    path: "/capabilities",
    title:
      "Capabilities | Project Management, PMO, Strategy & IT Modernization | Kaizen",
    description:
      "Kaizen's capabilities: project and program management, PMO setup, strategy consulting, IT modernization, digital transformation and agile delivery for federal and commercial clients.",
  },
  contract: {
    path: "/our-work",
    title:
      "Our Work & NAICS Codes | Federal Project Management Past Performance | Kaizen",
    description:
      "Kaizen's past performance and federal capability codes. Registered under 11 NAICS codes spanning project management, management consulting and IT services for government contracts.",
  },
  contact: {
    path: "/contact",
    title:
      "Contact | Federal Project Management & PMO Consulting Services | Kaizen",
    description:
      "Contact Kaizen Project Management & Consulting for federal PMO, program management and strategy consulting. Virginia-based, serving clients nationwide. Email or call today.",
  },
  faq: {
    path: "/faq",
    title: "FAQ | Project Management & Consulting Services | Kaizen",
    description:
      "Answers about Kaizen's project management, PMO and consulting services, federal SAM.gov registration, the clients we serve, and how to start an engagement.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | Kaizen Project Management & Consulting",
    description:
      "Privacy policy for Kaizen Project Management and Consulting, LLC — how we handle information submitted through our website.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Service | Kaizen Project Management & Consulting",
    description:
      "Terms of service governing use of the Kaizen Project Management and Consulting, LLC website.",
  },
};

const BREADCRUMB_LABEL: Record<Page, string> = {
  home: "Home",
  about: "About Us",
  services: "Capabilities",
  contract: "Our Work",
  contact: "Contact",
  faq: "FAQ",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

/** Find a head tag by selector or create + append it, then apply `set`. */
function upsertTag(
  selector: string,
  create: () => HTMLElement,
  set: (el: HTMLElement) => void
) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
}

function setMetaName(name: string, content: string) {
  upsertTag(
    `meta[name="${name}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute("name", name);
      return m;
    },
    (el) => el.setAttribute("content", content)
  );
}

function setMetaProp(property: string, content: string) {
  upsertTag(
    `meta[property="${property}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute("property", property);
      return m;
    },
    (el) => el.setAttribute("content", content)
  );
}

function setCanonical(href: string) {
  upsertTag(
    'link[rel="canonical"]',
    () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    },
    (el) => el.setAttribute("href", href)
  );
}

/** Upsert a keyed JSON-LD <script> so structured data stays in sync per page. */
export function setJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Keeps the document head in sync with the current route: title, meta
 * description, canonical URL, Open Graph / Twitter tags, and a BreadcrumbList.
 * This is what gives a client-rendered SPA distinct, accurate metadata per
 * page instead of one static set for the whole site.
 */
export function useSeo(page: Page) {
  useEffect(() => {
    const entry = SEO[page];
    const url = BASE + entry.path;

    document.title = entry.title;
    setMetaName("description", entry.description);
    setCanonical(url);

    setMetaProp("og:title", entry.title);
    setMetaProp("og:description", entry.description);
    setMetaProp("og:url", url);
    setMetaName("twitter:title", entry.title);
    setMetaName("twitter:description", entry.description);

    const itemListElement: Record<string, unknown>[] = [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
    ];
    if (page !== "home") {
      itemListElement.push({
        "@type": "ListItem",
        position: 2,
        name: BREADCRUMB_LABEL[page],
        item: url,
      });
    }
    setJsonLd("ld-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    });
  }, [page]);
}
