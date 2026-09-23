'use client';
import { useEffect, useRef, useState } from 'react';
import s from '@/styles/blocks.module.css';

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setStuck(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <header className={`${s.header} ${stuck ? s.headerStuck : ''}`}>
      <div className={s.headerInner}>
        <a className={s.wordmark} href="#top">
          <svg width="16" height="19" viewBox="0 0 16 19" fill="none" aria-hidden="true">
            <path d="M8 1 1 3.6v5.6C1 13.6 4 17 8 18c4-1 7-4.4 7-8.8V3.6L8 1Z"
                  stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          Aegis
        </a>
        <nav className={s.nav} aria-label="Sections">
          <a className={s.navLink} href="#stack">Stack</a>
          <a className={s.navLink} href="#transport">Transport</a>
          <a className={s.navLink} href="#relay">Relay</a>
        </nav>
      </div>
      <div className={s.progress} ref={bar} aria-hidden="true" />
    </header>
  );
}
