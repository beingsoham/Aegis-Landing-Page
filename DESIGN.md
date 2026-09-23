---
version: alpha
name: Aegis-landing-design-system
description: "A near-black defense-grade canvas built on #101010 with a single signal-yellow accent (#FFD600) carried from the Buttermax visual system. The page alternates two grounds only — ink and accent — and every section boundary is that inversion. Display type is an uppercase geometric grotesque set at 0.83 leading and -0.05em tracking so lines collide; standards names (ML-KEM-768, FIPS 203) are always mono, because on a cryptography page a standard set in the display face reads as branding rather than citation. A persistent WebGL canvas carries nine product-lit 3D objects on a hairline square grid. Restraint is the rule: one accent, one easing curve, one pinned section. Source of truth for all copy is Aegis_System_Documentation_Manual.docx, cited inline as §n."

colors:
  primary: "#FFD600"
  on-primary: "#101010"
  ink: "#101010"
  ink-inverse: "#FFD600"
  canvas: "#101010"
  canvas-accent: "#FFD600"
  text-muted: "#868686"
  hairline: "rgba(16,16,16,0.10)"
  hairline-inverse: "rgba(255,214,0,0.15)"
  critical: "#C4453B"
  glass-tint: "#1a1a1a"
  bloom-tint: "#fff38a"

typography:
  display-xl:
    fontFamily: Aegis Display
    fontSize: 72px
    fontWeight: 700
    lineHeight: 0.83
    letterSpacing: -3.6px
    textTransform: uppercase
  display-lg:
    fontFamily: Aegis Display
    fontSize: 38px
    fontWeight: 700
    lineHeight: 0.83
    letterSpacing: -1.9px
    textTransform: uppercase
  display-md:
    fontFamily: Aegis Display
    fontSize: 28px
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: -1.4px
    textTransform: uppercase
  marquee:
    fontFamily: Aegis Display
    fontSize: 150px
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: -7.5px
    textTransform: uppercase
  body-lg:
    fontFamily: Aegis Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: -0.32px
  body:
    fontFamily: Aegis Text
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: -0.26px
  ui:
    fontFamily: Aegis Text
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.7px
    textTransform: uppercase
  annotation:
    fontFamily: Aegis Text
    fontSize: 8px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.4px
  mono:
    fontFamily: Aegis Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0px

rounded:
  none: 0px
  button: 20px
  pill: 200px
  circle: 50%

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter-sm: 30px
  gutter-lg: 141px
  gutter-xl: 207px
  header: 130px
  section: 130px
  section-lg: 184px

components:
  pill-button:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: "2px solid {colors.primary}"
    typography: "{typography.ui}"
    rounded: "{rounded.button}"
    size: 109px 36px
  pill-button-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    note: "::before scaleY(0)->1, transform-origin top, 0.45s"
  grid-tile:
    backgroundColor: "{colors.canvas-accent}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.none}"
    aspectRatio: "1 / 1"
  grid-tile-hover:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.marquee}"
  tile-label:
    typography: "{typography.mono}"
    textColor: "{colors.ink}"
    position: "bottom-left, 35px 32px"
  header:
    height: 130px
    blendMode: difference
    typography: "{typography.ui}"
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: "2px solid {colors.primary}"
    rounded: "{rounded.pill}"
    padding: 10px 16px
  table-row-critical:
    textColor: "{colors.critical}"
    typography: "{typography.body-lg}"
---

# Aegis — Landing Page Design System

## Overview

A landing page for **Aegis**, a post-quantum secure communications overlay.

**Source of truth is `Aegis_System_Documentation_Manual.docx`.** Every claim, number and
line of copy traces to a section, cited inline as §n. Nothing here describes source
code, a repository, or a demo build — the subject is the project as documented.

**Audience is all three at once:** SIH judges, recruiters, developers. That sets the
structure — thesis and demo land in the first two screens for skimmers, engineering
depth sits through the middle, and §20's Judge FAQ closes the page for judges who want
to interrogate it.

