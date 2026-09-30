import type { CategoryKey } from "./categories";

type Base = {
  level: 1 | 2 | 3;
  category: CategoryKey;
  explanation: string;
};

/** Prompts use "___" for each gap. */
export type MCQuestion = Base & { type: "mc"; prompt: string; options: string[]; answer: number };
export type FillQuestion = Base & { type: "fill"; prompt: string; chips: string[]; answers: string[] };
export type SpotQuestion = Base & {
  type: "spot";
  sentence: string;
  wrongIndex: number;
  correction: string;
};
export type Question = MCQuestion | FillQuestion | SpotQuestion;

export type Answer = { correct: boolean; given: string };

export function answerText(q: Question) {
  if (q.type === "mc") return q.options[q.answer];
  if (q.type === "fill") return q.answers.join(" / ");
  return `${q.sentence.split(" ")[q.wrongIndex]} → ${q.correction}`;
}

export const levels = {
  1: { name: "Base Camp", sub: "Warm-up", color: "#25A06B", range: "Questions 1 – 7" },
  2: { name: "The Ridge", sub: "Challenge", color: "#2B8CFF", range: "Questions 8 – 14" },
  3: { name: "The Summit", sub: "Boss level", color: "#E6457A", range: "Questions 15 – 20" },
} as const;

export const questions: Question[] = [
  // ───────── LEVEL 1 · BASE CAMP ─────────
  {
    level: 1,
    category: "articles",
    type: "mc",
    prompt: "My cousin is ___ university student in Bandung.",
    options: ["a", "an", "the", "any"],
    answer: 0,
    explanation: "“University” starts with the consonant sound /j/ (you-ni-ver-si-ty), so we use a, not an.",
  },
  {
    level: 1,
    category: "articles",
    type: "mc",
    prompt: "It took us ___ hour to reach the waterfall.",
    options: ["a", "an", "the", "some"],
    answer: 1,
    explanation: "The h in “hour” is silent, so the word begins with a vowel sound /aʊ/ → an hour.",
  },
  {
    level: 1,
    category: "articles",
    type: "fill",
    prompt: "___ Nile is the longest river in Africa.",
    chips: ["A", "An", "The", "Some"],
    answers: ["The"],
    explanation: "Names of rivers, seas and oceans take the: the Nile, the Pacific, the Red Sea.",
  },
  {
    level: 1,
    category: "demonstratives",
    type: "mc",
    prompt: "Could you pass me ___ scissors next to you? I can't reach them.",
    options: ["this", "that", "these", "those"],
    answer: 3,
    explanation: "“Scissors” is plural, and they are far from the speaker (out of reach) → those.",
  },
  {
    level: 1,
    category: "demonstratives",
    type: "mc",
    prompt: "___ days, many teenagers spend hours on social media.",
    options: ["This", "That", "These", "Those"],
    answer: 2,
    explanation: "“These days” means nowadays (the present). “Those days” refers to the past.",
  },
  {
    level: 1,
    category: "possessives",
    type: "fill",
    prompt: "The company changed ___ logo last year.",
    chips: ["its", "it's", "his", "her"],
    answers: ["its"],
    explanation: "A company is a thing → its. Remember: it's = it is / it has.",
  },
  {
    level: 1,
    category: "possessives",
    type: "spot",
    sentence: "The students must bring his own laptop tomorrow.",
    wrongIndex: 4,
    correction: "their",
    explanation: "The owners are “the students” (plural) → their own laptop.",
  },

  // ───────── LEVEL 2 · THE RIDGE ─────────
  {
    level: 2,
    category: "quantifiers",
    type: "mc",
    prompt: "There isn't ___ information about the event on the website.",
    options: ["many", "much", "few", "a few"],
    answer: 1,
    explanation: "“Information” is uncountable → much (common in negatives and questions).",
  },
  {
    level: 2,
    category: "quantifiers",
    type: "mc",
    prompt: "Would you like ___ tea before we continue hiking?",
    options: ["some", "any", "many", "few"],
    answer: 0,
    explanation: "In offers and requests we use some, even in questions, because we expect “yes”.",
  },
  {
    level: 2,
    category: "quantifiers",
    type: "spot",
    sentence: "We have very few time before the exam starts.",
    wrongIndex: 3,
    correction: "little",
    explanation: "“Time” is uncountable → little. Few is only for countable plural nouns.",
  },
  {
    level: 2,
    category: "distributives",
    type: "fill",
    prompt: "___ of the two answers is correct, so you get zero points.",
    chips: ["Either", "Neither", "Both", "Each"],
    answers: ["Neither"],
    explanation: "Zero points = not one of the two is correct → Neither (+ singular verb “is”).",
  },
  {
    level: 2,
    category: "distributives",
    type: "mc",
    prompt: "___ participant will receive a certificate after the seminar.",
    options: ["Each", "All", "Both", "Most"],
    answer: 0,
    explanation: "“Participant” is singular → each. All / most need a plural noun; both is only for two.",
  },
  {
    level: 2,
    category: "distributives",
    type: "mc",
    prompt: "I don't like this shirt. Can I see ___ one?",
    options: ["other", "another", "others", "the others"],
    answer: 1,
    explanation: "Another = one more / a different one, followed by a singular noun (one).",
  },
  {
    level: 2,
    category: "quantifiers",
    type: "spot",
    sentence: "There were less people at the concert than we expected.",
    wrongIndex: 2,
    correction: "fewer",
    explanation: "“People” is countable → fewer. Less is for uncountable nouns (less time, less water).",
  },

  // ───────── LEVEL 3 · THE SUMMIT ─────────
  {
    level: 3,
    category: "interrogatives",
    type: "mc",
    prompt: "___ route is faster to the summit, the northern one or the southern one?",
    options: ["What", "Which", "Whose", "Who"],
    answer: 1,
    explanation: "There is a limited choice (only two routes) → which.",
  },
  {
    level: 3,
    category: "articles",
    type: "mc",
    prompt: "Indonesia is ___ largest archipelagic country in the world.",
    options: ["a", "an", "the", "—"],
    answer: 2,
    explanation: "Superlatives (the largest, the best, the most…) always take the.",
  },
  {
    level: 3,
    category: "quantifiers",
    type: "fill",
    prompt: "He has ___ friends at his new school, so he never feels lonely.",
    chips: ["a few", "few", "a little", "little"],
    answers: ["a few"],
    explanation: "“Friends” is countable and the meaning is positive (never lonely) → a few. Few = almost none.",
  },
  {
    level: 3,
    category: "quantifiers",
    type: "mc",
    prompt: "___ student brought a dictionary, so the whole class had to share the teacher's.",
    options: ["No", "Any", "Some", "Every"],
    answer: 0,
    explanation: "Nobody brought one → no + noun (= not any). “Every” would contradict the sentence.",
  },
  {
    level: 3,
    category: "articles",
    type: "fill",
    prompt:
      "I bought ___ umbrella and ___ raincoat yesterday. Sadly, ___ umbrella broke on ___ first rainy day.",
    chips: ["a", "an", "the"],
    answers: ["an", "a", "the", "the"],
    explanation:
      "First mention → an umbrella, a raincoat. Second mention → the umbrella. Ordinals take the → the first day.",
  },
  {
    level: 3,
    category: "quantifiers",
    type: "mc",
    prompt: "Unfortunately, very ___ tourists visit the village, so the local shops are struggling.",
    options: ["few", "little", "a few", "many"],
    answer: 0,
    explanation:
      "“Tourists” is countable and the meaning is negative → very few. Little is for uncountable; “very a few” is wrong.",
  },
];
