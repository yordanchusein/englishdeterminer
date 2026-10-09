/**
 * Content for the /spldv fairy-tale lesson (Modul TKA SPLDV).
 *
 * Equation strings are rendered by <Eq>: variable letters get their colour,
 * {{…}} is highlighted and [[…]] is struck out when its step appears.
 */
import type { IconName } from "@/components/spldv/Icons";


export type Step =
  | { kind: "lines"; note?: string; lines: string[] }
  | { kind: "stack"; note?: string; top: string; bottom: string; op: "+" | "−"; result: string[] };

/* ─── Bab II · Cerita → Persamaan ───────────────────────── */
export const translations: { story: string; eq: string; icon: IconName }[] = [
  { story: "jumlah x dan y adalah 30", eq: "x + y = 30", icon: "plus" },
  { story: "selisih x dan y adalah 8", eq: "x − y = 8", icon: "minus" },
  { story: "x 5 lebih banyak dari y", eq: "x = y + 5", icon: "up" },
  { story: "x 5 lebih sedikit dari y", eq: "x = y − 5", icon: "down" },
  { story: "2 kali x ditambah y adalah 20", eq: "2x + y = 20", icon: "times" },
  { story: "harga 2 buku dan 3 pensil Rp19.000", eq: "2x + 3y = 19.000", icon: "books" },
  { story: "jumlah kendaraan (motor dan mobil) 40", eq: "x + y = 40", icon: "car" },
  { story: "jumlah roda (motor dan mobil) 100", eq: "2x + 4y = 100", icon: "wheel" },
];

/* ─── Bab III · Tiga Mantra ─────────────────────────────── */
export type Method = {
  key: string;
  name: string;
  spell: string;
  icon: IconName;
  color: string;
  idea: string;
  steps: Step[];
};

const BASE: Step = {
  kind: "lines",
  note: "Dua petunjuk dari Burung Hantu Bijak:",
  lines: ["x + y = 37 ........ (1)", "x − y = 7 .......... (2)"],
};

export const methods: Method[] = [
  {
    key: "sub",
    name: "Substitusi",
    spell: "Mantra Penukar",
    icon: "swap",
    color: "#e8478f",
    idea: "Ubah satu persamaan jadi “x = …”, lalu tukarkan (substitusikan) ke persamaan lainnya.",
    steps: [
      BASE,
      { kind: "lines", note: "Dari persamaan pertama:", lines: ["x = {{37 − y}}"] },
      { kind: "lines", note: "Substitusikan ke persamaan kedua:", lines: ["{{37 − y}} − y = 7", "37 − 2y = 7"] },
      { kind: "lines", note: "Pindahkan, lalu bagi:", lines: ["37 − 7 = 2y", "30 = 2y", "15 = y"] },
      { kind: "lines", note: "Substitusi y = 15:", lines: ["x = 37 − 15", "x = 22"] },
    ],
  },
  {
    key: "eli",
    name: "Eliminasi",
    spell: "Mantra Penghilang",
    icon: "poof",
    color: "#129e94",
    idea: "Jumlahkan atau kurangkan kedua persamaan supaya salah satu variabel lenyap.",
    steps: [
      BASE,
      {
        kind: "stack",
        note: "Eliminasi x — kurangkan (1) − (2):",
        top: "[[x]] + y = 37",
        bottom: "[[x]] − y = 7",
        op: "−",
        result: ["2y = 30", "y = 15"],
      },
      {
        kind: "stack",
        note: "Eliminasi y — jumlahkan (1) + (2):",
        top: "x + [[y]] = 37",
        bottom: "x − [[y]] = 7",
        op: "+",
        result: ["2x = 44", "x = 22"],
      },
    ],
  },
  {
    key: "mix",
    name: "Campuran",
    spell: "Mantra Gabungan",
    icon: "swirl",
    color: "#6a4bc4",
    idea: "Eliminasi dulu untuk satu variabel, lalu substitusikan hasilnya. Paling cepat untuk TKA!",
    steps: [
      BASE,
      {
        kind: "stack",
        note: "Eliminasi x:",
        top: "[[x]] + y = 37",
        bottom: "[[x]] − y = 7",
        op: "−",
        result: ["2y = 30", "y = 15"],
      },
      { kind: "lines", note: "Substitusi y = 15 ke pers. (1):", lines: ["x + {{15}} = 37", "x = 37 − 15", "x = 22"] },
    ],
  },
];

