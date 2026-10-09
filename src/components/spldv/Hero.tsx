"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-lite";
import { sfx } from "@/lib/sound";
import { ambient } from "./ambient";
import { DragonY, FairyX, GreatTree, Hills, Moon, Pine, Sparkle, Stars, TreeLine } from "./Scenery";

const CHIPS: { t: string; x: number; y: number; c: string }[] = [
  { t: "x + y = 37", x: 6, y: 20, c: "#e8478f" },
  { t: "x − y = 7", x: 78, y: 18, c: "#129e94" },
  { t: "2x + 3y", x: 3, y: 52, c: "#6a4bc4" },
  { t: "= 19.000", x: 84, y: 46, c: "#d99a1e" },
  { t: "y = 15", x: 18, y: 8, c: "#129e94" },
  { t: "x = 22", x: 66, y: 6, c: "#e8478f" },
];

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".h-title", { type: "chars", charsClass: "inline-block" });

      gsap.set(".h-layer", { yPercent: 60 });
      gsap.set(".h-castle", { yPercent: 40, opacity: 0 });
      gsap.set(".h-moon", { y: 200, opacity: 0 });
      gsap.set(split.chars, { yPercent: 160, rotationX: -90, opacity: 0, transformOrigin: "50% 100%" });
      gsap.set([".h-kicker", ".h-sub", ".h-hint", ".h-char"], { opacity: 0 });
      gsap.set(".h-chip", { scale: 0 });
      gsap.set(".tree-win", { opacity: 0.15 });

      intro.current = gsap
        .timeline({ paused: true })
        .to(".h-layer", { yPercent: 0, duration: 1.8, ease: "expo.out", stagger: 0.1 })
        .to(".h-castle", { yPercent: 0, opacity: 1, duration: 1.6, ease: "expo.out" }, 0.25)
        .to(".h-moon", { y: 0, opacity: 1, duration: 1.8, ease: "power3.out" }, 0.1)
        .to(".tree-win", { opacity: 1, duration: 0.3, stagger: 0.08 }, 1)
        .to(split.chars, { yPercent: 0, rotationX: 0, opacity: 1, duration: 1, ease: "back.out(2)", stagger: 0.07 }, 0.6)
        .fromTo(".h-kicker", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(2.5)" }, 1.1)
        .to(".h-sub", { opacity: 1, duration: 0.5 }, 1.4)
        .to(".h-typed", { text: { value: "Pada zaman dahulu, di Hutan Dua Variabel…" }, duration: 2, ease: "none" }, 1.5)
        .to(".h-chip", { scale: 1, duration: 0.8, ease: "back.out(3)", stagger: { each: 0.07, from: "random" } }, 1.4)
        .fromTo(".h-char", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2.5)", stagger: 0.2 }, 1.8)
        .to(".h-hint", { opacity: 1, duration: 0.6 }, 3);

      // ambient life — paused while the hero is scrolled away
      const life = ambient(root.current!, () => {
      gsap.to(".moon-glow", { scale: 1.12, transformOrigin: "50% 50%", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.fromTo(".tree-lantern", { rotation: -6 }, { rotation: 6, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.3 });
      gsap.to(".tree-canopy", { rotation: 1.2, scale: 1.015, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".h-chip-inner", {
        y: "random(-16, 16)",
        rotation: "random(-8, 8)",
        duration: "random(2, 3.4)",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: "sine.inOut",
      });
      gsap.to(".h-char-x", { y: -24, x: 10, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".h-char-y", { y: -14, x: -12, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".fx-wings", { scaleX: 0.7, duration: 0.18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".dy-wing", { rotation: -18, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".h-firefly", {
        x: "random(-60, 60)",
        y: "random(-40, 40)",
        opacity: "random(0.2, 1)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        ".h-shooting",
        { x: "-10vw", y: 0, opacity: 0 },
        {
          keyframes: [
            { opacity: 1, duration: 0.1 },
            { x: "40vw", y: "22vh", duration: 1, ease: "power1.in" },
            { opacity: 0, duration: 0.2 },
          ],
          repeat: -1,
          repeatDelay: 6,
          delay: 4,
        },
      );
      });

      // hover: chips spin, characters giggle
      gsap.utils.toArray<HTMLElement>(".h-chip").forEach((chip) => {
        chip.addEventListener("mouseenter", () => {
          sfx.sparkle();
          gsap.fromTo(chip, { rotation: 0 }, { rotation: 360, scale: 1.2, duration: 0.6, ease: "back.out(2)", yoyo: true, repeat: 1 });
        });
      });

      // mouse parallax
      const depth: [string, number][] = [
        [".h-far", 8],
        [".h-mid", 18],
        [".h-castle-move", 24],
        [".h-near", 32],
        [".h-front", 50],
        [".h-chips", -36],
        [".h-stars", -10],
      ];
      const movers = depth.map(([sel, amt]) => ({
        x: gsap.quickTo(sel, "x", { duration: 1, ease: "power3" }),
        y: gsap.quickTo(sel, "y", { duration: 1, ease: "power3" }),
        amt,
      }));
      const onMove = (e: MouseEvent) => {
        if (!life.isActive) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach(({ x, y, amt }) => {
          x(nx * amt);
          y(ny * amt * 0.3);
        });
      };
      window.addEventListener("mousemove", onMove);

      // scroll out
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } })
        .to(".h-title-wrap", { yPercent: -60, scale: 0.85, opacity: 0, ease: "none" }, 0)
        .to(".h-scroll-far", { yPercent: 10, ease: "none" }, 0)
        .to(".h-scroll-castle", { yPercent: 16, ease: "none" }, 0)
        .to(".h-scroll-near", { yPercent: 26, ease: "none" }, 0)
        .to(".h-chips", { yPercent: -40, opacity: 0, ease: "none" }, 0);

      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section ref={root} id="top" data-stop className="tale-night relative h-screen overflow-hidden">
      <div className="h-stars absolute inset-0">
        <Stars count={90} seed={11} />
      </div>
      <div className="h-shooting absolute left-[10%] top-[10%] h-[3px] w-28 rounded-full bg-gradient-to-r from-transparent to-white" />
      <Moon className="h-moon absolute right-[8%] top-[8%] w-[clamp(120px,14vw,240px)]" />

      <div className="h-layer h-scroll-far absolute inset-x-0 bottom-0">
        <div className="h-far relative -left-[5%] w-[110%]">
          <TreeLine seed={2} count={34} min={50} max={110} fill="#22553b" className="block h-[24vh] w-full" />
          <Hills layer="far" className="-mt-[1px] block h-[30vh] w-full" />
        </div>
      </div>
      <div className="h-layer absolute inset-x-0 bottom-0">
        <div className="h-mid relative -left-[5%] w-[110%]">
          <TreeLine seed={5} count={28} min={60} max={130} fill="#17402f" className="block h-[22vh] w-full" />
          <Hills layer="mid" className="-mt-[1px] block h-[20vh] w-full" />
        </div>
      </div>
      <div className="h-castle h-scroll-castle absolute inset-x-0 bottom-[11vh] flex justify-center">
        <div className="h-castle-move">
          <GreatTree className="w-[clamp(300px,38vw,620px)] drop-shadow-[0_0_50px_rgba(255,214,107,0.3)]" />
        </div>
      </div>
      <div className="h-layer h-scroll-near absolute inset-x-0 bottom-0">
        <Hills layer="near" className="h-near relative -left-[5%] block h-[26vh] w-[110%]" />
      </div>
      <div className="h-layer absolute inset-x-0 -bottom-[2px]">
        <div className="h-front relative">
          <Hills layer="front" className="relative -left-[5%] block h-[17vh] w-[110%]" />
          <Pine className="absolute bottom-[6vh] left-[6%] w-[4vw]" />
          <Pine className="absolute bottom-[8vh] left-[10%] w-[2.6vw]" />
          <Pine className="absolute bottom-[7vh] right-[8%] w-[4.4vw]" />
          <Pine className="absolute bottom-[9vh] right-[13%] w-[2.8vw]" />
        </div>
      </div>

      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="h-firefly pointer-events-none absolute h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_4px_rgba(247,197,72,0.7)]"
          style={{ left: `${8 + ((i * 37) % 86)}%`, bottom: `${6 + ((i * 13) % 22)}vh` }}
        />
      ))}

      {/* the two heroes of the story */}
      <div className="h-char pointer-events-none absolute bottom-[30vh] left-[12%]">
        <FairyX className="h-char-x w-[clamp(70px,8vw,130px)]" />
      </div>
      <div className="h-char pointer-events-none absolute bottom-[26vh] right-[12%]">
        <DragonY className="h-char-y w-[clamp(80px,9vw,150px)]" />
      </div>

      <div className="h-chips pointer-events-none absolute inset-0">
        {CHIPS.map((c) => (
          <div key={c.t} className="h-chip pointer-events-auto absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            <div
              className="h-chip-inner cursor-default rounded-2xl border-[3px] border-quill bg-parch px-4 py-1.5 font-round text-[clamp(0.95rem,1.5vw,1.5rem)] font-black italic shadow-tale-sm"
              style={{ color: c.c }}
            >
              {c.t}
            </div>
          </div>
        ))}
      </div>

      <div className="h-title-wrap pointer-events-none absolute inset-0 flex flex-col items-center justify-start pt-[17vh] text-center">
        <span className="h-kicker mb-4 flex items-center gap-2 rounded-full border-[3px] border-quill bg-gold px-5 py-2 font-round text-xs font-black uppercase tracking-[0.25em] text-quill shadow-tale-sm sm:text-sm">
          <Sparkle className="w-4" fill="#22301e" /> Matematika TKA 2026 · Hutan Dongeng
        </span>
        <h1 className="h-title font-tale text-[clamp(4rem,14vw,15rem)] font-black leading-[0.85] tracking-tight text-parch [perspective:600px] [text-shadow:0_6px_0_#22301e,0_0_40px_rgba(247,197,72,0.45)]">
          SPLDV
        </h1>
        <p className="h-sub mt-3 font-tale text-[clamp(1rem,2vw,2rem)] font-bold text-parch/90">
          Sistem Persamaan Linear Dua Variabel
        </p>
        <p className="mt-3 min-h-[1.4em] font-tale text-[clamp(1rem,1.7vw,1.7rem)] font-semibold italic text-gold">
          <span className="h-typed" />
          <span className="ml-1 inline-block w-[3px] animate-pulse bg-gold align-middle">&nbsp;</span>
        </p>
      </div>

      <div className="h-hint absolute bottom-[3vh] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-parch">
        <span className="font-round text-xs font-extrabold uppercase tracking-[0.3em] sm:text-sm">Gulir atau tekan →</span>
        <svg className="h-7 w-7 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
