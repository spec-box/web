import { FC } from 'react';

import { Feature } from '@/types';
import { bem } from './FeatureCard.cn';
import { AssertionGroup } from './components/AssertionGroup';
import { Header, HeaderSkeleton } from './components/Header';
import { AssertionGroupSkeleton } from './components/AssertionGroup';
import { PlaceholderMessage } from '@/components/PlaceholderMessage/PlaceholderMessage';

import './FeatureCard.css';
import { DependenciesFeaturesList } from './components/DependenciesFeaturesList';

type FeatureCardProps = {
  className?: string;
  repositoryUrl?: string;
  feature: Feature | null;
  isPending?: boolean;
};

export const FeatureCard: FC<FeatureCardProps> = (props) => {
  const { className, feature, repositoryUrl, isPending } = props;

  if (isPending) {
    return (
      <div className={bem({ Loading: isPending }, [className])}>
        <HeaderSkeleton />
        <AssertionGroupSkeleton />
        <AssertionGroupSkeleton />
      </div>
    );
  }

  if (!feature) {
    return (
      <PlaceholderMessage
        className={bem('EmptyState')}
        title="Ничего не выбрано"
        description="Выберите элемент из списка для просмотра детальной информации"
      />
    );
  }

  const groups = feature.assertionGroups.map((group, index) => (
    <AssertionGroup key={index} group={group} />
  ));

  return (
    <div className={bem(null, [className])}>
      <Header feature={feature} repositoryUrl={repositoryUrl} />
      {feature.dependencies?.length ? (
        <DependenciesFeaturesList features={feature.dependencies} />
      ) : null}
      {groups}
    </div>
  );
};
