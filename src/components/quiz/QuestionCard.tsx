"use client";

import { useEffect, useRef, useState } from "react";
import { Draggable, gsap, useGSAP } from "@/lib/gsap";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { categoryByKey } from "@/data/categories";
import { answerText, type Answer, type Question } from "@/data/questions";
import TimerRing from "./TimerRing";

const TYPE_LABEL = {
  mc: "Choose the best answer",
  fill: "Drag the determiner into the gap",
  spot: "Spot the error — click the wrong word",
} as const;

const KEYS = ["A", "B", "C", "D"];

type Props = {
  q: Question;
  index: number;
  record: Answer | null;
  onAnswer: (a: Answer) => void;
  onNext: () => void;
};

export default function QuestionCard({ q, index, record, onAnswer, onNext }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const answered = record !== null;
  const answeredRef = useRef(answered);
  const [choice, setChoice] = useState<number | null>(null);
  const [filled, setFilled] = useState<(string | null)[]>(() => (q.type === "fill" ? q.answers.map(() => null) : []));
  const filledRef = useRef(filled);
  const lastPlaced = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const cat = categoryByKey[q.category];
  const multi = q.type === "fill" && q.answers.length > 1;

  /* ── entrance ─────────────────────────────────────────── */
  const { contextSafe } = useGSAP(
    () => {
      gsap
        .timeline({ onComplete: () => setReady(true) })
        .fromTo(
          ".q-card",
          { xPercent: 120, rotation: 12, opacity: 0 },
          { xPercent: 0, rotation: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
        )
        // explicit end values (never .from()) so a CSS transition or a
        // StrictMode re-run can't freeze an element at its start state
        .fromTo(
          ".q-top > *",
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08 },
          "-=0.45",
        )
        .fromTo(
          ".q-w",
          { y: 40, opacity: 0, rotation: 6 },
          { y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.03 },
          "-=0.3",
        )
        .fromTo(
          ".q-opt",
          { scale: 0, rotation: () => gsap.utils.random(-20, 20) },
          {
            scale: 1,
            rotation: 0,
            duration: 0.55,
            ease: "back.out(2.6)",
            stagger: 0.07,
            clearProps: "transform,translate,rotate,scale",
          },
          "-=0.25",
        );
    },
    { scope: root },
  );

  /* ── judging ──────────────────────────────────────────── */
  const judge = contextSafe((correct: boolean, given: string, el: Element | null) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    onAnswer({ correct, given });
    if (correct) {
      sfx.correct();
      burstFrom(el, 80);
      gsap.fromTo(el, { scale: 1 }, { scale: 1.1, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
      gsap.fromTo(".q-card", { y: 0 }, { keyframes: { y: [-14, 0] }, duration: 0.4, ease: "power2.out" });
    } else {
      sfx.wrong();
      gsap.fromTo(".q-card", { x: 0 }, { keyframes: { x: [-26, 22, -16, 12, -6, 0] }, duration: 0.55, ease: "none" });
      gsap.fromTo(
        ".q-prompt",
        { textShadow: "0 0 0 rgba(0,0,0,0)", skewX: 0 },
        {
          keyframes: [
            { textShadow: "5px 0 #E5484D, -5px 0 #2B8CFF", skewX: 10, duration: 0.08 },
            { textShadow: "-6px 0 #E5484D, 6px 0 #2B8CFF", skewX: -8, duration: 0.08 },
            { textShadow: "3px 0 #E5484D, -3px 0 #2B8CFF", skewX: 4, duration: 0.08 },
            { textShadow: "0 0 0 rgba(0,0,0,0)", skewX: 0, duration: 0.1 },
          ],
        },
      );
      gsap.fromTo(".q-flash", { opacity: 0.5 }, { opacity: 0, duration: 0.6, ease: "power2.out" });
    }
  });

  // feedback panel + revealed answer animate in once answered
  useGSAP(
    () => {
      if (!answered) return;
      gsap.fromTo(
        ".q-feedback",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.8)", delay: 0.15 },
      );
      gsap.fromTo(
        ".q-reveal",
        { scale: 0, rotation: -15 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(3)", stagger: 0.08 },
      );
      gsap.fromTo(".q-fix", { y: 30, scale: 0 }, { y: 0, scale: 1, duration: 0.6, ease: "back.out(3)", delay: 0.1 });
    },
    { scope: root, dependencies: [answered] },
  );

  /* ── multiple choice ──────────────────────────────────── */
  const pickMC = (i: number) => {
    if (answeredRef.current || q.type !== "mc") return;
    setChoice(i);
    const el = root.current!.querySelectorAll(".q-opt")[i];
    judge(i === q.answer, q.options[i], el);
  };

  /* ── spot the error ───────────────────────────────────── */
  const pickSpot = (i: number) => {
    if (answeredRef.current || q.type !== "spot") return;
    setChoice(i);
    const el = root.current!.querySelectorAll(".q-word")[i];
    judge(i === q.wrongIndex, q.sentence.split(" ")[i], el);
  };

  /* ── fill (drag & drop) ───────────────────────────────── */
  const check = (cur: (string | null)[]) => {
    if (q.type !== "fill") return;
    if (cur.some((v) => v === null)) {
      gsap.fromTo(".q-blank-empty", { y: 0 }, { keyframes: { y: [-10, 0, -6, 0] }, duration: 0.5 });
      return;
    }
    judge(
      cur.every((v, i) => v === q.answers[i]),
      cur.join(" / "),
      root.current!.querySelector(".q-sentence"),
    );
  };

  const place = (v: string, target?: number) => {
    if (answeredRef.current || q.type !== "fill") return;
    const cur = filledRef.current.slice();
    const i = target ?? cur.findIndex((x) => x === null);
    if (i < 0) return;
    cur[i] = v;
    filledRef.current = cur;
    lastPlaced.current = i;
    setFilled(cur);
    sfx.pop();
    if (!multi) check(cur);
  };

  const clearBlank = (i: number) => {
    if (answeredRef.current) return;
    const cur = filledRef.current.slice();
    cur[i] = null;
    filledRef.current = cur;
    setFilled(cur);
    sfx.click();
  };

  // snap animation for the word that just landed in a gap
  useGSAP(
    () => {
      const i = lastPlaced.current;
      if (i === null) return;
      const el = root.current!.querySelector(`.q-blank[data-i="${i}"] .q-fillword`);
      if (el)
        gsap.fromTo(
          el,
          { scale: 1.8, y: -30, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(3)" },
        );
      lastPlaced.current = null;
    },
    { scope: root, dependencies: [filled] },
  );

  // Draggable chips — callbacks read refs, never stale state
  const placeRef = useRef(place);
  useEffect(() => {
    placeRef.current = place;
  });
  useGSAP(
    () => {
      if (q.type !== "fill") return;
      const blanks = () => gsap.utils.toArray<HTMLElement>(".q-blank", root.current);
      Draggable.create(".q-chip", {
        zIndexBoost: true,
        minimumMovement: 6,
        onPress() {
          if (answeredRef.current) return;
          gsap.to(this.target, { scale: 1.15, rotation: -5, duration: 0.2 });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, rotation: 0, duration: 0.3 });
        },
        onDrag() {
          blanks().forEach((b) => b.classList.toggle("is-over", this.hitTest(b, "25%")));
        },
        onDragEnd() {
          const hit = blanks().find((b) => this.hitTest(b, "25%"));
          blanks().forEach((b) => b.classList.remove("is-over"));
          if (hit && !answeredRef.current) {
            gsap.set(this.target, { x: 0, y: 0 });
            gsap.fromTo(this.target, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
            placeRef.current(this.target.dataset.v, Number(hit.dataset.i));
          } else {
            gsap.to(this.target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
          }
        },
        onClick() {
          placeRef.current(this.target.dataset.v);
        },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (!answered) return;
    gsap.utils.toArray<HTMLElement>(".q-chip", root.current).forEach((c) => Draggable.get(c)?.disable());
  }, [answered]);

  /* ── time's up ────────────────────────────────────────── */
  const timeUp = contextSafe(() => {
    sfx.timeUp();
    gsap
      .timeline()
      .fromTo(
        ".q-timeup",
        { scale: 3, opacity: 0, rotation: -25 },
        { scale: 1, opacity: 1, rotation: -8, duration: 0.45, ease: "power4.in" },
      )
      .fromTo(".q-card", { y: 0 }, { keyframes: { y: [10, -4, 0] }, duration: 0.3 })
      .to(".q-timeup", { opacity: 0, scale: 0.8, duration: 0.4, delay: 1.4 });
  });

  /* ── keyboard (presenter) ─────────────────────────────── */
  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyRef.current = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (answeredRef.current) {
        if (k === "enter" || k === "arrowright" || k === " ") {
          e.preventDefault();
          onNext();
        }
        return;
      }
      if (k === "p") root.current?.querySelector<HTMLButtonElement>("[data-timer]")?.click();
      if (q.type === "mc") {
        const i = ["1", "2", "3", "4"].indexOf(k) >= 0 ? Number(k) - 1 : ["a", "b", "c", "d"].indexOf(k);
        if (i >= 0 && i < q.options.length) pickMC(i);
      }
      if (q.type === "fill") {
        const n = Number(k);
        if (n >= 1 && n <= q.chips.length) place(q.chips[n - 1]);
        if (k === "backspace") {
          const last = filledRef.current
            .map((v, i) => (v ? i : -1))
            .filter((i) => i >= 0)
            .pop();
          if (last !== undefined) clearBlank(last);
        }
        if (k === "enter" && multi) check(filledRef.current);
      }
    };
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyRef.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* ── render helpers ───────────────────────────────────── */
  const renderPrompt = () => {
    if (q.type === "spot") {
      const words = q.sentence.split(" ");
      return (
        <p className="q-sentence flex flex-wrap gap-x-[0.3em] gap-y-[0.45em]">
          {words.map((w, i) => {
            const isWrong = i === q.wrongIndex;
            const picked = choice === i;
            let cls = "border-transparent hover:border-ink hover:bg-sun/40";
            if (answered && isWrong) cls = "border-bad bg-bad/10 text-bad line-through decoration-[4px]";
            else if (answered && picked) cls = "border-bad border-dashed";
            else if (answered) cls = "border-transparent opacity-60";
            return (
              <span key={i} className="relative inline-block">
                {answered && isWrong && (
                  <span className="q-fix absolute -top-[1.05em] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-[3px] border-ink bg-good px-2 text-[0.7em] text-white shadow-hard-sm">
                    {q.correction}
                  </span>
                )}
                <button
                  disabled={answered}
                  onClick={() => pickSpot(i)}
                  className={`q-word q-opt rounded-xl border-[3px] px-1.5 transition-colors ${cls}`}
                >
                  {w}
                </button>
              </span>
            );
          })}
        </p>
      );
    }

    const parts = q.prompt.split("___");
    return (
      <p className="q-sentence">
        <span className="q-prompt-text">
          {parts.map((p, i) => (
            <span key={i}>
              {/* words rendered by React (not SplitText) so answer reveals still update */}
              {p.split(/(\s+)/).map((w, j) =>
                w.trim() ? (
                  <span key={j} className="q-w inline-block">
                    {w}
                  </span>
                ) : (
                  w
                ),
              )}
              {i < parts.length - 1 && <span className="q-w inline-block">{renderBlank(i)}</span>}
            </span>
          ))}
        </span>
      </p>
    );
  };

  const renderBlank = (i: number) => {
    if (q.type === "mc") {
      return answered ? (
        <span className="q-reveal hl mx-1 bg-good">{q.options[q.answer]}</span>
      ) : (
        <span className="blank text-sky-deep">&nbsp;?&nbsp;</span>
      );
    }
    if (q.type === "fill") {
      const v = filled[i];
      const right = answered && v === q.answers[i];
      const wrong = answered && v !== q.answers[i];
      return (
        <span className="relative inline-block">
          <button
            data-i={i}
            disabled={answered || !v}
            onClick={() => clearBlank(i)}
            className={`q-blank ${v ? "" : "q-blank-empty"} mx-1 inline-flex min-w-[3.2em] items-center justify-center rounded-xl border-[3px] border-dashed px-2 align-baseline transition-colors [&.is-over]:scale-110 [&.is-over]:border-solid [&.is-over]:bg-sun/50 ${
              right
                ? "border-good bg-good text-white"
                : wrong
                  ? "border-bad bg-bad/10 text-bad line-through"
                  : v
                    ? "border-ink bg-white"
                    : "border-sky-deep bg-sky-light"
            }`}
          >
            <span className="q-fillword inline-block">{v ?? " "}</span>
          </button>
          {wrong && (
            <span className="q-fix absolute -top-[1.05em] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-[3px] border-ink bg-good px-2 text-[0.7em] text-white shadow-hard-sm">
              {q.answers[i]}
            </span>
          )}
        </span>
      );
    }
    return null;
  };

  return (
    <div ref={root} className="relative h-full">
      <div className="q-card relative flex h-full flex-col overflow-hidden rounded-[2rem] border-[4px] border-ink bg-white p-[clamp(1.2rem,2.4vw,2.6rem)] shadow-hard-lg">
        <div className="q-flash pointer-events-none absolute inset-0 bg-bad opacity-0" />

        <div className="q-top relative flex items-center gap-3">
          <span className="rounded-full bg-ink px-4 py-1.5 font-display text-[clamp(0.85rem,1vw,1.15rem)] font-extrabold text-white">
            Q{index + 1}
          </span>
          <span className="rounded-full border-[3px] border-ink px-4 py-1 text-[clamp(0.85rem,1vw,1.15rem)] font-extrabold">
            {TYPE_LABEL[q.type]}
          </span>
          {answered && (
            <span
              className="q-reveal rounded-full px-4 py-1.5 text-[clamp(0.85rem,1vw,1.15rem)] font-extrabold text-white"
              style={{ background: cat.color }}
            >
              {cat.title}
            </span>
          )}
          <div className="ml-auto">
            <TimerRing running={ready && !answered} onTimeUp={timeUp} />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-center py-[2vh]">
          <div className="q-prompt relative font-display text-[clamp(1.7rem,3.2vw,3.4rem)] font-extrabold leading-[1.35]">
            {renderPrompt()}
          </div>

          {/* answers */}
          <div className="relative mt-[5vh]">
            {q.type === "mc" && (
              <div className="grid grid-cols-2 gap-[1.6vw]">
                {q.options.map((o, i) => {
                  const isRight = i === q.answer;
                  const picked = choice === i;
                  let cls = "bg-white hover:-translate-y-1 hover:bg-sun/40";
                  if (answered && isRight) cls = "bg-good text-white";
                  else if (answered && picked) cls = "bg-bad text-white line-through";
                  else if (answered) cls = "bg-white opacity-45";
                  return (
                    <button
                      key={o}
                      disabled={answered}
                      onClick={() => pickMC(i)}
                      className={`q-opt flex items-center gap-5 rounded-2xl border-[3px] border-ink px-[1.6vw] py-[2.4vh] text-left font-display text-[clamp(1.3rem,2.2vw,2.3rem)] font-extrabold shadow-hard-sm transition-[translate,background-color,opacity] ${cls}`}
                    >
                      <span className="flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center rounded-xl bg-ink text-[0.7em] text-white">
                        {KEYS[i]}
                      </span>
                      {o}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "fill" && (
              <div className="flex flex-wrap items-center gap-[1.2vw]">
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-ink-soft">
                  {multi ? "Drag or tap · reusable" : "Drag or tap"}
                </span>
                {q.chips.map((c, i) => (
                  <span key={c} className="q-opt inline-block">
                    <button
                      data-v={c}
                      className={`q-chip relative flex cursor-grab items-center gap-2 rounded-2xl border-[3px] border-ink bg-sun px-6 py-3 font-display text-[clamp(1.3rem,2.2vw,2.3rem)] font-extrabold shadow-hard-sm active:cursor-grabbing ${
                        answered ? "opacity-50" : ""
                      }`}
                    >
                      <span className="rounded-md bg-ink px-2 py-0.5 text-[0.55em] text-white">{i + 1}</span>
                      {c}
                    </button>
                  </span>
                ))}
                {multi && !answered && (
                  <button
                    onClick={() => check(filledRef.current)}
                    className="q-opt ml-auto rounded-2xl border-[3px] border-ink bg-ink px-7 py-3 font-display text-[clamp(1.1rem,1.8vw,1.8rem)] font-extrabold text-white shadow-hard-sm hover:-translate-y-0.5"
                  >
                    Check ✓ <span className="text-sm opacity-70">(Enter)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* feedback */}
        {answered && (
          <div
            className={`q-feedback flex items-center gap-5 rounded-2xl border-[3px] border-ink px-[clamp(1rem,1.8vw,2rem)] py-[clamp(0.9rem,1.6vw,1.6rem)] ${
              record.correct ? "bg-good/10" : "bg-bad/10"
            }`}
          >
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-ink font-display text-3xl font-extrabold text-white ${
                record.correct ? "bg-good" : "bg-bad"
              }`}
            >
              {record.correct ? "✓" : "✗"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[clamp(1.2rem,1.9vw,2rem)] font-extrabold leading-tight">
                {record.correct ? "Correct! Nice climb." : "Not quite…"}
                {!record.correct && (
                  <span className="ml-2 text-good">
                    Answer: <span className="underline decoration-[3px]">{answerText(q)}</span>
                  </span>
                )}
              </p>
              <p className="mt-1 text-[clamp(0.95rem,1.3vw,1.35rem)] font-semibold text-ink-soft">{q.explanation}</p>
            </div>
            <button
              onClick={onNext}
              className="shrink-0 rounded-2xl border-[3px] border-ink bg-sun px-7 py-4 font-display text-[clamp(1.1rem,1.6vw,1.7rem)] font-extrabold shadow-hard-sm transition-transform hover:-translate-y-1"
            >
              Next →
            </button>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="q-timeup rounded-3xl border-[5px] border-bad bg-white px-10 py-4 font-display text-[clamp(2.4rem,5vw,5rem)] font-extrabold text-bad opacity-0 shadow-hard-lg">
            TIME&apos;S UP!
          </div>
        </div>
      </div>
    </div>
  );
}
