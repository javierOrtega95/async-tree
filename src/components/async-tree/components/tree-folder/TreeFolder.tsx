import { FolderProps } from '../../types'
import './TreeFolder.css'

export default function TreeFolder({
  node,
  isOpen,
  isLoading,
}: FolderProps): JSX.Element {
  return (
    <div className='tree-folder'>
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

      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='icon folder-icon'
      >
        <path d='M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'></path>
      </svg>

      <span className='folder-name'>{node.name}</span>
    </div>
  )
}
