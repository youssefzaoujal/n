/**
 * Pluie de fleurs : roses, pivoines et pétales du modèle jaillissent d'un point
 * puis retombent en tournoyant doucement. Remplace les confettis.
 */
const DIR = "/sites/thesacredgarden/flowers";
const BLOOMS = [
  "peony-pink",
  "peony-cream",
  "peony-blush",
  "rose-pink",
  "rose-cream-a",
  "rose-cream-b",
  "rose",
  "blossom-white",
  "bud-pink",
];
const PETALS = ["petal-1", "petal-2", "petal-3", "petal-4"];

/** Précharge les images pour que la pluie démarre sans trou. */
export function preloadFlowers() {
  if (typeof window === "undefined") return;
  for (const n of [...BLOOMS, ...PETALS]) {
    const img = new Image();
    img.src = `${DIR}/${n}.webp`;
  }
}

export function flowerShower(opts: { x?: number; y?: number; count?: number; spread?: number } = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const W = window.innerWidth;
  const H = window.innerHeight;
  const ox = (opts.x ?? 0.5) * W;
  const oy = (opts.y ?? 0.4) * H;
  const count = opts.count ?? 34;
  const spread = opts.spread ?? 1;

  const layer = document.createElement("div");
  layer.className = "sg-flower-layer";
  document.body.appendChild(layer);

  let longest = 0;
  for (let i = 0; i < count; i++) {
    const isPetal = Math.random() < 0.45;
    const name = isPetal
      ? PETALS[(Math.random() * PETALS.length) | 0]
      : BLOOMS[(Math.random() * BLOOMS.length) | 0];
    const size = isPetal ? 16 + Math.random() * 18 : 30 + Math.random() * 34;

    const el = document.createElement("img");
    el.src = `${DIR}/${name}.webp`;
    el.alt = "";
    el.className = "sg-flower";
    el.style.width = `${size}px`;
    el.style.left = `${ox - size / 2}px`;
    el.style.top = `${oy - size / 2}px`;
    layer.appendChild(el);

    // jaillissement vers le haut et les côtés, puis chute lente en se balançant
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
    const power = (90 + Math.random() * 170) * spread;
    const bx = Math.cos(angle) * power;
    const by = Math.sin(angle) * power * 0.85;
    const fall = H - oy + 80 + Math.random() * 120;
    const sway = (Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 50);
    const r0 = Math.random() * 360;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 260);
    const dur = 6200 + Math.random() * 3200;
    const delay = Math.random() * 260;
    longest = Math.max(longest, dur + delay);

    el.animate(
      [
        { transform: `translate(0,0) rotate(${r0}deg) scale(0.2)`, opacity: 0 },
        { transform: `translate(${bx * 0.6}px, ${by * 0.6}px) rotate(${r0 + spin * 0.15}deg) scale(1)`, opacity: 1, offset: 0.1 },
        { transform: `translate(${bx}px, ${by}px) rotate(${r0 + spin * 0.3}deg) scale(1)`, opacity: 1, offset: 0.22 },
        { transform: `translate(${bx + sway}px, ${by + fall * 0.45}px) rotate(${r0 + spin * 0.6}deg) scale(0.97)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${bx - sway * 0.3}px, ${by + fall * 0.8}px) rotate(${r0 + spin * 0.85}deg) scale(0.95)`, opacity: 0.9, offset: 0.85 },
        { transform: `translate(${bx - sway * 0.6}px, ${by + fall}px) rotate(${r0 + spin}deg) scale(0.92)`, opacity: 0 },
      ],
      { duration: dur, delay, easing: "cubic-bezier(.3,.55,.4,1)", fill: "both" },
    );
  }
  setTimeout(() => layer.remove(), longest + 200);
}
