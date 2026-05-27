import type { Pattern } from '../../types/pattern'
import { createWireworldRenderer } from './renderer'

export const wireworld: Pattern = {
  id: 'wireworld',
  title: 'Wireworld',
  category: 'Cellular Automata',
  blurb:
    "Brian Silverman's 1987 4-state CA. Conductors carry electron heads that always become tails, then return to conductor. Turing-complete — people have built CPUs in it.",
  params: [
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 2,
      max: 12,
      step: 1,
      default: 5,
    },
    {
      type: 'select',
      name: 'preset',
      label: 'preset',
      options: [
        { value: 'diodes', label: 'Two diodes' },
        { value: 'clock', label: 'Clock loop' },
        { value: 'random', label: 'Random conductors' },
      ],
      default: 'clock',
    },
  ],
  createRenderer: createWireworldRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
