import { FC, useCallback, useState } from 'react';

import { Feature } from '@/types';
import { bem } from './FeatureCard.cn';
import { AssertionGroup } from './components/AssertionGroup';
import { Header, HeaderSkeleton } from './components/Header';
import { AssertionGroupSkeleton } from './components/AssertionGroup';
import { PlaceholderMessage } from '@/components/PlaceholderMessage/PlaceholderMessage';

import './FeatureCard.css';
import { DependenciesFeaturesList } from './components/DependenciesFeaturesList';

import { Graph } from '../../pages/Graph/Graph';
import { Button } from '@gravity-ui/uikit';

type FeatureCardProps = {
  className?: string;
  repositoryUrl?: string;
  feature: Feature | null;
  isPending?: boolean;
};

export const FeatureCard: FC<FeatureCardProps> = (props) => {
  const { className, feature, repositoryUrl, isPending } = props;
  const [stats, setStats] = useState(false);

  const openGraph = useCallback(() => {
    setStats((p) => !p);
  }, []);

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
  if (stats) {
    return (
      <>
        <Button className={bem('Back')} size="m" view="normal" onClick={openGraph}>
          Назад
        </Button>
        <Graph />
      </>
    );
  }

  return (
    <div className={bem(null, [className])}>

      <Header feature={feature} repositoryUrl={repositoryUrl} openGraph={openGraph} />
      {feature.dependencies?.length ? (
        <DependenciesFeaturesList features={feature.dependencies} />
      ) : null}
      {groups}
    </div>
  );
};
