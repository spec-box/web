import { RouteParams } from 'atomic-router';

import { cn } from '@bem-react/classname';
import { Link } from '@gravity-ui/uikit';

import { useRouteLink, RouteLinkParams } from '@/hooks/useRouteLink';
import { MouseEvent, ReactNode, useCallback } from 'react';

const bem = cn('RouteLink');

export interface RouteLinkProps<T extends RouteParams> extends RouteLinkParams<T> {
  children?: ReactNode;
}

export function RouteLink<T extends RouteParams>(props: RouteLinkProps<T>) {
  const { to, params, query, target, onPress, children } = props;

  const { href, handler } = useRouteLink({
    to,
    params,
    query,
    target,
    onPress,
  });

  const onClick = useCallback(
    (source: MouseEvent) => handler({ type: 'mouse', source }),
    [handler],
  );

  return (
    <Link className={bem()} href={href} onClick={onClick}>
      {children}
    </Link>
  );
}
