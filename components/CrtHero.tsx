'use client';
import { useEffect, useRef, useState } from 'react';
import s from '@/styles/blocks.module.css';

/** DESIGN.md §3.9 tier gate. Tier 3 never creates a canvas at all. */
function canRender() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === 'number' && mem < 4) return false;
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch { return false; }
}

export default function CrtHero() {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!canRender() || !host.current) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    // ssr:false equivalent — three never enters the server bundle
    import('@/gl/crt').then(({ mount }) => {
      if (cancelled || !host.current) return;
      dispose = mount(host.current, false);
      setLive(true);
    });
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return (
    <div className={s.heroSlot} aria-hidden={!live}>
      <div ref={host} className={s.crtStage} />
    </div>
  );
}
