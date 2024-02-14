import { useStore } from 'effector-react/scope';
import { FC } from 'react';

import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/home';
import { cn } from '@bem-react/classname';

import './Home.css';
import { ProjectList } from '@/components/ProjectList/ProjectList';

const bem = cn('Home');

export const Home: FC = () => {
  const projects = useStore(model.$projects);
  const projectsIsPending = useStore(model.$projectsIsLoading);

  useTitle('Проекты');

  const content = projectsIsPending ? <div>загрузка...</div> : <ProjectList projects={projects} />;

  return (
    <div className={bem()}>
      <div className={bem('Content')}>
        <div className={bem('Header')}>Проекты</div>
        {content}
        <div className={bem('Hint')}>
          Spec Box — это база функциональных требований, данные для которой хранятся в yml файлах в
          коде проектов.
        </div>
      </div>
    </div>
  );
};
