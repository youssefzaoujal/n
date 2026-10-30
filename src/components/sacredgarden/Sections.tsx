"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { invitation } from "@/config";

const IMG = "/sites/thesacredgarden/images";
const ORNAMENT = `${IMG}/3232-3638-acomm-decor.png`;
const ROSE = `${IMG}/3635-3664-rose_-_Copy.png`;
const LEFT = `${IMG}/3638-3336-left-element_1.png`;
const RIGHT = `${IMG}/6131-6362-right-element_1.png`;
const SEAL = `${IMG}/seal-yn.png`;

/** Apparition au défilement, gérée par motion.ts (même animation que le reste du site). */
function reveal(style: "fadein" | "fadeinup" | "zoomin", delay = 0, duration = 1.6, cls = "") {
  return {
    className: `tn-elem t-animate ${cls}`.trim(),
    "data-animate-style": style,
    "data-animate-duration": String(duration),
    "data-animate-delay": String(delay),
    ...(style === "fadeinup" ? { "data-animate-distance": "30" } : {}),
    ...(style === "zoomin" ? { "data-animate-scale": "0.92" } : {}),
  };
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="sg-s-title-wrap">
      <img className="sg-s-flourish left" src={LEFT} alt="" aria-hidden="true" />
      <h2 className="sg-s-title">{children}</h2>
      <img className="sg-s-flourish right" src={RIGHT} alt="" aria-hidden="true" />
    </div>
  );
}

/* ───────── « Une nuit pour elle » ───────── */

export function LetterSection() {
  return (
    <section className="sg-s sg-letter" aria-labelledby="sg-letter-title">
      <div className="sg-s-inner">
        <div {...reveal("fadeinup")}>
          <p className="sg-s-kicker">Une lettre pour vous</p>
          <h2 className="sg-s-title" id="sg-letter-title">
            Une nuit pour elle ✨
          </h2>
          <img className="sg-s-ornament" src={ORNAMENT} alt="" aria-hidden="true" />
        </div>
        <div {...reveal("fadeinup", 0.15, 1.6, "sg-paper")}>
          <img className="sg-paper-rose" src={ROSE} alt="" aria-hidden="true" />
          <p className="sg-paper-hello">Chères amies,</p>
          <p className="sg-paper-lead">
            Il y a des personnes qu&apos;on ne se contente pas de fêter. <em>On les célèbre.</em>
          </p>
          <p>Le 11 novembre, retrouvons-nous pour une soirée aussi belle que celle qui nous réunit.</p>
          <p>
            Une soirée remplie de rires, de tendresse, de petits instants magiques et de souvenirs qui resteront gravés
            dans nos cœurs.
          </p>
          <p>Parce que certaines personnes méritent qu&apos;on leur rappelle à quel point elles sont aimées.</p>
          <p className="sg-paper-end">Et Nouha en fait partie. <span className="sg-heart">♡</span></p>
        </div>
      </div>
    </section>
  );
}

/* ───────── « L'heure de notre rendez-vous » ───────── */

/** Date à laquelle l'heure sera dévoilée (8 novembre, 3 jours avant). */
const REVEAL_AT = new Date("2026-11-08T00:00:00+01:00").getTime();

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

