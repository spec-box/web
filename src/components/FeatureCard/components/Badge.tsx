import { FC } from 'react';

import { AutomationState } from '@/api';

import { bem } from '../FeatureCard.cn';

import './Badge.css';

export interface BadgeProps {
  automationState: AutomationState;
}

export const Badge: FC<BadgeProps> = ({ automationState }) => {
  const automated = automationState === 'Automated';
  const problem = automationState === 'Problem';

  return <div className={bem('Badge', { automated, problem })}></div>;
};
