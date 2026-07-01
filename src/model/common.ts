import { createRouterControls } from '@virentia/router';
import { event, reaction, store } from '@virentia/core';

import { UiTheme } from '@/types';

import { createSpecBoxEffect } from './scope';

// routes
export const controls = createRouterControls();

// theme
export const $theme = store<UiTheme>('light');
export const toggleThemeEvent = event();

const saveThemeFx = createSpecBoxEffect(async (theme: UiTheme, { ls }) => {
  ls.setTheme(theme);
});

const themeByPrevTheme: Record<UiTheme, UiTheme> = {
  light: 'dark',
  dark: 'light',
};

reaction({
  on: toggleThemeEvent,
  run() {
    $theme.value = themeByPrevTheme[$theme.value];
  },
});

// сохраняем тему при каждом её изменении
reaction({
  on: $theme,
  run(theme) {
    saveThemeFx(theme);
  },
});
