import type { Config } from "tailwindcss";

/** Colors resolve from CSS variables as RGB channels so opacity modifiers (bg-accent/15) work. */
const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: channel("--c-bg"),
        secondary: channel("--c-bg-secondary"),
        surface: channel("--c-card"),
        accent: channel("--c-accent"),
        "accent-2": channel("--c-accent-2"),
        "accent-strong": channel("--c-accent-strong"),
        btn: channel("--c-btn"),
        peach: channel("--c-peach"),
        "on-accent": channel("--c-on-accent"),
        foreground: channel("--c-text"),
        muted: channel("--c-muted"),
        // Fixed subtle tint (8–10%, per theme). Deliberately not an <alpha-value> color:
        // Tailwind injects --tw-border-opacity: 1 into function colors, which made borders solid.
        border: "rgb(var(--c-border) / var(--border-alpha))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.14em",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "drift-a": {
          from: { transform: "translate3d(0,0,0) scale(1)" },
          to: { transform: "translate3d(10vw,8vh,0) scale(1.2)" },
        },
        "drift-b": {
          from: { transform: "translate3d(0,0,0) scale(1)" },
          to: { transform: "translate3d(-12vw,10vh,0) scale(0.9)" },
        },
        "drift-c": {
          from: { transform: "translate3d(0,0,0) scale(1)" },
          to: { transform: "translate3d(6vw,-10vh,0) scale(1.1)" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
        noise: {
          "0%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-4%,3%)" },
          "40%": { transform: "translate(3%,-5%)" },
          "60%": { transform: "translate(-6%,-2%)" },
          "80%": { transform: "translate(5%,4%)" },
          "100%": { transform: "translate(0,0)" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        mesh: {
          from: { backgroundPosition: "0% 0%" },
          to: { backgroundPosition: "100% 100%" },
        },
        draw: {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 42s linear infinite",
        "spin-reverse": "spin-reverse 64s linear infinite",
        marquee: "marquee 45s linear infinite",
        "drift-a": "drift-a 24s ease-in-out infinite alternate",
        "drift-b": "drift-b 30s ease-in-out infinite alternate",
        "drift-c": "drift-c 27s ease-in-out infinite alternate",
        "scroll-dot": "scroll-dot 1.8s ease-in-out infinite",
        noise: "noise 1.4s steps(1) infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0,0,0.2,1) infinite",
        mesh: "mesh 32s ease-in-out infinite alternate",
        draw: "draw 2.8s ease-in-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;