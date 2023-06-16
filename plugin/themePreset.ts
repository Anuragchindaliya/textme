import type { Config } from "tailwindcss"
import { themePlugin } from "./themePlugin";
import twAnimate from "tailwindcss-animate"
export const themePreset = {
  content: [],
  plugins: [twAnimate,themePlugin],
} satisfies Config
