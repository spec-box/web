import { DependentFeature } from '@/types';
import { FC, useCallback, useState } from 'react';
import { bem } from './DependenciesFeaturesList.cn';

import { ArrowToggle, Icon } from '@gravity-ui/uikit';
import { ListUl, Picture } from '@gravity-ui/icons';
import { FeatureType } from '@/api';
import { ItemStat } from '@/components/ItemStat/ItemStat';
import './DependenciesFeaturesList.css';
import { FeatureLink } from '@/components/FormattedText/FeatureLink';

interface DependenciesFeaturesListProps {
  features: DependentFeature[];
}

export const DependenciesFeaturesList: FC<DependenciesFeaturesListProps> = (props) => {
  const { features } = props;
  const [isOpen, setIsOpen] = useState(false);
  const handleChangeOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const arrow = (
    <ArrowToggle className={bem('CollapseIcon')} direction={isOpen ? 'bottom' : 'top'} />
  );
  const list = features.map(({ featureType, code, title, totalCount, automatedCount }) => (
    <DependenciesFeatureListItem
      featureType={featureType}
      code={code}
      key={code}
      title={title}
      totalCount={totalCount}
      automatedCount={automatedCount}
    />
  ));
  return (
    <div className={bem('Wrapper')}>
      <div onClick={handleChangeOpen} className={bem('Title')}>
        <span>Места использования </span> <span>{arrow}</span>
      </div>
      {isOpen ? <div className={bem('List')}>{list}</div> : null}
    </div>
  );
};

interface DependenciesFeatureListItemProps {
  featureType?: FeatureType;
  code: string;
  title: string;
  totalCount: number;
  automatedCount: number;
}
const DependenciesFeatureListItem: FC<DependenciesFeatureListItemProps> = (props) => {
  const { featureType, code, title, totalCount, automatedCount } = props;
  const commonFeatureIcon = <Icon height={18} width={16} data={ListUl} />;
  const visualFeatureIcon = <Icon height={18} width={16} data={Picture} />;
  const icon = featureType === 'Visual' ? visualFeatureIcon : commonFeatureIcon;
  const stat = <ItemStat totalCount={totalCount} automatedCount={automatedCount} />;

  return (
    <div className={bem('Item')}>
      <div className={bem('Item-Icon')}>{icon}</div>
      <div className={bem('Item-Link')}>
        <FeatureLink feature={code}>{code}</FeatureLink>
      </div>
      <div className={bem('Item-Content')}> {title}</div>
      <div className={bem('Item-Stat')}>{stat}</div>
    </div>
  );
};
