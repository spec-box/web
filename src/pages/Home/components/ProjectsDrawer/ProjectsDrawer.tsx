import { FC } from 'react';

import { Drawer } from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';

import { ProjectItem } from '@/components/ProjectItem/ProjectItem';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import {
  $filteredProjects,
  $projectsDrawerIsOpen,
  $projectsFilter,
  closeProjectsDrawer,
  setProjectsFilter,
} from '@/model/pages/home';

import { bem } from './ProjectsDrawer.cn';

import './ProjectsDrawer.css';

export const ProjectsDrawer: FC = () => {
  const [open, filter, projects] = useUnit([
    $projectsDrawerIsOpen,
    $projectsFilter,
    $filteredProjects,
  ]);

  const [onFilterChange, onClose] = useUnit([setProjectsFilter, closeProjectsDrawer]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} placement="right" size={460}>
      <div className={bem()}>
        <SearchInput
          className={bem('Search')}
          value={filter}
          onUpdate={onFilterChange}
          placeholder="Поиск"
        />
        <div className={bem('Items')}>
          {projects.map((project) => (
            <ProjectItem key={project.code} project={project} />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
