export type CategoryKey =
  | "articles"
  | "demonstratives"
  | "possessives"
  | "quantifiers"
  | "numbers"
  | "distributives"
  | "interrogatives";

export type Category = {
  key: CategoryKey;
  no: string;
  title: string;
  tagline: string;
  color: string;
  tint: string;
  words: string[];
  rules: { h: string; t: string }[];
  /** Words wrapped in **double asterisks** get highlighted. */
  examples: string[];
  watch: { wrong: string; right: string; note: string };
  summary: string;
  recapExample: string;
};

export const categories: Category[] = [
  {
    key: "articles",
    no: "01",
    title: "Articles",
    tagline: "Is it any one, or a specific one?",
    color: "#FF7A45",
    tint: "#FFF0E6",
    words: ["a", "an", "the", "Ø"],
    rules: [
      { h: "a / an", t: "Singular countable noun, not specific. Choose by SOUND, not by letter." },
      { h: "the", t: "Specific or already known, unique things, superlatives, rivers & seas." },
      { h: "Ø (no article)", t: "General plural or uncountable nouns: Water is essential." },
    ],
    examples: [
      "We climbed **a** mountain. **The** mountain was 3,000 m high.",
      "It takes **an** hour to reach **the** summit.",
      "**The** Himalayas are **the** highest mountains on Earth.",
    ],
    watch: { wrong: "an university", right: "a university", note: "u = /j/ sound (consonant)" },
    summary: "a/an = any one (choose by sound) · the = specific, unique, superlative",
    recapExample: "an hour · a university · the best",
  },
  {
    key: "demonstratives",
    no: "02",
    title: "Demonstratives",
    tagline: "Near or far? One or many?",
    color: "#2B8CFF",
    tint: "#E6F2FF",
    words: ["this", "that", "these", "those"],
    rules: [
      { h: "this / these", t: "Near the speaker (in place or time). this + singular, these + plural." },
      { h: "that / those", t: "Far from the speaker. that + singular, those + plural." },
      { h: "time", t: "these days = nowadays · in those days = in the past." },
    ],
    examples: [
      "**This** trail is steep, but **that** one looks easier.",
      "**These** boots are mine; **those** over there are yours.",
      "In **those** days, people climbed without GPS.",
    ],
    watch: { wrong: "this boots", right: "these boots", note: "plural noun → these / those" },
    summary: "this/these = near · that/those = far · -se forms for plural",
    recapExample: "this map · those tents",
  },
  {
    key: "possessives",
    no: "03",
    title: "Possessives",
    tagline: "Who does it belong to?",
    color: "#E6457A",
    tint: "#FDE8EF",
    words: ["my", "your", "his", "her", "its", "our", "their"],
    rules: [
      { h: "ownership", t: "Shows who owns the noun. It agrees with the OWNER, not the object." },
      { h: "no double", t: "Never combine with an article: ✗ the my bag → ✓ my bag." },
      { h: "its ≠ it's", t: "its = belonging to it · it's = it is / it has." },
    ],
    examples: [
      "**Our** guide checked **his** compass twice.",
      "The eagle spread **its** wings over the valley.",
      "Rina and Dimas packed **their** tents early.",
    ],
    watch: { wrong: "it's wings", right: "its wings", note: "no apostrophe for possession" },
    summary: "my · your · his · her · its · our · their — match the owner",
    recapExample: "its wings · their tents",
  },
  {
    key: "quantifiers",
    no: "04",
    title: "Quantifiers",
    tagline: "How many? How much?",
    color: "#25A06B",
    tint: "#E5F6EC",
    words: ["many", "much", "a few", "a little", "few", "little", "some", "any", "no"],
    rules: [
      { h: "countable", t: "many · a few · few · fewer — marbles, people, friends." },
      { h: "uncountable", t: "much · a little · little · less — water, time, information." },
      { h: "both", t: "some (+ offers) · any (– / ?) · a lot of · no · enough." },
    ],
    examples: [
      "We don't have **much** water, but we have **a few** snacks.",
      "**Few** hikers reached the top because of the storm.",
      "Would you like **some** tea?",
    ],
    watch: { wrong: "less people", right: "fewer people", note: "people is countable" },
    summary: "many/few + countable · much/little + uncountable · a few = some, few = almost none",
    recapExample: "a few friends · little time",
  },
  {
    key: "numbers",
    no: "05",
    title: "Numbers",
    tagline: "How many exactly? In what order?",
    color: "#E8A200",
    tint: "#FFF6DC",
    words: ["one", "two", "three", "first", "second", "last"],
    rules: [
      { h: "cardinal", t: "Exact quantity: one, two, three, a hundred…" },
      { h: "ordinal", t: "Position or order: first, second, third, next, last — usually with the." },
      { h: "order", t: "Ordinal comes BEFORE cardinal: the first two days." },
    ],
    examples: [
      "**Three** climbers started at dawn.",
      "She was **the first** woman to reach the peak.",
      "We spent **the first two** nights at base camp.",
    ],
    watch: { wrong: "the two first days", right: "the first two days", note: "ordinal before cardinal" },
    summary: "cardinal = how many (two) · ordinal = which position (the second)",
    recapExample: "three hikers · the first day",
  },
  {
    key: "distributives",
    no: "06",
    title: "Distributives",
    tagline: "One by one, all together, or one of two?",
    color: "#7C5CE6",
    tint: "#EFEAFD",
    words: ["each", "every", "either", "neither", "another", "other"],
    rules: [
      { h: "each / every", t: "+ singular noun. each = individually · every = all as a group." },
      { h: "either / neither", t: "Choice between TWO. either = one or the other · neither = not one." },
      { h: "another / other", t: "another + singular (one more) · other + plural." },
    ],
    examples: [
      "**Each** hiker carries a map and a whistle.",
      "We check the weather **every** morning.",
      "**Either** route is fine; **neither** path is closed.",
    ],
    watch: { wrong: "every students", right: "every student", note: "each / every + singular" },
    summary: "each/every + singular · either/neither = out of two · another + singular",
    recapExample: "every morning · neither route",
  },
  {
    key: "interrogatives",
    no: "07",
    title: "Interrogatives",
    tagline: "Asking which, what, and whose.",
    color: "#0FA3B1",
    tint: "#E2F6F7",
    words: ["which", "what", "whose"],
    rules: [
      { h: "which", t: "Limited choice — the options are known." },
      { h: "what", t: "Open choice — any possible answer." },
      { h: "whose", t: "Asks about the owner." },
    ],
    examples: [
      "**Which** trail is safer, north or south?",
      "**What** time should we leave the camp?",
      "**Whose** backpack is this?",
    ],
    watch: { wrong: "Who's bag is this?", right: "Whose bag is this?", note: "who's = who is" },
    summary: "which = limited choice · what = open choice · whose = owner",
    recapExample: "Which path? · Whose jacket?",
  },
];

export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c])) as Record<
  CategoryKey,
  Category
>;
