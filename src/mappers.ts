import {
  SpecBoxWebApiModelCommonProjectModel,
  SpecBoxWebApiModelProjectAssertionGroupModel,
  SpecBoxWebApiModelProjectAssertionModel,
  SpecBoxWebApiModelProjectFeatureModel,
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
  TreeNode,
} from './types';

export const mapFeature = (input: SpecBoxWebApiModelProjectFeatureModel): Feature => {
  const { code, title, description, filePath } = input;

  const assertionGroups = input.assertionGroups.map(mapAssertionGroup);
  const allAssertions = new Array<Assertion>().concat(
    ...assertionGroups.map((gr) => gr.assertions),
  );

  const total = allAssertions.length;
  const automated = allAssertions.filter((a) => a.isAutomated).length;

  return {
    code,
    title,
    description,
    filePath,
    assertionGroups,
    assertionsCount: {
      total,
      automated,
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
  const { title, description, isAutomated } = input;

  return { title, description, isAutomated };
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
  const { totalCount, automatedCount, id, title, featureCode, parentId } = node;

  if (featureCode) {
    return {
      type: 'feature',
      totalCount,
      automatedCount,
      id,
      title,
      featureCode,
      parentId,
    };
  }

  return {
    type: 'group',
    totalCount,
    automatedCount,
    id,
    title,
    parentId,
  };
}

export function mapProjectStat(stat: StatResponse): ProjectStat {
  const assertions = stat.assertions.map(({ automatedCount, totalCount, timestamp }) => ({
    automatedCount,
    totalCount,
    timestamp,
  }));

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
