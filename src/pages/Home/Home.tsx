import { useUnit } from 'effector-react';
import { FC } from 'react';

import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/home';
import { cn } from '@bem-react/classname';

import { ProjectList } from '@/components/ProjectList/ProjectList';
import { Header } from '@/components/Header/Header';

import './Home.css';

const bem = cn('Home');

export const Home: FC = () => {
  const projects = useUnit(model.$projects);
  const projectsIsPending = useUnit(model.$projectsIsLoading);

  useTitle('Проекты');

  const content = projectsIsPending ? <div>загрузка...</div> : <ProjectList projects={projects} />;

  return (
    <div className={bem()}>
      <Header />
      <div className={bem('Body')}>
        <div className={bem('Content')}>
          <div className={bem('Header')}>Проекты</div>
          {content}
          <div className={bem('Hint')}>
            Spec Box — это база функциональных требований, данные для которой хранятся в yml файлах
            в коде проектов.
          </div>
        </div>
      </div>
    </div>
  );
};
