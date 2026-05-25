import type { TextStyle } from "react-native";

export const FontFamilies = {
  brandBold: "Sora_700Bold",
  brandStrong: "Sora_800ExtraBold",
  body: "Inter_500Medium",
  bodyStrong: "Inter_600SemiBold",
  bodyHeavy: "Inter_800ExtraBold"
} as const;

function makeTextStyle(
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  extras?: Partial<TextStyle>
): TextStyle {
  return {
    fontFamily,
    fontSize,
    lineHeight,
    letterSpacing: 0,
    ...extras
  };
}

export const Typography = {
  brandLabel: makeTextStyle(FontFamilies.brandStrong, 15, 18, { textTransform: "uppercase" }),
  screenTitle: makeTextStyle(FontFamilies.brandStrong, 46, 50),
  levelTitle: makeTextStyle(FontFamilies.brandStrong, 38, 42),
  sectionTitle: makeTextStyle(FontFamilies.brandBold, 20, 24),
  cardTitle: makeTextStyle(FontFamilies.brandBold, 26, 30),
  buttonText: makeTextStyle(FontFamilies.brandBold, 18, 22),
  timerText: makeTextStyle(FontFamilies.brandStrong, 28, 30),
  body: makeTextStyle(FontFamilies.body, 16, 22),
  bodyStrong: makeTextStyle(FontFamilies.bodyStrong, 16, 22),
  muted: makeTextStyle(FontFamilies.body, 15, 20),
  tabLabel: makeTextStyle(FontFamilies.bodyHeavy, 13, 16)
} as const;
