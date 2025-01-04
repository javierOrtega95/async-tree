import React, { useEffect, useMemo, useState } from 'react'
import './AsyncTree.css'
import { default as TreeNodeComponent } from './components/tree-node/TreeNode'
import { ROOT_NODE } from './constants'
import {
  AsyncTreeProps,
  DropData,
  FolderNode,
  FoldersMap,
  FolderState,
  TreeNode,
  TreeNodeType,
} from './types'
import { moveNode } from './utils/tree-operations'
import {
  getFoldersMap,
  getParentMap,
  recursiveTreeMap,
} from './utils/tree-recursive'
import isValidMove from './utils/validations'

export default function AsyncTree({
  initialTree,
  customItem,
  customFolder,
  fetchOnce = true,
  loadChildren,
  onChange,
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

  const parentMap = useMemo(() => getParentMap(tree), [tree])

  const updateFolderState = (
    folderId: FolderNode['id'],
    folderState: FolderState
  ) => {
    setFoldersMap((prevState) => {
      const prevFolderState = prevState.get(folderId)

      const newFolderState = {
        ...prevFolderState,
        ...folderState,
      }

      return new Map(prevState).set(folderId, newFolderState)
    })
  }

  const handleFolderClose = (folderId: FolderNode['id']) => {
    updateFolderState(folderId, { isOpen: false })
  }

  const updateFolderChildren = (
    tree: TreeNode[],
    folderId: TreeNode['id'],
    updatedChildren: TreeNode[]
  ) => {
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

  const handleDrop = (
    e: React.DragEvent,
    data: Pick<DropData, 'source' | 'target' | 'position'>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const { source, target, position } = data

    if (!source || source.id === target.id) return

    const prevParent = parentMap.get(source.id)
    const nextParent = parentMap.get(target.id)

    if (!prevParent || !nextParent) return

    const dropData = {
      source,
      target,
      position,
      prevParent,
      nextParent,
    }

    if (!isValidMove({ ...dropData, parentMap })) return

    /**@todo canDrop?.(dropData) */

    setTree((prevTree) => {
      const newTree = moveNode({ tree: prevTree, ...dropData })

      const rootChildren = [...(newTree[0] as FolderNode).children]
      const changes = { tree: rootChildren, ...dropData }

      onChange?.(changes)

      return newTree
    })
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
          customItem={customItem}
          customFolder={customFolder}
          onFolderClick={handleFolderClick}
          onDrop={handleDrop}
        >
          {isFolder && isOpen && (
            <ul role='group' className='tree-group'>
              {node.children.map((child) => renderNode(child, level + 1))}
            </ul>
          )}
        </TreeNodeComponent>
      </React.Fragment>
    )
  }

  return (
    <ul role='tree' className='async-tree'>
      {(tree[0] as FolderNode).children.map((node) => renderNode(node))}
    </ul>
  )
}
