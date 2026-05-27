import type { Pattern } from '../../types/pattern'
import { createSandpileRenderer } from './renderer'

export const sandpile: Pattern = {
  id: 'sandpile',
  title: 'Abelian Sandpile',
  category: 'Cellular Automata',
  blurb:
    'Bak-Tang-Wiesenfeld 1987. Drop grains; any cell with 4+ grains topples and shares one with each of its 4 neighbors. The relaxed equilibrium has measure-zero fractal structure — and it is famously *abelian*: the order of drops does not matter.',
  params: [
    {
      type: 'select',
      name: 'mode',
      label: 'mode',
      options: [
        { value: 'preload', label: 'Single huge stack' },
        { value: 'center', label: 'Continuous drop at center' },
        { value: 'rain', label: 'Random rain' },
      ],
      default: 'preload',
    },
    {
      type: 'number',
      name: 'preloadGrains',
      label: 'preload grains',
      description: 'Initial pile (preload mode only).',
      min: 1000,
      max: 200000,
      step: 1000,
      default: 100000,
    },
    {
      type: 'number',
      name: 'dropsPerStep',
      label: 'drops per step',
      min: 1,
      max: 50,
      step: 1,
      default: 5,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 1,
      max: 4,
      step: 1,
      default: 2,
    },
  ],
  createRenderer: createSandpileRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
