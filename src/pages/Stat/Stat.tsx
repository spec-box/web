import { useUnit } from 'effector-react';
import { FC } from 'react';
import { cn } from '@bem-react/classname';

import { AssertionsChart, AutotestsChart } from '@/components/Chart/Chart';
import { ProjectLayout } from '@/components/ProjectLayout/ProjectLayout';
import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/stat';

import './Stat.css';

const bem = cn('Stat');

export const Stat: FC = () => {
  const { assertions, autotests, project } = useUnit(model.$stat);
  const isLoading = useUnit(model.$statIsLoading);

  useTitle(isLoading ? 'Статистика' : `${project.title}. Статистика`);

  return (
    <ProjectLayout contentClassName={bem()} project={project.code}>
      <div className={bem('Row', ['row', 'gy-3'])}>
        <div className={bem('Col', ['col-xs-12', 'col-lg-6'])}>
          <AssertionsChart isPending={isLoading} stat={assertions} />
        </div>
        <div className={bem('Col', ['col-xs-12', 'col-lg-6'])}>
          <AutotestsChart isPending={isLoading} stat={autotests} />
        </div>
      </div>
    </ProjectLayout>
  );
};
