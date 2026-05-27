import type { Pattern } from '../../types/pattern'
import { createCyclicCARenderer } from './renderer'

export const cyclicCA: Pattern = {
  id: 'cyclic-ca',
  title: 'Cyclic CA',
  category: 'Cellular Automata',
  blurb:
    'Cells live in a cycle of states. A cell advances to its successor state if enough neighbors are already in that successor. Random noise → rotating spirals.',
  params: [
    {
      type: 'number',
      name: 'states',
      label: 'states (n)',
      min: 3,
      max: 16,
      step: 1,
      default: 14,
    },
    {
      type: 'number',
      name: 'threshold',
      label: 'threshold',
      description: "Neighbors in the successor state required to advance.",
      min: 1,
      max: 8,
      step: 1,
      default: 3,
    },
    {
      type: 'select',
      name: 'neighborhood',
      label: 'neighborhood',
      options: [
        { value: 'moore', label: 'Moore (8)' },
        { value: 'vonneumann', label: 'von Neumann (4)' },
      ],
      default: 'moore',
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
  createRenderer: createCyclicCARenderer,
  explainer: () => import('./Explainer'),
}
