"use client";

import { useRef, useState, type PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { ChapterTitle, Section } from "./Chapter";
import { DragonY, FairyX, Sparkle } from "./Scenery";

const MAX = 40;
const PAD = 44;
const SIZE = 460;
const S = (SIZE - PAD - 16) / MAX;
const px = (x: number) => PAD + x * S;
const py = (y: number) => SIZE - PAD - y * S;

const TARGET = { x: 22, y: 15 };

export default function Playground() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [x, setX] = useState(10);
  const [y, setY] = useState(30);
  const [hint, setHint] = useState(false);
  const [found, setFound] = useState(false);
  const dragging = useRef(false);
  const pos = useRef({ x: 10, y: 30 });

  const ok1 = x + y === 37;
  const ok2 = x - y === 7;
  const solved = ok1 && ok2;

  const { contextSafe } = useGSAP({ scope: root });

  const celebrate = contextSafe(() => {
    sfx.fanfare();
    burstFrom(root.current!.querySelector(".pg-point"), 90);
    burstFrom(root.current!.querySelector(".pg-lantern-1"), 40);
    burstFrom(root.current!.querySelector(".pg-lantern-2"), 40);
    gsap.fromTo(".pg-win", { scale: 0, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2.4)" });
    gsap.fromTo(".pg-point-star", { scale: 1 }, { scale: 2.2, duration: 0.3, yoyo: true, repeat: 3, transformOrigin: "50% 50%" });
  });

  const lanternPing = contextSafe((which: 1 | 2) => {
    sfx.sparkle();
    gsap.fromTo(`.pg-lantern-${which}`, { scale: 1 }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1 });
  });

  const update = (nx: number, ny: number) => {
    nx = Math.max(0, Math.min(MAX, Math.round(nx)));
    ny = Math.max(0, Math.min(MAX, Math.round(ny)));
    const { x: ox, y: oy } = pos.current;
    if (nx === ox && ny === oy) return;
    pos.current = { x: nx, y: ny };
    const was1 = ox + oy === 37;
    const was2 = ox - oy === 7;
    const now1 = nx + ny === 37;
    const now2 = nx - ny === 7;
    setX(nx);
    setY(ny);
    if (now1 && now2) {
      setFound(true);
      requestAnimationFrame(() => celebrate());
    } else {
      if (now1 && !was1) lanternPing(1);
      if (now2 && !was2) lanternPing(2);
      if (!now1 && !now2) sfx.tick();
    }
  };

  const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const el = svg.current!;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(el.getScreenCTM()!.inverse());
    update((p.x - PAD) / S, (SIZE - PAD - p.y) / S);
  };

  const showAnswer = contextSafe(() => {
    const o = { ...pos.current };
    gsap.to(o, {
      x: TARGET.x,
      y: TARGET.y,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => update(o.x, o.y),
    });
  });

  return (
    <Section id="coba" className="bg-[linear-gradient(180deg,#103529_0%,#17402f_60%,#22553b_100%)] text-parch">
      <ChapterTitle num="I" kicker="Coba sendiri" light title={<>Cermin Ajaib: Temukan Peri &amp; Naga</>} />

      <div ref={root} className="grid items-center gap-[4vw] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* graph */}
        <div className="rv relative mx-auto w-full max-w-[min(560px,72vh)]">
          <svg
            ref={svg}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full touch-none select-none rounded-[2rem] border-[3px] border-quill bg-parch shadow-[10px_10px_0_#06140f]"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              fromPointer(e);
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            role="img"
            aria-label="Grafik dua garis: x + y = 37 dan x − y = 7"
          >
            {/* grid */}
            {Array.from({ length: MAX / 5 + 1 }).map((_, i) => (
              <g key={i}>
                <line x1={px(i * 5)} y1={py(0)} x2={px(i * 5)} y2={py(MAX)} stroke="#22301e" strokeOpacity={0.1} strokeWidth={1.5} />
                <line x1={px(0)} y1={py(i * 5)} x2={px(MAX)} y2={py(i * 5)} stroke="#22301e" strokeOpacity={0.1} strokeWidth={1.5} />
                <text x={px(i * 5)} y={py(0) + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill="#56684a">
                  {i * 5}
                </text>
                {i > 0 && (
                  <text x={px(0) - 10} y={py(i * 5) + 5} textAnchor="end" fontSize="13" fontWeight="800" fill="#56684a">
                    {i * 5}
                  </text>
                )}
              </g>
            ))}
            <line x1={px(0)} y1={py(0)} x2={px(MAX)} y2={py(0)} stroke="#22301e" strokeWidth={3} />
            <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(MAX)} stroke="#22301e" strokeWidth={3} />
            <text x={px(MAX) - 4} y={py(0) - 8} textAnchor="end" fontSize="20" fontWeight="900" fontStyle="italic" fill="#e8478f">
              x
            </text>
            <text x={px(0) + 10} y={py(MAX) + 16} fontSize="20" fontWeight="900" fontStyle="italic" fill="#129e94">
              y
            </text>

            {/* the two clues as lines */}
            <line
              x1={px(0)}
              y1={py(37)}
              x2={px(37)}
              y2={py(0)}
              stroke="#e8478f"
              strokeWidth={ok1 ? 7 : 4}
              strokeLinecap="round"
              opacity={ok1 ? 1 : 0.55}
              style={{ transition: "all .3s" }}
            />
            <line
              x1={px(7)}
              y1={py(0)}
              x2={px(40)}
              y2={py(33)}
              stroke="#129e94"
              strokeWidth={ok2 ? 7 : 4}
              strokeLinecap="round"
              opacity={ok2 ? 1 : 0.55}
              style={{ transition: "all .3s" }}
            />
            <text x={px(2)} y={py(37) - 8} fontSize="15" fontWeight="900" fill="#e8478f">
              x + y = 37
            </text>
            <text x={px(40)} y={py(33) - 10} textAnchor="end" fontSize="15" fontWeight="900" fill="#129e94">
              x − y = 7
            </text>

            {/* guides */}
            <line x1={px(x)} y1={py(0)} x2={px(x)} y2={py(y)} stroke="#e8478f" strokeDasharray="4 5" strokeWidth={2} />
            <line x1={px(0)} y1={py(y)} x2={px(x)} y2={py(y)} stroke="#129e94" strokeDasharray="4 5" strokeWidth={2} />

            {/* the magic point */}
            <g className="pg-point" transform={`translate(${px(x)} ${py(y)})`} style={{ cursor: "grab" }}>
              <circle r={solved ? 22 : 16} fill="#f7c548" opacity={0.35} />
              <g className="pg-point-star">
                <path d="M0 -15 C2 -4 4 -2 15 0 C4 2 2 4 0 15 C-2 4 -4 2 -15 0 C-4 -2 -2 -4 0 -15Z" fill="#f7c548" stroke="#22301e" strokeWidth={2.5} />
              </g>
              <g transform={`translate(${x > 30 ? -96 : 14} ${y > 34 ? 18 : -34})`}>
                <rect width="82" height="26" rx="8" fill="#22301e" />
                <text x="41" y="18" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">
                  ({x}, {y})
                </text>
              </g>
            </g>
          </svg>
          <p className="mt-3 text-center font-round text-sm font-bold text-parch/70">
            ✋ Seret bintang di grafik, atau pakai penggeser di samping
          </p>
        </div>

        {/* controls */}
        <div className="space-y-5">
          <p className="rv font-tale text-[clamp(1.05rem,1.4vw,1.45rem)] leading-relaxed text-parch/90">
            Setiap petunjuk adalah sebuah <b className="text-gold">garis</b>. Geser nilai{" "}
            <span className="font-black italic text-rose">x</span> dan <span className="font-black italic text-[#7be0d4]">y</span>{" "}
            sampai <b>kedua lentera</b> menyala.
          </p>

          <div className="rv space-y-4 rounded-3xl border-[3px] border-quill bg-parch p-5 text-quill shadow-[6px_6px_0_#06140f]">
            {(
              [
                ["x", x, (v: number) => update(v, y), "#e8478f", FairyX],
                ["y", y, (v: number) => update(x, v), "#129e94", DragonY],
              ] as const
            ).map(([name, val, set, color, Char]) => (
              <label key={name} className="flex items-center gap-4">
                <Char className="w-12 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={MAX}
                  value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="tale-range flex-1"
                  style={{ ["--thumb" as string]: color }}
                  aria-label={`Nilai ${name}`}
                />
                <span className="w-24 text-right font-round text-2xl font-black italic tabular-nums" style={{ color }}>
                  {name} = {val}
                </span>
              </label>
            ))}
          </div>

          <div className="rv grid gap-4 sm:grid-cols-2">
            {[
              { n: 1 as const, ok: ok1, left: `${x} + ${y}`, val: x + y, goal: 37, label: "x + y = 37", color: "#e8478f" },
              { n: 2 as const, ok: ok2, left: `${x} − ${y}`, val: x - y, goal: 7, label: "x − y = 7", color: "#129e94" },
            ].map((l) => (
              <div
                key={l.n}
                className={`pg-lantern-${l.n} relative rounded-3xl border-[3px] border-quill p-4 text-center transition-all duration-300`}
                style={{
                  background: l.ok ? "#f7c548" : "#123329",
                  color: l.ok ? "#22301e" : "#fbf1dc",
                  boxShadow: l.ok ? "0 0 40px 6px rgba(247,197,72,0.6), 6px 6px 0 #06140f" : "6px 6px 0 #06140f",
                }}
              >
                <div className="text-3xl">{l.ok ? "🏮" : "🕯️"}</div>
                <div className="mt-1 font-round text-xs font-black uppercase tracking-[0.25em] opacity-70">Petunjuk {l.n}</div>
                <div className="font-round text-xl font-black italic" style={{ color: l.ok ? "#22301e" : l.color }}>
                  {l.label}
                </div>
                <div className="mt-2 font-round text-2xl font-black tabular-nums">
                  {l.left} = {l.val} {l.ok ? "✓" : `≠ ${l.goal}`}
                </div>
              </div>
            ))}
          </div>

          <div className="rv flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sfx.sparkle();
                setHint((h) => !h);
              }}
              className="rounded-2xl border-[3px] border-quill bg-white px-4 py-2 font-tale font-black text-quill shadow-[3px_3px_0_#06140f] transition-transform hover:-translate-y-0.5"
            >
              🔮 Bisikkan petunjuk
            </button>
            <button
              onClick={showAnswer}
              className="rounded-2xl border-[3px] border-quill bg-rose px-4 py-2 font-tale font-black text-white shadow-[3px_3px_0_#06140f] transition-transform hover:-translate-y-0.5"
            >
              ✨ Tunjukkan jawaban
            </button>
          </div>
          {hint && (
            <p className="rounded-2xl border-2 border-dashed border-gold/70 px-4 py-3 font-round font-bold text-parch/90">
              Bintang harus berada di <b className="text-gold">kedua garis sekaligus</b>. Cari pasangan yang jumlahnya 37 <i>dan</i>{" "}
              selisihnya 7. Coba mulai dari x = 20…
            </p>
          )}

          <div
            className="pg-win flex items-center gap-4 rounded-3xl border-[3px] border-quill bg-gold p-5 text-quill shadow-[6px_6px_0_#06140f]"
            style={{ transform: found ? undefined : "scale(0)", visibility: found ? "visible" : "hidden" }}
          >
            <Sparkle className="w-10 shrink-0" fill="#e8478f" />
            <p className="font-tale text-[clamp(1.05rem,1.4vw,1.45rem)] font-bold leading-snug">
              Ketemu! <span className="vx">x = 22</span>, <span className="vy">y = 15</span>. Penyelesaian SPLDV adalah{" "}
              <u className="decoration-[3px] underline-offset-4">titik potong</u> kedua garis.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
