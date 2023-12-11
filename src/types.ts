export interface Feature {
  code: string;
  title: string;
  description?: string;
  filePath?: string;
  assertionGroups: AssertionGroup[];
  assertionsCount: {
    total: number;
    automated: number;
  };
}

export interface AssertionGroup {
  title: string;
  assertions: Assertion[];
}

export interface Assertion {
  title: string;
  description?: string;
  isAutomated: boolean;
}

export interface BaseTreeNode {
  id: string;
  parentId?: string;
  title: string;
  totalCount: number;
  automatedCount: number;
}

export interface FeatureTreeNode extends BaseTreeNode {
  type: 'feature';
  featureCode: string;
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
