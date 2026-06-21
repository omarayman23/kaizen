import { useState } from "react";
import { services } from "../services";
import type { Page } from "./Nav";

export function QuickReach({
  onOpen,
  setPage,
}: {
  onOpen?: () => void;
  setPage: (p: Page, opts?: { category?: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-40">
      <div className="flex items-stretch">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-center justify-center group transition-colors"
          style={{
            background: "#101828",
            color: "#FFFFFF",
            padding: "20px 12px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontSize: "0.72rem",
            fontWeight: 600,
          }}
          aria-label="Quick Reach · Toggle disciplines"
        >
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Quick Reach
          </span>
          <span style={{ marginTop: 10, fontSize: "1rem" }}>
            {open ? "›" : "‹"}
          </span>
        </button>

        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            width: open ? 320 : 0,
            background: "#101828",
            color: "#FFFFFF",
          }}
        >
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
        </div>
      </div>
    </div>
  );
}
