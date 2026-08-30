import { Plus_Jakarta_Sans } from "next/font/google";

/** The portal's display face: SaaS-grade, not cartoonish. Marketing keeps Gabarito. */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});
