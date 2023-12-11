import { FC, ReactNode } from 'react';

import { bem } from '../Chart.cn';
import { ChartLegend, ChartLegendDataset } from './Chart.Legend';

export interface ChartLayoutProps {
  className?: string;
  isPending?: boolean;
  title: string;
  legend: ChartLegendDataset[];
  children: ReactNode;
}

export const ChartLayout: FC<ChartLayoutProps> = (props) => {
  const { isPending, className, children, legend, title } = props;

  const content = isPending ? <div className={bem('Loader')}>Идет загрузка...</div> : children;

  return (
    <div className={bem('Layout', [className])}>
      <div className={bem('Header')}>
        <div className={bem('Title')}>{title}</div>
        <ChartLegend datasets={legend} />
      </div>
      <div className={bem('Content')}>{content}</div>
    </div>
  );
};
