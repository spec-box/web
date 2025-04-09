import { FC, ReactNode } from 'react';

import { useUnit } from 'effector-react';
import { ThemeProvider } from '@gravity-ui/uikit';
import { cn } from '@bem-react/classname';
import { $theme } from '@/model';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './ApplicationLayout.css';

const bem = cn('ApplicationLayout');

type ApplicationLayoutProps = {
  children?: ReactNode;
};

export const ApplicationLayout: FC<ApplicationLayoutProps> = ({ children }) => {
  const theme = useUnit($theme);

  return (
    <ThemeProvider theme={theme}>
      <div className={bem()}>{children}</div>
    </ThemeProvider>
  );
};
