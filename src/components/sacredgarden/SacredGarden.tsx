"use client";

import Lenis from "lenis";
import { Fragment, useEffect, useRef } from "react";
import contentJson from "./content.json";
import { Countdown } from "./Countdown";
import { Envelope } from "./Envelope";
import { HeroTitle } from "./HeroTitle";
import { MagicFx } from "./MagicFx";
import { initMotion } from "./motion";
import { RsvpPopup } from "./RsvpPopup";
import { LetterSection, LoveSection, TimeSection, WordsSection } from "./Sections";
import type { SiteContent } from "./types";
import { ZeroSection } from "./ZeroSection";

const content = contentJson as unknown as SiteContent;

/** data-elem-id of the HTML element that hosts the countdown in the "countdown" record. */
const COUNTDOWN_ELEMENT = "1771277551711000001";

export function SacredGarden() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const stopMotion = initMotion(root.current);

    // Défilement fluide (souris / pavé tactile) ; le doigt garde le défilement natif du téléphone.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce
      ? null
      : new Lenis({
          lerp: 0.085,
          wheelMultiplier: 0.9,
          smoothWheel: true,
          prevent: (node: HTMLElement) => !!node.closest?.(".t-popup"),
        });
    let lenisRaf = 0;
    const lenisLoop = (t: number) => {
      lenis?.raf(t);
      lenisRaf = requestAnimationFrame(lenisLoop);
    };
    if (lenis) lenisRaf = requestAnimationFrame(lenisLoop);
    // Pas de défilement de la page derrière l'enveloppe ni derrière le formulaire.
    const syncLock = () => {
      const locked = document.body.classList.contains("t-body_popupshowed") || !!document.getElementById("weiOverlay");
      if (locked) lenis?.stop();
      else lenis?.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["class"], childList: true, subtree: true });
    syncLock();
    // Vidéos en boucle (cygnes, Nouha) : toujours relancées quand elles sont visibles.
    const loops = [...root.current.querySelectorAll<HTMLVideoElement>("video[loop]")];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting && v.paused) {
          v.muted = true;
          v.play().catch(() => {});
        }
      }
    });
    loops.forEach((v) => {
      v.muted = true;
      v.loop = true;
      io.observe(v);
      v.addEventListener("pause", () => {
        if (!document.hidden) v.play().catch(() => {});
      });
    });
    loops.forEach((v) => {
      // si la boucle native échoue (certains téléphones), on repart du début
      v.addEventListener("ended", () => {
        v.currentTime = 0;
        v.play().catch(() => {});
      });
      v.addEventListener("stalled", () => v.play().catch(() => {}));
    });
    const onVisible = () => {
      if (!document.hidden) loops.forEach((v) => v.play().catch(() => {}));
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);
    window.addEventListener("pointerdown", onVisible, { passive: true });
    // filet de sécurité : toute vidéo visible en pause est relancée
    const videoWatchdog = setInterval(() => {
      if (document.hidden) return;
      for (const v of loops) {
        const r = v.getBoundingClientRect();
        if (v.paused && r.bottom > 0 && r.top < window.innerHeight) v.play().catch(() => {});
      }
    }, 2500);
    return () => {
      stopMotion();
      cancelAnimationFrame(lenisRaf);
      lenis?.destroy();
      lockObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
      window.removeEventListener("pointerdown", onVisible);
      clearInterval(videoWatchdog);
    };
  }, []);

  return (
    <div
      id="allrecords"
      ref={root}
      className="t-records"
      data-tilda-page-alias="thesacredgarden"
      data-tilda-lazy="yes"
    >
      <MagicFx />
      {content.records.map((record) => {
        if (record.name === "envelope") {
          return (
            <div key={record.id} id={record.id} className={record.className} data-record-type={record.type} data-section="envelope">
              <Envelope envelope={content.assets.envelope} video={content.assets.openingVideo} music={content.assets.music} />
            </div>
          );
        }
        if (record.name === "rsvpPopup") return <RsvpPopup key={record.id} recordId={record.id} />;
        // La section « message secret » d'origine est remplacée par « Des mots rien que pour elle ».
        if (record.name === "rsvp") return <WordsSection key={record.id} />;
        return (
          <Fragment key={record.id}>
          {record.name === "closing" && <LoveSection />}
          <ZeroSection
            record={record}
            slots={
              record.name === "countdown"
                ? { [COUNTDOWN_ELEMENT]: <Countdown /> }
                : record.name === "hero"
                  ? { "sg-hero": <HeroTitle /> }
                  : undefined
            }
          />
          {record.name === "hero" && <LetterSection />}
          {record.name === "map" && <TimeSection />}
          </Fragment>
        );
      })}
    </div>
  );
}
