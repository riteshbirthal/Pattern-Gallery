import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ParamControl } from '../components/ParamControl'

describe('ParamControl', () => {
  it('renders a slider for number params', () => {
    render(
      <ParamControl
        schema={{
          type: 'number',
          name: 'foo',
          label: 'Foo',
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.5,
        }}
        value={0.5}
        onChange={() => {}}
      />,
    )
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '1')
  })

  it('renders a select for select params', () => {
    render(
      <ParamControl
        schema={{
          type: 'select',
          name: 'palette',
          label: 'Palette',
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
          default: 'a',
        }}
        value="a"
        onChange={() => {}}
      />,
    )
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })
})
