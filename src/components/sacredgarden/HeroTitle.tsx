"use client";

import { useEffect, useState } from "react";

/** Event sent by the envelope when the opening video ends. */
export const OPENED_EVENT = "sg:opened";

const SPARKS = [
  { left: "6%", top: "38%", s: 14, d: "0s" },
  { left: "88%", top: "30%", s: 18, d: "0.8s" },
  { left: "18%", top: "64%", s: 10, d: "1.6s" },
  { left: "80%", top: "62%", s: 12, d: "0.4s" },
  { left: "50%", top: "18%", s: 9, d: "1.2s" },
  { left: "30%", top: "30%", s: 8, d: "2s" },
  { left: "70%", top: "80%", s: 9, d: "2.4s" },
];

/**
 * Titre d'accueil : « Joyeux Anniversaire », le prénom en lettres d'or écrites
 * comme à la plume, la date et le lieu. Les animations démarrent quand
 * l'enveloppe s'ouvre.
 */
export function HeroTitle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const start = () => setOn(true);
    window.addEventListener(OPENED_EVENT, start);
    return () => window.removeEventListener(OPENED_EVENT, start);
  }, []);

  return (
    <div className={`sg-hero${on ? " is-on" : ""}`}>
      <div className="sg-hero-glow" aria-hidden="true" />
      {SPARKS.map((p, i) => (
        <svg
          key={i}
          className="sg-hero-spark"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ left: p.left, top: p.top, width: p.s, height: p.s, animationDelay: p.d }}
        >
          <path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z" />
        </svg>
      ))}

      <p className="sg-hero-kicker">
        <span aria-hidden="true">✦</span> Vous êtes invitées <span aria-hidden="true">✦</span>
      </p>
      <p className="sg-hero-title">Joyeux Anniversaire</p>
      <h1 className="sg-hero-name">
        <span className="sg-hero-ink">Nouha</span>
      </h1>
      <div className="sg-hero-date">
        <i aria-hidden="true" />
        <span>11 · 11 · 2026</span>
        <i aria-hidden="true" />
      </div>
      <div className="sg-hero-heart" aria-hidden="true">
        <svg viewBox="0 0 260 70">
          <defs>
            <linearGradient id="sgHeartGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8a6a2a" />
              <stop offset="0.45" stopColor="#e3c98b" />
              <stop offset="0.6" stopColor="#fff1c9" />
              <stop offset="1" stopColor="#a67d2b" />
            </linearGradient>
          </defs>
          <path className="sg-hh-line l" d="M8 38 C40 38 62 30 92 36 C100 37.5 104 40 108 40" />
          <path className="sg-hh-line r" d="M252 38 C220 38 198 30 168 36 C160 37.5 156 40 152 40" />
          <circle className="sg-hh-dot" cx="8" cy="38" r="1.8" />
          <circle className="sg-hh-dot" cx="252" cy="38" r="1.8" />
          <g className="sg-hh-beat">
            <path
              className="sg-hh-heart"
              d="M130 58 C112 46 104 37 104 28 C104 20.5 110 15 117 15 C122.5 15 127 18.5 130 23.5 C133 18.5 137.5 15 143 15 C150 15 156 20.5 156 28 C156 37 148 46 130 58 Z"
            />
            <path className="sg-hh-inner" d="M130 50 C118 42 112.5 35.5 112.5 29 C112.5 24.5 116 21.5 119.5 21.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
