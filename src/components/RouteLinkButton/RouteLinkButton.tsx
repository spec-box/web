import { RouteParams } from "atomic-router";

import { cn } from "@bem-react/classname";
import { Button } from "@gravity-ui/uikit";

import { useRouteLink, RouteLinkParams } from "@/hooks/useRouteLink";
import { ReactNode, ComponentProps } from "react";

const bem = cn("RouteLink");

export interface RouteLinkButtonProps<T extends RouteParams>
  extends RouteLinkParams<T>,
    Omit<ComponentProps<typeof Button>, "href"> {
  children?: ReactNode;
}

export function RouteLinkButton<T extends RouteParams>(
  props: RouteLinkButtonProps<T>
) {
  const {
    className,
    to,
    params,
    query,
    target,
    onClick,
    children,
    ...buttonProps
  } = props;

  const { href, handler } = useRouteLink({
    to,
    params,
    query,
    target,
    onClick,
  });

  return (
    <Button
      className={bem(null, [className])}
      href={href}
      onClick={handler}
      target={target}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
