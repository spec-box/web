import { RouteInstance, RouteParams, RouteQuery } from "atomic-router";
import { useLink } from "atomic-router-react/scope";
import { useCallback, MouseEvent } from "react";
import { useEvent } from "effector-react/scope";

export interface RouteLinkParams<T extends RouteParams> {
  to: RouteInstance<T>;
  params: T;
  query?: RouteQuery;
  target?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const useRouteLink = <T extends RouteParams>(
  args: RouteLinkParams<T>
) => {
  const { to, params, query, target, onClick } = args;

  const href = useLink(to, params);
  const navigate = useEvent(to.navigate);

  const handler = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e);
      }

      // allow user to prevent navigation
      if (e.defaultPrevented) {
        return;
      }

      // let browser handle "_blank" target and etc
      if (target && target !== "_self") {
        return;
      }

      // skip modified events (like cmd + click to open the link in new tab)
      const comboKey = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;

      if (e.button === 0 && !comboKey) {
        e.preventDefault();

        navigate({
          params: params || {},
          query: query || {},
        });
      }
    },
    [navigate, params, query, target, onClick]
  );

  return { href, handler };
};
