import { ReactNode } from 'react';
import { Button, Icon } from '@gravity-ui/uikit';
import { Moon, Sun } from '@gravity-ui/icons';
import { useUnit } from 'effector-react/scope';

import { $theme, toggleThemeEvent } from '@/model';
import { UiTheme } from '@/types';

export const ThemeToggler = () => {
  const theme = useUnit($theme);
  const toggleTheme = useUnit(toggleThemeEvent);

  return (
    <Button size="l" view="outlined" pin="circle-circle" onClick={toggleTheme}>
      {ThemeToIcon[theme]}
    </Button>
  );
};

const ThemeToIcon: Record<UiTheme, ReactNode> = {
  light: <Icon data={Moon} />,
  dark: <Icon data={Sun} />,
};
