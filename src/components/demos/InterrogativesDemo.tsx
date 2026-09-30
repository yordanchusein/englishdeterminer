"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const ITEMS = [
  { w: "WHICH", q: ["Which", " trail is safer — north or south?"], hint: "limited choice", opts: ["north", "south"] },
  { w: "WHAT", q: ["What", " time do we start?"], hint: "open choice", opts: ["5 am?", "6 am?", "7 am?", "…"] },
  { w: "WHOSE", q: ["Whose", " backpack is this?"], hint: "owner", opts: ["🎒 → Dimas's"] },
];

export default function InterrogativesDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const [mark] = q(".i-mark");
    const [word] = q(".i-word");
    const sentences = q(".i-sent");

    tl.set(sentences, { autoAlpha: 0 }).set(word, { text: "?" });
    ITEMS.forEach((it, i) => {
      const opts = sentences[i].querySelectorAll(".i-opt");
      tl.to(mark, { rotation: "+=360", scale: 1.15, duration: 0.7, ease: "back.inOut(2)" })
        .to(word, { duration: 0.7, scrambleText: { text: it.w, chars: "?!#&%WHICHATOSE", speed: 0.5 } }, "<")
        .to(mark, { scale: 1, duration: 0.3 })
        .fromTo(sentences[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "back.out(2)" }, "<")
        .fromTo(opts, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(4)", stagger: 0.1 }, "-=0.1")
        .to({}, { duration: 1.5 })
        .to(sentences[i], { autoAlpha: 0, y: -20, duration: 0.25 })
        .to(word, { duration: 0.35, scrambleText: { text: "?", chars: "?!#", speed: 1 } }, "<");
    });
  });

  return (
    <div ref={root} className="flex h-full flex-col items-center justify-center gap-5">
      <div
        className="i-mark flex aspect-square w-[clamp(8rem,13vw,12rem)] items-center justify-center rounded-full border-[4px] border-ink text-white shadow-hard"
        style={{ background: color }}
      >
        <span className="i-word font-display text-[clamp(1.6rem,2.8vw,2.8rem)] font-extrabold">?</span>
      </div>
      <div className="relative h-[clamp(5.5rem,10vh,7rem)] w-full">
        {ITEMS.map((it) => (
          <div key={it.w} className="i-sent invisible absolute inset-0 flex flex-col items-center gap-2 text-center">
            <p className="font-display text-[clamp(1.2rem,2vw,2.1rem)] font-extrabold leading-tight">
              <span className="hl" style={{ background: color }}>
                {it.q[0]}
              </span>
              {it.q[1]}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-widest text-white">
                {it.hint}
              </span>
              {it.opts.map((o) => (
                <span key={o} className="i-opt rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-sm font-bold">
                  {o}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
