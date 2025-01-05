import { Children } from 'react'
import useTreeNodeDragAndDrop from '../../hooks/useTreeNodeDragAndDrop'
import {
  DropPosition,
  FolderNode,
  FolderProps,
  ItemNode,
  ItemProps,
  TreeNodeProps,
} from '../../types'
import { isFolderNode, isItemNode } from '../../utils/validations'
import { default as DefaultFolder } from '../tree-folder/TreeFolder'
import { default as DefaultItem } from '../tree-item/TreeItem'
import './TreeNode.css'
import { TREE_NODE_INDENTATION } from '../../constants'

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
  const isFolder = isFolderNode(node)
  const isItem = isItemNode(node)

  const {
    dragPosition,
    nodeRef,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useTreeNodeDragAndDrop({
    node,
    isFolder,
    isOpen,
    onDrop,
  })

  const isDroppingInside = dragPosition === DropPosition.Inside
  const isDroppingBefore = dragPosition === DropPosition.Before
  const isDroppingAfter = dragPosition === DropPosition.After

  const left = TREE_NODE_INDENTATION * level

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