**Visual reference** is [buttermax.net](https://buttermax.net) — their *system* only.
No copy, logo, font or asset file of theirs is reused.

**The governing restraint:** one accent, one easing curve, one pinned section, one
hero formula. Everything bold happens in the type and the grid; everything else stays
quiet.

---

## Colors

Three colors plus one semantic. The page is a **two-tone flip** — thesis and grid
sections sit on `canvas-accent` with ink type; demo, threat-model and footer sit on
`canvas` with accent type. Every section boundary is that inversion, and that rhythm
*is* the layout. Never introduce a third ground.

`critical` (`#C4453B`) is semantic, not decorative, and appears in exactly two places:
the threat-model row reading "not mitigated while the compromise is active" (§15) and
the known-gaps row reading "not performed" (§19). Using it anywhere else destroys its
meaning.

`glass-tint` and `bloom-tint` are WebGL material values, never CSS.

No light/dark mode — this is a single committed look. Paint `body` explicitly.

## Typography

One display family, one mono. Display: a tight geometric grotesque — *PP Neue
Montreal* or *Söhne Breit*; free alternative **Archivo** or **Outfit**. Mono: *JetBrains
Mono* or *Söhne Mono*. `html { font-size: 62.5% }` so 1rem = 10px.

### Principles

- Display and UI are uppercase. Body is sentence case.
- Display leading is `0.83` — lines collide deliberately. Do not loosen it.
- Hero lines offset individually: first line `margin-left: auto`, `margin-top: -0.25em`.
- **Mono is a load-bearing role, not decoration.** `ML-KEM-768`, `HKDF-SHA-256`,
  `SS_X25519 ∥ SS_MLKEM` are always mono. A standards name set in the display face
  reads as branding, and this page's credibility depends on it reading as citation.
  Carry the document number (FIPS 203, FIPS 204, RFC 7748) on first use.
- Tables get `font-variant-numeric: tabular-nums`.
- Running body copy stays near 65 characters.

## Layout

### Grid & container

Breakpoints `768` · `1025` · `1200` · `1700`. Gutter `gutter-sm` → `gutter-lg` (≥1025)
→ `gutter-xl` (≥1700). Section rhythm: `section` top, 100px bottom, `section-lg`
between a copy block and a grid.

The object grid is `display: flex; flex-wrap: wrap` with container
`box-shadow: -1px -1px 0 0 {colors.hairline}` and items `box-shadow: 1px 1px 0 0`.
That is how the hairline grid is drawn without doubled borders. Items are `100%` →
`50%` (≥768) → `33.33%` (≥1025), forced square via `height: 0; padding-top: 100%`.

### Viewport height

`--vh` set from JS (`innerHeight * 0.01`), consumed as `calc(var(--vh, 1vh) * 100)`.
Recompute on `resize` only, never on `scroll`.

### Whitespace philosophy

Generous to the point of feeling expensive, then violated exactly once — the hero
display stack, where `0.83` leading makes lines overlap. That contrast is the whole
typographic idea.

## Elevation & Depth

No shadows. Depth comes from three sources only: the hairline grid, the
`mix-blend-mode: difference` header, and the WebGL layer's bloom and gamma. A
drop-shadow anywhere on this page is a bug.

## Shapes

Right angles everywhere except controls. Grid tiles are hard-cornered squares; buttons
are `rounded.button`; footer links are `rounded.pill`; the menu trigger is
`rounded.circle`. No `border-radius` on cards, tables or images.

## Motion

```css
--ease: cubic-bezier(0.215, 0.61, 0.355, 1);   /* the only curve on the page */
```

| Duration | Used for |
|---|---|
| `0.3s` | link color |
| `0.45s` | button fill wipe, theme transitions |
| `0.65s` | menu overlay open, tile reveal |
| `0.75s` | header hide/show, hero line rise |
| `2.75s` | menu overlay close (deliberately asymmetric) |

`transform` / `opacity` / `clip-path` only — never animate `width`, `height` or
layout properties.

**Exactly one section pins** (Block 8). Pinning forces layout reflow and fights native
scroll; more than one or two per page hurts mobile badly. Scrub with `scrub: 1`, not an
instant jump.

Call `ScrollTrigger.refresh()` after fonts and images load — `next/font` swaps metrics
after first paint and stale trigger positions are the classic symptom.

Under `prefers-reduced-motion: reduce`: opacity fades at `0.2s`, no preloader, no
marquee, no pinning, **no canvas at all**. Use `gsap.matchMedia()` so the final state
renders immediately rather than being animated to.

## Components

### Pill button

`109×36`, `rounded.button`, `2px` accent border. A `::before` sits at `scaleY(0)` with
`transform-origin: top`; on hover `transform: none; transform-origin: bottom`,
`0.45s var(--ease)`, label flips to `on-primary`. It wipes **down** on enter and
retracts **down** on leave. Hidden below 1025 — only the menu trigger remains.

### Grid tile

Layers, back to front: background (`canvas-accent`) · border (`1px solid`,
`opacity: 0.1`) · **device** (the 3D object, `75%×75%`, centred) · marquee (headline
scrolling horizontally, revealed on hover — background wipes to `canvas`, type to
accent) · label (bottom-left: algorithm in mono, purpose in body, `01`–`06`
superscript in `annotation`) · badge (bottom-right: FIPS 203, RFC 7748 …).

Reveal: fade + `translateY(2rem) → 0` on intersection, row-major stagger `60ms`,
`0.65s`, once only.

### Header

`position: fixed`, `height: 130px`, `z-index: 999999`, `pointer-events: none` with
children re-enabling it, `mix-blend-mode: difference`. Left: `AEGIS` wordmark. Centre:
a masked status glyph using `background-color: currentColor`. Right: two pill buttons
plus the menu trigger.

Scroll: inner row translates up by its own height on scroll-down, restores on
scroll-up, `0.75s`. Header hover forces `transform: none !important`.

### Menu overlay

Full viewport, accent on ink, `clip-path: inset(10%) → inset(0)` over `0.65s`; closes
over `2.75s`. Trigger is a `22px` filled circle with two 2px lines that rotate to
`±45deg` and scale to `2` when open.

---

## Page Blueprint

Sixteen blocks. Long deliberately — judges read all of it; skimmers get the thesis and
the demo in two screens.

| # | Block | § | Ground | The artifact |
|---|---|---|---|---|
| 0 | Preloader | — | ink | shield draws in, capsule progress bar |
| 1 | Header | — | blend | — |
| 2 | Hero | §1 | accent | the one-sentence claim |
| 3 | Three problems | §2 | ink | HNDL · network dependency · server trust |
| 4 | Honest positioning | §3.1 | accent | "We did not invent post-quantum messaging" |
| 5 | Three claims | §3.2 | ink | each independently demonstrable |
| 6 | Cryptographic stack | §5 | accent | **the 3D object grid** |
| 7 | Hybrid handshake | §6 | ink | the HKDF formula + four requirements |
| 8 | Transport independence | §11 | ink | **pinned five-step handover** |
| 9 | Three modes | §13 | accent | A / B / C |
| 10 | Blind relay | §14.1 | ink | may-hold vs must-never-hold table |
| 11 | Metadata caveat | §14.3 | accent | "'The server sees nothing' is false" |
| 12 | Threat model | §15 | ink | nine adversaries |
| 13 | Not claiming | §3.3 | accent | the four avoided claims |
| 14 | Known gaps | §19 | ink | the tense rule + open items |
| 15 | Judge FAQ | §20 | accent | accordion |
| 16 | Footer | §22 | ink | team, SIH, prototype notice |

### Block 2 — Hero

Height `calc(var(--vh) * 100 - 130px)`. The accent mask extends above the fold by the
header height so the blend-mode header sits on unbroken yellow.

Eyebrow at `left: 7.6vw; top: 30%`: `POST-QUANTUM SECURE COMMUNICATIONS OVERLAY`

Display stack, bottom-aligned, `fit-content`:

```
THE SESSION           ← flush right, margin-top: -0.25em
SURVIVES
THE NETWORK
```

Body beneath, 30% width:

> Two endpoints establish and maintain a quantum-resistant encrypted session whose
> security does not depend on any particular network path — and whose relay
> infrastructure never possesses the material required to read the messages it
> carries. §1

**The hero must not lead with the primitives.** §1.1 is explicit that another
post-quantum chat app is "a re-implementation of a solved problem" — Signal shipped
PQXDH in production. Leading with *X25519 + ML-KEM* pitches the commodity half and
loses the comparison. Transport independence is the contribution; it is the headline.

Entry: each line rises `translateY(100%) → 0` from an `overflow: hidden` clipping row,
staggered `80ms`, `0.75s`. If SplitText is used for character stagger, call
`split.revert()` on unmount so screen readers get the original text nodes back.

**The CRT set sits right, type stacks bottom-left.** That keeps the asymmetry and stops
the lit screen competing with the display type. Do not place the CRT near Block 10 —
that section's claim is that the relay *cannot* decrypt, and a visibly decrypting screen
beside it reads as a contradiction.

### Block 3 — Three problems

Ink ground, eyebrow `WHY AEGIS EXISTS`. Three numbered columns — numbering is
legitimate here because §2 genuinely is a set of three.

**01 Harvest now, decrypt later** (§2.1) · an adversary records ciphertext today and
decrypts it once capable quantum hardware exists; it needs only that the plaintext
still matters in ten years, already true for government, defense, medical and legal
traffic.
**02 Network dependency** (§2.2) · almost every secure messenger assumes a reachable
central server; in disaster zones, rural regions and temporary command posts that path
is frequently unavailable even while two devices sit on the same local network.
**03 Server trust** (§2.3) · a reachable server is still a single point of compromise —
hackable, misconfigurable, legally compellable.

Close with §2.4: *Aegis treats these as one design problem, not three features bolted
together.*

### Block 4 — Honest positioning

Accent ground. Unusual for a landing page, and the strongest credibility move
available — §3.1 exists because judges familiar with the space will ask.

> WE DID NOT INVENT POST-QUANTUM MESSAGING.

Body, right-set at 30%: Signal shipped PQXDH; PQCChat offers browser-based
post-quantum messaging with ML-KEM and ML-DSA. Aegis does not compete on chat
features, UX or ecosystem maturity — it would lose that comparison. It targets the
problem underneath all of them: every one assumes a central server is reachable.

### Block 5 — Three claims

Three cards, each labelled **independently demonstrable** (§3.2): hybrid post-quantum
security (§6) · demonstrated transport independence (§11) · a blind relay (§14).

### Block 6 — Cryptographic stack *(the object grid)*

Opens with §5's governing rule as a display line:

> NEVER INVENT A CRYPTOGRAPHIC PRIMITIVE.

Six tiles, 3×2 at desktop — §5's six primitives:

| # | Algorithm (mono) | Purpose | Marquee | Badge |
|---|---|---|---|---|
| 01 | `ML-KEM-768` | Lattice-based (Module-LWE). Establishes a shared secret. | THE QUANTUM HALF | FIPS 203 |
| 02 | `X25519` | Elliptic-curve Diffie-Hellman. The classical half. | THE CLASSICAL HALF | RFC 7748 |
| 03 | `ML-DSA-65` | Signs identity and pre-key bundles. | WHO THE KEY BELONGS TO | FIPS 204 |
| 04 | `HKDF-SHA-256` | Combines both secrets into a root key. | TWO SECRETS, ONE KEY | RFC 5869 |
| 05 | `AES-256-GCM` | Authenticated encryption of the payload. | CONFIDENTIALITY AND INTEGRITY | SP 800-38D |
| 06 | `Double Ratchet` | Replaces message keys continuously. | THE KEY NEVER SITS STILL | — |

Close with §5's warning, small, in `text-muted`: *"Combining two algorithms
automatically makes the system secure." It does not, by itself.*

### Block 7 — Hybrid handshake

The construction (§6.2), set large in mono — the page's one hero formula:

```
root_key = HKDF-SHA-256( SS_X25519 ∥ SS_MLKEM , context )
```

With §6.2 beneath: *the shared secret is never transmitted — ML-KEM produces a
ciphertext only the holder of the matching private key can decapsulate. The ciphertext
is not the secret.*

Then §6.3's four requirements as a numbered checklist — fixed concatenation order ·
context binding in HKDF · downgrade resistance · key confirmation. Pull-quote to close:

> Key establishment ≠ authentication. ML-KEM guarantees two parties arrive at the same
> secret. It says nothing about who is on the other end.

### Block 8 — Transport independence *(the centrepiece, the one pinned section)*

§11.1: *"This is the architectural property the project is actually trying to prove,
and it is only meaningful if it is demonstrated, not just diagrammed."* The page obeys
that — this block is an animation, not a diagram.

> IT CALLS `send(ciphertext)`. IT NEVER CALLS `send_over_wifi()`.

The five-step handover (§11.2), scroll-scrubbed:

1. Alice and Bob chatting through the internet relay.
2. The router fails; Alice's transport manager detects it — connection error / heartbeat timeout.
3. JmDNS resolves Bob's presence and address on the local network.
4. A direct Netty TCP connection is established.
5. The next packet — **same ratchet state, same header format, same ciphertext structure** — goes over that connection. No renegotiation, no new handshake.

Scroll drives the 3D session thread re-routing while never breaking. That continuous
line *is* the argument.

**§11.2's scope note goes on the page**, in `text-muted`: *detecting relay failure,
discovering the peer and switching transports seamlessly is transport-manager logic
that must be built and tested — it is not automatic just because the crypto layer is
transport-agnostic. What the architecture guarantees is that the ratchet sequence and
cryptographic state remain valid across the switch.*

### Block 9 — Three modes

§13's three named conditions as columns. **A — Connected**: client → relay → client.
**B — Locally connected**: no internet, peers share a LAN; the direct path carries the
same encrypted session. **C — Temporarily disconnected**: messages encrypted and queued
locally; delivery resumes when any transport returns.

> THE ENCRYPTION STEP IS IDENTICAL IN ALL THREE. ONLY DELIVERY CHANGES.

### Block 10 — Blind relay

§14.1's two-column table, set large and centred. This is a hero table, not a footnote.

| The server **may** hold | The server **must never** hold |
|---|---|
| Account / user identifiers | Plaintext message content |
| Public identity keys and signatures | Private identity keys |
| Public pre-key bundles (X25519, ML-KEM) | Root keys |
| Encrypted message packets | Chain keys |
| Temporary offline-delivery queues | Message keys |
| Connection / session metadata | Any ratchet state |

Left column in `text-muted`, right in accent at full weight — the asymmetry is the
point. Beneath, §14.2 (verifiable by live database inspection) and §14.4 on TLS:
*TLS secures the connection to the server — the server is one endpoint of it and can
read what passes through. Aegis encrypts at the application layer, so the packet the
server relays is already ciphertext it cannot open.*

Object: the magnifying glass.

### Block 11 — Metadata caveat

**Mandatory. Must not be cut or shrunk.** §14.3 names it as "the single easiest way to
lose credibility on this project." Full display size:

> "THE SERVER SEES NOTHING" IS FALSE, AND WE DO NOT CLAIM IT.

Body: even a correctly built blind relay observes metadata — which accounts
communicate, timing, frequency, approximate sizes, connection information. Content
confidentiality and metadata privacy are different properties. Aegis does not claim
metadata protection.

### Block 12 — Threat model

§15's nine adversary classes as a full-width three-column table (adversary ·
capability · what limits them), `overflow-x: auto` on mobile. The **compromised
endpoint (active)** row uses `critical` on "not mitigated while the compromise is
active." Follow with §15.2's four explicit non-defences.

