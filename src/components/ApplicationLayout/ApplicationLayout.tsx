import { FC, ReactNode } from 'react';

import { cn } from '@bem-react/classname';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './ApplicationLayout.css';
import { $theme } from '@/model';
import { useUnit } from 'effector-react/scope';

const bem = cn('ApplicationLayout');

type ApplicationLayoutProps = {
  children?: ReactNode;
};

export const ApplicationLayout: FC<ApplicationLayoutProps> = ({ children }) => {
  const theme = useUnit($theme);

  return <div className={bem(null, ['g-root', `g-root_theme_${theme}`])}>{children}</div>;
};
