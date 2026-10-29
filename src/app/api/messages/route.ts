import { NextResponse } from "next/server";
import { addMessage, countMessages } from "@/lib/store";

export const dynamic = "force-dynamic";

const MIN = 2;
const MAX = 1500;

/** Limite simple : 5 messages par minute et par connexion (meilleur effort, en mémoire). */
const hits = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 5;
}

export async function GET() {
  try {
    return NextResponse.json({ count: await countMessages() });
  } catch {
    return NextResponse.json({ count: null });
  }
}

export async function POST(req: Request) {
  let body: { text?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  // Champ piège invisible : rempli seulement par les robots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  const text = typeof body.text === "string" ? body.text.replace(/\r\n/g, "\n").trim() : "";
  if (text.length < MIN) return NextResponse.json({ error: "Ton message est un peu court." }, { status: 400 });
  if (text.length > MAX) return NextResponse.json({ error: `${MAX} caractères maximum.` }, { status: 400 });

  // L'adresse IP sert uniquement à limiter les envois ; elle n'est jamais enregistrée.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "Doucement… réessaie dans une minute." }, { status: 429 });

  try {
    await addMessage(text);
    return NextResponse.json({ ok: true, count: await countMessages() });
  } catch (e) {
    const full = e instanceof Error && e.message === "full";
    return NextResponse.json(
      { error: full ? "Le coffre est plein !" : "Le coffre n'est pas joignable pour le moment. Réessaie plus tard." },
      { status: full ? 507 : 503 },
    );
  }
}
