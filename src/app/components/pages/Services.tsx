import { useEffect, useRef } from "react";
import type { Page } from "../Nav";
import { services } from "../../services";

export function Services({
  activeCategory,
  setPage,
}: {
  activeCategory?: string;
  setPage: (p: Page, opts?: { category?: string }) => void;
}) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (activeCategory && refs.current[activeCategory]) {
      const el = refs.current[activeCategory]!;
      const top = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [activeCategory]);

  return (
    <div className="fade-up">
      {/* Header */}
      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-red" />
              <span className="eyebrow">Capabilities · Practice Areas</span>
            </div>
            <h1 className="font-serif">
              Our capabilities,
              <em className="italic text-navy"> delivered with precision.</em>
            </h1>
          </div>
          <div className="md:col-span-4 md:pt-10">
            <p className="text-ink/70">
              Senior-led teams, deep certification, and a working method we've refined over twelve
              years. Choose where to start.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky category index */}
      <section className="bg-cream border-y border-border sticky top-[72px] md:top-[120px] z-30 backdrop-blur-md bg-cream/90">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 md:py-4 flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto">
          {services.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setPage("services", { category: s.id })}
              className={`pill pill-animated !py-2 !px-4 text-sm ${
                activeCategory === s.id ? "pill-primary" : "pill-ghost"
              }`}
            >
              <span
                className={`mr-2 font-serif ${
                  activeCategory === s.id ? "text-paper/80" : "text-navy/70"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </button>
          ))}
        </div>
      </section>

      {/* Category sections */}
      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16">
          {services.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => (refs.current[s.id] = el)}
              className={`grid grid-cols-1 md:grid-cols-12 gap-6 py-16 scroll-mt-32 transition-colors ${
                i !== services.length - 1 ? "border-b border-border" : ""
              } ${
                activeCategory === s.id ? "bg-cream-2/40 -mx-6 md:-mx-10 px-6 md:px-10 rounded-sm" : ""
              }`}
            >
              <div className="md:col-span-4">
                <div className="md:sticky md:top-[150px]">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-navy text-[2.4rem] leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rule-red" />
                  </div>
                  <h2 className="font-serif mt-6 leading-[1.1]">{s.title}</h2>
                </div>
              </div>

              <div className="md:col-span-7 md:col-start-6">
                <p className="font-serif leading-relaxed text-ink">{s.short}</p>

                <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {s.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-3 py-2 border-t border-border">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red shrink-0" />
                      <p className="text-ink/85">{b}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <button
                    onClick={() => setPage("contact")}
                    className="pill pill-primary pill-animated"
                  >
                    Engage this practice →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
