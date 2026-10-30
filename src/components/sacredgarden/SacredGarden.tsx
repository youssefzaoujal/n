"use client";

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
    const onVisible = () => {
      if (!document.hidden) loops.forEach((v) => v.play().catch(() => {}));
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopMotion();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
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
