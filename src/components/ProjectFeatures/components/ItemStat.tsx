import { FC } from 'react';

import { bem, RATE_LIMIT } from '../ProjectFeatures.cn';

import './ItemStat.css';

export const ItemStat: FC<{ totalCount: number; automatedCount: number }> = (props) => {
  const { totalCount, automatedCount } = props;

  const rate = totalCount ? Math.round((automatedCount / totalCount) * 100) : 0;
  const state = rate > RATE_LIMIT ? 'normal' : 'warning';

  return (
    <div className={bem('ItemStat', { state })}>
      <div className={bem('ItemStatValue')}>
        {automatedCount} / {totalCount}
      </div>
      <div className={bem('ItemStatValue')}>{rate}%</div>
    </div>
  );
};
