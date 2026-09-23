import s from '@/styles/ui.module.css';
import DecryptedText from '@/components/fx/DecryptedText';

export const Shell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={[s.shell, className].filter(Boolean).join(' ')}>{children}</div>
);

export function Section({
  id, label, hairline, children,
}: { id?: string; label?: string; hairline?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} aria-label={label} className={[s.section, hairline ? s.hairline : ''].filter(Boolean).join(' ')}>
      <Shell>{children}</Shell>
    </section>
  );
}

/** Centred title block. `split` puts the tail of the headline in the
 *  secondary value, which is what gives this design its depth. */
export function Head({
  kicker, title, split, sub, cite, wide, small, decrypt,
}: {
  kicker: string; title: string; split?: string; sub?: string;
  cite?: string; wide?: boolean; small?: boolean; decrypt?: boolean;
}) {
  const cls = [s.title, small ? s.titleSm : ''].filter(Boolean).join(' ');
  return (
    <div className={[s.head, wide ? s.headWide : ''].filter(Boolean).join(' ')} data-reveal>
      <p className={s.kicker}>{kicker}</p>
      <h2 className={cls}>
        {decrypt ? <DecryptedText text={title} speed={18} /> : title}
        {split && <> <em>{split}</em></>}
      </h2>
      {sub && <p className={s.sub}>{sub}{cite && <Cite s={cite} />}</p>}
    </div>
  );
}

export const Body = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={[s.body, className].filter(Boolean).join(' ')}>{children}</p>
);
export const Mono = ({ children }: { children: React.ReactNode }) => <span className={s.mono}>{children}</span>;
export const Cite = ({ s: sec }: { s: string }) => (
  <span className={s.cite} aria-label={`Manual section ${sec.replace('§', '')}`}>{sec}</span>
);
export const Btn = ({ children, href, ghost }: { children: React.ReactNode; href?: string; ghost?: boolean }) => {
  const cls = [s.btn, ghost ? s.btnGhost : ''].filter(Boolean).join(' ');
  return href ? <a className={cls} href={href}>{children}</a> : <button type="button" className={cls}>{children}</button>;
};
