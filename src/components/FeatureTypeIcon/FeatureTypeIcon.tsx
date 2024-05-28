import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Icon } from '@gravity-ui/uikit';
import { ListUl, Picture } from '@gravity-ui/icons';

import { FeatureType } from '@/api';

const bem = cn('FeatureTypeIcon');

const commonFeatureIcon = <Icon className={bem()} size={16} data={ListUl} />;
const visualFeatureIcon = <Icon className={bem()} size={16} data={Picture} />;

export interface FeatureTypeIconProps {
  featureType?: FeatureType;
}

export const FeatureTypeIcon: FC<FeatureTypeIconProps> = ({ featureType }) => {
  return featureType === 'Visual' ? visualFeatureIcon : commonFeatureIcon;
};
