import { Children, MouseEvent } from 'react'
import { TREE_NODE_INDENTATION } from '../../constants'
import useTreeNodeDragAndDrop from '../../hooks/useTreeNodeDnD'
import { DropPosition, TreeNodeProps } from '../../types'
import { isFolderNode, isItemNode } from '../../utils/validations'
import { default as DefaultFolder } from '../tree-folder/TreeFolder'
import { default as DefaultItem } from '../tree-item/TreeItem'
import './TreeNode.css'
import DropIndicator from '../drop-indicator/DropIndicator'

export default function TreeNode({
  node,
  level,
  isOpen,
  isLoading,
  customItem,
  customFolder,
  children,
  onFolderClick,
  onDrop,
}: TreeNodeProps): JSX.Element {
  const {
    dragPosition,
    nodeRef,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useTreeNodeDragAndDrop(node, onDrop)

  const isFolder = isFolderNode(node)
  const isItem = isItemNode(node)

  const isDroppingInside = dragPosition === DropPosition.Inside
  const isDroppingBefore = dragPosition === DropPosition.Before
  const isDroppingAfter = dragPosition === DropPosition.After

  const left = TREE_NODE_INDENTATION * level

  const dropOverClassName = isDroppingInside ? 'drag-over' : ''

  const FolderComponent = customFolder ?? DefaultFolder
  const ItemComponent = customItem ?? DefaultItem

  const handleClick = (e: MouseEvent) => {
    if (!isFolder) return

    e.stopPropagation()

    onFolderClick(node)
  }

  return (
    <li
      id={`tree-node-${node.id}`}
      data-testid={`tree-node-${node.id}`}
      role='treeitem'
      ref={nodeRef}
      draggable={true}
      className={`tree-node ${dropOverClassName}`}
      style={{ paddingLeft: left }}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {isDroppingBefore && (
        <DropIndicator id={`drop-indicator-before-${node.id}`} indentation={left} />
      )}

      {isFolder && (
        <FolderComponent
          node={node}
          level={level}
          isLoading={isLoading}
          isOpen={isOpen}
          childrenCount={Children.count(children)}
        />
      )}

      {isItem && <ItemComponent node={node} level={level} />}

      {isDroppingAfter && (
        <DropIndicator id={`drop-indicator-after-${node.id}`} indentation={left} />
      )}

      {children}
    </li>
  )
}
