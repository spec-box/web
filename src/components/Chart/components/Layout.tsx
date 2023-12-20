import { FC, ReactNode } from 'react';

import { bem } from '../Chart.cn';

import { Legend, LegendDataset } from './Legend';

import './Layout.css';

export interface ChartLayoutProps {
  className?: string;
  isPending?: boolean;
  title: string;
  legend: LegendDataset[];
  children: ReactNode;
}

export const Layout: FC<ChartLayoutProps> = (props) => {
  const { isPending, className, children, legend, title } = props;

  const content = isPending ? <div className={bem('Loader')}>Идет загрузка...</div> : children;

  return (
    <div className={bem('Layout', [className])}>
      <div className={bem('Header')}>
        <div className={bem('Title')}>{title}</div>
        <Legend datasets={legend} />
      </div>
      <div className={bem('Content')}>{content}</div>
    </div>
  );
};
