import { SkeletonLine } from './LinesSkeleton';

// строки, имитирующие дерево фичей
export const TREE_SKELETON_LINES: SkeletonLine[] = [
  { width: '45%' },
  { indent: 1, width: '60%' },
  { indent: 1, width: '40%' },
  { indent: 2, width: '55%' },
  { indent: 2, width: '35%' },
  { width: '30%' },
  { indent: 1, width: '50%' },
  { indent: 1, width: '65%' },
  { indent: 2, width: '45%' },
  { width: '40%' },
];

// строки, имитирующие карточку фичи:
// заголовок, код, табы и группы требований
export const FEATURE_SKELETON_LINES: SkeletonLine[] = [
  { width: '50%', height: 28 },
  { width: '20%' },
  { width: '60%' },
  { width: '30%', height: 24 },
  { indent: 1, width: '80%' },
  { indent: 1, width: '70%' },
  { indent: 1, width: '75%' },
  { width: '35%', height: 24 },
  { indent: 1, width: '65%' },
  { indent: 1, width: '80%' },
];
