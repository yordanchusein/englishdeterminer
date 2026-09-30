"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { levels, questions, type Answer } from "@/data/questions";

const N = questions.length;
const BASE = { x: 130, y: 604 };
const SUMMIT = { x: 130, y: 52 };
const POINTS = Array.from({ length: N }).map((_, i) => {
  const t = i / (N - 1);
  const y = 580 - t * 500;
  const half = ((y - 40) / 580) * 140;
  return { x: 130 + (i % 2 === 0 ? -1 : 1) * half * 0.55, y };
});
const TRAIL = `M${BASE.x} ${BASE.y} ` + POINTS.map((p) => `L${p.x} ${p.y}`).join(" ") + ` L${SUMMIT.x} ${SUMMIT.y}`;

export default function ClimbTracker({ records, index }: { records: (Answer | null)[]; index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const done = records.filter(Boolean).length;
  const pos = done === 0 ? BASE : done >= N ? SUMMIT : POINTS[done - 1];

  useGSAP(
    () => {
      gsap.to(".ct-climber", { x: pos.x, y: pos.y, duration: 1, ease: "back.out(2)" });
      gsap.fromTo(".ct-climber-inner", { y: 0 }, { keyframes: { y: [-18, 0] }, duration: 0.6, ease: "power2.out" });
    },
    { scope: root, dependencies: [done] },
  );

  useGSAP(
    () => {
      gsap.fromTo(".ct-pulse", { attr: { r: 8 }, opacity: 0.8 }, { attr: { r: 22 }, opacity: 0, duration: 1.1, repeat: -1, ease: "power2.out" });
      gsap.to(".ct-flag", { skewY: 10, scaleX: 0.85, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "left center" });
      gsap.set(".ct-climber", { x: BASE.x, y: BASE.y });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative flex h-full flex-col items-center">
      <p className="mb-1 font-display text-sm font-extrabold uppercase tracking-[0.25em] text-ink-soft">The climb</p>
      <svg viewBox="0 0 260 640" className="h-full w-full overflow-visible" aria-label={`${done} of ${N} answered`}>
        <path d="M-40 640 L60 300 L110 360 L180 180 L300 640 Z" fill="#A9C8EE" />
        <path d="M-10 640 L130 40 L270 640 Z" fill="#6FA8D6" stroke="#13294B" strokeWidth="4" strokeLinejoin="round" />
        <path d="M130 40 L270 640 L190 640 Z" fill="#5E8FC7" />
        <path d="M104 150 L130 40 L158 152 L144 138 L130 160 L116 138 Z" fill="#fff" />
        <path d={TRAIL} fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="2 9" strokeLinecap="round" />

        {POINTS.map((p, i) => {
          const r = records[i];
          const lv = levels[questions[i].level];
          const fill = r ? (r.correct ? "#1FAA62" : "#E5484D") : "#fff";
          return (
            <g key={i}>
              {i === index && !r && <circle className="ct-pulse" cx={p.x} cy={p.y} r="8" fill="none" stroke={lv.color} strokeWidth="3" />}
              <circle cx={p.x} cy={p.y} r={i === index ? 10 : 8} fill={fill} stroke={r ? "#13294B" : lv.color} strokeWidth="3" />
              {r && (
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">
                  {r.correct ? "✓" : "✕"}
                </text>
              )}
            </g>
          );
        })}

        <g transform={`translate(${SUMMIT.x} ${SUMMIT.y})`}>
          <line x1="0" y1="0" x2="0" y2="-46" stroke="#13294B" strokeWidth="4" strokeLinecap="round" />
          <path className="ct-flag" d="M0 -46 L34 -36 L0 -26 Z" fill="#E6457A" stroke="#13294B" strokeWidth="3" strokeLinejoin="round" />
        </g>

        <g className="ct-climber">
          <g className="ct-climber-inner">
            <circle r="18" fill="#FFC83D" stroke="#13294B" strokeWidth="3" />
            <text textAnchor="middle" y="7" fontSize="20">
              🧗
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
