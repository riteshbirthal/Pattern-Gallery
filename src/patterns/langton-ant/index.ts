import type { Pattern } from '../../types/pattern'
import { createLangtonAntRenderer } from './renderer'

export const langtonAnt: Pattern = {
  id: 'langton-ant',
  title: "Langton's Ant",
  category: 'Cellular Automata',
  blurb:
    "A 2D Turing machine. One ant, two rules: turn, flip, step. Chaos for 10,000 steps — then suddenly it builds a 'highway' and walks off forever.",
  params: [
    {
      type: 'select',
      name: 'rule',
      label: 'rule',
      description: 'Sequence of turns. RL = classic. RLR, LRRRRRLLR for multi-state ants.',
      options: [
        { value: 'RL', label: 'RL (classic)' },
        { value: 'RLR', label: 'RLR (filled square)' },
        { value: 'LLRR', label: 'LLRR (symmetry)' },
        { value: 'LRRRRRLLR', label: 'LRRRRRLLR (cardioid)' },
        { value: 'LLRRRLRLRLLR', label: 'LLRRRLRLRLLR (tile)' },
      ],
      default: 'RL',
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
    {
      type: 'number',
      name: 'stepsPerStep',
      label: 'ant steps / frame',
      min: 1,
      max: 5000,
      step: 50,
      default: 500,
    },
  ],
  createRenderer: createLangtonAntRenderer,
  explainer: () => import('./Explainer'),
}
