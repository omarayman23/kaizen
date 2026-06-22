import type { CSSProperties } from "react";

/**
 * Partners we've worked with.
 *
 * Every image dropped into the /Logos folder at the project root is picked up
 * automatically — no need to edit this file to add a partner. The filename is
 * used only as alt text (it is never shown).
 */
type Partner = { name: string; logo?: string };

// Eagerly import every logo image in /Logos (capital L — case matters on Linux/Vercel).
const logoModules = import.meta.glob(
  "../../../../Logos/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}",
  { eager: true, import: "default" }
) as Record<string, string>;

const partners: Partner[] = Object.entries(logoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({
    name: path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    logo: src,
  }));

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
          loading="lazy"
          // mix-blend-multiply drops the white box behind JPG logos so they
          // sit transparently on the paper background.
          style={{ mixBlendMode: "multiply" }}
          className="h-12 w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
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
