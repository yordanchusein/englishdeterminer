"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Cloud } from "./Scenery";

// [left %, top %, width vw] — back layer is tinted and parts slower (depth)
const BACK: [number, number, number][] = [
  [-10, -8, 40], [26, -12, 38], [60, -6, 40],
  [-14, 30, 36], [70, 28, 38],
  [-8, 64, 40], [30, 70, 36], [64, 66, 40],
];
const FRONT: [number, number, number][] = [
  [-22, -18, 52], [44, -20, 56],
  [-26, 20, 46], [78, 14, 44],
  [-20, 58, 50], [74, 56, 46],
  [-10, 84, 56], [40, 86, 58],
];

const CAPTIONS = [
  "Packing the backpack…",
  "Checking the trail map…",
  "Lacing up the boots…",
  "Warming up at base camp…",
  "Ready to climb!",
];

const OUTLINE = "M8 170 L96 62 L132 104 L196 22 L312 170";
const TRAIL = "M44 170 C84 160 104 142 124 128 S162 112 170 90 S186 52 196 26";

/** Resolve once fonts, the load event and the main thread have settled. */
async function waitForCalm() {
  await document.fonts.ready;
  if (document.readyState !== "complete") {
    await new Promise((r) => window.addEventListener("load", r, { once: true }));
  }
  await new Promise((r) =>
    "requestIdleCallback" in window ? requestIdleCallback(() => r(null), { timeout: 1500 }) : setTimeout(r, 400),
  );
  // two painted frames, but never hang if the tab isn't painting
  await Promise.race([
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    new Promise((r) => setTimeout(r, 500)),
  ]);
}

