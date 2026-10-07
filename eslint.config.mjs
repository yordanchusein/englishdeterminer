import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // GSAP's contextSafe(fn) wraps event handlers during render; the React
    // Compiler rule wrongly assumes those handlers read refs while rendering.
    files: ["src/components/Recap.tsx", "src/components/quiz/QuestionCard.tsx", "src/components/quiz/Quiz.tsx", "src/components/spldv/**/*.tsx"],
    rules: { "react-hooks/refs": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
