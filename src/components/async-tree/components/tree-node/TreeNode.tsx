import { FolderNode, ItemNode, TreeNodeProps, TreeNodeType } from '../../types'
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
}: TreeNodeProps): JSX.Element {
  const isFolder = node.nodeType === TreeNodeType.Folder
  const isItem = node.nodeType === TreeNodeType.Item
  const left = `${level}rem`

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
  const TreeFolder = <FolderComponent {...folderProps} />

  const ItemComponent = CustomItem ?? DefaultItem
  const TreeItem = <ItemComponent {...itemsProps} />

  return (
    <div id={node.id} className='tree-node' style={{ paddingLeft: left }}>
      {isFolder && TreeFolder}

      {isItem && TreeItem}
    </div>
  )
}
