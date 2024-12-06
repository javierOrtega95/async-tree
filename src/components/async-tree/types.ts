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

export interface FolderState {
  isOpen?: boolean
  isLoading?: boolean
  hasFetched?: boolean
}

export interface FolderNode extends BaseNode, Omit<FolderState, 'hasFetched'> {
  nodeType: TreeNodeType.Folder
  children: TreeNode[]
}

export interface ItemNode extends BaseNode {
  nodeType: TreeNodeType.Item
}

export interface AsyncTreeProps {
  initialTree: TreeNode[]
  fetchOnce?: boolean
  loadChildren: (folder: FolderNode) => Promise<TreeNode[]>
}

export interface TreeNodeProps
  extends Pick<FolderProps, 'isLoading' | 'isOpen'> {
  node: FolderNode | ItemNode
  level: number
  onFolderClick: (node: FolderNode) => void
}

export interface FolderProps {
  node: FolderNode
  level: number
  isOpen: boolean
  isLoading: boolean
  onClick: (folder: FolderNode) => void
}

export interface ItemProps {
  node: ItemNode
  level: number
}

export type FoldersMap = Map<FolderNode['id'], FolderState>
