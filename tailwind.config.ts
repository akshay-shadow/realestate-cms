import type { Config } from "tailwindcss";

// Site colors come from CSS variables (RGB triplets) set at runtime from the
// admin-managed theme, so every client site can have its own palette.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: v("primary"),
        "primary-fg": v("primary-fg"),
        secondary: v("secondary"),
        accent: v("accent"),
        surface: v("surface"),
        "surface-alt": v("surface-alt"),
        ink: v("ink"),
        muted: v("muted"),
        heading: v("heading"),
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        theme: "var(--radius)",
      },
    },
  },
  plugins: [],
};

export default config;
