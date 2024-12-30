import { ItemProps } from '../../types'
import './TreeItem.css'

export default function TreeItem({ node }: ItemProps): JSX.Element {
  return (
    <div id={node.id} data-testid={node.id} className='tree-item'>
      <span>{node.name}</span>
    </div>
  )
}
