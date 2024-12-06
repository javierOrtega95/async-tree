export enum TreeNodeType {
  Folder = 'folder',
  Item = 'item',
}

export type TreeNode<T = object> = {
  id: string
  name: string
} & T &
  (FolderNode | ItemNode)

interface BaseNode {
  id: string
  name: string
}

export interface FolderNode extends BaseNode {
  nodeType: TreeNodeType.Folder
  children: TreeNode[]
}

export interface ItemNode extends BaseNode {
  nodeType: TreeNodeType.Item
}

export interface AsyncTreeProps {
  initialTree: TreeNode[]
}
