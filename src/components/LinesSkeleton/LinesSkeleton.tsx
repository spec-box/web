import { FC } from 'react';

import { Skeleton } from '@gravity-ui/uikit';

import { bem } from './LinesSkeleton.cn';

import './LinesSkeleton.css';

export interface SkeletonLine {
  /** уровень вложенности строки */
  indent?: number;
  /** ширина строки, любое css-значение */
  width?: string;
  /** высота строки в пикселях (по умолчанию — из стилей компонента) */
  height?: number;
}

const DEFAULT_INDENT_SIZE = 32;

type LinesSkeletonProps = {
  className?: string;
  /** описание строк скелетона */
  lines: SkeletonLine[];
  /** размер отступа одного уровня вложенности в пикселях */
  indentSize?: number;
};

/** Скелетон в виде набора строк с отступами — имитация списка или дерева */
export const LinesSkeleton: FC<LinesSkeletonProps> = (props) => {
  const { className, lines, indentSize = DEFAULT_INDENT_SIZE } = props;

  return (
    <div className={bem(null, [className])}>
      {lines.map((line, index) => (
        <div key={index} style={{ paddingInlineStart: (line.indent ?? 0) * indentSize }}>
          <Skeleton className={bem('Bar')} style={{ width: line.width, height: line.height }} />
        </div>
      ))}
    </div>
  );
};
