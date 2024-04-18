import { FormattedText } from '@/components/FormattedText/FormattedText';
import { calculateRate } from '../../helpers';

import './GraphTooltip.css';
import { cn } from '@bem-react/classname';
import { Problems } from '@/components/ProjectFeatures/components/Problems';
import { Label } from '@gravity-ui/uikit';
const bem = cn('GraphTooltip');

export interface GraphTooltipProps {
  automatedCount: number;
  totalCount: number;
  problemCount: number;
  code?: string;
  title?: string;
}

export const GraphTooltip = ({
  automatedCount,
  totalCount,
  problemCount,
  code,
  title,
}: GraphTooltipProps) => {
  return (
    <div className={bem()} style={{ maxWidth: '360px' }}>
      <FormattedText text={`$${code}`} />
      <div className={bem('Title')}>{title}</div>
      <Label className={bem('Label')} theme="unknown" size="xs">
        {automatedCount}/{totalCount} ({calculateRate(automatedCount, totalCount)}%)
      </Label>
      <Problems count={problemCount} />
    </div>
  );
};
