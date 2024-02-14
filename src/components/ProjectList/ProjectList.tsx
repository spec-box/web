import { FC } from 'react';

import { Project } from '@/types';

import { Item } from './components/Item';
import { bem } from './ProjectList.cn';

import './ProjectList.css';

export interface ProjectListProps {
  projects: Project[];
}

export const ProjectList: FC<ProjectListProps> = (props) => {
  const { projects } = props;

  const items = projects.map((p) => <Item key={p.code} project={p} />);

  return <div className={bem()}>{items}</div>;
};
