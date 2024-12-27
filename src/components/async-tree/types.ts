export enum TreeNodeType {
  Folder = 'folder',
  Item = 'item',
}

export enum DropPosition {
  Before = 'before',
  Inside = 'inside',
  After = 'after',
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
  CustomFolder?: React.FC<FolderProps>
  CustomItem?: React.FC<ItemProps>
  loadChildren: (folder: FolderNode) => Promise<TreeNode[]>
  onChange?: (changes: DropData) => void
}

export interface TreeNodeProps
  extends Pick<AsyncTreeProps, 'CustomFolder' | 'CustomItem'>,
    Pick<FolderProps, 'isLoading' | 'isOpen'> {
  node: FolderNode | ItemNode
  level: number
  children?: React.ReactNode
  onFolderClick: (node: FolderNode) => void
  onDragStart: (event: React.DragEvent, node: TreeNode) => void
  onDragOver: (event: React.DragEvent) => void
  onDrop: (
    event: React.DragEvent,
    target: TreeNode,
    position: DropPosition
  ) => void
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

export type DropData = {
  tree: TreeNode[]
  source: TreeNode
  target: TreeNode
  position: DropPosition
  prevParent: FolderNode
  nextParent: FolderNode
}

export type ParentMap = Map<TreeNode['id'], FolderNode | null>
