import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import type { Page } from "./Nav";
import footerLogo from "../../../kaizen-logo.png";

const navLinks: { id: Page; label: string }[] = [
  { id: "about", label: "About Us" },
  { id: "services", label: "Capabilities" },
  { id: "contract", label: "Our Work" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-paper text-ink border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20 flex flex-col items-center md:flex-row md:items-start gap-12 md:gap-20">

        {/* Logo + short statement — logo centered directly above the text,
            equal space on both sides */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <button
            onClick={() => setPage("home")}
            className="flex items-center"
            aria-label="Back to home"
          >
            <img
              src={footerLogo}
              alt="Kaizen"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </button>
          <p className="mt-4 text-sm font-light leading-relaxed text-ink/60">
            Kaizen Project Management & Consulting
          </p>
        </div>

        {/* Explore + Contact — kept close to the logo */}
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">

          {/* Explore */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="font-semibold text-ink mb-5">Explore</p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => setPage(l.id)}
                    className="font-light text-ink/85 transition-colors hover:text-red"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — every row shares a fixed 18px icon column so the text
              (and the phone number) lines up exactly down the left edge */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="font-semibold text-ink mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contract@kaizenpmconsulting.com"
                  className="inline-flex items-center gap-3 font-light text-ink/85 transition-colors hover:text-red"
                >
                  <span className="inline-flex w-[18px] shrink-0 justify-center">
                    <Mail size={18} />
                  </span>
                  <span className="break-all">contract@kaizenpmconsulting.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+15712930418"
                  className="inline-flex items-center gap-3 font-light text-ink/85 transition-colors hover:text-red"
                >
                  <span className="inline-flex w-[18px] shrink-0 justify-center">
                    <Phone size={18} />
                  </span>
                  <span>+1 571-293-0418</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-3 font-light text-ink/85">
                <span className="inline-flex w-[18px] shrink-0 justify-center">
                  <MapPin size={18} />
                </span>
                <span>Virginia, United States</span>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/kaizenpmconsulting/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kaizen on LinkedIn"
                  className="inline-flex items-center gap-3 font-light text-ink/85 transition-colors hover:text-red"
                >
                  <span className="inline-flex w-[18px] shrink-0 justify-center">
                    <Linkedin size={18} />
                  </span>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

      </div>

      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-ink/55">
            © 2024 Kaizen Project Management and Consulting, LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setPage("privacy")}
              className="eyebrow text-ink/70 transition-colors hover:text-red"
            >
              Privacy
            </button>
            <button
              onClick={() => setPage("terms")}
              className="eyebrow text-ink/70 transition-colors hover:text-red"
            >
              Terms
            </button>
            <span className="eyebrow text-ink/70">SAM.gov Registered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