export function TimeSection() {
  const now = useNow();
  const known = invitation.timeRevealed;
  const left = now === null ? null : Math.max(0, REVEAL_AT - now);
  const days = left === null ? null : Math.floor(left / 86400000);
  const hours = left === null ? null : Math.floor((left % 86400000) / 3600000);

  return (
    <section className="sg-s sg-time" aria-labelledby="sg-time-title">
      <div className="sg-s-inner">
        <div {...reveal("fadeinup")}>
          <p className="sg-s-kicker">Le rendez-vous</p>
          <Title>
            <span id="sg-time-title">L&apos;heure de notre rendez-vous <span className="sg-heart">♡</span></span>
          </Title>
          <img className="sg-s-ornament" src={ORNAMENT} alt="" aria-hidden="true" />
        </div>

        <div {...reveal("zoomin", 0.15, 1.8, "sg-time-arch")}>
          <svg className="sg-time-clock" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="26" r="17" />
            <path d="M24 15v11l7 5M19 5h10M24 5v4" />
          </svg>
          {known ? (
            <p className="sg-time-hour">{invitation.time}</p>
          ) : (
            <p className="sg-time-hour mystery" aria-label="Heure encore secrète">
              <span>?</span>
              <span>?</span>
              <i>h</i>
              <span>?</span>
              <span>?</span>
            </p>
          )}
          <p className="sg-time-date">Mercredi 11 novembre</p>
        </div>

        {known ? (
          <p {...reveal("fadeinup", 0.2, 1.6, "sg-s-text")}>
            La magie commencera à {invitation.time}. On vous attend <span className="sg-heart">♡</span>
          </p>
        ) : (
          <div {...reveal("fadeinup", 0.2)}>
            <p className="sg-s-lead">Les plus belles soirées méritent un peu de mystère…</p>
            <p className="sg-s-text">L&apos;heure exacte de la célébration n&apos;est pas encore fixée.</p>
            <p className="sg-s-text">
              Revenez sur ce site le <b>8 novembre</b>, trois jours avant l&apos;anniversaire de Nouha, pour découvrir
              l&apos;heure à laquelle la magie commencera. ✨
            </p>
            {left !== null && left > 0 && (
              <p className="sg-time-badge">
                Révélation dans {days} {days === 1 ? "jour" : "jours"} et {hours} h
              </p>
            )}
            <p className="sg-s-soft">Encore un peu de patience… la plus belle des soirées se prépare. <span className="sg-heart">♡</span></p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── « Des mots rien que pour elle » ───────── */

export function WordsSection() {
  return (
    <section className="sg-s sg-words" aria-labelledby="sg-words-title">
      <div className="sg-s-inner">
        <div {...reveal("fadeinup")}>
          <p className="sg-s-kicker">Un cadeau qui ne s&apos;oublie pas</p>
          <h2 className="sg-s-title" id="sg-words-title">
            Des mots rien que pour elle 💌
          </h2>
          <img className="sg-s-ornament" src={ORNAMENT} alt="" aria-hidden="true" />
        </div>
        <div {...reveal("fadeinup", 0.15)}>
          <p className="sg-s-lead">Et si on lui offrait quelque chose qui ne s&apos;oublie jamais ?</p>
          <p className="sg-s-text">
            Quelques mots sincères. Un souvenir. Une pensée douce. Tout ce que vous avez toujours voulu lui dire.
          </p>
          <p className="sg-s-text">
            Laissez un message anonyme à Nouha. Elle découvrira vos petits mots le soir de son anniversaire.
          </p>
        </div>

        <a href="#popup:myform" aria-label="Lui laisser un mot doux" {...reveal("zoomin", 0.25, 1.6, "sg-words-seal")}>
          <span className="sg-ws-ripple" aria-hidden="true" />
          <span className="sg-ws-ripple r2" aria-hidden="true" />
          <span className="sg-ws-ripple r3" aria-hidden="true" />
          <span className="sg-words-halo" aria-hidden="true" />
          <svg className="sg-ws-ring" viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <path id="sgWsCircle" d="M150 150 m-122 0 a122 122 0 1 1 244 0 a122 122 0 1 1 -244 0" />
            </defs>
            <circle cx="150" cy="150" r="136" className="sg-ws-dash" />
            <text>
              <textPath href="#sgWsCircle" startOffset="0" textLength="752" lengthAdjust="spacing">
                Touchez le sceau ✦ un mot doux pour Nouha ✦
              </textPath>
            </text>
          </svg>
          <span className="sg-ws-orbit" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="sg-ws-seal">
            <img src={SEAL} alt="" draggable={false} />
            <span className="sg-ws-shine" aria-hidden="true" />
          </span>
        </a>

        <div {...reveal("fadeinup", 0.35)}>
          <a className="sg-btn" href="#popup:myform">
            Lui laisser un mot doux <span className="sg-heart">♡</span>
          </a>
          <p className="sg-s-soft">Parfois, les plus beaux cadeaux sont ceux qui viennent du cœur.</p>
        </div>
      </div>
    </section>
  );
}

/* ───────── « On vous attend » ───────── */

export function LoveSection() {
  return (
    <section className="sg-s sg-love" aria-label="On vous attend">
      <div className="sg-s-inner">
        <div {...reveal("fadeinup")}>
          <img className="sg-s-ornament top" src={ORNAMENT} alt="" aria-hidden="true" />
          <p className="sg-s-lead">
            Pour les rires qui résonnent, les regards complices, les souvenirs qui se créent et tout l&apos;amour qui nous
            rassemble.
          </p>
        </div>
        <div {...reveal("fadeinup", 0.15)}>
          <p className="sg-love-big">Une nuit pour célébrer Nouha.</p>
          <p className="sg-s-text">Et tout ce qu&apos;elle représente pour nous.</p>
        </div>
        <p {...reveal("fadeinup", 0.3, 1.6, "sg-s-soft")}>
          Parce qu&apos;une seule soirée ne suffira jamais à lui montrer tout l&apos;amour qu&apos;on lui porte… mais on
          peut toujours essayer.
        </p>
      </div>
    </section>
  );
}
