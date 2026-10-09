"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-lite";
import { rain } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { quizLevels, quizQuestions as questions } from "@/data/spldv";
import Eq from "../Eq";
import { GreatTree, Hills, Sparkle, Stars, TreeLine } from "../Scenery";
import QuizCard, { type Record_ } from "./QuizCard";
import Icon from "../Icons";

type Phase = "level" | "question" | "result";
const empty = () => questions.map(() => null as Record_ | null);

/* ─── level splash ──────────────────────────────────────── */
function LevelIntro({ level, onDone }: { level: 1 | 2 | 3; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const lv = quizLevels[level];
  useGSAP(
    () => {
      sfx.level();
      const split = SplitText.create(".li-name", { type: "chars", charsClass: "inline-block" });
      gsap
        .timeline({ onComplete: onDone })
        .fromTo(".li-icon", { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" })
        .fromTo(".li-kicker", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.4")
        .fromTo(
          split.chars,
          { yPercent: 120, opacity: 0, rotation: () => gsap.utils.random(-30, 30) },
          { yPercent: 0, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(2.4)", stagger: 0.04 },
          "-=0.2",
        )
        .fromTo(".li-sub", { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .to({}, { duration: 1.1 })
        .to(root.current, { opacity: 0, scale: 1.1, duration: 0.45, ease: "power2.in" });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center text-center text-parch" onClick={onDone}>
      <Icon name={lv.icon} className="li-icon h-[clamp(5rem,10vw,9rem)] w-[clamp(5rem,10vw,9rem)]" />
      <p className="li-kicker mt-2 font-round text-sm font-black uppercase tracking-[0.4em] text-gold">
        Level {level} · {lv.sub}
      </p>
      <h2 className="li-name font-tale text-[clamp(3rem,9vw,9rem)] font-black leading-none" style={{ textShadow: `0 6px 0 ${lv.color}` }}>
        {lv.name}
      </h2>
      <p className="li-sub mt-4 font-round text-lg font-bold text-parch/70">{lv.range}</p>
    </div>
  );
}

/* ─── tower tracker ─────────────────────────────────────── */
function Tower({ records, index }: { records: (Record_ | null)[]; index: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <GreatTree className="w-full max-w-[150px]" />
      <div className="flex flex-col-reverse gap-1.5 rounded-2xl border-[3px] border-quill bg-[#123329] p-2">
        {questions.map((q, i) => {
          const r = records[i];
          const color = r ? (r.correct ? "#f7c548" : "#e5484d") : i === index ? quizLevels[q.level].color : "#1f4a37";
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 text-right font-round text-[0.65rem] font-black text-parch/50 tabular-nums">{i + 1}</span>
              <span
                className={`h-[clamp(12px,2.2vh,22px)] w-[clamp(60px,7vw,110px)] rounded-full border-2 border-quill transition-all duration-500 ${
                  i === index && !r ? "animate-pulse" : ""
                }`}
                style={{ background: color, boxShadow: r?.correct ? "0 0 12px rgba(247,197,72,0.8)" : undefined }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── results ───────────────────────────────────────────── */
function grade(score: number) {
  if (score >= 16) return { g: "S", t: "Penyihir Agung", c: "#e8478f" };
  if (score >= 13) return { g: "A", t: "Ksatria Bintang", c: "#25a06b" };
  if (score >= 10) return { g: "B", t: "Bangsawan Aljabar", c: "#6a4bc4" };
  if (score >= 7) return { g: "C", t: "Murid Penyihir", c: "#d99a1e" };
  return { g: "D", t: "Peri Pemula", c: "#129e94" };
}

function Result({
  records,
  bestStreak,
  onRestart,
  onClose,
}: {
  records: (Record_ | null)[];
  bestStreak: number;
  onRestart: () => void;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [review, setReview] = useState(false);
  const score = records.filter((r) => r?.correct).length;
  const gr = grade(score);

  useGSAP(
    () => {
      sfx.fanfare();
      const n = { v: 0 };
      const num = root.current!.querySelector(".rs-num")!;
      gsap
        .timeline()
        .fromTo(".rs-castle", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out" })
        .fromTo(".rs-card", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(2)" }, 0.5)
        .to(
          n,
          {
            v: score,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              num.textContent = String(Math.round(n.v));
            },
          },
          0.8,
        )
        .fromTo(".rs-stamp", { scale: 5, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.5, ease: "power4.in" }, 2.4)
        .fromTo(".rs-card", { x: 0 }, { keyframes: { x: [-14, 12, -6, 0] }, duration: 0.35 })
        .add(() => rain(score >= 10 ? 200 : 80), "<")
        .fromTo(".rs-btn", { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.1, clearProps: "transform,translate,rotate,scale" }, "<0.2");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="absolute inset-0 overflow-y-auto" data-lenis-prevent>
      <div className="relative flex min-h-full flex-col items-center justify-center px-[4vw] py-[8vh] text-center">
        <GreatTree className="rs-castle pointer-events-none absolute bottom-0 left-1/2 w-[min(80vw,700px)] -translate-x-1/2 opacity-30" />
        <div className="rs-card relative w-full max-w-[720px] rounded-[2rem] border-[4px] border-quill bg-parch p-[clamp(1.5rem,3vw,3rem)] text-quill shadow-[12px_12px_0_#06140f]">
          <p className="font-round text-sm font-black uppercase tracking-[0.35em] text-quill-soft">Ujian Penyihir Hutan selesai</p>
          <div className="mt-2 font-tale text-[clamp(4rem,10vw,8rem)] font-black leading-none tabular-nums">
            <span className="rs-num">0</span>
            <span className="text-quill-soft">/{questions.length}</span>
          </div>
          <div
            className="rs-stamp absolute right-6 top-6 flex h-[clamp(80px,9vw,120px)] w-[clamp(80px,9vw,120px)] items-center justify-center rounded-full border-[5px] font-tale text-[clamp(2.6rem,5vw,4rem)] font-black"
            style={{ borderColor: gr.c, color: gr.c }}
          >
            {gr.g}
          </div>
          <p className="mt-3 font-tale text-[clamp(1.6rem,3vw,2.6rem)] font-black" style={{ color: gr.c }}>
            Gelar: {gr.t}
          </p>
          <div className="mt-4 flex justify-center gap-3 font-round font-black">
            <span className="rounded-2xl border-[3px] border-quill bg-white px-4 py-1.5"><Icon name="check" className="mr-1 h-6 w-6" />{score} benar</span>
            <span className="rounded-2xl border-[3px] border-quill bg-white px-4 py-1.5"><Icon name="flame" className="mr-1 h-6 w-6" />combo terbaik {bestStreak}</span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => { sfx.click(); setReview((r) => !r); }} className="rs-btn rounded-2xl border-[3px] border-quill bg-white px-5 py-2.5 font-tale font-black shadow-tale-sm">
              <Icon name="scroll" className="mr-1 h-6 w-6" />
              {review ? "Tutup pembahasan" : "Lihat pembahasan"}
            </button>
            <button onClick={onRestart} className="rs-btn rounded-2xl border-[3px] border-quill bg-gold px-5 py-2.5 font-tale font-black shadow-tale-sm">
              ↺ Ulangi ujian
            </button>
            <button onClick={onClose} className="rs-btn rounded-2xl border-[3px] border-quill bg-violet px-5 py-2.5 font-tale font-black text-white shadow-tale-sm">
              <Icon name="tree" className="mr-1 h-6 w-6" />Kembali ke hutan
            </button>
          </div>
        </div>

        {review && (
          <div className="relative mt-8 grid w-full max-w-[1100px] gap-3 text-left md:grid-cols-2">
            {questions.map((q, i) => {
              const r = records[i];
              return (
                <div key={i} className={`rounded-2xl border-[3px] border-quill p-4 ${r?.correct ? "bg-[#e7f7ee]" : "bg-[#fde8e8]"}`}>
                  <p className="font-round text-xs font-black uppercase tracking-[0.2em] text-quill-soft">
                    Soal {i + 1} · <Icon name={r?.correct ? "check" : r?.given == null ? "hourglass" : "cross"} className="mx-1 h-4 w-4" />
                    {r?.correct ? "benar" : r?.given == null ? "tidak dijawab" : "salah"}
                  </p>
                  <p className="mt-1 font-tale font-bold text-quill">{q.prompt}</p>
                  {q.system && <p className="text-quill">{q.system.map((s) => <Eq key={s} text={s} className="mr-4" />)}</p>}
                  <p className="mt-1 font-round font-black text-good">→ {q.options[q.answer]}</p>
                  <p className="font-round text-sm font-semibold text-quill-soft">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── the exam overlay ──────────────────────────────────── */
export default function Quiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("level");
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<(Record_ | null)[]>(empty);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const busy = useRef(false);

  const q = questions[index];
  const lv = quizLevels[q.level];
  const score = records.filter((r) => r?.correct).length;

  const { contextSafe } = useGSAP({ scope: root });

  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(root.current, { clipPath: "circle(0% at 50% 80%)" }, { clipPath: "circle(150% at 50% 80%)", duration: 1.1, ease: "expo.inOut" });
    },
    { dependencies: [open] },
  );

  const close = contextSafe(() => {
    sfx.whoosh();
    gsap.to(root.current, { clipPath: "circle(0% at 50% 80%)", duration: 0.8, ease: "expo.inOut", onComplete: onClose });
  });

  const onAnswer = contextSafe((r: Record_) => {
    setRecords((rs) => rs.map((v, i) => (i === index ? r : v)));
    const s = r.correct ? streak + 1 : 0;
    setStreak(s);
    setBestStreak((b) => Math.max(b, s));
    gsap.fromTo(".qz-score", { scale: 1 }, { scale: r.correct ? 1.4 : 0.8, duration: 0.2, yoyo: true, repeat: 1 });
    if (r.correct && s >= 2) {
      const el = root.current!.querySelector(".qz-combo")!;
      el.textContent = `${s}× COMBO!`;
      setTimeout(() => sfx.combo(), 250);
      gsap
        .timeline()
        .fromTo(el, { scale: 0, rotation: -30, opacity: 1, y: 0 }, { scale: 1, rotation: -8, duration: 0.5, ease: "back.out(3)" })
        .to(el, { y: -120, opacity: 0, scale: 1.3, duration: 0.6, ease: "power2.in" }, "+=0.7");
    }
  });

  const next = contextSafe(() => {
    if (busy.current) return;
    busy.current = true;
    sfx.whoosh();
    gsap.to(".qc-card", {
      xPercent: -120,
      rotation: -8,
      opacity: 0,
      duration: 0.45,
      ease: "power3.in",
      onComplete: () => {
        busy.current = false;
        if (index === questions.length - 1) return setPhase("result");
        const n = index + 1;
        if (questions[n].level !== questions[index].level) setPhase("level");
        setIndex(n);
      },
    });
  });

  const restart = () => {
    sfx.click();
    setRecords(empty());
    setIndex(0);
    setStreak(0);
    setBestStreak(0);
    setPhase("level");
  };

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, close]);

  return (
    <div
      ref={root}
      className={`tale-night fixed inset-0 z-[60] overflow-hidden ${open ? "" : "is-off pointer-events-none invisible"}`}
      style={{ clipPath: "circle(0% at 50% 80%)" }}
      aria-hidden={!open}
    >
      <Stars count={70} seed={5} />
      <TreeLine seed={4} className="pointer-events-none absolute inset-x-0 bottom-[8vh] h-[22vh] w-full" fill="#17402f" />
      <Hills layer="near" className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] w-full opacity-80" />
      <Hills layer="front" className="pointer-events-none absolute inset-x-0 -bottom-[2px] h-[11vh] w-full" />

      {open && phase === "level" && <LevelIntro key={q.level} level={q.level} onDone={() => setPhase("question")} />}

      {open && phase === "result" && <Result records={records} bestStreak={bestStreak} onRestart={restart} onClose={close} />}

      {open && phase !== "result" && (
        <div className="relative flex h-full flex-col">
          <header className="flex h-[11vh] shrink-0 items-center gap-3 px-[3vw]">
            <span
              className="rounded-2xl border-[3px] border-quill px-4 py-1.5 font-tale text-lg font-black text-white shadow-[3px_3px_0_#06140f]"
              style={{ background: lv.color }}
            >
              <Icon name={lv.icon} className="mr-1 h-7 w-7" /> {lv.name}
            </span>
            <div className="flex flex-1 items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-quill bg-white/90">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${(records.filter(Boolean).length / questions.length) * 100}%`, background: lv.color }}
                />
              </div>
            </div>
            <span className="qz-score rounded-2xl border-[3px] border-quill bg-gold px-4 py-1.5 font-round text-lg font-black text-quill shadow-[3px_3px_0_#06140f]">
              <Icon name="star" className="mr-1 h-6 w-6" />
              {score}
            </span>
            <span
              className={`rounded-2xl border-[3px] border-quill px-4 py-1.5 font-round text-lg font-black shadow-[3px_3px_0_#06140f] transition-colors ${
                streak >= 2 ? "bg-rose text-white" : "bg-white text-quill"
              }`}
            >
              <Icon name="flame" className="mr-1 h-6 w-6" />
              {streak}
            </span>
            <button
              onClick={close}
              title="Keluar (Esc)"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-quill bg-white font-tale text-xl font-black text-quill hover:bg-bad hover:text-white"
            >
              ✕
            </button>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-[2.5vw] px-[3vw] pb-[7vh] md:grid-cols-[1fr_clamp(130px,13vw,200px)]">
            <div className="min-h-0">
              {phase === "question" && (
                <QuizCard key={index} q={q} index={index} total={questions.length} record={records[index]} onAnswer={onAnswer} onNext={next} />
              )}
            </div>
            <div className="hidden md:block">
              <Tower records={records} index={index} />
            </div>
          </div>

          <p className="pointer-events-none absolute bottom-[2vh] left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-round text-[clamp(0.75rem,0.9vw,1rem)] font-bold text-parch/70 md:block">
            Tombol: A–D / 1–4 menjawab · Enter lanjut · P jeda waktu · Esc keluar
          </p>
        </div>
      )}

      <div className="qz-combo pointer-events-none absolute left-1/2 top-[40%] z-30 -translate-x-1/2 whitespace-nowrap rounded-3xl border-[5px] border-quill bg-gold px-8 py-3 font-tale text-[clamp(2.4rem,6vw,6rem)] font-black text-quill opacity-0 shadow-[10px_10px_0_#06140f]" />
      <Sparkle className="pointer-events-none absolute left-[4%] top-[16%] w-8 opacity-70" />
      <Sparkle className="pointer-events-none absolute right-[22%] top-[8%] w-6 opacity-70" fill="#ff7eb3" />
    </div>
  );
}
