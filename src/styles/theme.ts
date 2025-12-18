export const colors = {
  dark: {
    background: "#0b0d12",
    surface: "#121520",
    card: "#161a2b",
    border: "#242a4d",
    textPrimary: "#e5e7eb",
    textSecondary: "#9ca3af",
    textMuted: "#6b7280",
    accentPrimary: "#8b5cf6", // purple
    accentSecondary: "#06b6d4", // cyan
    accentEmotion: "#ec4899", // pink (likes only)
  },
  light: {
    background: "#f3f4f6",
    surface: "#ffffff",
    card: "#f9fafb",
    border: "#e5e7eb",
    textPrimary: "#020617",
    textSecondary: "#4b5563",
    textMuted: "#9ca3af",
    accentPrimary: "#7c3aed",
    accentSecondary: "#0891b2",
    accentEmotion: "#db2777",
  },
} as const;

export type ThemeMode = "dark" | "light";

export const getThemeTokens = (mode: ThemeMode) => colors[mode];


