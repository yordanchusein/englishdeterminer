"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis, getStops, setLenis } from "@/lib/scroll";
import { isMuted, onMuteChange, setMuted, sfx } from "@/lib/sound";
import BookLoader from "./BookLoader";
import Hero from "./Hero";
import Intro from "./Intro";
import Playground from "./Playground";
import Translator from "./Translator";
import Methods from "./Methods";
import Quests from "./Quests";
import Strategy from "./Strategy";
import ForestGate from "./ForestGate";
import Quiz from "./quiz/Quiz";

const CHAPTERS = [
  { id: "top", label: "Awal" },
  { id: "mengenal", label: "I" },
  { id: "penerjemah", label: "II" },
  { id: "mantra", label: "III" },
  { id: "misi", label: "IV" },
  { id: "strategi", label: "V" },
  { id: "gerbang", label: "🌳" },
];

const Lesson = memo(function Lesson({ onStart, onModal }: { onStart: () => void; onModal: (o: boolean) => void }) {
  return (
    <>
      <Intro />
      <Playground />
      <Translator />
      <Methods />
      <Quests onModal={onModal} />
      <Strategy />
      <ForestGate onStart={onStart} />
    </>
  );
});

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

export default function SpldvExperience() {
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [muted, setMutedState] = useState(false);
  const blocked = useRef(false);

  useEffect(() => {
    blocked.current = quizOpen || modalOpen;
  }, [quizOpen, modalOpen]);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.09 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(120, 33);
    lenis.stop();
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (!loaded) return;
    gsap.ticker.lagSmoothing(0);
    if (quizOpen || modalOpen) l?.stop();
    else l?.start();
  }, [loaded, quizOpen, modalOpen]);

  useEffect(() => onMuteChange(setMutedState), []);

  useGSAP(() => {
    gsap.to(".hud-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    CHAPTERS.forEach((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top 50%",
        end: "bottom 50%",
        toggleClass: { targets: `.hud-dot-${i}`, className: "is-on" },
      }),
    );
  });

  const reveal = useCallback(() => setRevealed(true), []);
  const finish = useCallback(() => setLoaded(true), []);
  const closeQuiz = useCallback(() => setQuizOpen(false), []);
  const onModal = useCallback((o: boolean) => setModalOpen(o), []);
  const openQuiz = useCallback(() => {
    sfx.click();
    setQuizOpen(true);
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    const lenis = getLenis();
    if (!lenis) return;
    const stops = getStops();
    const y = lenis.targetScroll;
    const target = dir > 0 ? stops.find((s) => s > y + 5) : [...stops].reverse().find((s) => s < y - 5);
    if (target === undefined) return;
    sfx.whoosh();
    lenis.scrollTo(target, { duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
  }, []);

  const jump = (id: string) => {
    sfx.whoosh();
    getLenis()?.scrollTo(`#${id}`, { duration: 1.6 });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === "f") return toggleFullscreen();
      if (k === "m") return setMuted(!isMuted());
      if (blocked.current || !loaded) return;
      if (["arrowright", "arrowdown", "pagedown", " "].includes(k)) {
        e.preventDefault();
        go(1);
      } else if (["arrowleft", "arrowup", "pageup"].includes(k)) {
        e.preventDefault();
        go(-1);
      } else if (k === "enter") {
        const r = document.getElementById("gerbang")?.getBoundingClientRect();
        if (r && Math.abs(r.top) < window.innerHeight / 2) openQuiz();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, loaded, openQuiz]);

  return (
    <div className="font-round text-quill">
      {!loaded && <BookLoader onReveal={reveal} onFinish={finish} />}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="hud-progress h-1.5 origin-left scale-x-0 bg-[linear-gradient(90deg,#e8478f,#f7c548,#129e94)]" />
        <div className="flex items-center justify-between px-[2vw] pt-3">
          <button
            onClick={() => jump("top")}
            className="pointer-events-auto flex items-center gap-2 rounded-full border-[3px] border-quill bg-parch/95 px-3 py-1 font-tale text-sm font-black shadow-tale-sm"
          >
            🌳 SPLDV
          </button>
          <nav className="pointer-events-auto hidden items-center gap-1.5 rounded-full border-[3px] border-quill bg-parch/90 px-2 py-1 shadow-tale-sm md:flex">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => jump(c.id)}
                className={`hud-dot-${i} min-w-8 rounded-full px-2 py-0.5 font-tale text-xs font-black transition-colors hover:bg-gold/60 [&.is-on]:bg-violet [&.is-on]:text-white`}
              >
                {c.label}
              </button>
            ))}
          </nav>
          <div className="pointer-events-auto flex gap-2">
            <Link href="/spldv/papan-tulis" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center rounded-full border-[3px] border-quill bg-parch/95 px-3 text-sm font-bold shadow-tale-sm" aria-label="Papan tulis (buka tab baru)">
              Papan tulis
            </Link>
            <button
              onClick={() => setMuted(!muted)}
              title="Suara (M)"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-quill bg-parch/95 shadow-tale-sm"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={toggleFullscreen}
              title="Layar penuh (F)"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-quill bg-parch/95 font-black shadow-tale-sm"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>

      <main>
        <Hero ready={revealed} />
        <Lesson onStart={openQuiz} onModal={onModal} />
      </main>

      <Quiz open={quizOpen} onClose={closeQuiz} />
    </div>
  );
}
