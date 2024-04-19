import {
  AutomationState,
  FeatureType,
  SpecBoxWebApiModelProjectGraphModel,
  SpecBoxWebApiModelProjectNodeModel,
} from './api';
import { IUserEdge, IUserNode } from '@antv/graphin';
import { ModelConfig } from '@antv/g6-core/lib/types';

export interface Feature {
  code: string;
  title: string;
  description?: string;
  filePath?: string;
  featureType?: FeatureType;
  dependencies?: DependentFeature[];
  assertionGroups: AssertionGroup[];
  assertionsCount: {
    total: number;
    automated: number;
    problem: number;
  };
}

export interface DependentFeature {
  code: string;
  title: string;
  featureType?: FeatureType;
  totalCount: number;
  automatedCount: number;
  problemCount: number;
}

export interface AssertionGroup {
  title: string;
  assertions: Assertion[];
}

export interface Assertion {
  title: string;
  description?: string;
  automationState: AutomationState;
}

export type Highlight = [number, number];

export interface BaseTreeNode {
  id: string;
  parentId?: string;
  title?: string;
  totalCount: number;
  automatedCount: number;
  problemCount: number;
  sortOrder?: number;
  highlight?: Highlight;
}

export interface FeatureTreeNode extends BaseTreeNode {
  type: 'feature';
  featureCode: string;
  featureType?: FeatureType;
}

export interface GroupTreeNode extends BaseTreeNode {
  type: 'group';
  childrenIds: string[];
}

export type TreeNode = GroupTreeNode | FeatureTreeNode;

export type NormalizedTree = Record<string, TreeNode>;

export interface ProjectStructure {
  project: Project;
  tree: TreeNode[];
}

export interface Project {
  code: string;
  title: string;
  description?: string;
  repositoryUrl?: string;
}

export interface StatAssertion {
  timestamp: Date;
  totalCount: number;
  automatedCount: number;
  problemCount: number;
}

export interface StatAutotestsItem {
  timestamp: Date;
  assertionsCount: number;
}

export interface ProjectStat {
  project: Project;
  assertions: StatAssertion[];
  autotests: StatAutotestsItem[];
}
export interface ProjectGraph extends SpecBoxWebApiModelProjectGraphModel {
  project: Project;
}

export interface DrawnNode extends SpecBoxWebApiModelProjectNodeModel, IUserNode {
  weight: number;
}

export interface ProjectGraphData {
  nodes: DrawnNode[];
  edges: IUserEdge[];
  project: Project;
}

export interface CfgConfig extends ModelConfig, SpecBoxWebApiModelProjectNodeModel {}
