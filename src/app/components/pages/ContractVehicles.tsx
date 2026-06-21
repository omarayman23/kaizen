import { LogoCloud } from "../ui/logo-cloud";

const naics: { code: string; title: string }[] = [
  { code: "541330", title: "Engineering Services" },
  { code: "541512", title: "Computer Systems Design Services" },
  { code: "541513", title: "Computer Facilities Management Services" },
  { code: "541519", title: "Other Computer Related Services" },
  { code: "541611", title: "Administrative & General Management Consulting" },
  { code: "541614", title: "Process, Physical Distribution, & Logistics Consulting" },
  { code: "541618", title: "Other Management Consulting Services" },
  { code: "541690", title: "Other Scientific & Technical Consulting" },
  { code: "541990", title: "All Other Professional & Technical Services" },
  { code: "561110", title: "Office Administrative Services" },
  { code: "611430", title: "Professional & Management Development Training" },
];

export function ContractVehicles() {
  return (
    <div className="fade-up">
      {/* HEADER */}
      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-9">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-red" />
              <span className="eyebrow">Projects · Past Performance</span>
            </div>
            <h1 className="font-serif">
              A track record of
              <em className="italic text-navy"> delivery,</em> at federal and commercial scale.
            </h1>
          </div>
        </div>
      </section>

      {/* NAICS CODES */}
      <section className="bg-cream border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3">
              <span className="rule-red" />
              <span className="eyebrow">Capability Codes</span>
            </div>
            <h2 className="font-serif mt-3">
              Registered under eleven
              <em className="italic text-navy"> NAICS codes.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:pt-6">
            <p className="text-ink/70">
              The North American Industry Classification System codes that define where Kaizen is
              qualified to deliver across federal and commercial contracts.
            </p>
          </div>

          {/* Two-column table: NAICS Code | Industry Title */}
          <div className="md:col-span-12">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-navy/25">
                  <th
                    scope="col"
                    className="eyebrow !text-navy py-4 pr-6 align-bottom w-[160px] md:w-[220px]"
                  >
                    NAICS Code
                  </th>
                  <th scope="col" className="eyebrow !text-navy py-4 align-bottom">
                    Industry Title
                  </th>
                </tr>
              </thead>
              <tbody>
                {naics.map((row) => (
                  <tr
                    key={row.code}
                    className="border-b border-border group transition-colors hover:bg-paper"
                  >
                    <td className="py-5 pr-6 align-top">
                      <span className="font-serif text-navy tracking-wide tabular-nums text-[1.15rem]">
                        {row.code}
                      </span>
                    </td>
                    <td className="py-5 align-top">
                      <span className="flex items-start gap-3 text-ink/85">
                        <span className="mt-[0.6em] h-1.5 w-1.5 rounded-full bg-red shrink-0 transition-transform duration-300 group-hover:scale-150" />
                        {row.title}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PARTNERS — rotating logo cloud */}
      <LogoCloud />
    </div>
  );
}
