import { ItemProps } from '../../types'
import './TreeItem.css'

export default function TreeItem({ node }: ItemProps): JSX.Element {
  return (
    <div className='tree-item'>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        color='#6b7280'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='icon file-icon'
      >
        <path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'></path>
        <path d='M14 2v4a2 2 0 0 0 2 2h4'></path>
      </svg>

      <span>{node.name}</span>
    </div>
  )
}
