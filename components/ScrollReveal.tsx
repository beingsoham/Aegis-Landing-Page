'use client';
import { useEffect } from 'react';

/**
 * One observer for the whole page. Elements opt in with data-reveal, and
 * stagger via a --i custom property.
 *
 * The hidden state is gated behind data-reveal-ready on <html>, which only
 * this component sets — so if JS fails or is blocked, nothing is ever hidden.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;                       // render the final state, don't animate to it

    root.setAttribute('data-reveal-ready', '');
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

    const pending = new Set<HTMLElement>(targets);
    const reveal = (el: HTMLElement) => {
      el.classList.add('isRevealed');
      pending.delete(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          reveal(e.target as HTMLElement);
          io.unobserve(e.target);              // reveal once, never re-hide
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    targets.forEach((t) => io.observe(t));

    /* Backstop. The gate hides content, so if the observer never delivers —
       an old engine, a lifecycle that doesn't run it — the page would be
       blank. A rAF-throttled scroll check reveals anything in view anyway,
       and a timeout reveals everything if nothing has fired at all. */
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const limit = window.innerHeight * 0.88;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) { reveal(el); io.unobserve(el); }
      });
      if (!pending.size) detach();
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const failsafe = window.setTimeout(() => pending.forEach(reveal), 4000);
    sweep();

    function detach() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
    return () => {
      io.disconnect();
      detach();
      clearTimeout(failsafe);
      root.removeAttribute('data-reveal-ready');
    };
  }, []);

  return null;
}
