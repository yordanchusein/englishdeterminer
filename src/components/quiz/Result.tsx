"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { rain } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { categoryByKey } from "@/data/categories";
import { answerText, questions, type Answer } from "@/data/questions";
import { Cloud, MountainLayer } from "../Scenery";

function grade(score: number) {
  if (score >= 20) return { g: "S", t: "Legendary Climbers", c: "#E6457A" };
  if (score >= 17) return { g: "A", t: "Summit Masters", c: "#25A06B" };
  if (score >= 13) return { g: "B", t: "Strong Hikers", c: "#2B8CFF" };
  if (score >= 9) return { g: "C", t: "Trail Walkers", c: "#E8A200" };
  return { g: "D", t: "Base Camp Buddies", c: "#7C5CE6" };
}

type Props = {
  records: (Answer | null)[];
  bestStreak: number;
  onRestart: () => void;
  onClose: () => void;
};

export default function Result({ records, bestStreak, onRestart, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [review, setReview] = useState(false);
  const score = records.filter((r) => r?.correct).length;
  const gr = grade(score);

  useGSAP(
    () => {
      sfx.fanfare();
      const title = SplitText.create(".r-title", { type: "chars", charsClass: "inline-block" });
      const n = { v: 0 };
      const num = root.current!.querySelector(".r-num")!;
      gsap
        .timeline()
        .from(".r-mtn", { yPercent: 100, duration: 1.2, ease: "expo.out", stagger: 0.1 })
        .from(".r-flag", { y: -300, rotation: -40, duration: 0.9, ease: "bounce.out" }, 0.4)
        .from(title.chars, { yPercent: -200, rotation: () => gsap.utils.random(-60, 60), opacity: 0, duration: 1, ease: "bounce.out", stagger: 0.04 }, 0.3)
        .from(".r-card", { y: 80, opacity: 0, duration: 0.7, ease: "back.out(2)" }, 1)
        .to(n, {
          v: score,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            num.textContent = String(Math.round(n.v));
          },
        }, 1.2)
        .fromTo(".r-stamp", { scale: 5, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.5, ease: "power4.in" }, 2.8)
        .fromTo(".r-card", { x: 0 }, { keyframes: { x: [-16, 14, -8, 0] }, duration: 0.35 })
        .add(() => {
          if (score >= 13) rain(200);
          else rain(70);
        }, "<")
        .from(".r-stat", { y: 30, opacity: 0, duration: 0.4, stagger: 0.1 }, "<")
        .fromTo(
          ".r-btn",
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.1, clearProps: "transform,translate,rotate,scale" },
          "<0.2",
        );
      gsap.to(".r-flag-cloth", { skewY: 10, scaleX: 0.85, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "left center" });
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });
  const toggleReview = contextSafe(() => {
    sfx.whoosh();
    setReview((r) => !r);
    requestAnimationFrame(() =>
      gsap.from(".r-item", { y: 40, opacity: 0, scale: 0.8, duration: 0.45, ease: "back.out(2)", stagger: 0.03 }),
    );
  });

  return (
    <div ref={root} className="sky-gradient absolute inset-0 overflow-hidden">
      <Cloud className="absolute left-[6%] top-[8%] w-[14vw]" />
      <Cloud className="absolute right-[8%] top-[16%] w-[11vw] opacity-80" />
      <div className="r-mtn absolute inset-x-0 bottom-0">
        <MountainLayer layer="far" className="block h-[55vh] w-full" />
      </div>
      <div className="r-mtn absolute inset-x-0 -bottom-[2px]">
        <MountainLayer layer="near" className="block h-[24vh] w-full" />
      </div>
      <div className="r-mtn absolute inset-x-0 -bottom-[2px]">
        <MountainLayer layer="front" className="block h-[14vh] w-full" />
      </div>

      <div className="relative flex h-full flex-col items-center overflow-y-auto px-[4vw] pb-[4vh] pt-[5vh]">
        <div className="flex items-end gap-4">
          <svg viewBox="0 0 60 90" className="r-flag h-[clamp(3.5rem,8vw,6.5rem)]" aria-hidden>
            <line x1="8" y1="88" x2="8" y2="4" stroke="#13294B" strokeWidth="6" strokeLinecap="round" />
            <path className="r-flag-cloth" d="M8 4 L56 18 L8 32 Z" fill="#E6457A" stroke="#13294B" strokeWidth="4" strokeLinejoin="round" />
          </svg>
          <h2 className="r-title font-display text-[clamp(2.6rem,7vw,7rem)] font-extrabold leading-none tracking-tight [text-shadow:0_5px_0_rgba(255,255,255,0.7)]">
            Summit reached!
          </h2>
        </div>

        {!review ? (
          <div className="r-card relative mt-[4vh] flex w-full max-w-[880px] flex-wrap items-center justify-center gap-[3vw] rounded-[2rem] border-[4px] border-ink bg-white px-[3vw] py-[3vh] shadow-hard-lg">
            <div className="text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-ink-soft">Class score</p>
              <p className="font-display text-[clamp(4.5rem,11vw,10rem)] font-extrabold leading-none tabular-nums">
                <span className="r-num">0</span>
                <span className="text-[0.4em] text-ink-soft"> / {questions.length}</span>
              </p>
            </div>
            <div
              className="r-stamp flex flex-col items-center rounded-3xl border-[6px] px-6 py-3"
              style={{ borderColor: gr.c, color: gr.c }}
            >
              <span className="font-display text-[clamp(4rem,9vw,8rem)] font-extrabold leading-none">{gr.g}</span>
              <span className="font-display text-lg font-extrabold uppercase tracking-wider">{gr.t}</span>
            </div>
            <div className="flex w-full justify-center gap-3">
              {[
                { l: "Correct", v: score, c: "#1FAA62" },
                { l: "Wrong", v: questions.length - score, c: "#E5484D" },
                { l: "Best streak", v: `🔥 ${bestStreak}`, c: "#E8A200" },
                { l: "Accuracy", v: `${Math.round((score / questions.length) * 100)}%`, c: "#2B8CFF" },
              ].map((s) => (
                <div key={s.l} className="r-stat flex-1 rounded-2xl border-[3px] border-ink px-3 py-2 text-center">
                  <p className="font-display text-[clamp(1.4rem,2.4vw,2.4rem)] font-extrabold" style={{ color: s.c }}>
                    {s.v}
                  </p>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ink-soft">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-[3vh] grid w-full max-w-[1200px] grid-cols-2 gap-2 lg:grid-cols-4">
            {questions.map((q, i) => {
              const r = records[i];
              const cat = categoryByKey[q.category];
              return (
                <div
                  key={i}
                  className={`r-item rounded-2xl border-[3px] border-ink bg-white px-3 py-2 shadow-hard-sm ${r?.correct ? "" : "bg-bad/5"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full font-extrabold text-white ${
                        r?.correct ? "bg-good" : "bg-bad"
                      }`}
                    >
                      {r?.correct ? "✓" : "✗"}
                    </span>
                    <span className="font-display font-extrabold">Q{i + 1}</span>
                    <span className="ml-auto rounded-full px-2 text-[11px] font-extrabold text-white" style={{ background: cat.color }}>
                      {cat.title}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-base font-extrabold text-good">{answerText(q)}</p>
                  {!r?.correct && r && <p className="text-xs font-semibold text-bad line-through">{r.given}</p>}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-[3vh] flex flex-wrap justify-center gap-3">
          <button onClick={toggleReview} className="r-btn rounded-2xl border-[3px] border-ink bg-white px-6 py-3 font-display text-xl font-extrabold shadow-hard-sm hover:-translate-y-1">
            {review ? "← Show score" : "📋 Review answers"}
          </button>
          <button onClick={onRestart} className="r-btn rounded-2xl border-[3px] border-ink bg-sun px-6 py-3 font-display text-xl font-extrabold shadow-hard-sm hover:-translate-y-1">
            ↻ Climb again
          </button>
          <button onClick={onClose} className="r-btn rounded-2xl border-[3px] border-ink bg-ink px-6 py-3 font-display text-xl font-extrabold text-white shadow-hard-sm hover:-translate-y-1">
            Back to lesson
          </button>
        </div>
      </div>
    </div>
  );
}
