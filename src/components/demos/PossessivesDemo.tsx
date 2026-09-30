"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const PAIRS = [
  { p: "I", d: "my", owner: "🙋", obj: "🎒", noun: "backpack" },
  { p: "you", d: "your", owner: "🧑", obj: "🗺️", noun: "map" },
  { p: "he", d: "his", owner: "👦", obj: "🧭", noun: "compass" },
  { p: "she", d: "her", owner: "👧", obj: "🥾", noun: "boots" },
  { p: "it", d: "its", owner: "🐕", obj: "🦴", noun: "bone" },
  { p: "we", d: "our", owner: "👫", obj: "⛺", noun: "tent" },
  { p: "they", d: "their", owner: "👪", obj: "🏕️", noun: "camp" },
];

export default function PossessivesDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const rows = q(".p-row");
    const owners = q(".p-owner");
    const objs = q(".p-obj");
    const labels = q(".p-label");
    const [arrow] = q<SVGPathElement>(".p-arrow");

    tl.set([...owners, ...objs, ...labels], { autoAlpha: 0 }).set(arrow, { strokeDashoffset: 1 });
    PAIRS.forEach((_, i) => {
      tl.to(rows, { backgroundColor: "rgba(255,255,255,0)", color: "#3D5475", x: 0, duration: 0.2 })
        .to(rows[i], { backgroundColor: color, color: "#fff", x: 8, duration: 0.3, ease: "back.out(3)" }, "<")
        .fromTo(owners[i], { autoAlpha: 1, scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<")
        .to(arrow, { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.25")
        .fromTo(objs[i], { autoAlpha: 1, scale: 0, y: -40 }, { scale: 1, y: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.1")
        .fromTo(labels[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, "<0.1")
        .to({}, { duration: 1 })
        .to([owners[i], objs[i]], { scale: 0, duration: 0.25, ease: "power2.in" })
        .to(labels[i], { autoAlpha: 0, y: -20, duration: 0.25 }, "<")
        .to(arrow, { strokeDashoffset: -1, duration: 0.25 }, "<")
        .set(arrow, { strokeDashoffset: 1 });
    });
  });

  return (
    <div ref={root} className="grid h-full grid-cols-[auto_1fr] gap-4">
      <div className="flex flex-col justify-center gap-1">
        {PAIRS.map((p) => (
          <div key={p.d} className="p-row flex items-center gap-2 rounded-lg px-2.5 py-0.5 font-bold text-ink-soft">
            <span className="w-9 text-right">{p.p}</span>
            <span className="opacity-60">→</span>
            <span className="font-display text-lg font-extrabold">{p.d}</span>
          </div>
        ))}
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative flex w-full items-center justify-between px-[4%]">
          <div className="relative h-[clamp(4.5rem,8vw,8rem)] w-[clamp(4.5rem,8vw,8rem)]">
            {PAIRS.map((p) => (
              <div
                key={p.d}
                className="p-owner invisible absolute inset-0 flex items-center justify-center rounded-full border-[3px] border-ink bg-sky-light text-[clamp(2.4rem,4.4vw,4.4rem)] shadow-hard-sm"
              >
                {p.owner}
              </div>
            ))}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-extrabold uppercase tracking-[0.25em] text-ink-soft">
              owner
            </span>
          </div>
          <svg viewBox="0 0 200 60" className="mx-2 h-[60px] flex-1 overflow-visible" aria-hidden>
            <path
              className="p-arrow"
              d="M6 40 Q 100 -10 186 36 M170 22 L188 37 L166 44"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
            />
          </svg>
          <div className="relative h-[clamp(4.5rem,8vw,8rem)] w-[clamp(4.5rem,8vw,8rem)]">
            {PAIRS.map((p) => (
              <div
                key={p.d}
                className="p-obj invisible absolute inset-0 flex items-center justify-center rounded-3xl border-[3px] border-dashed border-ink bg-white text-[clamp(2.4rem,4.4vw,4.4rem)]"
              >
                {p.obj}
              </div>
            ))}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-extrabold uppercase tracking-[0.25em] text-ink-soft">
              thing
            </span>
          </div>
        </div>
        <div className="relative mt-12 h-[1.3em] w-full font-display text-[clamp(1.8rem,3.4vw,3.6rem)] font-extrabold">
          {PAIRS.map((p) => (
            <div key={p.d} className="p-label invisible absolute inset-0 text-center">
              <span className="hl" style={{ background: color }}>
                {p.d}
              </span>{" "}
              {p.noun}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
