import { FC } from 'react';

import { AssertionGroup as AssertionGroupData } from '@/types';

import { Assertion } from '../Assertion';
import { AssertionGroupLayout } from './AssertionGroupLayout';

type AssertionGroupProps = {
  group: AssertionGroupData;
};

export const AssertionGroup: FC<AssertionGroupProps> = (props) => {
  const {
    group: { title, assertions },
  } = props;

  const list = assertions.map((assertion, index) => (
    <Assertion key={index} assertion={assertion} />
  ));

  return <AssertionGroupLayout title={title} assertions={list} />;
};
