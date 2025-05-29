import { FC, useCallback, useState } from 'react';
import { Pagination, PaginationProps } from '@gravity-ui/uikit';

import { Project } from '@/types';

import { Item } from './components/Item';
import { bem } from './ProjectList.cn';

import './ProjectList.css';

export interface ProjectListProps {
  projects: Project[];
}

const PAGE_SIZE = 8;

function paginate<T>(array: T[], page: number, pageSize: number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page - 1) * pageSize, page * pageSize);
}

export const ProjectList: FC<ProjectListProps> = (props) => {
  const { projects } = props;
  const [page, setPage] = useState(1);

  const handleUpdate: PaginationProps['onUpdate'] = useCallback((page) => setPage(page), []);

  const pagination =
    projects.length <= PAGE_SIZE ? null : (
      <div className={bem('Pagination')}>
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={projects.length}
          onUpdate={handleUpdate}
        />
      </div>
    );

  const items = paginate(projects, page, PAGE_SIZE).map((p) => <Item key={p.code} project={p} />);

  return (
    <div className={bem()}>
      <div className={bem('Items')}>{items}</div>
      {pagination}
    </div>
  );
};
