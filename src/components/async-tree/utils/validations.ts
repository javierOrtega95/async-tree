import {
  DropData,
  DropPosition,
  FolderNode,
  ParentMap,
  TreeNode,
  TreeNodeType,
} from '../types'

export default function isValidMove({
  source,
  target,
  position,
  prevParent,
  nextParent,
  parentMap,
}: Omit<DropData, 'tree'> & {
  parentMap: ParentMap
}): boolean {
  if (isAlreadyInsideFolder(source, target, position)) return false

  if (
    source.nodeType === TreeNodeType.Folder &&
    isMovingFolderIntoDescendant(source, target, parentMap)
  ) {
    return false
  }

  const isOrderingSameParent =
    position !== DropPosition.Inside && prevParent.id === nextParent.id

  if (
    isOrderingSameParent &&
    isSamePosition({ source, target, position, prevParent })
  ) {
    return false
  }

  return true
}

function isDescendant(
  source: TreeNode,
  target: TreeNode,
  parentMap: ParentMap
): boolean {
  let currentParent = parentMap.get(target.id)

  while (currentParent) {
    if (currentParent.id === source.id) return true

    currentParent = parentMap.get(currentParent.id)
  }

  return false
}

function isMovingFolderIntoDescendant(
  source: FolderNode,
  target: TreeNode,
  parentMap: ParentMap
): boolean {
  if (isDescendant(source, target, parentMap)) return true

  return false
}

function isAlreadyInsideFolder(
  source: TreeNode,
  target: TreeNode,
  position: DropPosition
): boolean {
  if (position === DropPosition.Inside) {
    const { children } = target as FolderNode

    if (children.some((child) => child.id === source.id)) return true
  }

  return false
}

function isSamePosition({
  source,
  target,
  position,
  prevParent,
}: Omit<DropData, 'tree' | 'nextParent'>): boolean {
  const { children } = prevParent

  const sourceIndex = children.findIndex((child) => child.id === source.id)
  const targetIndex = children.findIndex((child) => child.id === target.id)

  if (sourceIndex === -1 || targetIndex === -1) return false

  const newTargetIndex =
    targetIndex > sourceIndex ? targetIndex - 1 : targetIndex

  const newPosition =
    position === DropPosition.Before ? newTargetIndex : newTargetIndex + 1

  if (sourceIndex === newPosition) return true

  return false
}
