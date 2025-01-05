import { useRef, useState } from 'react'
import { DropPosition, UseTreeNodeDragAndDropProps } from '../types'
import { calculateDragPosition, parseNodeData } from '../utils/tree-operations'

export default function useTreeNodeDnD({
  node,
  isFolder,
  isOpen,
  onDrop,
}: UseTreeNodeDragAndDropProps) {
  const [dragPosition, setDragPosition] = useState<DropPosition | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const dragCounter = useRef<number>(0)

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(node))
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

    e.dataTransfer.dropEffect = 'move'

    if (!nodeRef.current) return

    const contentRect = nodeRef.current.getBoundingClientRect()
    const position = calculateDragPosition({
      event: e,
      contentRect,
      isFolder,
      isOpen,
    })

    setDragPosition(position)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current = 0

    const sourceData = e.dataTransfer.getData('application/json')
    const source = parseNodeData(sourceData)

    if (!dragPosition || !source) return

    const dropData = {
      source,
      target: node,
      position: dragPosition,
    }

    onDrop(e, dropData)
    setDragPosition(null)
  }

  return {
    dragPosition,
    nodeRef,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  }
}
