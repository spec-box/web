import { RouteQuery, createRoute } from 'atomic-router';
import copy from 'copy-to-clipboard';
import { combine, createEvent, createStore, merge, restore, sample, split } from 'effector';
import { debounce } from 'patronum';
import { toast } from 'react-toastify';

import { FeatureType } from '@/api';
import { mapFeature, mapStructure } from '@/mappers';
import { Feature, ProjectStructure, TreeNode } from '@/types';

import { StoreDependencies, createSpecBoxEffect } from '../scope';

const STRUCTURE_STUB: ProjectStructure = {
  tree: [],
  project: { code: '', title: '' },
};

const TITLE_DEBOUNCE_TIMEOUT = 300;

export const projectRoute = createRoute<{ project?: string }>();

// код проекта фиксируется в модели один раз при открытии страницы
export const $projectCode = createStore('').on(
  projectRoute.opened,
  (_, { params: { project = '' } }) => project,
);

export interface StructureFilter {
  title: string;
  featureType: FeatureType | null;
  hasProblems: boolean;
}

export interface LoadStructureFxParams {
  project: string;
  filter: StructureFilter;
}

export const loadStructureFx = createSpecBoxEffect(
  async (
    { project, filter }: LoadStructureFxParams,
    deps: StoreDependencies,
  ): Promise<ProjectStructure> => {
    try {
      const response = await deps.api.projectsProjectStructure(project, {
        title: filter.title || undefined,
        featureType: filter.featureType ?? undefined,
        hasProblems: filter.hasProblems || undefined,
      });

      return mapStructure(response);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const setFilterTitle = createEvent<string>();
export const setFilterFeatureType = createEvent<FeatureType | null>();
export const setFilterHasProblems = createEvent<boolean>();

// однократное восстановление фильтров из query при открытии страницы;
// в отличие от пользовательских событий не приводит к перезагрузке структуры
const filterRestored = createEvent<StructureFilter>();

export const $filterTitle = createStore('')
  .on(setFilterTitle, (_, title) => title)
  .on(filterRestored, (_, { title }) => title);

export const $filterFeatureType = createStore<FeatureType | null>(null)
  .on(setFilterFeatureType, (_, featureType) => featureType)
  .on(filterRestored, (_, { featureType }) => featureType);

export const $filterHasProblems = createStore(false)
  .on(setFilterHasProblems, (_, hasProblems) => hasProblems)
  .on(filterRestored, (_, { hasProblems }) => hasProblems);

export const $filter = combine({
  title: $filterTitle,
  featureType: $filterFeatureType,
  hasProblems: $filterHasProblems,
});

export const $filterIsActive = $filter.map(
  ({ title, featureType, hasProblems }) => title.length > 0 || featureType !== null || hasProblems,
);

export const parseFeatureType = (value: unknown): FeatureType | null =>
  value === 'Functional' || value === 'Visual' ? value : null;

const parseFilterQuery = (query: RouteQuery): StructureFilter => ({
  title: typeof query.title === 'string' ? query.title : '',
  featureType: parseFeatureType(query.featureType),
  hasProblems: query.hasProblems === 'true',
});

// полный набор query-параметров страницы проекта, собранный с нуля из состояния модели
const buildPageQuery = (args: { featureCode: string; filter: StructureFilter }): RouteQuery => {
  const { featureCode, filter } = args;
  const query: RouteQuery = {};

  if (featureCode) query.feature = featureCode;
  if (filter.title) query.title = filter.title;
  if (filter.featureType) query.featureType = filter.featureType;
  if (filter.hasProblems) query.hasProblems = 'true';

  return query;
};

// применённое пользователем значение фильтра; собирается из текущего $filter
// и значения из события-триггера, чтобы не зависеть от порядка обновления сторов
const filterChanged = createEvent<StructureFilter>();

sample({
  clock: debounce({ source: setFilterTitle, timeout: TITLE_DEBOUNCE_TIMEOUT }),
  source: $filter,
  fn: (filter, title) => ({ ...filter, title }),
  target: filterChanged,
});

sample({
  clock: setFilterFeatureType,
  source: $filter,
  fn: (filter, featureType) => ({ ...filter, featureType }),
  target: filterChanged,
});

sample({
  clock: setFilterHasProblems,
  source: $filter,
  fn: (filter, hasProblems) => ({ ...filter, hasProblems }),
  target: filterChanged,
});

// перезагрузка структуры по изменению фильтра; код проекта — из модели
sample({
  clock: filterChanged,
  source: $projectCode,
  filter: projectRoute.$isOpened,
  fn: (project, filter) => ({ project, filter }),
  target: loadStructureFx,
});

export const $structure = restore(loadStructureFx.doneData, STRUCTURE_STUB);
export const $structureIsLoading = loadStructureFx.pending;

export const toggle = createEvent<string>();
export const expand = createEvent<string[]>();

export const $collapseState = createStore<Record<string, boolean>>({})
  .on(toggle, (state, id) => ({ ...state, [id]: !state[id] }))
  .on(expand, (state, ids) => ids.reduce((s, id) => ((s[id] = true), s), { ...state }))
  .reset(projectRoute.opened);

export interface CopyToClipboardParams {
  text: string;
}

export const copyToClipboardFx = createSpecBoxEffect(async ({ text }: CopyToClipboardParams) => {
  if (await copy(text)) {
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

// выбор фичи — push-навигация с полным набором параметров страницы;
// сама загрузка происходит по событию роутера (routeFeatureChanged ниже).
// повторный клик по уже выбранной фиче не создает записей в истории
sample({
  clock: loadFeature,
  source: { filter: $filter, featureCode: $featureCode, isOpened: projectRoute.$isOpened },
  filter: ({ isOpened, featureCode }, { feature }) => isOpened && feature !== featureCode,
  fn: ({ filter }, { project, feature }) => ({
    params: { project },
    query: buildPageQuery({ featureCode: feature, filter }),
    replace: false,
  }),
  target: projectRoute.navigate,
});

// синхронизация фильтра в url через replace: параметры и query собираются из модели;
// обратной синхронизации из url в модель после открытия страницы нет
sample({
  clock: filterChanged,
  source: { project: $projectCode, featureCode: $featureCode },
  filter: projectRoute.$isOpened,
  fn: ({ project, featureCode }, filter) => ({
    params: { project },
    query: buildPageQuery({ featureCode, filter }),
    replace: true,
  }),
  target: projectRoute.navigate,
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

sample({
  clock: combine({
    feature: $feature,
    tree: $structure,
  }),
  fn: getExpandedIds,
  target: expand,
});

// при открытии страницы фильтры один раз восстанавливаются из query
sample({
  clock: projectRoute.opened,
  fn: ({ query }) => parseFilterQuery(query),
  target: filterRestored,
});

// первичная загрузка структуры — все значения из события открытия страницы
sample({
  clock: projectRoute.opened,
  fn: ({ params: { project = '' }, query }) => ({ project, filter: parseFilterQuery(query) }),
  target: loadStructureFx,
});

// раскрываем узлы, отмеченные сервером для текущего фильтра (isExpanded);
// событие expand дополняет состояние, не сбрасывая уже раскрытые узлы —
// например, родителей выбранной фичи
sample({
  clock: loadStructureFx.doneData,
  fn: ({ tree }) => tree.filter((node) => node.isExpanded).map((node) => node.id),
  target: expand,
});

const routeFeature = merge([projectRoute.opened, projectRoute.updated]).map(
  ({ params: { project = '' }, query: { feature = '' } }): LoadFeatureFxParams => ({
    project,
    feature,
  }),
);

// повторные события роутера с тем же feature (например, replace-навигация
// при синхронизации фильтров в url) не трогают выбранную фичу
const routeFeatureChanged = sample({
  clock: routeFeature,
  source: $featureCode,
  filter: (current, { feature }) => feature !== current,
  fn: (_, next) => next,
});

split({
  source: routeFeatureChanged,
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
