"use client";

import { useRef } from "react";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { categories } from "@/data/categories";
import { Ridge } from "./Scenery";

export default function Recap() {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const deck = root.current!.querySelector<HTMLElement>(".deck")!;
      const cards = gsap.utils.toArray<HTMLElement>(".rc", deck);

      gsap.from(".r-head > *", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 55%",
        once: true,
        onEnter: () => {
          const state = Flip.getState(cards);
          deck.classList.remove("is-stacked");
          sfx.whoosh();
          Flip.from(state, {
            duration: 1.2,
            ease: "expo.inOut",
            stagger: 0.07,
            absolute: true,
            onComplete: () => {
              gsap.fromTo(".rc-inner", { rotationY: 0 }, { keyframes: { rotationY: [0, 16, -10, 0] }, duration: 0.8, stagger: 0.05 });
            },
          });
        },
      });
    },
    { scope: root },
  );

  const flip = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    const inner = e.currentTarget.querySelector(".rc-inner")!;
    const flipped = inner.getAttribute("data-flipped") === "1";
    inner.setAttribute("data-flipped", flipped ? "0" : "1");
    sfx.click();
    gsap.to(inner, { rotationY: flipped ? 0 : 180, duration: 0.8, ease: "back.out(1.6)" });
  });

  const flipAll = contextSafe(() => {
    const inners = gsap.utils.toArray<HTMLElement>(".rc-inner", root.current);
    const anyFront = inners.some((i) => i.getAttribute("data-flipped") !== "1");
    inners.forEach((i) => i.setAttribute("data-flipped", anyFront ? "1" : "0"));
    sfx.whoosh();
    gsap.to(inners, { rotationY: anyFront ? 180 : 0, duration: 0.8, ease: "back.out(1.6)", stagger: 0.06 });
  });

  return (
    <section
      ref={root}
      id="recap"
      data-stop
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream px-[5vw] py-[7vh]"
    >
      <Ridge color="#BFE3FF" className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] w-full opacity-60" />
      <div className="r-head relative mb-[6vh] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.3em] text-white">
            Trail Map
          </span>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,5.4vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight">
            Quick recap
          </h2>
        </div>
        <button
          onClick={flipAll}
          className="rounded-2xl border-[3px] border-ink bg-sun px-5 py-2.5 font-display text-lg font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
        >
          ↻ Flip all cards
        </button>
      </div>

      <div className="deck is-stacked relative flex min-h-[62vh] flex-wrap content-start justify-center gap-[1.6vw]">
        {categories.map((c, i) => (
          <button
            key={c.key}
            onClick={flip}
            className="rc h-[27vh] w-[calc((100%-4.8vw)/4)] min-w-[220px] text-left [perspective:1200px]"
            style={{ ["--r" as string]: `${(i - 3) * 5}deg` }}
          >
            <div className="rc-inner relative h-full w-full [transform-style:preserve-3d]">
              {/* front */}
              <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] border-[3px] border-ink bg-white shadow-hard [backface-visibility:hidden]">
                <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: c.color }}>
                  <span className="truncate font-display text-[clamp(1.1rem,1.65vw,1.8rem)] font-extrabold">{c.title}</span>
                  <span className="font-display text-lg font-extrabold opacity-80">{c.no}</span>
                </div>
                <div className="flex flex-1 flex-wrap content-center gap-1.5 px-5 py-3">
                  {c.words.map((w) => (
                    <span key={w} className="rounded-lg border-2 border-ink px-2 py-0.5 font-display text-[clamp(0.95rem,1.3vw,1.3rem)] font-bold">
                      {w}
                    </span>
                  ))}
                </div>
                <span className="px-5 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">tap to flip ↻</span>
              </div>
              {/* back */}
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-[1.6rem] border-[3px] border-ink p-5 text-white shadow-hard [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{ background: c.color }}
              >
                <p className="font-display text-[clamp(1.05rem,1.45vw,1.5rem)] font-bold leading-snug">{c.summary}</p>
                <p className="rounded-xl bg-white/95 px-3 py-2 font-display text-[clamp(0.95rem,1.25vw,1.3rem)] font-extrabold text-ink">
                  e.g. {c.recapExample}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
