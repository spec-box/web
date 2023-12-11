import { FC } from 'react';

import { AssertionGroup } from '@/types';

import { bem } from '../FeatureCard.cn';
import { FeatureCardAssertion } from './FeatureCard.Assertion';

type FeatureCardAssertionGroupProps = {
  group: AssertionGroup;
};

export const FeatureCardAssertionGroup: FC<FeatureCardAssertionGroupProps> = (props) => {
  const {
    group: { title, assertions },
  } = props;

  const list = assertions.map((assertion, index) => (
    <FeatureCardAssertion key={index} assertion={assertion} />
  ));

  return (
    <div className={bem('AssertionGroup')}>
      <div className={bem('AssertionGroupTitle')}>{title}</div>
      <div className={bem('Assertions')}>{list}</div>
    </div>
  );
};
