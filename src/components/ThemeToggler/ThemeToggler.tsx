import { Button, Icon } from '@gravity-ui/uikit';
import { Moon, Sun } from '@gravity-ui/icons';
import { useUnit } from 'effector-react/scope';
import { cn } from '@bem-react/classname';
import { $theme, toggleThemeEvent } from '@/model';
import './ThemeToggler.css';

const bem = cn('ThemeToggler');

export const ThemeToggler = () => {
  const theme = useUnit($theme);
  const toggleTheme = useUnit(toggleThemeEvent);

  return (
    <Button size="l" view="outlined" onClick={toggleTheme} className={bem()}>
      {ThemeToIcon[theme]}
    </Button>
  );
};
const ThemeToIcon = {
  light: <Icon data={Moon} />,
  dark: <Icon data={Sun} />,
};
