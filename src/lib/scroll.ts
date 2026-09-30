import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

/**
 * "Stops" are the scroll positions the presenter jumps between with the
 * keyboard. Plain sections mark themselves with [data-stop]; pinned sections
 * (like the horizontal category track) register a function instead.
 */
const stopFns = new Map<string, () => number[]>();

export function registerStops(id: string, fn: () => number[]) {
  stopFns.set(id, fn);
  return () => {
    stopFns.delete(id);
  };
}

export function getStops(): number[] {
  const stops: number[] = [];
  document.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
    stops.push(Math.round(el.getBoundingClientRect().top + window.scrollY));
  });
  stopFns.forEach((fn) => stops.push(...fn().map(Math.round)));
  stops.sort((a, b) => a - b);
  return stops.filter((v, i) => i === 0 || v - stops[i - 1] > 4);
}
