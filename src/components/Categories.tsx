"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { getLenis, registerStops } from "@/lib/scroll";
import { sfx } from "@/lib/sound";
import { categories, type Category, type CategoryKey } from "@/data/categories";
import { Highlight, Ridge } from "./Scenery";
import type { DemoProps } from "./demos/useLoop";
import ArticlesDemo from "./demos/ArticlesDemo";
import DemonstrativesDemo from "./demos/DemonstrativesDemo";
import PossessivesDemo from "./demos/PossessivesDemo";
import QuantifiersDemo from "./demos/QuantifiersDemo";
import NumbersDemo from "./demos/NumbersDemo";
import DistributivesDemo from "./demos/DistributivesDemo";
import InterrogativesDemo from "./demos/InterrogativesDemo";

const DEMOS: Record<CategoryKey, ComponentType<DemoProps>> = {
  articles: ArticlesDemo,
  demonstratives: DemonstrativesDemo,
  possessives: PossessivesDemo,
  quantifiers: QuantifiersDemo,
  numbers: NumbersDemo,
  distributives: DistributivesDemo,
  interrogatives: InterrogativesDemo,
};

const TRAIL = "M30 400 C150 400 170 330 250 318 S400 350 450 270 S560 190 630 214 S780 196 810 132 S900 70 975 44";
const MARKS = [0.07, 0.21, 0.36, 0.5, 0.64, 0.8, 0.96];

/* ─── Intro panel: the trail map ─────────────────────────── */
function TrailPanel({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const p = path.current!;
    const len = p.getTotalLength();
    setPts(MARKS.map((m) => p.getPointAtLength(len * m)));
  }, []);

  useGSAP(
    () => {
      if (!pts.length) return;
      tl.current = gsap
        .timeline({ paused: true })
        .fromTo(".t-path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" })
        .fromTo(".t-mark", { scale: 0, y: -40 }, { scale: 1, y: 0, duration: 0.6, ease: "back.out(3)", stagger: 0.28 }, 0.2)
        .fromTo(".t-flag", { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 0.7, ease: "elastic.out(1,0.4)" }, "-=0.2");
      gsap.to(".t-hiker", { y: -6, duration: 0.35, repeat: -1, yoyo: true, ease: "sine.inOut" });
      if (active) tl.current.play();
    },
    { scope: root, dependencies: [pts.length] },
  );

  useEffect(() => {
    if (active) tl.current?.restart();
  }, [active]);

  return (
    <div ref={root} className="panel relative flex h-screen w-screen shrink-0 flex-col justify-center overflow-hidden bg-sky-light px-[6vw] pt-[8vh]">
      <Ridge color="#BFE3FF" className="absolute inset-x-0 bottom-0 h-[30vh] w-full" />
      <div data-reveal className="relative">
        <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.3em] text-white">
          The Trail · 7 checkpoints
        </span>
      </div>
      <h2 data-reveal className="relative mt-4 max-w-[14ch] font-display text-[clamp(2.6rem,6vw,6.2rem)] font-extrabold leading-[0.92] tracking-tight">
        7 types of determiners
      </h2>
      <p data-reveal className="relative mt-3 max-w-[46ch] text-[clamp(1rem,1.4vw,1.4rem)] font-medium text-ink-soft">
        Walk the trail from base camp to the summit. Each checkpoint is one type — press <kbd className="rounded-md border-2 border-ink bg-white px-1.5 font-bold text-ink">→</kbd> to hike on.
      </p>
      <svg viewBox="0 0 1000 440" className="relative mt-[2vh] h-[46vh] w-full overflow-visible">
        <path d={TRAIL} fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" />
        <path
          ref={path}
          className="t-path"
          d={TRAIL}
          fill="none"
          stroke="#13294B"
          strokeWidth="5"
          strokeDasharray="1"
          pathLength={1}
          strokeLinecap="round"
        />
        {pts.map((p, i) => {
          const c = categories[i];
          const above = i % 2 === 1;
          return (
            <g key={c.key} transform={`translate(${p.x} ${p.y})`}>
              <g className="t-mark" style={{ transformOrigin: "0px 0px" }}>
                <circle r="17" fill={c.color} stroke="#13294B" strokeWidth="4" />
                <text textAnchor="middle" dy="6" fontSize="16" fontWeight="800" fill="#fff">
                  {i + 1}
                </text>
                <text
                  textAnchor="middle"
                  y={above ? -30 : 46}
                  fontSize="22"
                  fontWeight="800"
                  fill="#13294B"
                  className="font-display"
                >
                  {c.title}
                </text>
              </g>
            </g>
          );
        })}
        <g transform="translate(975 44)">
          <g className="t-flag" style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="0" x2="0" y2="-60" stroke="#13294B" strokeWidth="5" strokeLinecap="round" />
            <path d="M0 -60 L40 -48 L0 -36 Z" fill="#E6457A" stroke="#13294B" strokeWidth="3" strokeLinejoin="round" />
          </g>
        </g>
        <text className="t-hiker" x="10" y="385" fontSize="40">
          🥾
        </text>
      </svg>
    </div>
  );
}

