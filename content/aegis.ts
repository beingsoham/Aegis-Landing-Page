/**
 * ALL page copy, keyed by its section in Aegis_System_Documentation_Manual.docx.
 * Never inline copy into components: when the manual is revised, the citation
 * says exactly what to re-check. See DESIGN.md §"Copy Rules".
 */

export const meta = {
  title: 'Aegis — post-quantum secure communications overlay',
  description:
    'A cryptographic communications overlay that keeps one hybrid post-quantum session alive across multiple transports — including a direct local-network path when no infrastructure is reachable — while the relay stays structurally blind to message content.',
};

export const hero = {
  eyebrow: 'Post-quantum secure communications overlay',
  lines: ['The session', 'survives', 'the network'],
  body:
    'Two endpoints establish and maintain a quantum-resistant encrypted session whose security does not depend on any particular network path — and whose relay infrastructure never possesses the material required to read the messages it carries.',
  cite: '§1',
};

export const problems = {
  eyebrow: 'Why Aegis exists',
  items: [
    {
      n: '01',
      title: 'Harvest now, decrypt later',
      body:
        'A passive attacker records encrypted traffic today, stores it indefinitely, and decrypts it retroactively once capable quantum hardware exists. It needs only that the plaintext still matters in ten or twenty years — already true of government, defense, medical and legal communication.',
      cite: '§2.1',
    },
    {
      n: '02',
      title: 'Network dependency',
      body:
        'Almost every secure messenger is built around one connectivity assumption: a central server is reachable. In disaster zones, rural regions and temporary command posts that path is frequently unavailable — even while two devices sit on the same local network.',
      cite: '§2.2',
    },
    {
      n: '03',
      title: 'Server trust',
      body:
        'Even when a server is reachable it is a single point of compromise: it can be hacked, misconfigured, legally compelled, or operated by a party the users should not have to trust with plaintext.',
      cite: '§2.3',
    },
  ],
  synthesis:
    'Aegis treats these as one design problem, not three features bolted together.',
  synthesisCite: '§2.4',
};

export const positioning = {
  eyebrow: 'Honest positioning',
  title: 'We did not invent post-quantum messaging',
  body:
    'Signal has shipped PQXDH in production. PQCChat offers browser-based post-quantum messaging with ML-KEM and ML-DSA. Aegis does not compete with those products on chat features, user experience, or ecosystem maturity — it would lose that comparison. It targets the problem sitting underneath all of them: every one assumes a central server is reachable.',
  cite: '§3.1',
};

export const claims = {
  eyebrow: 'The claim',
  lead: 'Three parts, each independently demonstrable.',
  items: [
    {
      n: '01',
      title: 'Hybrid post-quantum security',
      body: 'The same well-studied primitives other products use, composed carefully.',
      ref: '§6',
    },
    {
      n: '02',
      title: 'Demonstrated transport independence',
      body:
        'The identical cryptographic session and packet format running over more than one transport, with the crypto engine unaware of which is active.',
      ref: '§11',
    },
    {
      n: '03',
      title: 'A blind relay',
      body:
        'Verifiable by inspecting server storage and finding no plaintext or session secrets.',
      ref: '§14',
    },
  ],
  cite: '§3.2',
};

export const stack = {
  eyebrow: 'The cryptographic stack',
  rule: 'Never invent a cryptographic primitive',
  lead:
    'Every algorithm below is a standardized, publicly reviewed construction. The engineering work is in composing them correctly, not in designing new mathematics.',
  items: [
    { n: '01', algo: 'ML-KEM-768',   badge: 'FIPS 203',       marquee: 'The quantum half',
      purpose: 'Lattice-based (Module-LWE). Establishes a shared secret; does not encrypt the message itself.' },
    { n: '02', algo: 'X25519',       badge: 'RFC 7748',       marquee: 'The classical half',
      purpose: 'Elliptic-curve Diffie-Hellman. Provides the classical half of the hybrid handshake.' },
    { n: '03', algo: 'ML-DSA-65',    badge: 'FIPS 204',       marquee: 'Who the key belongs to',
      purpose: 'Signs identity and pre-key bundles so a recipient can verify who a public key claims to belong to.' },
    { n: '04', algo: 'HKDF-SHA-256', badge: 'RFC 5869',       marquee: 'Two secrets, one key',
      purpose: 'Combines the classical and post-quantum secrets into a root key and derives session sub-keys.' },
    { n: '05', algo: 'AES-256-GCM',  badge: 'SP 800-38D',     marquee: 'Confidentiality and integrity',
      purpose: 'Authenticated encryption for the message payload — confidentiality and integrity together.' },
    { n: '06', algo: 'Double Ratchet', badge: '',             marquee: 'The key never sits still',
      purpose: 'Continuously replaces message keys and periodically re-runs a Diffie-Hellman step to recover after temporary compromise.' },
  ],
  warning:
    '“Combining two algorithms automatically makes the system secure.” It does not, by itself.',
  cite: '§5',
};

