export enum LS_KEYS {
  theme = 'theme',
}

export type Theme = 'light' | 'dark';

export const specBoxLs = {
  getTheme: () => {
    return localStorage.getItem(LS_KEYS.theme);
  },
  setTheme: (theme: Theme) => {
    return localStorage.setItem(LS_KEYS.theme, theme);
  },
};

export type SpecBoxLs = typeof specBoxLs;
