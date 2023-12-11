import { FC } from 'react';

import { bem } from '../Chart.cn';

export interface ChartLegendDataset {
  color?: string;
  title?: string;
}

export interface ChartLegendProps {
  datasets: ChartLegendDataset[];
}

export const ChartLegend: FC<ChartLegendProps> = ({ datasets }) => {
  const items = datasets.map(({ title, color: backgroundColor }, i) => (
    <div key={i} className={bem('LegendItem')}>
      <div className={bem('LegendBadge')} style={{ backgroundColor }}></div>
      {title}
    </div>
  ));

  return <div className={bem('Legend')}>{items}</div>;
};
