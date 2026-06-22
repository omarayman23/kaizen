const EFFECTIVE_DATE = "June 21, 2026";

export function Terms() {
  return (
    <div className="fade-up">
      <section className="bg-paper">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow">Legal</span>
          </div>
          <h1 className="font-serif">
            Terms of <em className="italic text-navy">Service.</em>
          </h1>
          <p className="mt-4 text-ink/60 text-sm">Effective {EFFECTIVE_DATE}</p>
          <p className="mt-4 text-ink/60 text-sm">
            This document is a working draft provided for review and is pending
            final legal counsel. It is not yet legal advice.
          </p>
        </div>
      </section>

      <section className="bg-cream border-t border-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-16 space-y-10">
          <Block title="Acceptance of these terms">
            By accessing kaizenpmconsulting.com (the "Site"), you agree to these
            Terms of Service. If you do not agree, please do not use the Site.
          </Block>

          <Block title="About the Site">
            The Site is operated by Kaizen Project Management and Consulting, LLC, a
            Virginia limited liability company. It provides information about our
            project management, program management, and consulting services.
          </Block>

          <Block title="Informational purpose only">
            Content on the Site is provided for general information. It does not
            constitute professional, legal, or financial advice, and it does not
            create a consulting relationship. Any engagement is governed by a
            separate written agreement between you and Kaizen.
          </Block>

          <Block title="Acceptable use">
            You agree not to misuse the Site — including attempting to gain
            unauthorized access, disrupting its operation, scraping it at scale, or
            submitting unlawful, misleading, or harmful content through the contact
            form.
          </Block>

          <Block title="Intellectual property">
            The Site and its content — including text, graphics, logos, and the
            Kaizen name and marks — are owned by or licensed to Kaizen and are
            protected by applicable law. You may not reproduce or reuse them without
            our prior written permission.
          </Block>

          <Block title="Third-party links">
            The Site may link to third-party websites for convenience. We are not
            responsible for the content, policies, or practices of those sites.
          </Block>

          <Block title="Disclaimer of warranties">
            The Site is provided "as is" and "as available" without warranties of
            any kind, whether express or implied, including fitness for a particular
            purpose and non-infringement, to the fullest extent permitted by law.
          </Block>

          <Block title="Limitation of liability">
            To the fullest extent permitted by law, Kaizen will not be liable for
            any indirect, incidental, or consequential damages arising from your use
            of the Site.
          </Block>

          <Block title="Governing law">
            These Terms are governed by the laws of the Commonwealth of Virginia,
            United States, without regard to its conflict-of-laws principles.
          </Block>

          <Block title="Changes to these terms">
            We may revise these Terms from time to time. The effective date above
            reflects the most recent revision, and continued use of the Site
            constitutes acceptance of the current Terms.
          </Block>

          <Block title="Contact">
            Questions about these Terms? Email{" "}
            <a className="text-navy underline" href="mailto:contract@kaizenpmconsulting.com">
              contract@kaizenpmconsulting.com
            </a>{" "}
            or call +1 571-293-0418.
          </Block>
        </div>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-navy mb-3">{title}</h2>
      <p className="text-ink/80 leading-relaxed">{children}</p>
    </div>
  );
}
