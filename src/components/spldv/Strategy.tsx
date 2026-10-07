"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { returnRules, strategy } from "@/data/spldv";
import { ChapterTitle, Section } from "./Chapter";
import { FairyX, GreatTree } from "./Scenery";

// stepping stones along a gentle wave (percent of the track)
const STONES = [
  { x: 6, y: 70 },
  { x: 27, y: 38 },
  { x: 48, y: 66 },
  { x: 69, y: 34 },
  { x: 90, y: 58 },
];

export default function Strategy() {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  const { contextSafe } = useGSAP({ scope: root });

  const go = contextSafe((i: number) => {
    if (i < 0 || i >= STONES.length) return;
    const s = STONES[i];
    sfx.pop();
    gsap
      .timeline()
      .to(".st-fairy", { opacity: 1, duration: 0.2 }, 0)
      .to(".st-fairy", { left: `${s.x}%`, duration: 0.7, ease: "power2.inOut" }, 0)
      .to(".st-fairy", { keyframes: { top: [`${Math.min(s.y, 30) - 34}%`, `${s.y - 20}%`] }, duration: 0.7, ease: "power1.inOut" }, 0)
      .add(() => {
        const stone = root.current!.querySelectorAll(".st-stone")[i];
        burstFrom(stone, i === STONES.length - 1 ? 90 : 24);
        if (i === STONES.length - 1) sfx.fanfare();
        else sfx.sparkle();
      });
    gsap.fromTo(".st-panel", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power3.out" });
    setStep(i);
  });

  useGSAP(
    () => {
      gsap.set(".st-fairy", { left: `${STONES[0].x}%`, top: `${STONES[0].y - 20}%`, opacity: 0 });
      gsap.fromTo(
        ".st-stone",
        { y: 60, scale: 0 },
        {
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
          onComplete: () => go(0),
        },
      );
      gsap.to(".fx-wings", { scaleX: 0.7, duration: 0.18, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: root },
  );

  const cur = step >= 0 ? strategy[step] : null;
  const last = step === strategy.length - 1;

  return (
    <Section id="strategi" className="bg-[linear-gradient(180deg,#fbf1dc_0%,#f3dcc0_100%)]">
      <ChapterTitle num="V" kicker="Menyeberangi sungai hutan" title={<>Strategi Cepat Mengerjakan SPLDV</>} />

      <div ref={root}>
        <div className="rv relative h-[clamp(240px,36vh,360px)]">
          {/* the river the stones sit in */}
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path
              d="M0 210 C150 120 250 90 330 150 C420 220 520 230 600 140 C680 60 800 80 1000 200"
              fill="none"
              stroke="#7be0d4"
              strokeOpacity="0.45"
              strokeWidth="70"
              strokeLinecap="round"
            />
          </svg>
          <GreatTree className="pointer-events-none absolute -top-10 right-0 w-[clamp(100px,11vw,180px)]" />

          {strategy.map((s, i) => (
            <button
              key={s.word}
              onClick={() => go(i)}
              className="st-stone absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${STONES[i].x}%`, top: `${STONES[i].y}%` }}
            >
              <span
                className={`flex h-[clamp(60px,6.5vw,96px)] w-[clamp(76px,8.5vw,124px)] items-center justify-center rounded-[50%] border-[3px] border-quill text-[clamp(1.6rem,2.6vw,2.6rem)] transition-all duration-300 ${
                  i <= step ? "bg-gold shadow-[0_0_30px_rgba(247,197,72,0.8),4px_4px_0_#22301e]" : "bg-[#d8cbb4] shadow-tale-sm hover:bg-[#e8dcc6]"
                }`}
              >
                {s.icon}
              </span>
              <span className="mt-2 whitespace-nowrap rounded-full border-2 border-quill bg-white px-2.5 py-0.5 font-round text-[clamp(0.65rem,0.85vw,0.9rem)] font-black">
                {i + 1}. {s.word}
              </span>
            </button>
          ))}

          <div className="st-fairy pointer-events-none absolute -translate-x-1/2 -translate-y-1/2">
            <FairyX className="w-[clamp(46px,5vw,76px)] drop-shadow-[0_0_12px_rgba(255,126,179,0.8)]" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="st-panel min-h-[150px] rounded-3xl border-[3px] border-quill bg-white p-6 shadow-tale">
            {cur ? (
              <>
                <p className="font-round text-xs font-black uppercase tracking-[0.3em] text-quill-soft">Langkah {step + 1} dari 5</p>
                <p className="mt-1 font-tale text-[clamp(1.8rem,3vw,3rem)] font-black leading-tight">
                  {cur.icon} {cur.word}
                </p>
                <p className="mt-1 font-tale text-[clamp(1.1rem,1.5vw,1.6rem)] font-semibold">{cur.hint}</p>
                {last && (
                  <div className="mt-4 rounded-2xl border-[3px] border-bad bg-bad/10 p-4">
                    <p className="font-tale text-lg font-black text-bad">⚠️ Ini penting! Jangan berhenti setelah menemukan x dan y.</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {returnRules.map((r) => (
                        <div key={r.ask} className="rounded-xl border-2 border-quill bg-white p-3">
                          <div className="text-2xl">{r.icon}</div>
                          <p className="font-round text-sm font-bold text-quill-soft">Kalau {r.ask.toLowerCase()},</p>
                          <p className="font-tale text-lg font-black">{r.then}.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="font-tale text-xl font-bold text-quill-soft">Ketuk batu pertama untuk mulai menyeberang…</p>
            )}
          </div>
          <div className="flex gap-3 lg:flex-col">
            <button
              onClick={() => go(step - 1)}
              disabled={step <= 0}
              className="rounded-2xl border-[3px] border-quill bg-white px-5 py-3 font-tale font-black shadow-tale-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              ← Mundur
            </button>
            <button
              onClick={() => go(step + 1)}
              disabled={last}
              className="rounded-2xl border-[3px] border-quill bg-violet px-5 py-3 font-tale font-black text-white shadow-tale-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              Lompat →
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
