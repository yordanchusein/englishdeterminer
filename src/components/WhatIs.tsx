"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { categoryByKey } from "@/data/categories";

const SLOT = [
  { w: "The", cat: categoryByKey.articles },
  { w: "My", cat: categoryByKey.possessives },
  { w: "This", cat: categoryByKey.demonstratives },
  { w: "Every", cat: categoryByKey.distributives },
  { w: "One", cat: categoryByKey.numbers },
  { w: "That", cat: categoryByKey.demonstratives },
  { w: "No", cat: categoryByKey.quantifiers },
];

const QUESTIONS = [
  { q: "Which one?", a: ["the", "this", "that"], c: "#2B8CFF" },
  { q: "Whose?", a: ["my", "her", "their"], c: "#E6457A" },
  { q: "How many / how much?", a: ["some", "three", "every"], c: "#25A06B" },
];

export default function WhatIs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = SplitText.create(".w-title", { type: "words,chars", charsClass: "inline-block" });

      // looping sentence slot
      const loop = gsap.timeline({ paused: true, repeat: -1 });
      const words = gsap.utils.toArray<HTMLElement>(".w-slot-word");
      const labels = gsap.utils.toArray<HTMLElement>(".w-slot-label");
      loop.set([...words, ...labels], { autoAlpha: 0 });
      words.forEach((w, i) => {
        loop
          .fromTo(w, { autoAlpha: 1, yPercent: 110, rotationX: -90 }, { yPercent: 0, rotationX: 0, duration: 0.55, ease: "back.out(2.2)" })
          .fromTo(labels[i], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, "<0.15")
          .fromTo(".w-noun", { rotation: 0 }, { keyframes: { rotation: [4, -4, 2, 0] }, duration: 0.45, ease: "none" }, "<")
          .to({}, { duration: 1.2 })
          .to(w, { yPercent: -110, rotationX: 90, autoAlpha: 0, duration: 0.35, ease: "power2.in" })
          .to(labels[i], { autoAlpha: 0, y: -12, duration: 0.25 }, "<");
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        end: "bottom 20%",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });

      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%" } }).timeScale(1.5);
      tl.from(".w-eyebrow", { y: 30, opacity: 0, duration: 0.5, ease: "back.out(2)" })
        .from(title.chars, { yPercent: 120, rotation: 12, opacity: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.02 }, "<0.1")
        .from(".w-card", { x: -160, rotation: -6, opacity: 0, duration: 1, ease: "expo.out" }, "<0.3")
        .from(".w-def", { y: 40, opacity: 0, duration: 0.7, ease: "expo.out" }, "<0.1")
        .from(".w-q", { x: 140, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.12 }, "<0.1")
        .from(".w-q-chip", { scale: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.04 }, "<0.3")
        .from(".w-block", { y: -120, opacity: 0, rotation: () => gsap.utils.random(-25, 25), duration: 0.9, ease: "bounce.out", stagger: 0.14 }, "<0.2")
        .from(".w-plus", { scale: 0, rotation: -180, duration: 0.5, ease: "back.out(3)", stagger: 0.14 }, "<0.3")
        .from(".w-ex", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "<0.3")
        .from(".w-wrong", { x: 60, opacity: 0, duration: 0.6, ease: "expo.out" }, "<0.2")
        .fromTo(".w-strike", { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power3.inOut" });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="what"
      data-stop
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[linear-gradient(180deg,#2F7A55_0,#2F7A55_2px,#EAF7EC_2px,#FFF9EE_40%)] px-[6vw] py-[8vh]"
    >
      <span className="w-eyebrow mb-3 w-fit rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.3em] text-white">
        Lesson 00 · Base Camp
      </span>
      <h2 className="w-title mb-[3.5vh] font-display text-[clamp(2.4rem,5vw,5.2rem)] font-extrabold leading-[0.95] tracking-tight">
        What is a <span className="text-sky-deep">determiner</span>?
      </h2>

      <div className="grid items-stretch gap-[3vw] lg:grid-cols-[1.25fr_1fr]">
        {/* live sentence */}
        <div className="w-card relative flex flex-col justify-center rounded-[2rem] border-[3px] border-ink bg-white p-[clamp(1.2rem,2.6vw,2.6rem)] shadow-hard-lg">
          <span className="absolute -top-4 left-6 rounded-full border-[3px] border-ink bg-sun px-3 py-0.5 text-xs font-extrabold uppercase tracking-widest">
            Live sentence
          </span>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2 font-display text-[clamp(1.8rem,3vw,3.6rem)] font-extrabold leading-none">
            <span className="relative inline-block h-[1.15em] w-[3.3em] [perspective:600px]">
              {SLOT.map((s) => (
                <span
                  key={s.w}
                  className="w-slot-word invisible absolute inset-0 flex items-center justify-center rounded-2xl text-white"
                  style={{ background: s.cat.color }}
                >
                  {s.w}
                </span>
              ))}
            </span>
            <span className="w-noun inline-block rounded-2xl border-[3px] border-ink px-4 py-1.5">backpack</span>
            <span className="text-ink-soft">is heavy.</span>
          </div>
          <div className="relative mt-4 h-7">
            {SLOT.map((s) => (
              <span
                key={s.w}
                className="w-slot-label invisible absolute left-0 top-0 text-sm font-extrabold uppercase tracking-[0.2em]"
                style={{ color: s.cat.color }}
              >
                ↑ {s.cat.title.replace(/s$/, "")}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[clamp(0.95rem,1.2vw,1.2rem)] text-ink-soft">
            Same noun, different determiner → a different <b className="text-ink">meaning</b>.
          </p>
        </div>

        {/* definition */}
        <div className="flex flex-col justify-center gap-4">
          <p className="w-def text-[clamp(1.15rem,1.7vw,1.75rem)] font-medium leading-snug">
            A <b>determiner</b> is a word that comes <b>before a noun</b> to tell us:
          </p>
          {QUESTIONS.map((q) => (
            <div
              key={q.q}
              className="w-q flex items-center justify-between gap-3 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 shadow-hard-sm"
            >
              <span className="font-display text-[clamp(1.1rem,1.8vw,1.9rem)] font-extrabold" style={{ color: q.c }}>
                {q.q}
              </span>
              <span className="flex gap-1.5">
                {q.a.map((a) => (
                  <span key={a} className="w-q-chip rounded-lg px-2.5 py-0.5 text-sm font-bold text-white" style={{ background: q.c }}>
                    {a}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* formula */}
      <div className="mt-[5vh] flex flex-wrap items-center gap-x-[2vw] gap-y-4">
        <div className="flex items-center gap-3">
          {[
            { t: "Determiner", ex: "my", bg: "#FF7A45" },
            { t: "(Adjective)", ex: "heavy", bg: "#FFC83D" },
            { t: "Noun", ex: "backpack", bg: "#2B8CFF" },
          ].map((b, i) => (
            <div key={b.t} className="flex items-center gap-3">
              {i > 0 && <span className="w-plus font-display text-4xl font-extrabold">+</span>}
              <div className="w-block text-center">
                <div
                  className="rounded-2xl border-[3px] border-ink px-[clamp(0.8rem,1.4vw,1.5rem)] py-2 font-display text-[clamp(1rem,1.7vw,1.8rem)] font-extrabold text-ink shadow-hard-sm"
                  style={{ background: b.bg }}
                >
                  {b.t}
                </div>
                <div className="w-ex mt-1.5 font-display text-[clamp(1rem,1.5vw,1.5rem)] font-bold text-ink-soft">{b.ex}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-wrong ml-auto rounded-2xl border-[3px] border-dashed border-bad bg-white px-5 py-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-bad">One determiner only</p>
          <p className="font-display text-[clamp(1.1rem,1.6vw,1.7rem)] font-bold">
            <span className="relative text-bad">
              ✗ the my backpack
              <span className="w-strike absolute left-0 right-0 top-1/2 h-[3px] origin-left bg-bad" />
            </span>
            <span className="mx-3 text-ink-soft">→</span>
            <span className="text-good">✓ my backpack</span>
          </p>
        </div>
      </div>
    </section>
  );
}