export const handshake = {
  eyebrow: 'The hybrid handshake',
  formula: 'root_key = HKDF-SHA-256( SS_X25519 ‖ SS_MLKEM , context )',
  note:
    'The shared secret is never transmitted. ML-KEM produces a ciphertext that only the holder of the matching private key can decapsulate — the ciphertext is not the secret, and intercepting it does not reveal the secret.',
  requirementsLead:
    'Selecting X25519 and ML-KEM is the easy part. Four further properties are what make the composition trustworthy, each treated as a first-class requirement.',
  requirements: [
    { n: '01', title: 'Fixed concatenation order',
      body: 'Both sides concatenate the two secrets in exactly the same order, never reversed on one side. A mismatch silently produces two different root keys and the session fails closed — safe, but it must be tested for explicitly rather than discovered in the field.' },
    { n: '02', title: 'Context binding in HKDF',
      body: 'The info parameter binds the derived key to a protocol version, the algorithm identifiers actually negotiated, and identity information from both sides. This provides domain separation and helps prevent an attacker confusing one protocol run for another.' },
    { n: '03', title: 'Downgrade resistance',
      body: 'The negotiated algorithm set is itself covered by the authenticated transcript. An active attacker stripping the post-quantum component to force a classical-only exchange must be detectable by both endpoints, not silently accepted.' },
    { n: '04', title: 'Key confirmation',
      body: 'After deriving the root key both sides derive a short confirmation value and compare them before treating the session as live. This catches wrong key combination, transcript mismatch or handshake tampering, rather than surfacing later as silently undecryptable messages.' },
  ],
  pullquote:
    'Key establishment is not authentication. ML-KEM guarantees that two parties who complete the protocol correctly arrive at the same secret. It says nothing about whether the party on the other end is who they claim to be.',
  cite: '§6',
};

export const transport = {
  eyebrow: 'Transport independence',
  headline: 'It calls send(ciphertext). It never calls send_over_wifi().',
  lead:
    'The crypto engine produces one thing: an encrypted packet. It hands that packet to a transport abstraction and does not know or care which concrete transport is underneath. This is the architectural property the project is actually trying to prove, and it is only meaningful if it is demonstrated, not just diagrammed.',
  steps: [
    { n: '01', body: 'Alice and Bob are chatting through the internet relay.' },
    { n: '02', body: 'The router the relay depends on fails. Alice’s transport manager detects it — connection error or heartbeat timeout.' },
    { n: '03', body: 'JmDNS resolves Bob’s presence and address on the local network.' },
    { n: '04', body: 'A direct Netty TCP connection is established to Bob.' },
    { n: '05', body: 'The next outgoing packet — same ratchet state, same header format, same ciphertext structure — is sent over that connection instead. Bob’s crypto engine processes the ratchet header exactly as it would have over the relay. No renegotiation, no new handshake.' },
  ],
  scopeNote:
    'Detecting relay failure, discovering the peer and switching transports automatically and seamlessly is application and transport-manager logic that must be built and tested — it is not automatic just because the crypto layer is transport-agnostic. What the architecture guarantees is that the ratchet sequence and cryptographic state remain valid across the switch.',
  cite: '§11',
};

export const modes = {
  eyebrow: 'Three named conditions',
  lead:
    'Offline capability is treated as three distinct, explicitly named conditions, because collapsing them into one loose idea invites exactly the kind of pushback the project needs to withstand.',
  items: [
    { key: 'A', title: 'Connected',     desc: 'Normal internet path available.',
      what: 'Client → relay → client.' },
    { key: 'B', title: 'Locally connected', desc: 'No internet, but both peers share a local network.',
      what: 'The direct LAN path carries the same encrypted session.' },
    { key: 'C', title: 'Temporarily disconnected', desc: 'Neither the internet nor a shared local network is reachable.',
      what: 'Messages are encrypted and queued locally; delivery resumes once any transport becomes available again.' },
  ],
  closer: 'The encryption step is identical in all three. Only delivery changes.',
  cite: '§13',
};

