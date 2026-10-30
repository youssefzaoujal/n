import type { Metadata, Viewport } from "next";
import "@/components/sacredgarden/sacredgarden.css";
import "@/components/sacredgarden/overrides.css";
import { invitation } from "@/config";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description = `${invitation.dateLabel} · Dar Tanja, Tanger — une soirée pour célébrer l'anniversaire de ${invitation.name}. Ouvrez votre invitation 💌`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Anniversaire de ${invitation.name} · ${invitation.dateShort}`,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title: `Vous êtes invitées à l'anniversaire de ${invitation.name} ✨`,
    description,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: `Invitation — anniversaire de ${invitation.name}` }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og.jpg"] },
  formatDetection: { telephone: false },
  icons: { icon: "/icon.png", apple: "/images/apple-touch-icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

/** Même structure que la page Tilda d'origine : pas de reset CSS en plus. */
export default function InvitationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="t-body" style={{ margin: 0 }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
