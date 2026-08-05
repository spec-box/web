import { FC, ReactNode } from 'react';

import { cn } from '@bem-react/classname';
import { ThemeProvider } from '@gravity-ui/uikit';
import { $theme } from '@/model';
import { useUnit } from 'effector-react';

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
    <ThemeProvider theme={theme} scoped rootClassName={bem()}>
      {children}
    </ThemeProvider>
  );
};
