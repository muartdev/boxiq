export const INTRO_LEVEL_ID = "daily-01";

export type InlineCoachStep = "fill" | "cycle" | "equal" | "cross" | "check";

export function getInlineCoachStep({
  levelId,
  tutorialSeen,
  levelCompleted,
  editablePresses,
  cycleAdvances,
  checksUsed,
  equalityStepSeen = false,
  differenceStepSeen = false
}: {
  levelId: string;
  tutorialSeen: boolean;
  levelCompleted: boolean;
  editablePresses: number;
  cycleAdvances: number;
  checksUsed: number;
  equalityStepSeen?: boolean;
  differenceStepSeen?: boolean;
}): InlineCoachStep | undefined {
  if (tutorialSeen || levelCompleted || levelId !== INTRO_LEVEL_ID) {
    return undefined;
  }

  if (editablePresses === 0) {
    return "fill";
  }

  if (cycleAdvances === 0) {
    return "cycle";
  }

  if (!equalityStepSeen) {
    return "equal";
  }

  if (!differenceStepSeen) {
    return "cross";
  }

  if (checksUsed === 0) {
    return "check";
  }

  return undefined;
}
