import { AutomationState, FeatureType } from './api';

export interface FeatureStat {
  total: number;
  automated: number;
  problem: number;
}

export interface Feature {
  code: string;
  title: string;
  featureType?: FeatureType;
  description?: string;
  filePath?: string;
  usages: RelatedFeature[];
  assertionGroups: AssertionGroup[];
  assertionsCount: FeatureStat;
}

export interface RelatedFeature {
  code: string;
  title: string;
  featureType?: FeatureType;
  assertionsCount: FeatureStat;
}

export interface AssertionGroup {
  title: string;
  assertions: Assertion[];
}

export interface Assertion {
  title: string;
  description?: string;
  detailsUrl?: string;
  automationState: AutomationState;
}

export interface BaseTreeNode {
  id: string;
  parentId?: string;
  title?: string;
  totalCount: number;
  automatedCount: number;
  problemCount: number;
  sortOrder?: number;
}

export interface FeatureTreeNode extends BaseTreeNode {
  type: 'feature';
  featureCode: string;
  featureType?: FeatureType;
}

export interface GroupTreeNode extends BaseTreeNode {
  type: 'group';
}

export type TreeNode = GroupTreeNode | FeatureTreeNode;

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

export type UiTheme = 'light' | 'dark';
