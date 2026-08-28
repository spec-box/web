import { FC, useMemo, useState } from 'react';

import { Drawer } from '@gravity-ui/uikit';

import { ProjectItem } from '@/components/ProjectItem/ProjectItem';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { Project } from '@/types';

import { bem } from './ProjectsDrawer.cn';

import './ProjectsDrawer.css';

export interface ProjectsDrawerProps {
  projects: Project[];
  open: boolean;
  onClose: () => void;
}

export const ProjectsDrawer: FC<ProjectsDrawerProps> = (props) => {
  const { projects, open, onClose } = props;

  const [query, setQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter((project) => project.title.toLowerCase().includes(normalizedQuery));
  }, [projects, query]);

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
          value={query}
          onUpdate={setQuery}
          placeholder="Поиск"
        />
        <div className={bem('Items')}>
          {filteredProjects.map((project) => (
            <ProjectItem key={project.code} project={project} />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
