"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sfx } from "@/lib/sound";

const R = 26;
const CIRC = 2 * Math.PI * R;

export default function TimerRing({
  running,
  seconds = 30,
  onTimeUp,
}: {
  running: boolean;
  seconds?: number;
  onTimeUp: () => void;
}) {
  const root = useRef<HTMLButtonElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const timeUp = useRef(onTimeUp);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    timeUp.current = onTimeUp;
  }, [onTimeUp]);

  useGSAP(
    () => {
      const obj = { t: seconds };
      let last = seconds;
      tween.current = gsap.to(obj, {
        t: 0,
        duration: seconds,
        ease: "none",
        paused: true,
        onUpdate: () => {
          const s = Math.ceil(obj.t);
          ring.current!.style.strokeDashoffset = String(CIRC * (1 - obj.t / seconds));
          if (s !== last) {
            last = s;
            num.current!.textContent = String(s);
            if (s <= 5) {
              ring.current!.style.stroke = "#E5484D";
              num.current!.style.color = "#E5484D";
              if (s > 0) {
                sfx.tick();
                gsap.fromTo(root.current, { scale: 1.3 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
              }
            }
          }
        },
        onComplete: () => timeUp.current(),
      });
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tween.current;
    if (!t) return;
    if (running && !paused) t.play();
    else t.pause();
  }, [running, paused]);

  return (
    <button
      ref={root}
      onClick={() => setPaused((p) => !p)}
      title="Pause / resume timer (P)"
      data-timer
      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white"
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r={R} fill="none" stroke="#13294B1a" strokeWidth="6" />
        <circle
          ref={ring}
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="#25A06B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={0}
        />
      </svg>
      <span ref={num} className="relative font-display text-xl font-extrabold tabular-nums">
        {seconds}
      </span>
      {paused && (
        <span className="absolute -bottom-5 text-[10px] font-extrabold uppercase tracking-widest text-ink-soft">paused</span>
      )}
    </button>
  );
}
