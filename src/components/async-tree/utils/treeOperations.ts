import { recursiveTreeMap } from '.'
import {
  DropData,
  DropPosition,
  FolderNode,
  TreeNode,
  TreeNodeType,
} from '../types'

export default function moveNode(data: DropData): TreeNode[] {
  const { tree, source, target, position, prevParent, nextParent } = data

  const isDroppingInsideFolder =
    target.nodeType === TreeNodeType.Folder && position === DropPosition.Inside

  const isDroppedInSameParent =
    prevParent.id === nextParent.id && !isDroppingInsideFolder

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
}: Omit<DropData, 'nextParent'>): TreeNode[] {
  console.log('Dropping into SAME parent')

  const { id, children } = prevParent

  const sourceIndex = children.findIndex((child) => child.id === source.id)
  const targetIndex = children.findIndex((child) => child.id === target.id)

  if (sourceIndex === -1 || targetIndex === -1) {
    console.error('Invalid source or target node index', { source, target })
    return tree
  }

  // adjust target index when the source node is before the target node
  const newTargetIndex =
    targetIndex > sourceIndex ? targetIndex - 1 : targetIndex

  const newPosition =
    position === DropPosition.Before ? newTargetIndex : newTargetIndex + 1

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
}: DropData): TreeNode[] {
  const isDroppingInsideFolder =
    target.nodeType === TreeNodeType.Folder && position === DropPosition.Inside

  return recursiveTreeMap(tree, (node) => {
    if (node.id === prevParent.id) {
      const filteredChildren = prevParent.children.filter(
        (child) => child.id !== source.id
      )

      // update children of prev parent
      return {
        ...node,
        children: filteredChildren,
      }
    }

    if (node.id === target.id && isDroppingInsideFolder) {
      console.log('INSIDE a folder')

      const { children } = node as FolderNode
      return { ...node, children: [...children, source] }
    }

    if (node.id === nextParent.id && !isDroppingInsideFolder) {
      console.log('Insert into NEW parent')

      const { children } = nextParent
      const targetIndex = children.findIndex((child) => child.id === target.id)

      const newPosition =
        position === DropPosition.Before ? targetIndex : targetIndex + 1

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
