import { SIGNATURE_COFFEES } from "@/content/products";

/* ==========================================================================
   "Find your coffee": three questions, one signature coffee.
   Each answer awards points to the coffees it suits; the highest total
   wins. Ties go to the coffee the flavour answer favours most (taste is
   the strongest signal), then to signature order. Pure and unit-tested.
   ========================================================================== */

export type SignatureSlug = "first-light" | "honey-ridge" | "highland-almanac" | "deep-field";

export const SIGNATURE_ORDER: SignatureSlug[] = ["first-light", "honey-ridge", "highland-almanac", "deep-field"];

export type BrewAnswer = "espresso" | "pourover" | "immersion" | "drip";
export type FlavourAnswer = "floral" | "fruity" | "chocolate" | "bold";
export type MilkAnswer = "black" | "sometimes" | "milk";

export interface QuizAnswers {
  brew: BrewAnswer;
  flavour: FlavourAnswer;
  milk: MilkAnswer;
}

export type QuestionId = keyof QuizAnswers;

type Points = Partial<Record<SignatureSlug, number>>;

export interface QuizOption<V extends string> {
  value: V;
  label: string;
  detail: string;
  points: Points;
  /** Why this answer points where it does, in the brand voice. */
  reason: Partial<Record<SignatureSlug, string>>;
}

export interface QuizQuestion<V extends string> {
  id: QuestionId;
  title: string;
  options: Array<QuizOption<V>>;
}

export const BREW_QUESTION: QuizQuestion<BrewAnswer> = {
  id: "brew",
  title: "How do you usually brew?",
  options: [
    {
      value: "espresso",
      label: "Espresso",
      detail: "Machine, moka pot or a café at home",
      points: { "deep-field": 3, "highland-almanac": 1, "honey-ridge": 1 },
      reason: {
        "deep-field": "It was built for espresso: thick, syrupy shots.",
        "highland-almanac": "It pulls a sweet, forgiving shot.",
        "honey-ridge": "It makes a bright, juicy shot.",
      },
    },
    {
      value: "pourover",
      label: "Pour-over",
      detail: "Cone, flat-bottom or glass carafe",
      points: { "first-light": 3, "honey-ridge": 2, "highland-almanac": 1 },
      reason: {
        "first-light": "A slow pour lets the florals open right up.",
        "honey-ridge": "Pour-over keeps its fruit clear and sweet.",
        "highland-almanac": "It brews a round, easy pour-over.",
      },
    },
    {
      value: "immersion",
      label: "French press or cold brew",
      detail: "Long steeps, full body",
      points: { "highland-almanac": 2, "deep-field": 2, "honey-ridge": 1 },
      reason: {
        "highland-almanac": "A long steep turns it to chocolate and almond.",
        "deep-field": "It stays sweet through a long, cold steep.",
        "honey-ridge": "Immersion brings out its panela sweetness.",
      },
    },
    {
      value: "drip",
      label: "Drip machine",
      detail: "A full pot for the morning",
      points: { "highland-almanac": 3, "honey-ridge": 2, "deep-field": 1, "first-light": 1 },
      reason: {
        "highland-almanac": "It was made for a full pot and a slow morning.",
        "honey-ridge": "It holds its sweetness as the pot sits.",
        "deep-field": "It makes a bold, sturdy pot.",
        "first-light": "It brightens up a batch brew.",
      },
    },
  ],
};

export const FLAVOUR_QUESTION: QuizQuestion<FlavourAnswer> = {
  id: "flavour",
  title: "Which cup sounds best?",
  options: [
    {
      value: "floral",
      label: "Bright and floral",
      detail: "Tea-like, citrus, blossom",
      points: { "first-light": 4, "honey-ridge": 1 },
      reason: {
        "first-light": "You like it bright: jasmine, bergamot, white peach.",
        "honey-ridge": "Its red-apple brightness suits a lively palate.",
      },
    },
    {
      value: "fruity",
      label: "Sweet and fruity",
      detail: "Ripe fruit, brown sugar",
      points: { "honey-ridge": 4, "first-light": 2, "highland-almanac": 1 },
      reason: {
        "honey-ridge": "You like it sweet and fruity: red apple and panela.",
        "first-light": "Its white-peach finish is all ripe fruit.",
        "highland-almanac": "There's an orange-zest lift at the edge.",
      },
    },
    {
      value: "chocolate",
      label: "Chocolate and nutty",
      detail: "Cocoa, almond, caramel",
      points: { "highland-almanac": 4, "deep-field": 2, "honey-ridge": 1 },
      reason: {
        "highland-almanac": "You like it cosy: milk chocolate and toasted almond.",
        "deep-field": "Dark chocolate is its first note.",
        "honey-ridge": "It finishes on cacao nib.",
      },
    },
    {
      value: "bold",
      label: "Rich and bold",
      detail: "Dark chocolate, molasses",
      points: { "deep-field": 4, "highland-almanac": 1 },
      reason: {
        "deep-field": "You like it bold: dark chocolate, molasses, black cherry.",
        "highland-almanac": "It has body without any bitterness.",
      },
    },
  ],
};

