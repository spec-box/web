import { FC, ReactNode } from 'react';

import { cn } from '@bem-react/classname';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './ApplicationLayout.css';

const bem = cn('ApplicationLayout');

type ApplicationLayoutProps = {
  children?: ReactNode;
};

export const ApplicationLayout: FC<ApplicationLayoutProps> = ({ children }) => {
  return <div className={bem(null, ['g-root', 'g-root_theme_light'])}>{children}</div>;
};
