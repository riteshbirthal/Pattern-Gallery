import type { Pattern } from '../../types/pattern'
import { createConwayLifeRenderer } from './renderer'

export const conwayLife: Pattern = {
  id: 'conway-life',
  title: "Conway's Game of Life",
  category: 'Cellular Automata',
  blurb:
    'The classic 1970 cellular automaton. Four simple rules — birth, survival, death — generate gliders, oscillators, and entire computer architectures.',
  params: [
    {
      type: 'select',
      name: 'preset',
      label: 'initial pattern',
      options: [
        { value: 'random', label: 'Random soup' },
        { value: 'glider-gun', label: 'Gosper glider gun' },
        { value: 'pulsar', label: 'Pulsar' },
      ],
      default: 'random',
    },
    {
      type: 'number',
      name: 'density',
      label: 'random density',
      description: 'Initial alive-cell probability (random preset only).',
      min: 0.05,
      max: 0.6,
      step: 0.01,
      default: 0.3,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      description: 'Smaller = more cells = denser play, slower.',
      min: 2,
      max: 12,
      step: 1,
      default: 4,
    },
  ],
  createRenderer: createConwayLifeRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 1,
}
