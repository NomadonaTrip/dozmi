/* Shared Tailwind config — "Regal Sanctuary" palette, sourced from stitch/ mockups */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Primary — Deep Crimson */
        "primary": "#6B1D1D",
        "primary-container": "#4A1212",
        "primary-hi": "#A81D1D",
        "on-primary": "#F8F1E5",
        /* Secondary — Regal Gold */
        "secondary": "#B08D57",
        "secondary-container": "#D4AF37",
        "on-secondary": "#1A100F",
        "secondary-fixed": "#FFE088",
        /* Surfaces — warm parchment */
        "background": "#FDFCF9",
        "surface": "#FDFCF9",
        "surface-low": "#F7F3EA",
        "surface-container": "#F2EEE5",
        "surface-variant": "#F2E8DA",
        "surface-high": "#ECE8DF",
        "surface-highest": "#E6E2D9",
        "on-surface": "#1F1A17",
        "on-surface-variant": "#5A403E",
        /* Utility */
        "outline": "#85736C",
        "outline-variant": "#E2BEBA",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        regal: "2rem",
      },
      fontFamily: {
        /* Cormorant Garamond — closest Google Fonts match to
           Cloudy Aurora Serif: calligraphic, ethereal, high-contrast */
        headline: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Work Sans", "system-ui", "sans-serif"],
        label: ["Work Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        regal: "0 30px 60px rgba(74, 18, 18, 0.18)",
        sanctuary: "0 12px 32px rgba(28, 28, 23, 0.08)",
        card: "0 10px 30px rgba(107, 29, 29, 0.12)",
      },
    },
  },
};
