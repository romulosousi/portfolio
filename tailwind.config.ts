import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-0": "var(--bg-0)",
        "bg-1": "var(--bg-1)",
        "bg-2": "var(--bg-2)",
        "bg-3": "var(--bg-3)",
        "fg-0": "var(--fg-0)",
        "fg-1": "var(--fg-1)",
        "fg-2": "var(--fg-2)",
        "fg-3": "var(--fg-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        green: {
          DEFAULT: "var(--green)",
          dim: "var(--green-dim)",
          deep: "var(--green-deep)",
        },
        amber: "var(--amber)",
        red: "var(--red)",
        blue: "var(--blue)",
      },
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: [
          '"Geist"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ['"Instrument Serif"', "ui-serif", "serif"],
      },
      keyframes: {
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        logIn: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        pulseDot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(61,255,142,0.7)" },
          "70%": { boxShadow: "0 0 0 6px rgba(61,255,142,0)" },
        },
      },
      animation: {
        ticker: "ticker 12s linear infinite",
        blink: "blink 1s step-end infinite",
        "log-in": "logIn 0.18s ease-out",
        spin: "spin 0.9s linear infinite",
        "pulse-dot": "pulseDot 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
