import { TreeNode } from "@/types";

export const compareTreeNodes = (
  { sortOrder: sortOrderA = Number.MAX_SAFE_INTEGER, title: titleA }: TreeNode,
  { sortOrder: sortOrderB = Number.MAX_SAFE_INTEGER, title: titleB }: TreeNode
) => {
  return sortOrderA - sortOrderB || titleA.localeCompare(titleB);
};
