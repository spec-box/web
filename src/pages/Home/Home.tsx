import { useStore } from 'effector-react/scope';
import { FC } from 'react';

import { RouteLink } from '@/components/RouteLink/RouteLink';
import { useTitle } from '@/hooks/useTitle';
import { projectRoute } from '@/model';
import * as model from '@/model/pages/home';
import { Project } from '@/types';
import { cn } from '@bem-react/classname';

import './Home.css';

const bem = cn('Home');

interface ProjectListItemProps {
  project: Project;
}

const ProjectListItem: FC<ProjectListItemProps> = ({ project }) => {
  const description = project.description ? (
    <div className={bem('ProjectDescription')}>{project.description}</div>
  ) : undefined;

  return (
    <div>
      <div className={bem('ProjectName')}>
        <RouteLink to={projectRoute} params={{ project: project.code }}>
          {project.title}
        </RouteLink>
      </div>
      {description}
    </div>
  );
};

export const Home: FC = () => {
  const projects = useStore(model.$projects);
  const projectsIsPending = useStore(model.$projectsIsLoading);

  useTitle('Проекты');

  const content = projectsIsPending ? (
    <>загрузка...</>
  ) : (
    projects.map((p) => <ProjectListItem key={p.code} project={p} />)
  );

  return (
    <div>
      <h1>Spec Box</h1>
      <p>
        Spec Box — это база функциональных требований, данные для которой хранятся в yml файлах в
        коде проектов.
      </p>
      <h2>Проекты</h2>
      <div>{content}</div>
    </div>
  );
};
