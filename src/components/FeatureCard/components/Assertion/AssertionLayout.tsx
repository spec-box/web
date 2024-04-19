import { FC, ReactNode } from 'react';

import { bem } from '../../FeatureCard.cn';
import './Assertion.css';

interface AssertionLayoutProps {
  badge: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

export const AssertionLayout: FC<AssertionLayoutProps> = ({ badge, title, description }) => {
  return (
    <div className={bem('Assertion')}>
      <div className={bem('AssertionBadge')}>{badge}</div>
      <div className={bem('AssertionContent')}>
        <div className={bem('AssertionTitle')}>{title}</div>
        {Boolean(description) && <div className={bem('AssertionDescription')}>{description}</div>}
      </div>
    </div>
  );
};
