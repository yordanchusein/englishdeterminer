"use client";

import { useEffect, useId, useRef, useState } from "react";
import { whiteboardButton } from "./whiteboardStyles";

const SIZES = [
  { value: 3, label: "Tipis" },
  { value: 5, label: "Sedang" },
  { value: 10, label: "Tebal" },
];

export default function PenSizePicker({ value, color, onChange }: { value: number; color: string; onChange: (value: number) => void }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const selected = SIZES.find((size) => size.value === value) ?? SIZES[1];

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    const outside = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function choose(next: number) {
    onChange(next);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div ref={root} className="relative flex min-h-12 flex-wrap items-center gap-2 px-1" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <span id={`${id}-label`} className="font-bold">Ukuran pena</span>
      <div className="relative">
        <button ref={trigger} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? `${id}-menu` : undefined} aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => setOpen(!open)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
            }
          }}
          className={`${whiteboardButton} min-w-44`}>
          <span aria-hidden="true" className="flex w-5 items-center justify-center"><span className="rounded-full" style={{ width: value, height: value, backgroundColor: color }} /></span>
          <span id={`${id}-value`} className="flex-1 text-left">{selected.label} <span className="text-sm text-quill-soft">· {value} px</span></span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`size-4 text-quill-soft ${open ? "rotate-180" : ""}`}><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div id={`${id}-menu`} role="menu" aria-labelledby={`${id}-label`} className="absolute left-0 top-full z-30 mt-3 w-56 max-w-[calc(100vw-3rem)] rounded-2xl border-2 border-quill bg-parch p-2 shadow-tale"
            onKeyDown={(event) => {
              const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
              const current = options.indexOf(document.activeElement as HTMLButtonElement);
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                trigger.current?.focus();
              } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
                options[next]?.focus();
              } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
                const match = SIZES.findIndex((size) => size.label.toLowerCase().startsWith(event.key.toLowerCase()));
                if (match >= 0) { event.preventDefault(); options[match]?.focus(); }
              }
            }}>
            {SIZES.map((size) => (
              <button key={size.value} type="button" role="menuitemradio" aria-checked={value === size.value} tabIndex={-1} onClick={() => choose(size.value)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left outline-none hover:bg-gold/30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet ${value === size.value ? "bg-violet/10" : ""}`}>
                <span aria-hidden="true" className="w-9 shrink-0 rounded-full" style={{ height: size.value, backgroundColor: color }} />
                <span className="flex-1"><span className="block font-bold">{size.label}</span><span className="block text-xs text-quill-soft">{size.value} px</span></span>
                <span aria-hidden="true" className="w-4 font-black text-violet">{value === size.value ? "✓" : ""}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