### Block 13 — Not claiming

§3.3's four avoided claims at full body size, not fine print: not certified or
integrated with any specific military radio, waveform or classified network · not a
solved military key-management system · not "unhackable", "quantum-proof" or "100%
secure" · not ready for military deployment.

### Block 14 — Known gaps

Lead with §19's classification rule verbatim — the most impressive sentence in the
document:

> "We plan to" is never rewritten as "we have implemented." "Estimated" is never
> rewritten as "measured." "Should be secure" is never rewritten as "is proven
> secure."

Then §19.1's open-items table using the manual's own status vocabulary. Include the
final row plainly, in `critical`: **formal protocol verification / independent
cryptographic audit — not performed.**

### Block 15 — Judge FAQ

§20's seventeen questions as a real `<button aria-expanded>` accordion, closed by
default, one open on load.

### Block 16 — Footer

`calc(var(--vh) * 40)`. Footer-link pills: `DOCUMENTATION` · `ARCHITECTURE` ·
`RESEARCH`. Team block from §22.

**The footer is where every disclaimer lives, hyperlinked.** Rather than captioning
individual objects and sections, all qualifications collect here, each linking to the
manual section that states it in full — the adversary model as illustration, the
metadata caveat (§14.3), the four avoided claims (§3.3), the open items (§19), and the
absence of formal verification. Objects elsewhere on the page carry no captions; they
are atmosphere, and the footer carries the record.

