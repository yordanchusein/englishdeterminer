"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis, getStops, setLenis } from "@/lib/scroll";
import { isMuted, onMuteChange, setMuted, sfx } from "@/lib/sound";
import Preloader from "./Preloader";
import Hero from "./Hero";
import WhatIs from "./WhatIs";
import Categories from "./Categories";
import Recap from "./Recap";
import SummitStart from "./SummitStart";
import Quiz from "./quiz/Quiz";

/**
 * Everything after the hero, memoised so the preloader → hero hand-off
 * doesn't re-render the whole lesson in the middle of an animation.
 */
const Lesson = memo(function Lesson({ onStart }: { onStart: () => void }) {
  return (
    <>
      <WhatIs />
      <Categories />
      <Recap />
      <SummitStart onStart={onStart} />
    </>
  );
});

export default function Experience() {
  const [revealed, setRevealed] = useState(false); // hero intro may start
  const [loaded, setLoaded] = useState(false); // preloader gone, page usable
  const [quizOpen, setQuizOpen] = useState(false);
  const [muted, setMutedState] = useState(false);
  const quizOpenRef = useRef(false);

  useEffect(() => {
    quizOpenRef.current = quizOpen;
  }, [quizOpen]);

  /* smooth scroll wired into GSAP's ticker */
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.09 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    // while the preloader plays, a slow frame pauses the animation instead of
    // making it skip ahead; Lenis-synced scrolling takes over once loaded
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
    if (quizOpen) l?.stop();
    else l?.start();
  }, [loaded, quizOpen]);

  useEffect(() => onMuteChange(setMutedState), []);

  /* top progress "trail" */
  useGSAP(() => {
    gsap.to(".hud-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  const reveal = useCallback(() => setRevealed(true), []);
  const finish = useCallback(() => setLoaded(true), []);
  const closeQuiz = useCallback(() => setQuizOpen(false), []);

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

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  /* presenter keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "f") return toggleFullscreen();
      if (k === "m") return setMuted(!isMuted());
      if (quizOpenRef.current || !loaded) return;
      if (["arrowright", "arrowdown", "pagedown", " "].includes(k)) {
        e.preventDefault();
        go(1);
      } else if (["arrowleft", "arrowup", "pageup"].includes(k)) {
        e.preventDefault();
        go(-1);
      } else if (k === "enter") {
        const r = document.getElementById("summit")?.getBoundingClientRect();
        if (r && Math.abs(r.top) < window.innerHeight / 2) openQuiz();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, loaded, openQuiz]);

  return (
    <>
      {!loaded && <Preloader onReveal={reveal} onFinish={finish} />}

      {/* HUD */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="hud-progress h-1.5 origin-left scale-x-0 bg-[linear-gradient(90deg,#25A06B,#2B8CFF,#E6457A)]" />
        <div className="flex items-center justify-between px-[2vw] pt-3">
          <button
            onClick={() => getLenis()?.scrollTo(0, { duration: 1.6 })}
            className="pointer-events-auto flex items-center gap-2 rounded-full border-[3px] border-ink bg-white/90 px-3 py-1 font-display text-sm font-extrabold shadow-hard-sm"
          >
            ⛰️ Determiners
          </button>
          <div className="pointer-events-auto flex gap-2">
            <button
              onClick={() => setMuted(!muted)}
              title="Sound (M)"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink bg-white/90 shadow-hard-sm"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={toggleFullscreen}
              title="Fullscreen (F)"
              className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink bg-white/90 font-extrabold shadow-hard-sm"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>

      <main>
        <Hero ready={revealed} />
        <Lesson onStart={openQuiz} />
      </main>

      <Quiz open={quizOpen} onClose={closeQuiz} />
    </>
  );
}