/* ─── Bab IV · Peta Misi (tipe soal TKA) ────────────────── */
export type Quest = {
  id: string;
  type: string;
  place: string;
  icon: IconName;
  color: string;
  story: string;
  vars: string[];
  /** what x / y stand for */
  let: string[];
  fields: { label: string; answer: number; unit?: string }[];
  steps: Step[];
  final: string;
};

export const quests: Quest[] = [
  {
    id: "nilai",
    type: "Menentukan Nilai Variabel",
    place: "Pohon Angka",
    icon: "tree",
    color: "#e8478f",
    story: "Jumlah dua bilangan adalah 42 dan selisihnya 10. Bilangan yang lebih besar adalah ....",
    vars: ["x", "y"],
    let: ["x = bilangan besar", "y = bilangan kecil"],
    fields: [{ label: "Bilangan yang lebih besar", answer: 26 }],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["x + y = 42 ........ (1)", "x − y = 10 ........ (2)"] },
      { kind: "stack", note: "Eliminasi x:", top: "[[x]] + y = 42", bottom: "[[x]] − y = 10", op: "−", result: ["2y = 32", "y = 16"] },
      { kind: "lines", note: "Substitusi y = 16 ke pers. (1):", lines: ["x + 16 = 42", "x = 42 − 16", "x = 26"] },
    ],
    final: "Bilangan yang lebih besar adalah 26.",
  },
  {
    id: "kali",
    type: "Menentukan Hasil Kali",
    place: "Jembatan Perkalian",
    icon: "bridge",
    color: "#f08a24",
    story: "Jumlah dua bilangan cacah sama dengan 37 dan selisihnya 3. Hasil kali kedua bilangan itu adalah ...",
    vars: ["x", "y"],
    let: ["x = bilangan besar", "y = bilangan kecil"],
    fields: [{ label: "Hasil kali x · y", answer: 340 }],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["x + y = 37 ........ (1)", "x − y = 3 .......... (2)  ⟶  x = y + 3"] },
      { kind: "lines", note: "Substitusi x = y + 3 ke pers. (1):", lines: ["{{y + 3}} + y = 37", "2y = 37 − 3", "2y = 34", "y = 17"] },
      { kind: "lines", note: "Substitusi y = 17 ke pers. (2):", lines: ["x − 17 = 3", "x = 3 + 17 = 20"] },
      { kind: "lines", note: "Kembali ke pertanyaan — hasil kali!", lines: ["x · y = 20 · 17", "x · y = {{340}}"] },
    ],
    final: "Hasil kali kedua bilangan adalah 340.",
  },
  {
    id: "umur",
    type: "Menentukan Umur",
    place: "Pondok Kakak & Adik",
    icon: "cottage",
    color: "#25a06b",
    story: "Jumlah umur kakak dan adik adalah 28 tahun. Umur kakak 6 tahun lebih tua daripada adik. Berapa umur masing-masing?",
    vars: ["x", "y"],
    let: ["x = umur kakak", "y = umur adik"],
    fields: [
      { label: "Umur kakak", answer: 17, unit: "tahun" },
      { label: "Umur adik", answer: 11, unit: "tahun" },
    ],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["x + y = 28 ........ (1)", "x = 6 + y  ⟶  x − y = 6 ... (2)"] },
      { kind: "stack", note: "Eliminasi x:", top: "[[x]] + y = 28", bottom: "[[x]] − y = 6", op: "−", result: ["2y = 22", "y = 11  (Adik)"] },
      { kind: "lines", note: "Substitusi y = 11 ke pers. (1):", lines: ["x + 11 = 28", "x = 28 − 11 = 17  (Kakak)"] },
    ],
    final: "Kakak berumur 17 tahun dan adik 11 tahun.",
  },
  {
    id: "harga",
    type: "Harga Barang",
    place: "Perpustakaan Burung Hantu",
    icon: "books",
    color: "#2b8cff",
    story: "2 buku dan 3 pensil berharga Rp19.000. Sedangkan 3 buku dan 2 pensil berharga Rp21.000. Harga buku dan pensil adalah ...",
    vars: ["x", "y"],
    let: ["x = harga 1 buku", "y = harga 1 pensil"],
    fields: [
      { label: "Harga 1 buku", answer: 5000, unit: "Rp" },
      { label: "Harga 1 pensil", answer: 3000, unit: "Rp" },
    ],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["2x + 3y = 19.000 ... (1)  [×3]", "3x + 2y = 21.000 ... (2)  [×2]"] },
      { kind: "stack", note: "Samakan koefisien x, lalu eliminasi:", top: "[[6x]] + 9y = 57.000", bottom: "[[6x]] + 4y = 42.000", op: "−", result: ["5y = 15.000", "y = 3.000"] },
      { kind: "lines", note: "Substitusi y = 3.000 ke pers. (1):", lines: ["2x + 3(3.000) = 19.000", "2x = 19.000 − 9.000", "2x = 10.000", "x = 5.000"] },
    ],
    final: "Harga 1 buku Rp5.000 dan 1 pensil Rp3.000.",
  },
  {
    id: "benda",
    type: "Jumlah Benda dan Total",
    place: "Lapangan Desa Hutan",
    icon: "car",
    color: "#7c5ce6",
    story: "Di tempat parkir terdapat 30 kendaraan yang terdiri atas mobil dan motor. Jumlah seluruh roda adalah 86. Jumlah mobil dan motor masing-masing adalah ...",
    vars: ["x", "y"],
    let: ["x = banyak mobil (4 roda)", "y = banyak motor (2 roda)"],
    fields: [
      { label: "Banyak mobil", answer: 13 },
      { label: "Banyak motor", answer: 17 },
    ],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["x + y = 30 ........ (1)  ⟶  x = 30 − y", "4x + 2y = 86 ...... (2)"] },
      { kind: "lines", note: "Substitusi x = 30 − y ke pers. (2):", lines: ["4({{30 − y}}) + 2y = 86", "120 − 4y + 2y = 86", "120 − 86 = 2y", "34 = 2y", "y = 17"] },
      { kind: "lines", note: "Substitusi y = 17 ke pers. (1):", lines: ["x + 17 = 30", "x = 30 − 17 = 13"] },
    ],
    final: "Ada 13 mobil dan 17 motor.",
  },
  {
    id: "geo",
    type: "Geometri",
    place: "Padang Bunga Peri",
    icon: "flower",
    color: "#e6457a",
    story: "Sebuah taman berbentuk persegi panjang memiliki keliling 50 m. Panjang taman 5 m lebih besar daripada lebarnya. Hitung luas taman tersebut.",
    vars: ["p", "l"],
    let: ["p = panjang taman", "l = lebar taman"],
    fields: [{ label: "Luas taman", answer: 150, unit: "m²" }],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["2p + 2l = 50 ...... (1)", "p = 5 + l .......... (2)"] },
      { kind: "lines", note: "Substitusi pers. (2) ke pers. (1):", lines: ["2({{5 + l}}) + 2l = 50", "10 + 2l + 2l = 50", "4l = 50 − 10", "4l = 40", "l = 10"] },
      { kind: "lines", note: "Substitusi l = 10 ke pers. (2):", lines: ["p = 5 + 10", "p = 15"] },
      { kind: "lines", note: "Kembali ke pertanyaan — luas!", lines: ["L = p · l = 15 · 10", "L = {{150 m²}}"] },
    ],
    final: "Luas taman adalah 150 m².",
  },
  {
    id: "uang",
    type: "Uang dan Pecahan",
    place: "Peti Harta Kurcaci",
    icon: "pouch",
    color: "#d99a1e",
    story: "Sebuah kotak berisi 40 lembar uang pecahan Rp2.000 dan Rp5.000. Jumlah seluruh uang adalah Rp140.000. Berapa banyak masing-masing pecahan?",
    vars: ["x", "y"],
    let: ["x = lembar Rp2.000", "y = lembar Rp5.000"],
    fields: [
      { label: "Lembar Rp2.000", answer: 20 },
      { label: "Lembar Rp5.000", answer: 20 },
    ],
    steps: [
      {
        kind: "lines",
        note: "Model matematika:",
        lines: ["x + y = 40 .......................... (1)  ⟶  x = 40 − y", "2.000x + 5.000y = 140.000 ... (2)  ⟶  2x + 5y = 140"],
      },
      { kind: "lines", note: "Substitusi x = 40 − y ke pers. (2):", lines: ["2({{40 − y}}) + 5y = 140", "80 − 2y + 5y = 140", "3y = 140 − 80", "3y = 60", "y = 20"] },
      { kind: "lines", note: "Substitusi y = 20 ke pers. (1):", lines: ["x + 20 = 40", "x = 40 − 20 = 20"] },
    ],
    final: "Ada 20 lembar Rp2.000 dan 20 lembar Rp5.000.",
  },
  {
    id: "banding",
    type: "Membandingkan Dua Situasi",
    place: "Toko Roti Peri",
    icon: "bread",
    color: "#0fa3b1",
    story: "Paket A terdiri dari 2 roti dan 1 susu seharga Rp17.000. Paket B terdiri dari 1 roti dan 2 susu seharga Rp16.000. Jika Rani membeli 3 roti dan 2 susu, berapa yang harus dibayar?",
    vars: ["r", "s"],
    let: ["r = harga 1 roti", "s = harga 1 susu"],
    fields: [{ label: "Yang harus dibayar Rani", answer: 28000, unit: "Rp" }],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["2r + s = 17.000 ...... (1)", "r + 2s = 16.000 ...... (2)  [×2]"] },
      { kind: "lines", note: "Kalikan pers. (2) dengan 2:", lines: ["{{2r}} + 4s = 32.000 ...... (3)"] },
      { kind: "stack", note: "Eliminasi r — kurangkan (3) − (1):", top: "[[2r]] + 4s = 32.000", bottom: "[[2r]] + s = 17.000", op: "−", result: ["3s = 15.000", "s = 5.000"] },
      { kind: "lines", note: "Substitusi s = 5.000 ke pers. (1):", lines: ["2r + 5.000 = 17.000", "2r = 12.000", "r = 6.000"] },
      { kind: "lines", note: "Kembali ke pertanyaan — 3 roti dan 2 susu:", lines: ["3r + 2s = 3(6.000) + 2(5.000)", "= 18.000 + 10.000 = {{28.000}}"] },
    ],
    final: "Rani harus membayar Rp28.000.",
  },
  {
    id: "nalar",
    type: "Soal Penalaran",
    place: "Gua Teka-Teki",
    icon: "cave",
    color: "#17402f",
    story: "Diberikan: x + y = 40 dan x − y = 8. Nilai x dan y adalah ...",
    vars: ["x", "y"],
    let: ["x dan y langsung diberikan dalam soal"],
    fields: [
      { label: "Nilai x", answer: 24 },
      { label: "Nilai y", answer: 16 },
    ],
    steps: [
      { kind: "lines", note: "Model matematika:", lines: ["x + y = 40 ........ (1)", "x − y = 8 .......... (2)"] },
      { kind: "stack", note: "Eliminasi y — jumlahkan:", top: "x + [[y]] = 40", bottom: "x − [[y]] = 8", op: "+", result: ["2x = 48", "x = 24"] },
      { kind: "lines", note: "Substitusi x = 24 ke pers. (1):", lines: ["24 + y = 40", "y = 16"] },
    ],
    final: "x = 24 dan y = 16.",
  },
];

