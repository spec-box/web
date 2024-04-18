import { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import './Header.css';

const bem = cn('Header');

export type HeaderProps = {
  logo: ReactNode;
  navigation: ReactNode;
  itemsRight: ReactNode;
};

export const Header: FC<HeaderProps> = (props) => {
  const { logo, navigation, itemsRight } = props;

  return (
    <div className={bem()}>
      <div className={bem('Left')}>
        <div className={bem('Logo')}>{logo}</div>
        <div className={bem('Navigation')}>{navigation}</div>
      </div>
      <div className={bem('Right')}>{itemsRight}</div>
    </div>
  );
};
