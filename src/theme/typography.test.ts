import { describe, expect, it } from "vitest";

import { FontFamilies, Typography } from "./typography";

describe("Boxiq typography system", () => {
  it("exposes the premium semantic tokens used across the app", () => {
    expect(Typography.brandLabel.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.screenTitle.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.levelTitle.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.sectionTitle.fontFamily).toBe(FontFamilies.brandBold);
    expect(Typography.cardTitle.fontFamily).toBe(FontFamilies.brandBold);
    expect(Typography.buttonText.fontFamily).toBe(FontFamilies.brandBold);
    expect(Typography.timerText.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.body.fontFamily).toBe(FontFamilies.body);
    expect(Typography.bodyStrong.fontFamily).toBe(FontFamilies.bodyStrong);
    expect(Typography.muted.fontFamily).toBe(FontFamilies.body);
    expect(Typography.tabLabel.fontFamily).toBe(FontFamilies.bodyHeavy);
  });

  it("keeps Turkish-friendly readable sizes in a stable range", () => {
    expect(Typography.screenTitle.fontSize).toBeGreaterThanOrEqual(44);
    expect(Typography.levelTitle.fontSize).toBeGreaterThanOrEqual(36);
    expect(Typography.body.fontSize).toBeGreaterThanOrEqual(16);
    expect(Typography.muted.fontSize).toBeGreaterThanOrEqual(15);
    expect(Typography.tabLabel.fontSize).toBeGreaterThanOrEqual(13);
  });
});
