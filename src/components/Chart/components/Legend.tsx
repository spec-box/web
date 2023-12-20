import { FC } from 'react';

import { bem } from '../Chart.cn';

import './Legend.css';

export interface LegendDataset {
  color?: string;
  title?: string;
}

export interface LegendProps {
  datasets: LegendDataset[];
}

export const Legend: FC<LegendProps> = ({ datasets }) => {
  const items = datasets.map(({ title, color: backgroundColor }, i) => (
    <div key={i} className={bem('LegendItem')}>
      <div className={bem('LegendBadge')} style={{ backgroundColor }}></div>
      {title}
    </div>
  ));

  return <div className={bem('Legend')}>{items}</div>;
};