Copyright row in `text-muted`:
`AEGIS — PROTOTYPE. NOT AUDITED. NOT FOR PRODUCTION USE.`

---

## The WebGL Layer

Buttermax is not a CSS site with some canvas on top — roughly half of what you see is a
persistent WebGL canvas running a bespoke in-house engine (`app.<cacheid>.js`, ~1.1MB,
self-identifying as *Hydra/UIL*, driven by a 2,879-key scene config). We do not rebuild
their engine. What follows reproduces the *look* on stock three.js; their measured
values are quoted because matching those numbers is most of the battle.

### Stack

`three` + `@react-three/fiber` + `drei` + `@react-three/postprocessing`. Loaders:
`KTX2Loader`, `DRACOLoader`, `MeshoptDecoder`. One canvas, `position: fixed`, full
viewport, persisting for the whole page — never torn down per section.

**Two renderer rules that are easy to get wrong:**

```js
// antialias can ONLY be set at construction — assigning it later has no effect
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// a bare canvas announces nothing to a screen reader
renderer.domElement.setAttribute('role', 'img');
renderer.domElement.setAttribute('aria-label',
  'Animated diagram: an encrypted session re-routing between internet, local network and queued delivery.');
```

### Camera rig

Cameras are **named shots**, not a free camera — each stores `position`, `lookAt`,
`fov`, `zoom`, `groupPos`, `moveXY`. Buttermax's live values as a starting range:

