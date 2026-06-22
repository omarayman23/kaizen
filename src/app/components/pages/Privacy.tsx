const EFFECTIVE_DATE = "June 21, 2026";

export function Privacy() {
  return (
    <div className="fade-up">
      <section className="bg-paper">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow">Legal</span>
          </div>
          <h1 className="font-serif">
            Privacy <em className="italic text-navy">Policy.</em>
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
          <Block title="Who we are">
            Kaizen Project Management and Consulting, LLC ("Kaizen," "we," "us,"
            or "our") is a project and program management consulting firm based in
            Virginia, United States. This Privacy Policy explains how we collect,
            use, and protect information when you visit kaizenpmconsulting.com (the
            "Site") or contact us.
          </Block>

          <Block title="Information we collect">
            We collect the information you choose to provide through our contact
            form: your name, email address, company or agency name, the project
            type you select, and any message you send. We do not ask for or
            intentionally collect sensitive personal information. We do not sell
            personal information.
          </Block>

          <Block title="How we use your information">
            We use your information solely to respond to your inquiry, communicate
            with you about a potential or existing engagement, and keep a record of
            our correspondence. We do not use it for advertising or share it with
            third parties for their own marketing.
          </Block>

          <Block title="Email processing">
            Contact form submissions are delivered to us and acknowledged to you by
            email through Resend (resend.com), our email delivery provider, acting
            as a processor on our behalf. Your message is transmitted to Resend
            only to deliver these emails.
          </Block>

          <Block title="Cookies and analytics">
            The Site does not set advertising cookies. If we use privacy-respecting
            analytics to understand aggregate, non-identifying usage, that data is
            not used to identify individual visitors.
          </Block>

          <Block title="Data retention">
            We keep contact correspondence for as long as needed to serve you and
            to meet legal, accounting, or reporting obligations, after which it is
            deleted or anonymized.
          </Block>

          <Block title="Your rights">
            You may ask us to access, correct, or delete the personal information
            you have provided. To make a request, email us at the address below and
            we will respond within a reasonable time.
          </Block>

          <Block title="Security">
            We take reasonable technical and organizational measures to protect your
            information. No method of transmission over the Internet is completely
            secure, however, and we cannot guarantee absolute security.
          </Block>

          <Block title="Governing law">
            This Policy is governed by the laws of the Commonwealth of Virginia,
            United States, without regard to its conflict-of-laws principles.
          </Block>

          <Block title="Changes to this policy">
            We may update this Policy from time to time. The effective date above
            reflects the most recent revision.
          </Block>

          <Block title="Contact">
            Questions about this Policy? Email{" "}
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
