"use client";

import { useEffect, useRef, useState } from "react";
import { invitation } from "@/config";

/** Anniversaire de Nouha : 11 novembre 2026 (heure du Maroc, à ajuster dans src/config.ts). */
const EVENT_DATE = new Date(invitation.date);

type Unit = "days" | "hours" | "minutes" | "seconds";

function remaining(now: number) {
  const dist = EVENT_DATE.getTime() - now;
  if (dist < 0) return null;
  return {
    days: String(Math.floor(dist / 86400000)),
    hours: String(Math.floor((dist % 86400000) / 3600000)).padStart(2, "0"),
    minutes: String(Math.floor((dist % 3600000) / 60000)).padStart(2, "0"),
    seconds: String(Math.floor((dist % 60000) / 1000)).padStart(2, "0"),
  };
}

/** A digit that slides out/in when its value changes (same DOM steps as the source "flip"). */
function FlipNumber({ id, value, revealed }: { id: string; value: string; revealed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [initial] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.textContent === value) return;
    el.classList.add("flip-out");
    const t = setTimeout(() => {
      el.classList.remove("flip-out");
      el.classList.add("flip-in");
      el.textContent = value;
      void el.offsetHeight;
      el.classList.remove("flip-in");
    }, 520);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div ref={ref} className={revealed ? "number revealed" : "number"} id={id} suppressHydrationWarning>
      {initial}
    </div>
  );
}

const BLOCKS: { block: string; unit: Unit; label: string }[] = [
  { block: "tb-days", unit: "days", label: "Jours" },
  { block: "tb-hours", unit: "hours", label: "Heures" },
  { block: "tb-mins", unit: "minutes", label: "Minutes" },
  { block: "tb-secs", unit: "seconds", label: "Secondes" },
];

export function Countdown() {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<ReturnType<typeof remaining> | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const tick = () => setTime(remaining(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (time === null) {
    return (
      <div id="countdownContainer" ref={ref}>
        C&apos;est le grand soir !
      </div>
    );
  }

  const r = revealed ? " revealed" : "";
  return (
    <div className={`sg-cd${r}`}>
    <p className="sg-cd-sub">Encore quelques instants avant une nuit que l&apos;on n&apos;oubliera pas…</p>
    <div id="countdownContainer" ref={ref}>
      {BLOCKS.map(({ block, unit, label }, i) => (
        <div key={block} style={{ display: "contents" }}>
          {i > 0 && <div className={`separator sep${i}${r}`}>:</div>}
          <div className="time-block" id={block}>
            <div className="number-wrap">
              <FlipNumber id={unit} value={time ? time[unit] : unit === "days" ? "168" : "00"} revealed={revealed} />
            </div>
            <div className={`label${r}`}>{label}</div>
          </div>
        </div>
      ))}
    </div>
    <p className="sg-cd-after">La magie approche…</p>
    </div>
  );
}
