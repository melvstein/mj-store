import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        skin: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          base: "var(--base)",
          primary: "rgb(var(--primary) / <alpha-value>)",
          secondary: "rgb(var(--secondary) / <alpha-value>)",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
