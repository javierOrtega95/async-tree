import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ItemNode, TreeNodeType } from '../../types'
import TreeItem from './TreeItem'

describe('TreeItem', () => {
  const mockNode: ItemNode = {
    id: crypto.randomUUID(),
    name: 'TreeItem Test',
    nodeType: TreeNodeType.Item,
  }

  it('renders the TreeItem component successfully', () => {
    render(<TreeItem node={mockNode} level={0} />)

    const { id, name } = mockNode
    const $treeItem = screen.getByTestId(id)

    expect($treeItem).toBeInTheDocument()
    expect($treeItem).toHaveAttribute('id', id)
    expect($treeItem).toHaveClass('tree-item')
    expect($treeItem).toHaveTextContent(name)
  })
})