/* ─── Bab V · Strategi Cepat ────────────────────────────── */
export const strategy: { word: string; hint: string; icon: IconName }[] = [
  { word: "BACA", hint: "Cari informasi penting dalam soal.", icon: "book" },
  { word: "MISALKAN", hint: "Tentukan apa itu x dan apa itu y.", icon: "tag" },
  { word: "MODELKAN", hint: "Ubah cerita menjadi dua persamaan.", icon: "wand" },
  { word: "SELESAIKAN", hint: "Gunakan substitusi atau eliminasi.", icon: "swords" },
  { word: "KEMBALI KE PERTANYAAN", hint: "Jawab yang benar-benar ditanyakan!", icon: "tree" },
];

export const returnRules: { ask: string; then: string; icon: IconName }[] = [
  { ask: "Soal bertanya hasil kali", then: "hitung x · y", icon: "times" },
  { ask: "Soal bertanya jumlah harga", then: "hitung sesuai konteks", icon: "basket" },
  { ask: "Soal bertanya luas", then: "gunakan rumus luas", icon: "ruler" },
];

/* ─── Ujian Sang Penyihir (kuis kelas) ──────────────────── */
export type QuizQ = {
  level: 1 | 2 | 3;
  prompt: string;
  /** optional equations shown under the prompt */
  system?: string[];
  options: string[];
  answer: number;
  explanation: string;
  /** options are equations → render them with <Eq> */
  eqOptions?: boolean;
};

