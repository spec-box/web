import listError from '@/assets/graph/list-ul-error.svg';
import listSuccess from '@/assets/graph/list-ul-success.svg';
import listWarn from '@/assets/graph/list-ul-warn.svg';
import listRoot from '@/assets/graph/list-ul-root.svg';
import imageError from '@/assets/graph/picture-error.svg';
import imageSuccess from '@/assets/graph/picture-success.svg';
import imageWarn from '@/assets/graph/picture-warn.svg';
import imageRoot from '@/assets/graph/picture-root.svg';

import { FeatureType } from '@/api';
import { DrawnNode } from '@/types';
import { RATE_LIMIT, COLORS } from '@/components/ProjectFeatures/ProjectFeatures.cn';

const featureTypeMap: Record<FeatureType, Record<string, string>> = {
  Functional: {
    success: listSuccess,
    error: listError,
    warn: listWarn,
    root: listRoot,
  },
  Visual: {
    success: imageSuccess,
    error: imageError,
    warn: imageWarn,
    root: imageRoot,
  },
};
const sizeCalculate = (initialSize: number, weight: number) => {
  return initialSize + weight * initialSize * 0.5;
};

type StylesSetter = (node: DrawnNode['style'], parent: DrawnNode) => DrawnNode['style'];
type Status = Pick<DrawnNode, 'totalCount' | 'automatedCount' | 'problemCount'>;

export const calculateRate = (automatedCount: number, totalCount: number): number => {
  return Math.round((automatedCount / totalCount) * 100);
};

const getStatus = ({ totalCount, automatedCount, problemCount }: Status): string => {
  if (calculateRate(automatedCount, totalCount) < RATE_LIMIT) return 'error';
  if (problemCount > 0) return 'warn';
  return 'success';
};

const setNodeStyle: StylesSetter = (node, parent) => {
  const color = parent.root ? COLORS['root'] : COLORS[getStatus(parent)];
  const defaultSize = 25;
  const rootLineWidth = 2;

  return {
    ...node,
    keyshape: {
      stroke: color,
      fill: color,
      size: sizeCalculate(defaultSize, parent.weight),
      lineWidth: parent.root ? rootLineWidth : undefined,
    },
  };
};

const setIcon: StylesSetter = (node, parent) => {
  const defaultSize = 16;
  const type = featureTypeMap[parent?.featureType || 'Functional'];

  return {
    ...node,
    icon: {
      type: 'image',
      value: parent.root ? type['root'] : type[getStatus(parent)],
      size: [sizeCalculate(defaultSize, parent.weight), sizeCalculate(defaultSize, parent.weight)],
    },
  };
};

export const prepareDataToView = (node: DrawnNode): DrawnNode => {
  return { ...node, style: setIcon(setNodeStyle(node.style, node), node) };
};
