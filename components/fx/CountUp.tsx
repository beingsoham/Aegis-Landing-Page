'use client';
import { useEffect, useRef, useState } from 'react';

/** Counts to a value when scrolled into view. ReactBits technique. */
export default function CountUp({
  to, suffix = '', duration = 1100, className,
}: { to: number; suffix?: string; duration?: number; className?: string }) {
  const [n, setN] = useState(0);
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return; }
    const el = host.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);

  return <span ref={host} className={className}>{n}{suffix}</span>;
}
