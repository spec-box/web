import { createRouterControls } from 'atomic-router';
import { createEvent, createStore, sample } from 'effector';

import { UiTheme } from '@/types';

import { createSpecBoxEffect } from './scope';

// routes
export const controls = createRouterControls();

// theme
export const $theme = createStore<UiTheme>('light');
export const toggleThemeEvent = createEvent();

const saveThemeFx = createSpecBoxEffect(async (theme: UiTheme, { ls }) => {
  ls.setTheme(theme);
});

const themeByPrevTheme: Record<UiTheme, UiTheme> = {
  light: 'dark',
  dark: 'light',
};

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
