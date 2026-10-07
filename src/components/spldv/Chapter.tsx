"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Sparkle } from "./Scenery";

/** Chapter heading in the storybook style: “Bab II · …”. */
export function ChapterTitle({ num, title, kicker, light = false }: { num: string; title: ReactNode; kicker: string; light?: boolean }) {
  return (
    <div className="rv mb-[3vh]">
      <div className="flex items-center gap-3">
        <span className="rounded-full border-[3px] border-quill bg-gold px-4 py-1 font-tale text-sm font-black text-quill shadow-tale-sm">
          Bab {num}
        </span>
        <Sparkle className="w-5" fill={light ? "#f7c548" : "#e8478f"} />
        <span className={`font-round text-xs font-extrabold uppercase tracking-[0.3em] ${light ? "text-parch/70" : "text-quill-soft"}`}>
          {kicker}
        </span>
      </div>
      <h2
        className={`mt-3 font-tale text-[clamp(2.2rem,4.6vw,4.8rem)] font-black leading-[0.95] tracking-tight ${
          light ? "text-parch" : "text-quill"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/**
 * A full-height storybook section that fades its `.rv` children in when it
 * scrolls into view, and is a keyboard “stop” for the presenter.
 */
export function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        ".rv",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
        },
      );
    },
    { scope: root },
  );
  return (
    <section ref={root} id={id} data-stop className={`relative min-h-screen overflow-hidden px-[5vw] py-[12vh] ${className}`}>
      {children}
    </section>
  );
}
