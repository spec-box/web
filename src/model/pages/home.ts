import { createRoute } from 'atomic-router';
import { restore, sample } from 'effector';

import { mapProject } from '@/mappers';

import { createSpecBoxEffect } from '..';

export const homeRoute = createRoute();

const loadProjectListFx = createSpecBoxEffect(async (_, { api }) => {
  try {
    const response = await api.projectsList();

    return response.map(mapProject);
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const $projects = restore(loadProjectListFx.doneData, []);
export const $projectsIsLoading = loadProjectListFx.pending;

sample({
  clock: [homeRoute.opened],
  target: loadProjectListFx,
});
