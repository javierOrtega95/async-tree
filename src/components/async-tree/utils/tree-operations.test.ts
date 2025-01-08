import { afterAll, describe, expect, it, vi } from 'vitest'
import { firstChild, mockTree, parentNode, secondChild } from '../../../mocks/test-mocks'
import { THRESHOLD_BEFORE_PERCENT, THRESHOLD_MID_PERCENT } from '../constants'
import { DropPosition, FolderNode } from '../types'
import { calculateDragPosition, moveNode, parseNodeData } from './tree-operations'

describe('tree-operations utilities', () => {
  describe('moveNode', () => {
    describe('when moving nodes within the same parent', () => {
      it('should not modify the tree when source or target nodes are missing', () => {
        const source = {
          ...firstChild,
          id: 'sourceId',
        }
        const target = {
          ...secondChild,
          id: 'targetId',
        }

        const moveData = {
          tree: mockTree,
          source,
          target,
          position: DropPosition.Before,
          prevParent: parentNode,
          nextParent: parentNode,
        }

        const result = moveNode(moveData)

        expect(result).toEqual(mockTree)
      })

      it('should move source before target', () => {
        const result = moveNode({
          tree: mockTree,
          source: secondChild,
          position: DropPosition.Before,
          target: firstChild,
          prevParent: parentNode,
          nextParent: parentNode,
        })

        const { children: rootChildren } = result[0] as FolderNode
        const { children } = rootChildren[0] as FolderNode

        expect(children[0]).toEqual(secondChild)
        expect(children[1]).toEqual(firstChild)
      })

      it('should move source after target', () => {
        const result = moveNode({
          tree: mockTree,
          source: firstChild,
          position: DropPosition.After,
          target: secondChild,
          prevParent: parentNode,
          nextParent: parentNode,
        })

        const { children: rootChildren } = result[0] as FolderNode
        const { children } = rootChildren[0] as FolderNode

        expect(children[0]).toEqual(secondChild)
        expect(children[1]).toEqual(firstChild)
      })
    })

    describe('when moving nodes between different parents', () => {
      it('should move source into a folder when dropped inside', () => {
        const moveData = {
          tree: mockTree,
          source: secondChild,
          position: DropPosition.Inside,
          target: firstChild,
          prevParent: parentNode,
          nextParent: firstChild, // target is a folder
        }

        const result = moveNode(moveData)

        const { children: rootChildren } = result[0] as FolderNode

        const parentFolder = rootChildren[0] as FolderNode
        const targetFolder = parentFolder.children[0] as FolderNode

        // verify that the source has been moved inside the target folder
        expect(parentFolder.children).not.toContain(secondChild)
        expect(targetFolder.children).toEqual([secondChild])
      })

      it('should move source before a target', () => {
        const nextParent = mockTree[0] as FolderNode

        const moveData = {
          tree: mockTree,
          source: firstChild,
          position: DropPosition.Before,
          target: parentNode,
          prevParent: parentNode,
          nextParent,
        }

        const result = moveNode(moveData)
        const { children: rootChildren } = result[0] as FolderNode

        const updatedParentNode = { ...parentNode, children: [secondChild] }
        const updatedTarget = rootChildren[1] as FolderNode

        expect(rootChildren[0]).toEqual(firstChild)
        expect(updatedTarget).toEqual(updatedParentNode)
        expect(updatedTarget.children).not.toContain(firstChild)
      })

      it('should move source after a target', () => {
        const nextParent = mockTree[0] as FolderNode

        const moveData = {
          tree: mockTree,
          source: firstChild,
          position: DropPosition.After,
          target: parentNode,
          prevParent: parentNode,
          nextParent,
        }

        const result = moveNode(moveData)

        const { children: rootChildren } = result[0] as FolderNode
        const updatedParentNode = { ...parentNode, children: [secondChild] }
        const updatedTarget = rootChildren[1] as FolderNode

        expect(rootChildren[0]).toEqual(updatedParentNode)
        expect(updatedTarget).toEqual(firstChild)
        expect(updatedTarget.children).not.toContain(firstChild)
      })
    })
  })

  describe('calculateDragPosition', () => {
    const contentRect = {
      height: 100,
      top: 50,
    }

    const createDragEvent = (clientY: number): React.DragEvent => {
      return {
        clientY,
      } as React.DragEvent
    }

    describe('when node is a folder', () => {
      it('should return DropPosition.Before when dragging above the top threshold', () => {
        const event = createDragEvent(30)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: true,
        })

        expect(result).toBe(DropPosition.Before)
      })

      it('should return DropPosition.After when dragging below the bottom threshold (open folder)', () => {
        const event = createDragEvent(180)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: true,
        })

        expect(result).toBe(DropPosition.After)
      })

      it('should return DropPosition.Inside when dragging between Before and After thresholds (closed folder)', () => {
        const event = createDragEvent(120)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: true,
        })

        expect(result).toBe(DropPosition.Inside)
      })

      it('should return DropPosition.Before when dragging exactly at the top threshold', () => {
        const event = createDragEvent(contentRect.height * THRESHOLD_BEFORE_PERCENT)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: true,
        })

        expect(result).toBe(DropPosition.Before)
      })
    })

    describe('when node is an item', () => {
      it('should return DropPosition.Before when dragging above the mid threshold (not a folder)', () => {
        const event = createDragEvent(40)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: false,
        })

        expect(result).toBe(DropPosition.Before)
      })

      it('should return DropPosition.After when dragging below the mid threshold (not a folder)', () => {
        const event = createDragEvent(120)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: false,
        })

        expect(result).toBe(DropPosition.After)
      })

      it('should return DropPosition.Before when dragging exactly at the mid threshold (not a folder)', () => {
        const event = createDragEvent(contentRect.height * THRESHOLD_MID_PERCENT)
        const result = calculateDragPosition({
          event,
          contentRect,
          isFolder: false,
        })

        expect(result).toBe(DropPosition.Before)
      })
    })
  })

  describe('parseNodeData', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    afterAll(() => {
      consoleErrorSpy.mockRestore()
    })

    it('should parse valid JSON string and return TreeNode', () => {
      const validData = '{"id": 1, "name": "Node 1"}'
      const result = parseNodeData(validData)

      expect(result).toEqual({
        id: 1,
        name: 'Node 1',
      })
    })

    it('should return null for invalid JSON string', () => {
      const invalidData = '{"id": 1, "name": "Node 1"'
      const result = parseNodeData(invalidData)

      expect(result).toBeNull()
    })

    it('should return null for an empty string', () => {
      const emptyData = ''
      const result = parseNodeData(emptyData)

      expect(result).toBeNull()
    })

    it('should return null for a non-JSON string', () => {
      const nonJsonData = 'Hello, world!'
      const result = parseNodeData(nonJsonData)

      expect(result).toBeNull()
    })
  })
})
