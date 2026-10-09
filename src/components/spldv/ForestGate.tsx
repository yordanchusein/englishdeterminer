"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-lite";
import { GreatTree, Hills, Moon, Pine, Sparkle, Stars, TreeLine } from "./Scenery";
import Icon from "./Icons";
import { ambient } from "./ambient";

export default function ForestGate({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 10%", scrub: 0.6 } })
        .fromTo(".cg-castle", { yPercent: 40, scale: 0.8 }, { yPercent: 0, scale: 1, ease: "none" }, 0)
        .fromTo(".cg-moon", { y: 160 }, { y: 0, ease: "none" }, 0)
        .fromTo(".cg-text", { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.2);
      ambient(root.current!, () => {
        gsap.to(".cg-btn-glow", { scale: 1.25, opacity: 0, duration: 1.4, repeat: -1, ease: "power2.out" });
        gsap.to(".cg-spark", { rotation: 180, scale: "random(0.6,1.3)", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.3 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gerbang" data-stop className="tale-night relative flex h-screen flex-col items-center overflow-hidden">
      <Stars count={80} seed={33} />
      <Moon className="cg-moon absolute left-[8%] top-[10%] w-[clamp(100px,11vw,190px)]" />

      <div className="cg-text relative z-10 mt-[13vh] px-[5vw] text-center text-parch">
        <p className="font-round text-sm font-black uppercase tracking-[0.4em] text-gold">Bab Terakhir</p>
        <h2 className="mt-3 font-tale text-[clamp(2.6rem,6.5vw,6.5rem)] font-black leading-[0.95]">Ujian Penyihir Hutan</h2>
        <p className="mx-auto mt-4 max-w-[52ch] font-tale text-[clamp(1.05rem,1.5vw,1.5rem)] italic text-parch/85">
          16 soal, 3 wilayah hutan: Desa Jamur, Hutan Kunang-Kunang, dan Sarang Naga. Jawab bersama satu kelas dan raih gelar Penyihir Agung!
        </p>
        <button
          onClick={onStart}
          className="relative mt-8 rounded-full border-[4px] border-quill bg-gold px-10 py-4 font-tale text-[clamp(1.3rem,2vw,2rem)] font-black text-quill shadow-[6px_6px_0_#06140f] transition-transform hover:-translate-y-1 hover:rotate-[-1deg] active:translate-y-0.5"
        >
          <span className="cg-btn-glow pointer-events-none absolute inset-0 rounded-full border-[4px] border-gold" />
          <Icon name="tree" className="mr-2 h-9 w-9 align-[-0.3em]" />Masuki Hutan
        </button>
        <p className="mt-3 font-round text-sm font-bold text-parch/60">atau tekan Enter</p>
      </div>

      <TreeLine seed={8} className="absolute inset-x-0 bottom-[16vh] h-[26vh] w-full" fill="#17402f" />
      <Hills layer="mid" className="absolute inset-x-0 bottom-0 h-[30vh] w-full" />
      <div className="cg-castle absolute inset-x-0 bottom-[10vh] flex justify-center">
        <GreatTree className="w-[clamp(260px,32vw,540px)] drop-shadow-[0_0_50px_rgba(255,214,107,0.3)]" />
      </div>
      <Hills layer="front" className="absolute inset-x-0 -bottom-[2px] h-[14vh] w-full" />
      <Pine className="absolute bottom-[4vh] left-[14%] w-[3.4vw]" />
      <Pine className="absolute bottom-[5vh] right-[16%] w-[3.8vw]" />
      <Sparkle className="cg-spark absolute left-[24%] top-[46%] w-8" />
      <Sparkle className="cg-spark absolute right-[26%] top-[40%] w-6" fill="#ff7eb3" />
      <Sparkle className="cg-spark absolute right-[12%] top-[22%] w-7" fill="#7be0d4" />

      <p className="absolute bottom-3 z-10 font-round text-xs font-bold text-parch/50">Modul TKA SPLDV · Matematika TKA 2026</p>
    </section>
  );
}
