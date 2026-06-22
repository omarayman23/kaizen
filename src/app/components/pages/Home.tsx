import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MediaFrame } from "../MediaFrame";
import type { Page } from "../Nav";
import { services } from "../../services";
import flagImg from "../../../../flag.jpg";
import heroImg from "../../../../Kaizen-Hero-Wallpaper.jpg";

export function Home({
  setPage,
}: {
  setPage: (p: Page, opts?: { category?: string }) => void;
}) {
  return (
    <div className="fade-up">
      {/* HERO */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroImg}
            alt=""
            className="hero-img w-full h-full object-cover"
            loading="eager"
            // @ts-expect-error fetchpriority is a valid HTML attribute not yet in the React types here
            fetchpriority="high"
          />
          {/* Desktop: navy scrim deepening the left columns where the text
              sits, fading out so the crystal stays visible on the right. */}
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              background:
                "linear-gradient(to right, rgba(19,31,56,0.92) 0%, rgba(19,31,56,0.85) 32%, rgba(19,31,56,0.5) 52%, rgba(19,31,56,0.1) 72%, rgba(19,31,56,0) 100%)",
            }}
          />
          {/* Mobile: bottom-up navy scrim so the full-width hero text stays
              legible over the image. */}
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              background:
                "linear-gradient(to top, rgba(19,31,56,0.95) 0%, rgba(19,31,56,0.85) 38%, rgba(19,31,56,0.45) 64%, rgba(19,31,56,0.1) 100%)",
            }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-10 pt-12 pb-20 md:pt-28 md:pb-40 grid grid-cols-1 md:grid-cols-12 gap-6 items-end min-h-[420px] md:min-h-[600px]">
          <div className="md:col-span-8 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="rule-red" />
              <span className="eyebrow" style={{ color: "rgba(255,255,255,0.72)" }}>
                People · Process · Impact
              </span>
            </div>
            <h1
              className="font-serif text-paper"
              style={{
                fontSize: "clamp(1.5rem, 4.2vw, 3.75rem)",
                lineHeight: 1.1,
              }}
            >
              Strategy meets execution.{" "}
              <em
                className="italic"
                style={{ color: "var(--gold)", fontStyle: "normal" }}
              >
                Every time.
              </em>
            </h1>
            <p
              className="mt-8 max-w-xl text-paper/85"
              style={{
                fontSize: "clamp(1.1rem, 1rem + 0.5vw, 1.35rem)",
                lineHeight: 1.55,
              }}
            >
              Continuous improvement woven into every engagement, every milestone, every
              deliverable.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setPage("services")}
                className="pill pill-animated"
                style={{ background: "var(--red)", color: "#fff" }}
              >
                Explore Capabilities →
              </button>
              <button
                onClick={() => setPage("contract")}
                className="pill pill-ghost-dark pill-animated"
              >
                Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      <StatsStrip />

      {/* WHY KAIZEN */}
      <section className="bg-paper border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
          <div className="md:col-span-5 relative flex">
            <MediaFrame className="w-full self-stretch">
              <ImageWithFallback
                src={flagImg}
                alt="American flag"
                className="w-full h-full object-contain"
              />
            </MediaFrame>
          </div>

          <div className="md:col-span-7 md:pl-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-red" />
              <span className="eyebrow">Why Kaizen</span>
            </div>
            <h2 className="font-serif">
              Beyond management,
              <em className="italic text-navy"> toward mastery.</em>
            </h2>
            <p className="mt-6 text-ink/75 max-w-2xl">
              We specialize in turning your vision or challenge into a tangible plan of action, and
              leading it through every stage until completion. Working shoulder-to-shoulder with
              your teams, we manage stakeholders, foster cross-functional cooperation, and apply
              tailored processes and modern tools, so your objectives are met efficiently,
              effectively, and with measurable results that exceed expectations.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-8">
              <div>
                <span className="eyebrow">Our Values</span>
                <ul className="mt-4 space-y-3">
                  {[
                    "Continuous Improvement",
                    "Client-Centric Approach",
                    "Integrity & Transparency",
                    "Collaborative Partnership",
                  ].map((v) => (
                    <li key={v} className="flex items-start gap-3 border-t border-border pt-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red shrink-0" />
                      <span className="text-ink/85">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="eyebrow">Who We Serve</span>
                <ul className="mt-4 space-y-3">
                  {[
                    "Federal Agencies",
                    "Prime Contractors",
                    "Federal Subcontractors",
                    "Public Organizations",
                  ].map((v) => (
                    <li key={v} className="flex items-start gap-3 border-t border-border pt-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-navy shrink-0" />
                      <span className="text-ink/85">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CAPABILITIES (formerly What We Do) */}
      <section className="bg-cream border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-14">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3">
                <span className="rule-red" />
                <span className="eyebrow" style={{ color: "var(--gold)" }}>
                  Capabilities
                </span>
              </div>
              <h2 className="font-serif mt-3">
                A full spectrum of
                <em className="italic text-navy"> project management expertise.</em>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:pt-6">
              <p
                className="text-ink/70"
                style={{ lineHeight: 1.55 }}
              >
                Each practice is led by a senior partner. Tap any card to see the full service brief.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setPage("services", { category: s.id })}
                className="group relative text-center bg-paper p-6 md:p-8 transition-colors hover:bg-cream-2 focus:outline-none focus:bg-cream-2 flex flex-col items-center"
              >
                <h3 className="font-serif leading-tight">{s.title}</h3>
                <div className="rule-red mt-4 self-center" />
                <p className="mt-5 text-ink/75 leading-relaxed max-w-[280px]">
                  {s.tagline}
                </p>
                <span className="mt-5 text-navy transition-transform duration-500 group-hover:translate-x-1 text-lg">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="bg-navy text-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow" style={{ color: "var(--gold)" }}>
              Our Promise
            </span>
          </div>
          <h2 className="font-serif text-paper">
            We turn vision into a
            <em className="italic" style={{ color: "var(--gold)", fontStyle: "normal" }}>
              {" "}tangible plan of action,
            </em>{" "}
            delivered with the discipline federal programs demand.
          </h2>
          <div className="mt-10">
            <button
              onClick={() => setPage("about")}
              className="pill pill-ghost-dark pill-animated"
            >
              About Us →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatsStrip() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats: { value: number; suffix: string; label: string }[] = [
    { value: 15, suffix: "+", label: "Years Experience" },
    { value: 200, suffix: "+", label: "Projects Delivered" },
    { value: 100, suffix: "%", label: "Compliance Rate" },
  ];

  return (
    <section ref={ref} className="bg-cream border-y border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
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
      </div>
    </section>
  );
}

/** Animates a number from 0 → target with easeOutCubic when `run` flips true. */
function CountUp({
  target,
  run,
  duration = 1400,
}: {
  target: number;
  run: boolean;
  duration?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;

    // Respect users who prefer reduced motion — jump straight to the value.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setN(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);

  return <>{n}</>;
}
