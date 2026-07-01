import { createRoute } from '@virentia/router';
import copy from 'copy-to-clipboard';
import { effect, event, reaction, store } from '@virentia/core';
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

// код проекта, дедуплицированный: меняется только при смене проекта, а не query
const $projectCode = projectRoute.params.map((params) => params.project ?? '');

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

export const $structure = store(STRUCTURE_STUB);
export const $structureIsLoading = loadStructureFx.pending;

reaction({
  on: loadStructureFx.doneData,
  run(structure) {
    $structure.value = structure;
  },
});

// структуру перезагружаем только когда реально сменился проект
reaction({
  on: $projectCode,
  run(project) {
    if (project) {
      loadStructureFx({ project });
    }
  },
});

// collapse-state дерева
export const toggle = event<string>();
export const expand = event<string[]>();

export const $collapseState = store<Record<string, boolean>>({});

reaction({
  on: toggle,
  run(id) {
    $collapseState.value = { ...$collapseState.value, [id]: !$collapseState.value[id] };
  },
});

reaction({
  on: expand,
  run(ids) {
    $collapseState.value = ids.reduce((s, id) => ((s[id] = true), s), { ...$collapseState.value });
  },
});

export interface CopyToClipboardParams {
  text: string;
}

// копирование в буфер — обычный сайд-эффект, зависимости не нужны
export const copyToClipboard = effect(async ({ text }: CopyToClipboardParams) => {
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

// код выбранной фичи хранится в query (?feature=...) и синхронизируется с URL через trackQuery
const featureQuery = controls.trackQuery<{ feature: string }>({
  parameters: {
    safeParse: (query) => {
      const feature = query.feature;

      return typeof feature === 'string' && feature
        ? { success: true, data: { feature } }
        : { success: false };
    },
  },
});

export const loadFeature = event<LoadFeatureFxParams>();

// выбор фичи в UI — просто пишем её в URL, дальнейшее подхватит featureQuery.entered
reaction({
  on: loadFeature,
  run({ feature }) {
    featureQuery.enter({ feature });
  },
});

// данные выбранной фичи (появляются после загрузки)
export const $feature = store<Feature | null>(null);
// код выбранной фичи (появляется в момент выбора)
export const $featureCode = store('');
export const $featureIsPending = loadFeatureFx.pending;

// в URL появилась фича (или сменилась) — грузим её для текущего проекта
reaction({
  on: featureQuery.entered,
  run({ feature }) {
    $featureCode.value = feature;
    loadFeatureFx({ project: projectRoute.params.value.project ?? '', feature });
  },
});

// фича ушла из URL — сбрасываем выбор
reaction({
  on: featureQuery.exited,
  run() {
    $featureCode.value = '';
    $feature.value = null;
  },
});

reaction({
  on: loadFeatureFx.doneData,
  run(feature) {
    $feature.value = feature;
  },
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

// как только доступны и фича, и структура — раскрываем ветку до выбранной фичи
reaction(() => {
  const ids = getExpandedIds({ feature: $feature.value, tree: $structure.value });

  if (ids.length) {
    expand(ids);
  }
});
