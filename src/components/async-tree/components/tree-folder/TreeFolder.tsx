import { FolderProps } from '../../types'
import './TreeFolder.css'

export default function TreeFolder({
  node,
  isOpen,
  isLoading,
  onClick,
}: FolderProps): JSX.Element {
  return (
    <div
      id={node.id}
      data-testid={node.id}
      className='tree-folder'
      onClick={() => onClick(node)}
    >
      {isLoading && (
        <svg
          width='12'
          height='12'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='icon loading'
        >
          <path d='M21 12a9 9 0 1 1-6.219-8.56'></path>
        </svg>
      )}

      {!isLoading && (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`icon chevron ${isOpen ? 'open' : ''}`}
        >
          <path d='m9 18 6-6-6-6'></path>
        </svg>
      )}

      <span className='folder-name'>{node.name}</span>
    </div>
  )
}
