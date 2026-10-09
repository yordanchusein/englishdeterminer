"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap-lite";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { quizLevels, type QuizQ } from "@/data/spldv";
import Eq from "../Eq";
import Icon from "../Icons";

export type Record_ = { correct: boolean; given: number | null };

const KEYS = ["A", "B", "C", "D"];

type Props = {
  q: QuizQ;
  index: number;
  total: number;
  record: Record_ | null;
  onAnswer: (r: Record_) => void;
  onNext: () => void;
};

export default function QuizCard({ q, index, total, record, onAnswer, onNext }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const answered = record !== null;
  const answeredRef = useRef(answered);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [left, setLeft] = useState(q.level === 3 ? 60 : 45);
  const lv = quizLevels[q.level];
  const limit = q.level === 3 ? 60 : 45;

  const { contextSafe } = useGSAP(
    () => {
      gsap
        .timeline()
        .fromTo(".qc-card", { xPercent: 110, rotation: 10, opacity: 0 }, { xPercent: 0, rotation: 0, opacity: 1, duration: 0.8, ease: "expo.out" })
        .fromTo(".qc-top > *", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08 }, "-=0.45")
        .fromTo(".qc-prompt", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .fromTo(".qc-sys", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, "-=0.2")
        .fromTo(
          ".qc-opt",
          { scale: 0, rotation: () => gsap.utils.random(-16, 16) },
          { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.6)", stagger: 0.07, clearProps: "transform,translate,rotate,scale" },
          "-=0.2",
        );
    },
    { scope: root },
  );

  const judge = contextSafe((i: number | null) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    const correct = i === q.answer;
    onAnswer({ correct, given: i });
    const el = i === null ? null : root.current!.querySelectorAll(".qc-opt")[i];
    if (correct) {
      sfx.correct();
      burstFrom(el, 80);
      gsap.fromTo(".qc-card", { y: 0 }, { keyframes: { y: [-14, 0] }, duration: 0.4 });
    } else {
      if (i === null) sfx.timeUp();
      else sfx.wrong();
      gsap.fromTo(".qc-card", { x: 0 }, { keyframes: { x: [-24, 20, -14, 10, -5, 0] }, duration: 0.55, ease: "none" });
      gsap.fromTo(".qc-flash", { opacity: 0.45 }, { opacity: 0, duration: 0.6 });
    }
    requestAnimationFrame(() =>
      gsap.fromTo(".qc-feedback", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.8)", delay: 0.1 }),
    );
  });

  const judgeRef = useRef(judge);
  useEffect(() => {
    judgeRef.current = judge;
  });

  /* countdown */
  useEffect(() => {
    if (answered) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(id);
          setTimeout(() => judgeRef.current(null), 0);
          return 0;
        }
        if (l <= 6) sfx.tick();
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [answered]);

  /* keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "p") {
        pausedRef.current = !pausedRef.current;
        setPaused(pausedRef.current);
        return;
      }
      if (k === "enter" && answeredRef.current) {
        e.preventDefault();
        onNext();
        return;
      }
      const i = ["a", "b", "c", "d"].indexOf(k);
      const n = ["1", "2", "3", "4"].indexOf(k);
      const pick = i !== -1 ? i : n;
      if (pick !== -1 && pick < q.options.length) judgeRef.current(pick);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onNext, q.options.length]);

  const pct = left / limit;

  return (
    <div ref={root} className="flex h-full items-center">
      <div className="qc-card relative flex max-h-full w-full flex-col overflow-hidden rounded-[2rem] border-[4px] border-quill bg-parch p-[clamp(1.2rem,2.4vw,2.6rem)] text-quill shadow-[10px_10px_0_#06140f]">
        <div className="qc-flash pointer-events-none absolute inset-0 bg-bad opacity-0" />

        <div className="qc-top flex items-center gap-3">
          <span className="rounded-full border-[3px] border-quill px-3 py-0.5 font-round text-sm font-black text-white" style={{ background: lv.color }}>
            Soal {index + 1} / {total}
          </span>
          <div className="relative h-4 flex-1 overflow-hidden rounded-full border-[3px] border-quill bg-white">
            <div
              className="h-full origin-left rounded-full transition-[width,background-color] duration-1000 ease-linear"
              style={{ width: `${pct * 100}%`, background: left <= 10 ? "#e5484d" : "#f7c548" }}
            />
          </div>
          <span className={`w-16 text-right font-round text-xl font-black tabular-nums ${left <= 10 && !answered ? "animate-pulse text-bad" : ""}`}>
            <Icon name="hourglass" className="mr-1 h-6 w-6" />
            {left}
          </span>
          {paused && !answered && (
            <span className="rounded-full bg-quill px-3 py-0.5 font-round text-xs font-black text-white">JEDA</span>
          )}
        </div>

        <p className="qc-prompt mt-5 font-tale text-[clamp(1.35rem,2.3vw,2.4rem)] font-bold leading-snug">{q.prompt}</p>

        {q.system && (
          <div className="qc-sys mt-4 flex origin-top items-center gap-3 self-start rounded-2xl border-[3px] border-quill bg-white px-5 py-2">
            <span className="font-tale text-[clamp(2.4rem,4vw,4rem)] font-light leading-none text-quill-soft">{"{"}</span>
            <div className="text-[clamp(1.3rem,2.1vw,2.2rem)] leading-tight">
              {q.system.map((s) => (
                <div key={s}>
                  <Eq text={s} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.options.map((o, i) => {
            const isAns = i === q.answer;
            const picked = record?.given === i;
            const state = !answered ? "idle" : isAns ? "right" : picked ? "wrong" : "dim";
            return (
              <button
                key={o}
                onClick={() => judge(i)}
                disabled={answered}
                className={`qc-opt flex items-center gap-3 rounded-2xl border-[3px] border-quill px-4 py-3 text-left transition-all duration-300 ${
                  state === "idle"
                    ? "bg-white shadow-tale-sm hover:-translate-y-1 hover:bg-gold"
                    : state === "right"
                      ? "scale-[1.03] bg-good text-white shadow-tale-sm"
                      : state === "wrong"
                        ? "bg-bad text-white line-through"
                        : "bg-white opacity-45"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-quill font-tale text-lg font-black ${
                    state === "idle" ? "bg-parch" : "bg-white text-quill"
                  }`}
                >
                  {state === "right" ? "✓" : state === "wrong" ? "✗" : KEYS[i]}
                </span>
                <span className="text-[clamp(1.05rem,1.6vw,1.6rem)] font-bold">
                  {q.eqOptions && state === "idle" ? <Eq text={o} /> : <span className="font-round">{o}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`qc-feedback mt-5 flex flex-wrap items-center gap-4 rounded-2xl border-[3px] border-quill p-4 ${
              record.correct ? "bg-good/15" : "bg-bad/10"
            }`}
          >
            <Icon name={record.correct ? "star" : record.given === null ? "hourglass" : "dragon"} className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <p className="font-tale text-xl font-black">
                {record.correct ? "Mantra berhasil!" : record.given === null ? "Waktu habis!" : "Ups, sang naga menghadang!"}
              </p>
              <p className="font-round text-[clamp(0.95rem,1.2vw,1.2rem)] font-semibold text-quill-soft">{q.explanation}</p>
            </div>
            <button
              onClick={onNext}
              className="rounded-2xl border-[3px] border-quill bg-violet px-5 py-2.5 font-tale text-lg font-black text-white shadow-tale-sm transition-transform hover:-translate-y-0.5"
            >
              {index === total - 1 ? (
                <>
                  Lihat hasil <Icon name="trophy" className="ml-1 h-6 w-6" />
                </>
              ) : (
                "Lanjut →"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
