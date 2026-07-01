import { createRoute } from '@virentia/router';
import { reaction, store } from '@virentia/core';

import { mapProject } from '@/mappers';
import { Project } from '@/types';

import { createSpecBoxEffect } from '../scope';

export const homeRoute = createRoute<Record<string, never>>();

const loadProjectListFx = createSpecBoxEffect(async (_: void, { api }) => {
  try {
    const response = await api.projectsList();

    return response.map(mapProject);
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const $projects = store<Project[]>([]);
export const $projectsIsLoading = loadProjectListFx.pending;

reaction({
  on: loadProjectListFx.doneData,
  run(projects) {
    $projects.value = projects;
  },
});

reaction({
  on: homeRoute.opened,
  run() {
    loadProjectListFx();
  },
});
