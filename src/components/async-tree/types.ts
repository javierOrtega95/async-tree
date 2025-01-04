export enum TreeNodeType {
  Folder = 'folder',
  Item = 'item',
}

export enum DropPosition {
  Before = 'before',
  Inside = 'inside',
  After = 'after',
}

interface BaseNode {
  id: string
  name: string
}

export type TreeNode<T = object> = (FolderNode | ItemNode) & T

export interface FolderState {
  isOpen?: boolean
  isLoading?: boolean
  hasFetched?: boolean
}

export interface FolderNode extends BaseNode, FolderState {
  nodeType: TreeNodeType.Folder
  children: TreeNode[]
}

export interface ItemNode extends BaseNode {
  nodeType: TreeNodeType.Item
}

export interface AsyncTreeProps {
  initialTree: TreeNode[]
  loadChildren: (folder: FolderNode) => Promise<TreeNode[]>
  fetchOnce?: boolean
  customFolder?: React.FC<FolderProps>
  customItem?: React.FC<ItemProps>
  onDrop?: (data: DropData) => void
  onChange?: (tree: TreeNode[]) => void
}

export interface TreeNodeProps
  extends Pick<AsyncTreeProps, 'customFolder' | 'customItem'>,
    Pick<FolderProps, 'isLoading' | 'isOpen'> {
  node: FolderNode | ItemNode
  level: number
  children?: React.ReactNode
  onFolderClick: (node: FolderNode) => void
  onDrop: (event: React.DragEvent, data: TreeMovement) => void
}

export interface FolderProps {
  node: FolderNode
  level: number
  isOpen: boolean
  isLoading: boolean
  childrenCount: number
  onClick: (folder: FolderNode) => void
}

export interface ItemProps {
  node: ItemNode
  level: number
}

export type FoldersMap = Map<FolderNode['id'], FolderState>

export type TreeMovement = {
  source: TreeNode
  target: TreeNode
  position: DropPosition
}

export type MoveData = TreeMovement & {
  tree: TreeNode[]
  prevParent: FolderNode
  nextParent: FolderNode
}

export type DropData = TreeMovement & {
  prevParent: FolderNode | null
  nextParent: FolderNode | null
}

export type ParentMap = Map<TreeNode['id'], FolderNode | null>
