import { FC } from 'react';

import { Project } from '@/types';

import { bem } from './ProjectItem.cn';

import { ListItem } from '@/components/ListItem/ListItem';
import { useRouteLink } from '@/hooks/useRouteLink';
import { projectRoute } from '@/model';

import './ProjectItem.css';

export interface ProjectItemProps {
  project: Project;
}

export const ProjectItem: FC<ProjectItemProps> = (props) => {
  const { project } = props;

  const { href, handler } = useRouteLink({
    to: projectRoute,
    params: { project: project.code },
  });

  const description = project.description ? (
    <div className={bem('ProjectDescription')}>{project.description}</div>
  ) : undefined;

  return (
    <ListItem className={bem('Item')} view="normal" href={href} onPress={handler}>
      <div className={bem('ProjectTitle')}>{project.title}</div>
      {description}
    </ListItem>
  );
};
