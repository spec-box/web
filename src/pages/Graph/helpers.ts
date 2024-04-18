import listError from '@/assets/graph/list-ul-error.svg';
import listSuccess from '@/assets/graph/list-ul-success.svg';
import listWarn from '@/assets/graph/list-ul-warn.svg';
import imageError from '@/assets/graph/picture-error.svg';
import imageSuccess from '@/assets/graph/picture-success.svg';
import imageWarn from '@/assets/graph/picture-warn.svg';

import { FeatureType } from '@/api';
import { DrawnNode } from '@/types';
import { RATE_LIMIT, COLORS } from '@/components/ProjectFeatures/ProjectFeatures.cn';

const featureTypeMap: Record<FeatureType, Record<string, string>> = {
  Functional: {
    success: listSuccess,
    error: listError,
    warn: listWarn,
  },
  Visual: {
    success: imageSuccess,
    error: imageError,
    warn: imageWarn,
  },
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

const setNodeColors: StylesSetter = (node, parent) => {
  const color = COLORS[getStatus(parent)];
  return { ...node, keyshape: { stroke: color, fill: color } };
};

const setIcon: StylesSetter = (node, parent) => {
  return {
    ...node,
    icon: {
      type: 'image',
      value: featureTypeMap[parent?.featureType || 'Functional'][getStatus(parent)],
      size: [16, 16],
    },
  };
};
export const prepareDataToView = (node: DrawnNode): DrawnNode => {
  return { ...node, style: setIcon(setNodeColors(node.style, node), node) };
};
