"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { ANSWER, friendMessages, questions, youssefLines, youssefTitle, MUSIC } from "./data";

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
    type Star = { x: number; y: number; cx: number; cy: number; r: number; tw: number; ph: number; kind: 0 | 1 | 2; hx: number; hy: number };
    type Dust = { x: number; y: number; r: number; vx: number; vy: number; ph: number };
    type Shoot = { x: number; y: number; vx: number; vy: number; life: number };
    let stars: Star[] = [];
    let dust: Dust[] = [];
    const shoots: Shoot[] = [];

    /* Cœur en étoiles : 200 étoiles dispersées qui se rassemblent une à une. */
    const heartPoint = (t: number) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return [x, -y];
    };
    const HEART_N = 200;
    // points répartis régulièrement le long du contour
    const dense: number[][] = [];
    const cum: number[] = [0];
    for (let i = 0; i <= 3000; i++) {
      dense.push(heartPoint((Math.PI * 2 * i) / 3000));
      if (i > 0) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
    }
    const totalLen = cum[cum.length - 1];
    const outline: number[][] = [];
    for (let k = 0, j = 0; k < HEART_N; k++) {
      const target = (totalLen * k) / HEART_N;
      while (cum[j] < target) j++;
      outline.push(dense[j]);
    }

    type HStar = { sx: number; sy: number; tx: number; ty: number; r: number; tw: number; delay: number };
    let hstars: HStar[] = [];
    let heartStart = -1;
    const makeHeart = () => {
      hstars = outline.map(([tx, ty]) => ({
        sx: Math.random() * W,
        sy: Math.random() * H,
        tx,
        ty,
        r: 1 + Math.random() * 1.6,
        tw: Math.random() * 6.28,
        delay: Math.random() * 0.5,
      }));
    };

    /* Cœur en haut, « Je t'aime » en dessous : l'ensemble est centré dans l'écran. */
    const TEXT_BLOCK = 100; // espace + hauteur du texte sous le cœur
    const heartLayout = () => {
      const scale = Math.min(W, H) / 36;
      const total = 28.92 * scale + TEXT_BLOCK;
      const top = (H - total) / 2;
      return { cy: top + 11.92 * scale, scale, textTop: top + 28.92 * scale + 26 };
    };
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((W * H) / 3000) }, () => {
        const x = Math.random() * W;
        const y = Math.random() * H;
        return { x, y, cx: x, cy: y, r: Math.random() * 1.3 + 0.2, tw: 0.6 + Math.random() * 2, ph: Math.random() * 6.28, kind: 0 as const, hx: 0, hy: 0 };
      });
      dust = Array.from({ length: Math.min(46, Math.round((W * H) / 20000)) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.08 + Math.random() * 0.25),
        ph: Math.random() * 6.28,
      }));
      if (hstars.length) makeHeart();
      c.parentElement?.style.setProperty("--love-top", `${heartLayout().textTop}px`);
    };
    resize();
    window.addEventListener("resize", resize);
    let nightAmt = nightRef.current ? 1 : 0;
    let raf = 0;
    let last = 0;
    const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const draw = (t: number) => {
      const dt = Math.min(50, t - (last || t));
      last = t;
      nightAmt += ((nightRef.current ? 1 : 0) - nightAmt) * 0.02;
      ctx.clearRect(0, 0, W, H);
      const s = t / 1000;
      if (nightAmt > 0.01) {
        // ciel étoilé
        for (const st of stars) {
          const a = nightAmt * (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s * st.tw + st.ph)));
          ctx.fillStyle = `rgba(255,246,225,${a})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, 6.28);
          ctx.fill();
        }

        // le cœur
        if (heartRef.current) {
          if (heartStart < 0) {
            heartStart = t;
            makeHeart();
          }
          const ease = easeInOut(Math.min(1, (t - heartStart) / 5000));
          const cx = W / 2;
          const { cy, scale } = heartLayout();
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(255,45,107,0.6)";
          for (const h of hstars) {
            const e = Math.max(0, Math.min(1, (ease - h.delay) / (1 - h.delay)));
            const x = h.sx + (cx + h.tx * scale - h.sx) * e;
            const y = h.sy + (cy + h.ty * scale - h.sy) * e;
            h.tw += 0.03 * (dt / 16);
            const alpha = 0.4 + 0.6 * Math.abs(Math.sin(h.tw));
            ctx.beginPath();
            ctx.arc(x, y, h.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fill();
          }
          ctx.restore();
        } else {
          heartStart = -1;
        }

        const rate = heartRef.current ? 0.015 : 0.012;
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

function vibrate(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* pas de vibration */
  }
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Interlude avant chaque mot doux : un chiffre d'or, une phrase-indice, un cœur qui se dessine. */
function Interlude({ index, total, onOpen }: { index: number; total: number; onOpen: () => void }) {
  const [going, setGoing] = useState(false);
  const click = () => {
    if (going) return;
    setGoing(true);
    vibrate([20, 40, 60]);
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
      <p className="ms-inter-tap">Touche pour lire</p>
    </section>
  );
}

/** Jeu « devine qui » : compte à rebours 3 · 2 · 1. */
function Guess() {
  const [shown, setShown] = useState(false);
  const start = () => {
    vibrate(30);
    setShown(true);
  };
  return (
    <div className="ms-guess">
      {!shown && (
        <>
          <p className="ms-guess-q">Alors… qui a écrit ce mot ? 🤔</p>
          <button type="button" className="ms-btn ghost" onClick={start}>
            Je crois que je sais !
          </button>
        </>
      )}
      {shown && (
        <p className="ms-guess-a">
          Dis son prénom à voix haute…
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
  const [muted, setMuted] = useState(false);
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

  const begin = () => {
    playTrack(1);
    vibrate(25);
    setTimeout(() => go({ k: "gate", q: 0 }), 500);
  };

  const [typed, setTyped] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [shaking, setShaking] = useState(false);
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
      setLeaving(true);
      setTimeout(() => {
        setLeaving(false);
        if (stage.q + 1 < questions.length) setStage({ k: "gate", q: stage.q + 1 });
        else {
          setStage({ k: "unlock" });
          vibrate([40, 60, 40, 60, 160]);
          setTimeout(() => setStage({ k: "intro" }), 3300);
        }
      }, 450);
    } else {
      setWrong(q.wrong);
      vibrate([80, 50, 80]);
      setShaking(true);
      setTimeout(() => setShaking(false), 560);
    }
  };

  /* ── Lettre de Youssef : défile toute seule (toucher = ligne suivante). ── */
  const lineCount = youssefLines.length;

  const nextLine = () => {
    if (stage.k !== "finale") return;
    if (stage.line + 1 < lineCount) setStage({ k: "finale", line: stage.line + 1 });
    else setStage({ k: "end" });
  };
  const prevLine = () => {
    if (stage.k !== "finale" || stage.line < 0) return;
    setStage({ k: "finale", line: stage.line - 1 });
  };

  return (
    <main className={`ms-root ${night ? "is-night" : ""}`}>
      <audio ref={a1} src={MUSIC} loop preload="auto" playsInline />

      <div className="ms-bg" aria-hidden="true">
        <video className="ms-bg-video" src="/media/swans.mp4" autoPlay muted loop playsInline />
        <div className="ms-bg-veil" />
        <div className="ms-bg-night" />
      </div>
      <Sky night={night} heart={stage.k === "end"} />

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
            <span className="ms-start-label">Touche pour ouvrir le coffre</span>
          </div>
        </section>
      )}

      {/* ───────── Les 3 questions ───────── */}
      {stage.k === "gate" && (
        <section className="ms-screen ms-gate" key="gate">
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

          <div className={`ms-qcard ${shaking ? "is-shaking" : ""}`}>
            <div className={`ms-qswap ${leaving ? "out" : ""}`} key={stage.q}>
              <p className="ms-qnum">
                Question {stage.q + 1} / {questions.length}
              </p>
              <h2 className="ms-q">{questions[stage.q].q}</h2>
            </div>
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
          </article>

          <Guess key={`g${stage.i}`} />

          <div className="ms-nav">
            {stage.i > 0 ? (
              <button type="button" className="ms-link" onClick={() => go({ k: "msg", i: stage.i - 1 })}>
                Retour
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
            onClick={() => {
              vibrate([30, 40, 30]);
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
                <p className="ms-film-title">
                  Happy Birthday,
                  <br />
                  {(youssefTitle.split("|")[1] ?? youssefTitle).replace(/^\s*Happy Birthday,?\s*/i, "").trim()}
                </p>
                <p className="ms-film-emoji">❤️🎂</p>
              </>
            ) : (
              <>
                <p className={`ms-film-line ${youssefLines[stage.line].length < 40 ? "short" : ""}`}>
                  <Words text={youssefLines[stage.line]} />
                </p>
              </>
            )}
          </div>
          <div className="ms-film-ctrl" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ms-ctl" onClick={prevLine} aria-label="Ligne précédente">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="ms-film-bar">
              <i style={{ width: `${((stage.line + 1) / lineCount) * 100}%` }} />
            </div>
            <button type="button" className="ms-ctl" onClick={nextLine} aria-label="Ligne suivante">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <p className="ms-film-tap">Touche l&apos;écran pour continuer</p>
        </section>
      )}

      {/* ───────── Fin : « Je t'aime » au cœur d'un cœur d'étoiles ───────── */}
      {stage.k === "end" && (
        <div className="ms-final" aria-live="polite">
          <p className="ms-final-love">Je t&apos;aime</p>
        </div>
      )}
    </main>
  );
}
