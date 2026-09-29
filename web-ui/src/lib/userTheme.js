const USER_THEME_KEY = "tanglaw-user-theme";

export function getUserThemePreference() {
  const theme = window.localStorage.getItem(USER_THEME_KEY);
  return ["light", "dark", "system"].includes(theme) ? theme : "light";
}

export function applyUserTheme(theme) {
  window.localStorage.setItem(USER_THEME_KEY, theme);
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.userTheme =
    theme === "dark" || (theme === "system" && prefersDark) ? "dark" : "light";
}