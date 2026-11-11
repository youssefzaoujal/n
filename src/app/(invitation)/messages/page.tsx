import type { Metadata } from "next";
import { MessagesExperience } from "@/components/messages/MessagesExperience";
import "@/components/messages/messages.css";

export const metadata: Metadata = {
  title: "Les mots doux de Nouha ♡",
  description: "Un coffre rempli d'amour pour l'anniversaire de Nouha.",
  openGraph: {
    title: "Les mots doux de Nouha ♡",
    description: "Un coffre rempli d'amour pour l'anniversaire de Nouha.",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return <MessagesExperience />;
}
