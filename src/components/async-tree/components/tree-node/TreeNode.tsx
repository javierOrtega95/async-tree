import { Children } from 'react'
import { TREE_NODE_INDENTATION } from '../../constants'
import useTreeNodeDragAndDrop from '../../hooks/useTreeNodeDnD'
import { DropPosition, TreeNodeProps } from '../../types'
import { isFolderNode, isItemNode } from '../../utils/validations'
import { default as DefaultFolder } from '../tree-folder/TreeFolder'
import { default as DefaultItem } from '../tree-item/TreeItem'
import './TreeNode.css'

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
  } = useTreeNodeDragAndDrop({ ...node, isOpen }, onDrop)

  const isFolder = isFolderNode(node)
  const isItem = isItemNode(node)

  const isDroppingInside = dragPosition === DropPosition.Inside
  const isDroppingBefore = dragPosition === DropPosition.Before
  const isDroppingAfter = dragPosition === DropPosition.After

  const left = TREE_NODE_INDENTATION * level

  const dropOverClassName = isDroppingInside ? 'drag-over' : ''

  const FolderComponent = customFolder ?? DefaultFolder
  const ItemComponent = customItem ?? DefaultItem

  return (
    <li
      id={`tree-node-${node.id}`}
      data-testid={`tree-node-${node.id}`}
      role='treeitem'
      draggable={true}
      className={`tree-node ${dropOverClassName}`}
      style={{ paddingLeft: left }}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDroppingBefore && <span className='drop-indicator' style={{ left }} />}

      <div data-testid={`node-content-${node.id}`} ref={nodeRef}>
        {isFolder && (
          <FolderComponent
            node={node}
            level={level}
            isLoading={isLoading}
            isOpen={isOpen}
            childrenCount={Children.count(children)}
            onClick={onFolderClick}
          />
        )}

        {isItem && <ItemComponent node={node} level={level} />}
      </div>

      {isDroppingAfter && <span className='drop-indicator' style={{ left }} />}

      {children}
    </li>
  )
}
