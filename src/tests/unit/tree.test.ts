import { searchIn } from '@/model/tree.ts';
import { FeatureTreeNode, GroupTreeNode, TreeNode } from '@/types.ts';

const someGroupNode = (overrides: Partial<GroupTreeNode>): GroupTreeNode => {
  return {
    id: '1',
    type: 'group',
    totalCount: 10,
    childrenIds: [],
    problemCount: 10,
    automatedCount: 10,
    ...overrides,
  };
};

const someFeatureNode = (overrides: Partial<FeatureTreeNode>): FeatureTreeNode => {
  return {
    id: '1',
    type: 'feature',
    totalCount: 10,
    automatedCount: 10,
    problemCount: 10,
    featureCode: 'code',
    ...overrides,
  };
};

const nodes: TreeNode[] = [
  someGroupNode({
    id: 'g-1',
    title: 'Главная',
    parentId: undefined,
    childrenIds: ['g-1.1', 'g-1.2'],
  }),
  someGroupNode({
    id: 'g-1.1',
    title: 'Страница Главная',
    parentId: 'g-1',
    childrenIds: ['g-1.1-1', 'g-1.1-2'],
  }),
  someFeatureNode({ id: 'g-1.1-1', title: 'Блок Автомобили', parentId: 'g-1.1' }),
  someFeatureNode({ id: 'g-1.1-2', title: 'Блок Документы', parentId: 'g-1.1' }),
  someGroupNode({
    id: 'g-1.2',
    title: 'Страница Адреса',
    parentId: 'g-1',
    childrenIds: ['g-1.2-1'],
  }),
  someFeatureNode({ id: 'g-1.2-1', title: 'Диалог выбора адреса на карте', parentId: 'g-1.2' }),
  someGroupNode({ id: 'g-2', title: 'Семья', parentId: undefined, childrenIds: ['g-2.1'] }),
  someGroupNode({
    id: 'g-2.1',
    title: 'Страница Семья',
    parentId: 'g-2',
    childrenIds: ['g-2.1-1'],
  }),
  someFeatureNode({ id: 'g-2.1-1', title: 'Данные адреса', parentId: 'g-2.1' }),
];

describe('Tree helpers', () => {
  describe('search', () => {
    test('should match by features title', () => {
      const actual = searchIn(nodes, 'блок автомобили');
      const ids = actual.map((i) => i.id).sort();

      expect(actual).toHaveLength(3);
      expect(ids).toEqual(['g-1', 'g-1.1', 'g-1.1-1']);
    });

    test('should match by subgroup title', () => {
      const actual = searchIn(nodes, 'страница главная');
      const ids = actual.map((i) => i.id).sort();

      expect(actual).toHaveLength(4);
      expect(ids).toEqual(['g-1', 'g-1.1', 'g-1.1-1', 'g-1.1-2']);
    });

    test('should match by group title', () => {
      const actual = searchIn(nodes, 'Семья');
      const ids = actual.map((i) => i.id).sort();

      expect(actual).toHaveLength(3);
      expect(ids).toEqual(['g-2', 'g-2.1', 'g-2.1-1']);
    });

    test('should match multiple nodes', () => {
      const actual = searchIn(nodes, 'адреса');
      const ids = actual.map((i) => i.id).sort();

      expect(actual).toHaveLength(6);
      expect(ids).toEqual(['g-1', 'g-1.2', 'g-1.2-1', 'g-2', 'g-2.1', 'g-2.1-1']);
    });
  });
});
