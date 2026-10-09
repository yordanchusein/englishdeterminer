"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap-lite";
import { burstFrom } from "@/lib/confetti";
import { sfx } from "@/lib/sound";
import { translations } from "@/data/spldv";
import { ChapterTitle, Section } from "./Chapter";
import Eq from "./Eq";
import Icon from "./Icons";

/** three equation choices per card: the answer plus two neighbours, in a fixed shuffled order */
const CHOICES = translations.map((t, i) => {
  const a = translations[(i + 1) % translations.length].eq;
  const b = translations[(i + 3) % translations.length].eq;
  const order = [
    [t.eq, a, b],
    [a, t.eq, b],
    [a, b, t.eq],
  ][i % 3];
  return order;
});

export default function Translator() {
  const root = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<boolean[]>(() => translations.map(() => false));
  const [challenge, setChallenge] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const score = flipped.filter(Boolean).length;

  const { contextSafe } = useGSAP({ scope: root });

  const turn = contextSafe((i: number, to: boolean, delay = 0) => {
    const card = root.current!.querySelectorAll(".tr-card")[i];
    gsap.to(card.querySelector(".flip-inner"), {
      rotationY: to ? 180 : 0,
      duration: 0.8,
      ease: "back.out(1.4)",
      delay,
    });
    if (to)
      gsap.delayedCall(delay + 0.25, () => {
        burstFrom(card, 26);
      });
  });

  const flip = (i: number) => {
    const to = !flipped[i];
    sfx.sparkle();
    turn(i, to);
    setFlipped((f) => f.map((v, j) => (j === i ? to : v)));
  };

  const all = () => {
    const to = flipped.some((f) => !f);
    sfx.whoosh();
    flipped.forEach((f, i) => f !== to && turn(i, to, i * 0.09));
    setFlipped(translations.map(() => to));
  };

  const guess = contextSafe((i: number, eq: string, el: HTMLElement) => {
    if (eq === translations[i].eq) {
      sfx.correct();
      flip(i);
      return;
    }
    sfx.wrong();
    setWrong(`${i}:${eq}`);
    gsap.fromTo(el, { x: 0 }, { keyframes: { x: [-10, 9, -6, 4, 0] }, duration: 0.4 });
  });

  const toggleChallenge = () => {
    sfx.click();
    if (!challenge) {
      flipped.forEach((f, i) => f && turn(i, false));
      setFlipped(translations.map(() => false));
    }
    setChallenge((c) => !c);
    setWrong(null);
  };

  return (
    <Section id="penerjemah" className="tale-parch">
      <ChapterTitle num="II" kicker="Gulungan Penerjemah" title={<>Cerita → Persamaan</>} />

      <div ref={root}>
        <div className="rv mb-6 flex flex-wrap items-center gap-3">
          <p className="mr-auto max-w-[56ch] font-tale text-[clamp(1.05rem,1.4vw,1.45rem)] leading-relaxed">
            Soal cerita adalah bahasa manusia. Ketuk sebuah gulungan untuk menerjemahkannya ke{" "}
            <b>bahasa matematika</b> — model matematika.
          </p>
          <button
            onClick={toggleChallenge}
            className={`rounded-2xl border-[3px] border-quill px-4 py-2 font-tale font-black shadow-tale-sm transition-transform hover:-translate-y-0.5 ${
              challenge ? "bg-rose text-white" : "bg-white"
            }`}
          >
            <Icon name="target" className="mr-1.5 h-6 w-6" />
            {challenge ? "Mode Tantangan: AKTIF" : "Mode Tantangan"}
          </button>
          {!challenge && (
            <button
              onClick={all}
              className="rounded-2xl border-[3px] border-quill bg-violet px-4 py-2 font-tale font-black text-white shadow-tale-sm transition-transform hover:-translate-y-0.5"
            >
              <Icon name="wand" className="mr-1.5 h-6 w-6" />
              {flipped.every(Boolean) ? "Kembalikan semua" : "Terjemahkan semua"}
            </button>
          )}
          <span className="rounded-2xl border-[3px] border-quill bg-gold px-4 py-2 font-round font-black tabular-nums shadow-tale-sm">
            <Icon name="star" className="mr-1.5 h-6 w-6" />
            {score} / {translations.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {translations.map((t, i) => (
            <div key={t.story} className="rv tr-card flip-3d">
              <div className="flip-inner relative h-full w-full">
                {/* front: the story */}
                <div
                  role={challenge ? undefined : "button"}
                  tabIndex={challenge ? -1 : 0}
                  onClick={() => !challenge && flip(i)}
                  onKeyDown={(e) => !challenge && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), flip(i))}
                  className={`flip-face relative flex h-full min-h-[clamp(190px,24vh,240px)] flex-col rounded-3xl border-[3px] border-quill bg-white p-4 shadow-tale ${
                    challenge ? "" : "cursor-pointer transition-transform hover:-translate-y-1 hover:rotate-[-1deg]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon name={t.icon} className="h-9 w-9" />
                    <span className="font-round text-xs font-black uppercase tracking-[0.2em] text-quill-soft">Cerita</span>
                  </div>
                  <p className={`mt-2 font-tale text-[clamp(1.05rem,1.3vw,1.35rem)] font-bold leading-snug ${challenge ? "" : "flex-1"}`}>“{t.story}”</p>
                  {challenge ? (
                    <div className="mt-auto grid gap-1.5 pt-3">
                      {CHOICES[i].map((c) => (
                        <button
                          key={c}
                          onClick={(e) => guess(i, c, e.currentTarget)}
                          className={`rounded-xl border-2 border-quill px-3 py-1.5 text-left text-[clamp(0.9rem,1vw,1rem)] transition-colors hover:bg-gold ${
                            wrong === `${i}:${c}` ? "bg-bad/20 line-through" : "bg-parch"
                          }`}
                        >
                          <Eq text={c} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="mt-3 font-round text-xs font-extrabold text-violet"><Icon name="pointer" className="mr-1 h-5 w-5" />ketuk untuk menerjemahkan</span>
                  )}
                </div>

                {/* back: the equation */}
                <div
                  role="button"
                  tabIndex={-1}
                  onClick={() => flip(i)}
                  className="flip-face flip-back absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-[3px] border-quill bg-[linear-gradient(160deg,#6a4bc4,#17402f)] p-4 text-parch shadow-tale"
                >
                  <span className="font-round text-xs font-black uppercase tracking-[0.25em] text-gold">Persamaan</span>
                  <span className="mt-2 rounded-2xl bg-parch px-4 py-2 text-[clamp(1.4rem,2vw,2.1rem)] text-quill">
                    <Eq text={t.eq} />
                  </span>
                  <span className="mt-3 text-center font-round text-xs font-bold text-parch/70">{t.story}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="rv mt-8 font-round text-sm font-bold text-quill-soft">
          <Icon name="bulb" className="mr-1 h-6 w-6" /> Ingat: <b>jumlah</b> → tambah, <b>selisih</b> → kurang, <b>lebih banyak</b> → “x = y + …”, <b>kali</b> → koefisien.
          Untuk roda, motor = 2 roda, mobil = 4 roda.
        </p>
      </div>
    </Section>
  );
}
