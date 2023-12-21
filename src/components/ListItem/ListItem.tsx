import { FC, ReactNode } from "react";

import { PressEvent, usePress } from "@/hooks/usePress";

import { bem } from "./ListItem.cn";

import "./ListItem.css";

export interface ListItemProps {
  className?: string;
  view: "normal" | "flat";
  isActive?: boolean;

  href?: string;

  before?: ReactNode;
  after?: ReactNode;
  children: ReactNode;

  onPress?: (e: PressEvent) => void;
}

export const ListItem: FC<ListItemProps> = (props) => {
  const {
    className,
    view,
    isActive: active,
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

  return (
    <div
      className={bem({ active, view }, [className])}
      onClick={onClick}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
    >
      {beforeElement}
      <div className={bem("Content")}>{children}</div>
      {afterElement}
    </div>
  );
};
