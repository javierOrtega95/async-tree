import { useRef, useState } from 'react'
import {
  DropPosition,
  FolderNode,
  ItemNode,
  TreeNodeProps,
  TreeNodeType,
} from '../../types'
import { default as DefaultFolder } from '../tree-folder/TreeFolder'
import { default as DefaultItem } from '../tree-item/TreeItem'
import './TreeNode.css'

export default function TreeNode({
  node,
  level,
  CustomItem,
  CustomFolder,
  isOpen,
  isLoading,
  onFolderClick,
  onDragStart,
  onDragOver,
  onDrop,
}: TreeNodeProps): JSX.Element {
  const [dragPosition, setDragPosition] = useState<DropPosition | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const dragCounter = useRef(0)

  const isFolder = node.nodeType === TreeNodeType.Folder
  const isItem = node.nodeType === TreeNodeType.Item
  const left = `${level}rem`
  const className = `tree-node ${
    dragPosition === DropPosition.Inside ? 'drop-target drag-over' : ''
  }`

  const folderProps = {
    level,
    node: node as FolderNode,
    isOpen,
    isLoading,
    onClick: onFolderClick,
  }

  const itemsProps = {
    level,
    node: node as ItemNode,
  }

  const FolderComponent = CustomFolder ?? DefaultFolder
  const ItemComponent = CustomItem ?? DefaultItem

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, node)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()

    dragCounter.current++
  }

  const handleDragLeave = (e: React.DragEvent) => {
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

    if (!nodeRef.current) return

    const rect = nodeRef.current.getBoundingClientRect()
    const mouseY = e.clientY
    const relativeY = mouseY - rect.top

    let position: DropPosition

    if (isFolder) {
      const bottomOffset = isOpen ? 1 : 0.75

      if (relativeY < rect.height * 0.25) {
        position = DropPosition.Before
      } else if (relativeY > rect.height * bottomOffset) {
        position = DropPosition.After
      } else {
        position = DropPosition.Inside
      }
    } else {
      position =
        relativeY < rect.height * 0.5 ? DropPosition.Before : DropPosition.After
    }

    setDragPosition(position)
    onDragOver(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current = 0

    if (dragPosition) {
      onDrop(e, node, dragPosition)
    }

    setDragPosition(null)
  }

  return (
    <div
      id={node.id}
      ref={nodeRef}
      className={className}
      style={{ paddingLeft: left }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dragPosition === DropPosition.Before && (
        <div className='drop-indicator' style={{ left }} />
      )}

      {isFolder && <FolderComponent {...folderProps} />}

      {isItem && <ItemComponent {...itemsProps} />}

      {dragPosition === DropPosition.After && (
        <div className='drop-indicator' style={{ left }} />
      )}
    </div>
  )
}
