import { FolderNode, TreeNodeType } from './types'

export const ROOT_NODE: FolderNode = {
  id: 'root',
  name: 'root',
  nodeType: TreeNodeType.Folder,
  children: [],
}

export const TREE_NODE_INDENTATION = 12

export const THRESHOLD_BEFORE_PERCENT = 0.1
export const THRESHOLD_AFTER_FOLDER_PERCENT = 0.7
export const THRESHOLD_MID_PERCENT = 0.5
export const THRESHOLD_AFTER_PERCENT = 1
