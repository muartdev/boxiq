import { describe, expect, it } from "vitest";

import { FontFamilies, Typography } from "./typography";

describe("Boxiq typography system", () => {
  it("exposes the premium semantic tokens used across the app", () => {
    expect(Typography.brandLabel.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.screenTitle.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.gameTitle.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.levelTitle.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.sectionTitle.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.cardTitle.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.buttonText.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.timerText.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.statBig.fontFamily).toBe(FontFamilies.headingBold);
    expect(Typography.body.fontFamily).toBe(FontFamilies.bodyMedium);
    expect(Typography.bodyLarge.fontFamily).toBe(FontFamilies.bodyMedium);
    expect(Typography.bodyStrong.fontFamily).toBe(FontFamilies.bodySemiBold);
    expect(Typography.muted.fontFamily).toBe(FontFamilies.bodyMedium);
    expect(Typography.tabLabel.fontFamily).toBe(FontFamilies.bodyBold);
  });

  it("matches the calmer Boxiq target scale", () => {
    expect(Typography.brandLabel.fontSize).toBe(12);
    expect(Typography.screenTitle.fontSize).toBe(38);
    expect(Typography.gameTitle.fontSize).toBe(36);
    expect(Typography.levelTitle.fontSize).toBe(22);
    expect(Typography.sectionTitle.fontSize).toBe(15);
    expect(Typography.cardTitle.fontSize).toBe(20);
    expect(Typography.body.fontSize).toBe(16);
    expect(Typography.bodyLarge.fontSize).toBe(17);
    expect(Typography.buttonText.fontSize).toBe(18);
    expect(Typography.timerText.fontSize).toBe(30);
    expect(Typography.statBig.fontSize).toBe(42);
    expect(Typography.tabLabel.fontSize).toBe(13);
  });
});
