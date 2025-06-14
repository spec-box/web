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
import { useUnit } from 'effector-react';

import { $theme } from '@/model';
import { StatAssertion, StatAutotestsItem, UiTheme } from '@/types';

import { bem } from './Chart.cn';
import { Layout } from './components/Layout';
import { LegendDataset } from './components/Legend';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

interface Point {
  x: Date;
  y: number;
}

const getOptions = (config: {
  xGridColor: string;
  xTicksColor: string;
  yGridColor: string;
  yTicksColor: string;
}): ChartOptions<'line' | 'bar'> => {
  const { xGridColor, xTicksColor, yGridColor, yTicksColor } = config;

  return {
    // https://github.com/chartjs/Chart.js/issues/11005
    maintainAspectRatio: false,
    responsive: true,
    interaction: { mode: 'index' },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 0,
      },
      line: {
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        grid: {
          color: xGridColor,
        },
        type: 'time',
        alignToPixels: true,
        ticks: {
          color: xTicksColor,
          maxRotation: 0,
          autoSkipPadding: 32,
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
        grid: {
          color: yGridColor,
        },
        ticks: {
          color: yTicksColor,
        },
        min: 0,
      },
    },
  };
};

type Colors = {
  borderColor: string;
  backgroundColor?: string;
};

type CreateAssertionsDataSetsMeta = {
  colors: Record<'problem' | 'automated' | 'total', Colors>;
};

const createAssertionsDataSets = (
  data: StatAssertion[],
  meta: CreateAssertionsDataSetsMeta,
): ChartData<'line', Point[], string> => {
  const { total, automated, problem } = data.reduce<{
    total: Point[];
    automated: Point[];
    problem: Point[];
  }>(
    (a, { timestamp, totalCount, automatedCount, problemCount }) => {
      a.total.push({ x: timestamp, y: totalCount });
      a.automated.push({ x: timestamp, y: automatedCount });
      a.problem.push({ x: timestamp, y: problemCount });

      return a;
    },
    { total: [], automated: [], problem: [] },
  );

  return {
    datasets: [
      {
        ...meta.colors.problem,
        cubicInterpolationMode: 'default',
        label: 'Проблемы',
        data: problem,
        fill: false,
      },
      {
        ...meta.colors.automated,
        cubicInterpolationMode: 'default',
        label: 'Автоматизировано',
        data: automated,
        fill: true,
      },
      {
        ...meta.colors.total,
        cubicInterpolationMode: 'default',
        label: 'Всего',
        data: total,
        fill: true,
      },
    ],
  };
};

type CreateAutotestsDataSetsMeta = {
  colors: Colors;
};

const createAutotestsDataSets = (
  data: StatAutotestsItem[],
  meta: CreateAutotestsDataSetsMeta,
): ChartData<'bar', Point[], string> => {
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
        ...meta.colors,
        label: 'Количество за день',
        data: autotests,
      },
    ],
  };
};

export interface AssertionsChartProps {
  isPending?: boolean;
  stat: StatAssertion[];
}

export interface ChartColors {
  colorBaseDangerHeavy: string;
  colorBaseDangerMedium: string;
  colorBaseInfoHeavy: string;
  colorBaseInfoMedium: string;
  colorBaseWarningHeavy: string;
  colorTextSecondary: string;
  colorLineGeneric: string;
}

const colorsByTheme: Record<UiTheme, ChartColors> = {
  light: {
    colorBaseDangerHeavy: '#E9033A',
    colorBaseDangerMedium: '#FF66B299',
    colorBaseInfoHeavy: '#348BDC',
    colorBaseInfoMedium: '#BDD8F3',
    colorBaseWarningHeavy: '#FFBE5C',
    colorTextSecondary: '#00000080',
    colorLineGeneric: '#0000001a',
  },
  dark: {
    colorBaseDangerHeavy: '#E8476D',
    colorBaseDangerMedium: '#E5325D80',
    colorBaseInfoHeavy: '#4AA1F2',
    colorBaseInfoMedium: '#3B6696',
    colorBaseWarningHeavy: '#FFC56C',
    colorTextSecondary: '#ffffff80',
    colorLineGeneric: '#ffffff26',
  },
};

export const AssertionsChart: FC<AssertionsChartProps> = ({ stat, isPending }) => {
  const theme = useUnit($theme);
  const colors = colorsByTheme[theme];

  const data = useMemo(
    () =>
      createAssertionsDataSets(stat, {
        colors: {
          problem: {
            borderColor: colors.colorBaseWarningHeavy,
          },
          automated: {
            borderColor: colors.colorBaseInfoHeavy,
            backgroundColor: colors.colorBaseInfoMedium,
          },
          total: {
            borderColor: colors.colorBaseDangerHeavy,
            backgroundColor: colors.colorBaseDangerMedium,
          },
        },
      }),
    [stat, colors],
  );
  const legend = useMemo(
    () =>
      data.datasets.map(
        (ds): LegendDataset => ({
          color: ds.borderColor?.toString(),
          title: ds.label,
        }),
      ),
    [data],
  );

  const options = useMemo(
    () =>
      getOptions({
        xGridColor: colors.colorLineGeneric,
        xTicksColor: colors.colorTextSecondary,
        yGridColor: colors.colorLineGeneric,
        yTicksColor: colors.colorTextSecondary,
      }),
    [colors],
  );

  return (
    <Layout className={bem()} title="Покрытие автотестами" isPending={isPending} legend={legend}>
      <Line options={options} data={data} />
    </Layout>
  );
};

export interface AutotestsChartProps {
  isPending?: boolean;
  stat: StatAutotestsItem[];
}

export const AutotestsChart: FC<AutotestsChartProps> = ({ stat, isPending }) => {
  const theme = useUnit($theme);
  const colors = colorsByTheme[theme];

  const data = useMemo(
    () =>
      createAutotestsDataSets(stat, {
        colors: {
          borderColor: colors.colorBaseDangerHeavy,
          backgroundColor: colors.colorBaseDangerMedium,
        },
      }),
    [stat, colors],
  );

  const legend = useMemo(
    () =>
      data.datasets.map(
        (ds): LegendDataset => ({
          color: ds.borderColor?.toString(),
          title: ds.label,
        }),
      ),
    [data],
  );

  const options = useMemo(
    () =>
      getOptions({
        xGridColor: colors.colorLineGeneric,
        xTicksColor: colors.colorTextSecondary,
        yGridColor: colors.colorLineGeneric,
        yTicksColor: colors.colorTextSecondary,
      }),
    [colors],
  );

  return (
    <Layout className={bem()} title="Выполненные проверки" isPending={isPending} legend={legend}>
      <Bar options={options} data={data} />
    </Layout>
  );
};
