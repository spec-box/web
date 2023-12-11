import {
  BarElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FC, useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';

import { StatAssertion, StatAutotestsItem } from '@/types';

import { bem } from './Chart.cn';
import { ChartLayout } from './components/Chart.Layout';
import { ChartLegendDataset } from './components/Chart.Legend';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

interface Point {
  x: Date;
  y: number;
}

const options: ChartOptions<'line' | 'bar'> = {
  // https://github.com/chartjs/Chart.js/issues/11005
  maintainAspectRatio: false,
  responsive: true,
  interaction: { mode: 'index' },
  elements: {
    point: {
      radius: 0,
      hitRadius: 30,
      hoverRadius: 0,
    },
    line: {
      borderWidth: 2,
    },
  },
  scales: {
    x: {
      type: 'time',
      alignToPixels: true,
      ticks: {
        maxRotation: 0,
        autoSkipPadding: 10,
      },
      adapters: {
        date: { locale: ru },
      },
      time: {
        tooltipFormat: 'PPP',
        displayFormats: { day: 'd MMM' },
        unit: 'day',
      },
    },
    y: {
      min: 0,
    },
  },
};

const createAssertionsDataSets = (data: StatAssertion[]): ChartData<'line', Point[], string> => {
  const { total, automated } = data.reduce<{ total: Point[]; automated: Point[] }>(
    (a, { timestamp, totalCount, automatedCount }) => {
      a.total.push({ x: timestamp, y: totalCount });
      a.automated.push({ x: timestamp, y: automatedCount });

      return a;
    },
    { total: [], automated: [] },
  );

  return {
    datasets: [
      {
        cubicInterpolationMode: 'monotone',
        label: 'Автоматизировано',
        borderColor: '#6673FF',
        backgroundColor: '#99A2FF',
        data: automated,
        fill: true,
      },
      {
        cubicInterpolationMode: 'monotone',
        label: 'Всего',
        borderColor: '#FF3399',
        backgroundColor: '#FF66B29A',
        data: total,
        fill: true,
      },
    ],
  };
};

const createAutotestsDataSets = (data: StatAutotestsItem[]): ChartData<'bar', Point[], string> => {
  const totals = data.reduce<Map<number, number>>((a, { timestamp, assertionsCount }) => {
    const day = Number(startOfDay(timestamp));

    if (a.has(day)) {
      a.set(day, (a.get(day) || 0) + assertionsCount);
    } else {
      a.set(day, assertionsCount);
    }

    return a;
  }, new Map<number, number>());

  const autotests = Array.from(totals.keys())
    .sort()
    .map((day): Point => ({ x: new Date(day), y: totals.get(day) || 0 }));

  return {
    datasets: [
      {
        label: 'Количество за день',
        borderColor: '#6673FF',
        backgroundColor: '#99A2FF',
        data: autotests,
      },
    ],
  };
};

export interface AssertionsChartProps {
  isPending?: boolean;
  stat: StatAssertion[];
}

export const AssertionsChart: FC<AssertionsChartProps> = ({ stat, isPending }) => {
  const data = useMemo(() => createAssertionsDataSets(stat), [stat]);
  const legend = useMemo(
    () =>
      data.datasets.map(
        (ds): ChartLegendDataset => ({
          color: ds.borderColor?.toString(),
          title: ds.label,
        }),
      ),
    [data],
  );

  return (
    <ChartLayout
      className={bem()}
      title="Покрытие автотестами"
      isPending={isPending}
      legend={legend}
    >
      <Line options={options} data={data} />
    </ChartLayout>
  );
};

export interface AutotestsChartProps {
  isPending?: boolean;
  stat: StatAutotestsItem[];
}

export const AutotestsChart: FC<AutotestsChartProps> = ({ stat, isPending }) => {
  const data = useMemo(() => createAutotestsDataSets(stat), [stat]);

  const legend = useMemo(
    () =>
      data.datasets.map(
        (ds): ChartLegendDataset => ({
          color: ds.borderColor?.toString(),
          title: ds.label,
        }),
      ),
    [data],
  );

  return (
    <ChartLayout
      className={bem()}
      title="Выполненные проверки"
      isPending={isPending}
      legend={legend}
    >
      <Bar options={options} data={data} />
    </ChartLayout>
  );
};
