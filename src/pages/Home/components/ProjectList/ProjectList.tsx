import { FC } from 'react';

import { Button } from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';

import { ProjectItem } from '@/components/ProjectItem/ProjectItem';
import { openProjectsDrawer } from '@/model/pages/home';
import { Project } from '@/types';

import { ProjectsDrawer } from '../ProjectsDrawer/ProjectsDrawer';

import { bem } from './ProjectList.cn';

import './ProjectList.css';

export interface ProjectListProps {
  projects: Project[];
}

const SHORT_LIST_SIZE = 7;

export const ProjectList: FC<ProjectListProps> = (props) => {
  const { projects } = props;
  const onOpenDrawer = useUnit(openProjectsDrawer);

  const items = projects
    .slice(0, SHORT_LIST_SIZE)
    .map((p) => <ProjectItem key={p.code} project={p} />);

  return (
    <div className={bem()}>
      <div className={bem('Items')}>{items}</div>
      <Button className={bem('AllProjects')} view="outlined" onClick={onOpenDrawer}>
        Все проекты
      </Button>
      <ProjectsDrawer />
    </div>
  );
};
