import { sample, restore, combine } from 'effector';

import { StoreDependencies, createSpecBoxEffect } from '../scope';
import { ProjectGraphData } from '@/types';
import { mapProjectGraph } from '@/mappers';
import { projectRoute } from './project';
import { $feature } from '@/model/pages/project';

const STUB: ProjectGraphData = {
  nodes: [],
  edges: [],
  project: { code: '', title: '' },
};

const MAX_DEPTH = 2;

interface LoadGraphFxParams {
  project: string;
}

export const loadGraphFx = createSpecBoxEffect(
  async ({ project }: LoadGraphFxParams, deps: StoreDependencies) => {
    try {
      const graph = await deps.api.projectsProjectGraph(project);
      return mapProjectGraph({ ...graph, project: { code: project, title: project } });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

const $graphData = restore<ProjectGraphData>(loadGraphFx.doneData, STUB);
export const $graph = restore<ProjectGraphData>(loadGraphFx.doneData, STUB);
export const $graphIsLoading = loadGraphFx.pending;

sample({
  clock: [projectRoute.opened],
  fn: ({ params: { project = '' } }) => ({ project }),
  target: loadGraphFx,
});

sample({
  clock: combine([$feature, $graphData]),
  fn: ([feature, graph]) => {
    graph = structuredClone(graph);
    const target = graph.nodes.find((node) => node.featureCode === feature?.code) || { id: 'root' };
    const gmap = new Map<string, Set<string>>();

    for (const node of graph.nodes) {
      gmap.set(node.id, new Set());
    }

    for (const edge of graph.edges) {
      gmap.get(edge.source)?.add(edge.target);
      gmap.get(edge.target)?.add(edge.source);
    }

    if (!feature) {
      graph.nodes.forEach((node) => {
        node.weight = gmap.get(node.id)?.size || 1;
      });

      return graph;
    }

    const allIds = new Set<string>();
    const queue = [target?.id];
    const distance = new Map<string, number>();
    distance.set(target?.id, 0);

    while (queue.length > 0) {
      const current = queue.shift()!;

      allIds.add(current);
      for (const node of gmap.get(current) ?? []) {
        if (!allIds.has(node)) {
          const d = (distance.get(current) || 0) + 1;
          distance.set(node, d);
          if (d <= MAX_DEPTH) {
            queue.push(node);
          }
        }
      }
    }

    return {
      ...graph,
      nodes: graph.nodes.filter((node) => {
        node.weight = gmap.get(node.id)?.size || 1;
        return allIds.has(node.id);
      }),
      edges: graph.edges.filter((e) => allIds.has(e.source) || allIds.has(e.target)),
    };
  },
  target: $graph,
});
