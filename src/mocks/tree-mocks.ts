import {
  FolderNode,
  TreeNode,
  TreeNodeType,
} from '../components/async-tree/types'

export const DEFAULT_TREE: TreeNode[] = [
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Folder,
    name: 'Work Files',
    children: [],
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Folder,
    name: 'Images',
    children: [],
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Folder,
    name: 'Users',
    children: [],
  },
]

export const MOCK_WORK_FILES_CHILDREN: TreeNode[] = [
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'Project.docx',
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'Notes.txt',
  },
]

export const MOCK_IMAGES_CHILDREN: TreeNode[] = [
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'Beach.jpg',
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'Mountains.png',
  },
]

const MOCK_USERS_CHILDREN: TreeNode[] = [
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'john_doe',
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'jane_smith',
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'alice_jones',
  },
]

export const CHILDREN_BY_FOLDER: Record<FolderNode['name'], TreeNode[]> = {
  ['Work Files']: MOCK_WORK_FILES_CHILDREN,
  Images: MOCK_IMAGES_CHILDREN,
  Users: MOCK_USERS_CHILDREN,
}

export function mockLoadChildren(children: TreeNode[]): Promise<TreeNode[]> {
  return new Promise<TreeNode[]>((resolve) => {
    setTimeout(() => resolve(children), 1000)
  })
}
