import { FC, ReactNode } from 'react';
import { bem } from '../../FeatureCard.cn';

import './Header.css';

interface HeaderLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  actions: ReactNode;
  sidebar: ReactNode;
}

export const HeaderLayout: FC<HeaderLayoutProps> = ({ title, description, actions, sidebar }) => {
  return (
    <div className={bem('Header')}>
      <div className={bem('HeaderBody')}>
        <div className={bem('HeaderContent')}>
          <div className={bem('Title')}>{title}</div>
          {Boolean(description) && <div className={bem('Description')}>{description}</div>}
        </div>
        <div className={bem('Actions')}>{actions}</div>
      </div>
      <div className={bem('HeaderSidebar')}>{sidebar}</div>
    </div>
  );
};