/* ─── Category panel ─────────────────────────────────────── */
function CategoryPanel({ c, active }: { c: Category; active: boolean }) {
  const Demo = DEMOS[c.key];
  return (
    <div className="panel relative h-screen w-screen shrink-0 overflow-hidden" style={{ background: c.tint }}>
      <Ridge color={c.color} className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] w-full opacity-[0.12]" />
      <span
        className="p-bignum pointer-events-none absolute -bottom-[6vh] right-[2vw] font-display text-[38vh] font-extrabold leading-none opacity-[0.08]"
        style={{ color: c.color }}
      >
        {c.no}
      </span>

      <div className="relative grid h-full grid-cols-[1.08fr_1fr] gap-[3.5vw] px-[5vw] pb-[9vh] pt-[11vh]">
        {/* left: explanation */}
        <div className="flex min-h-0 flex-col">
          <div data-reveal className="flex items-center gap-3">
            <span className="rounded-full border-[3px] border-ink bg-white px-3 py-0.5 font-display text-sm font-extrabold">
              {c.no} / 07
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.3em]" style={{ color: c.color }}>
              Checkpoint
            </span>
          </div>
          <h3
            className="p-title mt-2 font-display text-[clamp(2.6rem,5.4vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight"
            style={{ color: c.color }}
          >
            {c.title}
          </h3>
          <p data-reveal className="mt-1 font-display text-[clamp(1.1rem,1.7vw,1.8rem)] font-bold">
            {c.tagline}
          </p>
          <div data-reveal className="mt-3 flex flex-wrap gap-2">
            {c.words.map((w) => (
              <span
                key={w}
                className="p-word rounded-xl border-[3px] border-ink bg-white px-4 py-1 font-display text-[clamp(1rem,1.5vw,1.5rem)] font-extrabold shadow-hard-sm"
              >
                {w}
              </span>
            ))}
          </div>
          <div className="mt-[2.4vh] flex flex-col gap-[1.2vh]">
            {c.rules.map((r) => (
              <div data-reveal key={r.h} className="flex items-baseline gap-3">
                <span
                  className="shrink-0 rounded-lg px-3 py-1 text-[clamp(0.8rem,1vw,1.1rem)] font-extrabold text-white"
                  style={{ background: c.color }}
                >
                  {r.h}
                </span>
                <span className="text-[clamp(0.95rem,1.25vw,1.3rem)] font-medium leading-snug">{r.t}</span>
              </div>
            ))}
          </div>
          <div
            data-reveal
            className="mt-auto flex items-center gap-4 rounded-2xl border-[3px] border-ink bg-white px-6 py-4 shadow-hard-sm"
          >
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-bad">Watch out!</p>
              <p className="font-display text-[clamp(1rem,1.5vw,1.55rem)] font-bold">
                <span className="text-bad line-through decoration-[3px]">{c.watch.wrong}</span>
                <span className="mx-2 text-ink-soft">→</span>
                <span className="text-good">{c.watch.right}</span>
                <span className="ml-2 text-[0.75em] font-semibold text-ink-soft">({c.watch.note})</span>
              </p>
            </div>
          </div>
        </div>

        {/* right: demo + examples */}
        <div className="flex min-h-0 flex-col gap-[2vh]">
          <div
            data-reveal
            className="relative h-[46vh] shrink-0 rounded-[2rem] border-[3px] border-ink bg-white p-[clamp(0.9rem,1.6vw,1.6rem)] shadow-hard-lg"
          >
            <span
              className="absolute -top-4 right-6 rounded-full border-[3px] border-ink px-3 py-0.5 text-xs font-extrabold uppercase tracking-widest text-white"
              style={{ background: c.color }}
            >
              ▶ Live demo
            </span>
            <Demo active={active} color={c.color} />
          </div>
          <div className="flex flex-col gap-[1vh]">
            {c.examples.map((e) => (
              <p data-reveal key={e} className="text-[clamp(1rem,1.45vw,1.5rem)] font-semibold leading-snug">
                <span className="mr-2 text-ink-soft">›</span>
                <Highlight text={e} color={c.color} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export default function Categories() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);
  const total = categories.length + 1;

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".track")!;
      const panels = gsap.utils.toArray<HTMLElement>(".panel", track);
      const distance = () => track.scrollWidth - window.innerWidth;
      const sync = (self: ScrollTrigger) => {
        const i = Math.round(self.progress * (panels.length - 1));
        gsap.set(".tr-fill", { scaleX: self.progress });
        if (i !== activeRef.current) {
          activeRef.current = i;
          setActive(i);
        }
      };

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => sync(self),
          onToggle: (self) => {
            if (self.isActive) sync(self);
            else {
              activeRef.current = -1;
              setActive(-1);
            }
          },
        },
      });

      // parallax numbers inside each panel while the track moves
      panels.forEach((p) => {
        const num = p.querySelector(".p-bignum");
        if (!num) return;
        gsap.fromTo(
          num,
          { xPercent: 60, rotation: 8 },
          {
            xPercent: -60,
            rotation: -8,
            ease: "none",
            scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });

      const stopsFn = () => {
        const st = tween.scrollTrigger!;
        // +2px keeps the first stop safely inside the pinned range
        return panels.map((_, i) => st.start + 2 + ((st.end - st.start - 2) * i) / (panels.length - 1));
      };
      const unregister = registerStops("categories", stopsFn);

      // gentle snap to the nearest panel after free scrolling
      const onScrollEnd = () => {
        const st = tween.scrollTrigger!;
        const y = window.scrollY;
        if (y <= st.start + 2 || y >= st.end - 2) return;
        const stops = stopsFn();
        const nearest = stops.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
        if (Math.abs(nearest - y) > 3) getLenis()?.scrollTo(nearest, { duration: 0.7 });
      };
      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

      return () => {
        unregister();
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      };
    },
    { scope: root },
  );

  // entrance animation for the panel that just became active
  const titles = useRef<SplitText[]>([]);
  useGSAP(
    () => {
      titles.current = gsap.utils
        .toArray<HTMLElement>(".p-title", root.current)
        .map((t) => SplitText.create(t, { type: "chars", charsClass: "inline-block" }));
    },
    { scope: root },
  );

  useEffect(() => {
    if (active < 0) return;
    const panel = root.current!.querySelectorAll<HTMLElement>(".panel")[active];
    if (!panel) return;
    sfx.pop();
    const reveal = panel.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      reveal,
      { x: 140, opacity: 0, rotation: 2 },
      { x: 0, opacity: 1, rotation: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, overwrite: true },
    );
    const split = active > 0 ? titles.current[active - 1] : null;
    if (split) {
      gsap.fromTo(
        split.chars,
        { yPercent: 120, rotationX: -90, opacity: 0 },
        { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.8, ease: "back.out(2.2)", stagger: 0.035, overwrite: true },
      );
      gsap.fromTo(
        panel.querySelectorAll(".p-word"),
        { scale: 0, rotation: () => gsap.utils.random(-30, 30) },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(3)", stagger: 0.05, delay: 0.3, overwrite: true },
      );
    }
  }, [active]);

  const current = active > 0 ? categories[active - 1] : null;

  return (
    <section ref={root} id="materials" className="relative h-screen overflow-hidden">
      <div className="track flex h-full w-max will-change-transform">
        <TrailPanel active={active === 0} />
        {categories.map((c, i) => (
          <CategoryPanel key={c.key} c={c} active={active === i + 1} />
        ))}
      </div>

      {/* trail progress */}
      <div className="pointer-events-none absolute inset-x-[5vw] bottom-[2.2vh] flex items-center gap-3">
        <span className="font-display text-sm font-extrabold tabular-nums">
          {String(Math.max(active, 0)).padStart(2, "0")} / {String(total - 1).padStart(2, "0")}
        </span>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
          <div
            className="tr-fill absolute inset-0 origin-left scale-x-0 rounded-full transition-colors duration-500"
            style={{ background: current?.color ?? "#13294B" }}
          />
        </div>
        <span className="font-display text-sm font-extrabold" style={{ color: current?.color }}>
          {current?.title ?? "The Trail"}
        </span>
      </div>
    </section>
  );
}
