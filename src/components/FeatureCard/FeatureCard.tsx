import { FC } from 'react';

import { Feature } from '@/types';
import { bem } from './FeatureCard.cn';
import { AssertionGroup } from './components/AssertionGroup';
import { Header } from './components/Header';

import './FeatureCard.css';
import { DependenciesFeaturesList } from './components/DependenciesFeaturesList';

type FeatureCardProps = {
  className?: string;
  repositoryUrl?: string;
  feature: Feature;
};

export const FeatureCard: FC<FeatureCardProps> = (props) => {
  const { className, feature, repositoryUrl } = props;

  const groups = feature.assertionGroups.map((group, index) => (
    <AssertionGroup key={index} group={group} />
  ));

  return (
    <div className={bem(null, [className])}>
      <Header feature={feature} repositoryUrl={repositoryUrl} />
      {feature.dependencies?.length ? (<DependenciesFeaturesList features={feature.dependencies} />) : null}
      {groups}
    </div>
  );
};
