import { FC, HTMLAttributes, ReactNode } from "react";

import { PressEvent, usePress } from "@/hooks/usePress";

import { bem } from "./ListItem.cn";

import "./ListItem.css";

export type ListItemState = "normal" | "active";

export interface ListItemProps {
  className?: string;
  view: "normal" | "flat";
  state?: ListItemState;

  href?: string;
  target?: string;

  before?: ReactNode;
  after?: ReactNode;
  children: ReactNode;

  onPress?: (e: PressEvent) => void;
}

export const ListItem: FC<ListItemProps> = (props) => {
  const {
    href,
    target,
    className,
    view,
    state = "normal",
    before,
    after,
    children,
    onPress,
  } = props;

  const { onClick, onKeyUp, onKeyDown, tabIndex } = usePress(onPress);

  const beforeElement = before ? (
    <div className={bem("Before")}>{before}</div>
  ) : null;

  const afterElement = after ? (
    <div className={bem("After")}>{after}</div>
  ) : null;

  const content = (
    <>
      {beforeElement}
      <div className={bem("Content")}>{children}</div>
      {afterElement}
    </>
  );

  const elemProps: HTMLAttributes<HTMLElement> = {
    className: bem({ state, view }, [className]),
    onClick,
    onKeyUp,
    onKeyDown,
    tabIndex,
  };

  return href ? (
    <a href={href} target={target} {...elemProps}>
      {content}
    </a>
  ) : (
    <div {...elemProps}>{content}</div>
  );
};
