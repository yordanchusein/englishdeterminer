"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; width: number; erase: boolean };
const WIDTH = 1200;
const HEIGHT = 700;
const COLORS = [
  { name: "Ungu", value: "#2b1d4f" },
  { name: "Merah muda", value: "#c5266b" },
  { name: "Hijau", value: "#087e76" },
  { name: "Biru", value: "#245bc2" },
];
const button = "min-h-11 rounded-xl border-2 border-quill/25 bg-white px-4 py-2 font-bold transition-colors hover:bg-gold/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet disabled:opacity-40 disabled:cursor-not-allowed";

function paint(canvas: HTMLCanvasElement, strokes: Stroke[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  for (const stroke of strokes) {
    ctx.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const first = stroke.points[0];
    if (!first) continue;
    ctx.beginPath();
    if (stroke.points.length === 1) {
      ctx.arc(first.x, first.y, stroke.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(first.x, first.y);
      for (const point of stroke.points.slice(1)) ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation = "source-over";
}

export default function Whiteboard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = useRef<{ id: number; stroke: Stroke } | null>(null);
  const [history, setHistory] = useState<Stroke[][]>([[]]);
  const [cursor, setCursor] = useState(0);
  const [color, setColor] = useState(COLORS[0].value);
  const [width, setWidth] = useState(5);
  const [erase, setErase] = useState(false);
  const [grid, setGrid] = useState(true);
  const strokes = history[cursor];

  useEffect(() => {
    if (canvas.current) paint(canvas.current, strokes);
  }, [strokes]);

  function commit(next: Stroke[]) {
    setHistory((previous) => [...previous.slice(0, cursor + 1), next]);
    setCursor(cursor + 1);
  }

  function point(event: PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * WIDTH / rect.width, y: (event.clientY - rect.top) * HEIGHT / rect.height };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (active.current || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke = { points: [point(event)], color, width: erase ? width * 6 : width, erase };
    active.current = { id: event.pointerId, stroke };
    paint(event.currentTarget, [...strokes, stroke]);
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (active.current?.id !== event.pointerId) return;
    active.current.stroke.points.push(point(event));
    paint(event.currentTarget, [...strokes, active.current.stroke]);
  }

  function finish(event: PointerEvent<HTMLCanvasElement>) {
    if (active.current?.id !== event.pointerId) return;
    const stroke = active.current.stroke;
    active.current = null;
    commit([...strokes, stroke]);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function download() {
    if (!canvas.current) return;
    const output = document.createElement("canvas");
    output.width = WIDTH;
    output.height = HEIGHT;
    const ctx = output.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fbf1dc";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(canvas.current, 0, 0);
    const link = document.createElement("a");
    link.download = "papan-mantra-spldv.png";
    link.href = output.toDataURL("image/png");
    link.click();
  }

  return (
    <main lang="id" className="tale-parch min-h-dvh p-4 font-round text-quill sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-quill-soft">Ruang belajar kerajaan</p>
            <h1 className="font-tale text-4xl font-black sm:text-5xl">Papan Mantra</h1>
          </div>
          <Link href="/spldv" className={button}>Kembali ke materi</Link>
        </header>
        <p className="mb-4">Tulis persamaan, coret langkah, dan temukan nilai x serta y. Gunakan mouse, stylus, atau jari.</p>
        <div aria-label="Alat papan tulis" className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-quill/20 bg-parch-deep/60 p-3">
          <button className={button} aria-pressed={!erase} onClick={() => setErase(false)}>Pena</button>
          <button className={button} aria-pressed={erase} onClick={() => setErase(true)}>Penghapus{erase ? " aktif" : ""}</button>
          <div className="flex gap-2" role="group" aria-label="Warna pena">
            {COLORS.map((item) => <button key={item.value} aria-label={item.name} aria-pressed={color === item.value && !erase} onClick={() => { setColor(item.value); setErase(false); }} className="flex size-11 items-center justify-center rounded-full border-2 border-white text-xl text-white outline-offset-2 focus-visible:outline-2 focus-visible:outline-quill" style={{ background: item.value }}>{color === item.value && !erase ? "✓" : ""}</button>)}
          </div>
          <label className="flex min-h-11 items-center gap-2 px-2 font-bold">Ukuran
            <select value={width} onChange={(event) => setWidth(Number(event.target.value))} className="min-h-11 rounded-lg border border-quill/30 bg-white px-2">
              <option value={3}>Tipis</option><option value={5}>Sedang</option><option value={10}>Tebal</option>
            </select>
          </label>
          <button className={button} disabled={cursor === 0} onClick={() => setCursor(cursor - 1)}>Undo</button>
          <button className={button} disabled={cursor === history.length - 1} onClick={() => setCursor(cursor + 1)}>Redo</button>
          <button className={button} style={grid ? { backgroundColor: "#6a4bc4", color: "#fff", borderColor: "#6a4bc4" } : undefined} aria-pressed={grid} onClick={() => setGrid(!grid)}>Kisi {grid ? "aktif" : "nonaktif"}</button>
          <button className={button} disabled={!strokes.length} onClick={() => commit([])}>Bersihkan</button>
          <button className={button} onClick={download}>Simpan PNG</button>
        </div>
        <div className="overflow-hidden rounded-2xl border-4 border-quill bg-parch shadow-tale" style={grid ? {
          backgroundImage: "radial-gradient(circle, #89729a 2px, transparent 2px), linear-gradient(to right, rgba(93,77,133,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(93,77,133,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "12px 12px, 0 0, 0 0",
        } : undefined}>
          <canvas ref={canvas} width={WIDTH} height={HEIGHT} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} aria-label="Area menggambar bebas. Gunakan mouse, stylus, atau jari untuk menulis." className="block aspect-[12/7] w-full touch-none" style={{ cursor: erase ? "cell" : "crosshair" }}>Papan tulis membutuhkan browser yang mendukung canvas.</canvas>
        </div>
        <p className="mt-5 text-sm text-quill-soft">Salah hapus? Tekan Undo. Unduh PNG sebelum meninggalkan halaman; coretan hanya tersimpan selama halaman ini terbuka. Putar ponsel ke posisi mendatar untuk ruang tulis lebih luas.</p>
      </div>
    </main>
  );
}
