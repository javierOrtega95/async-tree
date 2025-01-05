import { describe, expect, it } from 'vitest'
import { mockTree } from '../../../mocks/test-mocks'
import { ROOT_NODE } from '../constants'
import {
  DropPosition,
  FolderNode,
  ItemNode,
  TreeNode,
  TreeNodeType,
} from '../types'
import { getParentMap } from './tree-recursive'
import { isFolderNode, isItemNode, isValidMove } from './validations'

describe('isValidMove', () => {
  const mockParentMap = getParentMap(mockTree)

  const { children } = mockTree[0] as FolderNode
  const [rootNode] = children
  const [firstChild, secondChild] = (rootNode as FolderNode).children

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

describe('TreeNode type', () => {
  const mockFolderNode: FolderNode = {
    id: 'folder-1',
    name: 'Folder 1',
    nodeType: TreeNodeType.Folder,
    children: [],
  }

  const mockItemNode: ItemNode = {
    id: 'item-1',
    name: 'Item 1',
    nodeType: TreeNodeType.Item,
  }

  const mockUnknownNode: TreeNode = {
    id: 'unknown-1',
    name: 'Unknown Node',
    nodeType: 'unknown' as TreeNodeType.Item,
  }

  describe('isFolderNode', () => {
    it('should return true for a folder node', () => {
      expect(isFolderNode(mockFolderNode)).toBe(true)
    })

    it('should return false for an item node', () => {
      expect(isFolderNode(mockItemNode)).toBe(false)
    })

    it('should return false for an unknown node', () => {
      expect(isFolderNode(mockUnknownNode)).toBe(false)
    })
  })

  describe('isItemNode', () => {
    it('should return true for an item node', () => {
      expect(isItemNode(mockItemNode)).toBe(true)
    })

    it('should return false for a folder node', () => {
      expect(isItemNode(mockFolderNode)).toBe(false)
    })

    it('should return false for an unknown node', () => {
      expect(isItemNode(mockUnknownNode)).toBe(false)
    })
  })
})
