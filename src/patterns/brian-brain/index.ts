import type { Pattern } from '../../types/pattern'
import { createBrianBrainRenderer } from './renderer'

export const brianBrain: Pattern = {
  id: 'brian-brain',
  title: "Brian's Brain",
  category: 'Cellular Automata',
  blurb:
    'Brian Silverman\'s 3-state CA. Cells are off, firing, or refractory. Born with exactly 2 firing neighbors. Most random soups produce traveling spaceships within a few seconds.',
  params: [
    {
      type: 'number',
      name: 'density',
      label: 'initial density',
      min: 0.05,
      max: 0.6,
      step: 0.01,
      default: 0.3,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size',
      min: 2,
      max: 8,
      step: 1,
      default: 3,
    },
  ],
  createRenderer: createBrianBrainRenderer,
  explainer: () => import('./Explainer'),
}
