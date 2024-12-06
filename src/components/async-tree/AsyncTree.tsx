import React, { useEffect, useState } from 'react'
import { default as TreeNodeComponent } from './components/tree-node/TreeNode'
import {
  AsyncTreeProps,
  FolderNode,
  FoldersMap,
  FolderState,
  TreeNode,
  TreeNodeType,
} from './types'
import { getFoldersMap } from './utils'
import { recursiveTreeMap } from './utils/recursive'

const ROOT_NODE: FolderNode = {
  id: 'root',
  name: 'root',
  nodeType: TreeNodeType.Folder,
  children: [],
}

export default function AsyncTree({
  initialTree,
  fetchOnce = true,
  loadChildren,
}: AsyncTreeProps): JSX.Element {
  const [tree, setTree] = useState<TreeNode[]>([
    { ...ROOT_NODE, children: initialTree },
  ])

  const [foldersMap, setFoldersMap] = useState<FoldersMap>(() =>
    getFoldersMap(initialTree)
  )

  useEffect(() => {
    setTree([{ ...ROOT_NODE, children: initialTree }])
    setFoldersMap(getFoldersMap(initialTree))
  }, [initialTree])

  const updateFolderState = (
    folderId: FolderNode['id'],
    update: FolderState
  ) => {
    setFoldersMap((prevState) =>
      new Map(prevState).set(folderId, {
        ...prevState.get(folderId),
        ...update,
      })
    )
  }

  const handleFolderClose = (folderId: FolderNode['id']) => {
    updateFolderState(folderId, { isOpen: false })
  }

  function updateFolderChildren(
    tree: TreeNode[],
    folderId: TreeNode['id'],
    updatedChildren: TreeNode[]
  ): TreeNode[] {
    return recursiveTreeMap(tree, (node) => {
      if (node.id === folderId && node.nodeType === TreeNodeType.Folder) {
        return {
          ...node,
          children: updatedChildren,
        }
      }

      return node
    })
  }

  const handleFolderClick = async (folder: FolderNode) => {
    const { id } = folder
    const { isOpen = false, hasFetched = false } = foldersMap.get(id) ?? {}

    if (isOpen) return handleFolderClose(id)

    if (fetchOnce && hasFetched) return updateFolderState(id, { isOpen: true })

    try {
      updateFolderState(id, { isLoading: true })
      const children = await loadChildren(folder)

      setTree((prev) => updateFolderChildren(prev, id, children))
      updateFolderState(id, {
        isOpen: true,
        isLoading: false,
        hasFetched: true,
      })
    } catch (error) {
      console.error(`Error loading children for folder ${id}`, error)
      updateFolderState(id, { isOpen: false, isLoading: false })
    }
  }

  const renderNode = (node: TreeNode, level: number = 0) => {
    const { isOpen = false, isLoading = false } = foldersMap.get(node.id) ?? {}
    const isFolder = node.nodeType === TreeNodeType.Folder

    return (
      <React.Fragment key={node.id}>
        <TreeNodeComponent
          node={node}
          level={level}
          isOpen={isOpen}
          isLoading={isLoading}
          onFolderClick={handleFolderClick}
        />

        {isFolder &&
          isOpen &&
          node.children.map((child) => renderNode(child, level + 1))}
      </React.Fragment>
    )
  }

  return <>{(tree[0] as FolderNode).children.map((node) => renderNode(node))}</>
}
