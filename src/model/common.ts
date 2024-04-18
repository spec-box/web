import { createRouterControls } from 'atomic-router';
import { createEvent, sample } from 'effector';
import { $theme, createSpecBoxEffect } from './scope';
import { Theme } from '@/localStorage';

export const controls = createRouterControls();

const saveThemeFx = createSpecBoxEffect(async (theme: Theme, { ls }) => {
  ls.setTheme(theme);
});

export const toggleThemeEvent = createEvent();

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
