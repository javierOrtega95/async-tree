import { TreeNodeType } from './types'

export const ROOT_NODE = {
  id: 'root',
  name: 'root',
  nodeType: TreeNodeType.Folder,
  children: [],
}

export const THRESHOLD_BEFORE_PERCENT = 0.25
export const THRESHOLD_MID_PERCENT = 0.5
export const THRESHOLD_AFTER_CLOSED_PERCENT = 0.75
export const THRESHOLD_AFTER_OPEN_PERCENT = 1
