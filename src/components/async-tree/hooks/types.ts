import { RefObject } from 'react'
import { DropPosition } from '../types'

export type TreeNodeDnDdata = {
  dragPosition: DropPosition | null
  nodeRef: RefObject<HTMLDivElement>
  handleDragStart: (e: React.DragEvent) => void
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
}
