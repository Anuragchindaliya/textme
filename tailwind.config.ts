import { themePreset } from "./plugin/themePreset";
/** @type {import('tailwindcss').Config} */
export const darkMode:string[] = ["class"]
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
export const presets = [themePreset];
