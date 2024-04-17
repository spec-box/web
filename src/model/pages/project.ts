import { createRoute, querySync, RouteParamsAndQuery } from 'atomic-router';
import copy from 'copy-to-clipboard';
import { combine, createEvent, createStore, merge, restore, sample } from 'effector';
import { toast } from 'react-toastify';

import { mapFeature, mapStructure } from '@/mappers';
import { Feature, ProjectStructure, TreeNode } from '@/types';

import { controls } from '../common';
import { createSpecBoxEffect, StoreDependencies } from '../scope';
import { normalize, parents, searchIn } from '../tree.ts';

const STRUCTURE_STUB: ProjectStructure = {
  tree: [],
  project: { code: '', title: '' },
};

const extractStateFrom = ({ params, query }: RouteParamsAndQuery<{ project?: string }>) => ({
  project: params.project || '',
  feature: query.feature || '',
  search: query.search || '',
});

export const projectRoute = createRoute<{ project?: string }>();

export interface LoadStructureFxParams {
  project: string;
}

export const loadStructureFx = createSpecBoxEffect(
  async (
    { project }: LoadStructureFxParams,
    deps: StoreDependencies,
  ): Promise<ProjectStructure> => {
    try {
      const response = await deps.api.projectsProjectStructure(project);

      return mapStructure(response);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const $structure = restore(loadStructureFx.doneData, STRUCTURE_STUB);
export const $filteredStructure = restore(loadStructureFx.doneData, STRUCTURE_STUB);
export const $structureIsLoading = loadStructureFx.pending;

export const toggle = createEvent<string>();
export const expand = createEvent<string[]>();

export const $collapseState = createStore<Record<string, boolean>>({})
  .on(toggle, (state, id) => ({ ...state, [id]: !state[id] }))
  .on(expand, (state, ids) => ids.reduce((s, id) => ((s[id] = true), s), { ...state }));

export interface CopyToClipboardParams {
  text: string;
}

export const copyToClipboardFx = createSpecBoxEffect(async ({ text }: CopyToClipboardParams) => {
  if (copy(text)) {
    toast('Скопировано');
  } else {
    toast.error('Ошибка при копировании');
  }
});

export interface LoadFeatureFxParams {
  project: string;
  feature: string;
}

export const loadFeatureFx = createSpecBoxEffect(
  async ({ project, feature }: LoadFeatureFxParams, deps: StoreDependencies): Promise<Feature> => {
    try {
      const response = await deps.api.projectsProjectFeaturesFeature(project, feature);

      return mapFeature(response);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const loadFeature = createEvent<LoadFeatureFxParams>();
export const resetFeature = createEvent();
export const searchChanged = createEvent<string>();

export const $search = restore(searchChanged, '').reset(projectRoute.closed);

// код выбранной фичи (появляется в момент выбора)
export const $featureCode = createStore<string>('')
  .on(loadFeatureFx, (_, { feature }) => feature)
  .reset(resetFeature);

// данные выбранной фичи (появляются после загрузки)
export const $feature = createStore<Feature | null>(null).reset(resetFeature);
export const $featureIsPending = loadFeatureFx.pending;

querySync({
  source: {
    feature: restore(
      loadFeature.map(({ feature }) => feature),
      null,
    ),
    search: $search,
  },
  route: projectRoute,
  controls,
});

// при выборе активной фичи или при совпадении фичи при поиске раскрываем всех её родителей
const getExpandedIds = (args: { feature: Feature | null; tree: ProjectStructure }): string[] => {
  const {
    feature,
    tree: { tree },
  } = args;
  const result = new Set<string>();
  const normalized = normalize(tree);
  const isSearchMatch = (node: TreeNode) => Boolean(node.highlight && node.highlight[1] !== 0);
  const isFeatureMatch = (node: TreeNode) =>
    node.type === 'feature' && node.featureCode === feature?.code;

  for (const node of tree) {
    if (isSearchMatch(node) || isFeatureMatch(node)) {
      parents(node, normalized, (x) => result.add(x.id));
    }
  }

  return Array.from(result);
};

sample({
  clock: projectRoute.opened,
  fn: extractStateFrom,
  target: loadStructureFx,
});

sample({
  clock: merge([projectRoute.opened, projectRoute.updated]),
  source: $featureCode,
  filter: (currentFeature, query) => {
    const selectedFeature = extractStateFrom(query).feature;
    return Boolean(selectedFeature) && currentFeature !== selectedFeature;
  },
  fn: (_, query) => extractStateFrom(query),
  target: loadFeatureFx,
});

sample({
  clock: projectRoute.updated,
  filter: ({ query: { feature = '' } }) => !feature,
  target: resetFeature,
});

sample({
  clock: loadFeatureFx.doneData,
  target: $feature,
});

sample({
  clock: combine({
    tree: $structure,
    search: $search,
  }),
  fn: ({ search, tree }) => {
    const result = searchIn(tree.tree, search);

    return {
      project: tree.project,
      tree: result,
    };
  },
  target: $filteredStructure,
});

sample({
  clock: combine({
    feature: $feature,
    tree: $filteredStructure,
  }),
  fn: getExpandedIds,
  target: expand,
});

export const copyToClipboard = createEvent<CopyToClipboardParams>();

sample({
  clock: copyToClipboard,
  target: copyToClipboardFx,
});
