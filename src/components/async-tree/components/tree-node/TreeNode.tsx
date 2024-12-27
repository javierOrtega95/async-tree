import { Children, useRef, useState } from 'react'
import {
  THRESHOLD_AFTER_CLOSED_PERCENT,
  THRESHOLD_AFTER_OPEN_PERCENT,
  THRESHOLD_BEFORE_PERCENT,
  THRESHOLD_MID_PERCENT,
} from '../../constants'
import {
  DropPosition,
  FolderNode,
  FolderProps,
  ItemNode,
  ItemProps,
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
  children,
  onFolderClick,
  onDragStart,
  onDragOver,
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

  const FolderComponent = CustomFolder ?? DefaultFolder
  const ItemComponent = CustomItem ?? DefaultItem

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()

    onDragStart(e, node)
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

    if (!nodeRef.current) return

    const { height, top } = nodeRef.current.getBoundingClientRect()
    const relativeY = e.clientY - top

    let position: DropPosition

    if (isFolder) {
      const bottomThreshold = isOpen
        ? THRESHOLD_AFTER_OPEN_PERCENT
        : THRESHOLD_AFTER_CLOSED_PERCENT

      if (relativeY < height * THRESHOLD_BEFORE_PERCENT) {
        position = DropPosition.Before
      } else if (relativeY > height * bottomThreshold) {
        position = DropPosition.After
      } else {
        position = DropPosition.Inside
      }
    } else {
      position =
        relativeY < height * THRESHOLD_MID_PERCENT
          ? DropPosition.Before
          : DropPosition.After
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
    <li
      id={node.id}
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
