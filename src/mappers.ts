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
  ProjectGraph,
  ProjectGraphData,
  ProjectStat,
  ProjectStructure,
  TreeNode,
} from './types';
import { normalize } from './model/tree.ts';

export const mapFeature = (input: SpecBoxWebApiModelProjectFeatureModel): Feature => {
  const { code, title, description, filePath, featureType, dependencies } = input;

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
    description,
    filePath,
    featureType,
    assertionGroups,
    dependencies,
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
  const { title, description, automationState } = input;

  return { title, description, automationState };
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
    tree: mapTree(tree),
  };
};

function mapTree(tree: SpecBoxWebApiModelProjectTreeNodeModel[]): TreeNode[] {
  const nodes = tree.map(mapTreeNode);
  const normalized = normalize(nodes);

  nodes.forEach((node) => {
    const parent = normalized[node.parentId ?? ''];

    if (parent?.type === 'group') {
      parent.childrenIds.push(node.id);
    }
  });

  return nodes;
}

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
    childrenIds: [],
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

export function mapProjectGraph({
  nodes,
  edges,
  project,
  feature,
}: ProjectGraph): ProjectGraphData {


  const graph: ProjectGraphData = {
    nodes: nodes.map(({ title, ...arg }) => ({
      ...arg,
      title,
      weight: 1,
      label: title,
      style: { label: { value: title } },
    })),
    edges: edges.map(({ sourceId, targetId }) => ({ target: targetId, source: sourceId })),
    project,
    feature,
  };

  const target = graph.nodes.find((node) => node.featureCode === feature) || { id: 'root' };

  // prepare map and do bfs
  const maxDistance = 3;
  const gmap = new Map<string, Set<string>>();

  for (const node of graph.nodes) {
    gmap.set(node.id, new Set());
  }

  for (const edge of graph.edges) {
    gmap.get(edge.source)?.add(edge.target);
    gmap.get(edge.target)?.add(edge.source);
  }

  const allIds = new Set<string>();
  const queue = [target?.id];
  const distance = new Map<string, number>();
  distance.set(target?.id, 0);

  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current) {
      allIds.add(current);
      for (const node of gmap.get(current) ?? []) {
        if (!allIds.has(node)) {
          const d = (distance.get(current) || 0) + 1;
          distance.set(node, d);
          if (d <= maxDistance) {
            queue.unshift(node);
          }
        }
      }
    }
  }

  return {
    ...graph,
    nodes: graph.nodes.filter((node) => {
      node.weight = gmap.get(node.id)?.size || 0;
      return allIds.has(node.id)
    }),
    edges: graph.edges.filter((e) => allIds.has(e.source) || allIds.has(e.target)),
  };
}
