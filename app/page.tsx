import Header from '@/components/Header';
import CrtHero from '@/components/CrtHero';
import ScrollReveal from '@/components/ScrollReveal';
import TransportDiagram from '@/components/TransportDiagram';
import StackObjects from '@/components/StackObjects';
import DecryptedText from '@/components/fx/DecryptedText';
import CountUp from '@/components/fx/CountUp';
import { Shell, Section, Head, Body, Cite, Btn } from '@/components/ui';
import s from '@/styles/blocks.module.css';
import * as C from '@/content/aegis';

export default function Page() {
  return (
    <>
      <Header />
      <ScrollReveal />
      <main id="top">
        <Hero />
        <Problems />
        <Stack />
        <Transport />
        <Architecture />
        <Relay />
        <Gaps />
      </main>
      <Footer />
    </>
  );
}

/* ---- Hero: one shot. The object overlaps up into the headline. --------- */
function Hero() {
  return (
    <section className={s.hero} aria-label="Aegis">
      <div className={s.heroGlow} aria-hidden="true" />
      <Shell>
        <div className={s.heroInner}>
          <p className={s.heroKicker}>{C.hero.eyebrow}</p>
          <h1 className={s.heroTitle}>
            The session <DecryptedText text="survives" speed={34} delay={320} />{' '}
            <em>the network</em>
          </h1>
          <div className={s.heroStage}><CrtHero /></div>
          <p className={s.heroSub}>
            One hybrid session, held across the internet, a bare local network,
            or nothing at all — while the relay never holds the material to read it.
          </p>
          <div className={s.heroCta}>
            <Btn href="#transport">See the handover</Btn>
            <Btn href="#relay" ghost>What the relay sees</Btn>
          </div>
        </div>
      </Shell>
      <p className={s.scrollHint}>Scroll</p>
    </section>
  );
}

function Problems() {
  return (
    <Section label="Why Aegis exists">
      <Head kicker="Why Aegis exists" title="Three problems," split="treated as one"
            sub={C.problems.synthesis} cite="§2" />
      <ul className={s.trio} data-reveal>
        {C.problems.items.map((p, i) => (
          <li className={s.trioItem} key={p.n} style={{ '--i': i } as React.CSSProperties}>
            <span className={s.trioN}>{p.n} · {p.cite}</span>
            <h3 className={s.trioT}>{p.title}</h3>
            <p className={s.trioB}>{p.body}</p>
          </li>
        ))}
      </ul>
      <p className={s.pull} data-reveal>{C.positioning.title}</p>
      <p className={s.pullSub}>{C.positioning.body}<Cite s={C.positioning.cite} /></p>

    </Section>
  );
}

