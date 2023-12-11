import { FC } from 'react';

import { Feature } from '@/types';
import { bem } from './FeatureCard.cn';
import { FeatureCardAssertionGroup } from './components/FeatureCard.AssertionGroup';
import { FeatureCardHeader } from './components/FeatureCard.Header';

import './FeatureCard.css';

type FeatureCardProps = {
  className?: string;
  repositoryUrl?: string;
  feature: Feature;
};

export const FeatureCard: FC<FeatureCardProps> = (props) => {
  const { className, feature, repositoryUrl } = props;

  const groups = feature.assertionGroups.map((group, index) => (
    <FeatureCardAssertionGroup key={index} group={group} />
  ));

  return (
    <div className={bem(null, [className])}>
      <FeatureCardHeader feature={feature} repositoryUrl={repositoryUrl} />
      {groups}
    </div>
  );
};
