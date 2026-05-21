/*
 * Static reference content for the Learn page.
 *
 * This mirrors the backend engine in `backend/src/engine/`:
 *  - proposition typing + recognized words come from `parse-premise.ts` /
 *    `constants.ts`
 *  - `SUPPORTED_MOODS` mirrors `validMoods` in `backend/src/engine/constants.ts`
 *
 * Keep SUPPORTED_MOODS in sync with the backend if the engine's valid-mood
 * list changes.
 */

export type PropositionType = {
  code: "A" | "E" | "I" | "O";
  name: string;
  form: string;
  quantity: string;
  quality: string;
  example: string;
};

export const PROPOSITION_TYPES: PropositionType[] = [
  {
    code: "A",
    name: "Universal affirmative",
    form: "All S are P",
    quantity: "all",
    quality: "affirmative",
    example: "All men are mortal",
  },
  {
    code: "E",
    name: "Universal negative",
    form: "No S are P",
    quantity: "no",
    quality: "negative",
    example: "No reptiles are warm-blooded",
  },
  {
    code: "I",
    name: "Particular affirmative",
    form: "Some S are P",
    quantity: "some",
    quality: "affirmative",
    example: "Some Greeks are philosophers",
  },
  {
    code: "O",
    name: "Particular negative",
    form: "Some S are not P",
    quantity: "some",
    quality: "negative",
    example: "Some animals are not pets",
  },
];

export type FigureInfo = {
  figure: 1 | 2 | 3 | 4;
  arrangement: string;
  description: string;
};

// Position of the middle term (M) across the major and minor premises.
export const FIGURES: FigureInfo[] = [
  {
    figure: 1,
    arrangement: "M–P · S–M",
    description: "Middle term is subject of the major, predicate of the minor.",
  },
  {
    figure: 2,
    arrangement: "P–M · S–M",
    description: "Middle term is the predicate of both premises.",
  },
  {
    figure: 3,
    arrangement: "M–P · M–S",
    description: "Middle term is the subject of both premises.",
  },
  {
    figure: 4,
    arrangement: "P–M · M–S",
    description: "Middle term is predicate of the major, subject of the minor.",
  },
];

// Mirrors `validMoods` in backend/src/engine/constants.ts.
export const SUPPORTED_MOODS: string[] = [
  "AA-1",
  "AA-3",
  "AA-4",
  "EA-1",
  "EA-2",
  "EA-3",
  "EA-4",
  "AI-1",
  "AI-3",
  "EI-1",
  "EI-2",
  "EI-3",
  "EI-4",
  "AE-2",
  "AE-4",
  "AO-2",
  "IA-3",
  "IA-4",
  "OA-3",
];

export type InputTip = {
  title: string;
  detail: string;
};

export const INPUT_TIPS: InputTip[] = [
  {
    title: "At least three words",
    detail: "Each premise must be a full statement, e.g. “all men are mortal”.",
  },
  {
    title: "Recognized quantifiers",
    detail: "all, every, each · no, none · some, few · at least.",
  },
  {
    title: "Singular subjects",
    detail:
      "Proper nouns work without a quantifier — “Socrates is a man”.",
  },
  {
    title: "Negation",
    detail: "Use “is not / are not” (or “isn’t / aren’t”) for negative premises.",
  },
  {
    title: "A shared middle term",
    detail:
      "Both premises must share a term — it links them and is dropped from the conclusion.",
  },
  {
    title: "Small words are ignored",
    detail: "Articles like “a”, “an”, “the” don’t affect parsing.",
  },
];
