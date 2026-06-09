// Unified Custom Theme Configuration for Enterprise SaaS look and feel
export const theme = {
  // CSS Colors matching Tailwind vars (HSL configurations) and HEX equivalents for canvas/charts
  colors: {
    primary: {
      light: "#6366f1", // Indigo-500
      DEFAULT: "#4f46e5", // Indigo-600
      dark: "#4338ca", // Indigo-700
      ring: "rgba(99, 102, 241, 0.4)",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },
    success: "#10b981", // Emerald-500
    warning: "#f59e0b", // Amber-500
    danger: "#ef4444", // Red-500
  },

  // Typography Presets (Modern Inter / Outfit trending fonts)
  typography: {
    fontFamily: "Inter, sans-serif",
    heroTitle: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-100 dark:to-slate-300",
    sectionTitle: "text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50",
    cardTitle: "text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors",
    body: "text-sm text-slate-600 dark:text-slate-400 leading-relaxed",
    muted: "text-xs text-slate-400 dark:text-slate-500",
  },

  // Standard CSS class bundles (Tailwind UI component utilities)
  classes: {
    // Premium layouts
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    workspace: "flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-2xl transition-colors duration-300",

    // Glassmorphic layouts
    glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50",
    glassNav: "sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-200/40 dark:border-slate-800/40",

    // Standard Unified Card Elements
    card: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 shadow-sm overflow-hidden",
    cardInteractive: "rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 transform hover:-translate-y-0.5",
    cardGlass: "rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm",

    // Standard Buttons (Micro-interactions enabled via active:scale-95)
    buttonPrimary: "inline-flex items-center justify-center font-medium text-sm rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
    buttonSecondary: "inline-flex items-center justify-center font-medium text-sm rounded-lg px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 active:scale-[0.98] transition-all duration-150 border border-slate-200/40 dark:border-slate-700/40",
    buttonOutline: "inline-flex items-center justify-center font-medium text-sm rounded-lg px-4 py-2 bg-transparent text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all duration-150",
    buttonGhost: "inline-flex items-center justify-center font-medium text-sm rounded-lg px-3 py-2 bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 active:scale-[0.98] transition-all duration-150",

    // Standard Form Inputs
    input: "w-full bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200",
    textarea: "w-full min-h-[100px] bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200",
    label: "block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5",

    // Badges & Indicators
    badgeIndigo: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/30",
    badgeMuted: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50",
  },
} as const