export const MILK_QUESTION: QuizQuestion<MilkAnswer> = {
  id: "milk",
  title: "Milk or black?",
  options: [
    {
      value: "black",
      label: "Always black",
      detail: "Nothing in the way",
      points: { "first-light": 2, "honey-ridge": 1, "highland-almanac": 1 },
      reason: {
        "first-light": "Drunk black, every delicate note comes through.",
        "honey-ridge": "Black, it tastes like baked apple.",
        "highland-almanac": "Black, it's round and easy.",
      },
    },
    {
      value: "sometimes",
      label: "Depends on the day",
      detail: "A splash now and then",
      points: { "honey-ridge": 2, "highland-almanac": 2 },
      reason: {
        "honey-ridge": "Easy black, generous with a splash of milk.",
        "highland-almanac": "It's good either way, which is the point.",
      },
    },
    {
      value: "milk",
      label: "With milk, please",
      detail: "Lattes, flat whites, cortados",
      points: { "deep-field": 3, "highland-almanac": 1, "honey-ridge": 1 },
      reason: {
        "deep-field": "Its black-cherry finish cuts cleanly through milk.",
        "highland-almanac": "Milk turns it into a chocolate bar.",
        "honey-ridge": "Milk brings out the panela.",
      },
    },
  ],
};

export const QUIZ_QUESTIONS = [BREW_QUESTION, FLAVOUR_QUESTION, MILK_QUESTION] as const;

export interface QuizResult {
  slug: SignatureSlug;
  scores: Record<SignatureSlug, number>;
  /** One reason per answer that pointed at the winner, in question order. */
  reasons: string[];
}

function emptyScores(): Record<SignatureSlug, number> {
  return { "first-light": 0, "honey-ridge": 0, "highland-almanac": 0, "deep-field": 0 };
}

function optionFor<V extends string>(question: QuizQuestion<V>, value: V): QuizOption<V> {
  const option = question.options.find((o) => o.value === value);
  if (!option) throw new Error(`Unknown answer "${value}" for ${question.id}`);
  return option;
}

export function scoreQuiz(answers: QuizAnswers): QuizResult {
  const picked = [
    optionFor(BREW_QUESTION, answers.brew),
    optionFor(FLAVOUR_QUESTION, answers.flavour),
    optionFor(MILK_QUESTION, answers.milk),
  ] as const;
  const scores = emptyScores();
  for (const option of picked) {
    for (const slug of SIGNATURE_ORDER) scores[slug] += option.points[slug] ?? 0;
  }
  const flavourPoints = picked[1].points;
  const ranked = [...SIGNATURE_ORDER].sort(
    (a, b) =>
      scores[b] - scores[a] ||
      (flavourPoints[b] ?? 0) - (flavourPoints[a] ?? 0) ||
      SIGNATURE_ORDER.indexOf(a) - SIGNATURE_ORDER.indexOf(b),
  );
  const slug = ranked[0]!;
  const reasons = picked.map((o) => o.reason[slug]).filter((r): r is string => Boolean(r));
  return { slug, scores, reasons };
}

/** Partial answers as the user steps through the quiz. */
export type QuizDraft = Partial<QuizAnswers>;

export function isComplete(draft: QuizDraft): draft is QuizAnswers {
  return Boolean(draft.brew && draft.flavour && draft.milk);
}

/** Sanity check that the quiz only recommends the signature four. */
export function signatureSlugs(): string[] {
  return SIGNATURE_COFFEES.map((c) => c.slug);
}
