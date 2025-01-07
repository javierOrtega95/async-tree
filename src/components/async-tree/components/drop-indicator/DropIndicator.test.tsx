import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DropIndicator from './DropIndicator'

describe('DropIndicator Component', () => {
  it('renders correctly with required props', () => {
    render(<DropIndicator id='test-id' indentation={20} />)
    const indicator = screen.getByTestId('test-id')

    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveClass('drop-indicator')
    expect(indicator).toHaveStyle('left: 20px')
    expect(indicator).toHaveAttribute('role', 'presentation')
    expect(indicator).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies additional className prop', () => {
    render(<DropIndicator id='test-class' indentation={30} className='additional-class' />)
    const indicator = screen.getByTestId('test-class')

    expect(indicator).toHaveClass('drop-indicator additional-class')
  })

  it('inherits and applies additional props', () => {
    const handleClick = vi.fn()

    render(
      <DropIndicator
        id='test-props'
        indentation={15}
        data-testid='custom-testid'
        onClick={handleClick}
      />
    )
    const indicator = screen.getByTestId('custom-testid')

    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveStyle('left: 15px')

    fireEvent.click(indicator)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders dynamic styles based on indentation prop', () => {
    render(<DropIndicator id='test-indentation' indentation={40} />)
    const indicator = screen.getByTestId('test-indentation')

    expect(indicator).toHaveStyle('left: 40px')
  })
})
