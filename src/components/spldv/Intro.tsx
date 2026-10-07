"use client";

import { useState } from "react";
import { sfx } from "@/lib/sound";
import { ChapterTitle, Section } from "./Chapter";
import Eq from "./Eq";
import { DragonY, FairyX, Mushroom } from "./Scenery";

type Coef = "a" | "b" | "c" | "p" | "q" | "r";

const GENERAL: { k: Coef | null; t: string }[][] = [
  [{ k: "a", t: "a" }, { k: null, t: "x + " }, { k: "b", t: "b" }, { k: null, t: "y = " }, { k: "c", t: "c" }],
  [{ k: "p", t: "p" }, { k: null, t: "x + " }, { k: "q", t: "q" }, { k: null, t: "y = " }, { k: "r", t: "r" }],
];
const EXAMPLE: { k: Coef | null; t: string }[][] = [
  [{ k: "a", t: "2" }, { k: null, t: "x + " }, { k: "b", t: "3" }, { k: null, t: "y = " }, { k: "c", t: "19" }],
  [{ k: "p", t: "3" }, { k: null, t: "x + " }, { k: "q", t: "2" }, { k: null, t: "y = " }, { k: "r", t: "21" }],
];
const COEF_COLOR: Record<Coef, string> = {
  a: "#e8478f",
  b: "#129e94",
  c: "#d99a1e",
  p: "#e8478f",
  q: "#129e94",
  r: "#d99a1e",
};
const COEF_HINT: Record<Coef, string> = {
  a: "a = koefisien x pada persamaan pertama",
  b: "b = koefisien y pada persamaan pertama",
  c: "c = konstanta (hasil) persamaan pertama",
  p: "p = koefisien x pada persamaan kedua",
  q: "q = koefisien y pada persamaan kedua",
  r: "r = konstanta (hasil) persamaan kedua",
};

function Row({ row, active, onHover }: { row: { k: Coef | null; t: string }[]; active: Coef | null; onHover: (k: Coef | null) => void }) {
  return (
    <div className="font-round text-[clamp(1.5rem,2.6vw,2.8rem)] font-black italic tabular-nums">
      {row.map((c, i) => {
        if (!c.k) {
          const parts = c.t.split(/([xy])/);
          return (
            <span key={i}>
              {parts.map((p, j) => (
                <span key={j} className={p === "x" ? "vx" : p === "y" ? "vy" : ""}>
                  {p}
                </span>
              ))}
            </span>
          );
        }
        const on = active === c.k;
        return (
          <button
            key={i}
            onMouseEnter={() => {
              onHover(c.k);
              sfx.tick();
            }}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(c.k)}
            onBlur={() => onHover(null)}
            className="mx-0.5 inline-block rounded-lg px-1.5 transition-all duration-200"
            style={{
              background: on ? COEF_COLOR[c.k] : "transparent",
              color: on ? "#fff" : "#22301e",
              transform: on ? "translateY(-4px) scale(1.15)" : "none",
              outline: on ? "none" : "2px dashed rgba(43,29,79,0.25)",
            }}
          >
            {c.t}
          </button>
        );
      })}
    </div>
  );
}

