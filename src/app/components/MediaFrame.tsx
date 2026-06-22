import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps an image in an overflow-clipped frame that wipes into view on scroll
 * and gently zooms on hover. Keeps the motion logic in one place so every
 * image on the site animates consistently.
 */
export function MediaFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`media-frame media-reveal ${shown ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
