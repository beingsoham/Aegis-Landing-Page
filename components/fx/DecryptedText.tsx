'use client';
import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Text that scrambles, then resolves, when it enters view.
 *
 * Technique from ReactBits' "Decrypted Text", rebuilt for this codebase.
 * It is the page's organising motif because it is literally what the product
 * does — and it rhymes with the CRT's Hello World loop.
 *
 * Accessibility: the real string is always in the DOM for assistive tech;
 * only an aria-hidden layer scrambles. Reduced motion skips it entirely.
 */
export default function DecryptedText({
  text, as: As = 'span', className, speed = 28, delay = 0,
}: {
  text: string; as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  className?: string; speed?: number; delay?: number;
}) {
  const [shown, setShown] = useState(text);
  const host = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = host.current;
    if (!el) return;

    let raf = 0, timer = 0, frame = 0;
    const run = () => {
      const revealed = Math.floor(frame / 2);
      setShown(
        text
          .split('')
          .map((ch, i) =>
            i < revealed || ch === ' ' ? ch : CHARS[(Math.random() * CHARS.length) | 0],
          )
          .join(''),
      );
      frame++;
      if (revealed <= text.length) raf = window.setTimeout(run, speed);
      else setShown(text);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(raf); clearTimeout(timer); };
  }, [text, speed, delay]);

  return (
    <As ref={host as never} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </As>
  );
}
