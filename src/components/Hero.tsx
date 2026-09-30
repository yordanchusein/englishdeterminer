"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Bird, Cloud, MountainLayer, Sun } from "./Scenery";

const CHIPS: { w: string; x: number; y: number; c: string }[] = [
  { w: "a", x: 7, y: 18, c: "#FF7A45" },
  { w: "the", x: 2, y: 38, c: "#FF7A45" },
  { w: "this", x: 5, y: 62, c: "#2B8CFF" },
  { w: "my", x: 26, y: 12, c: "#E6457A" },
  { w: "many", x: 40, y: 6, c: "#25A06B" },
  { w: "some", x: 58, y: 8, c: "#25A06B" },
  { w: "those", x: 73, y: 13, c: "#2B8CFF" },
  { w: "every", x: 86, y: 28, c: "#7C5CE6" },
  { w: "their", x: 84, y: 50, c: "#E6457A" },
  { w: "which", x: 90, y: 68, c: "#0FA3B1" },
  { w: "first", x: 20, y: 70, c: "#E8A200" },
];

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".h-title", { type: "chars", charsClass: "h-char inline-block" });

      gsap.set(".h-layer", { yPercent: 70 });
      gsap.set(".h-sun", { y: 260, opacity: 0 });
      gsap.set(split.chars, { yPercent: -220, rotation: () => gsap.utils.random(-50, 50), opacity: 0 });
      gsap.set([".h-kicker", ".h-hint"], { opacity: 0 });
      gsap.set(".h-chip", { scale: 0 });

      intro.current = gsap
        .timeline({ paused: true })
        .to(".h-layer", { yPercent: 0, duration: 1.8, ease: "expo.out", stagger: 0.12 })
        .to(".h-sun", { y: 0, opacity: 1, duration: 1.6, ease: "back.out(1.3)" }, 0.15)
        .to(
          split.chars,
          { yPercent: 0, rotation: 0, opacity: 1, duration: 1.2, ease: "bounce.out", stagger: { each: 0.06, from: "random" } },
          0.35,
        )
        .fromTo(".h-kicker", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(2.5)" }, 1)
        .to(".h-sub-text", { text: { value: "Small words. Big job." }, duration: 1.1, ease: "none" }, 1.5)
        .to(".h-chip", { scale: 1, duration: 0.8, ease: "back.out(3)", stagger: { each: 0.05, from: "center" } }, 1.25)
        .to(".h-hint", { opacity: 1, duration: 0.6 }, 2.4);

      // ambient life
      gsap.to(".sun-rays", { rotation: 360, duration: 40, repeat: -1, ease: "none" });
      gsap.utils.toArray<HTMLElement>(".h-cloud").forEach((c, i) =>
        gsap.to(c, { x: `+=${140 + i * 40}`, duration: 16 + i * 5, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      );
      gsap.to(".h-chip-inner", {
        y: "random(-16, 16)",
        rotation: "random(-10, 10)",
        duration: "random(1.8, 3.2)",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: "sine.inOut",
      });
      gsap.to(".bird-wing", { scaleY: -0.6, duration: 0.28, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.07 });
      gsap.fromTo(".h-birds", { x: "-20vw" }, { x: "120vw", duration: 26, repeat: -1, ease: "none" });
      gsap.to(".h-hint-arrow", { y: 10, duration: 0.7, repeat: -1, yoyo: true, ease: "power1.inOut" });

      // hover: chips jump away from the cursor
      gsap.utils.toArray<HTMLElement>(".h-chip").forEach((chip) => {
        chip.addEventListener("mouseenter", () =>
          gsap.fromTo(chip, { rotation: 0 }, { rotation: 360, scale: 1.25, duration: 0.6, ease: "back.out(2)", yoyo: true, repeat: 1 }),
        );
      });

      // mouse parallax
      const depth: [string, number][] = [
        [".h-far", 10],
        [".h-mid", 22],
        [".h-near", 34],
        [".h-front", 52],
        [".h-chips", -40],
      ];
      const movers = depth.map(([sel, amt]) => ({ fn: gsap.quickTo(sel, "x", { duration: 1, ease: "power3" }), amt }));
      const moversY = depth.map(([sel, amt]) => ({ fn: gsap.quickTo(sel, "y", { duration: 1, ease: "power3" }), amt }));
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach(({ fn, amt }) => fn(nx * amt));
        moversY.forEach(({ fn, amt }) => fn(ny * amt * 0.3));
      };
      window.addEventListener("mousemove", onMove);

      // scroll out
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } })
        .to(".h-title-wrap", { yPercent: -70, scale: 0.85, opacity: 0, ease: "none" }, 0)
        .to(".h-scroll-far", { yPercent: 12, ease: "none" }, 0)
        .to(".h-scroll-mid", { yPercent: 22, ease: "none" }, 0)
        .to(".h-scroll-near", { yPercent: 30, ease: "none" }, 0)
        .to(".h-chips", { yPercent: -40, opacity: 0, ease: "none" }, 0);

      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section ref={root} id="top" data-stop className="sky-gradient relative h-screen overflow-hidden">
      <Sun className="h-sun absolute right-[9%] top-[9%] w-[clamp(110px,13vw,220px)]" />

      <Cloud className="h-cloud absolute left-[4%] top-[12%] w-[16vw] opacity-90" />
      <Cloud className="h-cloud absolute left-[62%] top-[24%] w-[12vw] opacity-80" />
      <Cloud className="h-cloud absolute left-[30%] top-[34%] w-[9vw] opacity-70" />
      <Cloud className="h-cloud absolute left-[78%] top-[4%] w-[14vw] opacity-95" />

      <div className="h-birds absolute left-0 top-[20%] flex gap-6">
        <Bird className="w-10" />
        <Bird className="mt-6 w-7" />
        <Bird className="-mt-3 w-8" />
      </div>

      {/* Mountains: .h-layer = intro, .h-scroll-* = scroll, .h-far… = mouse */}
      <div className="h-layer h-scroll-far absolute inset-x-0 bottom-0">
        <MountainLayer layer="far" className="h-far relative -left-[5%] block h-[60vh] w-[110%]" />
      </div>
      <div className="h-layer h-scroll-mid absolute inset-x-0 bottom-0">
        <MountainLayer layer="mid" className="h-mid relative -left-[5%] block h-[44vh] w-[110%]" />
      </div>
      <div className="h-layer h-scroll-near absolute inset-x-0 bottom-0">
        <MountainLayer layer="near" className="h-near relative -left-[5%] block h-[32vh] w-[110%]" />
      </div>
      <div className="h-layer absolute inset-x-0 -bottom-[2px]">
        <MountainLayer layer="front" className="h-front relative -left-[5%] block h-[22vh] w-[110%]" />
      </div>

      <div className="h-chips pointer-events-none absolute inset-0">
        {CHIPS.map((c) => (
          <div key={c.w} className="h-chip pointer-events-auto absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            <div
              className="h-chip-inner cursor-default rounded-2xl border-[3px] border-ink px-4 py-1.5 font-display text-[clamp(1rem,1.7vw,1.7rem)] font-bold text-white shadow-hard-sm"
              style={{ background: c.c }}
            >
              {c.w}
            </div>
          </div>
        ))}
      </div>

      <div className="h-title-wrap pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-[16vh] text-center">
        <span className="h-kicker mb-5 rounded-full border-[3px] border-ink bg-white px-5 py-2 text-sm font-extrabold uppercase tracking-[0.25em] shadow-hard-sm">
          English Grammar · Presentation
        </span>
        <h1 className="h-title font-display text-[clamp(3.6rem,13.5vw,15rem)] font-extrabold leading-[0.85] tracking-tight text-ink [text-shadow:0_6px_0_rgba(255,255,255,0.6)]">
          Determiners
        </h1>
        <p className="h-sub mt-6 min-h-[1.4em] font-display text-[clamp(1.3rem,2.6vw,2.6rem)] font-bold text-ink">
          <span className="h-sub-text" />
          <span className="ml-1 inline-block w-[3px] animate-pulse bg-ink align-middle">&nbsp;</span>
        </p>
      </div>

      <div className="h-hint absolute bottom-[4vh] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white">
        <span className="text-sm font-bold uppercase tracking-[0.3em]">Scroll or press →</span>
        <svg className="h-hint-arrow h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
