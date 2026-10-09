"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import type { Step } from "@/data/spldv";
import Eq from "./Eq";

type Props = {
  steps: Step[];
  vars?: string[];
  final?: string;
  color?: string;
  /** larger type for the projector-sized method board */
  size?: "md" | "lg";
};

/** Reveals a worked solution one step at a time, with chalk-like animation. */
export default function StepPlayer({ steps, vars, final, color = "#6a4bc4", size = "md" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(1);
  const done = shown >= steps.length;
  const big = size === "lg";

  useGSAP(
    () => {
      const step = root.current!.querySelector(`[data-step="${shown - 1}"]`);
      if (!step) return;
      const tl = gsap.timeline();
      tl.fromTo(
        step.querySelectorAll(".sp-in"),
        { y: 22, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out", stagger: 0.16 },
      );
      const strikes = step.querySelectorAll(".eq-strike");
      if (strikes.length)
        tl.fromTo(strikes, { rotation: -14, scaleX: 0 }, { rotation: -14, scaleX: 1, duration: 0.35, ease: "power2.out", stagger: 0.12 }, "-=0.1").to(
          step.querySelectorAll(".eq-cancel"),
          { opacity: 0.35, duration: 0.3 },
          "<0.15",
        );
      tl.fromTo(
        step.querySelectorAll(".sp-res"),
        { scale: 0.4, opacity: 0, rotation: -6 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2.6)", stagger: 0.18 },
      );
      tl.fromTo(
        step.querySelectorAll(".eq-hl"),
        { backgroundColor: "rgba(247,197,72,0)" },
        { backgroundColor: "rgba(247,197,72,0.55)", duration: 0.4, stagger: 0.1 },
        0.2,
      );
      if (shown > 1) {
        const list = root.current!.querySelector("ol");
        if (list) list.scrollTo({ top: (step as HTMLElement).offsetTop, behavior: "smooth" });
      }
    },
    { scope: root, dependencies: [shown] },
  );

  useGSAP(
    () => {
      if (!done || !final) return;
      gsap.fromTo(
        ".sp-final",
        { scale: 0, rotation: -12 },
        { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2.4)", delay: 0.5 },
      );
    },
    { scope: root, dependencies: [done] },
  );

  const next = () => {
    if (done) return;
    sfx.sparkle();
    setShown((s) => s + 1);
    if (shown + 1 >= steps.length && final) {
      setTimeout(() => {
        sfx.correct();
        burstFrom(root.current?.querySelector(".sp-final") ?? null, 60);
      }, 900);
    }
  };

  const reset = () => {
    sfx.page();
    setShown(1);
  };

  const line = big ? "text-[clamp(1.25rem,2.1vw,2.2rem)]" : "text-[clamp(1.05rem,1.45vw,1.45rem)]";

  return (
    <div ref={root} className="flex h-full min-h-0 flex-col">
      <ol data-lenis-prevent className="relative min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-2 pb-4">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} data-step={i} className="relative pl-11">
            <span
              className="sp-in absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-quill font-tale text-sm font-black text-white"
              style={{ background: color }}
            >
              {i + 1}
            </span>
            {s.note && <p className="sp-in mb-1 text-[clamp(0.85rem,1vw,1.05rem)] font-extrabold text-quill-soft">{s.note}</p>}

            {s.kind === "lines" && (
              <div className={`space-y-0.5 ${line}`}>
                {s.lines.map((l, j) => (
                  <div key={j} className={j === s.lines.length - 1 && i > 0 ? "sp-res origin-left" : "sp-in"}>
                    <Eq text={l} vars={vars} />
                  </div>
                ))}
              </div>
            )}

            {s.kind === "stack" && (
              <div className={`inline-block ${line}`}>
                <div className="sp-in">
                  <Eq text={s.top} vars={vars} />
                </div>
                <div className="sp-in flex items-end gap-4">
                  <Eq text={s.bottom} vars={vars} />
                  <span className="font-tale text-[1.2em] font-black leading-none" style={{ color }}>
                    {s.op}
                  </span>
                </div>
                <div className="sp-in my-1 h-[3px] w-full rounded bg-quill" />
                {s.result.map((r, j) => (
                  <div key={j} className="sp-res origin-left">
                    <Eq text={r} vars={vars} />
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
        {done && final && (
          <li className="sp-final origin-left rounded-2xl border-[3px] border-quill bg-gold px-4 py-3 font-tale text-[clamp(1.05rem,1.4vw,1.5rem)] font-black shadow-tale-sm">
            🏆 {final}
          </li>
        )}
      </ol>

      <div className="mt-4 flex shrink-0 flex-wrap items-center gap-3">
        <button
          onClick={next}
          disabled={done}
          className="rounded-2xl border-[3px] border-quill px-5 py-2.5 font-tale text-[clamp(0.95rem,1.1vw,1.15rem)] font-black text-white shadow-tale-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-40"
          style={{ background: color }}
        >
          ✨ Langkah berikutnya
        </button>
        <button
          onClick={reset}
          className="rounded-2xl border-[3px] border-quill bg-white px-4 py-2.5 font-tale font-black shadow-tale-sm transition-transform hover:-translate-y-0.5"
        >
          ↺ Ulangi
        </button>
        <span className="ml-auto font-round text-sm font-extrabold text-quill-soft tabular-nums">
          {shown} / {steps.length}
        </span>
      </div>
    </div>
  );
}
