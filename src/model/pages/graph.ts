import { sample, restore } from 'effector';

import { StoreDependencies, createSpecBoxEffect } from '../scope';
import { ProjectGraphData } from '@/types';
import { mapProjectGraph } from '@/mappers';
import { projectRoute } from './project';

const STUB: ProjectGraphData = {
  nodes: [],
  edges: [],
  project: { code: '', title: '' },
};

interface LoadGraphFxParams {
  project: string;
}

export const loadGraphFx = createSpecBoxEffect(
  async ({ project }: LoadGraphFxParams, deps: StoreDependencies) => {
    try {
      const graph = await deps.api.projectsProjectGraph(project);
      return mapProjectGraph({ ...graph, project: { code: project, title: project } });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const $graph = restore<ProjectGraphData>(loadGraphFx.doneData, STUB);
export const $graphIsLoading = loadGraphFx.pending;

sample({
  clock: [projectRoute.opened],
  fn: ({ params: { project = '' } }) => ({ project }),
  target: loadGraphFx,
});
