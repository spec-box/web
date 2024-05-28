import { Effect, StorePair, attach, createEffect, createStore, fork } from 'effector';

import { SpecBoxWebApi } from '@/api';
import { UiTheme } from '@/types';

export const $deps = createStore<StoreDependencies>(null as unknown as StoreDependencies);

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

// в эффекторе кривые тайпинги
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtraValues = StorePair<any>[];

export const createScope = (deps: StoreDependencies, extraValues: ExtraValues) => {
  return fork({
    values: [[$deps, deps], ...extraValues],
  });
};

export const createSpecBoxEffect = <Params, Done, Fail = Error>(
  handler: (params: Params, deps: StoreDependencies) => Promise<Done>,
): Effect<Params, Done, Fail> => {
  const requestFx = attach({
    source: $deps,
    mapParams: (params: Params, deps: StoreDependencies) => ({ params, deps }),
    effect: createEffect<{ params: Params; deps: StoreDependencies }, Done, Fail>(
      ({ params, deps }) => handler(params, deps),
    ),
  });

  return requestFx;
};
