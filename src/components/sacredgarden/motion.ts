/**
 * Re-implementation of the Tilda Zero Block motion used on the source page:
 *  - basic appear animations (data-animate-style: fadein, fadeinup, fadeinleft, fadeinright, zoomin)
 *  - step-by-step animations (data-animate-sbs-*):
 *      intoview / blockintoview → start the keyframes generated in sacredgarden.css
 *      scroll                    → transform driven by the scroll distance
 * Returns a cleanup function.
 */

const EASE = "cubic-bezier(.19,1,.22,1)";

interface ScrollStep {
  mx: number;
  my: number;
  sx: number;
  sy: number;
  op: number;
  ro: number;
  di: number;
}

function parseOpts(raw: string | null): Record<string, number | string>[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw.replace(/'/g, '"'));
  } catch {
    return [];
  }
}

function initialTransform(style: string, distance: number | null, scale: number | null) {
  switch (style) {
    case "fadeinup":
      return `translate3d(0px, ${distance ?? 100}px, 0px)`;
    case "fadeindown":
      return `translate3d(0px, ${-(distance ?? 100)}px, 0px)`;
    case "fadeinleft":
      return `translate3d(${distance ?? 100}px, 0px, 0px)`;
    case "fadeinright":
      return `translate3d(${-(distance ?? 100)}px, 0px, 0px)`;
    case "zoomin":
      return `scale(${scale ?? 0.9})`;
    case "zoomout":
      return `scale(${scale ?? 1.2})`;
    default:
      return "";
  }
}

function setupAppear(root: HTMLElement) {
  const els = [...root.querySelectorAll<HTMLElement>(".tn-elem.t-animate[data-animate-style]")];
  const num = (v: string | undefined) => (v === undefined || v === "" ? null : Number(v));
  for (const el of els) {
    const style = el.dataset.animateStyle ?? "fadein";
    const duration = num(el.dataset.animateDuration) ?? 1;
    const delay = num(el.dataset.animateDelay) ?? 0;
    el.style.transitionProperty = "opacity, transform";
    el.style.transitionTimingFunction = EASE;
    el.style.transitionDuration = `${duration}s`;
    el.style.transitionDelay = `${delay}s`;
    el.style.opacity = "0";
    const t = initialTransform(style, num(el.dataset.animateDistance), num(el.dataset.animateScale));
    if (t) el.style.transform = t;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("t-animate_started");
        el.style.opacity = "1";
        el.style.transform = "none";
        io.unobserve(el);
      }
    },
    { threshold: 0 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

function setupSbs(root: HTMLElement) {
  const timed = [...root.querySelectorAll<HTMLElement>(".tn-elem[data-animate-sbs-event]")].filter(
    (el) => el.dataset.animateSbsEvent !== "scroll",
  );
  const scrolled = [...root.querySelectorAll<HTMLElement>('.tn-elem[data-animate-sbs-event="scroll"]')].map((el) => {
    const steps = parseOpts(el.dataset.animateSbsOpts ?? null).map<ScrollStep>((s) => ({
      mx: Number(s.mx ?? 0),
      my: Number(s.my ?? 0),
      sx: Number(s.sx ?? 1),
      sy: Number(s.sy ?? 1),
      op: Number(s.op ?? 1),
      ro: Number(s.ro ?? 0),
      di: Number(s.di ?? 0),
    }));
    return {
      el,
      wrapper: el.querySelector<HTMLElement>(".tn-atom__sbs-anim-wrapper"),
      steps,
      trg: Number(el.dataset.animateSbsTrg ?? 1),
      ofst: Number(el.dataset.animateSbsTrgofst ?? 0),
    };
  });

  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    for (const el of timed) {
      if (el.classList.contains("t-sbs-anim_started")) continue;
      const trg = Number(el.dataset.animateSbsTrg ?? 1);
      const ofst = Number(el.dataset.animateSbsTrgofst ?? 0);
      const ref = el.dataset.animateSbsEvent === "blockintoview" ? el.closest(".t-rec") ?? el : el;
      const top = ref.getBoundingClientRect().top;
      if (top <= vh * trg - ofst) el.classList.add("t-sbs-anim_started");
    }
    for (const s of scrolled) {
      if (!s.wrapper || s.steps.length < 2) continue;
      const top = s.el.getBoundingClientRect().top;
      let travelled = Math.max(0, vh * s.trg - s.ofst - top);
      let state = s.steps[0];
      for (let i = 1; i < s.steps.length; i++) {
        const a = s.steps[i - 1];
        const b = s.steps[i];
        if (travelled >= b.di) {
          travelled -= b.di;
          state = b;
          continue;
        }
        const k = b.di ? travelled / b.di : 1;
        const lerp = (x: number, y: number) => x + (y - x) * k;
        state = {
          mx: lerp(a.mx, b.mx),
          my: lerp(a.my, b.my),
          sx: lerp(a.sx, b.sx),
          sy: lerp(a.sy, b.sy),
          op: lerp(a.op, b.op),
          ro: lerp(a.ro, b.ro),
          di: 0,
        };
        break;
      }
      s.wrapper.style.willChange = "transform";
      s.wrapper.style.opacity = String(state.op);
      s.wrapper.style.transform =
        `translateX(${state.mx}px) translateY(${state.my}px) rotate(${state.ro}deg) scale(${state.sx}, ${state.sy})`;
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

/** Artboards with data-artboard-heightmode="hug" take the height of their content. */
function setupHugArtboards(root: HTMLElement) {
  const boards = [...root.querySelectorAll<HTMLElement>('.t396__artboard[data-artboard-heightmode="hug"]')];
  const fit = () => {
    for (const ab of boards) {
      let bottom = 0;
      ab.querySelectorAll<HTMLElement>(":scope > .tn-elem").forEach((el) => {
        bottom = Math.max(bottom, el.offsetTop + el.offsetHeight);
      });
      if (bottom > 0) {
        for (const part of [ab, ...ab.querySelectorAll<HTMLElement>(":scope > .t396__carrier, :scope > .t396__filter")]) {
          part.style.height = `${bottom}px`;
        }
      }
    }
  };
  fit();
  const ro = new ResizeObserver(fit);
  boards.forEach((ab) => ab.querySelectorAll(":scope > .tn-elem").forEach((el) => ro.observe(el)));
  window.addEventListener("resize", fit);
  return () => {
    ro.disconnect();
    window.removeEventListener("resize", fit);
  };
}

export function initMotion(root: HTMLElement) {
  const cleanups = [setupHugArtboards(root), setupAppear(root), setupSbs(root)];
  return () => cleanups.forEach((c) => c());
}
