import { createRouterControls } from 'atomic-router';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const controls = createRouterControls();

export type Theme = 'light' | 'dark';

export const LS_KEY_THEME = 'theme';

const saveThemeFx = createEffect((theme: Theme) => {
  localStorage.setItem(LS_KEY_THEME, theme);
});

export const toggleThemeEvent = createEvent();

export const $theme = createStore<Theme>('light');

const themeByPrevTheme = {
  light: 'dark',
  dark: 'light',
} as const;

sample({
  source: $theme,
  clock: toggleThemeEvent,
  fn: (theme) => themeByPrevTheme[theme],
  target: $theme,
});

sample({
  source: $theme,
  target: saveThemeFx,
});
