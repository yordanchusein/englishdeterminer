"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Sparkle, Stars } from "./Scenery";

const CAPTIONS = [
  "Meniup debu dari buku tua…",
  "Menyalakan kunang-kunang…",
  "Membangunkan Peri x dan Naga y…",
  "Menyibak jalan setapak hutan…",
  "Pada zaman dahulu kala…",
];

const LEAVES = ["x + y = ?", "x − y = ?", "ax + by = c"];

/** Resolve once fonts, the load event and the main thread have settled. */
async function waitForCalm() {
  await document.fonts.ready;
  if (document.readyState !== "complete") {
    await new Promise((r) => window.addEventListener("load", r, { once: true }));
  }
  await new Promise((r) =>
    "requestIdleCallback" in window ? requestIdleCallback(() => r(null), { timeout: 1500 }) : setTimeout(r, 400),
  );
  await Promise.race([
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    new Promise((r) => setTimeout(r, 500)),
  ]);
}

export default function BookLoader({ onReveal, onFinish }: { onReveal: () => void; onFinish: () => void }) {
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
      const num = el.querySelector(".bl-num")!;
      const bar = el.querySelector(".bl-bar")!;
      const caps = gsap.utils.toArray<HTMLElement>(".bl-cap", el);
      const leaves = gsap.utils.toArray<HTMLElement>(".bl-leaf", el);
      const p = { v: 0 };
      let cap = 0;
      let cancelled = false;

      gsap.set(caps.slice(1), { autoAlpha: 0, y: 14 });
      gsap.set(".bl-book", { xPercent: -25 });

      const render = () => {
        num.textContent = String(Math.round(p.v * 100));
        gsap.set(bar, { scaleX: p.v });
        const next = p.v >= 1 ? CAPTIONS.length - 1 : Math.min(CAPTIONS.length - 2, Math.floor(p.v * 4));
        if (next !== cap) {
          gsap.to(caps[cap], { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" });
          gsap.fromTo(caps[next], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.2 });
          cap = next;
        }
      };
      render();

      gsap.to(".bl-spark", {
        scale: "random(0.6, 1.3)",
        rotation: "random(-90, 90)",
        opacity: "random(0.4, 1)",
        duration: "random(0.8, 1.6)",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: "sine.inOut",
      });

      // one-sided leaves: swap to the ruled “back” at the halfway point
      const flip = (i: number) =>
        gsap
          .timeline({ onStart: () => leaves[i]?.style.setProperty("z-index", String(30 + i)) })
          .to(leaves[i], { rotationY: -90, duration: 0.45, ease: "power2.in" })
          .add(() => leaves[i]?.classList.add("is-back"))
          .to(leaves[i], { rotationY: -178, duration: 0.45, ease: "power2.out" });

      const tl = gsap
        .timeline({ paused: true })
        .fromTo(".bl-center", { y: 30, autoAlpha: 0.001 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" })
        .fromTo(".bl-book", { scale: 0.6, rotation: -8 }, { scale: 1, rotation: 0, duration: 1.1, ease: "back.out(1.8)" }, 0)
        // the cover swings open and the book slides to the centre
        .to(".bl-cover", { rotationY: -178, duration: 1.1, ease: "power3.inOut" })
        .to(".bl-book", { xPercent: 0, duration: 1.1, ease: "power3.inOut" }, "<")
        .to(p, { v: 0.34, duration: 1.1, ease: "power2.inOut", onUpdate: render }, "<0.3")
        .add(flip(0), "+=0.1")
        .to(p, { v: 0.68, duration: 1, ease: "power2.inOut", onUpdate: render }, "<")
        .add(flip(1), "+=0.1")
        .to(p, { v: 1, duration: 0.9, ease: "power2.inOut", onUpdate: render }, "<")
        .add(flip(2), "-=0.3")
        .fromTo(".bl-title", { scale: 0, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(3)" }, "-=0.3")
        .to({}, { duration: 0.5 })
        // exit: dive into the book
        .addLabel("exit")
        .to([".bl-caption", ".bl-meter"], { autoAlpha: 0, y: 20, duration: 0.5, ease: "power2.in" }, "exit")
        .to(".bl-book", { scale: 9, y: "18vh", duration: 1.6, ease: "power3.in" }, "exit+=0.2")
        .to(".bl-bg", { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "exit+=1.05")
        .to(".bl-book", { opacity: 0, duration: 0.5 }, "exit+=1.3")
        .call(() => reveal.current(), [], "exit+=1.2")
        .call(() => finish.current());

      waitForCalm().then(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        tl.play();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" aria-label="Memuat">
      <div className="bl-bg tale-night absolute inset-0">
        <Stars count={60} seed={3} />
      </div>

      <div className="bl-center absolute inset-0 flex flex-col items-center justify-center text-parch">
        <p className="mb-10 font-round text-xs font-extrabold uppercase tracking-[0.4em] text-parch/70">
          Hutan Dongeng · SPLDV
        </p>

        {/* book: left half = inside of cover once opened, right half = pages */}
        <div className="bl-book relative h-[clamp(170px,19vw,300px)] w-[clamp(260px,29vw,460px)] [perspective:1600px]">
          <Sparkle className="bl-spark absolute -left-8 -top-8 w-8" />
          <Sparkle className="bl-spark absolute -right-6 top-6 w-6" fill="#ff7eb3" />
          <Sparkle className="bl-spark absolute -bottom-6 left-1/3 w-7" fill="#7be0d4" />

          {/* page block */}
          <div className="absolute inset-y-0 left-1/2 right-0 rounded-r-lg border-[3px] border-quill bg-parch shadow-[6px_6px_0_#06140f]">
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-quill">
              <span className="bl-title font-tale text-[clamp(1.4rem,2.4vw,2.4rem)] font-black leading-none">SPLDV</span>
              <span className="font-round text-[clamp(0.6rem,0.75vw,0.8rem)] font-extrabold uppercase tracking-[0.2em] text-quill-soft">
                Bab Pertama
              </span>
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 right-1/2 rounded-l-lg border-[3px] border-quill bg-parch-deep" />

          {LEAVES.map((t, i) => (
            <div
              key={t}
              className="bl-leaf group absolute inset-y-[3px] left-1/2 right-[3px] flex origin-left items-center justify-center rounded-r-md border-l border-quill/20 bg-[#fff8e8] font-tale text-[clamp(1rem,1.6vw,1.6rem)] font-black italic text-quill [&.is-back]:bg-[#f6e8c8] [&.is-back]:bg-[repeating-linear-gradient(180deg,transparent_0_14px,rgba(43,29,79,0.12)_14px_16px)]"
              style={{ zIndex: 5 - i }}
            >
              <span className="group-[.is-back]:hidden">{t}</span>
            </div>
          ))}

          {/* cover */}
          <div className="bl-cover flip-inner absolute inset-0 left-1/2 z-20 origin-left">
            <div className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-r-lg border-[3px] border-quill bg-[linear-gradient(135deg,#2f744b,#17402f)] text-gold shadow-[6px_6px_0_#06140f]">
              <div className="absolute inset-2 rounded-md border-2 border-dashed border-gold/60" />
              <span className="text-[clamp(1.6rem,2.6vw,2.6rem)]">🌳</span>
              <span className="mt-1 font-tale text-[clamp(0.9rem,1.4vw,1.4rem)] font-black">Kisah Dua</span>
              <span className="font-tale text-[clamp(0.9rem,1.4vw,1.4rem)] font-black">Variabel</span>
            </div>
            <div className="flip-face flip-back absolute inset-0 rounded-l-lg border-[3px] border-quill bg-[#22553b]" />
          </div>
        </div>

        <div className="bl-meter mt-10 flex flex-col items-center">
          <div className="font-tale text-[clamp(3rem,7vw,6.5rem)] font-black leading-none tabular-nums">
            <span className="bl-num">0</span>
            <span className="text-gold">%</span>
          </div>
          <div className="mt-4 h-2 w-[clamp(220px,22vw,360px)] overflow-hidden rounded-full bg-white/15">
            <div className="bl-bar h-full origin-left scale-x-0 rounded-full bg-gold" />
          </div>
        </div>
        <div className="bl-caption relative mt-5 h-8 w-full">
          {CAPTIONS.map((c) => (
            <p key={c} className="bl-cap absolute inset-x-0 text-center font-tale text-[clamp(1.1rem,1.6vw,1.6rem)] font-bold italic">
              {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
