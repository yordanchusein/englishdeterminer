"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { levels } from "@/data/questions";
import { MountainLayer } from "../Scenery";

export default function LevelIntro({ level, onDone }: { level: 1 | 2 | 3; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const lv = levels[level];

  const finish = () => {
    if (done.current) return;
    done.current = true;
    gsap.to(root.current, { yPercent: -100, duration: 0.7, ease: "expo.in", onComplete: onDone });
  };
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });

  useGSAP(
    () => {
      sfx.level();
      const big = SplitText.create(".li-big", { type: "chars", charsClass: "inline-block" });
      const name = SplitText.create(".li-name", { type: "chars", charsClass: "inline-block" });
      gsap
        .timeline()
        .from(".li-mtn", { yPercent: 100, duration: 1.1, ease: "expo.out", stagger: 0.1 })
        .from(big.chars, { yPercent: 140, rotationX: -120, opacity: 0, duration: 0.8, ease: "back.out(2.4)", stagger: 0.05 }, 0.15)
        .from(".li-num", { scale: 6, opacity: 0, rotation: -40, duration: 0.55, ease: "power4.in" }, 0.45)
        .fromTo(root.current, { x: 0 }, { keyframes: { x: [-18, 14, -8, 0] }, duration: 0.35 })
        .from(name.chars, { y: 60, opacity: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.03 }, "-=0.2")
        .from(".li-meta", { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.2")
        .to({}, { duration: 1.8 })
        .add(() => finishRef.current());
      gsap.to(".li-hint", { opacity: 0.4, duration: 0.6, repeat: -1, yoyo: true });
    },
    { scope: root },
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (["Enter", " ", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        finishRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div
      ref={root}
      onClick={() => finishRef.current()}
      className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center overflow-hidden text-white"
      style={{ background: lv.color }}
    >
      <div className="li-mtn absolute inset-x-0 bottom-0 opacity-30">
        <MountainLayer layer="far" palette={{ far: "#fff", snow: "#fff", mid: "#fff", near: "#fff", front: "#fff" }} className="block h-[60vh] w-full" />
      </div>
      <div className="li-mtn absolute inset-x-0 bottom-0 opacity-25">
        <MountainLayer layer="mid" palette={{ far: "#13294B", snow: "#13294B", mid: "#13294B", near: "#13294B", front: "#13294B" }} className="block h-[40vh] w-full" />
      </div>
      <div className="relative flex items-end gap-[2vw] font-display font-extrabold leading-[0.85]">
        <span className="li-big text-[clamp(4rem,12vw,12rem)] [text-shadow:6px_6px_0_#13294B]">LEVEL</span>
        <span className="li-num inline-block rounded-[2rem] border-[6px] border-ink bg-white px-[2vw] text-[clamp(4rem,12vw,12rem)] text-ink shadow-hard-lg">
          {level}
        </span>
      </div>
      <h2 className="li-name relative mt-6 font-display text-[clamp(2.2rem,5.5vw,5.6rem)] font-extrabold uppercase tracking-tight [text-shadow:4px_4px_0_#13294B]">
        {lv.name}
      </h2>
      <p className="li-meta relative mt-3 rounded-full border-[3px] border-ink bg-white px-5 py-1.5 font-display text-xl font-extrabold text-ink">
        {lv.sub} · {lv.range}
      </p>
      <p className="li-hint li-meta absolute bottom-[5vh] text-sm font-extrabold uppercase tracking-[0.3em]">Press Enter to begin</p>
    </div>
  );
}
