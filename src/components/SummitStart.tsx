"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { levels } from "@/data/questions";
import { Cloud, MountainLayer, Sun } from "./Scenery";

export default function SummitStart({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".s-title", { type: "chars", charsClass: "inline-block" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 55%" } });
      tl.from(".s-mtn", { yPercent: 50, duration: 1.4, ease: "expo.out", stagger: 0.1 })
        .from(".s-eyebrow", { y: 30, opacity: 0, duration: 0.5, ease: "back.out(2)" }, 0.2)
        .from(split.chars, { yPercent: 130, opacity: 0, rotation: 20, duration: 0.8, ease: "back.out(2.5)", stagger: 0.03 }, 0.3)
        .from(".s-sub", { y: 20, opacity: 0, duration: 0.6 }, 0.8)
        .from(".s-level", { scale: 0, rotation: -20, duration: 0.6, ease: "back.out(3)", stagger: 0.12 }, 0.9)
        .from(".s-btn", { scale: 0, duration: 0.8, ease: "elastic.out(1, 0.45)" }, 1.2)
        .from(".s-flag", { scaleY: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" }, 1.1);

      // title letters do a looping "wave"
      gsap.to(split.chars, {
        y: -12,
        duration: 0.45,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.06, repeat: -1, yoyo: true },
        delay: 2.2,
      });
      gsap.to(".s-btn-pulse", { scale: 1.35, opacity: 0, duration: 1.3, repeat: -1, ease: "power2.out" });
      gsap.to(".s-flag-cloth", { skewY: 12, scaleX: 0.85, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "left center" });
      gsap.to(".sun-rays", { rotation: 360, duration: 40, repeat: -1, ease: "none" });
      gsap.utils.toArray<HTMLElement>(".s-cloud").forEach((c, i) =>
        gsap.to(c, { x: `+=${100 + i * 60}`, duration: 14 + i * 4, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="summit" data-stop className="sky-gradient relative h-screen overflow-hidden">
      <Sun className="absolute right-[6%] top-[34%] w-[clamp(90px,9vw,150px)]" />
      <Cloud className="s-cloud absolute left-[62%] top-[10%] w-[14vw]" />
      <Cloud className="s-cloud absolute left-[20%] top-[26%] w-[10vw] opacity-80" />

      <div className="s-mtn absolute inset-x-0 bottom-0">
        <MountainLayer layer="far" className="block h-[62vh] w-full" />
      </div>
      {/* the summit */}
      <div className="s-mtn absolute bottom-0 left-1/2 w-[70vw] -translate-x-1/2">
        <svg viewBox="0 0 800 420" className="block h-[58vh] w-full" preserveAspectRatio="xMidYMax meet" aria-hidden>
          <path d="M0 420 L400 30 L800 420 Z" fill="#5E8FC7" />
          <path d="M400 30 L800 420 L520 420 Z" fill="#4C7BB3" />
          <path d="M330 98 L400 30 L472 100 L448 92 L428 116 L404 94 L380 118 L358 96 Z" fill="#fff" />
          <g className="s-flag" style={{ transformOrigin: "400px 34px" }}>
            <line x1="400" y1="34" x2="400" y2="-40" stroke="#13294B" strokeWidth="6" strokeLinecap="round" />
            <path className="s-flag-cloth" d="M400 -40 L462 -26 L400 -10 Z" fill="#E6457A" stroke="#13294B" strokeWidth="4" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
      <div className="s-mtn absolute inset-x-0 -bottom-[2px]">
        <MountainLayer layer="near" className="block h-[26vh] w-full" />
      </div>
      <div className="s-mtn absolute inset-x-0 -bottom-[2px]">
        <MountainLayer layer="front" className="block h-[16vh] w-full" />
      </div>

      <div className="relative flex h-full flex-col items-center pt-[12vh] text-center">
        <span className="s-eyebrow rounded-full border-[3px] border-ink bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.3em] shadow-hard-sm">
          Class challenge · one screen, whole class
        </span>
        <h2 className="s-title mt-4 font-display text-[clamp(2.8rem,7vw,7.4rem)] font-extrabold leading-[0.9] tracking-tight">
          The Summit Challenge
        </h2>
        <p className="s-sub mt-3 font-display text-[clamp(1.1rem,1.8vw,1.9rem)] font-bold text-ink-soft">
          20 questions · 3 levels · answer together, climb together
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {Object.entries(levels).map(([n, l]) => (
            <span
              key={n}
              className="s-level rounded-2xl border-[3px] border-ink px-4 py-1.5 font-display text-base font-extrabold text-white shadow-hard-sm"
              style={{ background: l.color }}
            >
              Lv {n} · {l.name}
            </span>
          ))}
        </div>
        <button onClick={onStart} className="s-btn group relative mt-[5vh]">
          <span className="s-btn-pulse absolute inset-0 rounded-3xl bg-sun" />
          <span className="relative block rounded-3xl border-[4px] border-ink bg-sun px-10 py-4 font-display text-[clamp(1.4rem,2.4vw,2.4rem)] font-extrabold shadow-hard transition-transform group-hover:-translate-y-1 group-hover:rotate-[-2deg] group-active:translate-y-1">
            Start the climb →
          </span>
        </button>
        <span className="mt-3 text-sm font-bold text-ink-soft">
          or press <kbd className="rounded-md border-2 border-ink bg-white px-1.5">Enter</kbd>
        </span>
      </div>
    </section>
  );
}
