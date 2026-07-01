import { Query, Route } from '@virentia/router';
import { useLink } from '@virentia/router-react';
import { useCallback } from 'react';
import { PressEvent } from './usePress';

export interface RouteLinkParams<T extends object> {
  to: Route<T>;
  params: T;
  query?: Query;
  target?: string;
  onPress?: (e: PressEvent) => void;
}

export const useRouteLink = <T extends object>(args: RouteLinkParams<T>) => {
  const { to, params, query, target, onPress } = args;

  const link = useLink(to, params, query);
  const href = link.path;
  // useLink возвращает open с отложенным условным типом из-за дженерика T;
  // на этом уровне payload всегда { params, query }
  const open = link.open as (payload: { params: T; query?: Query }) => void;

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

      open({
        params,
        query: query || {},
      });
    },
    [open, params, query, target, onPress],
  );

  return { href, handler };
};
