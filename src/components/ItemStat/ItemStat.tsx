import { FC } from 'react';

import { RATE_LIMIT, bem } from './ItemStat.cn';

import './ItemStat.css';

export const ItemStat: FC<{ totalCount: number; automatedCount: number }> = (props) => {
  const { totalCount, automatedCount } = props;

  const rate = totalCount ? Math.round((automatedCount / totalCount) * 100) : 0;
  const state = rate > RATE_LIMIT ? 'normal' : 'warning';

  return (
    <div className={bem('Content', { state })}>
      <div className={bem('Value')}>
        {automatedCount} / {totalCount}
      </div>
      <div className={bem('Value')}>{rate}%</div>
    </div>
  );
};
