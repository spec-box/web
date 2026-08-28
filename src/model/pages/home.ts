import { createRoute } from 'atomic-router';
import { combine, createEvent, createStore, restore, sample } from 'effector';

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

export const openProjectsDrawer = createEvent();
export const closeProjectsDrawer = createEvent();
export const setProjectsFilter = createEvent<string>();

export const $projectsDrawerIsOpen = createStore(false)
  .on(openProjectsDrawer, () => true)
  .reset(closeProjectsDrawer, homeRoute.opened);

// фильтр сбрасывается на каждом открытии шторки, чтобы список не показывался
// с запросом от предыдущего открытия
export const $projectsFilter = createStore('')
  .on(setProjectsFilter, (_, filter) => filter)
  .reset(openProjectsDrawer, homeRoute.opened);

// фильтрация клиентская: полный список проектов уже загружен для главной страницы
export const $filteredProjects = combine($projects, $projectsFilter, (projects, filter) => {
  const normalizedFilter = filter.trim().toLowerCase();

  if (!normalizedFilter) {
    return projects;
  }

  return projects.filter(
    ({ title, code }) =>
      title.toLowerCase().includes(normalizedFilter) ||
      code.toLowerCase().includes(normalizedFilter),
  );
});
