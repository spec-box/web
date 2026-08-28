import { FC, useState } from 'react';

import { Button } from '@gravity-ui/uikit';

import { ProjectItem } from '@/components/ProjectItem/ProjectItem';
import { ProjectsDrawer } from '@/components/ProjectsDrawer/ProjectsDrawer';
import { Project } from '@/types';

import { bem } from './ProjectList.cn';

import './ProjectList.css';

export interface ProjectListProps {
  projects: Project[];
}

const SHORT_LIST_SIZE = 7;

export const ProjectList: FC<ProjectListProps> = (props) => {
  const { projects } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items = projects
    .slice(0, SHORT_LIST_SIZE)
    .map((p) => <ProjectItem key={p.code} project={p} />);

  return (
    <div className={bem()}>
      <div className={bem('Items')}>{items}</div>
      <Button className={bem('AllProjects')} view="outlined" onClick={() => setDrawerOpen(true)}>
        Все проекты
      </Button>
      <ProjectsDrawer projects={projects} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};
