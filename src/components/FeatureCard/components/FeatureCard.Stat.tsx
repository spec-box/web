import { FC } from 'react';

import { bem } from '../FeatureCard.cn';

type FeatureCardStatProps = {
  total: number;
  automated: number;
};

export const FeatureCardStat: FC<FeatureCardStatProps> = (props) => {
  const total = Math.round(props.total);
  const automated = Math.round(props.automated);
  const rate = total ? Math.round((automated / total) * 100) : 0;

  return (
    <div className={bem('Stat')}>
      <div className={bem('StatLabel')}>Покрыто тестами</div>
      <div className={bem('StatInfo')}>
        <div className={bem('StatRate')}>{rate} %</div>
        <div className={bem('StatCount')}>
          {automated} из {total}
        </div>
      </div>
    </div>
  );
};
