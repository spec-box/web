import { FC } from 'react';

import { bem } from '../FeatureCard.cn';

import './Badge.css';

export interface BadgeProps {
  automated: boolean;
}

export const Badge: FC<BadgeProps> = ({ automated }) => {
  return <div className={bem('Badge', { automated })}></div>;
};
