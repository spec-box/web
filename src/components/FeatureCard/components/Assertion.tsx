import { FC } from 'react';
import { Icon, Button } from '@gravity-ui/uikit';
import { ArrowUpRightFromSquare } from '@gravity-ui/icons';

import { FormattedText } from '@/components/FormattedText/FormattedText';
import { Assertion as AssertionData } from '@/types';

import { bem } from '../FeatureCard.cn';

import { Badge } from './Badge';

import './Assertion.css';

type AssertionProps = {
  assertion: AssertionData;
};

export const Assertion: FC<AssertionProps> = (props) => {
  const { assertion } = props;

  const description = assertion.description ? (
    <div className={bem('AssertionDescription')}>
      <FormattedText text={assertion.description} />
    </div>
  ) : null;

  const detailsLink =
    assertion.detailsUrl && URL.canParse(assertion.detailsUrl) ? (
      <Button
        href={assertion.detailsUrl}
        target="_blank"
        size="s"
        view="outlined"
        pin="circle-circle"
      >
        Подробнее <Icon size={12} data={ArrowUpRightFromSquare} />
      </Button>
    ) : undefined;

  return (
    <div className={bem('Assertion')}>
      <div className={bem('AssertionBadge')}>
        <Badge automationState={assertion.automationState} />
      </div>
      <div className={bem('AssertionContent')}>
        <div className={bem('AssertionTitle')}>
          <FormattedText text={assertion.title} /> {detailsLink}
        </div>
        {description}
      </div>
    </div>
  );
};
