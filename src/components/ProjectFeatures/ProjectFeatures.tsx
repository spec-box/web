import { FC, useCallback } from 'react';

import { TreeNode } from '@/types';

import { compareTreeNodes } from './lib/compareTreeNodes';
import { TreeItem } from './components/TreeItem';
import { bem } from './ProjectFeatures.cn';

import './ProjectFeatures.css';

interface ProjectFeaturesProps {
  parentId?: string;
  tree: TreeNode[];
  selectedFeatureCode?: string;
  onFeatureSelected: (featureCode: string) => void;
}

export const ProjectFeatures: FC<ProjectFeaturesProps> = (props) => {
  const { tree, selectedFeatureCode, onFeatureSelected } = props;

  const onSelect = useCallback(
    (featureCode: string) => onFeatureSelected(featureCode),
    [onFeatureSelected],
  );

  const items = tree
    .filter((node) => node.parentId === undefined)
    .sort(compareTreeNodes)
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
