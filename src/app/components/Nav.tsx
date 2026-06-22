import { useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import logoPlain from "../../../kaiz.png";

type Page = "home" | "about" | "services" | "contract" | "contact" | "privacy" | "terms" | "faq";

/**
 * Smoothly scrolls the page back to the top.
 *
 * `overflow-x: hidden` on <html> propagates the viewport scroll to <body>, so
 * <html> is parked at viewport height and native `scroll-behavior: smooth`
 * never animates the real scroller. We drive the animation ourselves with
 * requestAnimationFrame and assign scrollTop directly each frame (the one
 * operation that reliably moves the propagated <body> scroller), writing to
 * both <body> and <html> so it also works on pages where <html> is the scroller.
 */
function smoothScrollToTop(duration = 500) {
  const startY =
    document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
  if (startY === 0) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    return;
  }

  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const y = Math.round(startY * (1 - eased));
    document.body.scrollTop = y;
    document.documentElement.scrollTop = y;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const links: { id: Page; label: string; index: string }[] = [
  { id: "about", label: "About Us", index: "01" },
  { id: "services", label: "Capabilities", index: "02" },
  { id: "contract", label: "Our Work", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
];

export function Nav({
  page,
  setPage,
  open,
  setOpen,
}: {
  page: Page;
  setPage: (p: Page, opts?: { category?: string }) => void;
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 h-[72px] md:h-[120px] flex items-center justify-between">
          <button
            onClick={() => {
              if (page === "home") {
                // Already home — smooth-scroll back to the top without
                // animating the logo itself.
                smoothScrollToTop();
                return;
              }
              setPage("home");
              setOpen(false);
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            className="flex items-center"
          >
            <img
              src={logoPlain}
              alt="Kaizen"
              className="h-14 md:h-36 w-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-4 group"
            aria-label="Toggle menu"
          >
            <span className="eyebrow text-ink group-hover:text-red transition-colors">
              {open ? "Close" : "Menu"}
            </span>
            <span className="relative h-5 w-7 inline-block">
              <span
                className={`absolute left-0 right-0 h-[2px] bg-ink transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-ink transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[2px] bg-ink transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Half-width overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-paper border-r border-border transition-transform duration-500 w-full md:w-1/2 pt-[72px] md:pt-[120px] overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 md:px-10 py-8 md:py-12 flex flex-col h-full">
          <nav className="flex-1 pl-2 md:pl-6">
            <ul className="hover-list space-y-1 md:space-y-2">
              {links.map((l, i) => (
                <li
                  key={l.id}
                  className={`reveal ${open ? "is-visible" : ""}`}
                  data-delay={String(i)}
                >
                  <button
                    onClick={() => {
                      setPage(l.id);
                      setOpen(false);
                    }}
                    className="group w-full text-left py-3 md:py-4 border-t border-border flex items-baseline gap-6"
                  >
                    <span
                      className={`text-[1.8rem] md:text-[3.15rem] leading-none transition-colors ${
                        page === l.id ? "text-red" : "text-ink group-hover:text-red"
                      }`}
                      style={{ fontWeight: 200, letterSpacing: "-0.02em" }}
                    >
                      {l.label}
                    </span>
                    <span className="ml-auto eyebrow text-ink/30 group-hover:text-red transition-colors">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-border mt-10 pt-6 pl-2 md:pl-6 flex flex-col gap-3">
            <a
              href="mailto:contract@kaizenpmconsulting.com"
              className="inline-flex items-center gap-2 text-ink/80 hover:text-red transition-colors"
            >
              <Mail size={16} />
              <span>contract@kaizenpmconsulting.com</span>
            </a>
            <a
              href="tel:+15712930418"
              className="inline-flex items-center gap-2 text-ink/80 hover:text-red transition-colors"
            >
              <Phone size={16} />
              <span>+1 571-293-0418</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export type { Page };
