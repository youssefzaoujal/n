"use client";

import { useEffect, useRef } from "react";
import contentJson from "./content.json";
import { Countdown } from "./Countdown";
import { Envelope } from "./Envelope";
import { initMotion } from "./motion";
import { RsvpPopup } from "./RsvpPopup";
import type { SiteContent } from "./types";
import { ZeroSection } from "./ZeroSection";

const content = contentJson as unknown as SiteContent;

/** data-elem-id of the HTML element that hosts the countdown in the "countdown" record. */
const COUNTDOWN_ELEMENT = "1771277551711000001";

export function SacredGarden() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return initMotion(root.current);
  }, []);

  return (
    <div
      id="allrecords"
      ref={root}
      className="t-records"
      data-tilda-page-alias="thesacredgarden"
      data-tilda-lazy="yes"
    >
      {content.records.map((record) => {
        if (record.name === "envelope") {
          return (
            <div key={record.id} id={record.id} className={record.className} data-record-type={record.type} data-section="envelope">
              <Envelope envelope={content.assets.envelope} video={content.assets.openingVideo} music={content.assets.music} />
            </div>
          );
        }
        if (record.name === "rsvpPopup") return <RsvpPopup key={record.id} recordId={record.id} />;
        return (
          <ZeroSection
            key={record.id}
            record={record}
            slots={record.name === "countdown" ? { [COUNTDOWN_ELEMENT]: <Countdown /> } : undefined}
          />
        );
      })}
    </div>
  );
}
