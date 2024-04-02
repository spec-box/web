import { FC } from 'react';
import { Icon, Label } from '@gravity-ui/uikit';

import { TriangleExclamationFill } from '@gravity-ui/icons';

import { bem } from '../ProjectFeatures.cn';

import './Problems.css';

const icon = <Icon size={12} data={TriangleExclamationFill} />;

export const Problems: FC<{ count: number }> = ({ count }) => {
  return (
    <Label className={bem('Problems')} theme="warning" size="xs" icon={icon}>
      {count}
    </Label>
  );
};
