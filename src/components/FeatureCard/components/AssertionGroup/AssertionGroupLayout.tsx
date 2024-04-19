import { FC, ReactNode } from 'react';
import { bem } from '../../FeatureCard.cn';

import './AssertionGroup.css';

interface AssertionGroupLayoutProps {
  title: ReactNode;
  assertions: ReactNode;
}

export const AssertionGroupLayout: FC<AssertionGroupLayoutProps> = ({ assertions, title }) => {
  return (
    <div className={bem('AssertionGroup')}>
      <div className={bem('AssertionGroupTitle')}>{title}</div>
      <div className={bem('Assertions')}>{assertions}</div>
    </div>
  );
};
