import { ROOT_NODE } from '../components/async-tree/constants'
import {
  FolderNode,
  TreeNode,
  TreeNodeType,
} from '../components/async-tree/types'

const firstChild: FolderNode = {
  id: crypto.randomUUID(),
  name: 'Folder 2',
  nodeType: TreeNodeType.Folder,
  children: [],
}

const secondChild: TreeNode = {
  id: crypto.randomUUID(),
  name: 'Item 1',
  nodeType: TreeNodeType.Item,
}

const parentNode: FolderNode = {
  id: crypto.randomUUID(),
  name: 'Folder 1',
  nodeType: TreeNodeType.Folder,
  children: [firstChild, secondChild],
}

const mockTree: TreeNode[] = [
  {
    ...ROOT_NODE,
    children: [parentNode],
  },
]

export { mockTree, parentNode, firstChild, secondChild }
