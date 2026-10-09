"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { methods } from "@/data/spldv";
import { ChapterTitle, Section } from "./Chapter";
import StepPlayer from "./StepPlayer";
import { Stars } from "./Scenery";
import Icon from "./Icons";

export default function Methods() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const m = methods[active];

  useGSAP(
    () => {
      gsap.fromTo(
        ".mt-board",
        { rotationY: -14, x: 40, opacity: 0 },
        { rotationY: 0, x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(".mt-idea", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.15 });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <Section id="mantra" className="bg-[linear-gradient(180deg,#0b231d_0%,#103529_100%)] text-parch">
      <Stars count={40} seed={21} className="opacity-60" />
      <ChapterTitle num="III" kicker="Buku Mantra" light title={<>Tiga Mantra Penyelesaian</>} />

      <div ref={root} className="relative grid gap-[3vw] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
        <div className="rv space-y-4">
          {methods.map((mm, i) => (
            <button
              key={mm.key}
              onClick={() => {
                if (i === active) return;
                sfx.page();
                setActive(i);
              }}
              className={`group flex w-full items-center gap-4 rounded-3xl border-[3px] border-quill p-4 text-left transition-all duration-300 ${
                i === active ? "translate-x-2 text-white" : "bg-[#123329] text-parch hover:translate-x-1"
              }`}
              style={{
                background: i === active ? mm.color : undefined,
                boxShadow: i === active ? `0 0 34px ${mm.color}88, 6px 6px 0 #06140f` : "6px 6px 0 #06140f",
              }}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-quill bg-parch text-3xl transition-transform group-hover:rotate-12">
                <Icon name={mm.icon} className="h-10 w-10" />
              </span>
              <span>
                <span className="block font-round text-xs font-black uppercase tracking-[0.25em] opacity-75">
                  Mantra {i + 1} · {mm.spell}
                </span>
                <span className="block font-tale text-[clamp(1.4rem,2vw,2.1rem)] font-black leading-tight">Metode {mm.name}</span>
              </span>
            </button>
          ))}

          <p
            key={m.key}
            className="mt-idea rounded-3xl border-2 border-dashed border-gold/60 p-4 font-tale text-[clamp(1.02rem,1.3vw,1.35rem)] leading-relaxed text-parch/90"
          >
            <b className="text-gold">Cara kerjanya: </b>
            {m.idea}
          </p>
        </div>

        <div className="rv [perspective:1400px]">
          <div
            key={m.key}
            className="mt-board relative h-[clamp(420px,62vh,640px)] rounded-[2rem] border-[3px] border-quill bg-parch p-[clamp(1rem,2vw,2rem)] text-quill shadow-[10px_10px_0_#06140f]"
          >
            <span
              className="absolute -top-5 right-6 rounded-full border-[3px] border-quill px-4 py-1 font-tale text-lg font-black text-white shadow-tale-sm"
              style={{ background: m.color }}
            >
              <Icon name={m.icon} className="mr-1 h-6 w-6" /> {m.name}
            </span>
            <StepPlayer steps={m.steps} color={m.color} size="lg" final="x = 22 dan y = 15" />
          </div>
        </div>
      </div>
    </Section>
  );
}