```
shot-1   position [0, 0, 5]                fov 35   lookAt [0,0,0]
shot-2   position [2.248, 2.211, 1.126]    fov 20
shot-3   position [-2.35, 4.2, 6]          fov 35
shot-4   position [5, -4, 6]               fov 35
```

Scroll interpolates between adjacent shots; `moveXY` adds damped mouse parallax, never
more than a few hundredths of a unit. The low `fov` (20–35) is doing much of the work —
objects read as product photography, not game camera.

### Post-processing

The single biggest contributor to the look. Buttermax's live composite uniforms:

```js
bloomScale:          [0.9, 2.0]
bloomRadius:         0.5        // engine pass: 0.6
bloomStrength:       1.0        // engine pass: 0.1 — the subtle one is what shows
bloomTint:           '#fff38a'  // warm, biased toward the accent
luminosityThreshold: 1.0        // only genuine highlights bloom
brightness:          1.0
finalGamma:          0.622      // APPLY AS pow(c, 1.0/0.622) — see note below
rgbShiftAmount:      0.05
rgbShiftAngle:       1.02       // radians
```

Order: render → luminosity threshold → bloom → composite (RGB shift, exposure, gamma)
→ screen. **Copy `finalGamma: 0.622` and the warm bloom tint verbatim** — those two
values are most of the house look.

