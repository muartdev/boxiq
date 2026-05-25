import { describe, expect, it } from "vitest";

import { getInlineCoachStep } from "./onboarding";

describe("inline first-level coach", () => {
  it("walks the first level through fill, cycle, equality, difference, and check steps", () => {
    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: false,
        levelCompleted: false,
        editablePresses: 0,
        cycleAdvances: 0,
        checksUsed: 0
      })
    ).toBe("fill");

    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: false,
        levelCompleted: false,
        editablePresses: 1,
        cycleAdvances: 0,
        checksUsed: 0
      })
    ).toBe("cycle");

    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: false,
        levelCompleted: false,
        editablePresses: 2,
        cycleAdvances: 1,
        checksUsed: 0
      })
    ).toBe("equal");

    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: false,
        levelCompleted: false,
        editablePresses: 2,
        cycleAdvances: 1,
        checksUsed: 0,
        equalityStepSeen: true
      })
    ).toBe("cross");

    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: false,
        levelCompleted: false,
        editablePresses: 2,
        cycleAdvances: 1,
        checksUsed: 0,
        equalityStepSeen: true,
        differenceStepSeen: true
      })
    ).toBe("check");
  });

  it("stays hidden when the tutorial has already been seen, the level changed, or the level was solved", () => {
    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: true,
        levelCompleted: false,
        editablePresses: 0,
        cycleAdvances: 0,
        checksUsed: 0
      })
    ).toBeUndefined();

    expect(
      getInlineCoachStep({
        levelId: "balance-lesson",
        tutorialSeen: false,
        levelCompleted: false,
        editablePresses: 0,
        cycleAdvances: 0,
        checksUsed: 0
      })
    ).toBeUndefined();

    expect(
      getInlineCoachStep({
        levelId: "daily-01",
        tutorialSeen: false,
        levelCompleted: true,
        editablePresses: 0,
        cycleAdvances: 0,
        checksUsed: 1
      })
    ).toBeUndefined();
  });
});
