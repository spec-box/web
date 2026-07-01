import { Effect, StoreWritable, attach, scope, store } from '@virentia/core';

import { SpecBoxWebApi } from '@/api';
import { UiTheme } from '@/types';

export const $deps = store<StoreDependencies>(null as unknown as StoreDependencies);

export interface AnalyticsApi {
  hit: (url: string) => void;
  sendEvent: (event: string, params: Record<string, unknown>) => void;
}

export interface SpecBoxLocalStorage {
  getTheme: () => UiTheme;
  setTheme: (theme: UiTheme) => void;
}

export interface StoreDependencies {
  api: SpecBoxWebApi;
  ls: SpecBoxLocalStorage;
  analytics?: AnalyticsApi;
}

// пары [store, значение] для засева дополнительных значений в scope
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtraValues = (readonly [StoreWritable<any>, unknown])[];

export const createScope = (deps: StoreDependencies, extraValues: ExtraValues) => {
  return scope({
    values: [[$deps, deps], ...extraValues],
  });
};

// фабрика эффектов, которым нужен доступ к зависимостям приложения (api/ls/analytics).
// deps подтягиваются из $deps через attach, поэтому хендлер остаётся чистой функцией.
export const createSpecBoxEffect = <Params, Done, Fail = Error>(
  handler: (params: Params, deps: StoreDependencies) => Promise<Done>,
): Effect<Params, Done, Fail> => {
  return attach<StoreDependencies, Params, Done, Fail>({
    source: $deps,
    effect: (deps, params) => handler(params, deps),
  });
};
