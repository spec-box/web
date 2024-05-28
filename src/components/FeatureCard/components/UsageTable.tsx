import { FC } from 'react';

import { RelatedFeature as RelatedFeatureData } from '@/types';
import { FeatureLink } from '@/components/FormattedText/FeatureLink';
import { FeatureTypeIcon } from '@/components/FeatureTypeIcon/FeatureTypeIcon';

import { bem } from '../FeatureCard.cn';

import './UsageTable.css';

export type RelatedFeatureProps = {
  feature: RelatedFeatureData;
};

export const RelatedFeature: FC<RelatedFeatureProps> = ({ feature }) => {
  const { code, title, featureType, assertionsCount } = feature;

  const total = Math.round(assertionsCount.total);
  const automated = Math.round(assertionsCount.automated);
  const rate = total ? Math.round((automated / total) * 100) : 0;

  return (
    <>
      <div className={bem('UsageTableCell')}>
        <FeatureTypeIcon featureType={featureType} />
      </div>
      <div className={bem('UsageTableCell')}>
        <FeatureLink feature={code}>{code}</FeatureLink>
      </div>
      <div className={bem('UsageTableCell')}>{title}</div>
      <div className={bem('UsageTableCell', { column: 'stat' })}>
        {automated} / {total}
      </div>
      <div className={bem('UsageTableCell', { column: 'stat' })}>{rate}%</div>
    </>
  );
};

export type UsageTableProps = {
  usages: RelatedFeatureData[];
};

export const UsageTable: FC<UsageTableProps> = ({ usages }) => {
  const rows = usages.map((feature, index) => <RelatedFeature key={index} feature={feature} />);

  return <div className={bem('UsageTable')}>{rows}</div>;
};
