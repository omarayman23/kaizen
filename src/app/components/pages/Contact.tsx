import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { services } from "../../services";
import contactImg from "../../../../contact.png";

const projectTypes = [...services.map((s) => s.title), "Other"];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>(projectTypes[0]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    website: "", // honeypot — stays empty for real users
  });

  const update =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const selectType = (t: string) => setSelectedType(t);

  const resetForm = () => {
    setForm({ name: "", email: "", company: "", message: "", website: "" });
    setSelectedType(projectTypes[0]);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projectType: selectedType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fade-up">
      {/* HEADER: title left, statement right, on one line */}
      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule-red" />
            <span className="eyebrow">Make Contact</span>
          </div>
          <h1 className="font-serif">
            We'd love to hear
            <em className="italic text-navy"> what you're building.</em>
          </h1>
        </div>
      </section>

      <section className="bg-cream border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
          {/* Left column: contact box stacked directly above the image,
              the pair filling the same height as the form on the right */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="border border-border bg-paper p-6 space-y-4 text-left">
              <a
                href="mailto:contract@kaizenpmconsulting.com"
                className="inline-flex items-center gap-3 break-all hover:text-red transition-colors"
              >
                <Mail size={18} className="shrink-0" />
                <span>contract@kaizenpmconsulting.com</span>
              </a>
              <a
                href="tel:+15712930418"
                className="flex items-center gap-3 hover:text-red transition-colors"
              >
                <Phone size={18} className="shrink-0" />
                <span>+1 571-293-0418</span>
              </a>
              <div className="flex items-center gap-3 text-ink/75">
                <MapPin size={18} className="shrink-0" />
                <span>Virginia, United States</span>
              </div>
            </div>

            <div className="relative flex-1 min-h-[220px] overflow-hidden">
              <ImageWithFallback
                src={contactImg}
                alt="Get in touch with Kaizen"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-7">
            {sent ? (
              <div className="bg-paper border border-border p-10 text-center">
                <span className="rule-red" />
                <h2 className="font-serif mt-4">Thank you, note received.</h2>
                <p className="mt-4 text-ink/70 max-w-md mx-auto">
                  We'll be in touch within two working days.
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setSent(false);
                  }}
                  className="pill pill-ghost mt-8"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-paper border border-border p-8 md:p-10 space-y-7"
              >
                {/* Honeypot: hidden from users, catches bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Don't fill this out
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={update("website")}
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Field
                    label="Your name"
                    placeholder="Jane Hart"
                    value={form.name}
                    onChange={update("name")}
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    placeholder="jane@agency.gov"
                    value={form.email}
                    onChange={update("email")}
                    required
                  />
                </div>
                <Field
                  label="Company / Agency"
                  placeholder="Organization"
                  value={form.company}
                  onChange={update("company")}
                />

                <div>
                  <label className="eyebrow block mb-3">Project type</label>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project type">
                    {projectTypes.map((t) => {
                      const active = selectedType === t;
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          key={t}
                          onClick={() => selectType(t)}
                          style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                          className={`pill ${active ? "pill-primary" : "pill-ghost"} !py-2 !px-4 text-sm`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="eyebrow block mb-3">Tell us about the project</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={update("message")}
                    placeholder="A paragraph is plenty. Links welcome."
                    className="w-full bg-cream border border-border p-4 outline-none focus:border-navy transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="border-l-2 border-red bg-red/5 px-4 py-3 text-sm text-red"
                  >
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-sm text-ink/55">
                    We reply to every note, usually within 48 hours.
                  </p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="pill pill-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending…" : "Send note →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="eyebrow block mb-2">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-b border-border py-3 outline-none focus:border-navy transition-colors"
      />
    </div>
  );
}
