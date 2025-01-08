import {
  THRESHOLD_AFTER_FOLDER_PERCENT,
  THRESHOLD_BEFORE_PERCENT,
  THRESHOLD_MID_PERCENT,
} from '../constants'
import { MoveData, DropPosition, FolderNode, TreeNode, TreeNodeType } from '../types'
import { recursiveTreeMap } from './tree-recursive'

export function moveNode(data: MoveData): TreeNode[] {
  const { tree, source, target, position, prevParent, nextParent } = data

  const isDroppedInSameParent = prevParent.id === nextParent.id

  return isDroppedInSameParent
    ? handleSameParentMove({ tree, source, target, position, prevParent })
    : handleDifferentParentMove(data)
}

function handleSameParentMove({
  tree,
  source,
  target,
  position,
  prevParent,
}: Omit<MoveData, 'nextParent'>): TreeNode[] {
  const { id, children } = prevParent

  const sourceIndex = children.findIndex((child) => child.id === source.id)
  const targetIndex = children.findIndex((child) => child.id === target.id)

  if (sourceIndex === -1 || targetIndex === -1) return tree

  // adjust target index when the source node is before the target node
  const newTargetIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex

  const newPosition = position === DropPosition.Before ? newTargetIndex : newTargetIndex + 1

  const newChildren = [...children]

  // remove the source node from its current position
  newChildren.splice(sourceIndex, 1)

  // insert the source node in the new position
  newChildren.splice(newPosition, 0, source)

  return recursiveTreeMap(tree, (node) => {
    if (node.id === id) {
      return {
        ...node,
        children: newChildren,
      }
    }

    return node
  })
}

function handleDifferentParentMove({
  tree,
  source,
  target,
  position,
  prevParent,
  nextParent,
}: MoveData): TreeNode[] {
  const isDroppingInsideFolder =
    target.nodeType === TreeNodeType.Folder && position === DropPosition.Inside

  return recursiveTreeMap(tree, (node) => {
    if (node.id === prevParent.id) {
      const filteredChildren = prevParent.children.filter((child) => child.id !== source.id)

      // update children of prev parent
      return {
        ...node,
        children: filteredChildren,
      }
    }

    if (node.id === target.id && isDroppingInsideFolder) {
      const { children } = node as FolderNode

      return { ...node, children: [...children, source] }
    }

    if (node.id === nextParent.id && !isDroppingInsideFolder) {
      const { children } = nextParent
      const targetIndex = children.findIndex((child) => child.id === target.id)

      const newPosition = position === DropPosition.Before ? targetIndex : targetIndex + 1

      const newChildren = [...children]

      newChildren.splice(newPosition, 0, source)

      return {
        ...node,
        children: newChildren,
      }
    }

    return node
  })
}

export function calculateDragPosition({
  event,
  contentRect,
  isFolder,
}: {
  event: React.DragEvent
  contentRect: Pick<DOMRect, 'height' | 'top'>
  isFolder: boolean
}): DropPosition {
  const { height, top } = contentRect
  const relativeY = event.clientY - top

  if (isFolder) {
    if (relativeY < height * THRESHOLD_BEFORE_PERCENT) {
      return DropPosition.Before
    }

    if (relativeY > height * THRESHOLD_AFTER_FOLDER_PERCENT) {
      return DropPosition.After
    }

    return DropPosition.Inside
  }

  return relativeY < height * THRESHOLD_MID_PERCENT ? DropPosition.Before : DropPosition.After
}

export function parseNodeData(data: string): TreeNode | null {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Invalid JSON data:', error)
    return null
  }
}
