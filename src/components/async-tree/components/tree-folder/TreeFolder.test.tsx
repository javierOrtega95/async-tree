import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FolderNode, TreeNodeType } from '../../types'
import TreeFolder from './TreeFolder'

const mockNode: FolderNode = {
  id: crypto.randomUUID(),
  name: 'TreeFolder Test',
  nodeType: TreeNodeType.Folder,
  children: [],
}

const mockOnClick = vi.fn()

describe('TreeFolder', () => {
  it('renders the TreeFolder component successfully', () => {
    render(
      <TreeFolder
        node={mockNode}
        isOpen={false}
        isLoading={false}
        level={0}
        childrenCount={0}
        onClick={mockOnClick}
      />
    )

    const { id, name } = mockNode

    const $chevronIcon = screen.getByTestId(`${id}-chevron-icon`)
    expect($chevronIcon).toBeInTheDocument()
    expect($chevronIcon).toHaveClass('icon chevron')

    const $treeFolder = screen.getByTestId(id)
    expect($treeFolder).toBeInTheDocument()
    expect($treeFolder).toHaveAttribute('id', id)
    expect($treeFolder).toHaveClass('tree-folder')
    expect($treeFolder).toHaveTextContent(name)
  })

  it('displays a loading icon when isLoading is true', () => {
    render(
      <TreeFolder
        node={mockNode}
        isOpen={false}
        isLoading={true}
        level={0}
        childrenCount={0}
        onClick={mockOnClick}
      />
    )

    const $loadingIcon = screen.getByTestId(`${mockNode.id}-loading-icon`)
    expect($loadingIcon).toBeInTheDocument()
    expect($loadingIcon).toHaveClass('icon loading')
  })

  it('displays an open chevron icon when isOpen is true', () => {
    render(
      <TreeFolder
        node={mockNode}
        isOpen={true}
        isLoading={false}
        level={0}
        childrenCount={0}
        onClick={mockOnClick}
      />
    )

    const $chevronIcon = screen.getByTestId(`${mockNode.id}-chevron-icon`)
    expect($chevronIcon).toBeInTheDocument()
    expect($chevronIcon).toHaveClass('icon chevron open')
  })

  it('calls the onClick handler when clicked', () => {
    render(
      <TreeFolder
        node={mockNode}
        isOpen={false}
        isLoading={false}
        level={0}
        childrenCount={0}
        onClick={mockOnClick}
      />
    )

    const $treeFolder = screen.getByTestId(mockNode.id)
    fireEvent.click($treeFolder)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(mockOnClick).toHaveBeenCalledWith(mockNode)
  })
})
