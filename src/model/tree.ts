import type { NormalizedTree, TreeNode } from '@/types.ts';

type NodeVisitor = (node: TreeNode) => void;

export const normalize = (nodes: TreeNode[], visitor?: NodeVisitor): NormalizedTree => {
  return nodes.reduce((acc, node) => {
    acc[node.id] = node;
    visitor?.(node);

    return acc;
  }, {} as NormalizedTree);
};

const subtree = (node: TreeNode, tree: NormalizedTree, visitor?: NodeVisitor): TreeNode[] => {
  const result = [node];
  visitor?.(node);

  if (node.type !== 'group') return result;

  const stack = [...node.childrenIds];
  while (stack.length) {
    const item = tree[stack.pop()!];
    result.push(item);
    visitor?.(item);
    if (item.type === 'group') item.childrenIds.forEach((x) => stack.push(x));
  }

  return result;
};

const parent = (node: TreeNode, tree: NormalizedTree): TreeNode | undefined => {
  return tree[node.parentId ?? ''];
};

const parents = (node: TreeNode, tree: NormalizedTree, visitor?: NodeVisitor): TreeNode[] => {
  const result: TreeNode[] = [];
  let ancestor = parent(node, tree);

  while (ancestor) {
    result.push(ancestor);
    visitor?.(ancestor);
    ancestor = parent(ancestor, tree);
  }

  return result;
};

export const searchIn = (nodes: TreeNode[], query: string) => {
  nodes = structuredClone(nodes);
  query = (query ?? '').trim().toLowerCase();
  const selector = (node: TreeNode) => (node.title ?? '').toLowerCase().includes(query);

  const result = new Set<TreeNode>();
  const stack: string[] = [];
  const tree = normalize(nodes, (node) => node.parentId === undefined && stack.push(node.id));

  while (stack.length) {
    const item = tree[stack.pop()!];

    if (!selector(item)) {
      if (item.type === 'group') item.childrenIds.forEach((x) => stack.push(x));
      continue;
    }

    const visitor: NodeVisitor = (x) => result.add(x);

    subtree(item, tree, visitor);
    parents(item, tree, visitor);
  }

  return Array.from(result);
};
