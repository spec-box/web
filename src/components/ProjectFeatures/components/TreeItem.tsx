import { FC, useMemo } from 'react';

import { TreeNode } from '@/types';

import { compareTreeNodes } from '../lib/compareTreeNodes';

import { FeatureItem, FeatureGroupItem } from './FeatureItem';

interface TreeItemProps {
  level: number;
  node: TreeNode;
  tree: TreeNode[];
  onFeatureSelect: (featureCode: string) => void;
  selectedFeatureCode?: string;
}

export const TreeItem: FC<TreeItemProps> = (props) => {
  const { level, tree, node, onFeatureSelect, selectedFeatureCode } = props;

  const nodes = useMemo(
    () => tree.filter((n) => n.parentId === node.id).sort(compareTreeNodes),
    [tree, node.id],
  );

  const children = nodes.map((n) => (
    <TreeItem
      level={level + 1}
      key={n.id}
      node={n}
      tree={tree}
      onFeatureSelect={onFeatureSelect}
      selectedFeatureCode={selectedFeatureCode}
    />
  ));

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
        <FeatureGroupItem level={level} key={node.id} node={node}>
          {children}
        </FeatureGroupItem>
      );
  }
};