**Gamma direction matters and is easy to get backwards.** Applied as `pow(c, 0.622)` an
exponent below 1 *lifts* midtones and the whole page turns flat grey — near-black
`#101010` comes out around `#373737`. The crushed, rich look comes from
`pow(c, 1.0/0.622)` ≈ `pow(c, 1.608)`, which deepens midtones and holds blacks at
black. Because that curve is aggressive, the composite also needs an **exposure
multiply before the gamma** (~1.6) or everything below the highlights goes muddy.

### Shaders

Build: `GlassShaderPBR` (hero object) · `DotShader` / `RevealingDotShader` (background
texture) · `CircleGridShader` · `BorderRectShader` · `BackgroundShader` ·
`DeviceTextureShader`. Skip: `LottieShader`, `MotionVecShader`, `MSDFTextureShader`.

Glass uniforms, live values:

```js
uTint: '#1a1a1a'   uFresnelPow: 10.0   uFrostedIntesity: 0.3
uMRON: [1.0, 1.3, 1.0, -0.35]          uEnv: [10, 10, 0]
```

Env is **baked into textures** (`tEnvDiffuse`, `tEnvSpecular`), not a runtime HDR
probe — cheaper, and it keeps lighting art-directed.

### Mouse fluid sim — tier 1 only

```js
simSize: 128, dyeSize: 512, iterations: 10,
velocity: 0.985, density: 0.95, pressure: 8.0, curl: 0, defaultRadius: 30
```

`curl: 0` is the notable one — no vorticity confinement, so it smears rather than
swirls. Reads as heat-haze, not a fluid toy. Cut this first if time is short.

### Objects

Buttermax's object family. Their full set: boombox, gameboy, floppy, cassette, tape
recorder, laptop, subwoofer, printer, polaroid, controller, glove, dashboard, keycard,
headphones, magnifying glass, tablet. Nine are used, assigned by **mechanism** so each
means something:

**Hero (Block 2) — the CRT set.** A cathode-ray television, angled on the right of the
hero, cursor-reactive, screen cycling ciphertext → plaintext. Concrete beats abstract:
this is the most legible possible image of encrypted communication, and it anchors the
retro-device family the rest of the grid belongs to. Full spec in *The CRT Object*
below.

**Block 8 — the session thread.** One continuous illuminated line between two endpoints
that re-routes across bearers, never breaking, never re-forming. It lives only here,
where a line re-routing *is* the section's argument. Carries the full `GlassShaderPBR`
treatment.

| Tile | Object | Why |
|---|---|---|
| `ML-KEM-768` | floppy disk | a sealed capsule — the shutter closes over the contents |
| `X25519` | keycard | the classical key: fast, small, swipe-and-done |
| `ML-DSA-65` | printer | emits a signed, verifiable artifact |
| `HKDF-SHA-256` | tape recorder | two inputs mixed down to one master |
| `AES-256-GCM` | boombox | plays the actual payload |
| `Double Ratchet` | cassette | the spool advances and never returns — literally a ratchet |

