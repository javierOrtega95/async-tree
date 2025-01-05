import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TREE_NODE_INDENTATION } from '../../constants'
import {
  FolderNode,
  FolderProps,
  ItemNode,
  ItemProps,
  TreeNodeProps,
  TreeNodeType,
} from '../../types'
import TreeNode from './TreeNode'

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

  it('should render default folder node correctly', () => {
    const folderProps = {
      ...defaultProps,
      node: mockFolderNode,
    }

    const { node } = folderProps

    render(<TreeNode {...folderProps} />)

    const $folderNode = screen.getByTestId(`tree-node-${node.id}`)
    expect($folderNode).toBeInTheDocument()

    const folderContent = screen.getByTestId(`node-content-${node.id}`)
    expect(folderContent).toBeInTheDocument()
  })

  it('should render default item node correctly', () => {
    const itemProps = {
      ...defaultProps,
      node: mockItemNode,
    }

    const { node } = itemProps

    render(<TreeNode {...itemProps} />)

    const $itemNode = screen.getByTestId(`tree-node-${node.id}`)
    expect($itemNode).toBeInTheDocument()

    const itemContent = screen.getByTestId(`node-content-${node.id}`)
    expect(itemContent).toBeInTheDocument()
  })

  it('should render a custom folder node correctly', () => {
    const CusmtomFolder = ({ node }: FolderProps) => {
      return (
        <div data-testid={`custom-folder-content-${node.id}`}>
          Custom folder
        </div>
      )
    }

    const props: TreeNodeProps = {
      ...defaultProps,
      node: mockFolderNode,
      customFolder: CusmtomFolder,
    }

    render(<TreeNode {...props} />)

    const $customFolder = screen.getByTestId(
      `custom-folder-content-${mockFolderNode.id}`
    )
    expect($customFolder).toBeInTheDocument()
  })

  it('should render a custom item node correctly', () => {
    const CusmtomItem = ({ node }: ItemProps) => (
      <div data-testid={`custom-item-content-${node.id}`}>Custom folder</div>
    )

    const props: TreeNodeProps = {
      ...defaultProps,
      node: mockItemNode,
      customItem: CusmtomItem,
    }

    render(<TreeNode {...props} />)

    const $customItem = screen.getByTestId(
      `custom-item-content-${mockItemNode.id}`
    )
    expect($customItem).toBeInTheDocument()
  })

  it('should apply correct indentation based on level', () => {
    const props = { ...defaultProps, node: mockItemNode, level: 2 }
    const { node, level } = props

    render(<TreeNode {...props} level={level} />)

    const $folderNode = screen.getByTestId(`tree-node-${node.id}`)
    expect($folderNode).toHaveStyle(
      `padding-left: ${TREE_NODE_INDENTATION * level}px`
    )
  })

  it('should handle onFolderClick correctly', () => {
    const props = { ...defaultProps, node: mockFolderNode, level: 2 }
    const { node, onFolderClick } = props

    render(<TreeNode {...props} />)

    const $folderContent = screen.getByTestId(`node-content-${node.id}`)

    fireEvent.click($folderContent.firstChild!)

    expect(onFolderClick).toHaveBeenCalledWith(node)
  })
})
