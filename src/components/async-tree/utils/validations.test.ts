import { describe, expect, it } from 'vitest'
import { getParentMap } from './tree-recursive'
import { DropPosition, FolderNode, TreeNode, TreeNodeType } from '../types'
import isValidMove from './validations'
import { ROOT_NODE } from '../constants'

const mockTree: TreeNode[] = [
  {
    ...ROOT_NODE,
    children: [
      {
        id: crypto.randomUUID(),
        name: 'Folder 1',
        nodeType: TreeNodeType.Folder,
        children: [
          {
            id: crypto.randomUUID(),
            name: 'Folder 2',
            nodeType: TreeNodeType.Folder,
            children: [],
          },
          {
            id: crypto.randomUUID(),
            name: 'Item 1',
            nodeType: TreeNodeType.Item,
          },
        ],
      },
    ],
  },
]

const mockParentMap = getParentMap(mockTree)

const { children } = mockTree[0] as FolderNode
const [rootNode] = children
const [firstChild, secondChild] = (rootNode as FolderNode).children

describe('isValidMove', () => {
  it('should return false if source node is already inside target folder', () => {
    const target = rootNode as FolderNode

    const result = isValidMove({
      source: secondChild,
      target: target,
      position: DropPosition.Inside,
      prevParent: target,
      nextParent: target,
      parentMap: mockParentMap,
    })

    expect(result).toBe(false)
  })

  it('should return false if moving folder into one of its descendants', () => {
    const source = rootNode as FolderNode

    const result = isValidMove({
      source,
      target: secondChild,
      position: DropPosition.Before,
      prevParent: ROOT_NODE,
      nextParent: source,
      parentMap: mockParentMap,
    })

    expect(result).toBe(false)
  })

  it("should return false if ordering is the same and position hasn't changed", () => {
    const parent = rootNode as FolderNode

    const result = isValidMove({
      source: firstChild,
      position: DropPosition.Before,
      target: secondChild,
      prevParent: parent,
      nextParent: parent,
      parentMap: mockParentMap,
    })

    expect(result).toBe(false)
  })

  it('should return true if the move is valid', () => {
    const parent = rootNode as FolderNode

    const result = isValidMove({
      source: firstChild,
      position: DropPosition.After,
      target: secondChild,
      prevParent: parent,
      nextParent: parent,
      parentMap: mockParentMap,
    })

    expect(result).toBe(true)
  })
})
