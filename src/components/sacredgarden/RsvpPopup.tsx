"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

const POPUP_HOOK = "#popup:myform";
const MAX = 1500;

const labelStyle = { fontWeight: 400, fontFamily: "'newtemplate'" } as const;

/**
 * Popup Tilda T702 (même apparence que l'original), transformé en
 * « message secret anonyme pour Nouha ». Ouvert par le cachet (#popup:myform).
 * Les messages sont envoyés à /api/messages et gardés dans le coffre.
 */
export function RsvpPopup({ recordId }: { recordId: string }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const open = useCallback(() => {
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    document.body.classList.add("t-body_popupshowed");
  }, []);

  const close = useCallback(() => {
    setShown(false);
    document.body.classList.remove("t-body_popupshowed");
    setTimeout(() => setMounted(false), 300);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.(`a[href="${POPUP_HOOK}"]`);
      if (a) {
        e.preventDefault();
        setSuccess(false);
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
      setError("Écris quelques mots pour Nouha.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, website }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Une erreur est survenue.");
      setText("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div id={recordId} className="r t-rec" data-record-type="702" data-section="rsvpPopup">
      <div className="t702">
        <div
          className={`t-popup${shown ? " t-popup_show" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Un message secret pour Nouha"
          tabIndex={-1}
          data-tooltip-hook={POPUP_HOOK}
          style={{ display: mounted ? "block" : "none" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="t-popup__close t-popup__block-close">
            <button type="button" className="t-popup__close-wrapper t-popup__block-close-button" aria-label="Fermer" onClick={close}>
              <svg role="presentation" className="t-popup__close-icon" width="23px" height="23px" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                <g stroke="none" strokeWidth="1" fill="#fff" fillRule="evenodd">
                  <rect transform="translate(11.313708, 11.313708) rotate(-45.000000) translate(-11.313708, -11.313708) " x="10.3137085" y="-3.6862915" width="2" height="30" />
                  <rect transform="translate(11.313708, 11.313708) rotate(-315.000000) translate(-11.313708, -11.313708) " x="10.3137085" y="-3.6862915" width="2" height="30" />
                </g>
              </svg>
            </button>
          </div>
          <div className="t-popup__container t-popup__container-animated t-width t-width_6" data-popup-type="702" style={{ backgroundColor: "#fffaf8" }}>
            <div className="t702__wrapper">
              <div className="t702__text-wrapper t-align_center">
                <div className="t702__title t-title t-title_xxs" id={`popuptitle_${recordId.slice(3)}`}>
                  Un message secret pour Nouha
                </div>
                <div className="t702__descr t-descr t-descr_xs">Anonyme · scellé jusqu&apos;au 11 novembre</div>
              </div>
              <form className="t-form js-form-proccess t-form_inputs-total_1" noValidate onSubmit={onSubmit}>
                <div className="js-successbox t-form__successbox t-text t-text_md" aria-live="polite" style={{ display: success ? "block" : "none" }}>
                  Merci ! Ton message est scellé dans le coffre. Vous le lirez ensemble le soir de son anniversaire.
                </div>
                <div className="t-form__inputsbox t-form__inputsbox_vertical-form t-form__inputsbox_inrow" style={success ? { display: "none" } : undefined}>
                  <div className={`t-input-group t-input-group_ta${error ? " js-error-control-box" : ""}`} data-field-type="ta">
                    <label className="t-input-title t-descr t-descr_md" htmlFor="input_secret" style={labelStyle}>
                      Ton message
                    </label>
                    <div className="t-input-subtitle t-descr t-descr_xxs t-opacity_70">
                      Un souvenir, un compliment, un vœu… Personne ne saura qu&apos;il vient de toi.
                    </div>
                    <div className="t-input-block" style={{ borderRadius: 5 }}>
                      <textarea
                        id="input_secret"
                        name="message"
                        className="t-input js-tilda-rule sg-secret"
                        maxLength={MAX}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Chère Nouha…"
                        style={{
                          color: "#4f4f4f",
                          border: "1px solid #c9c9c9",
                          borderRadius: 5,
                          fontFamily: "'newtemplate'",
                          fontWeight: 400,
                          height: 190,
                        }}
                      />
                    </div>
                    <div className="t-input-error" aria-live="polite" style={error ? { display: "block" } : undefined}>
                      {error}
                    </div>
                    <div className="sg-count">
                      {text.length}/{MAX}
                    </div>
                  </div>
                  <input className="sg-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <div className="t-form__submit">
                    <button type="submit" className="t-submit t-btnflex t-btnflex_type_submit t-btnflex_md" disabled={sending}>
                      <span className="t-btnflex__text">{sending ? "Envoi…" : "Sceller mon message"}</span>
                      <span className="t-btn_wrap-effects">
                        <span className="t-btn_inner-effects">
                          <span className="t-btn_effects" />
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
