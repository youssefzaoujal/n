"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { ANSWER, friendMessages, questions, youssefLines, youssefTitle, girlsLines, MUSIC, MUSIC_FINALE } from "./data";

const IMG = "/sites/thesacredgarden/images";
const SEAL = `${IMG}/seal-yn.png`;
const ORNAMENT = `${IMG}/3232-3638-acomm-decor.png`;
const ROSE = `${IMG}/3635-3664-rose_-_Copy.png`;

type Stage =
  | { k: "start" }
  | { k: "gate"; q: number }
  | { k: "unlock" }
  | { k: "intro" }
  | { k: "msg"; i: number }
  | { k: "bridge" }
  | { k: "finale"; line: number }
  | { k: "end" };

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className="ms-p" style={{ animationDelay: `${0.35 + i * 0.4}s` }}>
          {p.split("\n").map((l, j, arr) => (
            <span key={j}>
              {l}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

/** Une ligne de la lettre : les mots apparaissent un à un. */
function Words({ text, delay = 0.2 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  const step = Math.min(0.13, 2.4 / words.length);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="ms-w" style={{ animationDelay: `${delay + i * step}s` }}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}

/** Ciel étoilé, étoiles filantes, poussière d'or — et les étoiles qui dessinent un cœur. */
function Sky({ night, heart }: { night: boolean; heart: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const nightRef = useRef(night);
  const heartRef = useRef(heart);
  useEffect(() => {
    nightRef.current = night;
    heartRef.current = heart;
  }, [night, heart]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    type Star = { x: number; y: number; cx: number; cy: number; r: number; tw: number; ph: number; t: number };
    type Dust = { x: number; y: number; r: number; vx: number; vy: number; ph: number };
    type Shoot = { x: number; y: number; vx: number; vy: number; life: number };
    let stars: Star[] = [];
    let dust: Dust[] = [];
    const shoots: Shoot[] = [];
    const HEART_N = 150;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(HEART_N + 60, Math.round((W * H) / 2600));
      stars = Array.from({ length: n }, (_, i) => {
        const x = Math.random() * W;
        const y = Math.random() * H;
        return {
          x, y, cx: x, cy: y,
          r: i < HEART_N ? 0.9 + Math.random() * 0.9 : Math.random() * 1.3 + 0.2,
          tw: 0.6 + Math.random() * 2,
          ph: Math.random() * 6.28,
          t: i < HEART_N ? (Math.PI * 2 * i) / HEART_N : -1,
        };
      });
      dust = Array.from({ length: Math.min(46, Math.round((W * H) / 20000)) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.08 + Math.random() * 0.25),
        ph: Math.random() * 6.28,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    let nightAmt = nightRef.current ? 1 : 0;
    let heartAmt = 0;
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      const dt = Math.min(50, t - (last || t));
      last = t;
      nightAmt += ((nightRef.current ? 1 : 0) - nightAmt) * 0.02;
      heartAmt += ((heartRef.current ? 1 : 0) - heartAmt) * 0.025;
      ctx.clearRect(0, 0, W, H);
      const s = t / 1000;
      if (nightAmt > 0.01) {
        const hs = Math.min(W * 0.9, H * 0.8) / 34;
        const hx = W / 2;
        const hy = H * 0.46;
        const beat = 1 + 0.035 * Math.pow(Math.max(0, Math.sin(s * 3.2)), 8);
        for (const st of stars) {
          let tx = st.x;
          let ty = st.y;
          if (st.t >= 0 && heartAmt > 0.002) {
            const sn = Math.sin(st.t);
            const px = 16 * sn * sn * sn;
            const py = -(13 * Math.cos(st.t) - 5 * Math.cos(2 * st.t) - 2 * Math.cos(3 * st.t) - Math.cos(4 * st.t));
            tx = st.x + (hx + px * hs * beat - st.x) * heartAmt;
            ty = st.y + (hy + py * hs * beat - st.y) * heartAmt;
          }
          st.cx += (tx - st.cx) * 0.06;
          st.cy += (ty - st.cy) * 0.06;
          const inHeart = st.t >= 0 ? heartAmt : 0;
          const a = nightAmt * (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s * st.tw + st.ph)));
          const alpha = Math.min(1, a + inHeart * 0.6);
          if (inHeart > 0.05) {
            const g = ctx.createRadialGradient(st.cx, st.cy, 0, st.cx, st.cy, st.r * 6);
            g.addColorStop(0, `rgba(255,226,160,${alpha * 0.55 * inHeart})`);
            g.addColorStop(1, "rgba(255,226,160,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(st.cx, st.cy, st.r * 6, 0, 6.28);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(255,246,225,${alpha})`;
          ctx.beginPath();
          ctx.arc(st.cx, st.cy, st.r, 0, 6.28);
          ctx.fill();
        }
        const rate = heartRef.current ? 0.04 : 0.012;
        if (!reduce && Math.random() < rate * nightAmt) {
          const fromLeft = Math.random() < 0.5;
          shoots.push({
            x: fromLeft ? Math.random() * W * 0.6 : W * 0.4 + Math.random() * W * 0.6,
            y: Math.random() * H * 0.45,
            vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 6),
            vy: 3 + Math.random() * 3,
            life: 1,
          });
        }
        for (let i = shoots.length - 1; i >= 0; i--) {
          const p = shoots[i];
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          p.life -= 0.012 * (dt / 16);
          if (p.life <= 0) {
            shoots.splice(i, 1);
            continue;
          }
          const g = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 14, p.y - p.vy * 14);
          g.addColorStop(0, `rgba(255,240,200,${p.life})`);
          g.addColorStop(1, "rgba(255,240,200,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 14, p.y - p.vy * 14);
          ctx.stroke();
        }
      }
      if (!reduce) {
        for (const d of dust) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.y < -10) {
            d.y = H + 10;
            d.x = Math.random() * W;
          }
          const a = 0.15 + 0.5 * (0.5 + 0.5 * Math.sin(s * 1.3 + d.ph));
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
          g.addColorStop(0, `rgba(222,186,110,${a})`);
          g.addColorStop(1, "rgba(222,186,110,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * 4, 0, 6.28);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="ms-sky" aria-hidden="true" />;
}

/** Explosion de cœurs et d'étoiles dorées. */
function burst(x: number, y: number, n = 26) {
  const host = document.createElement("div");
  host.className = "ms-burst";
  host.style.left = `${x}px`;
  host.style.top = `${y}px`;
  const glyphs = ["♥", "✦", "♥", "✧", "♡"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    s.textContent = glyphs[i % glyphs.length];
    const a = Math.random() * Math.PI * 2;
    const d = 70 + Math.random() * 160;
    s.style.setProperty("--x", `${Math.cos(a) * d}px`);
    s.style.setProperty("--y", `${Math.sin(a) * d - 60}px`);
    s.style.setProperty("--r", `${(Math.random() - 0.5) * 120}deg`);
    s.style.setProperty("--s", `${0.6 + Math.random() * 1.1}`);
    s.style.animationDelay = `${Math.random() * 0.15}s`;
    host.appendChild(s);
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 2600);
}

function vibrate(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* pas de vibration */
  }
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Interlude avant chaque mot doux : un chiffre d'or, une phrase-indice, un cœur qui se dessine. */
function Interlude({ index, total, hint, onOpen }: { index: number; total: number; hint: string; onOpen: () => void }) {
  const [going, setGoing] = useState(false);
  const click = (e: React.MouseEvent) => {
    if (going) return;
    setGoing(true);
    vibrate([20, 40, 60]);
    burst(e.clientX, e.clientY, 18);
    setTimeout(onOpen, 1100);
  };
  return (
    <section className={`ms-screen ms-inter ${going ? "go" : ""}`} onClick={click}>
      <span className="ms-inter-glow" aria-hidden="true" />
      <div className="ms-inter-num ms-in" style={{ animationDelay: ".2s" }}>
        <i />
        <span>{ROMAN[index] ?? index + 1}</span>
        <i />
      </div>
      <p className="ms-kicker ms-in" style={{ animationDelay: ".7s" }}>
        Mot doux · {index + 1} sur {total}
      </p>
      <p className="ms-inter-hint">
        <Words text={hint} delay={1.3} />
      </p>
      <div className="ms-inter-heart">
        <svg viewBox="0 0 100 92" aria-hidden="true">
          <defs>
            <linearGradient id="msHeartGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6e2a8" />
              <stop offset=".5" stopColor="#c9a456" />
              <stop offset="1" stopColor="#8f2a35" />
            </linearGradient>
          </defs>
          <path
            className="ms-heart-path"
            d="M50 88 C20 66 4 50 4 30 C4 15 15 4 29 4 C39 4 46 10 50 18 C54 10 61 4 71 4 C85 4 96 15 96 30 C96 50 80 66 50 88 Z"
          />
        </svg>
      </div>
      <p className="ms-inter-tap">Touche pour lire</p>
    </section>
  );
}

/** Jeu « devine qui » : compte à rebours 3 · 2 · 1. */
function Guess() {
  const [n, setN] = useState<number | null>(null);
  const start = () => {
    vibrate(20);
    setN(3);
    setTimeout(() => { setN(2); vibrate(20); }, 900);
    setTimeout(() => { setN(1); vibrate(20); }, 1800);
    setTimeout(() => {
      setN(0);
      vibrate([60, 40, 120]);
      burst(window.innerWidth / 2, window.innerHeight * 0.55, 30);
    }, 2700);
  };
  return (
    <div className="ms-guess">
      {n === null && (
        <>
          <p className="ms-guess-q">Alors… qui a écrit ce mot ? 🤔</p>
          <button type="button" className="ms-btn ghost" onClick={start}>
            Je crois que je sais !
          </button>
        </>
      )}
      {n !== null && n > 0 && (
        <p className="ms-count" key={n}>
          {n}
        </p>
      )}
      {n === 0 && (
        <p className="ms-guess-a">
          Maintenant ! Dis son prénom à voix haute…
          <br />
          et regarde qui sourit ✨
        </p>
      )}
    </div>
  );
}

export function MessagesExperience() {
  const [stage, setStage] = useState<Stage>({ k: "start" });
  const [opened, setOpened] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wishing, setWishing] = useState(false);
  const a1 = useRef<HTMLAudioElement>(null);
  const a2 = useRef<HTMLAudioElement>(null);
  const active = useRef<1 | 2>(1);
  const userMuted = useRef(false);

  const total = friendMessages.length;
  const night = stage.k === "bridge" || stage.k === "finale" || stage.k === "end";

  /* ── Musique : Chopin pendant les mots, Clair de lune pour la lettre. Toujours en boucle. ── */
  const fadeIn = (a: HTMLAudioElement, target = 0.8) => {
    try {
      a.volume = 0.05;
    } catch {
      /* iOS : volume fixe */
    }
    let v = 0.05;
    const id = setInterval(() => {
      v = Math.min(target, v + 0.04);
      try {
        a.volume = v;
      } catch {
        /* iOS */
      }
      if (v >= target) clearInterval(id);
    }, 120);
  };

  const playTrack = useCallback((which: 1 | 2) => {
    const next = which === 1 ? a1.current : a2.current;
    const prev = which === 1 ? a2.current : a1.current;
    if (!next) return;
    active.current = which;
    if (prev && !prev.paused) {
      let v = prev.volume;
      const id = setInterval(() => {
        v = Math.max(0, v - 0.06);
        try {
          prev.volume = v;
        } catch {
          /* iOS */
        }
        if (v <= 0) {
          clearInterval(id);
          prev.pause();
        }
      }, 80);
      // iOS ne baisse pas le volume : on coupe directement
      setTimeout(() => prev.pause(), 1200);
    }
    if (userMuted.current) return;
    if (next.paused) {
      next.play().catch(() => {});
      fadeIn(next);
    }
  }, []);

  useEffect(() => {
    const els = [a1.current, a2.current];
    const resume = () => {
      if (userMuted.current) return;
      const a = active.current === 1 ? a1.current : a2.current;
      if (a && a.paused && a.dataset.started === "1") a.play().catch(() => {});
    };
    const onPlay = (e: Event) => ((e.target as HTMLAudioElement).dataset.started = "1");
    const onPause = () => setTimeout(resume, 500);
    els.forEach((a) => {
      a?.addEventListener("play", onPlay);
      a?.addEventListener("pause", onPause);
      a?.addEventListener("ended", resume);
    });
    const onVis = () => document.visibilityState === "visible" && resume();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      els.forEach((a) => {
        a?.removeEventListener("play", onPlay);
        a?.removeEventListener("pause", onPause);
        a?.removeEventListener("ended", resume);
      });
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const toggleMusic = () => {
    const a = active.current === 1 ? a1.current : a2.current;
    if (!a) return;
    if (userMuted.current || a.paused) {
      userMuted.current = false;
      [a1.current, a2.current].forEach((x) => x && (x.muted = false));
      a.play().catch(() => {});
      setMuted(false);
    } else {
      userMuted.current = true;
      [a1.current, a2.current].forEach((x) => x && (x.muted = true));
      setMuted(true);
    }
  };

  /* ── Navigation ── */
  const go = (s: Stage) => {
    setOpened(false);
    setStage(s);
    window.scrollTo({ top: 0 });
  };

  const begin = (e: React.MouseEvent) => {
    playTrack(1);
    vibrate(25);
    burst(e.clientX, e.clientY, 20);
    setTimeout(() => go({ k: "gate", q: 0 }), 500);
  };

  const [typed, setTyped] = useState("");
  const answer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stage.k !== "gate") return;
    const q = questions[stage.q];
    playTrack(1);
    const clean = typed.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
    if (clean.includes(ANSWER) || clean.includes("yousef") || clean.includes("youcef")) {
      setWrong(null);
      setTyped("");
      vibrate(25);
      const r = e.currentTarget.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 22);
      setTimeout(() => {
        if (stage.q + 1 < questions.length) setStage({ k: "gate", q: stage.q + 1 });
        else {
          setStage({ k: "unlock" });
          vibrate([40, 60, 40, 60, 160]);
          setTimeout(() => setStage({ k: "intro" }), 3300);
        }
      }, 650);
    } else {
      setWrong(q.wrong);
      vibrate([80, 50, 80]);
      setShakeKey((k) => k + 1);
    }
  };

  /* ── Lettre de Youssef : défile toute seule (toucher = ligne suivante). ── */
  const lineCount = youssefLines.length;
  useEffect(() => {
    if (stage.k !== "finale" || paused) return;
    const txt = stage.line < 0 ? youssefTitle : youssefLines[stage.line];
    const ms = stage.line < 0 ? 5200 : 4200 + txt.length * 50;
    const id = setTimeout(() => {
      if (stage.line + 1 < lineCount) setStage({ k: "finale", line: stage.line + 1 });
      else setStage({ k: "end" });
    }, ms);
    return () => clearTimeout(id);
  }, [stage, paused, lineCount]);

  const nextLine = () => {
    if (stage.k !== "finale") return;
    if (stage.line + 1 < lineCount) setStage({ k: "finale", line: stage.line + 1 });
    else setStage({ k: "end" });
  };
  const prevLine = () => {
    if (stage.k !== "finale" || stage.line < 0) return;
    setStage({ k: "finale", line: stage.line - 1 });
  };

  const wish = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    vibrate([50, 80, 50, 80, 200]);
    burst(r.left + r.width / 2, r.top + r.height / 2, 40);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setWishing(true);
    }, 400);
    setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * 0.46, 40), 3200);
    setTimeout(() => setWishing(false), 11000);
  };

  return (
    <main className={`ms-root ${night ? "is-night" : ""} ${wishing ? "is-wishing" : ""}`}>
      <audio ref={a1} src={MUSIC} loop preload="auto" playsInline />
      <audio ref={a2} src={MUSIC_FINALE} loop preload="none" playsInline />

      <div className="ms-bg" aria-hidden="true">
        <video className="ms-bg-video" src="/media/swans.mp4" autoPlay muted loop playsInline />
        <div className="ms-bg-veil" />
        <div className="ms-bg-night" />
      </div>
      <Sky night={night} heart={wishing} />

      {stage.k !== "start" && (
        <button
          type="button"
          className={`ms-music ${muted ? "off" : ""}`}
          onClick={toggleMusic}
          aria-label={muted ? "Remettre la musique" : "Couper la musique"}
        >
          <span />
          <span />
          <span />
          <span />
        </button>
      )}

      {/* ───────── Écran d'accueil ───────── */}
      {stage.k === "start" && (
        <section className="ms-screen ms-start" onClick={begin}>
          <p className="ms-kicker ms-in" style={{ animationDelay: ".3s" }}>
            11 · 11 · 2026
          </p>
          <h1 className="ms-name">
            <span>Nouha</span>
          </h1>
          <img className="ms-ornament ms-in" style={{ animationDelay: "2.4s" }} src={ORNAMENT} alt="" />
          <p className="ms-lead ms-in" style={{ animationDelay: "2.9s" }}>
            Ce soir, des mots t&apos;attendent…
          </p>
          <div className="ms-start-tap ms-in" style={{ animationDelay: "3.6s" }}>
            <span className="ms-start-seal">
              <span className="ms-unlock-ring" />
              <span className="ms-unlock-ring r2" />
              <img src={SEAL} alt="" draggable={false} />
            </span>
            <span className="ms-start-label">Touche pour commencer</span>
            <span className="ms-start-sound">🎧 Monte le son</span>
          </div>
        </section>
      )}

      {/* ───────── Les 3 questions ───────── */}
      {stage.k === "gate" && (
        <section className="ms-screen ms-gate" key={`q${stage.q}`}>
          <img className="ms-seal-top" src={SEAL} alt="" />
          <p className="ms-kicker">Les mots doux de Nouha</p>
          <h1 className="ms-script">Un coffre rempli d&apos;amour</h1>
          <img className="ms-ornament" src={ORNAMENT} alt="" aria-hidden="true" />
          <p className="ms-soft">Pour l&apos;ouvrir, répondez à trois petites questions…</p>

          <div className="ms-steps" aria-label={`Question ${stage.q + 1} sur ${questions.length}`}>
            {questions.map((_, i) => (
              <i key={i} className={i < stage.q ? "done" : i === stage.q ? "now" : ""} />
            ))}
          </div>

          <div className="ms-qcard" key={shakeKey} data-shake={shakeKey > 0 && wrong ? "1" : "0"}>
            <p className="ms-qnum">
              Question {stage.q + 1} / {questions.length}
            </p>
            <h2 className="ms-q">{questions[stage.q].q}</h2>
            <form className="ms-answer" onSubmit={answer}>
              <input
                className="ms-input"
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Écrivez la réponse…"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="words"
                spellCheck={false}
                enterKeyHint="done"
                aria-label="Votre réponse"
              />
              <button type="submit" className="ms-btn ms-submit" disabled={!typed.trim()}>
                Valider ♡
              </button>
            </form>
            <p className={`ms-wrong ${wrong ? "show" : ""}`} aria-live="polite">
              {wrong ?? " "}
            </p>
          </div>
        </section>
      )}

      {/* ───────── Le sceau se brise ───────── */}
      {stage.k === "unlock" && (
        <section className="ms-screen ms-unlock">
          <div className="ms-unlock-seal">
            <span className="ms-unlock-ring" />
            <span className="ms-unlock-ring r2" />
            <img src={SEAL} alt="" />
          </div>
          <p className="ms-unlock-text">Le coffre s&apos;ouvre…</p>
          <span className="ms-flash" aria-hidden="true" />
        </section>
      )}

      {/* ───────── Introduction ───────── */}
      {stage.k === "intro" && (
        <section className="ms-screen ms-intro">
          <p className="ms-kicker ms-in" style={{ animationDelay: ".2s" }}>
            Pour toi, Nouha
          </p>
          <h1 className="ms-script ms-big ms-in" style={{ animationDelay: ".6s" }}>
            Joyeux anniversaire
          </h1>
          <img className="ms-ornament ms-in" style={{ animationDelay: "1.1s" }} src={ORNAMENT} alt="" />
          <p className="ms-lead ms-in" style={{ animationDelay: "1.6s" }}>
            Ce soir, <b>{total} personnes</b> qui t&apos;aiment t&apos;ont laissé un mot.
          </p>
          <p className="ms-soft ms-in" style={{ animationDelay: "2.3s" }}>
            Sans signature. Juste leur cœur, posé sur le papier.
          </p>
          <p className="ms-lead ms-in" style={{ animationDelay: "3s" }}>
            À toi de deviner qui se cache derrière chaque mot… <span className="ms-heart">♡</span>
          </p>
          <button
            type="button"
            className="ms-btn ms-in"
            style={{ animationDelay: "3.8s" }}
            onClick={() => go({ k: "msg", i: 0 })}
          >
            Ouvrir le premier mot
          </button>
        </section>
      )}

      {/* ───────── Les mots des amies ───────── */}
      {stage.k === "msg" && !opened && (
        <div className="ms-interwrap" key={`e${stage.i}`}>
          <div className="ms-progress" aria-hidden="true">
            {friendMessages.map((_, i) => (
              <i key={i} className={i < stage.i ? "on" : i === stage.i ? "now" : ""} />
            ))}
          </div>
          <Interlude
            index={stage.i}
            total={total}
            hint={friendMessages[stage.i].hint}
            onOpen={() => {
              setOpened(true);
              window.scrollTo({ top: 0 });
            }}
          />
        </div>
      )}

      {stage.k === "msg" && opened && (
        <section className="ms-screen ms-msg" key={`m${stage.i}`}>
          <p className="ms-kicker">
            Mot doux {stage.i + 1} sur {total}
          </p>
          <div className="ms-progress" aria-hidden="true">
            {friendMessages.map((_, i) => (
              <i key={i} className={i <= stage.i ? "on" : ""} />
            ))}
          </div>

          <article className={`ms-letter ${friendMessages[stage.i].rtl ? "rtl" : ""}`}>
            <img className="ms-letter-rose" src={ROSE} alt="" aria-hidden="true" />
            <img className="ms-letter-seal" src={SEAL} alt="" aria-hidden="true" />
            <p className="ms-letter-hello" dir="ltr">
              Chère Nouha,
            </p>
            <div className="ms-letter-body" dir={friendMessages[stage.i].rtl ? "rtl" : "ltr"}>
              <Paragraphs text={friendMessages[stage.i].text} />
            </div>
            <p className="ms-letter-sign">— ? ? ?</p>
          </article>

          <Guess key={`g${stage.i}`} />

          <div className="ms-nav">
            {stage.i > 0 ? (
              <button type="button" className="ms-link" onClick={() => go({ k: "msg", i: stage.i - 1 })}>
                ← Retour
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="ms-btn"
              onClick={() => {
                if (stage.i + 1 < total) go({ k: "msg", i: stage.i + 1 });
                else {
                  playTrack(2);
                  go({ k: "bridge" });
                }
              }}
            >
              {stage.i + 1 < total ? "Mot suivant" : "Et maintenant…"}
            </button>
          </div>
        </section>
      )}

      {/* ───────── Transition vers la lettre de Youssef ───────── */}
      {stage.k === "bridge" && (
        <section className="ms-screen ms-bridge">
          <p className="ms-night-soft ms-in" style={{ animationDelay: "1s" }}>
            {total} mots. {total} cœurs. Tous pour toi.
          </p>
          <p className="ms-night-soft ms-in" style={{ animationDelay: "2.2s" }}>
            Tu les as tous lus…
          </p>
          <p className="ms-night-lead ms-in" style={{ animationDelay: "3s" }}>
            Enfin, presque.
          </p>
          <p className="ms-night-soft ms-in" style={{ animationDelay: "5.2s" }}>
            Il en reste un. Celui de quelqu&apos;un qui t&apos;aime plus que tout au monde.
          </p>
          <button
            type="button"
            className="ms-clock ms-in"
            style={{ animationDelay: "7.6s" }}
            onClick={(e) => {
              vibrate([30, 40, 30]);
              burst(e.clientX, e.clientY, 30);
              setTimeout(() => go({ k: "finale", line: -1 }), 700);
            }}
            aria-label="Ouvrir la dernière lettre"
          >
            <span className="ms-clock-glow" />
            <span className="ms-clock-num">11:11</span>
            <span className="ms-clock-hint">Fais un vœu… et touche</span>
          </button>
        </section>
      )}

      {/* ───────── La lettre de Youssef, ligne par ligne ───────── */}
      {stage.k === "finale" && (
        <section className="ms-screen ms-finale" onClick={nextLine}>
          <div className="ms-film" key={stage.line}>
            {stage.line < 0 ? (
              <>
                <p className="ms-film-num">11.11</p>
                <p className="ms-film-title">Happy Birthday, My Love.</p>
                <p className="ms-film-emoji">❤️🎂</p>
              </>
            ) : (
              <>
                {stage.line >= girlsLines.from + 1 && stage.line <= girlsLines.to && (
                  <p className="ms-film-girls">Pour les amies de Nouha 👭</p>
                )}
                <p className={`ms-film-line ${youssefLines[stage.line].length < 40 ? "short" : ""}`}>
                  <Words text={youssefLines[stage.line]} />
                </p>
              </>
            )}
          </div>
          <div className="ms-film-ctrl" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ms-ctl" onClick={prevLine} aria-label="Ligne précédente">
              ‹
            </button>
            <div className="ms-film-bar">
              <i style={{ width: `${((stage.line + 1) / lineCount) * 100}%` }} />
            </div>
            <button
              type="button"
              className="ms-ctl"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Reprendre" : "Pause"}
            >
              {paused ? "▶" : "❚❚"}
            </button>
            <button type="button" className="ms-ctl" onClick={nextLine} aria-label="Ligne suivante">
              ›
            </button>
          </div>
          <p className="ms-film-tap">Touche l&apos;écran pour continuer</p>
        </section>
      )}

      {/* ───────── Fin : signature, vidéo, vœu ───────── */}
      {stage.k === "end" && (
        <>
          <section className="ms-screen ms-end">
            <div className="ms-arch ms-in" style={{ animationDelay: ".3s" }}>
              <video src="/media/nouha.mp4" poster="/media/nouha-poster.webp" autoPlay muted loop playsInline />
            </div>
            <p className="ms-end-love ms-in" style={{ animationDelay: "1.4s" }}>
              Je t&apos;aime
            </p>
            <p className="ms-end-sign ms-in" style={{ animationDelay: "2.4s" }}>
              Youssef
            </p>
            <p className="ms-night-soft ms-in" style={{ animationDelay: "3.2s" }}>
              Ton mari, aujourd&apos;hui, demain, et dans toutes nos autres vies ♾️
            </p>
            <button type="button" className="ms-btn gold ms-in" style={{ animationDelay: "4s" }} onClick={wish}>
              ✨ Fais un vœu ✨
            </button>

            <details className="ms-full ms-in" style={{ animationDelay: "4.6s" }}>
              <summary>Relire toute la lettre</summary>
              <div className="ms-full-body">
                <p className="ms-full-title">{youssefTitle}</p>
                {youssefLines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
                <p className="ms-full-sign">Youssef</p>
              </div>
            </details>

            <button
              type="button"
              className="ms-link light ms-in"
              style={{ animationDelay: "5s" }}
              onClick={() => {
                playTrack(1);
                go({ k: "msg", i: 0 });
              }}
            >
              Relire les mots des amies
            </button>
          </section>
          {wishing && (
            <div className="ms-wish" aria-live="polite">
              <p className="ms-wish-names">
                Nouha <span>♡</span> Youssef
              </p>
              <p className="ms-wish-text">Ton vœu est entre les étoiles…</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
