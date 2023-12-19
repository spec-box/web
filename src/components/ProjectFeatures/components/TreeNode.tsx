import { FC, KeyboardEvent, ReactNode, useCallback } from "react";

import { bem } from "../ProjectFeatures.cn";

import "./TreeNode.css";

const usePress = (onClick: () => void) => {
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        // отменяем действие, чтобы список не скроллился при нажатии на пробел
        e.preventDefault();

        onClick();
      }
    },
    [onClick]
  );

  return { onKeyUp, onClick, tabIndex: 0 };
};

export interface TreeNodeProps {
  className?: string;
  text: string;
  icon: ReactNode;
  stat: ReactNode;
  isActive?: boolean;
  onSelect: () => void;
}

export const TreeNode: FC<TreeNodeProps> = (props) => {
  const { className, icon, stat, text, onSelect, isActive: active } = props;

  const { onClick, onKeyUp, tabIndex } = usePress(onSelect);

  return (
    <div
      className={bem("TreeNode", { active }, [className])}
      onClick={onClick}
      onKeyUp={onKeyUp}
      tabIndex={tabIndex}
    >
      {icon}
      <div className={bem("TreeNodeText")}>{text}</div>
      <div className={bem("TreeNodeStat")}>{stat}</div>
    </div>
  );
};
