export type ZeroElementType = "text" | "image" | "shape" | "html" | "vector" | "button";

/** One absolutely positioned element of a Tilda Zero Block artboard. */
export interface ZeroElement {
  id: string;
  type: ZeroElementType | string;
  className: string;
  /** data-elem-* and data-animate-* attributes read by motion.ts. */
  attrs: Record<string, string>;
  /** Inner markup of the element (the .tn-atom node). */
  html: string;
}

export interface SiteRecord {
  id: string;
  name: string;
  type: string;
  className: string;
  attrs: Record<string, string>;
  artboard?: Record<string, string>;
  elements?: ZeroElement[];
}

export interface SiteContent {
  source: string;
  assets: Record<
    "envelope" | "openingVideo" | "music" | "favicon" | "faviconLight" | "faviconDark" | "appleTouchIcon" | "ogImage",
    string
  >;
  records: SiteRecord[];
}
