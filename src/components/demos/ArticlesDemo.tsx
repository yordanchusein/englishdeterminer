"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const WORDS = [
  { art: "an", first: "u", rest: "mbrella", sound: "/ʌ/", kind: "vowel sound" },
  { art: "a", first: "u", rest: "niversity", sound: "/j/", kind: "consonant sound" },
  { art: "an", first: "h", rest: "our", sound: "/aʊ/", kind: "silent h → vowel sound" },
  { art: "a", first: "Eu", rest: "ropean", sound: "/j/", kind: "consonant sound" },
  { art: "an", first: "h", rest: "onest guide", sound: "/ɒ/", kind: "silent h → vowel sound" },
  { art: "a", first: "m", rest: "ountain", sound: "/m/", kind: "consonant sound" },
];

const THE = ["the sun · unique", "the Nile · river", "the best · superlative"];

export default function ArticlesDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const slides = q(".a-slide");
    tl.set(slides, { autoAlpha: 0 });
    slides.forEach((s) => {
      const word = s.querySelector(".a-word");
      const first = s.querySelector(".a-first");
      const sound = s.querySelector(".a-sound");
      const art = s.querySelector(".a-art");
      tl.set(s, { autoAlpha: 1, y: 0 })
        .fromTo(word, { x: 220, skewX: -25, opacity: 0 }, { x: 0, skewX: 0, opacity: 1, duration: 0.55, ease: "expo.out" })
        .fromTo(first, { scale: 1 }, { scale: 1.45, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" })
        .fromTo(sound, { y: 24, scale: 0.6, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" }, "<")
        .fromTo(art, { y: -220, rotation: -35, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.8, ease: "bounce.out" })
        .to({}, { duration: 1.1 })
        .to(s, { y: -50, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
    });
  });

  return (
    <div ref={root} className="relative flex h-full flex-col">
      <div className="relative flex-1">
        {WORDS.map((w) => (
          <div key={w.rest} className="a-slide invisible absolute inset-0 flex flex-col items-center justify-center gap-5">
            <div className="flex items-center gap-4 font-display text-[clamp(2.2rem,4.2vw,4.6rem)] font-extrabold">
              <span
                className="a-art inline-block rounded-2xl border-[3px] border-ink px-4 py-1 text-white shadow-hard-sm"
                style={{ background: color }}
              >
                {w.art}
              </span>
              <span className="a-word inline-block">
                <span className="a-first inline-block underline decoration-[0.12em] underline-offset-[0.12em]" style={{ color }}>
                  {w.first}
                </span>
                {w.rest}
              </span>
            </div>
            <div className="a-sound rounded-full border-[3px] border-ink bg-sun/60 px-4 py-1 font-bold">
              <span className="font-display text-lg">{w.sound}</span> <span className="text-ink-soft">· {w.kind}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 border-t-[3px] border-dashed border-ink/20 pt-3">
        <span className="font-display text-lg font-extrabold" style={{ color }}>
          THE →
        </span>
        {THE.map((t) => (
          <span key={t} className="rounded-full border-2 border-ink bg-white px-3 py-0.5 text-sm font-bold">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