Block 10: magnifying glass (§14.2's claim is "verifiable by inspection"). Block 8: two
laptops as the endpoints.


### The CRT object

The hero. It does not rotate freely and it does not spin — it **turns to face the
cursor**, within a small clamped range, like a heavy piece of furniture being looked at.

**Screen content.** The classic, and the one every developer recognises:

```
SGVsbG8gV29ybGQh   ⇄   Hello World!
```

`SGVsbG8gV29ybGQh` is the **actual base64 of "Hello World!"** — not decorative noise.
A developer who decodes it by eye gets a second-level easter egg, and it costs nothing.
Three lines on a 640×480 canvas: `AEGIS · AES-256-GCM` (muted) / the resolving field
(large) / a status word that tracks the phase — `CIPHERTEXT · DECRYPTING · PLAINTEXT ·
ENCRYPTING`. Both strings are padded to the same 16 columns so characters resolve in
place rather than reflowing.

The loop: hold ciphertext → resolve left-to-right into plaintext → hold → scramble back.

**Texture updates.** `CanvasTexture`, uploaded **only on a scramble tick (~15fps)**,
never per frame. A 640×480 GPU upload at 60fps is pure waste, and the scramble reads
*better* slow — it looks like a refresh rate rather than an animation.

**Bloom interaction.** `luminosityThreshold: 1.0` means only genuine highlights bloom.
The screen must therefore render **above 1.0** — emissive, `toneMapped: false`, phosphor
multiplier ~1.9. Miss this and the glow silently never appears.

**Cursor tracking.** Clamped look-at, never free rotation:

```js
const targetYaw   = pointer.x * MAX_YAW;    // ±18°
const targetPitch = -pointer.y * MAX_PITCH; // ±7°
const k = 1 - Math.exp(-DAMP * delta);      // NOT a fixed-alpha lerp
group.rotation.y += (targetYaw - group.rotation.y) * k;
group.rotation.x += (targetPitch - group.rotation.x) * k;
```

- **Small range** — ±18° yaw, ±7° pitch. A CRT is heavy furniture; a wide range makes
  it feel weightless.
- **`1 - exp(-k·dt)` damping**, because fixed-alpha lerp damps differently at 144fps
  than at 60fps.
- **Rest and idle.** Returns to zero when the pointer leaves the window. After 2.5s
  without pointer movement — and on touch devices, which have no pointer — it drifts on
  a slow sine at 30% amplitude rather than sitting dead.

**CRT shader**, in order: barrel distortion on the UV → scanlines with slow vertical
drift → aperture-grille RGB column mask → chromatic aberration scaled by distance from
centre → rolling hum bar → low-amplitude static → vignette. The screen geometry also
takes a slight physical bulge so the silhouette curves, not just the texture. Glass
front uses `GlassShaderPBR`.

**Flicker stays below 3Hz.** 3–60Hz is the photosensitive-seizure band, and this style
carries a high accessibility risk. Under `prefers-reduced-motion`: screen resolved to
plaintext, static — no scramble, no hum bar, no static, no idle drift.

**Tuned values** live in `crt-prototype.html`; its panel exports a JSON block that drops
straight into the component.

### Sourcing

- **[Khronos glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)** — **CC0**.
  The **BoomBox is an exact match** (CC0, Microsoft 2017), production-grade PBR.
- **[Sketchfab](https://sketchfab.com/tags/retro-electronic)** — has every remaining object, but
  licences are **per model**. "Download Free 3D model" usually means **CC-BY,
  attribution required**; some are CC-BY-NC. Check and record every one; keep
  `ATTRIBUTION.md` in the repo.
- **[Poly Haven](https://polyhaven.com/license)** — CC0, but the electronics category is empty.
  HDRIs and material textures only.
- **Kenney / Quaternius** — CC0 but stylised low-poly; will not match this look.
- **CRT set** — [Keon1x's CRT TV](https://sketchfab.com/3d-models/crt-tv-7e19d474af4449e69c03dc661e7967dc)
  ships 4K base-colour/roughness/metallic/normal as `.glb`, closest to drop-in;
  [plaggy's CC0 collection](https://sketchfab.com/plaggy/collections/cc0-public-domain-free-models-c1af6539a9ee49f4b3d51fabd6c25a85)
  is the safest licence route. **The screen must be a separate material slot** so the
  canvas texture can be swapped onto it.

**The models are not what makes it look like Buttermax.** A CC0 boombox in a default
R3F scene looks like a free asset; the same boombox through the post chain and glass
shader above looks like Buttermax. Sourcing is ~20% of the work.

### Asset pipeline

Geometry as **individual Draco `.bin` buffers per mesh** so a tile streams one mesh at
a time. Textures **KTX2 at four LODs** (`-low`, `-medium`, `-high`, full), picked per
tier. Channel-packed maps (`_diffuse`, `_alpha`, `_glass`, `_data`, `_mask-N`).
Blender → glTF → `gltf-transform`. Budget **≤80k tris per object**, **≤2MB per tile at
medium LOD**.

### Performance tiers

1. **Full** — desktop, `deviceMemory ≥ 8`, WebGL2, no reduced-motion: all objects,
   fluid sim, full post chain.
2. **Reduced** — mid-tier / mobile: high-LOD only, no fluid sim, bloom only, objects
   lazy-load on intersection.
3. **None** — no WebGL2, reduced-motion, or Save-Data: **the canvas is never created.**
   Tiles render pre-rendered stills as `<picture>`; the hero renders flat SVG. **Design
   this tier first, then add the canvas.**

Objects pause rAF work when offscreen. Canvas drops to 30fps after 3s of pointer
inactivity.

---

## Build

**Next.js 15, App Router, TypeScript, `output: 'export'`** — fully static.

```
app/{layout,page}.tsx · globals.css
components/blocks/*.tsx        one per block, named to match
components/ui/{PillButton,Marquee,Accordion}.tsx
gl/{Stage,Rig,Composite,Fluid}.tsx · gl/objects/*.tsx · gl/shaders/*.glsl
content/aegis.ts               ALL copy, keyed by manual section
styles/tokens.css              the frontmatter above, as CSS variables
styles/blocks/*.module.css
public/{geometry/*.bin, maps/*.ktx2, still/*.webp}
ATTRIBUTION.md                 every model, source, licence
```

| Concern | Decision |
|---|---|
| Styling | **CSS Modules + `tokens.css`**. Tailwind fights `letter-spacing: -0.05em`, `line-height: 0.83`, `width: max(45rem, 23vw)`. Buttermax uses CSS Modules too. |
| Fonts | **`next/font/local`** — self-hosted woff2, auto-preload, size-adjusted fallback. Then `ScrollTrigger.refresh()`. |
| Canvas | **`dynamic(..., { ssr: false })`** — three + post is ~200KB gzipped and cannot server-render. Static export pre-renders tier-3 stills into the HTML and the canvas mounts over them, so the fallback comes free. |
| Scroll | **Lenis** + **GSAP ScrollTrigger** |
| Images | `images.unoptimized: true`, or pre-generate WebP stills at build. Decide before authoring tile fallbacks. |
| Preloader | GSAP + SVG. Skip Lottie — one shield animation does not justify the dependency. |

**All copy lives in `content/aegis.ts`, keyed by manual section.** Every string carries
its §n, so when the manual is revised the page updates in one file and the citation
says what to re-check. Never inline copy into components.

**Budget:** LCP is the hero display type — fonts preload first, the hero never waits on
the canvas. `<150KB` JS excluding three; three + post `<200KB` gzipped; GL assets stream
after first paint. Tier 3 under 400KB total.

---

## Do's and Don'ts

### Do

- Set `antialias` in the `WebGLRenderer` constructor, and give the canvas `role="img"` + `aria-label`.
- Keep standards names in mono with their document number.
- Ship Block 11 (metadata caveat) at full size, always.
- Verify 4.5:1 contrast at every block boundary — `mix-blend-mode: difference` drops contrast over mid-tones.
- Give focus a visible `3px` accent outline at `2px` offset.
- Let the tile's `label` carry the real name for screen readers; marquees are decorative.
- Use `<th scope>` on every table.

### Don't

- Don't add a third background color, a second accent, or any drop-shadow.
- Don't pin more than one section.
- Don't use `critical` red anywhere except the two rows named in Colors.
- Don't lead the hero with the primitives (§1.1).
- Don't set a standards name in the display face.
- Don't animate `width` / `height`.
- Don't let the page body scroll horizontally — wide tables get their own `overflow-x: auto`.

## Responsive Behavior

Breakpoints `768` · `1025` · `1200` · `1700`. Grid goes 1 → 2 → 3 columns. Below 1025
the header collapses to wordmark + menu trigger only. Display type steps `72 → 38 → 28
→ 20px`. Touch targets minimum 44×44 with 8px+ spacing. Tables scroll inside their own
container. The pinned Block 8 unpins below 768 and becomes five stacked static steps —
pinning on mid-tier mobile is not worth the reflow cost.

## Known Gaps

- **Colour is unresolved.** `#FFD600` is inherited from Buttermax and reads
  playful-studio; the subject is defense-adjacent cryptography. A cold cyan or acid
  green would keep the entire system intact and shift the register. One token.
- **Display face is not chosen.** Archivo and Outfit are the free candidates; a
  licensed grotesque would be better.
- **Block 8 needs footage or a built 3D sequence.** Highest-value missing asset.
- **Seven of the objects are unsourced.** The CC0 BoomBox is settled and the CRT has
  candidates; the rest are not chosen.
- **Tier-3 stills do not exist** and must be rendered once the objects are final.
