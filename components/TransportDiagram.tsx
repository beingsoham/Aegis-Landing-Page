'use client';
import { useEffect, useRef, useState } from 'react';
import s from '@/styles/blocks.module.css';

/**
 * §11.2's handover, driven by which step is in view.
 *
 * The manual is explicit that transport independence "is only meaningful if it
 * is demonstrated, not just diagrammed" — so the relay path fails, the direct
 * path takes over, and the session line itself never breaks.
 */
export default function TransportDiagram({ steps }: { steps: { n: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setActive(steps.length - 1); return; }   // final state, no motion

    const items = wrap.current?.querySelectorAll<HTMLElement>('[data-step]');
    if (!items?.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },   // whichever step owns the middle band
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  // 0-1: relay carries it. 2: discovery. 3-4: direct path carries it.
  const relayDown = active >= 1;
  const direct    = active >= 3;
  const finding   = active === 2;

  return (
    <div className={s.transportWrap} ref={wrap}>
      <div className={s.diagramSticky}>
        <svg viewBox="0 0 520 260" className={s.diagram} role="img"
             aria-label={`Network handover, step ${active + 1} of ${steps.length}. ${steps[active]?.body ?? ''}`}>
          {/* relay route */}
          <path d="M70 190 L70 70 L450 70 L450 190"
                className={`${s.link} ${relayDown ? s.linkDead : s.linkLive}`} />
          {/* direct LAN route */}
          <path d="M104 208 L416 208"
                className={`${s.link} ${direct ? s.linkLive : s.linkIdle}`} />

          {/* relay */}
          <g className={relayDown ? s.nodeDead : ''}>
            <rect x="228" y="46" width="64" height="48" rx="3" className={s.node} />
            <text x="260" y="76" className={s.nodeLabel}>RELAY</text>
            {relayDown && (
              <g className={s.cross}>
                <line x1="238" y1="56" x2="282" y2="84" />
                <line x1="282" y1="56" x2="238" y2="84" />
              </g>
            )}
          </g>

          {/* endpoints */}
          <g>
            <rect x="34" y="176" width="70" height="52" rx="3" className={s.node} />
            <text x="69" y="207" className={s.nodeLabel}>ALICE</text>
          </g>
          <g className={finding ? s.finding : ''}>
            <rect x="416" y="176" width="70" height="52" rx="3" className={s.node} />
            <text x="451" y="207" className={s.nodeLabel}>BOB</text>
          </g>

          {/* The packet — same ratchet state either way.
              SMIL does not pick up a `path` attribute change on a running
              animation, so the route is keyed: React remounts the element and
              the animation restarts on the new path. */}
          <circle r="5" className={s.packet} key={direct ? 'lan' : 'relay'}>
            <animateMotion dur="2.6s" repeatCount="indefinite"
              path={direct ? 'M104 208 L416 208' : 'M70 190 L70 70 L450 70 L450 190'} />
          </circle>
        </svg>

        <p className={s.diagramState}>
          <span className={s.diagramRoute}>
            {direct ? 'Direct LAN · Netty TCP' : relayDown ? 'Relay unreachable' : 'Internet relay'}
          </span>
          <span className={s.diagramHold}>ratchet state unchanged · same header · same ciphertext</span>
        </p>
      </div>

      <ol className={s.steps}>
        {steps.map((st, i) => (
          <li className={`${s.step} ${i === active ? s.stepActive : ''}`} key={st.n} data-step={i}>
            <span className={s.stepNum}>{st.n}</span>
            <p className={s.stepBody}>{st.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
