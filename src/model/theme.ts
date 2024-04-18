import { createEffect, createEvent, createStore, sample } from 'effector';

export type Theme = 'light' | 'dark';

const LS_KEY_THEME = 'theme';

const saveThemeFx = createEffect((theme: Theme) => {
  localStorage.setItem(LS_KEY_THEME, theme);
});

export const toggleThemeEvent = createEvent();

const themeFromLs = localStorage.getItem(LS_KEY_THEME);
export const $theme = createStore<Theme>(
  themeFromLs === 'light' || themeFromLs === 'dark' ? themeFromLs : 'light',
);

sample({
  source: $theme,
  clock: toggleThemeEvent,
  fn: (theme) => (theme === 'light' ? 'dark' : 'light'),
  target: $theme,
});

sample({
  source: $theme,
  target: saveThemeFx,
});
