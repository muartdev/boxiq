import type { TextStyle } from "react-native";

export const FontFamilies = {
  headingBold: "SpaceGrotesk_700Bold",
  bodyMedium: "Manrope_500Medium",
  bodySemiBold: "Manrope_600SemiBold",
  bodyBold: "Manrope_700Bold"
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
  brandLabel: makeTextStyle(FontFamilies.headingBold, 12, 15, { textTransform: "uppercase", letterSpacing: 0.5 }),
  screenTitle: makeTextStyle(FontFamilies.headingBold, 38, 42),
  gameTitle: makeTextStyle(FontFamilies.headingBold, 36, 40),
  levelTitle: makeTextStyle(FontFamilies.headingBold, 22, 26),
  sectionTitle: makeTextStyle(FontFamilies.headingBold, 15, 18, { textTransform: "uppercase", letterSpacing: 0.5 }),
  cardTitle: makeTextStyle(FontFamilies.headingBold, 20, 24),
  buttonText: makeTextStyle(FontFamilies.headingBold, 18, 22),
  timerText: makeTextStyle(FontFamilies.headingBold, 30, 34),
  statBig: makeTextStyle(FontFamilies.headingBold, 42, 46),
  body: makeTextStyle(FontFamilies.bodyMedium, 16, 22),
  bodyLarge: makeTextStyle(FontFamilies.bodyMedium, 17, 24),
  bodyStrong: makeTextStyle(FontFamilies.bodySemiBold, 16, 22),
  muted: makeTextStyle(FontFamilies.bodyMedium, 14, 18),
  meta: makeTextStyle(FontFamilies.bodyMedium, 15, 20),
  tabLabel: makeTextStyle(FontFamilies.bodyBold, 13, 16)
} as const;
