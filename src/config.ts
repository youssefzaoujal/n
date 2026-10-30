/**
 * Infos utilisées par le compte à rebours, le coffre et l'aperçu du lien.
 * Les textes de l'invitation (lieu, programme, dress code…) sont dans
 * src/components/sacredgarden/content.json.
 */
export const invitation = {
  name: "Nouha",
  /** Date et heure de la fête (heure du Maroc, UTC+1). Change l'heure quand elle est fixée. */
  date: "2026-11-11T20:00:00+01:00",
  dateLabel: "Mercredi 11 novembre 2026",
  dateShort: "11 · 11 · 2026",
  host: "Youssef",
  /** Passe à true et écris l'heure (ex. "20h30") quand elle est fixée : la section « L'heure » l'affichera. */
  timeRevealed: false as boolean,
  time: "",
  /** Le coffre (/coffre) s'ouvre à partir de cette date. */
  vaultOpensAt: "2026-11-11T00:00:00+01:00",
} as const;
