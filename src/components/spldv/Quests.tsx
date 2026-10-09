"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP } from "@/lib/gsap-lite";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { quests, type Quest } from "@/data/spldv";
import { ChapterTitle, Section } from "./Chapter";
import StepPlayer from "./StepPlayer";
import { Pine, Sparkle } from "./Scenery";
import Icon from "./Icons";
import { ambient } from "./ambient";

const parse = (s: string) => Number(s.replace(/rp|m²|m2|tahun|\s|\./gi, "").replace(",", "."));

/* ─── one quest, opened as a storybook spread ───────────── */
function QuestModal({ q, num, onClose, onSolved }: { q: Quest; num: number; onClose: () => void; onSolved: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<string[]>(() => q.fields.map(() => ""));
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [open, setOpen] = useState(false);
  const allRight = checked?.every(Boolean) ?? false;

  const { contextSafe } = useGSAP(
    () => {
      const previous = document.activeElement;
      gsap
        .timeline()
        .fromTo(".qm-veil", { opacity: 0 }, { opacity: 1, duration: 0.35 })
        .fromTo(
          ".qm-book",
          { scale: 0.5, rotationX: 40, y: 120, opacity: 0 },
          { scale: 1, rotationX: 0, y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" },
          0.05,
        )
        .fromTo(".qm-in", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" }, "-=0.35");
      root.current!.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
      return () => {
        if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
      };
    },
    { scope: root },
  );

  const close = contextSafe(() => {
    sfx.whoosh();
    gsap
      .timeline({ onComplete: onClose })
      .to(".qm-book", { scale: 0.6, y: 80, opacity: 0, duration: 0.4, ease: "power3.in" })
      .to(".qm-veil", { opacity: 0, duration: 0.25 }, "-=0.15");
  });

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab") return;
      const controls = Array.from(root.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input, [tabindex='0']") ?? []).filter((el) => el.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => {
      window.removeEventListener("keydown", h);
    };
  }, [close]);

  const check = contextSafe(() => {
    const res = q.fields.map((f, i) => parse(values[i]) === f.answer);
    setChecked(res);
    if (res.every(Boolean)) {
      sfx.correct();
      burstFrom(root.current!.querySelector(".qm-check"), 90);
      onSolved();
      gsap.fromTo(".qm-badge", { scale: 0, rotation: -40 }, { scale: 1, rotation: -8, duration: 0.6, ease: "back.out(3)" });
    } else {
      sfx.wrong();
      gsap.fromTo(".qm-book", { x: 0 }, { keyframes: { x: [-14, 12, -8, 5, 0] }, duration: 0.45 });
    }
  });

  const reveal = () => {
    sfx.page();
    setOpen(true);
  };

  return (
    <div ref={root} className="fixed inset-0 z-[70] flex items-center justify-center p-[3vw]" role="dialog" aria-modal aria-label={q.type}>
      <div className="qm-veil absolute inset-0 bg-[#06140f]/80 backdrop-blur-sm" onClick={close} />
      <div data-lenis-prevent className="qm-book relative grid max-h-[90dvh] w-full max-w-[1280px] overflow-y-auto overscroll-contain rounded-[2rem] border-[4px] border-quill bg-parch text-quill shadow-[12px_12px_0_#06140f] lg:grid-cols-2">
        {/* left page: the quest */}
        <div data-lenis-prevent className="relative overflow-y-auto border-quill/20 p-[clamp(1.2rem,2.4vw,2.6rem)] lg:border-r-[3px] lg:border-dashed">
          <div className="qm-in flex items-center gap-3 pr-12">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-quill text-3xl shadow-tale-sm"
              style={{ background: q.color }}
            >
              <Icon name={q.icon} className="h-10 w-10" />
            </span>
            <div>
              <p className="font-round text-xs font-black uppercase tracking-[0.25em] text-quill-soft">
                Misi {num} · {q.place}
              </p>
              <h3 className="font-tale text-[clamp(1.5rem,2.3vw,2.4rem)] font-black leading-tight">{q.type}</h3>
            </div>
          </div>

          <p className="qm-in mt-5 rounded-2xl border-[3px] border-quill bg-white p-4 font-tale text-[clamp(1.1rem,1.45vw,1.5rem)] font-semibold leading-relaxed shadow-tale-sm">
            {q.story}
          </p>

          <div className="qm-in mt-4 flex flex-wrap gap-2">
            <span className="font-round text-sm font-black text-quill-soft"><Icon name="tag" className="mr-1 h-5 w-5" />Misalkan:</span>
            {q.let.map((l, i) => (
              <span
                key={l}
                className="rounded-full border-2 border-quill bg-parch-deep px-3 py-0.5 font-round text-sm font-extrabold"
                style={{ color: i === 0 ? "#e8478f" : "#129e94" }}
              >
                {l}
              </span>
            ))}
          </div>

          <form
            className="qm-in mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              check();
            }}
          >
            <p className="font-round text-sm font-black uppercase tracking-[0.2em] text-quill-soft"><Icon name="quill" className="mr-1 h-5 w-5" />Jawabanmu</p>
            {q.fields.map((f, i) => {
              const state = checked ? (checked[i] ? "ok" : "bad") : null;
              return (
                <label key={f.label} className="flex flex-wrap items-center gap-3">
                  <span className="min-w-[11rem] font-tale text-lg font-bold">{f.label}</span>
                  <span className="flex items-center gap-2">
                    {f.unit === "Rp" && <span className="font-round font-black">Rp</span>}
                    <input
                      inputMode="numeric"
                      value={values[i]}
                      onChange={(e) => {
                        setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)));
                        setChecked(null);
                      }}
                      className={`w-40 rounded-xl border-[3px] px-3 py-2 font-round text-xl font-black tabular-nums outline-none transition-colors focus:ring-4 focus:ring-gold/50 ${
                        state === "ok" ? "border-good bg-good/10" : state === "bad" ? "border-bad bg-bad/10" : "border-quill bg-white"
                      }`}
                      placeholder="?"
                    />
                    {f.unit && f.unit !== "Rp" && <span className="font-round font-black">{f.unit}</span>}
                    {state && <Icon name={state === "ok" ? "check" : "cross"} className="h-8 w-8" />}
                  </span>
                </label>
              );
            })}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="qm-check rounded-2xl border-[3px] border-quill bg-gold px-5 py-2.5 font-tale text-lg font-black shadow-tale-sm transition-transform hover:-translate-y-0.5"
              >
                <Icon name="crystal" className="mr-1 h-6 w-6" />Cek jawaban
              </button>
              {!open && (
                <button
                  type="button"
                  onClick={reveal}
                  className="rounded-2xl border-[3px] border-quill bg-white px-4 py-2.5 font-tale font-black shadow-tale-sm transition-transform hover:-translate-y-0.5"
                >
                  <Icon name="scroll" className="mr-1 h-6 w-6" />Buka gulungan penyelesaian
                </button>
              )}
            </div>
            {checked && !allRight && (
              <p className="font-round font-bold text-bad">Hampir! Periksa lagi modelnya, atau buka gulungan penyelesaian.</p>
            )}
            {allRight && (
              <p className="flex items-center gap-2 font-tale text-xl font-black text-good">
                <span className="qm-badge inline-block rounded-full border-[3px] border-quill bg-gold px-3 py-0.5 text-quill"><Icon name="star" className="mr-1 h-5 w-5" />+1</span>
                Misi selesai! Bintang didapat.
              </p>
            )}
          </form>
        </div>

        {/* right page: the solution scroll */}
        <div className="relative flex h-[520px] max-h-[75dvh] min-h-[340px] flex-col bg-[#f6e8c8] p-[clamp(1.2rem,2.4vw,2.6rem)] lg:pt-16">
          <p className="qm-in mb-3 font-round text-sm font-black uppercase tracking-[0.2em] text-quill-soft"><Icon name="scroll" className="mr-1 h-5 w-5" />Penyelesaian</p>
          {open ? (
            <div className="min-h-0 flex-1">
              <StepPlayer steps={q.steps} vars={q.vars} final={q.final} color={q.color} />
            </div>
          ) : (
            <button
              onClick={reveal}
              className="qm-in group flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border-[3px] border-dashed border-quill/40 text-quill-soft transition-colors hover:bg-white/50"
            >
              <Icon name="scroll" className="h-20 w-20 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              <span className="font-tale text-xl font-black">Gulungan masih tersegel</span>
              <span className="font-round text-sm font-bold">Coba kerjakan dulu, lalu ketuk untuk membuka</span>
            </button>
          )}
        </div>

        <button
          onClick={close}
          title="Tutup (Esc)"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-quill bg-white font-tale text-xl font-black hover:bg-bad hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ─── the map ───────────────────────────────────────────── */