function Stack() {
  return (
    <Section id="stack" label="Cryptographic stack" hairline>
      <Head kicker="Cryptographic stack" title="Never invent" split="a primitive"
            sub={C.stack.lead} cite="§5" decrypt />
      <div className={s.gridStage}>
        <StackObjects gridId="stack-grid" />
        <ul className={s.grid} id="stack-grid">
          {C.stack.items.map((t, i) => (
            <li className={s.tile} key={t.n} data-tile data-reveal style={{ '--i': i } as React.CSSProperties}>
              <div className={s.tileObject} aria-hidden="true" />
              <h3 className={s.tileAlgo}>{t.algo}</h3>
              {t.badge && <span className={s.tileBadge}>{t.badge}</span>}
              <p className={s.tilePurpose}>{t.purpose}</p>
              <p className={s.tileMarquee} aria-hidden="true">{t.marquee}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className={s.formulaK}>The hybrid derivation</p>
      <p className={s.formula} data-reveal>
        root_key = HKDF-SHA-256( <b>SS_X25519</b> ‖ <b className={s.q}>SS_MLKEM</b> , context )
      </p>
      <p className={s.pullSub}>{C.handshake.pullquote}<Cite s={C.handshake.cite} /></p>
    </Section>
  );
}

function Transport() {
  return (
    <Section id="transport" label="Transport independence" hairline>
      <Head kicker="Transport independence" title="It never calls" split="send_over_wifi()"
            sub={C.transport.lead} cite="§11" wide />
      <TransportDiagram steps={C.transport.steps} />
      <ul className={s.modesInline} data-reveal>
        {C.modes.items.map((m) => (
          <li key={m.key}>
            <span className={s.modeKey}>Mode {m.key}</span>
            <strong>{m.title}</strong> — {m.what}
          </li>
        ))}
      </ul>
      <p className={s.pullSub}>{C.modes.closer} <Cite s={C.modes.cite} /></p>
    </Section>
  );
}

function Architecture() {
  return (
    <Section id="architecture" label="System architecture">
      <Head kicker={C.architecture.kicker} title={C.architecture.title}
            split={C.architecture.split} sub={C.architecture.sub}
            cite={C.architecture.cite} wide />
      <figure className={s.diagramPlate} data-reveal>
        {/* Authored on a light ground; inverted to sit on the page without
            redrawing it. The hue-rotate puts the line colours back. */}
        <img src={C.architecture.src} alt={C.architecture.alt} width={1220} height={971} />
        <figcaption>{C.architecture.legend}</figcaption>
      </figure>
    </Section>
  );
}

function Relay() {
  const rows = C.relay.may.map((m, i) => [m, C.relay.never[i]] as const);
  return (
    <Section id="relay" label="The blind relay" hairline>
      <Head kicker="The blind relay" title="What the server" split="cannot see"
            sub={C.relay.lead} cite="§14" decrypt />
      <div className={s.ledger} data-reveal>
        <div className={s.ledgerRow}>
          <div className={`${s.ledgerCell} ${s.ledgerHeadCell} ${s.headMay}`}>May hold</div>
          <div className={`${s.ledgerCell} ${s.ledgerHeadCell} ${s.headNever}`}>Must never hold</div>
        </div>
        {rows.map(([may, never]) => (
          <div className={s.ledgerRow} key={never}>
            <div className={`${s.ledgerCell} ${s.mayCell}`}>{may}</div>
            <div className={`${s.ledgerCell} ${s.neverCell}`}>{never}</div>
          </div>
        ))}
      </div>
      {/* §14.3 — never cut, never shrunk */}
      <p className={s.pull} data-reveal>{C.metadata.headline}</p>
      <p className={s.pullSub}>{C.metadata.body}<Cite s={C.metadata.cite} /></p>
    </Section>
  );
}

function Gaps() {
  return (
    <Section label="Known gaps" hairline>
      <Head kicker="Known gaps" title="What is decided," split="and what is not yet built"
            sub={C.gaps.rule} cite="§19" wide />
      <div className={s.tableWrap} data-reveal>
        <table className={s.table}>
          <thead><tr><th scope="col">Open item</th><th scope="col">Current status</th></tr></thead>
          <tbody>
            {C.gaps.rows.filter((r) => r.critical || C.gaps.rows.indexOf(r) < 2).map((r) => (
              <tr key={r.item}>
                <td>{r.item}</td>
                <td className={r.critical ? s.critical : undefined}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className={s.footer}>
      <Shell>
        <div className={s.footerLinks}>
          {C.footer.links.map((l) => <a className={s.footerLink} key={l.label} href={l.href}>{l.label}</a>)}
        </div>
        <dl className={s.meta}>
          <dt>Team</dt><dd>{C.footer.team.name}</dd>
          <dt>Problem statement</dt><dd>{C.footer.team.psId} · {C.footer.team.psTitle}</dd>
          <dt>Theme</dt><dd>{C.footer.team.theme}</dd>
          <dt>Institution</dt><dd>{C.footer.team.institution}</dd>
          <dt>Event</dt><dd>{C.footer.team.event}</dd>
        </dl>
        <ul className={s.disclaimers}>
          {C.footer.disclaimers.map((d) => (
            <li key={d.ref}>{d.text} <a href="#">{d.ref}</a></li>
          ))}
        </ul>
        <p className={s.notice}>{C.footer.notice}</p>
      </Shell>
    </footer>
  );
}
