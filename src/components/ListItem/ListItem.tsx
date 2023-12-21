import { FC, ReactNode, useCallback, KeyboardEvent } from "react";
import { bem } from "./ListItem.cn";

import "./ListItem.css";

const usePress = (onPress?: () => void) => {
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        onPress?.();
      }
    },
    [onPress]
  );

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      // отменяем действие, чтобы список не скроллился при нажатии на пробел
      e.preventDefault();
    }
  }, []);

  return { onKeyUp, onKeyDown, onClick: onPress, tabIndex: 0 };
};

export interface ListItemProps {
  className?: string;
  view: "normal" | "flat";
  isActive?: boolean;

  before?: ReactNode;
  after?: ReactNode;
  children: ReactNode;

  onPress?: () => void;
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
