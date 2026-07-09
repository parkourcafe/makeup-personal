export type ReferenceTheme = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  lip: string;
};

const themes: Record<string, ReferenceTheme> = {
  "soft-rose-everyday": {
    background: "#f5e6e4",
    primary: "#d99c9f",
    secondary: "#8b6f62",
    accent: "#f0c6b9",
    lip: "#b86978"
  },
  "latte-soft-smoke": {
    background: "#ebe1d2",
    primary: "#a06f4f",
    secondary: "#4a3328",
    accent: "#c79b72",
    lip: "#8d5a48"
  },
  "clean-girl-polished": {
    background: "#edf0e8",
    primary: "#c88f85",
    secondary: "#6e746a",
    accent: "#f2d6be",
    lip: "#e4a8a0"
  },
  "berry-date-night": {
    background: "#eadfe6",
    primary: "#8a3f63",
    secondary: "#2f2530",
    accent: "#c37a93",
    lip: "#7d2449"
  }
};

export function referenceTheme(slug: string): ReferenceTheme {
  return themes[slug] ?? themes["soft-rose-everyday"]!;
}