export const relay = {
  eyebrow: 'The blind relay',
  title: 'What the server can and cannot see',
  lead:
    'The relay is designed so that none of the information required to decrypt a message ever needs to reach it. This is a structural guarantee, verifiable by inspection — not a policy promise the operator has to be trusted to honour.',
  may: [
    'Account and user identifiers',
    'Public identity keys and signatures',
    'Public pre-key bundles (X25519, ML-KEM)',
    'Encrypted message packets',
    'Temporary offline-delivery queues',
    'Connection and session metadata',
  ],
  never: [
    'Plaintext message content',
    'Private identity keys',
    'Root keys',
    'Chain keys',
    'Message keys',
    'Any ratchet state',
  ],
  demonstrated:
    'Inspect the backend database directly during the demonstration. It shows account records, public keys, signatures and ciphertext — and it can be shown, live, that no field yields plaintext, private keys or session secrets under any query.',
  demonstratedCite: '§14.2',
  tls:
    'TLS secures the transport connection between a client and the server — it does not prevent the server from reading application-level content, because the server is one endpoint of that connection. Aegis encrypts at the application layer, end-to-end, so the packet the relay forwards is already ciphertext it cannot open.',
  tlsCite: '§14.4',
  cite: '§14.1',
};

export const metadata = {
  eyebrow: 'The caveat we lead with',
  headline: '“The server sees nothing” is false, and we do not claim it',
  body:
    'Even a correctly built blind relay still observes metadata: which accounts are communicating with which, message timing, packet frequency, approximate packet sizes, and connection information. Content confidentiality and metadata privacy are two different properties. Aegis does not currently claim metadata protection.',
  cite: '§14.3',
};

export const threats = {
  eyebrow: 'Threat model',
  lead: 'Nine adversary classes, each with the property expected to limit them.',
  rows: [
    { a: 'Passive network observer', cap: 'Observe traffic in transit',
      lim: 'AES-256-GCM confidentiality; content is ciphertext regardless of path.' },
    { a: 'Active network attacker', cap: 'Modify, inject, drop or replay packets',
      lim: 'AEAD authentication tags detect tampering; replay protection detects re-sent packets.' },
    { a: 'Malicious relay server', cap: 'Inspect or manipulate relayed traffic',
      lim: 'Blind-relay design — no plaintext or session secrets ever reach it.' },
    { a: 'Compromised relay (at rest)', cap: 'Full read access to server storage',
      lim: 'Stored data contains no decryption-relevant secrets, only ciphertext and metadata.' },
    { a: 'Malicious LAN peer', cap: 'Present on the same local network',
      lim: 'JmDNS provides no trust; cryptographic identity verification is required before a session is treated as authentic.' },
    { a: 'Compromised endpoint (active)', cap: 'Full control of a live client',
      lim: 'Not mitigated while the compromise is active — a fundamental limit, stated openly rather than hidden.', critical: true },
    { a: 'Stolen device (at rest)', cap: 'Physical possession of a powered-off or locked device',
      lim: 'Encrypted-at-rest local storage, OS-backed key protection.' },
    { a: 'Long-term passive recorder', cap: 'Stores ciphertext today for future decryption attempts',
      lim: 'The post-quantum component of the hybrid handshake.' },
    { a: 'Future quantum adversary', cap: 'Would break X25519 alone via Shor’s algorithm',
      lim: 'ML-KEM is designed to remain secure independent of that break.' },
  ],
  notDefended: {
    title: 'What Aegis explicitly does not defend against',
    items: [
      'An endpoint that is actively compromised, while the compromise is ongoing.',
      'Metadata correlation by a party observing traffic patterns over time.',
      'Social-engineering or out-of-band compromise of the initial trust anchor, if a user never performs any out-of-band verification.',
      'Denial of service against relay availability — mitigated in effect by the LAN fallback path, but not a cryptographic guarantee.',
    ],
    cite: '§15.2',
  },
  cite: '§15',
};

