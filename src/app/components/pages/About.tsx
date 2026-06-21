import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Page } from "../Nav";
import kaizenImg from "../../../../Kaizen-Option-C.jpg";

type TabId = "vision" | "mission" | "philosophy";

const tabs: { id: TabId; label: string; body: string | string[] }[] = [
  {
    id: "vision",
    label: "Vision",
    body: [
      "Kaizen Project Management and Consulting, LLC strives to be a trusted partner for federal agencies and commercial organizations seeking delivery excellence and long-lasting, reliable partnerships.",
      "Our team features senior-level experts with decades of government and private industry experience. Their expertise and integrity form the cornerstones of successful project delivery in the DC metropolitan area and beyond.",
      "Guided by innovative strategies and a relentless pursuit of excellence, Kaizen aims to expand its track record across commercial, federal, and state engagements, contributing to the advancement of the organizations and communities across the DC Metropolitan area.",
    ],
  },
  {
    id: "mission",
    label: "Mission",
    body: [
      "Kaizen Project Management and Consulting, LLC is dedicated to delivering exceptional project management services. We collaborate closely with clients, leveraging our team's expertise to drive efficiencies and achieve mission success.",
      "Our leadership team consists of certified project management professionals. They bring deep industry knowledge, decades of experience, and extensive problem-solving capabilities to the most complex business environments.",
    ],
  },
  {
    id: "philosophy",
    label: "Philosophy",
    body: [
      "We chose the name \"Kaizen\" (Kai = Change, Zen = Good) because it is rooted in the Japanese philosophy of continuous improvement.",
      "This principle guides our commitment to changing for the better to deliver long-term success for our partners.",
    ],
  },
];

export function About({ setPage }: { setPage: (p: Page) => void }) {
  const [tab, setTab] = useState<TabId>("vision");
  const active = tabs.find((t) => t.id === tab)!;

  return (
    <div className="fade-up">
      {/* HEADER */}
      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-red" />
              <span className="eyebrow">Passionate · Dedicated · Professional</span>
            </div>
            <h1 className="font-serif">About Us</h1>
          </div>
        </div>
      </section>

      {/* TABS: Vision / Mission / Philosophy */}
      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24 grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-[100px] space-y-2 border-l border-border">
              {tabs.map((t) => {
                const isActive = t.id === tab;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full text-left pl-6 py-4 relative transition-all duration-300 hover:translate-x-1 ${
                      isActive ? "text-navy" : "text-ink/55 hover:text-red"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-[-1px] top-0 bottom-0 w-[3px] bg-red" />
                    )}
                    <span className="font-serif text-[2rem] leading-none block">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div key={active.id} className="fade-up">
              <span className="eyebrow">Our {active.label}</span>
              {(Array.isArray(active.body) ? active.body : [active.body]).map((para, i) => (
                <p key={i} className="mt-6 font-serif leading-relaxed text-ink">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE MEANING BEHIND KAIZEN */}
      <section className="bg-cream border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 grid grid-cols-12 gap-10 items-stretch">
          <div className="col-span-12 md:col-span-5 relative flex">
            <div className="relative w-full min-h-[280px] overflow-hidden">
              <ImageWithFallback
                src={kaizenImg}
                alt="Kaizen"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">A name with intent</span>
            <h2 className="font-serif mt-3">
              The meaning behind
              <em className="italic text-navy"> Kaizen.</em>
            </h2>
            <p className="mt-6 text-ink/75">
              The name represents our commitment to continuous improvement and excellence in IT
              project management. We enhance organizational efficiency through iterative process
              refinement and strategic execution, ensuring sustained growth and success for our
              clients.
            </p>
            <p className="mt-4 text-ink/75">
              Kaizen is led by experienced IT Project Management professionals with strong academic
              backgrounds and industry certifications, including PMP and Agile credentials such as Release
              Train Engineers, Agile Practitioners and Advanced Scrum Masters. The team has a proven
              track record of managing complex IT projects globally: enterprise solution
              deployments, digital transformation, and large-scale infrastructure.
            </p>
            <p className="mt-4 text-ink/75">
              Beyond technical expertise, we thrive in the craft of project management: stakeholder
              communication, risk mitigation and strategic planning, ensuring projects are
              delivered on time, within budget and to the highest standards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-paper">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-24 text-center">
          <span className="eyebrow text-paper/80">Ready to begin?</span>
          <h2 className="font-serif mt-4 text-paper">
            Let's elevate the project,
            <em className="italic"> together.</em>
          </h2>
          <button
            onClick={() => setPage("contact")}
            className="pill pill-animated bg-paper text-navy hover:bg-cream mt-10"
          >
            Start a conversation →
          </button>
        </div>
      </section>
    </div>
  );
}
