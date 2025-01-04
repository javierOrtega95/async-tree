import { Children, useRef, useState } from 'react'
import {
  DropPosition,
  FolderNode,
  FolderProps,
  ItemNode,
  ItemProps,
  TreeNodeProps,
  TreeNodeType,
} from '../../types'
import {
  calculateDragPosition,
  parseNodeData,
} from '../../utils/tree-operations'
import { default as DefaultFolder } from '../tree-folder/TreeFolder'
import { default as DefaultItem } from '../tree-item/TreeItem'
import './TreeNode.css'

export default function TreeNode({
  node,
  level,
  customItem,
  customFolder,
  isOpen,
  isLoading,
  children,
  onFolderClick,
  onDrop,
}: TreeNodeProps): JSX.Element {
  const [dragPosition, setDragPosition] = useState<DropPosition | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const dragCounter = useRef<number>(0)

  const isFolder = node.nodeType === TreeNodeType.Folder
  const isItem = node.nodeType === TreeNodeType.Item

  const isDroppingInside = dragPosition === DropPosition.Inside
  const isDroppingBefore = dragPosition === DropPosition.Before
  const isDroppingAfter = dragPosition === DropPosition.After

  const left = 12 * level

  const dropOverClassName = isDroppingInside ? 'drop-target drag-over' : ''

  const folderProps: FolderProps = {
    level,
    node: node as FolderNode,
    isOpen,
    isLoading,
    childrenCount: Children.count(children),
    onClick: onFolderClick,
  }

  const itemsProps: ItemProps = {
    level,
    node: node as ItemNode,
  }

  const FolderComponent = customFolder ?? DefaultFolder
  const ItemComponent = customItem ?? DefaultItem

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(node))
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current++
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    dragCounter.current--

    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setDragPosition(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer.dropEffect = 'move'

    if (!nodeRef.current) return

    const contentRect = nodeRef.current.getBoundingClientRect()
    const position = calculateDragPosition({
      event: e,
      contentRect,
      isFolder,
      isOpen,
    })

    setDragPosition(position)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current = 0

    const sourceData = e.dataTransfer.getData('application/json')
    const source = parseNodeData(sourceData)

    setDragPosition(null)

    if (!dragPosition || !source) return

    const dropData = {
      source,
      target: node,
      position: dragPosition,
    }

    onDrop(e, dropData)
  }

  return (
    <li
      id={`tree-node-${node.id}`}
      role='treeitem'
      draggable={true}
      className='tree-node'
      style={{ paddingLeft: left }}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDroppingBefore && <span className='drop-indicator' style={{ left }} />}

      <div ref={nodeRef} className={`node-content ${dropOverClassName}`}>
        {isFolder && <FolderComponent {...folderProps} />}

        {isItem && <ItemComponent {...itemsProps} />}
      </div>

      {isDroppingAfter && <span className='drop-indicator' style={{ left }} />}

      {children}
    </li>
  )
}
