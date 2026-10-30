"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

const POPUP_HOOK = "#popup:myform";
const SEAL = "/sites/thesacredgarden/images/seal-yn.png";
/** Formulaire Formspree de Youssef (les réponses arrivent par e-mail). */
const FORMSPREE = "https://formspree.io/f/xdeellab";
const ORNAMENT = "/sites/thesacredgarden/images/3232-3638-acomm-decor.png";

/**
 * « Un message secret pour Nouha » : une lettre sur papier crème, cachet Y&N,
 * ouverte par le cachet de la section (lien #popup:myform). Le message est
 * envoyé à /api/messages, sans nom ni adresse.
 */
export function RsvpPopup({ recordId }: { recordId: string }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  const open = useCallback(() => {
    setMounted(true);
    setSuccess(false);
    setError("");
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    document.body.classList.add("t-body_popupshowed");
    setTimeout(() => area.current?.focus({ preventScroll: true }), 700);
  }, []);

  const close = useCallback(() => {
    setShown(false);
    document.body.classList.remove("t-body_popupshowed");
    setTimeout(() => setMounted(false), 450);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.(`a[href="${POPUP_HOOK}"]`);
      if (a) {
        e.preventDefault();
        open();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    if (text.trim().length < 2) {
      setError("Écrivez-lui quelques mots avant d’envoyer.");
      area.current?.focus();
      return;
    }
    setError("");
    setSending(true);
    const started = Date.now();
    try {
      // Envoi à Formspree : chaque mot arrive par e-mail, sans nom ni adresse de l'invitée.
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          message: text,
          _subject: "💌 Un mot doux pour Nouha",
          _gotcha: website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: { message?: string }[] };
      if (!res.ok || data.ok === false) {
        throw new Error(data.errors?.[0]?.message || "L'envoi n'a pas abouti. Réessayez dans un instant.");
      }
      // Laisse le temps à l'animation de pliage de la lettre.
      await new Promise((r) => setTimeout(r, Math.max(0, 1100 - (Date.now() - started))));
      setText("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'envoi n'a pas abouti. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div id={recordId} className="r t-rec" data-record-type="702" data-section="rsvpPopup">
      <div
        className={`t-popup sgm-overlay${shown ? " t-popup_show is-shown" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sgm-title"
        tabIndex={-1}
        data-tooltip-hook={POPUP_HOOK}
        style={{ display: mounted ? "block" : "none" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="sgm-center" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className={`sgm-card${sending ? " is-sending" : ""}${success ? " is-sent" : ""}`}>
            <button type="button" className="sgm-close" aria-label="Fermer" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <img className="sgm-seal" src={SEAL} alt="" draggable={false} />

            {!success ? (
              <form className="sgm-form" onSubmit={onSubmit} noValidate>
                <p className="sgm-kicker">Un mot doux</p>
                <h2 className="sgm-title" id="sgm-title">
                  Pour Nouha
                </h2>
                <img className="sgm-ornament" src={ORNAMENT} alt="" />
                <p className="sgm-sub">Anonyme · découvert le soir de son anniversaire</p>

                <label className="sgm-label" htmlFor="sgm-text">
                  Quelques mots sincères, un souvenir, une pensée douce…
                  <span>Anonyme : personne ne saura qu&apos;il vient de vous.</span>
                </label>
                <div className={`sgm-paper${error ? " has-error" : ""}`}>
                  <textarea
                    id="sgm-text"
                    ref={area}
                    name="message"
                    value={text}
                    onChange={(e) => {
                      // La feuille s'agrandit avec le texte.
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, window.innerHeight * 0.55)}px`;
                      setText(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Écrivez-lui quelques mots du cœur…"
                    disabled={sending}
                  />
                </div>
                <input className="sg-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <div className="sgm-foot">
                  <span className="sgm-count">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 8c3-1.5 6-1.5 9 0 3-1.5 6-1.5 9 0 0 6-3 9-6 9-1.6 0-2.4-1.5-3-3-.6 1.5-1.4 3-3 3-3 0-6-3-6-9z" />
                    </svg>
                    Anonyme
                  </span>
                  <button type="submit" className="sgm-submit" disabled={sending}>
                    <span>{sending ? "Envoi…" : <>Envoyer mon petit mot <span className="sg-heart">♡</span></>}</span>
                  </button>
                </div>
                {error && (
                  <p className="sgm-error" role="alert">
                    {error}
                  </p>
                )}
              </form>
            ) : (
              <div className="sgm-done" aria-live="polite">
                <div className="sgm-sparks" aria-hidden="true">
                  {Array.from({ length: 10 }, (_, i) => (
                    <i key={i} style={{ ["--a" as string]: `${i * 36}deg`, ["--d" as string]: `${(i % 3) * 0.08}s` }} />
                  ))}
                </div>
                <p className="sgm-kicker">Petit mot déposé</p>
                <h2 className="sgm-title">Merci <span className="sg-heart">♡</span></h2>
                <img className="sgm-ornament" src={ORNAMENT} alt="" />
                <p className="sgm-done-text">
                  Votre petit mot a été déposé avec amour. Il attend sagement d&apos;être découvert par Nouha. <span className="sg-heart">♡</span>
                </p>
                <div className="sgm-done-actions">
                  <button type="button" className="sgm-ghost" onClick={() => setSuccess(false)}>
                    Écrire un autre mot
                  </button>
                  <button type="button" className="sgm-link" onClick={close}>
                    Revenir à l&apos;invitation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
