import { useCallback, useEffect, useState } from "react";
import type { Page } from "./components/Nav";

// Single source of truth: page -> clean URL path.
const PATHS: Record<Page, string> = {
  home: "/",
  about: "/about",
  services: "/capabilities",
  contract: "/our-work",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  faq: "/faq",
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
