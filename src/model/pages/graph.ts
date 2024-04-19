import { createRoute } from 'atomic-router';
import { sample, restore } from 'effector';

import { StoreDependencies, createSpecBoxEffect } from '../scope';
import { ProjectGraphData } from '@/types';
import { mapProjectGraph } from '@/mappers';

export const graphRoute = createRoute<{ project?: string }>();

const STUB: ProjectGraphData = {
  nodes: [],
  edges: [],
  project: { code: '', title: '' },
  feature: '',
};

interface LoadGraphFxParams {
  project: string;
  feature: string;
}

export const loadGraphFx = createSpecBoxEffect(
  async ({ project, feature }: LoadGraphFxParams, deps: StoreDependencies) => {
    try {
      const graph = await deps.api.projectsProjectGraph(project);
      return mapProjectGraph({ ...graph, feature, project: { code: project, title: project } });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const $graph = restore<ProjectGraphData>(loadGraphFx.doneData, STUB);
export const $graphIsLoading = loadGraphFx.pending;

sample({
  clock: [graphRoute.opened],
  fn: ({ params: { project = '' }, query: { feature = '' } }) => ({ project, feature }),
  target: loadGraphFx,
});
