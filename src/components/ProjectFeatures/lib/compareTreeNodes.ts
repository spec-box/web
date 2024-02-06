import { TreeNode } from "@/types";

export const compareTreeNodes = (
  { sortOrder: sortOrderA = Number.MAX_SAFE_INTEGER, title: titleA }: TreeNode,
  { sortOrder: sortOrderB = Number.MAX_SAFE_INTEGER, title: titleB }: TreeNode
) => {
  if (sortOrderA === sortOrderB) {
    if (titleA === undefined) {
      return 1;
    } else if (titleB === undefined) {
      return -1;
    } else {
      return titleA.localeCompare(titleB);
    }
  }

  return sortOrderA - sortOrderB;
};
