export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-cream">
      <div className="marquee flex whitespace-nowrap py-5">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-serif text-[1.4rem] text-ink/90">
            {t}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
          </span>
        ))}
      </div>
    </div>
  );
}
