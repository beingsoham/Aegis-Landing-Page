'use client';
import { useEffect, useRef } from 'react';
import s from '@/styles/blocks.module.css';

/** Mounts the six tile objects into one canvas layered behind the grid. */
export default function StackObjects({ gridId }: { gridId: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    try { if (!document.createElement('canvas').getContext('webgl2')) return; } catch { return; }

    const grid = document.getElementById(gridId);
    const tiles = grid ? Array.from(grid.querySelectorAll<HTMLElement>('[data-tile]')) : [];
    if (!host.current || tiles.length === 0) return;

    let dispose: ((() => void) & { setHover: (i: number, on: boolean) => void }) | undefined;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    import('@/gl/tiles').then(({ mount }) => {
      if (cancelled || !host.current) return;
      dispose = mount(host.current, tiles);
      host.current.dataset.live = 'true';
      tiles.forEach((tile, i) => {
        const on = () => dispose?.setHover(i, true);
        const off = () => dispose?.setHover(i, false);
        tile.addEventListener('pointerenter', on);
        tile.addEventListener('pointerleave', off);
        tile.addEventListener('focusin', on);
        tile.addEventListener('focusout', off);
        cleanups.push(() => {
          tile.removeEventListener('pointerenter', on);
          tile.removeEventListener('pointerleave', off);
          tile.removeEventListener('focusin', on);
          tile.removeEventListener('focusout', off);
        });
      });
    });

    return () => { cancelled = true; cleanups.forEach((c) => c()); dispose?.(); };
  }, [gridId]);

  return <div ref={host} className={s.stackCanvas} aria-hidden="true" />;
}
