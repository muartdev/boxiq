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
  brandLabel: makeTextStyle(FontFamilies.brandStrong, 13, 16, { textTransform: "uppercase" }),
  screenTitle: makeTextStyle(FontFamilies.brandStrong, 43, 46),
  gameTitle: makeTextStyle(FontFamilies.brandStrong, 45, 48),
  levelTitle: makeTextStyle(FontFamilies.brandStrong, 26, 30),
  sectionTitle: makeTextStyle(FontFamilies.brandBold, 18, 22),
  cardTitle: makeTextStyle(FontFamilies.brandBold, 24, 28),
  buttonText: makeTextStyle(FontFamilies.brandBold, 20, 24),
  timerText: makeTextStyle(FontFamilies.brandStrong, 32, 34),
  statBig: makeTextStyle(FontFamilies.brandStrong, 47, 50),
  body: makeTextStyle(FontFamilies.body, 17, 24),
  bodyLarge: makeTextStyle(FontFamilies.body, 19, 26),
  bodyStrong: makeTextStyle(FontFamilies.bodyStrong, 17, 24),
  muted: makeTextStyle(FontFamilies.body, 15, 20),
  tabLabel: makeTextStyle(FontFamilies.bodyHeavy, 14, 16)
} as const;
