import { FontFamilies, Typography } from "../theme/typography";

export const Fonts = {
  heading: FontFamilies.brandStrong,
  subheading: FontFamilies.brandBold,
  body: FontFamilies.body,
  label: FontFamilies.bodyHeavy
} as const;

export { Typography };
