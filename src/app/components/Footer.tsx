import { Mail, Phone, MapPin } from "lucide-react";
import type { Page } from "./Nav";
import footerLogo from "../../../kaiz.png";

const navLinks: { id: Page; label: string }[] = [
  { id: "about", label: "About Us" },
  { id: "services", label: "Capabilities" },
  { id: "contract", label: "Our Work" },
  { id: "contact", label: "Contact" },
];

const naicsCodes = [
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
];

export function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-paper text-ink border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 md:gap-10">

        {/* Column 1: Explore — centered */}
        <div className="md:col-span-3 flex flex-col items-center text-center">
          <p className="eyebrow text-ink/60 mb-5">Explore</p>
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => setPage(l.id)}
                  className="text-ink/85 transition-colors hover:text-red"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Contact — icons aligned in one column */}
        <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="eyebrow text-ink/60 mb-5">Contact</p>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:contract@kaizenpmconsulting.com"
                className="inline-flex items-center gap-3 text-ink/85 transition-colors hover:text-red"
              >
                <Mail size={18} className="shrink-0" />
                <span className="break-all">contract@kaizenpmconsulting.com</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+15712930418"
                className="inline-flex items-center gap-3 text-ink/85 transition-colors hover:text-red"
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
        <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="eyebrow text-ink/60 mb-5">NAICS Codes</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-ink/85">
            {naicsCodes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Column 4: Logo — Est. 2024 tucked right under it, no animation */}
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <button
            onClick={() => setPage("home")}
            className="flex items-center"
            aria-label="Back to home"
          >
            <img
              src={footerLogo}
              alt="Kaizen"
              className="h-28 md:h-36 w-auto object-contain"
            />
          </button>
          <div className="-mt-3 flex items-center gap-3">
            <span className="rule-red" />
            <span className="eyebrow text-ink/80">Est. 2024 — Virginia</span>
          </div>
        </div>

      </div>

      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-ink/55">
            © 2024 Kaizen Project Management and Consulting, LLC. All rights reserved.
          </p>
          <p className="eyebrow text-ink/70">SAM.gov Registered</p>
        </div>
      </div>
    </footer>
  );
}
