"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { OPENED_EVENT } from "./HeroTitle";

interface EnvelopeProps {
  envelope: string;
  video: string;
  music: string;
}

/**
 * Full-screen sealed envelope (source block T123 "weiOverlay"):
 * tap → envelope fades out (1.4s), opening video plays with the music,
 * video fades out 0.8s before its end, then the floating play/pause button appears.
 */
export function Envelope({ envelope, video, music }: EnvelopeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const done = useRef(false);
  const unlocked = useRef(false);
  const [overlay, setOverlay] = useState<"shown" | "fading" | "gone">("shown");
  const [videoState, setVideoState] = useState<"idle" | "in" | "out" | "gone">("idle");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [playing, setPlaying] = useState(true);

  /** true seulement quand l'invitée a mis la musique en pause avec le bouton. */
  const userPaused = useRef(false);

  useEffect(() => {
    videoRef.current?.load();
  }, []);

  // La musique tourne en boucle sans jamais s'arrêter (sauf si l'invitée appuie sur pause) :
  // relance après une coupure, un retour sur l'onglet, un appel, une mise en veille…
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    const resume = () => {
      if (!done.current || userPaused.current || document.hidden) return;
      if (audio.paused) audio.play().catch(() => {});
    };
    const onEnded = () => {
      audio.currentTime = 0;
      resume();
    };
    const onPause = () => setTimeout(resume, 400);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("stalled", resume);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("pageshow", resume);
    // au cas où le navigateur l'aurait suspendue sans prévenir
    const watchdog = setInterval(resume, 3000);
    // certains téléphones exigent un geste : on relance au prochain toucher
    window.addEventListener("pointerdown", resume, { passive: true });
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("stalled", resume);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("focus", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("pointerdown", resume);
      clearInterval(watchdog);
    };
  }, []);

  // Samsung/Android: prime the audio on touchstart, start the sequence on click.
  const unlockAudio = () => {
    const audio = audioRef.current;
    if (unlocked.current || !audio) return;
    unlocked.current = true;
    const p = audio.play();
    p?.then(() => {
      if (!done.current) {
        audio.pause();
        audio.currentTime = 0;
      }
    }).catch(() => {});
  };

  /** Vidéos en boucle de la page (cygnes, vidéo de Nouha) : relancées depuis le début. */
  const playLoops = (restart: boolean) => {
    document.querySelectorAll<HTMLVideoElement>("#allrecords video[loop]").forEach((v) => {
      v.muted = true;
      v.loop = true;
      if (restart) v.currentTime = 0;
      v.play().catch(() => {});
    });
  };

  const start = () => {
    if (done.current) return;
    done.current = true;
    playLoops(false);
    setOverlay("fading");
    setTimeout(() => setOverlay("gone"), 1400);
    setVideoState("in");
    // If the browser cannot play the opening video, reveal the invitation instead of a blank screen.
    videoRef.current?.play().catch(() => endSequence());
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.play().catch(() => {});
    }
  };

  const ended = useRef(false);
  const endSequence = () => {
    if (ended.current) return;
    ended.current = true;
    window.dispatchEvent(new Event(OPENED_EVENT));
    // Les cygnes repartent du début dès que l'ouverture se termine, en boucle sans fin.
    playLoops(true);
    setVideoState("out");
    setTimeout(() => setVideoState("gone"), 1400);
    setButtonVisible(true);
  };

  // Fade the video out 0.8s before its end.
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration || !done.current) return;
    if (v.currentTime >= v.duration - 0.8) endSequence();
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPaused.current = false;
      audio.play().catch(() => {});
      setPlaying(true);
    } else {
      userPaused.current = true;
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="t123">
      <audio id="weiAudio" ref={audioRef} loop preload="auto">
        <source src={music} type="audio/mp3" />
      </audio>

      {overlay !== "gone" && (
        <div
          id="weiOverlay"
          onTouchStart={unlockAudio}
          onClick={start}
          style={overlay === "fading" ? { opacity: 0, pointerEvents: "none" } : undefined}
        >
          <img id="weiImg" src={envelope} alt="Ouvrir ton invitation" draggable={false} />
          <div id="weiTapWrap">
            <div className="wei-chevron" />
            <div id="weiTapLabel">Touche pour ouvrir</div>
          </div>
        </div>
      )}

      <div
        id="weiVideoWrap"
        className={videoState === "in" ? "wei-video-in" : videoState === "out" ? "wei-video-out" : undefined}
        style={videoState === "gone" ? { display: "none" } : undefined}
      >
        <video id="weiVideo" ref={videoRef} src={video} muted playsInline preload="auto" onTimeUpdate={onTimeUpdate} onError={() => done.current && endSequence()} />
      </div>

      <div
        id="weiAudioBtn"
        role="button"
        aria-label={playing ? "Couper la musique" : "Lancer la musique"}
        onClick={toggle}
        style={buttonVisible ? { visibility: "visible", opacity: 1 } : undefined}
      >
        <svg id="weiIconPause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: playing ? "block" : "none" }}>
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
        <svg id="weiIconPlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: playing ? "none" : "block" }}>
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
    </div>
  );
}
