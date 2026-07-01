import { createRoute } from '@virentia/router';
import { reaction, store } from '@virentia/core';
import { parseISO } from 'date-fns';

import { mapProjectStat } from '@/mappers';
import { ProjectStat } from '@/types';

import { controls } from '../common';
import { StoreDependencies, createSpecBoxEffect } from '../scope';

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

// query-параметры приходят как string | null | string[]; берём только строковое значение
const single = (value: string | null | Array<string | null> | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;

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

export const $stat = store<ProjectStat>(STUB);
export const $statIsLoading = loadStatFx.pending;

reaction({
  on: loadStatFx.doneData,
  run(stat) {
    $stat.value = stat;
  },
});

reaction({
  on: statRoute.opened,
  run() {
    const project = statRoute.params.value.project ?? '';
    const { from, to } = controls.query.value;

    loadStatFx({ project, from: single(from), to: single(to) });
  },
});
