import { FC, ReactNode, useCallback } from "react";
import { ListUl } from "@gravity-ui/icons";
import { ArrowToggle, Icon } from "@gravity-ui/uikit";
import { useEvent, useStoreMap } from "effector-react/scope";

import { ListItem } from "@/components/ListItem/ListItem";
import { FeatureTreeNode, GroupTreeNode } from "@/types";
import { $collapseState, toggle } from "@/model/pages/project";

import { bem } from "../ProjectFeatures.cn";

import { ItemStat } from "./ItemStat";
import { Indent } from "./Indent";

import "./FeatureItem.css";

interface FeatureGroupItemProps {
  level: number;
  node: GroupTreeNode;
  children: ReactNode;
}

const useIsOpen = (id: string) =>
  useStoreMap($collapseState, (s) => Boolean(s[id]));

export const FeatureGroupItem: FC<FeatureGroupItemProps> = (props) => {
  const {
    level,
    node: { totalCount, automatedCount, title, id },
    children,
  } = props;

  const isOpen = useIsOpen(id);
  const toggleItem = useEvent(toggle);

  const onSelect = useCallback(() => toggleItem(id), [toggleItem, id]);

  const arrow = (
    <ArrowToggle
      className={bem("CollapseIcon")}
      direction={isOpen ? "bottom" : "right"}
    />
  );

  const stat = (
    <ItemStat totalCount={totalCount} automatedCount={automatedCount} />
  );

  return (
    <>
      <div className={bem("Item", { isOpen })}>
        <Indent level={level} />
        <ListItem
          className={bem("ItemContent")}
          onPress={onSelect}
          before={arrow}
          after={stat}
        >
          {title}
        </ListItem>
      </div>
      {isOpen ? children : null}
    </>
  );
};

interface FeatureItemProps {
  level: number;
  node: FeatureTreeNode;
  onSelect: (featureCode: string) => void;
  selectedCode?: string;
}

const featureIcon = (
  <Icon className={bem("FeatureIcon")} size={16} data={ListUl} />
);

export const FeatureItem: FC<FeatureItemProps> = (props) => {
  const {
    node: { totalCount, automatedCount, featureCode, title },
    onSelect: onFeatureSelect,
    selectedCode,
    level,
  } = props;

  const onSelect = useCallback(
    () => onFeatureSelect(featureCode),
    [featureCode, onFeatureSelect]
  );

  const stat = (
    <ItemStat totalCount={totalCount} automatedCount={automatedCount} />
  );

  return (
    <div className={bem("Item")}>
      <Indent level={level} />
      <ListItem
        className={bem("ItemContent")}
        isActive={featureCode === selectedCode}
        onPress={onSelect}
        before={featureIcon}
        after={stat}
      >
        {title}
      </ListItem>
    </div>
  );
};
