import { describe, expect, it } from "vitest";

import { FontFamilies, Typography } from "./typography";

describe("Boxiq typography system", () => {
  it("exposes the premium semantic tokens used across the app", () => {
    expect(Typography.brandLabel.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.screenTitle.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.gameTitle.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.levelTitle.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.sectionTitle.fontFamily).toBe(FontFamilies.brandBold);
    expect(Typography.cardTitle.fontFamily).toBe(FontFamilies.brandBold);
    expect(Typography.buttonText.fontFamily).toBe(FontFamilies.brandBold);
    expect(Typography.timerText.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.statBig.fontFamily).toBe(FontFamilies.brandStrong);
    expect(Typography.body.fontFamily).toBe(FontFamilies.body);
    expect(Typography.bodyLarge.fontFamily).toBe(FontFamilies.body);
    expect(Typography.bodyStrong.fontFamily).toBe(FontFamilies.bodyStrong);
    expect(Typography.muted.fontFamily).toBe(FontFamilies.body);
    expect(Typography.tabLabel.fontFamily).toBe(FontFamilies.bodyHeavy);
  });

  it("matches the calmer Boxiq target scale", () => {
    expect(Typography.brandLabel.fontSize).toBe(13);
    expect(Typography.screenTitle.fontSize).toBe(43);
    expect(Typography.gameTitle.fontSize).toBe(45);
    expect(Typography.levelTitle.fontSize).toBe(26);
    expect(Typography.sectionTitle.fontSize).toBe(18);
    expect(Typography.cardTitle.fontSize).toBe(24);
    expect(Typography.body.fontSize).toBe(17);
    expect(Typography.bodyLarge.fontSize).toBe(19);
    expect(Typography.buttonText.fontSize).toBe(20);
    expect(Typography.timerText.fontSize).toBe(32);
    expect(Typography.statBig.fontSize).toBe(47);
    expect(Typography.tabLabel.fontSize).toBe(14);
  });
});
