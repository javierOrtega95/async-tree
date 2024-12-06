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

export interface TreeNodeProps
  extends Pick<FolderProps, 'isLoading' | 'isOpen'> {
  node: FolderNode | ItemNode
  level: number
}

export interface FolderProps {
  node: FolderNode
  level: number
  isOpen: boolean
  isLoading: boolean
}

export interface ItemProps {
  node: ItemNode
  level: number
}
