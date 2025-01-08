import { HTMLAttributes } from 'react'

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

export interface FolderNode extends BaseNode {
  nodeType: TreeNodeType.Folder
  children: TreeNode[]
}

export interface ItemNode extends BaseNode {
  nodeType: TreeNodeType.Item
}

export type FoldersMap = Map<FolderNode['id'], FolderState>
export type ParentMap = Map<TreeNode['id'], FolderNode | null>

export type FolderState = {
  isOpen?: boolean
  isLoading?: boolean
  hasFetched?: boolean
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

export interface TreeNodeProps extends Pick<AsyncTreeProps, 'customFolder' | 'customItem'> {
  node: TreeNode
  level: number
  isOpen: boolean
  isLoading: boolean
  children?: React.ReactNode
  onFolderClick: (node: FolderNode) => void
  onDrop: (move: TreeMove) => void
}

export interface DropIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  indentation: number
}

export interface FolderProps {
  node: TreeNode
  level: number
  childrenCount: number
  isOpen: boolean
  isLoading: boolean
}

export interface ItemProps {
  node: TreeNode
  level: number
}

export type TreeMove = {
  source: TreeNode
  target: TreeNode
  position: DropPosition
}

export type MoveData = TreeMove & {
  tree: TreeNode[]
  prevParent: FolderNode
  nextParent: FolderNode
}

export type DropData = TreeMove & {
  prevParent: FolderNode | null
  nextParent: FolderNode | null
}
