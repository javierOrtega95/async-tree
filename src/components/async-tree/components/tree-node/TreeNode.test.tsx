import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TREE_NODE_INDENTATION } from '../../constants'
import { TreeNodeDnDdata } from '../../hooks/types'
import {
  DropPosition,
  FolderNode,
  FolderProps,
  ItemNode,
  ItemProps,
  TreeNodeProps,
  TreeNodeType,
} from '../../types'
import TreeNode from './TreeNode'

const mockHandleDragStart = vi.fn()
const mockHandleDragEnter = vi.fn()
const mockHandleDragLeave = vi.fn()
const mockHandleDragOver = vi.fn()
const mockHandleDrop = vi.fn()

const defaultTreeNodeDnDdata: TreeNodeDnDdata = {
  handleDragStart: mockHandleDragStart,
  handleDragLeave: mockHandleDragLeave,
  handleDragOver: mockHandleDragOver,
  handleDragEnter: mockHandleDragEnter,
  handleDrop: mockHandleDrop,
  dragPosition: null,
  nodeRef: { current: null },
}

vi.mock('../../hooks/useTreeNodeDnD', () => ({
  default: () => defaultTreeNodeDnDdata,
}))

describe('TreeNode Component', () => {
  const mockFolderNode: FolderNode = {
    id: crypto.randomUUID(),
    name: 'Test Folder',
    nodeType: TreeNodeType.Folder,
    children: [],
  }

  const mockItemNode: ItemNode = {
    id: crypto.randomUUID(),
    name: 'Test Folder',
    nodeType: TreeNodeType.Item,
  }

  const defaultProps: Omit<TreeNodeProps, 'node'> = {
    level: 0,
    customItem: undefined,
    customFolder: undefined,
    isOpen: false,
    isLoading: false,
    onFolderClick: vi.fn(),
    onDrop: vi.fn(),
  }

  it('should render a tree node correctly', () => {
    const folderProps = {
      ...defaultProps,
      node: mockFolderNode,
    }

    const { node } = folderProps
    const id = `tree-node-${node.id}`

    render(<TreeNode {...folderProps} />)

    const $treeNode = screen.getByTestId(id)
    expect($treeNode).toBeInTheDocument()
    expect($treeNode).toHaveRole('treeitem')
    expect($treeNode).toHaveAttribute('id', id)
    expect($treeNode).toHaveAttribute('draggable', 'true')
    expect($treeNode).toHaveClass('tree-node')
    expect($treeNode).toHaveStyle(`padding-left: ${TREE_NODE_INDENTATION * defaultProps.level}px`)
  })

  it('should render default folder content correctly', () => {
    const folderProps = {
      ...defaultProps,
      node: mockFolderNode,
    }

    render(<TreeNode {...folderProps} />)

    const $folderContent = screen.getByTestId(`node-content-${mockFolderNode.id}`)
    expect($folderContent).toBeInTheDocument()
  })

  it('should render default item content correctly', () => {
    const itemProps = {
      ...defaultProps,
      node: mockItemNode,
    }

    render(<TreeNode {...itemProps} />)

    const $itemContent = screen.getByTestId(`node-content-${mockItemNode.id}`)
    expect($itemContent).toBeInTheDocument()
  })

  it('should render a custom folder content correctly', () => {
    const CusmtomFolder = ({ node }: FolderProps) => {
      return <div data-testid={`custom-folder-content-${node.id}`}>Custom folder</div>
    }

    const props: TreeNodeProps = {
      ...defaultProps,
      node: mockFolderNode,
      customFolder: CusmtomFolder,
    }

    render(<TreeNode {...props} />)

    const $customFolder = screen.getByTestId(`custom-folder-content-${mockFolderNode.id}`)
    expect($customFolder).toBeInTheDocument()
  })

  it('should render a custom item content correctly', () => {
    const CusmtomItem = ({ node }: ItemProps) => (
      <div data-testid={`custom-item-content-${node.id}`}>Custom folder</div>
    )

    const props: TreeNodeProps = {
      ...defaultProps,
      node: mockItemNode,
      customItem: CusmtomItem,
    }

    render(<TreeNode {...props} />)

    const $customItem = screen.getByTestId(`custom-item-content-${mockItemNode.id}`)
    expect($customItem).toBeInTheDocument()
  })

  it('should apply correct indentation based on level', () => {
    const props = { ...defaultProps, node: mockItemNode, level: 2 }
    const { node, level } = props

    render(<TreeNode {...props} level={level} />)

    const $folderNode = screen.getByTestId(`tree-node-${node.id}`)
    expect($folderNode).toHaveStyle(`padding-left: ${TREE_NODE_INDENTATION * level}px`)
  })

  it('should handle onFolderClick correctly', async () => {
    const user = userEvent.setup()

    const props = { ...defaultProps, node: mockFolderNode, level: 2 }
    const { node, onFolderClick } = props

    render(<TreeNode {...props} />)

    const $folderContent = screen.getByTestId(`node-content-${node.id}`)

    await user.click($folderContent.firstChild! as Element)

    expect(onFolderClick).toHaveBeenCalledWith(node)
  })

  describe('TreeNode drag and drop', () => {
    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should call handleDragStart when dragging starts', () => {
      const props = { ...defaultProps, node: mockFolderNode }
      render(<TreeNode {...props} />)

      const $treeNode = screen.getByTestId(`tree-node-${mockFolderNode.id}`)

      fireEvent.dragStart($treeNode)

      expect(mockHandleDragStart).toHaveBeenCalled()
    })

    it('should call handleDragLeave when dragging leaves the node', () => {
      const props = { ...defaultProps, node: mockFolderNode }
      render(<TreeNode {...props} />)

      const $treeNode = screen.getByTestId(`tree-node-${mockFolderNode.id}`)

      fireEvent.dragLeave($treeNode)

      expect(mockHandleDragLeave).toHaveBeenCalled()
    })

    it('should apply drag-over class when dragging over a folder', () => {
      defaultTreeNodeDnDdata.dragPosition = DropPosition.Inside

      const props = { ...defaultProps, node: mockFolderNode }
      render(<TreeNode {...props} />)

      const $treeNode = screen.getByTestId(`tree-node-${mockFolderNode.id}`)

      fireEvent.dragOver($treeNode)

      expect($treeNode).toHaveClass('tree-node drag-over')
      expect(mockHandleDragOver).toHaveBeenCalled()
    })

    it('should call handleDrop when a node is dropped', async () => {
      const props = { ...defaultProps, node: mockFolderNode }
      render(<TreeNode {...props} />)

      const $treeNode = screen.getByTestId(`tree-node-${mockFolderNode.id}`)

      fireEvent.drop($treeNode)

      expect(mockHandleDrop).toHaveBeenCalled()
    })

    it('should display a drop indicator before the tree node', () => {
      defaultTreeNodeDnDdata.dragPosition = DropPosition.Before

      const props = { ...defaultProps, node: mockFolderNode }
      render(<TreeNode {...props} />)

      const $dropIndicator = screen.getByTestId(
        `drop-indicator-${DropPosition.Before}-${mockFolderNode.id}`
      )

      expect($dropIndicator).toBeInTheDocument()
    })

    it('should display a drop indicator after the tree node', () => {
      defaultTreeNodeDnDdata.dragPosition = DropPosition.After

      const props = { ...defaultProps, node: mockFolderNode }
      render(<TreeNode {...props} />)

      const $dropIndicator = screen.getByTestId(
        `drop-indicator-${DropPosition.After}-${mockFolderNode.id}`
      )

      expect($dropIndicator).toBeInTheDocument()
    })
  })
})
