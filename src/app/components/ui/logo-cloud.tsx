import type { CSSProperties } from "react";

/**
 * Partners we've worked with.
 *
 * ── HOW TO ADD A COMPANY ──────────────────────────────────────────────
 * Each entry is one tile in the rotating row. Two options:
 *
 *   1. Logo image — drop the file in the project and import it, then:
 *        { name: "Acme Corp", logo: acmeLogo }
 *      (the `name` is still used for the alt text / accessibility)
 *
 *   2. Text wordmark (no logo yet) — just the name:
 *        { name: "Acme Corp" }
 *
 * The row loops seamlessly no matter how many you add.
 * ──────────────────────────────────────────────────────────────────────
 */
type Partner = { name: string; logo?: string };

const partners: Partner[] = [
  { name: "Partner One" },
  { name: "Partner Two" },
  { name: "Partner Three" },
  { name: "Partner Four" },
  { name: "Partner Five" },
  { name: "Partner Six" },
];

// Soft fade on the left/right edges so logos dissolve in and out.
const fadeWidth = 96;
const maskStyle: CSSProperties = {
  maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
  WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
};

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className="flex shrink-0 items-center justify-center px-10">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        />
      ) : (
        <span className="whitespace-nowrap font-serif text-xl font-semibold tracking-tight text-navy/45 transition-colors duration-300 hover:text-navy">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export function LogoCloud() {
  return (
    <section className="bg-paper border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <span className="rule-red" />
          <span className="eyebrow">Trusted By</span>
        </div>
        <h2 className="font-serif mt-3 text-center md:text-left">
          The organizations we've
          <em className="italic text-navy"> partnered with.</em>
        </h2>

        {/* Rotating row — pauses on hover. Duplicated once for a seamless loop. */}
        <div
          className="group relative mt-14 w-full overflow-hidden"
          style={maskStyle}
        >
          <div className="marquee flex w-max items-center group-hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((partner, i) => (
              <PartnerTile key={`${partner.name}-${i}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoCloud;
