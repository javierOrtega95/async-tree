import { TreeNode, TreeNodeType } from '../types'

export function recursiveTreeMap(
  tree: TreeNode[],
  fn: (item: TreeNode) => TreeNode
): TreeNode[] {
  return tree.map((item) => {
    const newNode = fn({ ...item })

    if (newNode.nodeType === TreeNodeType.Folder && newNode.children.length) {
      newNode.children = recursiveTreeMap(newNode.children, fn)
    }

    return newNode
  })
}
