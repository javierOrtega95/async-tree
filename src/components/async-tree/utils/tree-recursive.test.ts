import { describe, expect, it } from 'vitest'
import { FolderNode, TreeNode, TreeNodeType } from '../types'
import { getFoldersMap, getParentMap, recursiveTreeMap } from './tree-recursive'

describe('tree-recursive utilities', () => {
  const mockTree: TreeNode[] = [
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
  ]

  describe('recursiveTreeMap', () => {
    it('should apply the transformation function to each node', () => {
      const mockName = 'name mapped'
      const mockTransformFn = (node: TreeNode): TreeNode => ({
        ...node,
        name: `${node.name} ${mockName}`,
      })

      const mappedTree = recursiveTreeMap(mockTree, mockTransformFn)

      const [firstNode] = mappedTree
      const [firstChild, secondChild] = (firstNode as FolderNode).children

      expect(firstNode.name).toBe(`Folder 1 ${mockName}`)
      expect(firstChild.name).toBe(`Folder 2 ${mockName}`)
      expect(secondChild.name).toBe(`Item 1 ${mockName}`)
    })
  })

  describe('getParentMap', () => {
    it('should map each node to its parent correctly', () => {
      const parentMap = getParentMap(mockTree)

      const [rootFolder] = mockTree
      const { children } = rootFolder as FolderNode

      // Assert that 'Folder1' has no parent (root node)
      const parentOfFirstNode = parentMap.get(rootFolder.id)
      expect(parentOfFirstNode).toBeNull()

      // Assert that the parent of 'Folder2' and 'Item1' is 'Folder1'
      for (const child of children) {
        const childParent = parentMap.get(child.id)
        expect(childParent).toBe(rootFolder)
      }
    })

    it('should return an empty map for an empty tree', () => {
      const emptyTree: TreeNode[] = []
      const parentMap = getParentMap(emptyTree)

      // Assert that the map is empty
      expect(parentMap.size).toBe(0)
    })
  })

  describe('getFoldersMap', () => {
    it('should return an empty map for an empty tree', () => {
      const tree: TreeNode[] = []
      const foldersMap = getFoldersMap(tree)

      expect(foldersMap.size).toBe(0)
    })

    it('should return an empty map when there are no folders', () => {
      const tree: TreeNode[] = [
        { id: 'item1', name: 'Item 1', nodeType: TreeNodeType.Item },
        { id: 'item2', name: 'Item 2', nodeType: TreeNodeType.Item },
      ]
      const foldersMap = getFoldersMap(tree)

      expect(foldersMap.size).toBe(0)
    })

    it('should map all folders with default states', () => {
      const foldersMap = getFoldersMap(mockTree)

      expect(foldersMap.size).toBe(2)

      const expectedState = {
        isOpen: false,
        isLoading: false,
        hasFetched: false,
      }

      const { id, children } = mockTree[0] as FolderNode

      const firstFolder = foldersMap.get(id)
      const secondFolder = foldersMap.get(children[0].id)

      expect(firstFolder).toEqual(expectedState)
      expect(secondFolder).toEqual(expectedState)
    })

    it('should preserve the `isOpen` value if defined in the tree', () => {
      const mockFolder = {
        id: crypto.randomUUID(),
        name: 'Folder 1',
        nodeType: TreeNodeType.Folder,
        isOpen: true,
        children: [],
      }

      const foldersMap = getFoldersMap([mockFolder])

      const expectedState = {
        isOpen: true,
        isLoading: false,
        hasFetched: false,
      }

      expect(foldersMap.size).toBe(1)
      expect(foldersMap.get(mockFolder.id)).toEqual(expectedState)
    })
  })
})
