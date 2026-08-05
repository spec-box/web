import { FC, ReactNode, useState } from 'react';
import { Tab, TabList, TabProvider } from '@gravity-ui/uikit';

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
        <TabProvider value={activeTab} onUpdate={setActiveTab}>
          <TabList>
            <Tab value={tabIdAssertions} counter={assertionsCount.total}>
              Функциональные требования
            </Tab>
            <Tab value={tabIdUsages} counter={usages.length} disabled={!usages.length}>
              Места использования
            </Tab>
          </TabList>
        </TabProvider>
      </div>
      {content}
    </div>
  );
};
