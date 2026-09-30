"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const LABELS = [
  { d: "each", n: "hiker", note: "one by one, individually" },
  { d: "every", n: "hiker", note: "all of them, as a group" },
  { d: "either", n: "route", note: "one or the other (of two)" },
  { d: "neither", n: "route", note: "not A and not B" },
];

export default function DistributivesDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const labels = q(".ds-label");
    const people = q(".ds-person");
    const [sceneA] = q(".ds-a");
    const [sceneB] = q(".ds-b");
    const [bracket] = q(".ds-bracket");
    const routes = q<SVGPathElement>(".ds-route");
    const flags = q(".ds-flag");
    const crosses = q(".ds-cross");

    const label = (i: number) =>
      tl
        .to(labels, { autoAlpha: 0, duration: 0.2 })
        .fromTo(labels[i], { autoAlpha: 0, scale: 0.5, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(3)" });

    const on = { backgroundColor: color, scale: 1.18, y: -8, duration: 0.25, ease: "back.out(3)" };
    const off = { backgroundColor: "#ffffff", scale: 1, y: 0, duration: 0.2 };

    tl.set(sceneA, { autoAlpha: 1 })
      .set(sceneB, { autoAlpha: 0 })
      .set(labels, { autoAlpha: 0 })
      .set(bracket, { scaleX: 0 })
      .set(people, { backgroundColor: "#fff", scale: 1, y: 0 })
      .set(routes, { stroke: "#C9D3E0" })
      .set(flags, { scale: 1 })
      .set(crosses, { scale: 0 });

    // EACH — spotlight moves one by one
    label(0);
    people.forEach((p) => tl.to(p, on).to(p, off, "+=0.12"));
    // EVERY — all light up together
    label(1);
    tl.to(people, { ...on, stagger: 0 }).to(bracket, { scaleX: 1, duration: 0.4, ease: "power3.out" }, "<").to({}, { duration: 1 }).to(people, off).to(bracket, { scaleX: 0, duration: 0.2 }, "<");
    // switch to the fork
    tl.to(sceneA, { autoAlpha: 0, x: -60, duration: 0.35 }).fromTo(sceneB, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4 });
    // EITHER — alternate A / B
    label(2);
    for (let k = 0; k < 2; k++) {
      tl.to(routes[0], { stroke: color, duration: 0.2 })
        .to(flags[0], { scale: 1.3, duration: 0.25, ease: "back.out(3)" }, "<")
        .to(routes[0], { stroke: "#C9D3E0", duration: 0.2 }, "+=0.35")
        .to(flags[0], { scale: 1, duration: 0.2 }, "<")
        .to(routes[1], { stroke: color, duration: 0.2 })
        .to(flags[1], { scale: 1.3, duration: 0.25, ease: "back.out(3)" }, "<")
        .to(routes[1], { stroke: "#C9D3E0", duration: 0.2 }, "+=0.35")
        .to(flags[1], { scale: 1, duration: 0.2 }, "<");
    }
    // NEITHER — both crossed out
    label(3);
    tl.to(crosses, { scale: 1, duration: 0.45, ease: "back.out(4)", stagger: 0.2 })
      .to(routes, { stroke: "#E5484D", duration: 0.3 }, "<")
      .to({}, { duration: 1.3 })
      .to(sceneB, { autoAlpha: 0, duration: 0.3 })
      .set(sceneA, { x: 0 });
  });

  return (
    <div ref={root} className="flex h-full flex-col">
      <div className="relative h-[clamp(3.2rem,5vw,4.6rem)]">
        {LABELS.map((l) => (
          <div key={l.d} className="ds-label invisible absolute inset-0 flex flex-col items-center">
            <span className="font-display text-[clamp(1.5rem,2.5vw,2.6rem)] font-extrabold leading-tight">
              <span className="hl" style={{ background: color }}>
                {l.d}
              </span>{" "}
              {l.n}
            </span>
            <span className="text-sm font-bold text-ink-soft">= {l.note}</span>
          </div>
        ))}
      </div>
      <div className="relative flex-1">
        <div className="ds-a absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex gap-[clamp(0.4rem,1vw,1rem)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="ds-person flex aspect-square w-[clamp(2.8rem,4.4vw,4.4rem)] items-center justify-center rounded-full border-[3px] border-ink text-[clamp(1.4rem,2.2vw,2.2rem)]"
              >
                🚶
              </span>
            ))}
          </div>
          <div className="ds-bracket mt-3 h-3 w-[80%] origin-center rounded-b-xl border-[3px] border-t-0" style={{ borderColor: color }} />
        </div>
        <div className="ds-b invisible absolute inset-0">
          <svg viewBox="0 0 300 160" className="h-full w-full">
            <path className="ds-route" d="M150 160 C150 110 150 100 90 60 L60 40" fill="none" strokeWidth="14" strokeLinecap="round" />
            <path className="ds-route" d="M150 160 C150 110 150 100 210 60 L240 40" fill="none" strokeWidth="14" strokeLinecap="round" />
            {[
              { x: 48, l: "A" },
              { x: 252, l: "B" },
            ].map((f, i) => (
              <g key={f.l} transform={`translate(${f.x} 30)`}>
                <g className="ds-flag" style={{ transformOrigin: "0px 0px" }}>
                  <circle r="20" fill="#fff" stroke="#13294B" strokeWidth="3" />
                  <text textAnchor="middle" dy="7" className="font-display" fontSize="20" fontWeight="800" fill="#13294B">
                    {f.l}
                  </text>
                </g>
                <text className="ds-cross" textAnchor="middle" dy="12" fontSize="44" fontWeight="900" fill="#E5484D" style={{ transformOrigin: "0px 0px" }}>
                  ✕
                </text>
                <text textAnchor="middle" y={i === 0 ? 44 : 44} fontSize="11" fontWeight="700" fill="#3D5475">
                  route
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