export default function Intro() {
  const [active, setActive] = useState<Coef | null>(null);

  return (
    <Section id="mengenal" className="tale-parch">
      <Mushroom className="pointer-events-none absolute bottom-6 left-[3%] w-14 opacity-90" />
      <Mushroom className="pointer-events-none absolute bottom-4 left-[7%] w-9 opacity-90" />

      <ChapterTitle num="I" kicker="Prolog" title={<>Mengenal SPLDV</>} />

      <div className="grid gap-[4vw] lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-6">
          <p className="rv max-w-[60ch] font-tale text-[clamp(1.1rem,1.5vw,1.55rem)] leading-relaxed text-quill">
            Jauh di dalam Hutan Dua Variabel hiduplah dua makhluk ajaib yang suka bersembunyi:{" "}
            <b className="vx not-italic">Peri x</b> dan <b className="vy not-italic">Naga y</b>. Burung Hantu Bijak 🦉 memberi kita{" "}
            <b>dua petunjuk</b>. Hanya dengan memakai <i>keduanya</i>, kita bisa menemukan mereka.
          </p>

          <div className="rv relative rounded-3xl border-[3px] border-quill bg-white p-6 shadow-tale">
            <span className="absolute -top-4 left-6 rounded-full border-[3px] border-quill bg-violet px-3 py-0.5 font-round text-xs font-black uppercase tracking-widest text-white">
              Definisi
            </span>
            <p className="font-tale text-[clamp(1.2rem,1.8vw,1.9rem)] font-bold leading-snug">
              SPLDV terdiri atas <span className="eq-hl">dua persamaan linear</span> dengan{" "}
              <span className="eq-hl">dua variabel</span>.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="font-round text-sm font-extrabold text-quill-soft">Contoh:</span>
              <span className="rounded-xl border-2 border-quill bg-parch px-3 py-1 text-[clamp(1.2rem,1.7vw,1.8rem)]">
                <Eq text="x + y = 37" />
              </span>
              <span className="font-tale font-bold italic">dan</span>
              <span className="rounded-xl border-2 border-quill bg-parch px-3 py-1 text-[clamp(1.2rem,1.7vw,1.8rem)]">
                <Eq text="x − y = 7" />
              </span>
            </div>
            <p className="mt-4 font-round font-bold text-quill-soft">
              Variabelnya adalah <span className="vx">x</span> dan <span className="vy">y</span>.
            </p>
          </div>

          <div className="rv flex items-center gap-4 rounded-3xl border-[3px] border-quill bg-gold p-5 shadow-tale">
            <div className="flex shrink-0 -space-x-4">
              <FairyX className="w-16" />
              <DragonY className="w-16" />
            </div>
            <p className="font-tale text-[clamp(1.05rem,1.45vw,1.5rem)] font-bold leading-snug">
              Tujuan kita: mencari nilai <span className="vx">x</span> dan <span className="vy">y</span> yang memenuhi{" "}
              <u className="decoration-[3px] underline-offset-4">kedua persamaan sekaligus</u>.
            </p>
          </div>
        </div>

        <div className="rv">
          <div className="relative rounded-[2rem] border-[3px] border-quill bg-[linear-gradient(160deg,#fff,#eef7e4)] p-[clamp(1.2rem,2.4vw,2.4rem)] shadow-tale-lg">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-[3px] border-quill bg-rose px-5 py-1 font-tale text-lg font-black text-white shadow-tale-sm">
              📜 Bentuk Umum
            </span>
            <div className="mt-3 space-y-1 text-center">
              {GENERAL.map((row, i) => (
                <Row key={i} row={row} active={active} onHover={setActive} />
              ))}
              <p className="pt-2 font-round text-sm font-bold text-quill-soft">
                dengan <span className="vx">x</span> dan <span className="vy">y</span> sebagai variabel
              </p>
            </div>

            <div className="my-6 flex items-center gap-3 text-quill-soft">
              <div className="h-[2px] flex-1 bg-quill/20" />
              <span className="font-round text-xs font-black uppercase tracking-[0.3em]">contoh</span>
              <div className="h-[2px] flex-1 bg-quill/20" />
            </div>

            <div className="space-y-1 text-center">
              {EXAMPLE.map((row, i) => (
                <Row key={i} row={row} active={active} onHover={setActive} />
              ))}
            </div>

            <p
              className="mt-6 min-h-[3.2em] rounded-2xl border-2 border-dashed px-4 py-3 text-center font-round font-extrabold transition-colors"
              style={{
                borderColor: active ? COEF_COLOR[active] : "rgba(43,29,79,0.25)",
                color: active ? COEF_COLOR[active] : "#56684a",
              }}
            >
              {active ? COEF_HINT[active] : "✨ Arahkan tongkat (kursor) ke huruf atau angka bergaris putus-putus"}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
