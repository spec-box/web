import { RouteInstance } from 'atomic-router';
import { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Skeleton } from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';

import {
  ProjectContext,
  OpenFeatureLinkEventHandler,
} from '@/components/ProjectContext/ProjectContext';
import { RouteLinkButton } from '@/components/RouteLinkButton/RouteLinkButton';
import { Header } from '@/components/Header/Header';

import { projectRoute, statRoute } from '@/model';

import './ProjectLayout.css';

const bem = cn('ProjectLayout');

type ProjectLayoutProps = {
  project: string;
  navigate?: OpenFeatureLinkEventHandler;
  contentClassName?: string;
  children?: ReactNode;
};

interface NavItemProps {
  to: RouteInstance<{ project?: string }>;
  text: string;
  project: string;
}

const NavItem: FC<NavItemProps> = ({ to, text, project }) => {
  const isOpened = useUnit(to.$isOpened);

  if (!project) {
    return <Skeleton />;
  }

  const view = isOpened ? 'normal' : 'flat';

  return (
    <RouteLinkButton to={to} params={{ project }} view={view} size="l" pin="circle-circle">
      {text}
    </RouteLinkButton>
  );
};

export const ProjectLayout: FC<ProjectLayoutProps> = (props) => {
  const { children, contentClassName, navigate, project } = props;

  return (
    <ProjectContext.Provider value={{ project, navigate }}>
      <div className={bem()}>
        <Header>
          <NavItem to={projectRoute} project={project} text="Структура" />
          <NavItem to={statRoute} project={project} text="Статистика" />
        </Header>
        <div className={bem('Content', [contentClassName])}>{children}</div>
      </div>
    </ProjectContext.Provider>
  );
};
