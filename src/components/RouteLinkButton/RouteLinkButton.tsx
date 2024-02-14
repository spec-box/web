import { ReactNode, ComponentProps, MouseEvent, useCallback } from 'react';

import { RouteParams } from 'atomic-router';
import { cn } from '@bem-react/classname';
import { Button } from '@gravity-ui/uikit';

import { useRouteLink, RouteLinkParams } from '@/hooks/useRouteLink';

const bem = cn('RouteLink');

export interface RouteLinkButtonProps<T extends RouteParams>
  extends RouteLinkParams<T>,
    Omit<ComponentProps<typeof Button>, 'href'> {
  children?: ReactNode;
}

export function RouteLinkButton<T extends RouteParams>(props: RouteLinkButtonProps<T>) {
  const { className, to, params, query, target, onPress, children, ...buttonProps } = props;

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
    <Button
      className={bem(null, [className])}
      href={href}
      onClick={onClick}
      target={target}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
