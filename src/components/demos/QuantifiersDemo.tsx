"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const STEPS = [
  { c: "many", u: "much", note: "a large amount" },
  { c: "a few", u: "a little", note: "some — enough 🙂" },
  { c: "few", u: "little", note: "almost none 😟" },
];
const MARBLE_COLORS = ["#FF7A45", "#2B8CFF", "#E6457A", "#FFC83D", "#7C5CE6", "#0FA3B1", "#25A06B"];

export default function QuantifiersDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const marbles = q(".q-marble");
    const [water] = q(".q-water");
    const cl = q(".q-cl");
    const ul = q(".q-ul");
    const notes = q(".q-note");

    const label = (i: number) =>
      tl
        .to([...cl, ...ul, ...notes], { autoAlpha: 0, y: -10, duration: 0.2 })
        .fromTo([cl[i], ul[i]], { autoAlpha: 0, y: 20, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(3)", stagger: 0.08 })
        .fromTo(notes[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<0.1");

    tl.set(marbles, { y: -320, scale: 1, opacity: 1 }).set(water, { yPercent: 100 }).set([...cl, ...ul, ...notes], { autoAlpha: 0 });
    // step 0 — fill
    tl.to(marbles, { y: 0, duration: 0.9, ease: "bounce.out", stagger: { each: 0.07, from: "random" } }).to(
      water,
      { yPercent: 18, duration: 1.4, ease: "power2.out" },
      "<",
    );
    label(0);
    tl.to({}, { duration: 1.3 });
    // step 1 — a few / a little
    tl.to([...cl, ...ul, ...notes], { autoAlpha: 0, duration: 0.2 }).to(marbles.slice(3), { y: -80, scale: 0, duration: 0.4, ease: "back.in(2)", stagger: 0.04 }).to(
      water,
      { yPercent: 70, duration: 0.9, ease: "power2.inOut" },
      "<",
    );
    label(1);
    tl.to({}, { duration: 1.3 });
    // step 2 — few / little
    tl.to([...cl, ...ul, ...notes], { autoAlpha: 0, duration: 0.2 }).to(marbles.slice(1, 3), { y: -80, scale: 0, duration: 0.4, ease: "back.in(2)", stagger: 0.06 }).to(
      water,
      { yPercent: 93, duration: 0.9, ease: "power2.inOut" },
      "<",
    );
    label(2);
    tl.to({}, { duration: 1.5 })
      .to(marbles[0], { scale: 0, duration: 0.3 })
      .to(water, { yPercent: 100, duration: 0.4 }, "<")
      .to([...cl, ...ul, ...notes], { autoAlpha: 0, duration: 0.2 }, "<");
  });

  const jar = "relative mx-auto h-[clamp(7rem,17vh,11rem)] w-[clamp(7rem,11vw,10rem)] overflow-hidden rounded-b-[1.6rem] border-[3px] border-t-0 border-ink bg-white/70";

  return (
    <div ref={root} className="flex h-full flex-col">
      <div className="grid flex-1 grid-cols-2 items-end gap-4">
        {/* countable */}
        <div className="text-center">
          <div className="relative mb-2 h-[1.3em] font-display text-[clamp(1.3rem,2.1vw,2.2rem)] font-extrabold">
            {STEPS.map((s) => (
              <div key={s.c} className="q-cl invisible absolute inset-0">
                <span className="hl" style={{ background: color }}>
                  {s.c}
                </span>{" "}
                marbles
              </div>
            ))}
          </div>
          <div className={jar}>
            <div className="absolute inset-x-1.5 bottom-1.5 flex flex-wrap-reverse justify-center gap-[3%]">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="q-marble aspect-square w-[21%] rounded-full border-2 border-ink"
                  style={{ background: MARBLE_COLORS[i % MARBLE_COLORS.length] }}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.25em] text-ink-soft">countable</p>
        </div>
        {/* uncountable */}
        <div className="text-center">
          <div className="relative mb-2 h-[1.3em] font-display text-[clamp(1.3rem,2.1vw,2.2rem)] font-extrabold">
            {STEPS.map((s) => (
              <div key={s.u} className="q-ul invisible absolute inset-0">
                <span className="hl" style={{ background: color }}>
                  {s.u}
                </span>{" "}
                water
              </div>
            ))}
          </div>
          <div className={jar}>
            <div className="q-water absolute inset-0 bg-gradient-to-b from-[#6EC6FF] to-[#2B8CFF]">
              <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -top-[9px] left-0 h-[10px] w-[200%] animate-[wave_2s_linear_infinite]">
                <path d="M0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V20 H0Z" fill="#6EC6FF" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.25em] text-ink-soft">uncountable</p>
        </div>
      </div>
      <div className="relative mt-2 h-7 text-center font-bold text-ink-soft">
        {STEPS.map((s) => (
          <div key={s.note} className="q-note invisible absolute inset-0">
            = {s.note}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 border-t-[3px] border-dashed border-ink/20 pt-3 text-sm font-bold">
        <span className="mr-1 font-display text-base font-extrabold" style={{ color }}>
          BOTH →
        </span>
        {["some", "any", "a lot of", "no", "enough"].map((w) => (
          <span key={w} className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
