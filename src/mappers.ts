import {
  SpecBoxWebApiModelCommonProjectModel,
  SpecBoxWebApiModelProjectAssertionGroupModel,
  SpecBoxWebApiModelProjectAssertionModel,
  SpecBoxWebApiModelProjectFeatureModel,
  SpecBoxWebApiModelProjectRelatedFeatureModel,
  SpecBoxWebApiModelProjectStructureModel,
  SpecBoxWebApiModelProjectTreeNodeModel,
  StatResponse,
} from './api';
import {
  Assertion,
  AssertionGroup,
  Feature,
  Project,
  ProjectStat,
  ProjectStructure,
  RelatedFeature,
  TreeNode,
} from './types';

export const mapRelatedFeature = (
  input: SpecBoxWebApiModelProjectRelatedFeatureModel,
): RelatedFeature => {
  const { code, title, totalCount, automatedCount, problemCount, featureType } = input;

  return {
    code,
    title,
    featureType,
    assertionsCount: {
      total: totalCount,
      automated: automatedCount,
      problem: problemCount,
    },
  };
};

export const mapFeature = (input: SpecBoxWebApiModelProjectFeatureModel): Feature => {
  const { code, title, description, featureType, filePath } = input;

  const usages = input.usages.map(mapRelatedFeature);

  const assertionGroups = input.assertionGroups.map(mapAssertionGroup);
  const allAssertions = new Array<Assertion>().concat(
    ...assertionGroups.map((gr) => gr.assertions),
  );

  const total = allAssertions.length;
  const automated = allAssertions.filter((a) => a.automationState === 'Automated').length;
  const problem = allAssertions.filter((a) => a.automationState === 'Problem').length;

  return {
    code,
    title,
    featureType,
    description,
    filePath,
    usages,
    assertionGroups,
    assertionsCount: {
      total,
      automated,
      problem,
    },
  };
};

export const mapAssertionGroup = (
  input: SpecBoxWebApiModelProjectAssertionGroupModel,
): AssertionGroup => {
  const { title, assertions } = input;

  return {
    title,
    assertions: assertions.map(mapAssertion),
  };
};

export const mapAssertion = (input: SpecBoxWebApiModelProjectAssertionModel): Assertion => {
  const { title, description, detailsUrl, automationState } = input;

  return { title, description, detailsUrl, automationState };
};

export const mapProject = (project: SpecBoxWebApiModelCommonProjectModel): Project => {
  const { code, title, description, repositoryUrl } = project;

  return { code, title, description, repositoryUrl };
};

export const mapStructure = ({
  tree,
  project,
}: SpecBoxWebApiModelProjectStructureModel): ProjectStructure => {
  return {
    project: mapProject(project),
    tree: tree.map(mapTreeNode),
  };
};

function mapTreeNode(node: SpecBoxWebApiModelProjectTreeNodeModel): TreeNode {
  const {
    totalCount,
    automatedCount,
    problemCount,
    id,
    title,
    featureCode,
    featureType,
    parentId,
    sortOrder,
  } = node;

  if (featureCode) {
    return {
      type: 'feature',
      totalCount,
      automatedCount,
      problemCount,
      id,
      title,
      featureCode,
      featureType,
      parentId,
      sortOrder,
    };
  }

  return {
    type: 'group',
    totalCount,
    automatedCount,
    problemCount,
    id,
    title,
    parentId,
    sortOrder,
  };
}

export function mapProjectStat(stat: StatResponse): ProjectStat {
  const assertions = stat.assertions.map(
    ({ problemCount, automatedCount, totalCount, timestamp }) => ({
      problemCount,
      automatedCount,
      totalCount,
      timestamp,
    }),
  );

  const autotests = stat.autotests.map(({ timestamp, assertionsCount }) => ({
    assertionsCount,
    timestamp,
  }));

  return {
    project: mapProject(stat.project),
    assertions,
    autotests,
  };
}
