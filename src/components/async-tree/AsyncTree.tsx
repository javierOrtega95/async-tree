import React, { useEffect, useMemo, useState } from 'react'
import { default as TreeNodeComponent } from './components/tree-node/TreeNode'
import {
  AsyncTreeProps,
  DropPosition,
  FolderNode,
  FoldersMap,
  FolderState,
  TreeNode,
  TreeNodeType,
} from './types'
import { getFoldersMap, getParentMap, recursiveTreeMap } from './utils'
import { isValidMove } from './utils/validations'

const ROOT_NODE: FolderNode = {
  id: 'root',
  name: 'root',
  nodeType: TreeNodeType.Folder,
  children: [],
}

export default function AsyncTree({
  initialTree,
  CustomItem,
  CustomFolder,
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

  const parentMap = useMemo(() => getParentMap(tree), [tree])

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

  const handleDragStart = (e: React.DragEvent, node: TreeNode) => {
    e.dataTransfer.setData('application/json', JSON.stringify(node))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (
    e: React.DragEvent,
    target: TreeNode,
    position: DropPosition
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const sourceData = e.dataTransfer.getData('application/json')
    const source: TreeNode = JSON.parse(sourceData)

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

    const isValid = isValidMove({ ...dropData, parentMap })

    if (!isValid) return
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
          CustomItem={CustomItem}
          CustomFolder={CustomFolder}
          onFolderClick={handleFolderClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />

        {isFolder &&
          isOpen &&
          node.children.map((child) => renderNode(child, level + 1))}
      </React.Fragment>
    )
  }

  return <>{(tree[0] as FolderNode).children.map((node) => renderNode(node))}</>
}
