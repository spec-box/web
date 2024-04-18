import { Effect, attach, createEffect, createStore, fork } from 'effector';

import { SpecBoxWebApi } from '@/api';
import { $theme, Theme } from './common';

export const $deps = createStore<StoreDependencies>(null as unknown as StoreDependencies);

export interface AnalyticsApi {
  hit: (url: string) => void;
  sendEvent: (event: string, params: Record<string, unknown>) => void;
}

export interface StoreDependencies {
  api: SpecBoxWebApi;
  analytics?: AnalyticsApi;
}

export const createScope = (deps: StoreDependencies, theme: Theme) => {
  return fork({
    values: [
      [$deps, deps],
      [$theme, theme],
    ],
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
