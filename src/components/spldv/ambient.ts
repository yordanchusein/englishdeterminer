import { gsap, ScrollTrigger } from "@/lib/gsap-lite";

/**
 * Runs looping “ambient” tweens (glows, wings, fireflies…) only while their
 * section is on screen; off screen they're paused and the section gets
 * `.is-off`, which also pauses its CSS star twinkles. Call inside useGSAP so
 * the context and trigger are cleaned up with the component.
 */
export function ambient(trigger: Element, create: () => void) {
  const ctx = gsap.context(create, trigger);
  const apply = (on: boolean) => {
    ctx.getTweens().forEach((t: gsap.core.Animation) => (on ? t.resume() : t.pause()));
    trigger.classList.toggle("is-off", !on);
  };
  const st = ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => apply(self.isActive),
  });
  if (!st.isActive) apply(false);
  return st;
}
