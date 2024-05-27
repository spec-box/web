import { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { Icon } from '@gravity-ui/uikit';
import Logo from '@/assets/logo.svg?react';

import { RouteLinkButton } from '@/components/RouteLinkButton/RouteLinkButton';
import { ThemeToggler } from '@/components/ThemeToggler/ThemeToggler';
import { homeRoute } from '@/model';

import './Header.css';

const bem = cn('Header');

export type HeaderProps = {
  children?: ReactNode;
};

export const Header: FC<HeaderProps> = (props) => {
  const { children } = props;

  return (
    <div className={bem()}>
      <div className={bem('Left')}>
        <div className={bem('Logo')}>
          <RouteLinkButton to={homeRoute} params={{}} view="flat-info" size="l" pin="circle-circle">
            <Icon data={Logo} size={24} />
          </RouteLinkButton>
        </div>
        <div className={bem('Navigation')}>{children}</div>
      </div>
      <div className={bem('Right')}>
        <ThemeToggler />
      </div>
    </div>
  );
};