export const notClaiming = {
  eyebrow: 'What we do not claim',
  lead:
    'To keep the project defensible under technical questioning, these claims are explicitly avoided.',
  items: [
    'Certified or integrated with a specific military radio, waveform, or classified network. The prototype defines a transport interface and demonstrates it over generic bearers; integrating a fielded radio is future work, not a completed deliverable.',
    'A solved military key-management system. Real operational key management includes credential issuance, device enrollment, revocation, escrow policy and classification-domain separation — beyond what a student prototype can responsibly claim.',
    '“Unhackable”, “quantum-proof”, or “100% secure”. These are not technically meaningful claims.',
    'Ready for military deployment. The realistic pathway runs through security review, protocol audit, penetration testing, formal requirements and procurement — a multi-year institutional process.',
  ],
  cite: '§3.3',
};

export const gaps = {
  eyebrow: 'Known gaps',
  rule:
    '“We plan to” is never rewritten as “we have implemented.” “Estimated” is never rewritten as “measured.” “Should be secure” is never rewritten as “is proven secure.”',
  lead: 'Treating unresolved items honestly is itself part of the engineering discipline this project is built around.',
  rows: [
    { item: 'TOFU + fingerprint/QR identity verification', status: 'Design decided; implementation and UX not yet built.' },
    { item: 'Encrypted-at-rest ratchet state with atomic persistence', status: 'Design decided; implementation and crash-safety testing not yet complete.' },
    { item: 'Automatic, seamless transport handover', status: 'Cryptographic compatibility across transports is architected; the failure-detection and switching logic still needs to be built and stress-tested.' },
    { item: 'One-time pre-key exhaustion / replenishment', status: 'Fallback behaviour is specified but not yet implemented end-to-end.' },
    { item: 'Handshake timeout / resumable transfer', status: 'No timeout or fallback protocol implemented yet; sensible behaviour proposed but not built.' },
    { item: 'Additional simulated or tactical bearer beyond TCP and LAN', status: 'Future scope; not part of the current prototype.' },
    { item: 'Formal protocol verification / independent cryptographic audit', status: 'Not performed. Required before any claim stronger than ‘prototype’ would be appropriate.', critical: true },
  ],
  cite: '§19',
};

