"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const DIGITS = [...Array(10).keys(), ...Array(10).keys()];
const PODIUM = [
  { place: "2nd", word: "second", h: "58%", medal: "🥈", order: 1 },
  { place: "1st", word: "first", h: "82%", medal: "🥇", order: 2 },
  { place: "3rd", word: "third", h: "40%", medal: "🥉", order: 0 },
];

export default function NumbersDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const [reel] = q(".n-reel");
    const hikers = q(".n-hiker");
    const [word] = q(".n-word");
    const blocks = q(".n-block");
    const medals = q(".n-medal");
    const byOrder = [2, 0, 1].map((i) => blocks[i]);
    const medalsByOrder = [2, 0, 1].map((i) => medals[i]);

    tl.set(reel, { yPercent: 0 })
      .set(hikers, { scale: 0 })
      .set(word, { autoAlpha: 0 })
      .set(blocks, { scaleY: 0 })
      .set(medals, { y: -200, autoAlpha: 0 })
      .to(reel, { yPercent: -65, duration: 1.8, ease: "power4.out" })
      .fromTo(word, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "back.out(3)" }, "-=0.4")
      .to(hikers, { scale: 1, duration: 0.5, ease: "back.out(4)", stagger: 0.12 }, "<")
      .to({}, { duration: 0.6 })
      .to(byOrder, { scaleY: 1, duration: 0.6, ease: "back.out(1.6)", stagger: 0.18 })
      .to(medalsByOrder, { y: 0, autoAlpha: 1, duration: 0.8, ease: "bounce.out", stagger: 0.12 }, "-=0.2")
      .to({}, { duration: 1.8 })
      .to([...blocks, ...medals, ...hikers, word], { autoAlpha: 0, duration: 0.3 })
      .set([...blocks, ...medals, ...hikers, word], { autoAlpha: 1 });
  });

  return (
    <div ref={root} className="flex h-full flex-col">
      <div className="flex items-center gap-4">
        <div className="h-[1.1em] overflow-hidden rounded-2xl border-[3px] border-ink bg-white px-3 font-display text-[clamp(3rem,5vw,5.2rem)] font-extrabold leading-[1.1] shadow-hard-sm">
          <div className="n-reel flex flex-col">
            {DIGITS.map((d, i) => (
              <span key={i} style={{ color: d === 3 ? color : undefined }}>
                {d}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="n-word font-display text-[clamp(1.5rem,2.6vw,2.8rem)] font-extrabold">
            <span className="hl" style={{ background: color }}>
              three
            </span>{" "}
            hikers
          </div>
          <div className="mt-1 flex gap-1 text-[clamp(1.6rem,2.6vw,2.6rem)]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="n-hiker inline-block">
                🚶
              </span>
            ))}
          </div>
        </div>
        <span className="ml-auto self-start rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-white">
          cardinal
        </span>
      </div>

      <div className="relative mt-3 flex min-h-0 flex-1 justify-center gap-2 pt-6">
        <span className="absolute right-0 top-0 rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-white">
          ordinal
        </span>
        {PODIUM.map((p) => (
          <div key={p.place} className="flex w-[26%] flex-col items-center justify-end">
            <span className="n-medal text-[clamp(1.8rem,3vw,3rem)] leading-none">{p.medal}</span>
            <div
              className="n-block mt-1 flex w-full origin-bottom flex-col items-center justify-start rounded-t-2xl border-[3px] border-ink pt-2 text-white"
              style={{ height: p.h, background: color, opacity: 0.55 + p.order * 0.2 }}
            >
              <span className="font-display text-[clamp(1.2rem,2vw,2rem)] font-extrabold leading-none">{p.place}</span>
              <span className="text-sm font-bold">the {p.word}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
