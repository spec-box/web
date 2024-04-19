import { RouteInstance, RouteParams, RouteQuery } from 'atomic-router';
import { useLink } from 'atomic-router-react/scope';
import { useCallback } from 'react';
import { useEvent } from 'effector-react/scope';
import { PressEvent } from './usePress';

export interface RouteLinkParams<T extends RouteParams> {
  to: RouteInstance<T>;
  params: T;
  query?: RouteQuery;
  target?: string;
  onPress?: (e: PressEvent) => void;
}

export const useRouteLink = <T extends RouteParams>(args: RouteLinkParams<T>) => {
  const { to, params, query, target, onPress } = args;

  const href = useLink(to, params, query);
  const navigate = useEvent(to.navigate);

  const handler = useCallback(
    (e: PressEvent) => {
      onPress?.(e);

      // allow user to prevent navigation
      if (e.source.defaultPrevented) {
        return;
      }

      // let browser handle "_blank" target and etc
      if (target && target !== '_self') {
        return;
      }

      // skip modified events (like cmd + click to open the link in new tab)
      if (e.type === 'mouse') {
        const comboKey =
          e.source.metaKey || e.source.altKey || e.source.ctrlKey || e.source.shiftKey;

        if (comboKey || e.source.button !== 0) {
          return;
        }
      }

      e.source.preventDefault();

      navigate({
        params: params || {},
        query: query || {},
      });
    },
    [navigate, params, query, target, onPress],
  );

  return { href, handler };
};
