import { createRoute, querySync } from 'atomic-router';
import copy from 'copy-to-clipboard';
import { combine, createEvent, createStore, merge, restore, sample, split } from 'effector';
import { toast } from 'react-toastify';

import { mapFeature, mapStructure } from '@/mappers';
import { Feature, ProjectStructure, TreeNode } from '@/types';

import { controls } from '../common';
import { StoreDependencies, createSpecBoxEffect } from '../scope';

const STRUCTURE_STUB: ProjectStructure = {
  tree: [],
  project: { code: '', title: '' },
};

export const projectRoute = createRoute<{ project?: string }>();


export interface LoadStructureFxParams {
  project: string;
  treeCode: string;
}

export const loadStructureFx = createSpecBoxEffect(
  async (
    { project, treeCode }: LoadStructureFxParams,
    deps: StoreDependencies,
  ): Promise<ProjectStructure> => {
    try {
      const response = await deps.api.projectsProjectStructure(project, treeCode);

      return mapStructure(response);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const $structure = restore(loadStructureFx.doneData, STRUCTURE_STUB);
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
  },
  route: projectRoute,
  controls,
});

// при выборе активной фичи раскрываем всех её родителей
const getExpandedIds = (args: { feature: Feature | null; tree: ProjectStructure }): string[] => {
  const {
    feature,
    tree: { tree },
  } = args;
  const result: string[] = [];

  if (feature && tree.length) {
    let target: TreeNode | undefined;

    const obj = tree.reduce<Record<string, TreeNode>>((a, node) => {
      a[node.id] = node;

      if (node.type === 'feature' && node.featureCode === feature.code) {
        target = node;
      }

      return a;
    }, {});

    for (let id = target?.id; id !== undefined; id = obj[id]?.parentId) {
      result.push(id);
    }
  }

  return result;
};
export const $treeCode = createStore<string>('sections')
export const toggleTree = createEvent<string>();
export const $project = createStore<string>('')

sample({
  clock: toggleTree,
  target: $treeCode
})
sample({
  clock: combine({
    feature: $feature,
    tree: $structure,
  }),
  fn: getExpandedIds,
  target: expand,
});

sample({
  clock: [projectRoute.opened],
  source: $treeCode,
  fn: (treeCode, { params: { project = '' } }) => ({ project, treeCode }),
  target: loadStructureFx,
});

sample({
  clock: [projectRoute.opened],
  fn: ({ params: { project = '' } }) => project,
  target: $project,
});

sample({
  clock: $treeCode,
  source: $project,
  fn: (project, treeCode) => ({ project, treeCode }),
  target: loadStructureFx,
});

split({
  source: merge([projectRoute.opened, projectRoute.updated]).map(
    ({ params: { project = '' }, query: { feature = '' } }): LoadFeatureFxParams => ({
      project,
      feature,
    }),
  ),
  match: ({ feature }: LoadFeatureFxParams) => (feature ? 'load' : 'reset'),
  cases: {
    load: loadFeatureFx,
    reset: resetFeature,
  },
});

sample({
  clock: loadFeatureFx.doneData,
  target: $feature,
});

export const copyToClipboard = createEvent<CopyToClipboardParams>();

sample({
  clock: copyToClipboard,
  target: copyToClipboardFx,
});
