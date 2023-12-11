import { useEvent, useStoreMap } from 'effector-react/scope';
import { CSSProperties, FC, useCallback, useMemo } from 'react';

import { $collapseState, toggle } from '@/model/pages/project';
import { FeatureTreeNode, GroupTreeNode, TreeNode } from '@/types';
import { ListUl } from '@gravity-ui/icons';
import { ArrowToggle, Icon } from '@gravity-ui/uikit';

import { bem } from './ProjectFeatures.cn';
import { ProjectFeaturesTreeNode } from './components/ProjectFeatures.TreeNode';

import './ProjectFeatures.css';

const INDENT = 32;
const RATE_LIMIT = 20;

const Indent: FC<{ level: number }> = ({ level }) => {
  const style: CSSProperties = {
    width: INDENT * level,
    backgroundSize: INDENT,
  };

  return <div style={style} className={bem('Indent')}></div>;
};

interface ProjectFeaturesProps {
  parentId?: string;
  tree: TreeNode[];
  selectedFeatureCode?: string;
  onFeatureSelected: (featureCode: string) => void;
}

const ItemStat: FC<{ totalCount: number; automatedCount: number }> = (props) => {
  const { totalCount, automatedCount } = props;

  const rate = totalCount ? Math.round((automatedCount / totalCount) * 100) : 0;
  const state = rate > RATE_LIMIT ? 'normal' : 'warning';

  return <div className={bem('ItemStat', { state })}>{rate}%</div>;
};

interface FeatureItemProps {
  level: number;
  node: FeatureTreeNode;
  onSelect: (featureCode: string) => void;
  selectedCode?: string;
}

const featureIcon = <Icon className={bem('FeatureIcon')} size={16} data={ListUl} />;

export const FeatureItem: FC<FeatureItemProps> = (props) => {
  const {
    node: { totalCount, automatedCount, featureCode, title },
    onSelect: onFeatureSelect,
    selectedCode,
    level,
  } = props;

  const onSelect = useCallback(() => onFeatureSelect(featureCode), [featureCode, onFeatureSelect]);
  const stat = <ItemStat totalCount={totalCount} automatedCount={automatedCount} />;

  return (
    <div className={bem('Item')}>
      <Indent level={level} />
      <ProjectFeaturesTreeNode
        className={bem('ItemContent')}
        isActive={featureCode === selectedCode}
        onSelect={onSelect}
        text={title}
        icon={featureIcon}
        stat={stat}
      />
    </div>
  );
};

interface FeatureGroupProps {
  level: number;
  node: GroupTreeNode;
  tree: TreeNode[];
  onFeatureSelected: (featureCode: string) => void;
  selectedFeatureCode?: string;
}

const useIsOpen = (id: string) => useStoreMap($collapseState, (s) => Boolean(s[id]));

export const FeatureGroup: FC<FeatureGroupProps> = (props) => {
  const {
    level,
    onFeatureSelected,
    selectedFeatureCode,
    node: { totalCount, automatedCount, title, id },
    tree,
  } = props;

  const isOpen = useIsOpen(id);
  const toggleItem = useEvent(toggle);

  const onSelect = useCallback(() => toggleItem(id), [toggleItem, id]);

  const arrow = (
    <ArrowToggle className={bem('CollapseIcon')} direction={isOpen ? 'bottom' : 'right'} />
  );
  const stat = <ItemStat totalCount={totalCount} automatedCount={automatedCount} />;

  const item = (
    <div className={bem('Item', { isOpen })}>
      <Indent level={level} />
      <ProjectFeaturesTreeNode
        className={bem('ItemContent')}
        onSelect={onSelect}
        text={title}
        icon={arrow}
        stat={stat}
      />
    </div>
  );

  const nodes = useMemo(() => tree.filter((n) => n.parentId === id), [tree, id]);

  const children =
    isOpen && nodes.length
      ? nodes.map((n) => (
          <TreeItem
            level={level + 1}
            key={n.id}
            node={n}
            tree={tree}
            onFeatureSelect={onFeatureSelected}
            selectedFeatureCode={selectedFeatureCode}
          />
        ))
      : null;

  return (
    <>
      {item}
      {children}
    </>
  );
};

interface TreeItemProps {
  level: number;
  node: TreeNode;
  tree: TreeNode[];
  onFeatureSelect: (featureCode: string) => void;
  selectedFeatureCode?: string;
}

export const TreeItem: FC<TreeItemProps> = (props) => {
  const { level, tree, node, onFeatureSelect, selectedFeatureCode } = props;

  switch (node.type) {
    case 'feature':
      return (
        <FeatureItem
          level={level}
          node={node}
          onSelect={onFeatureSelect}
          selectedCode={selectedFeatureCode}
        />
      );
    case 'group':
      return (
        <FeatureGroup
          level={level}
          key={node.id}
          node={node}
          tree={tree}
          onFeatureSelected={onFeatureSelect}
          selectedFeatureCode={selectedFeatureCode}
        />
      );
  }
};

export const ProjectFeatures: FC<ProjectFeaturesProps> = (props) => {
  const { tree, selectedFeatureCode, onFeatureSelected } = props;

  const onSelect = useCallback(
    (featureCode: string) => onFeatureSelected(featureCode),
    [onFeatureSelected],
  );

  const items = tree
    .filter((node) => node.parentId === undefined)
    .map((node) => (
      <TreeItem
        level={0}
        key={node.id}
        tree={tree}
        node={node}
        selectedFeatureCode={selectedFeatureCode}
        onFeatureSelect={onSelect}
      />
    ));

  return <div className={bem()}>{items}</div>;
};
