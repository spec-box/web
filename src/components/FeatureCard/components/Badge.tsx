import { FC, ReactNode } from 'react';
import { Icon } from '@gravity-ui/uikit';

import { CircleCheckFill, CircleXmarkFill, TriangleExclamationFill } from '@gravity-ui/icons';

import { AutomationState } from '@/api';

import { bem } from '../FeatureCard.cn';

import './Badge.css';

const icons: Record<AutomationState, ReactNode> = {
  Automated: <Icon size={16} data={CircleCheckFill} />,
  Problem: <Icon size={16} data={TriangleExclamationFill} />,
  Unknown: <Icon size={16} data={CircleXmarkFill} />,
};

export interface BadgeProps {
  automationState: AutomationState;
}

export const Badge: FC<BadgeProps> = ({ automationState }) => {
  const automated = automationState === 'Automated';
  const problem = automationState === 'Problem';

  return <div className={bem('Badge', { automated, problem })}>{icons[automationState]}</div>;
};
