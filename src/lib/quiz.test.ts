import { describe, expect, it } from "vitest";
import {
  BREW_QUESTION,
  FLAVOUR_QUESTION,
  MILK_QUESTION,
  SIGNATURE_ORDER,
  isComplete,
  scoreQuiz,
  signatureSlugs,
  type QuizAnswers,
} from "./quiz";

function allAnswers(): QuizAnswers[] {
  const out: QuizAnswers[] = [];
  for (const brew of BREW_QUESTION.options)
    for (const flavour of FLAVOUR_QUESTION.options)
      for (const milk of MILK_QUESTION.options) out.push({ brew: brew.value, flavour: flavour.value, milk: milk.value });
  return out;
}

describe("scoreQuiz", () => {
  it("recommends the obvious match for each classic profile", () => {
    expect(scoreQuiz({ brew: "pourover", flavour: "floral", milk: "black" }).slug).toBe("first-light");
    expect(scoreQuiz({ brew: "pourover", flavour: "fruity", milk: "sometimes" }).slug).toBe("honey-ridge");
    expect(scoreQuiz({ brew: "drip", flavour: "chocolate", milk: "sometimes" }).slug).toBe("highland-almanac");
    expect(scoreQuiz({ brew: "espresso", flavour: "bold", milk: "milk" }).slug).toBe("deep-field");
  });

  it("lets a strong flavour answer outweigh the brew method", () => {
    expect(scoreQuiz({ brew: "espresso", flavour: "floral", milk: "black" }).slug).toBe("first-light");
    expect(scoreQuiz({ brew: "pourover", flavour: "bold", milk: "milk" }).slug).toBe("deep-field");
  });

  it("breaks a two-way tie with the flavour answer", () => {
    // pour-over (FL3 HR2 HA1) + fruity (HR4 FL2 HA1) + black (FL2 HR1 HA1): FL 7 = HR 7; fruity favours HR.
    const pour = scoreQuiz({ brew: "pourover", flavour: "fruity", milk: "black" });
    expect(pour.scores["first-light"]).toBe(7);
    expect(pour.scores["honey-ridge"]).toBe(7);
    expect(pour.slug).toBe("honey-ridge");
    // immersion (HA2 DF2 HR1) + chocolate (HA4 DF2 HR1) + milk (DF3 HA1 HR1): HA 7 = DF 7; chocolate favours HA.
    const press = scoreQuiz({ brew: "immersion", flavour: "chocolate", milk: "milk" });
    expect(press.scores["highland-almanac"]).toBe(press.scores["deep-field"]);
    expect(press.slug).toBe("highland-almanac");
  });

  it("breaks a three-way tie with the flavour answer", () => {
    // pour-over + bold + sometimes: HR 4 = HA 4 = DF 4; bold gives DF 4, HA 1, HR 0.
    const bold = scoreQuiz({ brew: "pourover", flavour: "bold", milk: "sometimes" });
    expect([bold.scores["honey-ridge"], bold.scores["highland-almanac"], bold.scores["deep-field"]]).toEqual([4, 4, 4]);
    expect(bold.slug).toBe("deep-field");
    // drip + floral + sometimes: FL 5 = HR 5 = HA 5; floral gives FL 4, HR 1.
    const floral = scoreQuiz({ brew: "drip", flavour: "floral", milk: "sometimes" });
    expect([floral.scores["first-light"], floral.scores["honey-ridge"], floral.scores["highland-almanac"]]).toEqual([5, 5, 5]);
    expect(floral.slug).toBe("first-light");
  });

  it("never needs the signature-order fallback with today's answers", () => {
    // The last tie-break (signature order) is a guard for future edits to the points: across all
    // 48 combinations, the coffees tied on total never also tie on the flavour answer's points.
    let ties = 0;
    for (const answers of allAnswers()) {
      const { scores } = scoreQuiz(answers);
      const best = Math.max(...Object.values(scores));
      const tied = SIGNATURE_ORDER.filter((slug) => scores[slug] === best);
      if (tied.length < 2) continue;
      ties += 1;
      const flavour = FLAVOUR_QUESTION.options.find((o) => o.value === answers.flavour)!.points;
      const flavourPoints = tied.map((slug) => flavour[slug] ?? 0);
      expect(new Set(flavourPoints).size).toBe(flavourPoints.length);
    }
    expect(ties).toBe(8);
  });

  it("returns per-coffee scores that add up to every awarded point", () => {
    const answers: QuizAnswers = { brew: "drip", flavour: "fruity", milk: "milk" };
    const { scores } = scoreQuiz(answers);
    const sum = (o: { points: Record<string, number | undefined> }) =>
      Object.values(o.points).reduce<number>((a, b) => a + (b ?? 0), 0);
    const expected =
      sum(BREW_QUESTION.options.find((o) => o.value === answers.brew)!) +
      sum(FLAVOUR_QUESTION.options.find((o) => o.value === answers.flavour)!) +
      sum(MILK_QUESTION.options.find((o) => o.value === answers.milk)!);
    expect(Object.values(scores).reduce((a, b) => a + b, 0)).toBe(expected);
  });

  it("always recommends a signature coffee and gives at least one reason", () => {
    const signature = signatureSlugs();
    for (const answers of allAnswers()) {
      const result = scoreQuiz(answers);
      expect(signature).toContain(result.slug);
      expect(result.reasons.length).toBeGreaterThan(0);
    }
  });

  it("can recommend every one of the signature four", () => {
    const reached = new Set(allAnswers().map((a) => scoreQuiz(a).slug));
    expect([...reached].sort()).toEqual([...SIGNATURE_ORDER].sort());
  });

  it("is deterministic", () => {
    const answers: QuizAnswers = { brew: "immersion", flavour: "chocolate", milk: "milk" };
    expect(scoreQuiz(answers)).toEqual(scoreQuiz(answers));
  });

  it("rejects unknown answers", () => {
    expect(() => scoreQuiz({ brew: "siphon" as never, flavour: "floral", milk: "black" })).toThrow(/Unknown answer/);
  });
});

describe("isComplete", () => {
  it("is true only when all three questions are answered", () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete({ brew: "drip", flavour: "bold" })).toBe(false);
    expect(isComplete({ brew: "drip", flavour: "bold", milk: "black" })).toBe(true);
  });
});
