import React, { useEffect, useState } from 'react'
import { AsyncTreeProps, FolderNode, TreeNode, TreeNodeType } from './types'

const ROOT_NODE: FolderNode = {
  id: 'root',
  name: 'root',
  nodeType: TreeNodeType.Folder,
  children: [],
}

export default function AsyncTree({
  initialTree,
}: AsyncTreeProps): JSX.Element {
  const [tree, setTree] = useState<TreeNode[]>([
    { ...ROOT_NODE, children: initialTree },
  ])

  useEffect(() => {
    setTree([{ ...ROOT_NODE, children: initialTree }])
  }, [initialTree])

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isFolder = node.nodeType === TreeNodeType.Folder

    return (
      <React.Fragment key={node.id}>
        {isFolder &&
          node.children?.map((child) => renderNode(child, level + 1))}
      </React.Fragment>
    )
  }

  return <>{(tree[0] as FolderNode).children.map((node) => renderNode(node))}</>
}
