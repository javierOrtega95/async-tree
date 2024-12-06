import { FoldersMap, TreeNode, TreeNodeType } from '../types'

export function getFoldersMap(tree: TreeNode[]): FoldersMap {
  const foldersMap = new Map()

  initializeFolderMap(tree)

  function initializeFolderMap(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.nodeType === TreeNodeType.Folder) {
        foldersMap.set(node.id, {
          isOpen: node.isOpen ?? false,
          isLoading: false,
          hasFetched: false,
        })

        if (node.children?.length) initializeFolderMap(node.children)
      }
    }
  }

  return foldersMap
}