export const faq = {
  eyebrow: 'Judge FAQ',
  lead: 'Straight answers to the questions this project should expect.',
  items: [
    { q: 'Why should we not just use Signal?',
      a: 'We aren’t competing with Signal as a messaging application — Signal already solves secure messaging extremely well for its target environment. Our contribution is a cryptographic communications layer that stays secure and operational across multiple transport conditions, including a direct local-network path used when no central infrastructure is reachable at all. The chat interface is a demonstration client for that layer, not the product.' },
    { q: 'PQCChat already does post-quantum messaging. What’s novel here?',
      a: 'PQCChat demonstrates PQC messaging over the internet, which is a real and useful thing to have built. Our focus is different: transport-independent operation and degraded or disconnected behaviour, with the cryptographic layer deliberately decoupled from whatever bearer is carrying it. We show this by running the identical session over more than one transport.' },
    { q: 'What exactly makes this suitable for a military or defense context?',
      a: 'Not the algorithms by themselves — ML-KEM and AES-GCM are not ‘military’ technologies. What’s relevant is the set of constraints the prototype is built around: intermittent connectivity, constrained bandwidth, delayed delivery, device loss, controlled identity provisioning, and operation without a continuously available central server. Those are the actual constraints of the target environment, addressed directly rather than assumed away.' },
    { q: 'Which military radio or classified network does this integrate with?',
      a: 'None, and we do not claim otherwise. The prototype defines a transport interface and demonstrates it over generic bearers — TCP, a direct LAN connection, and a simulated constrained link. Integrating a specific fielded radio or classified network would be a subsequent engineering phase, well beyond a six-month student prototype, and we say that plainly rather than implying otherwise.' },
    { q: 'Why ML-KEM-768 specifically?',
      a: 'It is NIST’s standardized post-quantum KEM (FIPS 203), it offers a practical balance of key and ciphertext size versus security level compared to alternatives like Classic McEliece, and it is the primary post-quantum KEM other production systems — including Signal’s PQXDH — have converged on, which matters for implementation maturity and independent scrutiny.' },
    { q: 'What mathematical problem protects ML-KEM?',
      a: 'Hardness assumptions from Module Learning With Errors, a lattice-based problem. This is a different mathematical foundation from RSA (integer factorization) or elliptic-curve cryptography (discrete logarithms), both of which Shor’s algorithm attacks efficiently on a sufficiently capable quantum computer. No known quantum algorithm currently gives an analogous practical break against the lattice assumptions ML-KEM relies on.' },
    { q: 'Why combine X25519 and ML-KEM instead of just using one?',
      a: 'Defense in depth. If ML-KEM ever turns out to have an unforeseen weakness — post-quantum cryptography is comparatively young — X25519 still contributes real classical security. If a quantum computer eventually breaks X25519, ML-KEM is designed to remain resistant under its own assumptions. Neither is trusted in isolation.' },
    { q: 'Why ML-DSA specifically, and not a classical signature scheme?',
      a: 'Because using a classical signature to authenticate a post-quantum handshake would leave the authentication step itself exposed to the same future quantum adversary the rest of the design defends against. ML-DSA keeps the whole trust chain, not just key establishment, quantum-resistant.' },
    { q: 'Why the Double Ratchet?',
      a: 'It gives forward secrecy — compromising a current key doesn’t expose past messages, since past keys are already discarded — and post-compromise recovery, because the periodic DH step reintroduces fresh secret material after a temporary compromise ends. We do not claim to have invented it; our contribution is composing it correctly inside a transport-independent architecture.' },
    { q: 'Why not just use TLS?',
      a: 'TLS secures a transport connection between a client and whichever server terminates it — it does not prevent that server from reading application-level content, since the server is one endpoint of the TLS session. Aegis encrypts at the application layer, end-to-end, so the relay only ever sees ciphertext it cannot open, regardless of what transport security also happens to be in place underneath.' },
    { q: 'What happens if the relay server is fully compromised?',
      a: 'The attacker obtains ciphertext, public key material, and metadata — not the secrets required to decrypt message content, because those secrets never reach the server by design. We can show this by inspecting the server’s storage directly.' },
    { q: 'What happens if a client device is compromised?',
      a: 'While the compromise is active, the attacker has the same access the legitimate user has — no architecture can fully prevent that, and we say so directly rather than overclaiming. What the ratchet does provide is a bound on how long that exposure persists: past messages stay protected by forward secrecy, and future security can recover once the compromise ends and the ratchet advances again.' },
    { q: 'PQC keys are large. How do you handle low-bandwidth links?',
      a: 'Three things: the expensive PQC material is exchanged once at handshake time, not per message; ordinary messages use binary serialization instead of JSON or Base64 to cut encoding overhead; and we never silently downgrade to classical-only cryptography just because a network is slow. All performance numbers are labeled as design targets, estimates, or measured benchmarks — never blurred together.' },
    { q: 'Can it really work with zero internet?',
      a: 'Yes, when both devices share a local network path — demonstrated via the direct LAN transport. Full isolation with no local network at all falls back to local encrypted queueing until any transport becomes available again.' },
    { q: 'How do you authenticate a peer discovered over the LAN?',
      a: 'JmDNS only provides discovery — finding a device, not verifying it. Cryptographic identity verification, via ML-DSA signatures plus the TOFU and fingerprint trust model, is what actually authenticates the peer, entirely independent of how it was found on the network.' },
    { q: 'Can the server read the messages?',
      a: 'No — by design, the server never receives the private keys, root key, chain keys, or message keys required to decrypt content. It can be shown, by inspecting its storage, to hold only public keys, signatures, ciphertext and metadata.' },
    { q: 'Is this actually going to be deployed?',
      a: 'Not directly from this prototype. The realistic path from a hackathon prototype to operational deployment runs through independent security review, protocol auditing, extensive testing and procurement — a multi-year institutional process. What we can defend today is that the underlying engineering problem is real, the primitives are sound and standardized, and the prototype demonstrates the core architectural claims honestly.' },
  ],
  cite: '§20',
};

export const footer = {
  /* §22 is still the placeholder template in the manual — fill these in. */
  team: {
    name: '[Team name]',
    psId: '[PS ID]',
    institution: '[Institution]',
    event: 'Smart India Hackathon 2026',
  },
  links: [
    { label: 'Documentation', href: '#' },
    { label: 'Architecture',  href: '#' },
    { label: 'Research',      href: '#' },
  ],
  /* Every qualification collects here, each linked to the section stating it. */
  disclaimers: [
    { text: 'The adversary model is an illustration, not live cryptanalysis.', ref: '§15' },
    { text: 'Content confidentiality is not metadata privacy.',                ref: '§14.3' },
    { text: 'Four claims we explicitly avoid making.',                          ref: '§3.3' },
    { text: 'Open items and unbuilt work, tracked honestly.',                   ref: '§19' },
    { text: 'No formal verification or independent audit has been performed.',  ref: '§19.1' },
  ],
  notice: 'Aegis — prototype. Not audited. Not for production use.',
};
