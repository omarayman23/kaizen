const faqs: { q: string; a: string }[] = [
  {
    q: "What services does Kaizen provide?",
    a: "We provide project and program management, PMO setup and support, strategy consulting, and IT modernization. Each engagement is led by senior practitioners and grounded in continuous improvement — the principle of kaizen.",
  },
  {
    q: "What types of clients do you work with?",
    a: "We serve federal agencies, prime contractors, federal subcontractors, and public organizations. Our methods adapt to both highly regulated government programs and commercial initiatives.",
  },
  {
    q: "Are you registered to work with federal agencies?",
    a: "Yes. Kaizen Project Management and Consulting, LLC is a SAM.gov-registered firm based in Virginia, serving clients nationwide and equipped to support federal contracting requirements.",
  },
  {
    q: "How do we get started with an engagement?",
    a: "Reach out through our contact form or by email with a short description of your goal or challenge. We'll set up an introductory conversation, scope the work together, and agree on a clear plan before any engagement begins.",
  },
  {
    q: "Where are you located, and do you work remotely?",
    a: "We are based in Virginia and serve clients across the United States. We work both on-site and remotely, shaping the arrangement around each client's needs and program requirements.",
  },
];

export function FAQ() {
  return (
    <div className="fade-up">
      <section className="bg-paper">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow">Questions</span>
          </div>
          <h1 className="font-serif">
            Frequently asked
            <em className="italic text-navy"> questions.</em>
          </h1>
        </div>
      </section>

      <section className="bg-cream border-t border-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-16 space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group border border-border bg-paper p-6 transition-colors open:bg-cream-2/40"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                <h2 className="font-serif text-navy text-[1.15rem] md:text-[1.35rem] leading-snug">
                  {f.q}
                </h2>
                <span className="shrink-0 text-navy text-2xl leading-none transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-ink/80 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