export default function Preloader({ onReveal, onFinish }: { onReveal: () => void; onFinish: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const reveal = useRef(onReveal);
  const finish = useRef(onFinish);
  useEffect(() => {
    reveal.current = onReveal;
    finish.current = onFinish;
  });

  useGSAP(
    () => {
      const el = root.current!;
      const num = el.querySelector(".pl-num")!;
      const bar = el.querySelector(".pl-bar")!;
      const outline = el.querySelector<SVGPathElement>(".pl-outline")!;
      const trail = el.querySelector<SVGPathElement>(".pl-trail")!;
      const hiker = el.querySelector(".pl-hiker")!;
      const caps = gsap.utils.toArray<HTMLElement>(".pl-cap", el);
      const trailLen = trail.getTotalLength();
      const p = { v: 0 };
      let cap = 0;
      let cancelled = false;

      gsap.set(caps.slice(1), { autoAlpha: 0, y: 14 });
      gsap.set(".pl-flag", { scale: 0, transformOrigin: "0% 100%" });

      const render = () => {
        num.textContent = String(Math.round(p.v * 100));
        gsap.set(bar, { scaleX: p.v });
        outline.style.strokeDashoffset = String(1 - p.v);
        const pt = trail.getPointAtLength(trailLen * p.v);
        gsap.set(hiker, { x: pt.x, y: pt.y });
        const next = p.v >= 1 ? CAPTIONS.length - 1 : Math.min(CAPTIONS.length - 2, Math.floor(p.v * 4));
        if (next !== cap) {
          gsap.to(caps[cap], { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" });
          gsap.fromTo(caps[next], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.2 });
          cap = next;
        }
      };
      render();

      const drift = () =>
        gsap.to(".pl-cloud", {
          x: "random(-34, 34)",
          y: "random(-12, 12)",
          duration: "random(3.5, 5.5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });

      const vertical = (_: number, t: Element) => (Number((t as HTMLElement).dataset.top) < 35 ? -35 : 35);

      const tl = gsap
        .timeline({ paused: true, defaults: { force3D: true } })
        .fromTo(".pl-center", { y: 24, autoAlpha: 0.001 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" })
        .fromTo(".pl-hiker-dot", { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, "-=0.4")
        // three gentle "loading" stretches with short breaths in between
        .to(p, { v: 0.36, duration: 1.7, ease: "power2.inOut", onUpdate: render })
        .to(p, { v: 0.72, duration: 1.7, ease: "power2.inOut", onUpdate: render }, "+=0.3")
        .to(p, { v: 1, duration: 1.4, ease: "power2.inOut", onUpdate: render }, "+=0.3")
        .to(".pl-flag", { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.45)" }, "-=0.15")
        .to(".pl-hiker-dot", { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, "<")
        .to({}, { duration: 0.9 })
        // exit: centre lifts away, clouds part in two depths
        .addLabel("exit")
        .to(".pl-center", { autoAlpha: 0, y: -40, scale: 0.96, duration: 0.8, ease: "power2.in" }, "exit")
        .to(".pl-front-l", { xPercent: -210, yPercent: vertical, duration: 2, ease: "power3.inOut", stagger: 0.04 }, "exit+=0.35")
        .to(".pl-front-r", { xPercent: 210, yPercent: vertical, duration: 2, ease: "power3.inOut", stagger: 0.04 }, "exit+=0.35")
        .to(".pl-back-l", { xPercent: -170, yPercent: vertical, duration: 2.4, ease: "power3.inOut", stagger: 0.04 }, "exit+=0.5")
        .to(".pl-back-r", { xPercent: 170, yPercent: vertical, duration: 2.4, ease: "power3.inOut", stagger: 0.04 }, "exit+=0.5")
        .to(".pl-bg", { opacity: 0, duration: 1.6, ease: "power2.inOut" }, "exit+=0.8")
        .call(() => reveal.current(), [], "exit+=1.3")
        .call(() => finish.current());

      waitForCalm().then(() => {
        if (cancelled) return;
        // measure the page now, while nothing is moving, instead of mid-reveal
        ScrollTrigger.refresh();
        drift();
        tl.play();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  const clouds = (["back", "front"] as const).flatMap((layer) =>
    (layer === "back" ? BACK : FRONT).map(([l, t, w], i) => (
      <Cloud
        key={`${layer}${i}`}
        className={`pl-cloud absolute will-change-transform pl-${layer}-${l + w / 2 < 50 ? "l" : "r"}`}
        style={{ left: `${l}%`, top: `${t}%`, width: `${w}vw` }}
        data-top={t}
        fill={layer === "back" ? "#E4F2FF" : "#FFFFFF"}
      />
    )),
  );

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" aria-label="Loading">
      <div className="pl-bg absolute inset-0 bg-gradient-to-b from-[#b9e2ff] via-[#e3f4ff] to-[#fbfdff]" />
      {clouds}

      <div className="pl-center absolute inset-0 flex flex-col items-center justify-center text-ink">
        <p className="mb-12 text-xs font-extrabold uppercase tracking-[0.4em] text-ink-soft">Determiners · the climb</p>

        <svg viewBox="0 0 320 180" className="w-[clamp(240px,26vw,420px)] overflow-visible" aria-hidden>
          <path d="M0 170 H320" stroke="#13294B" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round" />
          <path d={OUTLINE} fill="none" stroke="#13294B" strokeOpacity="0.1" strokeWidth="5" strokeLinejoin="round" />
          <path
            className="pl-outline"
            d={OUTLINE}
            fill="none"
            stroke="#13294B"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <path className="pl-trail" d={TRAIL} fill="none" stroke="#2A8FE0" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
          <g transform="translate(196 22)">
            <g className="pl-flag">
              <line x1="0" y1="0" x2="0" y2="-34" stroke="#13294B" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 -34 L26 -26 L0 -18 Z" fill="#E6457A" stroke="#13294B" strokeWidth="3" strokeLinejoin="round" />
            </g>
          </g>
          <g className="pl-hiker" transform="translate(44 170)">
            <circle className="pl-hiker-dot" r="9" fill="#FFC83D" stroke="#13294B" strokeWidth="3" />
          </g>
        </svg>

        <div className="mt-6 font-display text-[clamp(4rem,11vw,10rem)] font-extrabold leading-none tabular-nums">
          <span className="pl-num">0</span>
          <span className="text-sky-deep">%</span>
        </div>
        <div className="mt-5 h-2 w-[clamp(220px,22vw,360px)] overflow-hidden rounded-full bg-ink/10">
          <div className="pl-bar h-full origin-left scale-x-0 rounded-full bg-ink" />
        </div>
        <div className="relative mt-5 h-8 w-full">
          {CAPTIONS.map((c) => (
            <p key={c} className="pl-cap absolute inset-x-0 text-center font-display text-[clamp(1.1rem,1.6vw,1.6rem)] font-bold">
              {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
