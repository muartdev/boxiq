import { describe, expect, it } from "vitest";

import { getShellBottomPadding } from "./appShellSpacing";

describe("app shell spacing", () => {
  it("keeps enough bottom padding above the floating tab bar", () => {
    expect(getShellBottomPadding(76)).toBe(100);
    expect(getShellBottomPadding(0)).toBe(28);
  });
});