export const quizLevels = {
  1: { name: "Desa Jamur", sub: "Pemanasan", color: "#25a06b", icon: "mushroom", range: "Soal 1 – 5" },
  2: { name: "Hutan Kunang-Kunang", sub: "Tantangan", color: "#6a4bc4", icon: "pine", range: "Soal 6 – 10" },
  3: { name: "Sarang Naga", sub: "Level Bos", color: "#e8478f", icon: "dragon", range: "Soal 11 – 16" },
} as const;

export const quizQuestions: QuizQ[] = [
  // ───────── LEVEL 1 · DESA PERI ─────────
  {
    level: 1,
    prompt: "“Jumlah dua bilangan adalah 25.” Model matematikanya adalah …",
    options: ["x + y = 25", "x − y = 25", "x · y = 25", "2x + y = 25"],
    eqOptions: true,
    answer: 0,
    explanation: "Kata “jumlah” berarti ditambah, jadi x + y = 25.",
  },
  {
    level: 1,
    prompt: "“x 4 lebih banyak dari y.” Persamaan yang tepat adalah …",
    options: ["y = x + 4", "x = y + 4", "x = y − 4", "x + y = 4"],
    eqOptions: true,
    answer: 1,
    explanation: "x lebih banyak, berarti x sama dengan y ditambah 4: x = y + 4.",
  },
  {
    level: 1,
    prompt: "Jumlah roda x motor dan y mobil adalah 60. Persamaannya adalah …",
    options: ["x + y = 60", "4x + 2y = 60", "2x + 4y = 60", "6xy = 60"],
    eqOptions: true,
    answer: 2,
    explanation: "Motor beroda 2 dan mobil beroda 4, jadi 2x + 4y = 60.",
  },
  {
    level: 1,
    prompt: "Manakah yang merupakan SPLDV?",
    options: ["x + y = 10 dan x − y = 2", "x² + y = 5 dan x − y = 1", "x + y + z = 6 dan x − z = 2", "2x = 8"],
    eqOptions: true,
    answer: 0,
    explanation: "SPLDV = dua persamaan linear (pangkat 1) dengan dua variabel. x² tidak linear, z adalah variabel ketiga, dan 2x = 8 hanya satu persamaan.",
  },
  {
    level: 1,
    prompt: "Pasangan (x, y) mana yang memenuhi kedua persamaan sekaligus?",
    system: ["x + y = 8", "x − y = 2"],
    options: ["(5, 3)", "(6, 2)", "(4, 4)", "(3, 5)"],
    answer: 0,
    explanation: "5 + 3 = 8 ✓ dan 5 − 3 = 2 ✓. Pasangan lain hanya cocok dengan satu persamaan.",
  },

  // ───────── LEVEL 2 · HUTAN AJAIB ─────────
  {
    level: 2,
    prompt: "Nilai x dari sistem berikut adalah …",
    system: ["x + y = 20", "x − y = 6"],
    options: ["7", "10", "13", "14"],
    answer: 2,
    explanation: "Jumlahkan: 2x = 26, jadi x = 13 (dan y = 7).",
  },
  {
    level: 2,
    prompt: "Dengan eliminasi, nilai x dari sistem berikut adalah …",
    system: ["2x + y = 11", "x + y = 7"],
    options: ["3", "4", "5", "7"],
    answer: 1,
    explanation: "Kurangkan (1) − (2): y lenyap, tersisa x = 4. Lalu y = 7 − 4 = 3.",
  },
  {
    level: 2,
    prompt: "Dengan substitusi, nilai y dari sistem berikut adalah …",
    system: ["y = 2x", "x + y = 18"],
    options: ["6", "9", "12", "18"],
    answer: 2,
    explanation: "Substitusi y = 2x: x + 2x = 18 → 3x = 18 → x = 6, maka y = 2 · 6 = 12.",
  },
  {
    level: 2,
    prompt: "Nilai x + y dari sistem berikut adalah …",
    system: ["3x + 2y = 16", "x + 2y = 8"],
    options: ["2", "4", "6", "8"],
    answer: 2,
    explanation: "Kurangkan: 2x = 8 → x = 4. Lalu 4 + 2y = 8 → y = 2. Jangan berhenti! x + y = 6.",
  },
  {
    level: 2,
    prompt: "Agar y bisa dieliminasi dari sistem ini, langkah pertama yang tepat adalah …",
    system: ["2x + 3y = 12", "x + y = 5"],
    options: ["Kalikan pers. (2) dengan 3", "Kalikan pers. (1) dengan 2", "Bagi pers. (1) dengan 3", "Langsung jumlahkan keduanya"],
    answer: 0,
    explanation: "Koefisien y adalah 3 dan 1. Kalikan pers. (2) dengan 3 agar sama-sama 3y, lalu kurangkan.",
  },

  // ───────── LEVEL 3 · ISTANA NAGA ─────────
  {
    level: 3,
    prompt: "Jumlah umur ayah dan anak adalah 50 tahun. Umur ayah 26 tahun lebih tua daripada anak. Umur anak adalah …",
    options: ["12 tahun", "13 tahun", "24 tahun", "38 tahun"],
    answer: 0,
    explanation: "x + y = 50 dan x − y = 26. Kurangkan: 2y = 24 → y = 12 tahun (ayah 38 tahun).",
  },
  {
    level: 3,
    prompt: "3 apel dan 2 jeruk harganya Rp13.000. 1 apel dan 2 jeruk harganya Rp7.000. Harga 1 jeruk adalah …",
    options: ["Rp2.000", "Rp2.500", "Rp3.000", "Rp4.000"],
    answer: 0,
    explanation: "Kurangkan: 2a = 6.000 → a = 3.000. Lalu 3.000 + 2j = 7.000 → j = Rp2.000.",
  },
  {
    level: 3,
    prompt: "Di lapangan desa hutan ada 25 kendaraan (motor dan mobil) dengan total 70 roda. Banyak mobil adalah …",
    options: ["10", "12", "15", "20"],
    answer: 0,
    explanation: "x + y = 25 dan 2x + 4y = 70 (x motor, y mobil). Bagi 2: x + 2y = 35. Kurangkan: y = 10 mobil.",
  },
  {
    level: 3,
    prompt: "Keliling sebuah kebun persegi panjang 36 cm. Panjangnya 4 cm lebih dari lebarnya. Luas kebun adalah …",
    options: ["18 cm²", "63 cm²", "77 cm²", "88 cm²"],
    answer: 2,
    explanation: "2(l + 4) + 2l = 36 → 4l = 28 → l = 7, p = 11. Kembali ke pertanyaan: L = 11 · 7 = 77 cm².",
  },
  {
    level: 3,
    prompt: "Jumlah dua bilangan adalah 30 dan selisihnya 6. Hasil kali kedua bilangan itu adalah …",
    options: ["12", "18", "196", "216"],
    answer: 3,
    explanation: "Bilangannya 18 dan 12. Yang ditanya hasil kali: 18 · 12 = 216.",
  },
  {
    level: 3,
    prompt: "Paket A: 2 pensil + 1 buku = Rp8.000. Paket B: 1 pensil + 2 buku = Rp10.000. Harga 1 pensil + 1 buku adalah …",
    options: ["Rp4.000", "Rp6.000", "Rp9.000", "Rp18.000"],
    answer: 1,
    explanation: "Trik cepat: jumlahkan kedua paket → 3 pensil + 3 buku = Rp18.000, jadi 1 pensil + 1 buku = Rp6.000.",
  },
];
