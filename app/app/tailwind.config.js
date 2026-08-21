/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        soft: "0 4px 20px -4px hsla(122, 40%, 12%, 0.08)",
        lift: "0 18px 40px -12px hsla(122, 40%, 12%, 0.18)",
        glow: "0 8px 28px hsla(123, 62%, 20%, 0.28)",
        'glow-gold': "0 14px 44px -10px hsla(42, 82%, 52%, 0.45)",
        'glow-green': "0 14px 44px -8px hsla(123, 62%, 20%, 0.5)",
        'inset-line': "inset 0 1px 0 0 rgb(255 255 255 / 0.12)",
        'deep': "0 40px 90px -28px hsla(116, 32%, 7%, 0.55)",
        'card-float': "0 30px 70px -24px hsla(18, 42%, 11%, 0.4), 0 2px 8px -2px hsla(18, 42%, 11%, 0.08)",
      },
      fontFamily: {
        fraunces: ['"Fraunces"', 'serif'],
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        caveat: ['"Caveat"', 'cursive'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'spring-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        "float-grain": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-6px) rotate(3deg)" },
          "75%": { transform: "translateY(4px) rotate(-2deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translate3d(4%, -3%, 0) scale(1.12)", opacity: "0.8" },
        },
        "aurora-drift-2": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)", opacity: "0.5" },
          "50%": { transform: "translate3d(-5%, 4%, 0) scale(0.95)", opacity: "0.75" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "shimmer-x": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.04)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 4s ease-in-out infinite",
        "float-slow": "float-slow 5s ease-in-out infinite",
        "float-grain": "float-grain 3.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "aurora-drift": "aurora-drift 18s ease-in-out infinite",
        "aurora-drift-2": "aurora-drift-2 22s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        "shimmer-x": "shimmer-x 3s linear infinite",
        "breathe": "breathe 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}