import { createRoute } from 'atomic-router';
import { restore, sample } from 'effector';

import { mapProjectStat } from '@/mappers';
import { ProjectStat } from '@/types';

import { StoreDependencies, createSpecBoxEffect } from '../scope';
import { parseISO } from 'date-fns';

const STUB: ProjectStat = {
  assertions: [],
  autotests: [],
  project: { code: '', title: '' },
};

export const statRoute = createRoute<{ project?: string }>();

interface LoadStatFxParams {
  project: string;
  from?: string;
  to?: string;
}

const getDate = (str?: string) => (str ? parseISO(str) : undefined);

export const loadStatFx = createSpecBoxEffect(
  async (
    { project, from, to }: LoadStatFxParams,
    deps: StoreDependencies,
  ): Promise<ProjectStat> => {
    try {
      const response = await deps.api.stat({
        project,
        from: getDate(from),
        to: getDate(to),
      });
      return mapProjectStat(response);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const $stat = restore<ProjectStat>(loadStatFx.doneData, STUB);
export const $statIsLoading = loadStatFx.pending;

sample({
  clock: [statRoute.opened],
  fn: ({ params: { project = '' }, query: { from, to } }) => ({ project, from, to }),
  target: loadStatFx,
});
