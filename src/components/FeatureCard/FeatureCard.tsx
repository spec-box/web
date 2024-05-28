import { FC, ReactNode, useCallback, useState } from 'react';
import { Tabs } from '@gravity-ui/uikit';

import { Feature } from '@/types';
import { bem } from './FeatureCard.cn';
import { AssertionGroup } from './components/AssertionGroup';
import { Header } from './components/Header';
import { UsageTable } from './components/UsageTable';

import './FeatureCard.css';

type FeatureCardProps = {
  className?: string;
  repositoryUrl?: string;
  feature: Feature;
};

const tabIdAssertions = 'assertions';
const tabIdUsages = 'usages';

export const FeatureCard: FC<FeatureCardProps> = (props) => {
  const { className, feature, repositoryUrl } = props;
  const { usages, assertionGroups, assertionsCount } = feature;

  const [activeTab, setActiveTab] = useState(tabIdAssertions);
  const goToAssertions = useCallback(() => setActiveTab(tabIdAssertions), [setActiveTab]);
  const goToUsages = useCallback(() => setActiveTab(tabIdUsages), [setActiveTab]);

  let content: ReactNode;

  switch (activeTab) {
    case tabIdAssertions:
      content = assertionGroups.map((group, index) => <AssertionGroup key={index} group={group} />);
      break;
    case tabIdUsages:
      content = <UsageTable usages={usages} />;
      break;
  }

  return (
    <div className={bem(null, [className])}>
      <Header feature={feature} repositoryUrl={repositoryUrl} />
      <div>
        <Tabs activeTab={activeTab}>
          <Tabs.Item
            id={tabIdAssertions}
            title="Функциональные требования"
            counter={assertionsCount.total}
            onClick={goToAssertions}
          />
          <Tabs.Item
            id={tabIdUsages}
            title="Места использования"
            counter={usages.length}
            disabled={!usages.length}
            onClick={goToUsages}
          />
        </Tabs>
      </div>
      {content}
    </div>
  );
};
