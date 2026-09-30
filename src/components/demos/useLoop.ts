"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export type DemoProps = { active: boolean; color: string };

/**
 * Builds a looping timeline once, then plays it only while its panel is
 * active — so off-screen demos don't burn frames.
 */
export function useLoop(
  scope: RefObject<HTMLElement | null>,
  active: boolean,
  build: (tl: gsap.core.Timeline, q: <T extends Element = HTMLElement>(sel: string) => T[]) => void,
) {
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const q = <T extends Element = HTMLElement>(sel: string) =>
        gsap.utils.toArray<T>(sel, scope.current);
      tl.current = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.2 });
      build(tl.current, q);
    },
    { scope },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (active) t.restart();
    else t.pause();
  }, [active]);
}
