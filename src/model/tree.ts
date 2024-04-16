import { TreeNode } from '@/types.ts';

export const normalize = (nodes: TreeNode[]): Record<string, TreeNode> => {
  nodes = structuredClone(nodes);

  const tree = nodes.reduce(
    (acc, node) => {
      acc[node.id] = node;
      return acc;
    },
    {} as Record<string, TreeNode>,
  );

  nodes.forEach((node) => {
    const parent = tree[node.parentId ?? ''];

    if (parent?.type === 'group') {
      parent.childrenIds.push(node.id);
    }
  });

  return tree;
};

export const searchIn = (nodes: TreeNode[], query: string) => {
  const tree = normalize(nodes);
  query = (query ?? '').toLowerCase();
  const selector = (node: TreeNode) => (node.title ?? '').toLowerCase().includes(query);

  const result = new Set<TreeNode>();
  const stack = nodes.filter((node) => node.parentId === undefined).map((i) => i.id);

  const subtree = (node: TreeNode): TreeNode[] => {
    const result = [node];

    if (node.type !== 'group') return result;

    const stack = [...node.childrenIds];
    while (stack.length) {
      const item = tree[stack.pop()!];
      if (item.type === 'group') stack.push(...item.childrenIds);
      result.push(item);
    }

    return result;
  };

  while (stack.length) {
    const item = tree[stack.pop()!];

    if (!selector(item)) {
      if (item.type === 'group') {
        stack.push(...item.childrenIds);
      }
      continue;
    }

    subtree(item).forEach((x) => result.add(x));

    let parent = tree[item.parentId ?? ''];
    while (parent) {
      result.add(parent);
      parent = tree[parent.parentId ?? ''];
    }
  }

  const resultArr = Array.from(result);

  return resultArr;
};
