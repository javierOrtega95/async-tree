import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DropPosition,
  TreeNodeType,
  UseTreeNodeDragAndDropProps,
} from '../types'
import { act, renderHook } from '@testing-library/react'
import useTreeNodeDnD from './useTreeNodeDnD'

describe('useTreeNodeDnD', () => {
  const mockOnDrop = vi.fn()

  const nodeMock = {
    id: crypto.randomUUID(),
    name: 'Folder 1',
    nodeType: TreeNodeType.Folder,
    children: [],
  }

  const defaultProps: UseTreeNodeDragAndDropProps = {
    node: nodeMock,
    isFolder: true,
    isOpen: false,
    onDrop: mockOnDrop,
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with null drag position', () => {
    const { result } = renderHook(() => useTreeNodeDnD(defaultProps))

    expect(result.current.dragPosition).toBeNull()
  })

  it('should handle drag start correctly', () => {
    const { result } = renderHook(() => useTreeNodeDnD(defaultProps))

    const dragEvent = {
      stopPropagation: vi.fn(),
      dataTransfer: { effectAllowed: '', setData: vi.fn() },
    } as unknown as React.DragEvent

    act(() => {
      result.current.handleDragStart(dragEvent)
    })

    expect(dragEvent.stopPropagation).toHaveBeenCalled()
    expect(dragEvent.dataTransfer.effectAllowed).toBe('move')
    expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      JSON.stringify(nodeMock)
    )
  })

  it('should increment dragCounter on drag enter', () => {
    const { result } = renderHook(() => useTreeNodeDnD(defaultProps))

    const dragEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent

    act(() => {
      result.current.handleDragEnter(dragEvent)
    })

    expect(dragEvent.stopPropagation).toHaveBeenCalled()
    expect(dragEvent.preventDefault).toHaveBeenCalled()
    expect(result.current.dragPosition).toBeNull()
  })

  it('should decrement dragCounter and reset dragPosition on drag leave', () => {
    const { result } = renderHook(() => useTreeNodeDnD(defaultProps))
    const dragEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent

    // simulate dragEnter to increment dragCounter
    act(() => {
      result.current.handleDragEnter(dragEvent)
    })

    // simulate dragLeave to descrement dragCounter
    act(() => {
      result.current.handleDragLeave(dragEvent)
    })

    expect(dragEvent.stopPropagation).toHaveBeenCalled()
    expect(dragEvent.preventDefault).toHaveBeenCalled()
    expect(result.current.dragPosition).toBeNull()
  })

  it('should set dragPosition on drag over', () => {
    const { result } = renderHook(() => useTreeNodeDnD(defaultProps))

    const dragEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { dropEffect: '' },
      clientX: 100,
      clientY: 200,
    } as unknown as React.DragEvent

    const { nodeRef } = result.current
    const $targetNode = document.createElement('div')

    Object.defineProperty(nodeRef, 'current', { value: $targetNode })

    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
    })

    vi.spyOn($targetNode, 'getBoundingClientRect').mockImplementation(
      mockGetBoundingClientRect
    )

    act(() => {
      result.current.handleDragOver(dragEvent)
    })

    expect(dragEvent.preventDefault).toHaveBeenCalled()
    expect(dragEvent.stopPropagation).toHaveBeenCalled()
    expect(result.current.dragPosition).not.toBeNull()
  })

  it('should call onDrop with correct data', () => {
    const targetMock = {
      id: crypto.randomUUID(),
      name: 'Target Folder',
      nodeType: TreeNodeType.Folder,
      children: [],
    }

    const { result } = renderHook(() =>
      useTreeNodeDnD({ ...defaultProps, node: targetMock })
    )

    const dragEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
      dataTransfer: {
        effectAllowed: '',
        setData: vi.fn(),
        getData: vi.fn().mockReturnValue(JSON.stringify(nodeMock)),
      },
    } as unknown as React.DragEvent

    const { nodeRef } = result.current
    const $targetNode = document.createElement('div')

    Object.defineProperty(nodeRef, 'current', { value: $targetNode })

    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
    })

    vi.spyOn($targetNode, 'getBoundingClientRect').mockImplementation(
      mockGetBoundingClientRect
    )

    act(() => {
      result.current.handleDragStart(dragEvent)
      result.current.handleDragOver(dragEvent)
    })

    act(() => {
      result.current.handleDrop(dragEvent)
    })

    expect(dragEvent.preventDefault).toHaveBeenCalled()
    expect(dragEvent.stopPropagation).toHaveBeenCalled()
    expect(mockOnDrop).toHaveBeenCalledWith(dragEvent, {
      source: nodeMock,
      target: targetMock,
      position: DropPosition.After,
    })
  })
})