export default function Quests({ onModal }: { onModal: (open: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState<boolean[]>(() => quests.map(() => false));
  const stars = solved.filter(Boolean).length;

  useEffect(() => {
    const map = root.current;
    if (!map) return;
    const cards = Array.from(map.querySelectorAll<HTMLElement>(".qp-node"));
    const update = () => {
      // Layout coordinates stay stable during hover and entrance animations.
      const centers = cards.map((card) => ({ x: card.offsetLeft + card.offsetWidth / 2, y: card.offsetTop + card.offsetHeight / 2 }));
      if (centers.length !== 9 || !trail.current) return;
      let d = `M ${centers[0].x} ${centers[0].y}`;
      for (let i = 1; i < centers.length; i++) {
        const prev = centers[i - 1];
        const next = centers[i];
        if (i % 3 === 0) {
          const turn = i === 3 ? map.clientWidth - 12 : 12;
          d += ` C ${turn} ${prev.y}, ${turn} ${next.y}, ${next.x} ${next.y}`;
        } else d += ` L ${next.x} ${next.y}`;
      }
      trail.current.setAttribute("d", d);
    };
    const observer = new ResizeObserver(update);
    observer.observe(map);
    cards.forEach((card) => observer.observe(card));
    update();
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".qp-node",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "back.out(2.4)",
          stagger: 0.08,
          clearProps: "opacity",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        },
      );
      ambient(root.current!, () => {
        gsap.to(".qp-bob", { y: -6, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2 });
      });
    },
    { scope: root },
  );

  const openQuest = (i: number) => {
    sfx.page();
    setOpenIdx(i);
    onModal(true);
  };
  const closeQuest = () => {
    setOpenIdx(null);
    onModal(false);
  };

  return (
    <Section id="misi" className="tale-parch">
      <Pine className="pointer-events-none absolute bottom-0 right-[2%] w-16 opacity-15" fill="#22301e" />
      <Pine className="pointer-events-none absolute bottom-0 right-[6%] w-10 opacity-15" fill="#22301e" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ChapterTitle num="IV" kicker="Tipe soal SPLDV pada TKA" title={<>Peta Petualangan</>} />
        <div className="rv mb-[3vh] flex max-w-full flex-wrap items-center gap-2 rounded-2xl border-[3px] border-quill bg-white px-4 py-2 shadow-tale-sm">
          <span className="font-round text-sm font-black text-quill-soft">Bintang</span>
          {quests.map((q, i) => (
            <Sparkle key={q.id} className="w-5 transition-all duration-500" fill={solved[i] ? "#f7c548" : "#e5dccb"} />
          ))}
          <span className="ml-1 font-round font-black tabular-nums">{stars}/9</span>
        </div>
      </div>
      <p className="rv -mt-2 mb-8 max-w-[60ch] font-tale text-[clamp(1.05rem,1.4vw,1.45rem)] leading-relaxed">
        Sembilan tempat, sembilan tipe soal TKA. Kunjungi setiap tempat, kerjakan misinya, lalu buka gulungan penyelesaian.
      </p>

      <div ref={root} className="relative">
        {/* Measure the actual grid rather than stretching a fixed SVG path. */}
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          aria-hidden
        >
          <path
            ref={trail}
            fill="none"
            stroke="#d99a1e"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeWidth: 6 }}
          />
        </svg>

        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[6vw] lg:gap-y-10">
          {quests.map((q, i) => {
            const row = Math.floor(i / 3);
            const col = row % 2 === 0 ? i % 3 : 2 - (i % 3);
            return (
              <button
                key={q.id}
                onClick={() => openQuest(i)}
                className="qp-node group relative flex items-center gap-4 rounded-3xl border-[3px] border-quill bg-white p-4 text-left shadow-tale transition-[translate,box-shadow] hover:-translate-y-1.5 hover:shadow-tale-lg lg:[grid-column:var(--c)] lg:[grid-row:var(--r)]"
                style={{ ["--c" as string]: col + 1, ["--r" as string]: row + 1 }}
              >
                <span
                  className="qp-bob flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-[3px] border-quill text-4xl shadow-tale-sm transition-transform group-hover:rotate-[-8deg] group-hover:scale-110"
                  style={{ background: q.color }}
                >
                  <Icon name={q.icon} className="h-10 w-10" />
                </span>
                <span className="min-w-0">
                  <span className="block font-round text-[0.7rem] font-black uppercase tracking-[0.2em] text-quill-soft">
                    Misi {i + 1} · {q.place}
                  </span>
                  <span className="block font-tale text-[clamp(1.15rem,1.5vw,1.55rem)] font-black leading-tight">{q.type}</span>
                </span>
                <span
                  className={`absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-quill text-lg transition-all duration-500 ${
                    solved[i] ? "scale-100 bg-gold" : "scale-90 bg-parch-deep grayscale"
                  }`}
                >
                  <Icon name="star" className="h-6 w-6" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {openIdx !== null &&
        createPortal(
        <QuestModal
          key={openIdx}
          q={quests[openIdx]}
          num={openIdx + 1}
          onClose={closeQuest}
          onSolved={() => setSolved((s) => s.map((v, j) => (j === openIdx ? true : v)))}
        />,
          document.getElementById("spldv-root") ?? document.body,
        )}
    </Section>
  );
}
