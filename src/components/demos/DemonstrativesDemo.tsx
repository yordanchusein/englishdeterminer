"use client";

import { useRef } from "react";
import { useLoop, type DemoProps } from "./useLoop";

const STEPS = [
  { d: "this", n: "tent", cell: 0 },
  { d: "that", n: "tent", cell: 1 },
  { d: "these", n: "tents", cell: 2 },
  { d: "those", n: "tents", cell: 3 },
];

export default function DemonstrativesDemo({ active, color }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);

  useLoop(root, active, (tl, q) => {
    const bubbles = q(".d-say");
    const cells = q(".d-cell");
    const [group] = q(".d-group");
    const extra = q(".d-extra");
    const far = () => (root.current?.querySelector(".d-stage") as HTMLElement).offsetWidth * 0.46;

    const show = (i: number) => {
      tl.to(bubbles, { autoAlpha: 0, scale: 0.6, duration: 0.2 })
        .fromTo(bubbles[i], { autoAlpha: 0, scale: 0.4, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(3)" })
        .to(cells, { backgroundColor: "#ffffff", color: "#13294B", scale: 1, duration: 0.2 }, "<")
        .to(cells[STEPS[i].cell], { backgroundColor: color, color: "#ffffff", scale: 1.1, duration: 0.35, ease: "back.out(3)" }, "<")
        .to({}, { duration: 1.3 })
        .to(bubbles[i], { autoAlpha: 0, scale: 0.6, duration: 0.2 });
    };

    tl.set(group, { x: 0, scale: 1 }).set(extra, { scale: 0 }).set(bubbles, { autoAlpha: 0 });
    show(0);
    tl.to(group, { x: far, scale: 0.5, duration: 1, ease: "power3.inOut" });
    show(1);
    tl.to(group, { x: 0, scale: 1, duration: 0.9, ease: "power3.inOut" }).to(extra, {
      scale: 1,
      duration: 0.5,
      ease: "back.out(3)",
      stagger: 0.12,
    });
    show(2);
    tl.to(group, { x: far, scale: 0.5, duration: 1, ease: "power3.inOut" });
    show(3);
    tl.to(extra, { scale: 0, duration: 0.3 }).to(group, { x: 0, scale: 1, duration: 0.6, ease: "power2.inOut" }, "<");
  });

  return (
    <div ref={root} className="relative flex h-full flex-col">
      <div className="d-stage relative flex-1">
        {/* ground */}
        <div className="absolute inset-x-0 bottom-[18%] h-[3px] bg-ink/25" />
        <div className="absolute bottom-[18%] left-[3%] text-[clamp(3rem,5vw,5rem)] leading-none">🙋</div>
        {/* speech bubbles */}
        <div className="absolute left-[2%] top-[4%]">
          {STEPS.map((s) => (
            <div
              key={s.d}
              className="d-say invisible absolute left-0 top-0 origin-bottom-left whitespace-nowrap rounded-2xl rounded-bl-none border-[3px] border-ink bg-white px-4 py-2 font-display text-[clamp(1.4rem,2.4vw,2.6rem)] font-extrabold shadow-hard-sm"
            >
              <span style={{ color }}>{s.d}</span> {s.n}!
            </div>
          ))}
        </div>
        <div className="d-group absolute bottom-[18%] left-[24%] origin-bottom-left">
          <div className="relative text-[clamp(3rem,5vw,5.2rem)] leading-none">
            <span className="d-extra absolute bottom-[0.5em] left-[0.55em] inline-block origin-bottom">⛺</span>
            <span className="relative inline-block">⛺</span>
            <span className="d-extra relative inline-block origin-bottom">⛺</span>
          </div>
        </div>
        <div className="absolute bottom-[4%] left-[24%] text-xs font-extrabold uppercase tracking-[0.3em] text-ink-soft">near</div>
        <div className="absolute bottom-[4%] right-[8%] text-xs font-extrabold uppercase tracking-[0.3em] text-ink-soft">far</div>
      </div>
      <div className="mx-auto grid w-full max-w-[340px] grid-cols-[auto_1fr_1fr] gap-1.5 text-center text-sm font-bold">
        <span />
        <span className="uppercase tracking-widest text-ink-soft">near</span>
        <span className="uppercase tracking-widest text-ink-soft">far</span>
        <span className="pr-2 text-left uppercase tracking-widest text-ink-soft">one</span>
        <span className="d-cell rounded-lg border-2 border-ink py-1 font-display text-lg">this</span>
        <span className="d-cell rounded-lg border-2 border-ink py-1 font-display text-lg">that</span>
        <span className="pr-2 text-left uppercase tracking-widest text-ink-soft">many</span>
        <span className="d-cell rounded-lg border-2 border-ink py-1 font-display text-lg">these</span>
        <span className="d-cell rounded-lg border-2 border-ink py-1 font-display text-lg">those</span>
      </div>
    </div>
  );
}
