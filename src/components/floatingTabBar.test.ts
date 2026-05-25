import { describe, expect, it } from "vitest";

import { getFloatingTabBarMetrics } from "./floatingTabBar";

describe("floating tab bar metrics", () => {
  it("creates a compact centered floating island", () => {
    expect(getFloatingTabBarMetrics(0)).toEqual({
      left: 20,
      right: 20,
      bottom: 8,
      height: 64,
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: 32
    });

    expect(getFloatingTabBarMetrics(34)).toEqual({
      left: 20,
      right: 20,
      bottom: 16,
      height: 64,
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: 32
    });
  });
});