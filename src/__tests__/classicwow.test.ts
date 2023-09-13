import { expect, test } from "bun:test";
import { getLevelingSteps } from "../classicwow";

test("Filtering removes non-specific class steps (regression #3)", () => {
  const steps = getLevelingSteps("troll", "priest");
  Object.keys(steps).forEach((levelBracket) => {
    expect(
      steps[levelBracket].filter((step) => {
        step[1].includes("Tame");
      }),
    ).toHaveLength(0);
  });
});

test("Filtering keeps relevant class-specific steps (regression #3)", () => {
  const steps = getLevelingSteps("troll", "hunter");
  expect(
    steps[Object.keys(steps)[0]].filter((step) => step[1].includes("Tame"))
      .length,
  ).toBeGreaterThan(0);
});
