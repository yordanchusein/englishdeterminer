"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { levels, questions, type Answer } from "@/data/questions";
import QuestionCard from "./QuestionCard";
import ClimbTracker from "./ClimbTracker";
import LevelIntro from "./LevelIntro";
import Result from "./Result";

type Phase = "level" | "question" | "result";
const empty = () => questions.map(() => null as Answer | null);

export default function Quiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("level");
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<(Answer | null)[]>(empty);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const busy = useRef(false);

  const q = questions[index];
  const lv = levels[q.level];
  const score = records.filter((r) => r?.correct).length;

  const { contextSafe } = useGSAP({ scope: root });

  /* open / close: a circular "portal" wipe */
  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(
        root.current,
        { clipPath: "circle(0% at 50% 75%)" },
        { clipPath: "circle(150% at 50% 75%)", duration: 1.1, ease: "expo.inOut" },
      );
    },
    { dependencies: [open] },
  );

  const close = contextSafe(() => {
    sfx.whoosh();
    gsap.to(root.current, {
      clipPath: "circle(0% at 50% 75%)",
      duration: 0.8,
      ease: "expo.inOut",
      onComplete: onClose,
    });
  });

  const onAnswer = contextSafe((a: Answer) => {
    setRecords((r) => {
      const next = r.slice();
      next[index] = a;
      return next;
    });
    const s = a.correct ? streak + 1 : 0;
    setStreak(s);
    setBestStreak((b) => Math.max(b, s));
    gsap.fromTo(".qz-score", { scale: 1 }, { scale: a.correct ? 1.4 : 0.8, duration: 0.2, yoyo: true, repeat: 1 });
    if (a.correct && s >= 2) {
      const el = root.current!.querySelector(".qz-combo")!;
      el.textContent = `${s}× COMBO!${s >= 4 ? " 🔥" : ""}`;
      setTimeout(() => sfx.combo(), 250);
      gsap
        .timeline()
        .fromTo(
          el,
          { scale: 0, rotation: -30, opacity: 1, y: 0 },
          { scale: 1, rotation: -8, duration: 0.5, ease: "back.out(3)" },
        )
        .to(el, { y: -120, opacity: 0, scale: 1.3, duration: 0.6, ease: "power2.in" }, "+=0.7");
    }
  });

  const next = contextSafe(() => {
    if (busy.current) return;
    busy.current = true;
    sfx.whoosh();
    gsap.to(".q-card", {
      xPercent: -130,
      rotation: -10,
      opacity: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        busy.current = false;
        if (index === questions.length - 1) {
          setPhase("result");
          return;
        }
        const n = index + 1;
        if (questions[n].level !== questions[index].level) setPhase("level");
        setIndex(n);
      },
    });
  });

  const restart = () => {
    setRecords(empty());
    setIndex(0);
    setStreak(0);
    setBestStreak(0);
    setPhase("level");
  };

  // Escape leaves the quiz (progress is kept)
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, close]);

  return (
    <div
      ref={root}
      className={`fixed inset-0 z-[60] overflow-hidden bg-[linear-gradient(180deg,#bfe5ff_0%,#e9f7ff_55%,#fff9ee_100%)] ${
        open ? "" : "invisible pointer-events-none"
      }`}
      style={{ clipPath: "circle(0% at 50% 75%)" }}
      aria-hidden={!open}
    >
      {open && phase === "level" && <LevelIntro key={q.level} level={q.level} onDone={() => setPhase("question")} />}

      {open && phase === "result" && (
        <Result records={records} bestStreak={bestStreak} onRestart={restart} onClose={close} />
      )}

      {open && phase !== "result" && (
        <div className="flex h-full flex-col">
          {/* HUD */}
          <header className="flex h-[11vh] shrink-0 items-center gap-4 px-[3vw]">
            <span
              className="rounded-2xl border-[3px] border-ink px-4 py-1.5 font-display text-lg font-extrabold text-white shadow-hard-sm"
              style={{ background: lv.color }}
            >
              Lv {q.level} · {lv.name}
            </span>
            <div className="flex flex-1 items-center gap-3">
              <span className="font-display text-lg font-extrabold tabular-nums">
                {String(index + 1).padStart(2, "0")} / {questions.length}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{
                    width: `${(records.filter(Boolean).length / questions.length) * 100}%`,
                    background: lv.color,
                  }}
                />
              </div>
            </div>
            <span className="qz-score rounded-2xl border-[3px] border-ink bg-white px-4 py-1.5 font-display text-lg font-extrabold shadow-hard-sm">
              ⭐ {score}
            </span>
            <span
              className={`rounded-2xl border-[3px] border-ink px-4 py-1.5 font-display text-lg font-extrabold shadow-hard-sm transition-colors ${
                streak >= 2 ? "bg-[#FF7A45] text-white" : "bg-white"
              }`}
            >
              🔥 {streak}
            </span>
            <button
              onClick={close}
              title="Exit (Esc)"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink bg-white font-display text-xl font-extrabold hover:bg-bad hover:text-white"
            >
              ✕
            </button>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr_clamp(150px,16vw,250px)] gap-[2.5vw] px-[3vw] pb-[7vh]">
            <div className="min-h-0">
              {phase === "question" && (
                <QuestionCard
                  key={index}
                  q={q}
                  index={index}
                  record={records[index]}
                  onAnswer={onAnswer}
                  onNext={next}
                />
              )}
            </div>
            <ClimbTracker records={records} index={index} />
          </div>

          <p className="pointer-events-none absolute bottom-[2.2vh] left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(0.75rem,0.9vw,1rem)] font-bold text-ink-soft">
            Keys: A–D / 1–4 answer · Enter next · P pause timer · Esc exit
          </p>
        </div>
      )}

      <div className="qz-combo pointer-events-none absolute left-1/2 top-[40%] z-30 -translate-x-1/2 whitespace-nowrap rounded-3xl border-[5px] border-ink bg-sun px-8 py-3 font-display text-[clamp(2.4rem,6vw,6rem)] font-extrabold opacity-0 shadow-hard-lg" />
    </div>
  );
}
